import * as tape from 'tape'
import { Address } from '@ethereumjs/util'
import { PrecompileInput } from '../../src/precompiles'
import EVM, { ExecResult } from '../../src/evm'
import { getEEI } from '../utils'

const sender = new Address(Buffer.from('44'.repeat(20), 'hex'))
const newPrecompile = new Address(Buffer.from('ff'.repeat(20), 'hex'))
const shaAddress = new Address(Buffer.from('0000000000000000000000000000000000000002', 'hex'))
const expectedReturn = Buffer.from('1337', 'hex')
const expectedGas = BigInt(10)

function customPrecompile(_input: PrecompileInput): ExecResult {
  return {
    executionGasUsed: expectedGas,
    returnValue: expectedReturn,
  }
}

tape('EVM -> custom precompiles', (t) => {
  t.test('should override existing precompiles', async (st) => {
    const EVMOverride = await EVM.create({
      customPrecompiles: [
        {
          address: shaAddress,
          function: customPrecompile,
        },
      ],
      eei: await getEEI(),
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: Buffer.from(''),
      caller: sender,
    })
    st.ok(result.execResult.returnValue.equals(expectedReturn), 'return value is correct')
    st.ok(result.execResult.executionGasUsed === expectedGas, 'gas used is correct')
  })

  t.test('should delete existing precompiles', async (st) => {
    const EVMOverride = await EVM.create({
      customPrecompiles: [
        {
          address: shaAddress,
        },
      ],
      eei: await getEEI(),
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: Buffer.from(''),
      caller: sender,
    })
    st.ok(result.execResult.returnValue.equals(Buffer.from('')), 'return value is correct')
    st.ok(result.execResult.executionGasUsed === BigInt(0), 'gas used is correct')
  })

  t.test('should add precompiles', async (st) => {
    const EVMOverride = await EVM.create({
      customPrecompiles: [
        {
          address: newPrecompile,
          function: customPrecompile,
        },
      ],
      eei: await getEEI(),
    })
    const result = await EVMOverride.runCall({
      to: newPrecompile,
      gasLimit: BigInt(30000),
      data: Buffer.from(''),
      caller: sender,
    })
    st.ok(result.execResult.returnValue.equals(expectedReturn), 'return value is correct')
    st.ok(result.execResult.executionGasUsed === expectedGas, 'gas used is correct')
  })

  t.test('should not persist changes to precompiles', async (st) => {
    let EVMSha = await EVM.create({ eei: await getEEI() })
    const shaResult = await EVMSha.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: Buffer.from(''),
      caller: sender,
    })
    const EVMOverride = await EVM.create({
      customPrecompiles: [
        {
          address: shaAddress,
          function: customPrecompile,
        },
      ],
      eei: await getEEI(),
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: Buffer.from(''),
      caller: sender,
    })
    // sanity: check we have overridden
    st.ok(result.execResult.returnValue.equals(expectedReturn), 'return value is correct')
    st.ok(result.execResult.executionGasUsed === expectedGas, 'gas used is correct')
    EVMSha = await EVM.create({ eei: await getEEI() })
    const shaResult2 = await EVMSha.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: Buffer.from(''),
      caller: sender,
    })
    st.ok(
      shaResult.execResult.returnValue.equals(shaResult2.execResult.returnValue),
      'restored sha precompile - returndata correct'
    )
    st.ok(
      shaResult.execResult.executionGasUsed === shaResult2.execResult.executionGasUsed,
      'restored sha precompile - gas correct'
    )
  })
})
