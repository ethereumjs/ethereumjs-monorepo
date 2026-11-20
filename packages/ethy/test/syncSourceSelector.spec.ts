import { assert, describe, it } from 'vitest'

import {
  DEFAULT_MAX_SWARM_TAIL_BLOCKS,
  ETHY_DISCOVERY_EXTENDED_GRACE_MS,
  ETHY_DISCOVERY_GRACE_MS,
  isFreshEthyPreemptCandidate,
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

  it('isUsableEthySeeder rejects 0xffff with BAL gap unless bridge', () => {
    const seeder = {
      bucketsBitmask: 0xffff,
      basePivotBlock: 100n,
      balEarliestBlock: 150n,
    }
    assert.equal(isUsableEthySeeder(seeder, 200n, 'auto'), false)
    assert.equal(isUsableEthySeeder(seeder, 200n, 'auto', { bridgeCovered: true }), true)
  })

  it('DEFAULT_MAX_SWARM_TAIL_BLOCKS is 4096 (WP-11b)', () => {
    assert.equal(DEFAULT_MAX_SWARM_TAIL_BLOCKS, 4096n)
  })

  it('preferCanonicalSnapOverEthy when swarm tail exceeds 4096', () => {
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
    assert.equal(
      shouldLockSnapAfterGrace('auto', 'unset', ETHY_DISCOVERY_EXTENDED_GRACE_MS - 1, false, true),
      false,
    )
    assert.equal(
      shouldLockSnapAfterGrace('auto', 'unset', ETHY_DISCOVERY_EXTENDED_GRACE_MS, false, true),
      true,
    )
    assert.equal(shouldLockSnapAfterGrace('snap', 'unset', 0, false), true)
    assert.equal(shouldLockSnapAfterGrace('ethy', 'unset', 99_000, false), false)
  })

  it('isFreshEthyPreemptCandidate within soft horizon', () => {
    assert.equal(
      isFreshEthyPreemptCandidate(
        { bucketsBitmask: 1, basePivotBlock: 9000n, balEarliestBlock: 9001n },
        10_000n,
      ),
      true,
    )
    assert.equal(
      isFreshEthyPreemptCandidate(
        { bucketsBitmask: 1, basePivotBlock: 8000n, balEarliestBlock: 8001n },
        10_000n,
      ),
      false,
    )
  })
})
