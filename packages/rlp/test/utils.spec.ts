import { assert, describe, it } from 'vitest'

import { RLP, utils } from '../src/index.ts'

const { hexToBytes } = utils

describe('[RLP]: utils', () => {
  it('hexToBytes() decodes 0x-prefixed hex strings', () => {
    assert.deepEqual(hexToBytes('0xcafe0123'), Uint8Array.from([0xca, 0xfe, 0x01, 0x23]))
  })
  it('hexToBytes() decodes non 0x-prefixed hex strings', () => {
    assert.deepEqual(hexToBytes('cafe0123'), Uint8Array.from([0xca, 0xfe, 0x01, 0x23]))
  })

  it('hexToBytes() rejects unpadded odd-length hex', () => {
    assert.throws(() => hexToBytes('abc'))
  })

  it('hexToBytes() rejects non-hex characters', () => {
    assert.throws(() => hexToBytes('zz'))
  })

  it('hexToBytes() rejects non-string input', () => {
    assert.throws(() => hexToBytes(123 as unknown as string))
  })
})

describe('[RLP]: invalid inputs', () => {
  const errCases = [
    // prettier-ignore
    {
      input: Uint8Array.from([
        239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 191, 189,
        29, 239, 191, 189, 77, 239, 191, 189, 239, 191, 189, 239, 191, 189, 93, 122, 239, 191, 189,
        239, 191, 189, 239, 191, 189, 103, 239, 191, 189, 239, 191, 189, 239, 191, 189, 26, 239,
        191, 189, 18, 69, 27, 239, 191, 189, 239, 191, 189, 116, 19, 239, 191, 189, 239, 191, 189,
        66, 239, 191, 189, 64, 212, 147, 71, 239, 191, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 239, 191, 189, 11, 222, 155, 122, 54, 42, 194, 169, 239, 191, 189, 70,
        239, 191, 189, 72, 239, 191, 189, 239, 191, 189, 54, 53, 239, 191, 189, 100, 73, 239, 191,
        189, 55, 239, 191, 189, 239, 191, 189, 59, 1, 239, 191, 189, 109, 239, 191, 189, 239, 191,
        189, 93, 239, 191, 189, 208, 128, 239, 191, 189, 239, 191, 189, 0, 239, 191, 189, 239, 191,
        189, 239, 191, 189, 15, 66, 64, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189,
        4, 239, 191, 189, 79, 103, 239, 191, 189, 85, 239, 191, 189, 239, 191, 189, 239, 191, 189,
        74, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 54, 239, 191, 189, 239, 191,
        189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 83, 239, 191, 189, 14, 239, 191, 189, 239,
        191, 189, 239, 191, 189, 4, 63, 239, 191, 189, 63, 239, 191, 189, 41, 239, 191, 189, 239,
        191, 189, 239, 191, 189, 67, 28, 239, 191, 189, 239, 191, 189, 11, 239, 191, 189, 31, 239,
        191, 189, 239, 191, 189, 104, 96, 100, 239, 191, 189, 239, 191, 189, 12, 239, 191, 189, 239,
        191, 189, 206, 152, 239, 191, 189, 239, 191, 189, 31, 112, 111, 239, 191, 189, 239, 191,
        189, 65, 239, 191, 189, 41, 239, 191, 189, 239, 191, 189, 53, 84, 11, 239, 191, 189, 239,
        191, 189, 12, 102, 24, 12, 42, 105, 109, 239, 191, 189, 58, 239, 191, 189, 4, 239, 191, 189,
        104, 82, 9, 239, 191, 189, 6, 66, 91, 43, 38, 102, 117, 239, 191, 189, 105, 239, 191, 189,
        239, 191, 189, 239, 191, 189, 89, 127, 239, 191, 189, 114,
      ]),
    },
    {
      input: hexToBytes('efdebd'), // cspell:disable-line
      msg: 'invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds',
    },
    {
      input: hexToBytes('efb83600'),
      msg: 'invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds',
    },
    {
      input: hexToBytes('efdebdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), // cspell:disable-line
      msg: 'invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds',
    },
  ]
  for (const [index, { input, msg }] of errCases.entries()) {
    it(`decode() rejects or throws on malformed input — case ${index}`, () => {
      try {
        RLP.decode(input)
        assert.fail('expected decode to throw')
      } catch (e: unknown) {
        if (typeof msg !== 'undefined') {
          assert.equal((e as Error).message, msg)
        }
      }
    })
  }
})
