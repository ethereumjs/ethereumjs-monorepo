import { assert, describe, it } from 'vitest'

import {
  beginCustodyBalOnboarding,
  custodyFastPathEnabled,
  custodyOnboardingPivotBlock,
  desiredCustodyBucketsMask,
} from '../src/custody/custodyOnboarding.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { onboardingBalStartBlock } from '../src/sync/blockCalendar.ts'

describe('custodyOnboarding', () => {
  it('custodyFastPathEnabled is off when snap-bootstrap or base complete', () => {
    assert.isTrue(custodyFastPathEnabled({ snapBootstrap: false, baseSyncComplete: false }))
    assert.isFalse(custodyFastPathEnabled({ snapBootstrap: true, baseSyncComplete: false }))
    assert.isFalse(custodyFastPathEnabled({ snapBootstrap: false, baseSyncComplete: true }))
  })

  it('custodyOnboardingPivotBlock is one before BAL window start', () => {
    const head = 10_000n
    const start = onboardingBalStartBlock(head)
    assert.equal(custodyOnboardingPivotBlock(head), start > 0n ? start - 1n : 0n)
  })

  it('beginCustodyBalOnboarding seeds BAL catch-up toward head', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.pivotBlockNumber = 9000n
    spine.pivotStateRoot = new Uint8Array(32)
    beginCustodyBalOnboarding(spine, 10_000n)
    assert.equal(spine.phase, 'BAL_CATCHUP')
    assert.isDefined(spine.balCatchUp)
  })

  it('desiredCustodyBucketsMask ORs assigned nibbles', () => {
    assert.equal(desiredCustodyBucketsMask([0, 8]), 0x0101)
    assert.equal(desiredCustodyBucketsMask([]), undefined)
  })
})
