import { assert, describe, it } from 'vitest'

import { RLP, utils } from '../src/index.js'

import * as invalid from './fixture/invalid.json'

const { hexToBytes } = utils

describe('invalid tests', () => {
  for (const [testName, test] of Object.entries(invalid.tests)) {
    it(`should pass ${testName}`, () => {
      let { out } = test
      if (out[0] === '0' && out[1] === 'x') {
        out = out.slice(2)
      }
      assert.throws(
        () => {
          RLP.decode(hexToBytes(out))
        },
        undefined,
        undefined,
        `should not decode invalid RLPs, input: ${out}`
      )
    })
  }

  it('should pass long string sanity check test', function () {
    // long string invalid test; string length > 55
    const longBufferTest = RLP.encode(
      'zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss'
    )
    // sanity checks
    assert.ok(longBufferTest[0] > 0xb7)
    assert.ok(longBufferTest[0] <= 0xbf)

    // try to decode the partial buffer
    assert.throws(
      () => {
        RLP.decode(longBufferTest.slice(1, longBufferTest.length - 1))
      },
      undefined,
      undefined,
      'string longer than 55 bytes: should throw'
    )
  })
})

// The tests below are taken from Geth
// https://github.com/ethereum/go-ethereum/blob/99be62a9b16fd7b3d1e2e17f1e571d3bef34f122/rlp/decode_test.go
// Not all tests were taken; some which throw due to type errors in Geth are ran against Geth's RLPdump to
// see if there is a decode error or not. In both cases, the test is converted to either reflect the
// expected value, or if the test is invalid, it is added as error test case

const invalidGethCases: string[] = [
  'F800',
  'BA0002FFFF',
  'B90000',
  'B800',
  '817F',
  '8100',
  '8101',
  'C8C9010101010101010101',
  'F90000',
  'F90055',
  'FA0002FFFF',
  'BFFFFFFFFFFFFFFFFFFF',
  'C801',
  'CD04040404FFFFFFFFFFFFFFFFFF0303',
  'C40102030401',
  'C4010203048180',
  '81',
  'BFFFFFFFFFFFFFFF',
  'C801',
  'c330f9c030f93030ce3030303030303030bd303030303030',
  '8105',
  'B8020004',
  'F8020004',
]

describe('invalid geth tests', () => {
  for (const gethCase of invalidGethCases) {
    const input = hexToBytes(gethCase)
    it('should pass Geth test', () => {
      assert.throws(
        () => {
          RLP.decode(input)
        },
        undefined,
        undefined,
        `should throw: ${gethCase}`
      )
    })
  }
})
