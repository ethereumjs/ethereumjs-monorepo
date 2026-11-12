import { assert, describe, it } from 'vitest'

import {
  DEFAULT_MAX_SWARM_TAIL_BLOCKS,
  ETHY_DISCOVERY_GRACE_MS,
  isUsableEthySeeder,
  preferCanonicalSnapOverEthy,
  shouldLockSnapAfterGrace,
} from '../src/sync/syncSourceSelector.ts'

describe('[Ethy/Sync]: sync source selector', () => {
  it('isUsableEthySeeder rejects empty bitmask', () => {
    assert.equal(
      isUsableEthySeeder(
        { bucketsBitmask: 0, basePivotBlock: 100n, balEarliestBlock: 101n },
        200n,
        'auto',
      ),
      false,
    )
  })

  it('isUsableEthySeeder accepts ethy mode regardless of tail length', () => {
    assert.equal(
      isUsableEthySeeder(
        { bucketsBitmask: 1, basePivotBlock: 100n, balEarliestBlock: 101n },
        100_000n,
        'ethy',
      ),
      true,
    )
  })

  it('isUsableEthySeeder still rejects 64800 tail in auto', () => {
    assert.equal(
      isUsableEthySeeder(
        { bucketsBitmask: 0xffff, basePivotBlock: 1n, balEarliestBlock: 2n },
        64_802n,
        'auto',
      ),
      false,
    )
  })

  it('preferCanonicalSnapOverEthy when swarm tail exceeds 2048', () => {
    assert.equal(
      preferCanonicalSnapOverEthy({
        syncMode: 'auto',
        explicitConnect: false,
        bestPeerHead: 10_000n,
        freshestEthyPivotBlock: 10_000n - DEFAULT_MAX_SWARM_TAIL_BLOCKS - 1n,
        hasSnapPeer: true,
      }),
      true,
    )
  })

  it('shouldLockSnapAfterGrace waits for grace in auto mode', () => {
    assert.equal(
      shouldLockSnapAfterGrace('auto', 'unset', ETHY_DISCOVERY_GRACE_MS - 1, false),
      false,
    )
    assert.equal(shouldLockSnapAfterGrace('auto', 'unset', ETHY_DISCOVERY_GRACE_MS, false), true)
    assert.equal(shouldLockSnapAfterGrace('snap', 'unset', 0, false), true)
    assert.equal(shouldLockSnapAfterGrace('ethy', 'unset', 99_000, false), false)
  })
})
