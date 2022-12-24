import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EOF } from '@ethereumjs/evm/dist/eof'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, privateToAddress } from '@ethereumjs/util'
import * as tape from 'tape'

import { VM } from '../../../src/vm'
const pkey = Buffer.from('20'.repeat(32), 'hex')
const GWEI = BigInt('1000000000')
const sender = new Address(privateToAddress(pkey))

async function runTx(vm: VM, data: string, nonce: number) {
  const tx = FeeMarketEIP1559Transaction.fromTxData({
    data,
    gasLimit: 1000000,
    maxFeePerGas: 7,
    nonce,
  }).sign(pkey)
  const result = await vm.runTx({ tx })
  const created = result.createdAddress
  const code = await vm.stateManager.getContractCode(created!)
  return { result, code }
}

tape('EIP 3670 tests', (t) => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540, 3670],
  })

  t.test('EOF > validOpcodes() tests', (st) => {
    st.ok(EOF.validOpcodes(Buffer.from([0])), 'valid -- STOP ')
    st.ok(EOF.validOpcodes(Buffer.from([0xfe])), 'valid -- INVALID opcode')
    st.ok(EOF.validOpcodes(Buffer.from([0x60, 0xaa, 0])), 'valid - PUSH1 AA STOP')

    for (const opcode of [0x00, 0xf3, 0xfd, 0xfe, 0xff]) {
      st.ok(
        EOF.validOpcodes(Buffer.from([0x60, 0xaa, opcode])),
        `code ends with valid terminating instruction 0x${opcode.toString(16)}`
      )
    }

    st.notOk(EOF.validOpcodes(Buffer.from([0xaa])), 'invalid -- AA -- undefined opcode')
    st.notOk(
      EOF.validOpcodes(Buffer.from([0x7f, 0xaa, 0])),
      'invalid -- PUSH32 AA STOP -- truncated push'
    )
    st.notOk(
      EOF.validOpcodes(Buffer.from([0x61, 0xaa, 0])),
      'invalid -- PUSH2 AA STOP -- truncated push'
    )
    st.notOk(
      EOF.validOpcodes(Buffer.from([0x60, 0xaa, 0x30])),
      'invalid -- PUSH1 AA ADDRESS -- invalid terminal opcode'
    )
    st.end()
  })

  t.test('valid contract code transactions', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    let data = '0x67EF0001010001000060005260086018F3'
    let res = await runTx(vm, data, 0)
    st.ok(res.code.length > 0, 'code section with no data section')

    data = '0x6BEF00010100010200010000AA600052600C6014F3'
    res = await runTx(vm, data, 1)
    st.ok(res.code.length > 0, 'code section with data section')
  })

  t.test('invalid contract code transactions', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    const data = '0x67EF0001010001006060005260086018F3'
    const res = await runTx(vm, data, 0)
    st.ok(res.code.length === 0, 'code should not be deposited')
    st.ok(
      res.result.execResult.exceptionError?.error === 'invalid EOF format',
      'deposited code does not end with terminating instruction'
    )
  })

  t.test('ensure invalid eof headers are rejected when calling', async (st) => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.Merge,
      eips: [3540, 3670],
    })
    const vm = await VM.create({ common })

    // Valid EOF code
    const codeValid = Buffer.from(
      'ef000101008102000c006080604052348015600f57600080fd5b506004361060285760003560e01c8063f8a8fd6d14602d575b600080fd5b60336047565b604051603e91906067565b60405180910390f35b6000602a905090565b6000819050919050565b6061816050565b82525050565b6000602082019050607a6000830184605a565b92915050560048656c6c6f20576f726c6421',
      'hex'
    )
    // Invalid EOF code: code is exactly the same except the byte at the zero-index is not the FORMAT magic
    // This thus runs into opcode 0xED which is unassigned and thus invalid
    const codeInvalid = Buffer.from(
      'ed000101008102000c006080604052348015600f57600080fd5b506004361060285760003560e01c8063f8a8fd6d14602d575b600080fd5b60336047565b604051603e91906067565b60405180910390f35b6000602a905090565b6000819050919050565b6061816050565b82525050565b6000602082019050607a6000830184605a565b92915050560048656c6c6f20576f726c6421',
      'hex'
    )

    const codes = [codeValid, codeInvalid]
    const returnValues = [
      Buffer.from('000000000000000000000000000000000000000000000000000000000000002a', 'hex'),
      Buffer.from(''),
    ]
    const expectedErrors = [false, true]

    let nonce = 0n

    for (let i = 0; i < codes.length; i++) {
      const calldata = Buffer.from('f8a8fd6d', 'hex')

      const addr = new Address(Buffer.from('20'.repeat(20), 'hex'))
      const pkey = Buffer.from('42'.repeat(32), 'hex')

      const code = codes[i]

      await vm.stateManager.putContractCode(addr, code)

      const tx = FeeMarketEIP1559Transaction.fromTxData({
        to: addr,
        data: calldata,
        gasLimit: 100000,
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 10,
        nonce,
      }).sign(pkey)

      const sender = tx.getSenderAddress()

      const acc = await vm.stateManager.getAccount(sender)
      acc.balance = 1000000000n

      await vm.stateManager.putAccount(sender, acc)

      const ret = await vm.runTx({ tx })
      nonce++

      const expectReturn = returnValues[i]
      const expectError = expectedErrors[i]

      st.ok(ret.execResult.returnValue.equals(expectReturn), 'return value ok')
      if (expectError) {
        st.ok(ret.execResult.exceptionError !== undefined, 'threw error')
      } else {
        st.ok(ret.execResult.exceptionError === undefined, 'did not throw error')
      }
    }
  })
})
