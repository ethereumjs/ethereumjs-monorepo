import { assert, describe, it } from 'vitest'

import { advanceDemo } from '../src/demo/advanceDemo.ts'
import { createSpine } from '../src/spine/createSpine.ts'

describe('[Ethy/Demo]: advanceDemo', () => {
  it('elapsed 0 keeps BOOTING and pending buckets', () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 0)
    assert.equal(spine.phase, 'BOOTING')
    assert.equal(spine.peers.size, 0)
    assert.isTrue(spine.snapBuckets.every((b) => b.status === 'pending'))
  })

  it('elapsed 5000 reaches SNAP_SYNCING with stalled 0x3', () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    assert.equal(spine.phase, 'SNAP_SYNCING')
    assert.equal(spine.snapBuckets[3]?.status, 'stalled')
    assert.isTrue(spine.peers.size >= 3)
  })

  it('elapsed 9000 reaches HEAD_FOLLOWING', () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 9000)
    assert.equal(spine.phase, 'HEAD_FOLLOWING')
    assert.isDefined(spine.pivotBlockNumber)
    assert.isDefined(spine.headBlockNumber)
  })
})
