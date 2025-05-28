import { Common, Mainnet } from '@ethereumjs/common'
import {
  BIGINT_1,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  hexToBytes,
  randomBytes,
  setLengthLeft,
  setLengthRight,
  toBytes,
} from '@ethereumjs/util'
import { assert, beforeAll, describe, it } from 'vitest'

import { gasLimitCheck } from '../../src/precompiles/util.ts'

import { createEVM, getActivePrecompiles } from '../../src/index.ts'
import {
  expMod,
  getAdjustedExponentLength,
  multiplicationComplexity,
  multiplicationComplexityEIP2565,
} from '../../src/precompiles/05-modexp.ts'
import { getPrecompileName } from '../../src/precompiles/index.ts'
import { testData } from './modexp-testdata.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { EVM } from '../../src/index.ts'
import type { PrecompileFunc, PrecompileInput } from '../../src/precompiles/types.ts'

const BIGINT_200 = BigInt(200)

const fuzzerTests = testData.data as PrefixedHexString[][]
describe('Precompiles: MODEXP', () => {
  let common: Common
  let evm: EVM
  let addressStr: string
  let MODEXP: PrecompileFunc
  beforeAll(async () => {
    common = new Common({ chain: Mainnet })
    evm = await createEVM({
      common,
    })
    addressStr = '0000000000000000000000000000000000000005'
    MODEXP = getActivePrecompiles(common).get(addressStr)!
  })

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
      const output = bytesToHex(result.returnValue)
      assert.strictEqual(output, expect)
    })
  }

  it('should correctly right-pad data if input length is too short', async () => {
    const gas = BigInt(0xffff)
    const result = await MODEXP({
      data: hexToBytes('0x41'),
      gasLimit: gas,
      common,
      _EVM: evm,
    })
    assert.strictEqual(result.executionGasUsed, gas)
  })
})

function enoughGas(opts: PrecompileInput): boolean {
  const pName = getPrecompileName('05')
  const data = opts.data.length < 96 ? setLengthRight(opts.data, 96) : opts.data

  let adjustedELen = getAdjustedExponentLength(data, opts)
  if (adjustedELen < BIGINT_1) {
    adjustedELen = BIGINT_1
  }

  const bLen = bytesToBigInt(data.subarray(0, 32))
  const mLen = bytesToBigInt(data.subarray(64, 96))

  let maxLen = bLen
  if (maxLen < mLen) {
    maxLen = mLen
  }
  const Gquaddivisor = opts.common.param('modexpGquaddivisorGas')
  let gasUsed

  if (!(opts.common.isActivatedEIP(2565) === true)) {
    gasUsed = (adjustedELen * multiplicationComplexity(maxLen)) / Gquaddivisor
  } else {
    gasUsed = (adjustedELen * multiplicationComplexityEIP2565(maxLen)) / Gquaddivisor
    if (gasUsed < BIGINT_200) {
      gasUsed = BIGINT_200
    }
  }
  if (!(gasLimitCheck(opts, gasUsed, pName) === true)) {
    return false
  }
  return true
}

describe('Precompiles: MODEXP with EIP-7823', async () => {
  const common = new Common({ chain: Mainnet, eips: [7823] })
  const evm = await createEVM({
    common,
  })
  const addressStr = '0000000000000000000000000000000000000005'
  const MODEXP = getActivePrecompiles(common).get(addressStr)!

  for (let i = 1020; i < 1028; i++) {
    const bLen = i
    const eLen = i
    const mLen = i
    const maxInputLen = Math.max(bLen, eLen, mLen)
    const base = randomBytes(bLen)
    const exponent = randomBytes(eLen)
    const modulo = randomBytes(mLen)
    const expected = expMod(bytesToBigInt(base), bytesToBigInt(exponent), bytesToBigInt(modulo))
    const input = concatBytes(
      setLengthLeft(toBytes(bLen), 32),
      setLengthLeft(toBytes(eLen), 32),
      setLengthLeft(toBytes(mLen), 32),
      concatBytes(base, exponent, modulo),
    )

    it(`MODEXP should reject and consume all gas for inputs over 8192 bits in length - case ${maxInputLen} bytes`, async () => {
      const opts = {
        data: input,
        gasLimit: BigInt(0xffffffff),
        common,
        _EVM: evm,
      }

      // sanity check to make sure there is enough gas in order to isolate error to cases causing OOG due to size limit of inputs
      while (!enoughGas(opts)) opts.gasLimit *= BigInt(256)

      const result = await MODEXP(opts)

      if (maxInputLen > 1024) {
        assert.strictEqual(result.exceptionError?.error, 'out of gas')
      } else {
        assert.deepEqual(result.returnValue, bigIntToBytes(expected))
      }
    })
  }
})
