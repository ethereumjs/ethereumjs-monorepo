import tape from 'tape'
import VM from '../../../src'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, BN, privateToAddress } from 'ethereumjs-util'
import { eof1ValidOpcodes } from '../../../src/evm/opcodes'
const pkey = Buffer.from('20'.repeat(32), 'hex')
const GWEI = new BN('1000000000')
const sender = new Address(privateToAddress(pkey))

tape('EIP 3670 tests', (t) => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540, 3541, 3670],
  })

  t.test('eof1ValidOpcodes() tests', (st) => {
    st.ok(eof1ValidOpcodes(Buffer.from([0])), 'valid -- STOP ')
    st.notOk(eof1ValidOpcodes(Buffer.from([0xaa])), 'invalid -- AA -- undefined opcode')
    st.ok(eof1ValidOpcodes(Buffer.from([0x60, 0xaa, 0])), 'valid - PUSH1 AA STOP')
    st.notOk(
      eof1ValidOpcodes(Buffer.from([0x7f, 0xaa, 0])),
      'invalid -- PUSH32 AA STOP -- truncated push'
    )
    st.notOk(
      eof1ValidOpcodes(Buffer.from([0x61, 0xaa, 0])),
      'invalid -- PUSH2 AA STOP -- truncated push'
    )
    st.notOk(eof1ValidOpcodes(Buffer.from([0x30])), 'invalid -- ADDRESS -- invalid terminal opcode')
    Array.from([0x00, 0xf3, 0xfd, 0xfe, 0xff]).forEach((opcode) => {
      st.ok(
        eof1ValidOpcodes(Buffer.from([0x60, 0xaa, opcode])),
        `code ends with valid terminating instruction 0x${opcode.toString(16)}`
      )
    })
    st.end()
  })
  t.test('valid contract code transactions', async (st) => {
    const vm = new VM({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI.muln(21000).muln(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    let tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x67EF0001010001000060005260086018F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
      nonce: 0,
    }).sign(pkey)
    let result = await vm.runTx({ tx })
    let created = result.createdAddress
    let code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length > 0, 'code section with no data section')
    tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x6BEF00010100010200010000AA600052600C6014F3',
      gasLimit: 100000000,
      maxFeePerGas: 7,
      nonce: 1,
    }).sign(pkey)
    result = await vm.runTx({ tx })
    created = result.createdAddress
    code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length > 0, 'code section with data section')
  })

  t.test('invalid contract code transactions', async (st) => {
    const vm = new VM({ common: common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI.muln(21000).muln(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    const tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x67EF0001010001006060005260086018F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
      nonce: 0,
    }).sign(pkey)
    const result = await vm.runTx({ tx })
    const created = result.createdAddress
    const code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'code should not be deposited')
    st.ok(
      result.execResult.exceptionError?.error === 'invalid EOF format',
      'deposited code does not end with terminating instruction'
    )
  })
})
