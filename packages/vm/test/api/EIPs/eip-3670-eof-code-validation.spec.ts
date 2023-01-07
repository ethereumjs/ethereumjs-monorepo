import { Chain, Common, Hardfork } from '@ethereumjs/common'
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

// Should these tests be moved inside 3540...? (3670 is essentially an extension of 3540 now, and only a very small one)

tape('EIP 3670 tests', (t) => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540, 5450, 3860, 5450, 4200, 4750, 3670],
  })

  t.test('valid contract code transactions', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    let data = '0x6FEF0001010004020001000103000000FE60005260086018F3'
    let res = await runTx(vm, data, 0)
    st.ok(res.code.length > 0, 'code section with no data section')

    data = '0x70EF0001010004020001000103000000FE00600052600C6014F3'
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
  })
})
