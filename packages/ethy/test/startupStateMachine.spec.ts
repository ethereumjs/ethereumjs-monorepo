import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createFlatStateManager } from '@ethereumjs/statemanager'
import { accountToBinaryAccount, createAccount } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEthySandbox } from '../src/evm/sandbox.ts'
import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { startPeerCoordinator } from '../src/net/peerCoordinator.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { RpcBlockWindowStore } from '../src/rpc/blockWindowStore.ts'
import { dispatchRpcMethod } from '../src/rpc/methods.ts'
import { createSnapBuckets } from '../src/spine/buckets.ts'
import { hasObservedNetworkHead, isNodeAtChainHead } from '../src/spine/chainHead.ts'
import { createSpine, deriveCapabilities, setPhase } from '../src/spine/createSpine.ts'
import {
  BalChainStreamer,
  LAPTOP_WAKE_BLOCK_GAP,
  growBalCatchUpTarget,
  seedBalCatchUp,
} from '../src/sync/balSync.ts'
import { MAX_BAL_BRIDGE_BLOCKS, SNAP_RESUME_MAX_GAP } from '../src/sync/resumePolicy.ts'
import {
  classifyHydratedDiskState,
  classifySavedDiskState,
  planNetworkHeadResume,
  planPostHydration,
  resolveLiveNetworkHead,
  shouldReenterBalCatchUp,
} from '../src/sync/startupStateMachine.ts'
import { stripAnsi } from '../src/tui/ansi.ts'
import { capabilityBarClockLabel, isRpcReady } from '../src/tui/headerClock.ts'
import { createInitialViewState } from '../src/tui/prompt.ts'
import { renderFrame } from '../src/tui/renderFrame.ts'

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-startup-sm-'))
}

function seedSavedStore(opts: {
  dir: string
  pivotBlock: bigint
  baseSyncComplete: boolean
  lastVerified?: bigint
}): SnapPivotStore {
  const store = SnapPivotStore.open({
    dataDir: opts.dir,
    network: 'sepolia',
    chainId: 11155111n,
    genesisHash: networkGenesisHash('sepolia'),
    enabled: true,
  })
  const root = new Uint8Array(32)
  root[31] = 0x77
  store.activatePivot({
    blockNumber: opts.pivotBlock,
    blockHash: new Uint8Array(32).fill(0x11),
    stateRoot: root,
  })
  const hash = new Uint8Array(32)
  hash[0] = 0x01
  const binary = accountToBinaryAccount(createAccount({ nonce: 1n, balance: 10n }))
  const buckets = createSnapBuckets()
  for (const b of buckets) {
    if (opts.baseSyncComplete) {
      b.status = 'done'
      b.subRanges = []
      b.currentLastHash = new Uint8Array(b.limitHash)
    }
  }
  buckets[0]!.accountsLoaded = 1
  store.appendVerifiedRange(0, [{ accountHash: hash, binaryAccount: binary }], buckets)
  if (opts.baseSyncComplete) {
    store.persistEthyBucketsBitmask(0xffff)
    store.markBaseSyncComplete(opts.lastVerified ?? opts.pivotBlock)
    if (opts.lastVerified !== undefined) {
      store.noteVerifiedBlock(opts.lastVerified)
    }
  }
  return store
}

