import tape from 'tape'
import VM from '../../../src'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Account, Address, bufferToInt, privateToAddress } from 'ethereumjs-util'
import { Transaction } from '@ethereumjs/tx'

interface Test {
  steps: { expectedOpcode: string; expectedGasUsed: number; expectedStack: bigint[] }[]
  contracts: { code: string; address: Address }[]
  transactions: Transaction[]
}

const senderKey = Buffer.from(
  'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  'hex'
)

tape('EIP 1153: transient storage', (t) => {
  const initialGas = BigInt(0xffffffffff)
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [1153] })

  const runTest = async function (test: Test, st: tape.Test) {
    let i = 0
    let currentGas = initialGas
    const vm = new (VM as any)({ common })

    vm.evm.on('step', function (step: any) {
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

    for (const { code, address } of test.contracts) {
      await vm.stateManager.putContractCode(address, Buffer.from(code, 'hex'))
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

  t.test('should tload and tstore', async (st) => {
    const code = '60026001b46001b360005260206000F3'
    const returndata = Buffer.alloc(32)
    returndata[31] = 0x02

    const address = new Address(Buffer.from('000000000000000000000000636F6E7472616374', 'hex'))
    const tx = Transaction.fromTxData({
      gasLimit: BigInt(21000 + 9000),
      to: address,
      value: BigInt(1),
    }).sign(senderKey)

    const test = {
      contracts: [{ address, code }],
      transactions: [tx],
      steps: [
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(2)] },
        { expectedOpcode: 'TSTORE', expectedGasUsed: 100, expectedStack: [BigInt(2), BigInt(1)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'TLOAD', expectedGasUsed: 100, expectedStack: [BigInt(1)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(2)] },
        { expectedOpcode: 'MSTORE', expectedGasUsed: 6, expectedStack: [BigInt(2), BigInt(0)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(32)] },
        { expectedOpcode: 'RETURN', expectedGasUsed: NaN, expectedStack: [BigInt(32), BigInt(0)] },
      ],
    }

    const result = await runTest(test, st)
    st.deepEqual(returndata, result[0].execResult.returnValue)
    st.equal(undefined, result[0].execResult.exceptionError)
    st.end()
  })

  t.test('should clear between transactions', async (st) => {
    // If calldata size is 0, do a tload and return the value
    // at key 0. If calldata size is nonzero, do a tstore at
    // key 0. Send a transaction with nonzero calldata first
    // and then send a second transaction with zero calldata
    // and then assert that the returndata is 0. If the returndata
    // is 0, then the transient storage is cleared between
    // transactions
    const code = '36600014630000001c5760016300000012575b60ff6000b4600080f35b6000b360005260206000f3'
    const address = new Address(Buffer.from('000000000000000000000000636F6E7472616374', 'hex'))

    const test = {
      contracts: [{ address, code }],
      transactions: [
        Transaction.fromTxData({
          gasLimit: BigInt(15000000),
          to: address,
          data: Buffer.alloc(32),
        }).sign(senderKey),
        Transaction.fromTxData({
          nonce: 1,
          gasLimit: BigInt(15000000),
          to: address,
        }).sign(senderKey),
      ],
      steps: [
        // first tx
        { expectedOpcode: 'CALLDATASIZE', expectedGasUsed: 2, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(32)] },
        { expectedOpcode: 'EQ', expectedGasUsed: 3, expectedStack: [BigInt(32), BigInt(0)] },
        { expectedOpcode: 'PUSH4', expectedGasUsed: 3, expectedStack: [BigInt(0)] },
        { expectedOpcode: 'JUMPI', expectedGasUsed: 10, expectedStack: [BigInt(0), BigInt(28)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH4', expectedGasUsed: 3, expectedStack: [BigInt(1)] },
        { expectedOpcode: 'JUMPI', expectedGasUsed: 10, expectedStack: [BigInt(1), BigInt(18)] },
        { expectedOpcode: 'JUMPDEST', expectedGasUsed: 1, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(255)] },
        { expectedOpcode: 'TSTORE', expectedGasUsed: 100, expectedStack: [BigInt(255), BigInt(0)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3, expectedStack: [BigInt(0)] },
        { expectedOpcode: 'RETURN', expectedGasUsed: -278, expectedStack: [BigInt(0), BigInt(0)] },
        // second tx
        { expectedOpcode: 'CALLDATASIZE', expectedGasUsed: 2, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(0)] },
        { expectedOpcode: 'EQ', expectedGasUsed: 3, expectedStack: [BigInt(0), BigInt(0)] },
        { expectedOpcode: 'PUSH4', expectedGasUsed: 3, expectedStack: [BigInt(1)] },
        { expectedOpcode: 'JUMPI', expectedGasUsed: 10, expectedStack: [BigInt(1), BigInt(28)] },
        { expectedOpcode: 'JUMPDEST', expectedGasUsed: 1, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'TLOAD', expectedGasUsed: 100, expectedStack: [BigInt(0)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(0)] },
        { expectedOpcode: 'MSTORE', expectedGasUsed: 6, expectedStack: [BigInt(0), BigInt(0)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(32)] },
        { expectedOpcode: 'RETURN', expectedGasUsed: 3, expectedStack: [BigInt(32), BigInt(0)] },
      ],
    }

    const [result1, result2] = await runTest(test, st)
    st.equal(result1.execResult.exceptionError, undefined)
    st.equal(bufferToInt(result2.execResult.returnValue), 0)
    st.end()
  })

  t.test('tload should not keep reverted changes', async (st) => {
    // logic address has a contract with transient storage logic in it
    const logicAddress = new Address(Buffer.from('EA674fdDe714fd979de3EdF0F56AA9716B898ec8', 'hex'))
    // calling address is the address that calls the logic address
    const callingAddress = new Address(Buffer.alloc(20, 0xff))

    // Perform 3 calls:
    // - TSTORE, return
    // - TSTORE, revert
    // - TLOAD, return
    // Then return the returndata from the final call and
    // assert that the value that is returned is the value set in the
    // first call. This asserts that reverts are handled correctly.

    const logicCode =
      '36600080376000518063afc874d214630000003457806362fdb9be14630000003f57806343ac1c3914630000004a5760006000fd5b60ff6000b460006000fd5b60aa6000b460006000f35b6000b360005260206000f3'
    const callingCode =
      '6362fdb9be600052602060006020600060007f000000000000000000000000ea674fdde714fd979de3edf0f56aa9716b898ec861fffff163afc874d2600052602060006020600060007f000000000000000000000000ea674fdde714fd979de3edf0f56aa9716b898ec861fffff16343ac1c39600052602060006020600060007f000000000000000000000000ea674fdde714fd979de3edf0f56aa9716b898ec861fffff1366000803760206000f3'

    const unsignedTx = Transaction.fromTxData({
      gasLimit: BigInt(15000000),
      to: callingAddress,
    })

    const tx = unsignedTx.sign(senderKey)

    const test = {
      contracts: [
        { address: logicAddress, code: logicCode },
        { address: callingAddress, code: callingCode },
      ],
      transactions: [tx],
      steps: [
        { expectedOpcode: 'PUSH4', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(1660795326)] },
        {
          expectedOpcode: 'MSTORE',
          expectedGasUsed: 6,
          expectedStack: [BigInt(1660795326), BigInt(0)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(32)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(32), BigInt(0)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(32), BigInt(0), BigInt(32)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(32), BigInt(0), BigInt(32), BigInt(0)],
        },
        {
          expectedOpcode: 'PUSH32',
          expectedGasUsed: 3,
          expectedStack: [BigInt(32), BigInt(0), BigInt(32), BigInt(0), BigInt(0)],
        },
        {
          expectedOpcode: 'PUSH2',
          expectedGasUsed: 3,
          expectedStack: [
            BigInt(32),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(0),
            BigInt('1338207774508379457866452578149304295121587113672'),
          ],
        },
        {
          expectedOpcode: 'CALL',
          expectedGasUsed: 14913432,
          expectedStack: [
            BigInt(32),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(0),
            BigInt('1338207774508379457866452578149304295121587113672'),
            BigInt('65535'),
          ],
        },
        { expectedOpcode: 'CALLDATASIZE', expectedGasUsed: 2, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(32)] },
        //
        { expectedOpcode: 'DUP1', expectedGasUsed: 3, expectedStack: [BigInt(32), BigInt(0)] },
        {
          expectedOpcode: 'CALLDATACOPY',
          expectedGasUsed: 9,
          expectedStack: [BigInt(32), BigInt(0), BigInt(0)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'MLOAD', expectedGasUsed: 3, expectedStack: [BigInt(0)] },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3, expectedStack: [BigInt(1660795326)] },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1660795326), BigInt(1660795326)],
        },
        {
          expectedOpcode: 'EQ',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1660795326), BigInt(1660795326), BigInt(2949149906)],
        },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1660795326), BigInt(0)],
        },
        {
          expectedOpcode: 'JUMPI',
          expectedGasUsed: 10,
          expectedStack: [BigInt(1660795326), BigInt(0), BigInt(52)],
        },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3, expectedStack: [BigInt(1660795326)] },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1660795326), BigInt(1660795326)],
        },
        {
          expectedOpcode: 'EQ',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1660795326), BigInt(1660795326), BigInt(1660795326)],
        },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1660795326), BigInt(1)],
        },
        {
          expectedOpcode: 'JUMPI',
          expectedGasUsed: 10,
          expectedStack: [BigInt(1660795326), BigInt(1), BigInt(63)],
        },
        { expectedOpcode: 'JUMPDEST', expectedGasUsed: 1, expectedStack: [BigInt(1660795326)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(1660795326)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1660795326), BigInt(170)],
        },
        {
          expectedOpcode: 'TSTORE',
          expectedGasUsed: 100,
          expectedStack: [BigInt(1660795326), BigInt(170), BigInt(0)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(1660795326)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1660795326), BigInt(0)],
        },
        {
          expectedOpcode: 'RETURN',
          expectedGasUsed: -14910832,
          expectedStack: [BigInt(1660795326), BigInt(0), BigInt(0)],
        },
        { expectedOpcode: 'PUSH4', expectedGasUsed: 3, expectedStack: [BigInt(1)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(2949149906)],
        },
        {
          expectedOpcode: 'MSTORE',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(2949149906), BigInt(0)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(1)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(1), BigInt(32)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(32), BigInt(0)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(32), BigInt(0), BigInt(32)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(32), BigInt(0), BigInt(32), BigInt(0)],
        },
        {
          expectedOpcode: 'PUSH32',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(32), BigInt(0), BigInt(32), BigInt(0), BigInt(0)],
        },
        {
          expectedOpcode: 'PUSH2',
          expectedGasUsed: 3,
          expectedStack: [
            BigInt(1),
            BigInt(32),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(0),
            BigInt('1338207774508379457866452578149304295121587113672'),
          ],
        },
        {
          expectedOpcode: 'CALL',
          expectedGasUsed: 14910622,
          expectedStack: [
            BigInt(1),
            BigInt(32),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(0),
            BigInt('1338207774508379457866452578149304295121587113672'),
            BigInt(0xffff),
          ],
        },
        { expectedOpcode: 'CALLDATASIZE', expectedGasUsed: 2, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(32)] },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3, expectedStack: [BigInt(32), BigInt(0)] },
        {
          expectedOpcode: 'CALLDATACOPY',
          expectedGasUsed: 9,
          expectedStack: [BigInt(32), BigInt(0), BigInt(0)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'MLOAD', expectedGasUsed: 3, expectedStack: [BigInt(0)] },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3, expectedStack: [BigInt(2949149906)] },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(2949149906), BigInt(2949149906)],
        },
        {
          expectedOpcode: 'EQ',
          expectedGasUsed: 3,
          expectedStack: [BigInt(2949149906), BigInt(2949149906), BigInt(2949149906)],
        },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(2949149906), BigInt(1)],
        },
        {
          expectedOpcode: 'JUMPI',
          expectedGasUsed: 10,
          expectedStack: [BigInt(2949149906), BigInt(1), BigInt(52)],
        },
        { expectedOpcode: 'JUMPDEST', expectedGasUsed: 1, expectedStack: [BigInt(2949149906)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(2949149906)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(2949149906), BigInt(255)],
        },
        {
          expectedOpcode: 'TSTORE',
          expectedGasUsed: 100,
          expectedStack: [BigInt(2949149906), BigInt(255), BigInt(0)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(2949149906)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(2949149906), BigInt(0)],
        },
        {
          expectedOpcode: 'REVERT',
          expectedGasUsed: -14910522,
          expectedStack: [BigInt(2949149906), BigInt(0), BigInt(0)],
        },
        { expectedOpcode: 'PUSH4', expectedGasUsed: 3, expectedStack: [BigInt(1), BigInt(0)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(1135352889)],
        },
        {
          expectedOpcode: 'MSTORE',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(1135352889), BigInt(0)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(1), BigInt(0)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(32)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(32), BigInt(0)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(32), BigInt(0), BigInt(32)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(32), BigInt(0), BigInt(32), BigInt(0)],
        },
        {
          expectedOpcode: 'PUSH32',
          expectedGasUsed: 3,
          expectedStack: [
            BigInt(1),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(0),
          ],
        },
        {
          expectedOpcode: 'PUSH2',
          expectedGasUsed: 3,
          expectedStack: [
            BigInt(1),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(0),
            BigInt('1338207774508379457866452578149304295121587113672'),
          ],
        },
        {
          expectedOpcode: 'CALL',
          expectedGasUsed: 14910334,
          expectedStack: [
            BigInt(1),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(32),
            BigInt(0),
            BigInt(0),
            BigInt('1338207774508379457866452578149304295121587113672'),
            BigInt(0xffff),
          ],
        },
        { expectedOpcode: 'CALLDATASIZE', expectedGasUsed: 2, expectedStack: [] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(32)] },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3, expectedStack: [BigInt(32), BigInt(0)] },
        {
          expectedOpcode: 'CALLDATACOPY',
          expectedGasUsed: 9,
          expectedStack: [BigInt(32), BigInt(0), BigInt(0)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [] },
        { expectedOpcode: 'MLOAD', expectedGasUsed: 3, expectedStack: [BigInt(0)] },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3, expectedStack: [BigInt(1135352889)] },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(1135352889)],
        },
        {
          expectedOpcode: 'EQ',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(1135352889), BigInt(2949149906)],
        },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(0)],
        },
        {
          expectedOpcode: 'JUMPI',
          expectedGasUsed: 10,
          expectedStack: [BigInt(1135352889), BigInt(0), BigInt(52)],
        },
        {
          expectedOpcode: 'DUP1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889)],
        },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(1135352889)],
        },
        {
          expectedOpcode: 'EQ',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(1135352889), BigInt(1660795326)],
        },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(0)],
        },
        {
          expectedOpcode: 'JUMPI',
          expectedGasUsed: 10,
          expectedStack: [BigInt(1135352889), BigInt(0), BigInt(63)],
        },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3, expectedStack: [BigInt(1135352889)] },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(1135352889)],
        },
        {
          expectedOpcode: 'EQ',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(1135352889), BigInt(1135352889)],
        },
        {
          expectedOpcode: 'PUSH4',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(1)],
        },
        {
          expectedOpcode: 'JUMPI',
          expectedGasUsed: 10,
          expectedStack: [BigInt(1135352889), BigInt(1), BigInt(74)],
        },
        { expectedOpcode: 'JUMPDEST', expectedGasUsed: 1, expectedStack: [BigInt(1135352889)] },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(1135352889)] },
        {
          expectedOpcode: 'TLOAD',
          expectedGasUsed: 100,
          expectedStack: [BigInt(1135352889), BigInt(0)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(170)],
        },
        {
          expectedOpcode: 'MSTORE',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(170), BigInt(0)],
        },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3, expectedStack: [BigInt(1135352889)] },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1135352889), BigInt(32)],
        },
        {
          expectedOpcode: 'RETURN',
          expectedGasUsed: -14910234,
          expectedStack: [BigInt(1135352889), BigInt(32), BigInt(0)],
        },
        {
          expectedOpcode: 'CALLDATASIZE',
          expectedGasUsed: 2,
          expectedStack: [BigInt(1), BigInt(0), BigInt(1)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(1), BigInt(0)],
        },
        {
          expectedOpcode: 'DUP1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(1), BigInt(0), BigInt(0)],
        },
        {
          expectedOpcode: 'CALLDATACOPY',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(1), BigInt(0), BigInt(0), BigInt(0)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(1)],
        },
        {
          expectedOpcode: 'PUSH1',
          expectedGasUsed: 3,
          expectedStack: [BigInt(1), BigInt(0), BigInt(1), BigInt(32)],
        },
        {
          expectedOpcode: 'RETURN',
          expectedGasUsed: NaN,
          expectedStack: [BigInt(1), BigInt(0), BigInt(1), BigInt(32), BigInt(0)],
        },
      ],
    }

    const [result] = await runTest(test, st)
    st.equal(bufferToInt(result.execResult.returnValue), 0xaa)
    st.end()
  })
})
