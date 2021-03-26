import tape from 'tape'
import { Address, BN, privateToAddress } from 'ethereumjs-util'
import VM from '../../../lib'
import Common from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, TypedTransaction } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'

const GWEI = new BN('1000000000')

const common = new Common({
  eips: [1559, 2718],
  chain: 'mainnet',
  hardfork: 'berlin',
})

// Small hack to hack in the activation block number
// (Otherwise there would be need for a custom chain only for testing purposes)
common.getEIPActivationBlockNumber = function (eip: number) {
  if (eip == 1559) {
    return new BN(1)
  }
}

const coinbase = new Address(Buffer.from('11'.repeat(20), 'hex'))
const pkey = Buffer.from('20'.repeat(32), 'hex')
const sender = new Address(privateToAddress(pkey))

function makeBlock(baseFee: BN, transaction: TypedTransaction, txType: number) {
  const signed = transaction.sign(pkey)
  const json = <any>signed.toJSON()
  json.type = txType
  const block = Block.fromBlockData(
    {
      header: {
        number: new BN(1),
        coinbase,
        baseFeePerGas: baseFee,
        gasLimit: 500000,
      },
      transactions: [json],
    },
    { common }
  )
  return block
}

tape('EIP1559 tests', (t) => {
  t.test('should jump into a subroutine, back out and stop', async (st) => {
    const tx = new FeeMarketEIP1559Transaction(
      {
        maxFeePerGas: GWEI.muln(5),
        maxInclusionFeePerGas: GWEI.muln(2),
        to: Address.zero(),
        gasLimit: 21000,
      },
      {
        common,
      }
    )
    const block = makeBlock(GWEI, tx, 2)
    const vm = new VM({ common })
    let account = await vm.stateManager.getAccount(sender)
    const balance = GWEI.muln(21000).muln(10)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    const results = await vm.runTx({
      tx: block.transactions[0],
      block,
    })

    // Situation:
    // Base fee is 1 GWEI
    // User is willing to pay at most 5 GWEI in the entire transaction
    // It is also willing to tip the miner 2 GWEI (at most)
    // Thus, miner should get 21000*2 GWei, and the 21000*1 GWei is burned

    const expectedCost = GWEI.muln(21000).muln(3)
    const expectedMinerBalance = GWEI.muln(21000).muln(2)
    const expectedAccountBalance = balance.sub(expectedCost)

    const miner = await vm.stateManager.getAccount(coinbase)

    st.ok(miner.balance.eq(expectedMinerBalance), 'miner balance correct')
    account = await vm.stateManager.getAccount(sender)
    st.ok(account.balance.eq(expectedAccountBalance), 'account balance correct')
    st.ok(results.amountSpent.eq(expectedCost), 'reported cost correct')

    st.end()
  })
})
