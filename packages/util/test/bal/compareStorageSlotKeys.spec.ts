import { assert, describe, it } from 'vitest'

import { compareStorageSlotKeys } from '../../src/bal/compareStorageSlotKeys.ts'
import type { PrefixedHexString } from '../../src/types.ts'

describe('compareStorageSlotKeys', () => {
  it('sorts minimal-representation keys by numeric value, not byte prefix', () => {
    const slot2: PrefixedHexString = '0x02'
    const slot256: PrefixedHexString = '0x0100'
    assert.isBelow(compareStorageSlotKeys(slot2, slot256), 0)
    assert.isAbove(compareStorageSlotKeys(slot256, slot2), 0)

    const sorted = [slot256, slot2].sort(compareStorageSlotKeys)
    assert.deepEqual(sorted, [slot2, slot256])
  })

  it('matches numeric order for same-length keys', () => {
    assert.isBelow(compareStorageSlotKeys('0x01', '0x02'), 0)
    assert.equal(compareStorageSlotKeys('0x0a', '0x0a'), 0)
  })

  it('treats canonical zero slot as less than non-zero keys', () => {
    assert.isBelow(compareStorageSlotKeys('0x', '0x01'), 0)
    assert.isBelow(compareStorageSlotKeys(new Uint8Array([]), '0x02'), 0)
  })
})
