import * as tape from 'tape'
import { VM } from '../../../src/vm'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, privateToAddress } from '@ethereumjs/util'
import EOF from '@ethereumjs/evm/dist/eof'
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

    Array.from([0x00, 0xf3, 0xfd, 0xfe, 0xff]).forEach((opcode) => {
      st.ok(
        EOF.validOpcodes(Buffer.from([0x60, 0xaa, opcode])),
        `code ends with valid terminating instruction 0x${opcode.toString(16)}`
      )
    })

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
    const vm = await VM.create({ common: common })
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
})
