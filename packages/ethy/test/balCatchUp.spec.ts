import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { createBlockHeader } from '@ethereumjs/block'
import { Common, Sepolia } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { FlatStateManager, MerkleStateManager } from '@ethereumjs/statemanager'
import { balSimpleJSON } from '@ethereumjs/testdata'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import {
  createAddressFromString,
  createBlockLevelAccessListFromJSON,
  hexToBigInt,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { EthMessageCodes } from '../src/net/pivotHeader.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import {
  bucketCursorFraction,
  computeSnapProgressPct,
  createSnapBuckets,
  formatProgressBar,
} from '../src/spine/buckets.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import {
  BalChainStreamer,
  applyBlockBal,
  applySyncedBalDiff,
  seedBalCatchUp,
  tryEnterBalCatchUp,
} from '../src/sync/balSync.ts'
import { isAccountHashSynced } from '../src/sync/syncedAccountHash.ts'
import { stripAnsi } from '../src/tui/ansi.ts'
import { renderCockpit } from '../src/tui/cockpit.ts'
import { createInitialViewState } from '../src/tui/prompt.ts'

const balPayload = balSimpleJSON.filter(
  (entry) =>
    entry.balanceChanges.length > 0 ||
    entry.storageChanges.length > 0 ||
    entry.nonceChanges.length > 0,
) as BALJSONBlockAccessList

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-bal-catchup-'))
}

