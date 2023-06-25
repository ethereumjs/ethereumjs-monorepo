import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Address } from '@ethereumjs/util'
import { hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils.js'
import { assert, describe, it } from 'vitest'

import { EVM } from '../src/evm.js'

import type { ExecResult } from '../src/evm.js'
import type { PrecompileInput } from '../src/index.js'

const sender = new Address(hexToBytes('44'.repeat(20)))
const newPrecompile = new Address(hexToBytes('ff'.repeat(20)))
const shaAddress = new Address(hexToBytes('0000000000000000000000000000000000000002'))
const expectedReturn = utf8ToBytes('1337')
const expectedGas = BigInt(10)

function customPrecompile(_input: PrecompileInput): ExecResult {
  return {
    executionGasUsed: expectedGas,
    returnValue: expectedReturn,
  }
}

describe('EVM -> custom precompiles', () => {
  it('should override existing precompiles', async () => {
    const EVMOverride = await EVM.create({
      customPrecompiles: [
        {
          address: shaAddress,
          function: customPrecompile,
        },
      ],
      stateManager: new DefaultStateManager(),
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: utf8ToBytes(''),
      caller: sender,
    })

    assert.deepEqual(result.execResult.returnValue, expectedReturn, 'return value is correct')
    assert.equal(result.execResult.executionGasUsed, expectedGas, 'gas used is correct')
  })

  it('should delete existing precompiles', async () => {
    const EVMOverride = await EVM.create({
      customPrecompiles: [
        {
          address: shaAddress,
        },
      ],
      stateManager: new DefaultStateManager(),
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: hexToBytes(''),
      caller: sender,
    })
    assert.deepEqual(result.execResult.returnValue, utf8ToBytes(''), 'return value is correct')
    assert.equal(result.execResult.executionGasUsed, BigInt(0), 'gas used is correct')
  })

  it('should add precompiles', async () => {
    const EVMOverride = await EVM.create({
      customPrecompiles: [
        {
          address: newPrecompile,
          function: customPrecompile,
        },
      ],
      stateManager: new DefaultStateManager(),
    })
    const result = await EVMOverride.runCall({
      to: newPrecompile,
      gasLimit: BigInt(30000),
      data: hexToBytes(''),
      caller: sender,
    })
    assert.deepEqual(result.execResult.returnValue, expectedReturn, 'return value is correct')
    assert.equal(result.execResult.executionGasUsed, expectedGas, 'gas used is correct')
  })

  it('should not persist changes to precompiles', async () => {
    let EVMSha = await EVM.create({
      stateManager: new DefaultStateManager(),
    })
    const shaResult = await EVMSha.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: hexToBytes(''),
      caller: sender,
    })
    const EVMOverride = await EVM.create({
      customPrecompiles: [
        {
          address: shaAddress,
          function: customPrecompile,
        },
      ],
      stateManager: new DefaultStateManager(),
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: hexToBytes(''),
      caller: sender,
    })
    // sanity: check we have overridden
    assert.deepEqual(result.execResult.returnValue, expectedReturn, 'return value is correct')
    assert.ok(result.execResult.executionGasUsed === expectedGas, 'gas used is correct')
    EVMSha = await EVM.create({
      stateManager: new DefaultStateManager(),
    })
    const shaResult2 = await EVMSha.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: hexToBytes(''),
      caller: sender,
    })
    assert.deepEqual(
      shaResult.execResult.returnValue,
      shaResult2.execResult.returnValue,
      'restored sha precompile - returndata correct'
    )
    assert.equal(
      shaResult.execResult.executionGasUsed,
      shaResult2.execResult.executionGasUsed,
      'restored sha precompile - gas correct'
    )
  })
  it('shold copy custom precompiles', async () => {
    const evm = await EVM.create({
      customPrecompiles: [
        {
          address: shaAddress,
          function: customPrecompile,
        },
      ],
      stateManager: new DefaultStateManager(),
    })
    const evmCopy = evm.copy()
    assert.deepEqual(
      (evm as any)._customPrecompiles,
      (evmCopy as any)._customPrecompiles,
      'evm.copy() successfully copied customPrecompiles option'
    )
  })
})
