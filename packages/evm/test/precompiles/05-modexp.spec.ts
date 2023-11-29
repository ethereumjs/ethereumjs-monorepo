import { Chain, Common } from '@ethereumjs/common'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EVM, getActivePrecompiles } from '../../src/index.js'

import fuzzer from './modexp-testdata.json'

const fuzzerTests = fuzzer.data
describe('Precompiles: MODEXP', () => {
  const common = new Common({ chain: Chain.Mainnet })
  const evm = new EVM({
    common,
  })
  const addressStr = '0000000000000000000000000000000000000005'
  const MODEXP = getActivePrecompiles(common).get(addressStr)!

  let n = 0
  for (const [input, expect] of fuzzerTests) {
    n++
    it(`MODEXP edge cases (issue 3168) - case ${n}`, async () => {
      const result = await MODEXP({
        data: hexToBytes(input),
        gasLimit: BigInt(0xffff),
        common,
        _EVM: evm,
      })
      const oput = bytesToHex(result.returnValue)
      assert.equal(oput, expect)
    })
  }
})
