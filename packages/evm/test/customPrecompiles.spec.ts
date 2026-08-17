import {
  Address,
  bigIntToBytes,
  bytesToBigInt,
  createZeroAddress,
  hexToBytes,
  setLengthLeft,
  utf8ToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { type PrecompileInput, createEVM } from '../src/index.ts'

import type { ExecResult } from '../src/types.ts'

const sender = new Address(hexToBytes(`0x${'44'.repeat(20)}`))
const newPrecompile = new Address(hexToBytes(`0x${'ff'.repeat(20)}`))
const shaAddress = new Address(hexToBytes('0x0000000000000000000000000000000000000002'))
const expectedReturn = utf8ToBytes('1337')
const expectedGas = BigInt(10)

function customPrecompile(_input: PrecompileInput): ExecResult {
  return {
    executionGasUsed: expectedGas,
    returnValue: expectedReturn,
  }
}

function customPrecompileNoInput(): ExecResult {
  return {
    executionGasUsed: expectedGas,
    returnValue: expectedReturn,
  }
}

describe('EVM -> custom precompiles', () => {
  it('should work on precompiles without input arguments', async () => {
    const EVMOverride = await createEVM({
      customPrecompiles: [
        {
          address: createZeroAddress(),
          function: customPrecompileNoInput,
        },
      ],
    })
    const result = await EVMOverride.runCall({
      to: createZeroAddress(),
      gasLimit: BigInt(30000),
      data: utf8ToBytes(''),
      caller: sender,
    })

    assert.deepEqual(result.execResult.returnValue, expectedReturn, 'return value is correct')
    assert.strictEqual(result.execResult.executionGasUsed, expectedGas, 'gas used is correct')
  })
  it('should override existing precompiles', async () => {
    const EVMOverride = await createEVM({
      customPrecompiles: [
        {
          address: shaAddress,
          function: customPrecompile,
        },
      ],
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: utf8ToBytes(''),
      caller: sender,
    })

    assert.deepEqual(result.execResult.returnValue, expectedReturn, 'return value is correct')
    assert.strictEqual(result.execResult.executionGasUsed, expectedGas, 'gas used is correct')
  })

  it('should delete existing precompiles', async () => {
    const EVMOverride = await createEVM({
      customPrecompiles: [
        {
          address: shaAddress,
        },
      ],
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: hexToBytes('0x'),
      caller: sender,
    })
    assert.deepEqual(result.execResult.returnValue, utf8ToBytes(''), 'return value is correct')
    assert.strictEqual(result.execResult.executionGasUsed, BigInt(0), 'gas used is correct')
  })

  it('should add precompiles', async () => {
    const EVMOverride = await createEVM({
      customPrecompiles: [
        {
          address: newPrecompile,
          function: customPrecompile,
        },
      ],
    })
    const result = await EVMOverride.runCall({
      to: newPrecompile,
      gasLimit: BigInt(30000),
      data: hexToBytes('0x'),
      caller: sender,
    })
    assert.deepEqual(result.execResult.returnValue, expectedReturn, 'return value is correct')
    assert.strictEqual(result.execResult.executionGasUsed, expectedGas, 'gas used is correct')
  })

  it('should not persist changes to precompiles', async () => {
    let EVMSha = await createEVM()
    const shaResult = await EVMSha.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: hexToBytes('0x'),
      caller: sender,
    })
    const EVMOverride = await createEVM({
      customPrecompiles: [
        {
          address: shaAddress,
          function: customPrecompile,
        },
      ],
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: hexToBytes('0x'),
      caller: sender,
    })
    // sanity: check we have overridden
    assert.deepEqual(result.execResult.returnValue, expectedReturn, 'return value is correct')
    assert.strictEqual(result.execResult.executionGasUsed, expectedGas, 'gas used is correct')
    EVMSha = await createEVM()
    const shaResult2 = await EVMSha.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: hexToBytes('0x'),
      caller: sender,
    })
    assert.deepEqual(
      shaResult.execResult.returnValue,
      shaResult2.execResult.returnValue,
      'restored sha precompile - returndata correct',
    )
    assert.strictEqual(
      shaResult.execResult.executionGasUsed,
      shaResult2.execResult.executionGasUsed,
      'restored sha precompile - gas correct',
    )
  })
  it('should copy custom precompiles', async () => {
    const evm = await createEVM({
      customPrecompiles: [
        {
          address: shaAddress,
          function: customPrecompile,
        },
      ],
    })
    const evmCopy = evm.shallowCopy()
    assert.deepEqual(
      (evm as any)._customPrecompiles,
      (evmCopy as any)._customPrecompiles,
      'evm.shallowCopy() successfully copied customPrecompiles option',
    )
  })

  it('should accept PrefixedHexString addresses for custom precompiles', async () => {
    const addressHex = '0x000000000000000000000000000000000000ff01'
    const evm = await createEVM({
      customPrecompiles: [
        {
          address: addressHex,
          function: customPrecompile,
        },
      ],
    })
    const result = await evm.runCall({
      to: new Address(hexToBytes(addressHex)),
      gasLimit: BigInt(30000),
      data: hexToBytes('0x'),
      caller: sender,
    })
    assert.deepEqual(result.execResult.returnValue, expectedReturn, 'return value is correct')
    assert.strictEqual(result.execResult.executionGasUsed, expectedGas, 'gas used is correct')
  })

  it('should delete precompiles using PrefixedHexString addresses', async () => {
    const evm = await createEVM({
      customPrecompiles: [
        {
          address: '0x0000000000000000000000000000000000000002',
        },
      ],
    })
    const result = await evm.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: hexToBytes('0x'),
      caller: sender,
    })
    assert.deepEqual(result.execResult.returnValue, utf8ToBytes(''), 'return value is correct')
    assert.strictEqual(result.execResult.executionGasUsed, BigInt(0), 'gas used is correct')
  })

  it('getPrecompile() should retrieve precompile by Address', async () => {
    const evm = await createEVM()
    const shaPrecompile = evm.getPrecompile(shaAddress)
    assert.notStrictEqual(shaPrecompile, undefined, 'SHA256 precompile found by Address')

    const missing = evm.getPrecompile(new Address(hexToBytes(`0x${'ee'.repeat(20)}`)))
    assert.strictEqual(missing, undefined, 'returns undefined for non-existent address')
  })

  it('getPrecompile() should retrieve precompile by PrefixedHexString', async () => {
    const evm = await createEVM()
    const shaPrecompile = evm.getPrecompile('0x0000000000000000000000000000000000000002')
    assert.notStrictEqual(shaPrecompile, undefined, 'SHA256 precompile found by hex string')

    const missing = evm.getPrecompile(`0x${'ee'.repeat(20)}`)
    assert.strictEqual(missing, undefined, 'returns undefined for non-existent address')
  })

  it('getPrecompile() should retrieve custom precompiles', async () => {
    const addressHex = '0x000000000000000000000000000000000000ff01'
    const evm = await createEVM({
      customPrecompiles: [
        {
          address: addressHex,
          function: customPrecompile,
        },
      ],
    })
    const fn = evm.getPrecompile(addressHex)
    assert.notStrictEqual(fn, undefined, 'custom precompile found')
    assert.strictEqual(fn, customPrecompile, 'returns the registered function')
  })

  it('should run a custom addition precompile end-to-end', async () => {
    const ADDITION_GAS = 15n
    function additionPrecompile(input: PrecompileInput): ExecResult {
      const a = bytesToBigInt(input.data.subarray(0, 32))
      const b = bytesToBigInt(input.data.subarray(32, 64))
      const sum = (a + b) % 2n ** 256n
      return {
        executionGasUsed: ADDITION_GAS,
        returnValue: setLengthLeft(bigIntToBytes(sum), 32),
      }
    }

    const address = '0x000000000000000000000000000000000000ff01'
    const evm = await createEVM({
      customPrecompiles: [{ address, function: additionPrecompile }],
    })

    const a = setLengthLeft(bigIntToBytes(7n), 32)
    const b = setLengthLeft(bigIntToBytes(35n), 32)
    const callData = new Uint8Array(64)
    callData.set(a, 0)
    callData.set(b, 32)

    const result = await evm.runCall({
      to: new Address(hexToBytes(address)),
      gasLimit: BigInt(30000),
      data: callData,
      caller: sender,
    })

    assert.strictEqual(result.execResult.executionGasUsed, ADDITION_GAS, 'gas used is correct')
    const sum = bytesToBigInt(result.execResult.returnValue)
    assert.strictEqual(sum, 42n, 'addition result is correct')
  })
})
