import * as tape from 'tape'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Account, Address, privateToAddress } from '@ethereumjs/util'
import { Transaction } from '@ethereumjs/tx'
import { EVM } from '@ethereumjs/evm'
import { VM } from '../../../src/vm'

interface Test {
  steps: { expectedOpcode: string; expectedGasUsed: number; expectedStack: bigint[] }[]
  contracts: { address: Address; code?: string; storage?: { key: string; value: string }[] }[]
  transactions: Transaction[]
}

const senderKey = Buffer.from(
  'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  'hex'
)

tape('EIP 2330: extsload', (t) => {
  const initialGas = BigInt(0xffffffffff)
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [2330] })

  const runTest = async function (test: Test, st: tape.Test) {
    let i = 0
    let currentGas = initialGas
    const vm = await VM.create({ common })

    ;(<EVM>vm.evm).on('step', function (step: any) {
      const gasUsed = currentGas - step.gasLeft
      currentGas = step.gasLeft

      st.equal(
        step.opcode.name,
        test.steps[i].expectedOpcode,
        `Expected Opcode: ${test.steps[i].expectedOpcode}`
      )

      st.deepEqual(
        step.stack.map((e: bigint) => e.toString()),
        test.steps[i].expectedStack.map((e: bigint) => e.toString()),
        `Expected stack: ${step.stack}`
      )

      if (i > 0) {
        const expectedGasUsed = BigInt(test.steps[i - 1].expectedGasUsed)
        st.ok(
          gasUsed === expectedGasUsed,
          `Opcode: ${
            test.steps[i - 1].expectedOpcode
          }, Gas Used: ${gasUsed}, Expected: ${expectedGasUsed}`
        )
      }
      i++
    })

    for (const { code, address, storage } of test.contracts) {
      if (code !== undefined) {
        await vm.stateManager.putContractCode(address, Buffer.from(code, 'hex'))
      }

      if (storage) {
        for (const { key, value } of storage) {
          await vm.stateManager.putContractStorage(
            address,
            Buffer.from(key, 'hex'),
            Buffer.from(value, 'hex')
          )
        }
      }
    }

    const fromAddress = new Address(privateToAddress(senderKey))
    await vm.stateManager.putAccount(fromAddress, new Account(BigInt(0), BigInt(0xfffffffff)))
    const results = []
    for (const tx of test.transactions) {
      const result = await vm.runTx({ tx, skipBalance: true })
      results.push(result)
    }

    return results
  }

  t.test('should extsload other contract storage', async (st) => {
    const code = '6001626265625c60005260206000f3'
    const returndata = Buffer.from('2'.padStart(64, '0'), 'hex')

    // contract1 is triggered and it attempts to read storage from contract2
    const contract1 = new Address(Buffer.from('626f62'.padStart(40, '0'), 'hex'))
    const contract2 = new Address(Buffer.from('626562'.padStart(40, '0'), 'hex'))

    const tx = Transaction.fromTxData({
      gasLimit: BigInt(21000 + 9000),
      to: contract1,
      value: BigInt(1),
    }).sign(senderKey)

    const test = {
      contracts: [
        { address: contract1, code },
        {
          address: contract2,
          storage: [{ key: '1'.padStart(64, '0'), value: '2'.padStart(64, '0') }],
        },
      ],
      transactions: [tx],
      steps: [
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH3', expectedGasUsed: 3, expectedStack: [BigInt(1)] },
        {
          expectedOpcode: 'EXTSLOAD',
          expectedGasUsed: 4700,
          expectedStack: [BigInt(1), BigInt(0x626562)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(2)] },
        { expectedOpcode: 'MSTORE', expectedGasUsed: 6, expectedStack: [BigInt(2), BigInt(0)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(32)] },
        { expectedOpcode: 'RETURN', expectedGasUsed: NaN, expectedStack: [BigInt(32), BigInt(0)] },
      ],
    }

    const result = await runTest(test, st)
    st.deepEqual(result[0].execResult.returnValue, returndata, 'return value should be proper')
    st.equal(result[0].execResult.exceptionError, undefined, 'should not result an exception error')
    st.end()
  })
})
