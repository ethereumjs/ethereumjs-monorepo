import tape from 'tape'
import VM from '../../../src'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Account, Address, BN } from 'ethereumjs-util'
import { Transaction } from '@ethereumjs/tx'

const TLOAD = 'b3'
const TSTORE = 'b4'

interface Test {
  code: string
  steps: { expectedOpcode: string; expectedGasUsed: number; expectedStack: BN[] }[]
}

tape('EIP 1153: transient storage', (t) => {
  const initialGas = new BN(0xffffffffff)
  const address = new Address(Buffer.from('000000000000000000000000636F6E7472616374', 'hex'))
  const senderKey = Buffer.from(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex'
  )
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [1153] })

  const runTest = async function (test: Test, st: tape.Test) {
    let i = 0
    let currentGas = initialGas
    const vm = new VM({ common })

    vm.on('step', function (step: any) {
      const gasUsed = currentGas.sub(step.gasLeft)
      currentGas = step.gasLeft

      st.equal(
        step.opcode.name,
        test.steps[i].expectedOpcode,
        `Expected Opcode: ${test.steps[i].expectedOpcode}`
      )

      st.deepEqual(
        step.stack.map((e: BN) => e.toString()),
        test.steps[i].expectedStack.map((e: BN) => e.toString()),
        `Expected stack: ${step.stack}`
      )

      if (i > 0) {
        const expectedGasUsed = new BN(test.steps[i - 1].expectedGasUsed)
        st.equal(
          true,
          gasUsed.eq(expectedGasUsed),
          `Opcode: ${
            test.steps[i - 1].expectedOpcode
          }, Gas Used: ${gasUsed}, Expected: ${expectedGasUsed}`
        )
      }
      i++
    })

    await vm.stateManager.putContractCode(address, Buffer.from(test.code, 'hex'))

    const unsignedTx = Transaction.fromTxData({
      gasLimit: new BN(21000 + 9000),
      to: address,
      value: new BN(1),
    })

    const initialBalance = new BN(10).pow(new BN(18))
    const account = await vm.stateManager.getAccount(address)

    await vm.stateManager.putAccount(
      Address.fromPrivateKey(senderKey),
      Account.fromAccountData({ ...account, balance: initialBalance })
    )

    const tx = unsignedTx.sign(senderKey)

    return vm.runTx({ tx })
  }

  t.test('should tload and tstore', async (st) => {
    const code = '60026001' + TSTORE + '6001' + TLOAD + '600052' + '602060' + '00F3'
    const returndata = Buffer.alloc(32)
    returndata[31] = 0x02

    const test = {
      code: code,
      steps: [
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [new BN(2)] },
        { expectedOpcode: 'TSTORE', expectedGasUsed: 100, expectedStack: [new BN(2), new BN(1)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'TLOAD', expectedGasUsed: 100, expectedStack: [new BN(1)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [new BN(2)] },
        { expectedOpcode: 'MSTORE', expectedGasUsed: 6, expectedStack: [new BN(2), new BN(0)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [new BN(32)] },
        { expectedOpcode: 'RETURN', expectedGasUsed: NaN, expectedStack: [new BN(32), new BN(0)] },
      ],
    }

    const result = await runTest(test, st)
    st.deepEqual(returndata, result.execResult.returnValue)
    st.equal(undefined, result.execResult.exceptionError)
    st.end()
  })

  t.test('tload should not keep reverted changes', async (st) => {
    // logic address has a contract with transient storage logic in it
    const logicAddress = new Address(Buffer.from('EA674fdDe714fd979de3EdF0F56AA9716B898ec8', 'hex'))
    // calling address is the address that calls the logic address
    const callingAddress = new Address(Buffer.alloc(20, 0xff))

    const logicCode =
      '36600080376000518063afc874d214630000003457806362fdb9be14630000003f57806343ac1c3914630000004a5760006000fd5b60ff6000b460006000fd5b60aa6000b460006000f35b6000b360005260206000f3'
    const callingCode =
      '6362fdb9be600052602060006020600060007f000000000000000000000000ea674fdde714fd979de3edf0f56aa9716b898ec861fffff163afc874d2600052602060006020600060007f000000000000000000000000ea674fdde714fd979de3edf0f56aa9716b898ec861fffff16343ac1c39600052602060006020600060007f000000000000000000000000ea674fdde714fd979de3edf0f56aa9716b898ec861fffff1366000803760206000f3'

    const vm = new VM({ common })
    await vm.stateManager.putContractCode(logicAddress, Buffer.from(logicCode, 'hex'))
    await vm.stateManager.putContractCode(callingAddress, Buffer.from(callingCode, 'hex'))

    const unsignedTx = Transaction.fromTxData({
      gasLimit: new BN(15000000),
      to: callingAddress,
    })

    const tx = unsignedTx.sign(senderKey)
    const result = await vm.runTx({ tx, skipBalance: true })

    st.deepEqual(new BN(result.execResult.returnValue).toNumber(), 0xaa)
    st.end()
  })
})
