import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { bytesToNibbles, compactBytesToNibbles, nibblesToCompactBytes } from '../src'

tape('encoding', function (t) {
  t.test(
    'nibblesToCompactBytes and compactBytesToNibbles should encode hex data correctly',
    function (t) {
      const tests = [
        { hex: new Uint8Array(), compact: hexToBytes('00') },
        { hex: new Uint8Array([16]), compact: hexToBytes('20') },
        {
          hex: new Uint8Array([1, 2, 3, 4, 5]),
          compact: hexToBytes('112345'),
        },
        {
          hex: new Uint8Array([0, 1, 2, 3, 4, 5]),
          compact: hexToBytes('00012345'),
        },
        {
          hex: new Uint8Array([15, 1, 12, 11, 8, 16]),
          compact: hexToBytes('3f1cb8'),
        },
        {
          hex: new Uint8Array([0, 15, 1, 12, 11, 8, 16]),
          compact: hexToBytes('200f1cb8'),
        },
      ]

      for (let i = 0; i < tests.length; i++) {
        const test = tests[i]
        t.equal(JSON.stringify(nibblesToCompactBytes(test.hex)), JSON.stringify(test.compact))
        t.equal(JSON.stringify(compactBytesToNibbles(test.compact)), JSON.stringify(test.hex))
      }

      t.end()
    }
  )

  t.test('bytesToNibbles should encode data correctly', function (t) {
    const tests = [
      { key: new Uint8Array(), hexOut: new Uint8Array([16]) },
      { key: new Uint8Array(), hexOut: new Uint8Array([16]) },
      {
        key: hexToBytes('123456'),
        hexOut: new Uint8Array([1, 2, 3, 4, 5, 6, 16]),
      },
      {
        key: hexToBytes('123405'),
        hexOut: new Uint8Array([1, 2, 3, 4, 0, 5, 16]),
      },
      {
        key: hexToBytes('123456'),
        hexOut: new Uint8Array([1, 2, 3, 4, 5, 6, 16]),
      },
    ]

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      t.equal(JSON.stringify(bytesToNibbles(test.key)), JSON.stringify(test.hexOut))
    }

    t.end()
  })
})