describe('[Ethy/Sync]: BAL catch-up oracle', () => {
  it('isAccountHashSynced treats done buckets as synced and open cursors as not', () => {
    const spine = createSpine('sepolia', 11155111n)
    const buckets = spine.snapBuckets
    const openHash = new Uint8Array(32)
    openHash[0] = 0x30
    assert.equal(isAccountHashSynced(openHash, buckets), false)
    buckets[3]!.status = 'done'
    assert.equal(isAccountHashSynced(openHash, buckets), true)
  })

  it('applySyncedBalDiff skips accounts inside an open sub-range cursor', async () => {
    const flat = new FlatStateManager()
    const spine = createSpine('sepolia', 11155111n)
    const bucket = spine.snapBuckets[0]!
    bucket.subRanges![0]!.origin = new Uint8Array(bucket.startHash)
    bucket.subRanges![0]!.limit = new Uint8Array(32)
    bucket.subRanges![0]!.limit.fill(0xff)
    const bal = balSimpleJSON.filter(
      (entry) => entry.balanceChanges.length > 0,
    ) as BALJSONBlockAccessList
    const before = flat.accountCount()
    await applySyncedBalDiff(flat, bal, spine.snapBuckets)
    assert.equal(flat.accountCount(), before)
  })

  it('computeSnapProgressPct rises with bucket cursor and stays under 75 until done', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    const b = spine.snapBuckets[0]!
    const startFrac = computeSnapProgressPct(spine)
    b.currentLastHash[0] = 0x08
    b.currentLastHash[1] = 0x00
    b.currentLastHash[2] = 0x00
    b.subRanges![0]!.origin = new Uint8Array(b.currentLastHash)
    const midFrac = computeSnapProgressPct(spine)
    assert.isAbove(midFrac, startFrac)
    assert.isAtMost(midFrac, 75)
    for (const bucket of spine.snapBuckets) bucket.status = 'done'
    spine.codesTotal = 8
    spine.codesSynced = 4
    spine.codesQueued = 4
    spine.storageAccountsTotal = 4
    spine.storageAccountsSynced = 0
    spine.storageQueued = 4
    const storagePct = computeSnapProgressPct(spine)
    assert.isAbove(storagePct, 75)
    assert.isAtMost(storagePct, 100)
    assert.equal(bucketCursorFraction(createSnapBuckets()[0]!), 0)
  })

  it('renderCockpit pulse row uses █/░ bar without heal or carry glyphs', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    spine.pivotBlockNumber = 1_000n
    spine.totalAccountsSynced = 1000
    spine.accountsPerSec = 100
    spine.snapBuckets[0]!.status = 'done'
    const lines = renderCockpit(spine, createInitialViewState(), 160)
    assert.equal(lines.length, 8)
    const plain = stripAnsi(lines.join('\n'))
    assert.match(plain, /%/)
    assert.include(plain, formatProgressBar(computeSnapProgressPct(spine)))
    assert.include(plain, '█')
    assert.notInclude(plain, '!')
    assert.notInclude(plain, 'kept')
    assert.notInclude(plain, 'previous')
  })

  it('applyBlockBal keeps flat and merkle aligned over 25 synthetic blocks', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const common = new Common({ chain: Sepolia, hardfork })
    const bal = createBlockLevelAccessListFromJSON(balPayload)
    const balRlp = bal.serialize()
    const flat = new FlatStateManager()
    const merkle = new MerkleStateManager()
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'BAL_CATCHUP')
    spine.pivotBlockNumber = 100n
    spine.lastVerifiedBlockNumber = 100n
    seedBalCatchUp(spine, 125n)

    for (let n = 101; n <= 125; n++) {
      const header = createBlockHeader(
        {
          number: BigInt(n),
          parentHash: new Uint8Array(32),
          stateRoot: new Uint8Array(32),
          blockAccessListHash: bal.hash(),
        },
        { common },
      )
      const headerRlp = header.serialize()
      const flatResult = await applyBlockBal(flat, headerRlp, balRlp, chain, hardfork)
      assert.equal(flatResult.ok, true)
      assert.equal(flatResult.applied, true)
      await merkle.consumeBAL(balPayload)
      spine.lastVerifiedBlockNumber = BigInt(n)
      if (spine.balCatchUp !== undefined) {
        spine.balCatchUp.applied = n - 100
      }
    }

    setPhase(spine, 'HEAD_FOLLOWING')
    spine.headBlockNumber = 125n
    assert.equal(spine.lastVerifiedBlockNumber, 125n)
    assert.equal(spine.phase, 'HEAD_FOLLOWING')

    const balanceAddr = createAddressFromString('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    const flatAcc = await flat.getAccount(balanceAddr)
    const merkleAcc = await merkle.getAccount(balanceAddr)
    assert.isDefined(flatAcc)
    assert.isDefined(merkleAcc)
    assert.equal(flatAcc!.balance, merkleAcc!.balance)
    assert.equal(flatAcc!.balance, hexToBigInt('0x01ec30'))
  })

  it('peekActive lastVerified resumes catch-up from 111 not pivot snap', () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0x42
    const store = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    store.activatePivot({
      blockNumber: 100n,
      blockHash: new Uint8Array(32),
      stateRoot: root,
    })
    store.markBaseSyncComplete(100n)
    store.noteVerifiedBlock(110n)

    const peek = store.peekActive()
    assert.equal(peek?.lastVerifiedBlockNumber, 110n)

    const spine = createSpine('sepolia', 11155111n)
    store.loadInto(spine, new FlatStateManager())
    seedBalCatchUp(spine, 125n)
    assert.equal(spine.balCatchUp?.fromBlock, 111n)
    assert.equal(spine.balCatchUp?.total, 15)
  })

  it('BalChainStreamer stays in SNAP_SYNCING across 18 streamed blocks, steps pivot by 16, and flushes remaining 2 on completion', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const common = new Common({ chain: Sepolia, hardfork })
    const bal = createBlockLevelAccessListFromJSON(balPayload)
    const balRlp = bal.serialize()
    const flat = new FlatStateManager()
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    const basePivot = 12_000_100n
    spine.pivotBlockNumber = basePivot
    spine.pivotStateRoot = new Uint8Array(32).fill(0x11)
    spine.lastVerifiedBlockNumber = basePivot
    spine.bestPeerHead = basePivot + 18n
    // Mark buckets 0..14 done while bucket 15 stays syncing
    for (let i = 0; i < 15; i++) {
      spine.snapBuckets[i]!.status = 'done'
    }

    const peerId = '01'.repeat(32)
    let pendingOutbound: Array<{ code: number; payload: Uint8Array }> = []
    const fakeClient = {
      sendEthMessage: (_peer: Uint8Array, code: number, payload: Uint8Array) => {
        pendingOutbound.push({ code, payload })
      },
    } as never

    const streamer = new BalChainStreamer({
      spine,
      stateManager: flat,
      chain,
      hardfork,
      getClient: () => fakeClient,
      sendEthMessage: (_peer, code, payload) => {
        pendingOutbound.push({ code, payload })
      },
      pickEthPeer: () => ({ id: peerId, ethVersion: 71, latestBlock: Number(basePivot + 18n) }),
      putServableBlock: () => {},
    })

    // Start streaming and feed blocks basePivot+1 .. basePivot+18 as each GET_BLOCK_HEADERS is requested
    ;(streamer as unknown as { tick: () => void }).tick()
    for (let i = 1; i <= 18; i++) {
      const n = basePivot + BigInt(i)
      assert.isAtLeast(pendingOutbound.length, 1)
      assert.equal(
        pendingOutbound[pendingOutbound.length - 1]!.code,
        EthMessageCodes.GET_BLOCK_HEADERS,
      )
      pendingOutbound = []

      const stateRoot = new Uint8Array(32)
      stateRoot[31] = i
      const header = createBlockHeader(
        {
          number: n,
          timestamp: 2_000_000_000n + BigInt(i),
          parentHash: new Uint8Array(32),
          stateRoot,
          blockAccessListHash: bal.hash(),
        },
        { common },
      )
      const headerRlp = header.serialize()
      streamer.handleEthMessage({
        peerId,
        code: EthMessageCodes.BLOCK_HEADERS,
        payload: RLP.encode([intToUnpaddedBytes(1), [RLP.decode(headerRlp)]] as never),
      })
      streamer.handleEthMessage({
        peerId,
        code: EthMessageCodes.BLOCK_BODIES,
        payload: RLP.encode([intToUnpaddedBytes(2), [[[], []]]] as never),
      })
      streamer.handleEthMessage({
        peerId,
        code: EthMessageCodes.RECEIPTS,
        payload: RLP.encode([intToUnpaddedBytes(3), intToUnpaddedBytes(0), [[]]] as never),
      })
      streamer.handleEthMessage({
        peerId,
        code: EthMessageCodes.BLOCK_ACCESS_LISTS,
        payload: RLP.encode([intToUnpaddedBytes(4), [balRlp]] as never),
      })
      await new Promise<void>((resolve) => setTimeout(resolve, 10))

      // Crucial invariant: streaming blocks during SNAP_SYNCING must NEVER flip phase to HEAD_FOLLOWING!
      assert.equal(spine.phase, 'SNAP_SYNCING')
    }

    // After 18 blocks (16 step + 2 safety margin), 1 pivot step completed (+16) and 2 blocks remain buffered!
    assert.equal(spine.pivotStepsCompleted, 1)
    assert.equal(spine.pivotBlockNumber, basePivot + 16n)
    assert.equal(spine.lastVerifiedBlockNumber, basePivot + 16n)
    assert.equal(spine.bufferedBalCount, 2)
    assert.equal(spine.streamedBalCount, 18)
    assert.equal(spine.appliedBalCount, 16)

    // Now finish the last bucket (15) and flush buffered blocks for "The Big Flip"
    spine.snapBuckets[15]!.status = 'done'
    await streamer.flushBufferedBlocks()
    assert.equal(spine.pivotBlockNumber, basePivot + 18n)
    assert.equal(spine.lastVerifiedBlockNumber, basePivot + 18n)
    assert.equal(spine.bufferedBalCount, 0)
    assert.equal(spine.appliedBalCount, 18)

    const flipped = tryEnterBalCatchUp(spine, undefined, undefined, basePivot + 18n)
    assert.equal(flipped, true)
    assert.equal(spine.phase, 'HEAD_FOLLOWING')
  })
})
