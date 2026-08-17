import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { accessListBytesToJSON, accessListJSONToBytes } from '../src/util/access.ts'

import type { AccessList, AccessListBytes } from '../src/types.ts'

const SAMPLE_JSON: AccessList = [
  {
    address: '0x0101010101010101010101010101010101010101',
    storageKeys: ['0x0101010101010101010101010101010101010101010101010101010101010101'],
  },
]

describe('[Tx/AccessList]: JSON ↔ bytes', () => {
  it('accessListJSONToBytes() / accessListBytesToJSON() round-trip', () => {
    const bytes = accessListJSONToBytes(SAMPLE_JSON)
    const roundTrip = accessListBytesToJSON(bytes)
    assert.deepEqual(roundTrip, SAMPLE_JSON)
  })

  it('accessListBytesToJSON() left-pads short entries', () => {
    const bytes: AccessListBytes = [[hexToBytes('0x0101'), [hexToBytes('0x0101')]]]
    const json = accessListBytesToJSON(bytes)
    assert.isTrue(json[0].address.startsWith('0x'))
    assert.isTrue(json[0].address.length === 42)
    assert.isTrue(json[0].storageKeys[0].length === 66)
  })
})
