import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { createBlockHeader } from '@ethereumjs/block'
import { Common, Sepolia } from '@ethereumjs/common'
import { FlatStateManager, MerkleStateManager } from '@ethereumjs/statemanager'
import { balSimpleJSON } from '@ethereumjs/testdata'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import {
  createAddressFromString,
  createBlockLevelAccessListFromJSON,
  hexToBigInt,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import {
  bucketCursorFraction,
  computeSnapProgressPct,
  createSnapBuckets,
  formatProgressBar,
} from '../src/spine/buckets.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import { seedBalCatchUp } from '../src/sync/balSync.ts'
import { applyBlockBal } from '../src/sync/balSync.ts'
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
  it('computeSnapProgressPct rises with bucket cursor and stays under 85 until done', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    const b = spine.snapBuckets[0]!
    const startFrac = computeSnapProgressPct(spine)
    b.currentLastHash[1] = 0x40
    b.currentLastHash[2] = 0x00
    const midFrac = computeSnapProgressPct(spine)
    assert.isAbove(midFrac, startFrac)
    assert.isAtMost(midFrac, 85)
    for (const bucket of spine.snapBuckets) bucket.status = 'done'
    spine.codesSynced = 4
    spine.codesQueued = 4
    const storagePct = computeSnapProgressPct(spine)
    assert.isAbove(storagePct, 85)
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
})
