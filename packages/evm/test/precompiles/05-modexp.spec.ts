import { Common, Mainnet } from '@ethereumjs/common'
import {
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  hexToBytes,
  randomBytes,
  setLengthLeft,
  toBytes,
} from '@ethereumjs/util'
import { assert, beforeAll, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.ts'

import { testData } from './modexp-testdata.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { EVM } from '../../src/index.ts'
import type { PrecompileFunc } from '../../src/precompiles/types.ts'

/**
 * Compute base^exp mod modulus for *arbitrarily* large BigInts
 */
function modPow(base: bigint, exp: bigint, modulus: bigint): bigint {
  if (modulus === 0n) throw new RangeError('modulus must be non-zero')
  let result = 1n
  let b = base % modulus
  let e = exp

  while (e > 0n) {
    if (e & 1n) {
      result = (result * b) % modulus
    }
    b = (b * b) % modulus
    e >>= 1n
  }

  return result
}

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
    const expected = modPow(bytesToBigInt(base), bytesToBigInt(exponent), bytesToBigInt(modulo))
    const input = concatBytes(
      setLengthLeft(toBytes(bLen), 32),
      setLengthLeft(toBytes(eLen), 32),
      setLengthLeft(toBytes(mLen), 32),
      concatBytes(base, exponent, modulo),
    )

    it(`MODEXP should reject and consume all gas for inputs over 8192 bits in length - case ${maxInputLen} bytes`, async () => {
      const result = await MODEXP({
        data: input,
        gasLimit: BigInt(0xffffffff),
        common,
        _EVM: evm,
      })

      if (maxInputLen > 1024) {
        assert.strictEqual(result.exceptionError?.error, 'out of gas')
      } else {
        assert.deepEqual(result.returnValue, bigIntToBytes(expected))
      }
    })
  }
})
