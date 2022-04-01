import tape from 'tape'
import VM from '../../src'
import { Address } from 'ethereumjs-util'
import { PrecompileInput } from '../../src/evm/precompiles'
import EVM, { ExecResult } from '../../src/evm/evm'

const sender = new Address(Buffer.from('44'.repeat(20), 'hex'))
const newPrecompile = new Address(Buffer.from('ff'.repeat(20), 'hex'))
const shaAddress = new Address(Buffer.from('0000000000000000000000000000000000000002', 'hex'))
const expectedReturn = Buffer.from('1337', 'hex')
const expectedGas = BigInt(10)

function customPrecompile(_input: PrecompileInput): ExecResult {
  return {
    gasUsed: expectedGas,
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
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: Buffer.from(''),
      caller: sender,
    })
    st.ok(result.execResult.returnValue.equals(expectedReturn), 'return value is correct')
    st.ok(result.execResult.gasUsed === expectedGas, 'gas used is correct')
  })

  t.test('should delete existing precompiles', async (st) => {
    const EVMOverride = await EVM.create({
      customPrecompiles: [
        {
          address: shaAddress,
        },
      ],
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: Buffer.from(''),
      caller: sender,
    })
    st.ok(result.execResult.returnValue.equals(Buffer.from('')), 'return value is correct')
    st.ok(result.execResult.gasUsed === BigInt(0), 'gas used is correct')
  })

  t.test('should add precompiles', async (st) => {
    const EVMOverride = await EVM.create({
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
      data: Buffer.from(''),
      caller: sender,
    })
    st.ok(result.execResult.returnValue.equals(expectedReturn), 'return value is correct')
    st.ok(result.execResult.gasUsed === expectedGas, 'gas used is correct')
  })

  t.test('should not persist changes to precompiles', async (st) => {
    let VMSha = await VM.create()
    const shaResult = await VMSha.evm.runCall({
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
    })
    const result = await EVMOverride.runCall({
      to: shaAddress,
      gasLimit: BigInt(30000),
      data: Buffer.from(''),
      caller: sender,
    })
    // sanity: check we have overridden
    st.ok(result.execResult.returnValue.equals(expectedReturn), 'return value is correct')
    st.ok(result.execResult.gasUsed === expectedGas, 'gas used is correct')
    VMSha = await VM.create()
    const shaResult2 = await VMSha.evm.runCall({
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
      shaResult.execResult.gasUsed === shaResult2.execResult.gasUsed,
      'restored sha precompile - gas correct'
    )
  })
})
