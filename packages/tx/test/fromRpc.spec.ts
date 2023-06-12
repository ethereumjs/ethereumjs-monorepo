import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex, bytesToPrefixedHexString, randomBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { TransactionFactory } from '../src'
import { normalizeTxParams } from '../src/fromRpc'

const optimismTx = require('./json/optimismTx.json')
const v0Tx = require('./json/v0tx.json')

const txTypes = [0, 1, 2]

tape('[fromJsonRpcProvider]', async (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
  const provider = 'https://my.json.rpc.provider.com:8545'

  const realFetch = global.fetch
  //@ts-expect-error -- Typescript doesn't like us to replace global values
  global.fetch = async (_url: string, req: any) => {
    const json = JSON.parse(req.body)
    if (json.params[0] === '0xed1960aa7d0d7b567c946d94331dddb37a1c67f51f30bf51f256ea40db88cfb0') {
      const txData = await import(`./json/rpcTx.json`)
      return {
        json: () => {
          return {
            result: txData,
          }
        },
      }
    } else {
      return {
        json: () => {
          return {
            result: null, // This is the value Infura returns if no transaction is found matching the provided hash
          }
        },
      }
    }
  }

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
  global.fetch = realFetch
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

tape(
  'fromRPC: ensure v/r/s values of 0x0 are interpreted as undefined for Optimism system txs',
  async function (st) {
    for (const txType of txTypes) {
      optimismTx.type = txType
      const tx = await TransactionFactory.fromRPC(optimismTx)
      st.ok(tx.v === undefined)
      st.ok(tx.s === undefined)
      st.ok(tx.r === undefined)
    }
    st.end()
  }
)

// This test ensures that "normal" txs of non-legacy type are correctly decoded if the
// `v` value is 0. This is the case in ~50% of the EIP2930 and EIP1559 txs
// The `v` value is either 0 or 1 there.
tape('fromRPC: ensure `v="0x0"` is correctly decoded for signed txs', async function (st) {
  for (const txType of txTypes) {
    if (txType === 0) {
      // legacy tx cannot have v=0
      continue
    }
    v0Tx.type = txType
    const tx = await TransactionFactory.fromRPC(v0Tx)
    st.ok(tx.isSigned())
  }
  st.end()
})
