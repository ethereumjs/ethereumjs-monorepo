import tape from 'tape'
import VM from '../../../src'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { Address, privateToAddress } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
const pkey = Buffer.from('20'.repeat(32), 'hex')
const GWEI = BigInt(1000000000)
const sender = new Address(privateToAddress(pkey))

const coinbase = new Address(Buffer.from('ff'.repeat(20), 'hex'))

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
  eips: [3651],
})

const block = Block.fromBlockData(
  {
    header: {
      baseFeePerGas: 7,
      coinbase,
    },
  },
  { common }
)

const code = Buffer.from('60008080806001415AF100', 'hex')
const contractAddress = new Address(Buffer.from('ee'.repeat(20), 'hex'))

async function getVM(common: Common) {
  const vm = await VM.create({ common: common })
  const account = await vm.stateManager.getAccount(sender)
  const balance = GWEI * BigInt(21000) * BigInt(10000000)
  account.balance = balance
  await vm.stateManager.putAccount(sender, account)

  await vm.stateManager.putContractCode(contractAddress, code)
  return vm
}

tape('EIP 3651 tests', (t) => {
  t.test('invalid contract code transactions', async (st) => {
    const vm = await getVM(common)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      value: 1,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(pkey)

    const result = await vm.runTx({
      block,
      tx,
    })

    const vm2 = await getVM(
      new Common({
        chain: Chain.Mainnet,
        hardfork: Hardfork.London,
      })
    )

    const result2 = await vm2.runTx({ block, tx })
    const expectedDiff =
      common.param('gasPrices', 'coldaccountaccess')! -
      common.param('gasPrices', 'warmstorageread')!
    st.equal(result2.gasUsed - result.gasUsed, expectedDiff, 'gas difference is correct')
  })
})
