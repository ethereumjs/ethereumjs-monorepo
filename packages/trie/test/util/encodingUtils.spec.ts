import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  byteTypeToNibbleType,
  bytesToNibbles,
  compactBytesToNibbles,
  nibbleTypeToByteType,
  nibbleTypeToPackedBytes,
  nibblesToCompactBytes,
  pathToHexKey,
} from '../../src/util/encoding.js'

import type { Nibbles } from '../../src/types.js'

describe('encoding', () => {
  it('nibblesToCompactBytes and compactBytesToNibbles should encode hex data correctly', () => {
    const tests = [
      { hex: new Uint8Array(), compact: hexToBytes('0x00') },
      { hex: new Uint8Array([16]), compact: hexToBytes('0x20') },
      {
        hex: new Uint8Array([1, 2, 3, 4, 5]),
        compact: hexToBytes('0x112345'),
      },
      {
        hex: new Uint8Array([0, 1, 2, 3, 4, 5]),
        compact: hexToBytes('0x00012345'),
      },
      {
        hex: new Uint8Array([15, 1, 12, 11, 8, 16]),
        compact: hexToBytes('0x3f1cb8'),
      },
      {
        hex: new Uint8Array([0, 15, 1, 12, 11, 8, 16]),
        compact: hexToBytes('0x200f1cb8'),
      },
    ]

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      assert.equal(JSON.stringify(nibblesToCompactBytes(test.hex)), JSON.stringify(test.compact))
      assert.equal(JSON.stringify(compactBytesToNibbles(test.compact)), JSON.stringify(test.hex))
    }
  })

  it('bytesToNibbles should encode data correctly', () => {
    const tests = [
      { key: new Uint8Array(), hexOut: new Uint8Array([16]) },
      { key: new Uint8Array(), hexOut: new Uint8Array([16]) },
      {
        key: hexToBytes('0x123456'),
        hexOut: new Uint8Array([1, 2, 3, 4, 5, 6, 16]),
      },
      {
        key: hexToBytes('0x123405'),
        hexOut: new Uint8Array([1, 2, 3, 4, 0, 5, 16]),
      },
      {
        key: hexToBytes('0x123456'),
        hexOut: new Uint8Array([1, 2, 3, 4, 5, 6, 16]),
      },
    ]

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      assert.equal(JSON.stringify(bytesToNibbles(test.key)), JSON.stringify(test.hexOut))
    }
  })

  it('should return the correct hex-encoded key in "hex" encoding', () => {
    const path = 'aabbcc'
    const extension: Nibbles = [10, 11, 12]
    const result = pathToHexKey(path, extension, 'hex')

    // Calculate the expected result manually based on the functions used in the pathToHexKey function
    const b = hexToBytes('0x' + path)
    const n = byteTypeToNibbleType(b)
    const expected = nibbleTypeToByteType(n.concat(extension))

    assert.deepEqual(
      result,
      expected,
      'Returned hex-encoded key does not match the expected result'
    )
  })

  it('should return the correct hex-encoded key in "keybyte" encoding', () => {
    const path = '112233'
    const extension: Nibbles = [13, 14, 15]
    const result = pathToHexKey(path, extension, 'keybyte')

    // Calculate the expected result manually based on the functions used in the pathToHexKey function
    const b = hexToBytes('0x' + path)
    const n = byteTypeToNibbleType(b)
    const expected = nibbleTypeToPackedBytes(n.concat(extension))

    assert.deepEqual(
      result,
      expected,
      'Returned hex-encoded key in "keybyte" encoding does not match the expected result'
    )
  })

  it('should throw an error when retType is invalid', () => {
    const path = 'abcdef'
    const extension: Nibbles = [1, 2, 3]

    // Pass an invalid retType to the function
    assert.throws(
      () => pathToHexKey(path, extension, 'invalid'),
      Error,
      'retType must be either "keybyte" or "hex"'
    )
  })
})
