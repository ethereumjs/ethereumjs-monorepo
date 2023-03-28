import { bytesToNibbles, compactBytesToNibbles, nibblesToCompactBytes } from '@ethereumjs/util'
import * as tape from 'tape'

tape('encoding', function (t) {
  t.test(
    'nibblesToCompactBytes and compactBytesToNibbles should encode hex data correctly',
    function (t) {
      const tests = [
        { hex: new Uint8Array(), compact: new Uint8Array(Buffer.from('00', 'hex')) },
        { hex: new Uint8Array([16]), compact: new Uint8Array(Buffer.from('20', 'hex')) },
        {
          hex: new Uint8Array([1, 2, 3, 4, 5]),
          compact: new Uint8Array(Buffer.from('112345', 'hex')),
        },
        {
          hex: new Uint8Array([0, 1, 2, 3, 4, 5]),
          compact: new Uint8Array(Buffer.from('00012345', 'hex')),
        },
        {
          hex: new Uint8Array([15, 1, 12, 11, 8, 16]),
          compact: new Uint8Array(Buffer.from('3f1cb8', 'hex')),
        },
        {
          hex: new Uint8Array([0, 15, 1, 12, 11, 8, 16]),
          compact: new Uint8Array(Buffer.from('200f1cb8', 'hex')),
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
        key: new Uint8Array(Buffer.from('123456', 'hex')),
        hexOut: new Uint8Array([1, 2, 3, 4, 5, 6, 16]),
      },
      {
        key: new Uint8Array(Buffer.from('123405', 'hex')),
        hexOut: new Uint8Array([1, 2, 3, 4, 0, 5, 16]),
      },
      {
        key: new Uint8Array(Buffer.from('123456', 'hex')),
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