describe('[Ethy/Startup]: exhaustive startup & resume state machine', () => {
  it('classifySavedDiskState & classifyHydratedDiskState distinguish cold, partial-accounts, partial-contracts, and base-complete', () => {
    assert.equal(classifySavedDiskState(undefined, false), 'cold')
    assert.equal(
      classifySavedDiskState(
        { pivotBlockNumber: 100n, baseSyncComplete: true, bucketsDoneCount: 16 },
        true,
      ),
      'cold',
    )
    assert.equal(
      classifySavedDiskState(
        { pivotBlockNumber: 100n, baseSyncComplete: false, bucketsDoneCount: 7 },
        false,
      ),
      'partial-accounts',
    )
    // Critical regression: 16/16 buckets done with baseSyncComplete=false MUST NOT be base-complete!
    assert.equal(
      classifySavedDiskState(
        { pivotBlockNumber: 100n, baseSyncComplete: false, bucketsDoneCount: 16 },
        false,
      ),
      'partial-contracts',
    )
    assert.equal(
      classifySavedDiskState(
        { pivotBlockNumber: 100n, baseSyncComplete: true, bucketsDoneCount: 16 },
        false,
      ),
      'base-complete',
    )

    const allDoneBuckets = createSnapBuckets()
    for (const b of allDoneBuckets) b.status = 'done'
    assert.equal(
      classifyHydratedDiskState(
        { pivotBlockNumber: 100n, baseSyncComplete: false, bucketsDoneCount: 16 },
        allDoneBuckets,
      ),
      'partial-contracts',
    )
    assert.equal(
      classifyHydratedDiskState(
        { pivotBlockNumber: 100n, baseSyncComplete: true, bucketsDoneCount: 16 },
        allDoneBuckets,
      ),
      'base-complete',
    )
  })

  it('resolveLiveNetworkHead ignores 0n/undefined and picks highest strictly network-observed head', () => {
    assert.equal(
      resolveLiveNetworkHead({
        bestPeerHead: undefined,
        clOptimisticBlockNumber: 0n,
        pendingResumeHead: 0n,
        peerLatestBlocks: [undefined, 0n],
        ethyLatestBlocks: [undefined, 0n],
      }),
      undefined,
    )
    assert.equal(
      resolveLiveNetworkHead({
        bestPeerHead: 12_170_000n,
        clOptimisticBlockNumber: 12_174_007n,
        peerLatestBlocks: [12_173_500n],
        ethyLatestBlocks: [12_171_000n],
      }),
      12_174_007n,
    )
  })

  it('planPostHydration ALWAYS stays in P2P_WARMUP until a live network head is known', () => {
    for (const kind of [
      'cold',
      'partial-accounts',
      'partial-contracts',
      'base-complete',
    ] as const) {
      const noHead = planPostHydration({ kind, liveNetworkHead: undefined })
      assert.equal(noHead.phase, 'P2P_WARMUP')
      assert.equal(noHead.handoffCatchup, kind === 'base-complete')
      assert.equal(noHead.readyForHeadTransition, false)

      const withHead = planPostHydration({ kind, liveNetworkHead: 12_174_007n })
      assert.equal(withHead.phase, 'P2P_WARMUP')
      assert.equal(withHead.readyForHeadTransition, true)
    }
  })

  it('planNetworkHeadResume covers every disk-kind × head-gap combination', () => {
    // S0: cold
    assert.deepEqual(
      planNetworkHeadResume({
        kind: 'cold',
        localVerifiedBlock: undefined,
        pivotBlock: undefined,
        bucketsDoneCount: 0,
        liveHead: 12_174_007n,
        ethyBalTail: false,
      }),
      { action: 'anchor-fresh' },
    )

    // S8: base-complete at head (0-block gap) -> enter-head-following
    assert.deepEqual(
      planNetworkHeadResume({
        kind: 'base-complete',
        localVerifiedBlock: 12_168_598n,
        pivotBlock: 12_097_069n,
        bucketsDoneCount: 16,
        liveHead: 12_168_598n,
        ethyBalTail: false,
      }),
      { action: 'enter-head-following', targetHead: 12_168_598n },
    )

    // S9: base-complete 1-2 days behind (node1 screenshot case: 12,168,598 vs 12,174,007) -> enter-bal-catchup
    assert.deepEqual(
      planNetworkHeadResume({
        kind: 'base-complete',
        localVerifiedBlock: 12_168_598n,
        pivotBlock: 12_097_069n,
        bucketsDoneCount: 16,
        liveHead: 12_174_007n,
        ethyBalTail: false,
      }),
      {
        action: 'enter-bal-catchup',
        fromBlock: 12_168_599n,
        targetHead: 12_174_007n,
        gap: 5_409n,
      },
    )

    // S2: partial-accounts within 90 blocks -> resume-snap
    const s2 = planNetworkHeadResume({
      kind: 'partial-accounts',
      localVerifiedBlock: 12_000_000n,
      pivotBlock: 12_000_000n,
      bucketsDoneCount: 8,
      liveHead: 12_000_000n + SNAP_RESUME_MAX_GAP,
      ethyBalTail: false,
    })
    assert.equal(s2.action, 'resume-snap')

    // S3: partial-accounts 91..900 blocks -> bridge-pivot
    const s3 = planNetworkHeadResume({
      kind: 'partial-accounts',
      localVerifiedBlock: 12_000_000n,
      pivotBlock: 12_000_000n,
      bucketsDoneCount: 8,
      liveHead: 12_000_000n + SNAP_RESUME_MAX_GAP + 50n,
      ethyBalTail: false,
    })
    assert.equal(s3.action, 'bridge-pivot')

    // S4: partial-accounts > 900 blocks without ETHY tail -> reset-stale
    const s4 = planNetworkHeadResume({
      kind: 'partial-accounts',
      localVerifiedBlock: 12_000_000n,
      pivotBlock: 12_000_000n,
      bucketsDoneCount: 8,
      liveHead: 12_000_000n + MAX_BAL_BRIDGE_BLOCKS + 1n,
      ethyBalTail: false,
    })
    assert.equal(s4.action, 'reset-stale')

    // S4b: partial-accounts > 900 blocks WITH ETHY BAL tail -> bridge-pivot
    const s4b = planNetworkHeadResume({
      kind: 'partial-accounts',
      localVerifiedBlock: 12_000_000n,
      pivotBlock: 12_000_000n,
      bucketsDoneCount: 8,
      liveHead: 12_000_000n + 2_000n,
      ethyBalTail: true,
    })
    assert.equal(s4b.action, 'bridge-pivot')

    // S5: partial-contracts (16/16 buckets, baseSyncComplete=false) -> resume-snap to finish code/storage!
    const s5 = planNetworkHeadResume({
      kind: 'partial-contracts',
      localVerifiedBlock: 12_000_000n,
      pivotBlock: 12_000_000n,
      bucketsDoneCount: 16,
      liveHead: 12_000_020n,
      ethyBalTail: false,
    })
    assert.equal(s5.action, 'resume-snap')
    if (s5.action === 'resume-snap') {
      assert.isTrue(s5.drainContracts)
    }

    // S7: partial-contracts expired (> 900 blocks, no ETHY tail) -> reset-stale
    const s7 = planNetworkHeadResume({
      kind: 'partial-contracts',
      localVerifiedBlock: 12_000_000n,
      pivotBlock: 12_000_000n,
      bucketsDoneCount: 16,
      liveHead: 12_000_000n + MAX_BAL_BRIDGE_BLOCKS + 100n,
      ethyBalTail: false,
    })
    assert.equal(s7.action, 'reset-stale')
  })

  it('shouldReenterBalCatchUp detects laptop wake and lagging first peer', () => {
    assert.isFalse(
      shouldReenterBalCatchUp({
        phase: 'HEAD_FOLLOWING',
        localVerifiedBlock: 1000n,
        liveHead: 1000n + LAPTOP_WAKE_BLOCK_GAP,
        wakeGapBlocks: LAPTOP_WAKE_BLOCK_GAP,
      }),
    )
    assert.isTrue(
      shouldReenterBalCatchUp({
        phase: 'HEAD_FOLLOWING',
        localVerifiedBlock: 1000n,
        liveHead: 1000n + LAPTOP_WAKE_BLOCK_GAP + 1n,
        wakeGapBlocks: LAPTOP_WAKE_BLOCK_GAP,
      }),
    )
    assert.isFalse(
      shouldReenterBalCatchUp({
        phase: 'P2P_WARMUP',
        localVerifiedBlock: 1000n,
        liveHead: 5000n,
        wakeGapBlocks: LAPTOP_WAKE_BLOCK_GAP,
      }),
    )
  })

  it('isNodeAtChainHead, isRpcReady, and eth_syncing refuse to claim synced without an observed network head', async () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.diskResumeKind = 'base-complete'
    spine.diskHydrated = true
    spine.pivotBlockNumber = 12_097_069n
    spine.lastVerifiedBlockNumber = 12_168_598n
    spine.headBlockNumber = 12_168_598n
    spine.totalAccountsSynced = 161_610_793
    spine.codesSynced = 713_700
    spine.rpc = {
      enabled: true,
      listening: true,
      host: '127.0.0.1',
      port: 8545,
      url: 'http://127.0.0.1:8545',
      totalRequests: 0,
      totalErrors: 0,
      methodStats: {},
      recentCalls: [],
    }
    setPhase(spine, 'P2P_WARMUP')

    assert.isFalse(hasObservedNetworkHead(spine))
    assert.isFalse(isNodeAtChainHead(spine))
    assert.isFalse(isRpcReady(spine))
    assert.equal(spine.capabilities.state.status, 'partial')

    // Even if phase were forced to HEAD_FOLLOWING with no network head, isNodeAtChainHead MUST stay false
    setPhase(spine, 'HEAD_FOLLOWING')
    assert.isFalse(isNodeAtChainHead(spine))

    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const sm = createFlatStateManager()
    const blockWindow = new RpcBlockWindowStore(chain, hardfork)
    const sandbox = createEthySandbox({
      spine,
      stateManager: sm,
      chain,
      hardfork,
      blockWindow,
    })
    const syncRes = await dispatchRpcMethod(
      {
        spine,
        stateManager: sm,
        chain,
        hardfork,
        demo: false,
        blockWindow,
        sandbox,
      },
      'eth_syncing',
      [],
    )
    assert.notEqual(syncRes.result, false)

    // Header bar must dim Block and JSON-RPC until network head is observed
    setPhase(spine, 'P2P_WARMUP')
    const header = capabilityBarClockLabel(spine)
    assert.include(header, '\x1b[2mBlock 12,168,598')
    assert.include(header, '\x1b[2mJSON-RPC')

    // seedBalCatchUp(spine, 0n) must be a no-op
    seedBalCatchUp(spine, 0n)
    assert.equal(spine.phase, 'P2P_WARMUP')

    // Once real network head arrives (+5,409 blocks), BAL_CATCHUP starts and grows monotonically
    spine.bestPeerHead = 12_174_007n
    seedBalCatchUp(spine, 12_174_007n)
    assert.equal(spine.phase, 'BAL_CATCHUP')
    assert.equal(spine.balCatchUp?.fromBlock, 12_168_599n)
    assert.equal(spine.balCatchUp?.total, 5_409)
    growBalCatchUpTarget(spine, 12_174_020n)
    assert.equal(spine.balCatchUp?.total, 5_422)
  })

  it('BalChainStreamer.restoreBuffered does not poison spine.bestPeerHead with disk blocks', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotBlockNumber = 12_000_000n
    const chain = chainConfigForNetwork('sepolia')
    const streamer = new BalChainStreamer({
      spine,
      stateManager: createFlatStateManager(),
      chain,
      hardfork: activeHardfork(chain),
      getClient: () => {
        throw new Error('no network')
      },
      sendEthMessage: () => {},
      pickEthPeer: () => undefined,
      putServableBlock: () => {},
    })
    streamer.restoreBuffered([
      {
        blockNumber: 12_000_001n,
        blockHash: new Uint8Array(32),
        stateRoot: new Uint8Array(32),
        headerRlp: new Uint8Array([0x80]),
      },
    ])
    assert.isUndefined(spine.bestPeerHead)
    assert.equal(spine.bufferedBalCount, 1)
  })

  it('TUI cockpit renders honest non-live state across all P2P_WARMUP startup modes', () => {
    const view = createInitialViewState()

    // 1. Hydrating disk state
    const hydrating = createSpine('sepolia', 11155111n)
    hydrating.diskResumeKind = 'base-complete'
    hydrating.diskResumeBlock = 12_168_598n
    hydrating.diskHydrated = false
    setPhase(hydrating, 'P2P_WARMUP')
    const hydratingText = stripAnsi(renderFrame(hydrating, view, 160, 30).join('\n'))
    assert.include(hydratingText, 'Loading Disk State')
    assert.include(hydratingText, '#12,168,598')
    assert.notInclude(hydratingText, 'Head Following')
    assert.notInclude(hydratingText, '100% (synced)')

    // 2. Hydrated base-complete with 0 peers (exact node1 screenshot scenario)
    const resuming = createSpine('sepolia', 11155111n)
    resuming.diskResumeKind = 'base-complete'
    resuming.diskHydrated = true
    resuming.lastVerifiedBlockNumber = 12_168_598n
    resuming.headBlockNumber = 12_168_598n
    resuming.totalAccountsSynced = 161_610_793
    resuming.codesSynced = 713_700
    setPhase(resuming, 'P2P_WARMUP')
    const resumingText = stripAnsi(renderFrame(resuming, view, 160, 30).join('\n'))
    assert.include(resumingText, 'Connecting · Resuming')
    assert.include(resumingText, 'Local #12,168,598 · awaiting head…')
    assert.include(resumingText, 'Awaiting network head…')
    assert.include(resumingText, '161.6M acc · 713.7k code · saved')
    assert.notInclude(resumingText, 'Head Following')
    assert.notInclude(resumingText, '100% (synced)')
    assert.notInclude(resumingText, '● State')

    // 3. Hydrated partial snap awaiting peer head
    const partial = createSpine('sepolia', 11155111n)
    partial.diskResumeKind = 'partial-accounts'
    partial.diskHydrated = true
    partial.pivotBlockNumber = 12_097_069n
    partial.totalAccountsSynced = 50_000_000
    partial.snapBuckets[0]!.status = 'done'
    setPhase(partial, 'P2P_WARMUP')
    const partialText = stripAnsi(renderFrame(partial, view, 160, 30).join('\n'))
    assert.include(partialText, 'Connecting · Snap Resume')
    assert.include(partialText, 'Saved #12,097,069 · awaiting head…')
    assert.include(partialText, '(paused)')
    assert.notInclude(partialText, 'Head Following')

    // 4. Cold fresh start
    const cold = createSpine('sepolia', 11155111n)
    cold.diskResumeKind = 'cold'
    cold.diskHydrated = true
    setPhase(cold, 'P2P_WARMUP')
    deriveCapabilities(cold)
    const coldText = stripAnsi(renderFrame(cold, view, 160, 30).join('\n'))
    assert.include(coldText, 'Connecting P2P')
    assert.include(coldText, 'Awaiting peer head…')
    assert.include(coldText, 'Warming peer book')
  })

  it('startPeerCoordinator keeps stale base-complete disk state in P2P_WARMUP until a live network head arrives, then enters BAL_CATCHUP or HEAD_FOLLOWING honestly', async () => {
    // Case A: Saved at #12,168,598, live head is #12,174,007 (+5,409 blocks behind!)
    const dirA = tempDir()
    const storeA = seedSavedStore({
      dir: dirA,
      pivotBlock: 12_097_069n,
      baseSyncComplete: true,
      lastVerified: 12_168_598n,
    })
    const spineA = createSpine('sepolia', 11155111n)
    const handleA = await startPeerCoordinator({
      spine: spineA,
      stateManager: createFlatStateManager(),
      network: 'sepolia',
      inProcess: true,
      shouldFindNeighbours: false,
      snapStore: storeA,
      dataDir: dirA,
    })
    try {
      const deadline = Date.now() + 3_000
      while (spineA.diskHydrated !== true && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 10))
      }
      assert.isTrue(spineA.diskHydrated)
      assert.equal(spineA.diskResumeKind, 'base-complete')
      // MUST NOT claim HEAD_FOLLOWING with 0 peers and no network head!
      assert.equal(spineA.phase, 'P2P_WARMUP')
      assert.isUndefined(spineA.bestPeerHead)
      assert.isFalse(isNodeAtChainHead(spineA))
      assert.equal(spineA.capabilities.state.status, 'partial')

      // Live network head arrives 5,409 blocks ahead -> transitions cleanly into BAL_CATCHUP!
      handleA.noteChainHead(12_174_007n)
      assert.equal(spineA.phase, 'BAL_CATCHUP')
      assert.equal(spineA.bestPeerHead, 12_174_007n)
      assert.equal(spineA.balCatchUp?.fromBlock, 12_168_599n)
      assert.equal(spineA.balCatchUp?.total, 5_409)
      assert.isFalse(isNodeAtChainHead(spineA))
    } finally {
      handleA.stop()
    }

    // Case B: Saved at #12,168,598, live head is ALSO #12,168,598 (0 blocks behind) -> enters HEAD_FOLLOWING!
    const dirB = tempDir()
    const storeB = seedSavedStore({
      dir: dirB,
      pivotBlock: 12_097_069n,
      baseSyncComplete: true,
      lastVerified: 12_168_598n,
    })
    const spineB = createSpine('sepolia', 11155111n)
    const handleB = await startPeerCoordinator({
      spine: spineB,
      stateManager: createFlatStateManager(),
      network: 'sepolia',
      inProcess: true,
      shouldFindNeighbours: false,
      snapStore: storeB,
      dataDir: dirB,
    })
    try {
      const deadline = Date.now() + 3_000
      while (spineB.diskHydrated !== true && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 10))
      }
      assert.equal(spineB.phase, 'P2P_WARMUP')
      handleB.noteChainHead(12_168_598n)
      assert.equal(spineB.phase, 'HEAD_FOLLOWING')
      assert.isTrue(isNodeAtChainHead(spineB))
      assert.equal(spineB.capabilities.state.status, 'ready')
    } finally {
      handleB.stop()
    }
  })
})
