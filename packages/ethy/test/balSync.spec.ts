import { balSimpleJSON } from '@ethereumjs/testdata'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

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
})
