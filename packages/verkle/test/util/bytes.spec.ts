import { assert, describe, it } from 'vitest'

import { matchingBytesLength } from '../../src/util/bytes.js'

describe('matchingBytesLength', () => {
  it('should return 0 when both arrays are empty', () => {
    const bytes1 = new Uint8Array([])
    const bytes2 = new Uint8Array([])
    assert.equal(matchingBytesLength(bytes1, bytes2), 0)
  })

  it('should return 0 when one of the arrays is empty', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([])
    assert.equal(matchingBytesLength(bytes1, bytes2), 0)
  })

  it('should return 0 when arrays have no matching elements', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([4, 5, 6])
    assert.equal(matchingBytesLength(bytes1, bytes2), 0)
  })

  it('should handle arrays with same elements but different lengths', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([1, 2, 3, 4])
    assert.equal(matchingBytesLength(bytes1, bytes2), 3)
  })

  it('should handle arrays with matching elements at end', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([0, 1, 2, 3])
    assert.equal(matchingBytesLength(bytes1, bytes2), 0)
  })

  it('should handle arrays with matching elements at start', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([1, 2, 3, 4, 5])
    assert.equal(matchingBytesLength(bytes1, bytes2), 3)
  })

  it('should handle arrays with large number of elements', () => {
    const bytes1 = new Uint8Array(Array.from({ length: 1000000 }, (_, i) => i))
    const bytes2 = new Uint8Array(Array.from({ length: 1000000 }, (_, i) => i))
    assert.equal(matchingBytesLength(bytes1, bytes2), 1000000)
  })
})
