import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex, bytesToPrefixedHexString, randomBytes } from '@ethereumjs/util'
import * as tape from 'tape'
import * as td from 'testdouble'

import { TransactionFactory } from '../src'
import { normalizeTxParams } from '../src/fromRpc'

const optimismTx = require('./json/optimismTx.json')

const txTypes = [0, 1, 2]

tape('[fromJsonRpcProvider]', async (t) => {
  const fakeFetch = async (_url: string, req: any) => {
    if (
      req.method === 'eth_getTransactionByHash' &&
      req.params[0] === '0xed1960aa7d0d7b567c946d94331dddb37a1c67f51f30bf51f256ea40db88cfb0'
    ) {
      const txData = await import(`./json/rpcTx.json`)
      return txData
    } else {
      return null // This is the value Infura returns if no transaction is found matching the provided hash
    }
  }

  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
  const provider = 'https://my.json.rpc.provider.com:8545'
  const providerUtils = require('@ethereumjs/util/dist/provider')
  td.replace<any>(providerUtils, 'fetchFromProvider', fakeFetch)
  const txHash = '0xed1960aa7d0d7b567c946d94331dddb37a1c67f51f30bf51f256ea40db88cfb0'
  const tx = await TransactionFactory.fromJsonRpcProvider(provider, txHash, { common })
  t.equal(
    bytesToPrefixedHexString(tx.hash()),
    txHash,
    'generated correct tx from transaction RPC data'
  )
  try {
    await TransactionFactory.fromJsonRpcProvider(
      provider,
      bytesToPrefixedHexString(randomBytes(32)),
      {}
    )
    t.fail('should throw')
  } catch (err: any) {
    t.ok(
      err.message.includes('No data returned from provider'),
      'throws correct error when no tx returned'
    )
  }
  td.reset()
  t.end()
})

tape('[normalizeTxParams]', (t) => {
  const rpcTx = require('./json/rpcTx.json')
  const normedTx = normalizeTxParams(rpcTx)
  const tx = TransactionFactory.fromTxData(normedTx)
  t.equal(normedTx.gasLimit, 21000n, 'correctly converted "gas" to "gasLimit"')
  t.equal(
    bytesToHex(tx.hash()),
    rpcTx.hash.slice(2),
    'converted normed tx data to transaction objec'
  )
  t.end()
})

tape('fromRPCTx: ensure v/r/s values of 0x0 are interpreted as undefined', async function (st) {
  for (const txType of txTypes) {
    optimismTx.type = txType
    const tx = await TransactionFactory.fromRPCTx(optimismTx)
    st.ok(tx.v === undefined)
    st.ok(tx.s === undefined)
    st.ok(tx.r === undefined)
  }
  st.end()
})
