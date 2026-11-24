import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'
import { assert, describe, it } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { readBalTailBundle } from '../src/persist/balTailArchive.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import {
  MIN_FREE_BYTES,
  evaluateShadowRefreshEligibility,
  requiredShadowFreeBytes,
} from '../src/sync/shadowRefresh.ts'
import {
  type GenerationElectionHandle,
  ensureGenerationElectionArmed,
  refreshSpineSwarmTelemetry,
} from '../src/sync/swarmRuntime.ts'

describe('[Ethy/Sync]: swarmRuntime election lock, telemetry & shadow store', () => {
  it('ensureGenerationElectionArmed locks the initial deadline instead of sliding it forward', () => {
    const initial: GenerationElectionHandle = {
      generationBlock: 2048n,
      deadlineMs: 130_000,
    }
    const laterTick: GenerationElectionHandle = {
      generationBlock: 2048n,
      deadlineMs: 131_000,
    }
    const kept = ensureGenerationElectionArmed(initial, laterTick)
    assert.equal(kept?.deadlineMs, 130_000)

    const nextGen: GenerationElectionHandle = {
      generationBlock: 3072n,
      deadlineMs: 250_000,
    }
    const rolled = ensureGenerationElectionArmed(initial, nextGen)
    assert.equal(rolled?.generationBlock, 3072n)
    assert.equal(rolled?.deadlineMs, 250_000)
  })

  it('refreshSpineSwarmTelemetry respects injected nowMs, filters gapped seeders, and sets non-future targetBlock', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.phase = 'HEAD_FOLLOWING'
    spine.pivotBlockNumber = 1024n
    spine.bestPeerHead = 2600n

    const gappedPeer: WorkerPeerSnapshot = {
      id: 'aa'.repeat(32),
      clientId: 'ethy/test',
      caps: ['ethy/0'],
      ethySession: true,
      ethyStatus: {
        basePivotBlock: '2048',
        basePivotStateRoot: '11'.repeat(32),
        bucketsBitmask: '0xffff',
        // Gap: balEarliestBlock > basePivotBlock + 1
        balEarliestBlock: '2100',
        balLatestBlock: '2600',
        latestBlockHash: '22'.repeat(32),
      },
    }

    const handle: GenerationElectionHandle = {
      generationBlock: 2048n,
      deadlineMs: 100_000,
    }

    // Before deadline: gapped peer is rejected, so mode must wait on election (not ethy-shadow)
    refreshSpineSwarmTelemetry({
      spine,
      shadowRefreshEnabled: true,
      processStartedAtMs: 0,
      peers: [gappedPeer],
      electionHandle: handle,
      nowMs: 50_000,
    })
    assert.equal(spine.swarm?.shadowRefresh?.mode, 'waiting-election')
    assert.equal(spine.swarm?.shadowRefresh?.targetBlock, 2048n)

    // At/after deadline (via injected nowMs): transitions to snap-mint with targetBlock <= head
    refreshSpineSwarmTelemetry({
      spine,
      shadowRefreshEnabled: true,
      processStartedAtMs: 0,
      peers: [gappedPeer],
      electionHandle: handle,
      nowMs: 100_500,
    })
    assert.equal(spine.swarm?.shadowRefresh?.mode, 'snap-mint')
    assert.equal(spine.swarm?.shadowRefresh?.targetBlock, 2048n)
  })

  it('SnapPivotStore dual-writes bal-tail into active shadow root and updates bucketPivotBlocks on promote', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-shadow-dual-'))
    try {
      const store = SnapPivotStore.open({
        dataDir: tmp,
        network: 'sepolia',
        chainId: 11155111n,
        genesisHash: networkGenesisHash('sepolia'),
        enabled: true,
      })
      const rootA = new Uint8Array(32).fill(0xaa)
      const rootB = new Uint8Array(32).fill(0xbb)
      store.activatePivot({
        blockNumber: 1024n,
        blockHash: new Uint8Array(32).fill(0x01),
        stateRoot: rootA,
      })
      const shadowHex = store.prepareShadowPivotFromHeader({
        blockNumber: 2048n,
        blockHash: new Uint8Array(32).fill(0x02),
        stateRoot: rootB,
      })
      store.setShadowPersistRoot(shadowHex)

      // Block arrives while shadow refresh is running
      store.appendHealBundle({
        blockNumber: 2050n,
        blockHash: new Uint8Array(32).fill(0x03),
        stateRoot: new Uint8Array(32).fill(0x04),
        headerRlp: new Uint8Array([0x01, 0x02]),
        balRlp: new Uint8Array([0x03, 0x04]),
        balJson: { accountChanges: [] } as never,
      })

      // Present in BOTH active and shadow bal-tail
      assert.isDefined(readBalTailBundle(store.activePivotRootDir()!, 2050n))
      assert.isDefined(readBalTailBundle(store.pivotDirForRoot(shadowHex), 2050n))

      assert.isTrue(store.promoteShadowPivotToActive(shadowHex))
      assert.equal(store.minActiveBucketPivotBlock(), 2048n)
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it('evaluateShadowRefreshEligibility uses 1x shadow footprint + margin and keeps active refresh running above 2 GiB floor', () => {
    const GiB = 1024n * 1024n * 1024n
    const shadowPivotBytes = 21n * GiB
    assert.equal(requiredShadowFreeBytes(shadowPivotBytes), 23n * GiB)
    assert.equal(requiredShadowFreeBytes(shadowPivotBytes, true), MIN_FREE_BYTES)

    // 37 GiB free with a 21 GiB shadow pivot is eligible (previously blocked by 2x full-pivot check)
    const ok = evaluateShadowRefreshEligibility({
      phase: 'HEAD_FOLLOWING',
      freeBytes: 37n * GiB,
      pivotBytes: shadowPivotBytes,
      head: 12_202_094n,
      localPivot: 12_097_069n,
      balEarliest: 12_201_700n,
      enabled: true,
    })
    assert.isTrue(ok.eligible)
    assert.isUndefined(ok.blockedReason)

    // 18 GiB free with a 21 GiB shadow pivot reports low-disk with exact free/required bytes
    const blocked = evaluateShadowRefreshEligibility({
      phase: 'HEAD_FOLLOWING',
      freeBytes: 18n * GiB,
      pivotBytes: shadowPivotBytes,
      head: 12_202_094n,
      localPivot: 12_097_069n,
      balEarliest: 12_201_700n,
      enabled: true,
    })
    assert.isFalse(blocked.eligible)
    assert.equal(blocked.blockedReason, 'low-disk')
    assert.equal(blocked.freeBytes, 18n * GiB)
    assert.equal(blocked.requiredFreeBytes, 23n * GiB)

    // Once a shadow refresh is already writing to disk, dropping to 16 GiB does not self-abort
    const active = evaluateShadowRefreshEligibility({
      phase: 'HEAD_FOLLOWING',
      freeBytes: 16n * GiB,
      pivotBytes: shadowPivotBytes,
      head: 12_202_094n,
      localPivot: 12_097_069n,
      balEarliest: 12_201_700n,
      enabled: true,
      inProgress: true,
    })
    assert.isTrue(active.eligible)

    // Dropping below the 2 GiB emergency floor aborts even an in-progress refresh
    const emergency = evaluateShadowRefreshEligibility({
      phase: 'HEAD_FOLLOWING',
      freeBytes: 1n * GiB,
      pivotBytes: shadowPivotBytes,
      head: 12_202_094n,
      localPivot: 12_097_069n,
      balEarliest: 12_201_700n,
      enabled: true,
      inProgress: true,
    })
    assert.isFalse(emergency.eligible)
    assert.equal(emergency.blockedReason, 'low-disk')

    // Fresh pivot with no BAL gap reports 'fresh', not 'low-disk'
    const fresh = evaluateShadowRefreshEligibility({
      phase: 'HEAD_FOLLOWING',
      freeBytes: 1n * GiB,
      pivotBytes: shadowPivotBytes,
      head: 12_097_200n,
      localPivot: 12_097_069n,
      balEarliest: 12_097_070n,
      enabled: true,
    })
    assert.isFalse(fresh.eligible)
    assert.equal(fresh.blockedReason, 'fresh')
  })

  it('refreshSpineSwarmTelemetry surfaces low-disk block reason and estimateShadowPivotBytes ignores code/storage/heal', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-shadow-bytes-'))
    try {
      const store = SnapPivotStore.open({
        dataDir: tmp,
        network: 'sepolia',
        chainId: 11155111n,
        genesisHash: networkGenesisHash('sepolia'),
        enabled: true,
      })
      const rootA = new Uint8Array(32).fill(0xaa)
      store.activatePivot({
        blockNumber: 1024n,
        blockHash: new Uint8Array(32).fill(0x01),
        stateRoot: rootA,
      })
      const pivotRoot = store.activePivotRootDir()!
      fs.mkdirSync(path.join(pivotRoot, 'accounts'), { recursive: true })
      fs.mkdirSync(path.join(pivotRoot, 'code'), { recursive: true })
      fs.writeFileSync(path.join(pivotRoot, 'accounts', '0.bin'), Buffer.alloc(4096))
      fs.writeFileSync(path.join(pivotRoot, 'code', 'shard-00.bin'), Buffer.alloc(65536))

      assert.equal(store.estimateShadowPivotBytes(), 4096n)

      const spine = createSpine('sepolia', 11155111n)
      spine.phase = 'HEAD_FOLLOWING'
      spine.pivotBlockNumber = 1024n
      spine.bestPeerHead = 5000n

      refreshSpineSwarmTelemetry({
        spine,
        snapStore: store,
        shadowRefreshEnabled: true,
        freeBytesOverride: 512n * 1024n * 1024n,
        processStartedAtMs: 0,
        peers: [],
        nowMs: 10_000,
      })
      assert.equal(spine.swarm?.shadowRefresh?.mode, 'idle')
      assert.equal(spine.swarm?.shadowRefresh?.blockedReason, 'low-disk')
      assert.equal(spine.swarm?.shadowRefresh?.freeBytes, 512n * 1024n * 1024n)
      assert.isDefined(spine.swarm?.shadowRefresh?.requiredFreeBytes)
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })
})
