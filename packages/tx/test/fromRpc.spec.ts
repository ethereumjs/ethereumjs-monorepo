import { Chain, Common, Hardfork } from '@ethereumjs/common'
import * as tape from 'tape'

import { TransactionFactory } from '../src'
import { normalizeTxParams } from '../src/fromRpc'

import { MockProvider } from './mockProvider'

tape('[fromEthersProvider]', async (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
  const provider = new MockProvider()
  const txHash = '0xed1960aa7d0d7b567c946d94331dddb37a1c67f51f30bf51f256ea40db88cfb0'
  const tx = await TransactionFactory.fromEthersProvider(provider, txHash, { common })
  t.equal(
    '0x' + tx.hash().toString('hex'),
    txHash,
    'generated correct tx from transaction RPC data'
  )
  t.end()
})

tape('[normalizeTxParams]', (t) => {
  const rpcTx = require('./json/rpcTx.json')
  const normedTx = normalizeTxParams(rpcTx)
  const tx = TransactionFactory.fromTxData(normedTx)
  t.equal(normedTx.gasLimit, 21000n, 'correctly converted "gas" to "gasLimit"')
  t.equal(
    tx.hash().toString('hex'),
    rpcTx.hash.slice(2),
    'converted normed tx data to transaction objec'
  )
  t.end()
})
