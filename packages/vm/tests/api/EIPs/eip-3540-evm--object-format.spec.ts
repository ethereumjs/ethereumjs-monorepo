import tape from 'tape'
import VM from '../../../src'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, BN, privateToAddress } from 'ethereumjs-util'

const pkey = Buffer.from('20'.repeat(32), 'hex')
const GWEI = new BN('1000000000')
const sender = new Address(privateToAddress(pkey))

tape('EIP 3540 tests', (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [3540, 3541] })
  //const commonNoEIP3541 = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [] })

  t.test('no magic', async (st) => {
    // put 0xEF contract
    const tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x60EF60005360016000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
    }).sign(pkey)

    const vm = new VM({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI.muln(21000).muln(10)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    const result = await vm.runTx({ tx })
    const created = result.createdAddress
    const code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'did not deposit code')
  })
  t.test('invalid header', async (st) => {
    // put 0xEF contract
    const tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x7FEF0000000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
    }).sign(pkey)

    const vm = new VM({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI.muln(21000).muln(10)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    const result = await vm.runTx({ tx })
    const created = result.createdAddress
    const code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'did not deposit code')
  })

  t.test('valid header but invalid EOF format', async (st) => {
    // put 0xEF contract
    const tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x7FEF0002000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
    }).sign(pkey)

    const vm = new VM({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI.muln(21000).muln(10)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    const result = await vm.runTx({ tx })
    const created = result.createdAddress
    const code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'did not deposit code')
  })
  t.test('valid header and version but no code section', async (st) => {
    // put 0xEF contract
    const tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x7FEF0001000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
    }).sign(pkey)

    const vm = new VM({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI.muln(21000).muln(10)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    const result = await vm.runTx({ tx })
    const created = result.createdAddress
    const code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'did not deposit code')
  })
  t.test('valid header and version but unknown section type', async (st) => {
    // put 0xEF contract
    const tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x7FEF0001030000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
    }).sign(pkey)

    const vm = new VM({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI.muln(21000).muln(10)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    const result = await vm.runTx({ tx })
    const created = result.createdAddress
    const code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'did not deposit code')
  })
})
