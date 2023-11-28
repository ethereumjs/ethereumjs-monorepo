import { Chain, Common } from '@ethereumjs/common'
import { bigIntToBytes, concatBytes, setLengthLeft } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EVM, getActivePrecompiles } from '../../src/index.js'

describe('Precompiles: MODEXP', () => {
  it('MODEXP edge cases (issue 3168)', async () => {
    const common = new Common({ chain: Chain.Mainnet })
    const evm = new EVM({
      common,
    })
    const addressStr = '0000000000000000000000000000000000000005'
    const MODEXP = getActivePrecompiles(common).get(addressStr)!

    function getData(
      bLen: bigint,
      eLen: bigint,
      mLen: bigint,
      b: bigint,
      e: bigint,
      m: bigint
    ): Uint8Array {
      const bLenBytes = setLengthLeft(bigIntToBytes(bLen), 32)
      const eLenBytes = setLengthLeft(bigIntToBytes(eLen), 32)
      const mLenBytes = setLengthLeft(bigIntToBytes(mLen), 32)
      const bBytes = bigIntToBytes(b)
      const eBytes = bigIntToBytes(e)
      const mBytes = bigIntToBytes(m)

      return concatBytes(bLenBytes, eLenBytes, mLenBytes, bBytes, eBytes, mBytes)
    }

    // Test: [bLen, eLen, mLen, b, e, m, expectedOutput]
    const tests: [bigint, bigint, bigint, bigint, bigint, bigint, Uint8Array][] = [
      [BigInt(0), BigInt(0), BigInt(0), BigInt(0xff), BigInt(0xee), BigInt(0xdd), new Uint8Array()],
      [
        BigInt(0),
        BigInt(0),
        BigInt(1),
        BigInt(0xff),
        BigInt(0xee),
        BigInt(0xdd),
        bigIntToBytes(BigInt(1)),
      ],
    ]

    for (const test of tests) {
      const data = getData(test[0], test[1], test[2], test[3], test[4], test[5])
      const expected = test[6]

      const result = await MODEXP({
        data,
        gasLimit: BigInt(0xffff),
        common,
        _EVM: evm,
      })

      assert.ok(result.exceptionError === undefined)
      assert.deepEqual(result.returnValue, expected, 'test output matches expected output')
    }
  })
})
