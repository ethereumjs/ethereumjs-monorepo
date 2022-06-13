import tape from 'tape'
import { Account, Address, MAX_INTEGER } from '@ethereumjs/util'
import { Block } from '@ethereumjs/block'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import {
  Transaction,
  TransactionFactory,
  FeeMarketEIP1559Transaction,
  FeeMarketEIP1559TxData,
} from '@ethereumjs/tx'
import VM from '../../src'
import { createAccount, getTransaction, setBalance } from './utils'

const TRANSACTION_TYPES = [
  {
    type: 0,
    name: 'legacy tx',
  },
  {
    type: 1,
    name: 'EIP2930 tx',
  },
  {
    type: 2,
    name: 'EIP1559 tx',
  },
]

tape('runTx() -> skipBalance behavior', async (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin })
  const vm = await VM.create({ common })
  const senderKey = Buffer.from(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex'
  )

  const tx = Transaction.fromTxData({
    gasLimit: BigInt(21000),
    value: BigInt(0),
    to: Address.zero(),
    gasPrice: BigInt(0),
  }).sign(senderKey)

  await vm.runTx({ tx })
})
