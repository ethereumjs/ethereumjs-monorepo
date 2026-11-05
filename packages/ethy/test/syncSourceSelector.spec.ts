import { assert, describe, it } from 'vitest'

import {
  ETHY_DISCOVERY_GRACE_MS,
  isUsableEthySeeder,
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
