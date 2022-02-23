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
  t.test('invalid object formats', async (st) => {
    const vm = new VM({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI.muln(21000).muln(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    let tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x60EF60005360016000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
    }).sign(pkey)
    let result = await vm.runTx({ tx })
    let created = result.createdAddress
    let code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'no magic')

    tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x7FEF0000000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
      nonce: 1,
    }).sign(pkey)
    result = await vm.runTx({ tx })
    created = result.createdAddress
    code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'invalid header')

    tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x7FEF0002000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
      nonce: 2,
    }).sign(pkey)
    result = await vm.runTx({ tx })
    created = result.createdAddress
    code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'valid header but invalid EOF format')

    tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x7FEF0001000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
      nonce: 3,
    }).sign(pkey)
    result = await vm.runTx({ tx })
    created = result.createdAddress
    code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'valid header and version but no code section')

    tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x7FEF0001030000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
      nonce: 4,
    }).sign(pkey)
    result = await vm.runTx({ tx })
    created = result.createdAddress
    code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'valid header and version but unknown section type')

    tx = FeeMarketEIP1559Transaction.fromTxData({
      data: '0x7FEF0001010002006000DEADBEEF0000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
      nonce: 5,
    }).sign(pkey)
    result = await vm.runTx({ tx })
    created = result.createdAddress
    code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length === 0, 'code section with trailing bytes')
  })

  t.test('valid contract creation cases', async (st) => {
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
      data: '0x6CEF00010100010000020001AA0060005260206007F3',
      gasLimit: 1000000,
      maxFeePerGas: 7,
      nonce: 1,
    }).sign(pkey)
    result = await vm.runTx({ tx })
    created = result.createdAddress
    code = await vm.stateManager.getContractCode(created!)
    st.ok(code.length > 0, 'code section with data section')
  })
})
