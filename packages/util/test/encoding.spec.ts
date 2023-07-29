import { assert, describe, it } from 'vitest'

import {
  bytesToNibbles,
  compactBytesToNibbles,
  hexToBytes,
  mergeAndFormatKeyPaths,
  nibblesToCompactBytes,
} from '../src/index.js'

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

  it('should merge and format pathStrings into paths', () => {
    // should merge all syncPaths that have the same base account path
    const pathStrings = ['0x0a', '0x0a/0x0b', '0x0a/0x0c', '0x0a/0x0d', '0x0e', '0x0e/0x0a', '0x0f']
    const paths = mergeAndFormatKeyPaths(pathStrings)

    assert.equal(
      paths.reduce((count, subArray) => count + subArray.length, 0),
      pathStrings.length,
      'should have correct number of paths'
    )
    assert.deepEqual(
      paths[0],
      [Uint8Array.of(26), Uint8Array.of(27), Uint8Array.of(28), Uint8Array.of(29)],
      'should merge paths correctly'
    )
    assert.deepEqual(
      paths[1],
      [Uint8Array.of(30), Uint8Array.of(26)],
      'should merge paths correctly'
    )
    assert.deepEqual(paths[2], [Uint8Array.of(31)], 'should merge paths correctly')
  })
})
