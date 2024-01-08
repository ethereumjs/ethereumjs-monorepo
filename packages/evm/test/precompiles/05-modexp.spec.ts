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

  it('should run testdata', async () => {
    let n = 0
    for (const [input, expect] of fuzzerTests) {
      n++
      const result = await MODEXP({
        data: hexToBytes(input),
        gasLimit: BigInt(0xffff),
        common,
        _EVM: evm,
      })
      const oput = bytesToHex(result.returnValue)
      assert.equal(oput, expect)
    }
  })

  it('should correctly right-pad data if input length is too short', async () => {
    const gas = BigInt(0xffff)
    const result = await MODEXP({
      data: hexToBytes('0x41'),
      gasLimit: gas,
      common,
      _EVM: evm,
    })
    assert.ok(result.executionGasUsed === gas)
  })
})
