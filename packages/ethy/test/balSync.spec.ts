import { FlatStateManager, MerkleStateManager } from '@ethereumjs/statemanager'
import { balSimpleJSON } from '@ethereumjs/testdata'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import { createAddressFromString, hexToBigInt } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { DeterministicIntentEngine } from '../src/ai/deterministicEngine.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { setPhase } from '../src/spine/createSpine.ts'
import { pushBalWindow, tryEnterHeadFollowing } from '../src/sync/balSync.ts'

describe('[Ethy/Sync]: BAL window and head phase', () => {
  it('pushBalWindow keeps full JSON on newest entry only', () => {
    const spine = createSpine('sepolia', 11155111n)
    const bal = balSimpleJSON as BALJSONBlockAccessList
    pushBalWindow(spine, 100n, bal)
    pushBalWindow(spine, 101n, bal)
    assert.equal(spine.balWindow.length, 2)
    assert.equal(spine.balWindow[0]?.blockNumber, 101n)
    assert.isDefined(spine.balWindow[0]?.balJson)
    assert.isUndefined(spine.balWindow[1]?.balJson)
  })

  it('tryEnterHeadFollowing when buckets and code queues are done', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    for (const b of spine.snapBuckets) b.status = 'done'
    const entered = tryEnterHeadFollowing(spine, undefined, {
      pendingDone: () => true,
    } as never)
    assert.equal(entered, true)
    assert.equal(spine.phase, 'HEAD_FOLLOWING')
    assert.equal(spine.capabilities.head.status, 'ready')
  })

  it('flat and merkle stay aligned after shared consumeBAL oracle', async () => {
    const bal = balSimpleJSON.filter(
      (entry) =>
        entry.balanceChanges.length > 0 ||
        entry.storageChanges.length > 0 ||
        entry.nonceChanges.length > 0,
    ) as BALJSONBlockAccessList
    const flat = new FlatStateManager()
    const merkle = new MerkleStateManager()
    await flat.consumeBAL(bal)
    await merkle.consumeBAL(bal)
    const balanceAddr = createAddressFromString('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    const flatAcc = await flat.getAccount(balanceAddr)
    const merkleAcc = await merkle.getAccount(balanceAddr)
    assert.isDefined(flatAcc)
    assert.isDefined(merkleAcc)
    assert.equal(flatAcc!.balance, merkleAcc!.balance)
    assert.equal(flatAcc!.balance, hexToBigInt('0x01ec30'))
  })

  it('/bal works when head capability is ready', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'HEAD_FOLLOWING')
    pushBalWindow(spine, 200n, balSimpleJSON as BALJSONBlockAccessList)
    const engine = new DeterministicIntentEngine({ stateManager: new FlatStateManager() })
    const r = engine.handle({ text: '/bal', spine })
    assert.equal(r.widget.kind, 'table')
  })
})
