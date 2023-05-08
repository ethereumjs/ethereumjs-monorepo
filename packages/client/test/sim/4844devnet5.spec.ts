import { Common } from '@ethereumjs/common'
import { bytesToPrefixedHexString, hexStringToBytes, privateToAddress } from '@ethereumjs/util'
import { Client } from 'jayson/promise'
import { randomBytes } from 'node:crypto'
import * as tape from 'tape'

import {
  createBlobTxs,
  filterKeywords,
  filterOutWords,
  runTxHelper,
  startNetwork,
  waitForELStart,
} from './simutils'

const pkey = hexStringToBytes(
  process.env.PRIVATE_KEY ?? 'ae557af4ceefda559c924516cabf029bedc36b68109bf8d6183fe96e04121f4e'
)
const sender = bytesToPrefixedHexString(privateToAddress(pkey))
const rpcUrl =
  process.env.RPC_URL ?? 'https://rpc.lodestar-ethereumjs-1.srv.4844-devnet-5.ethpandaops.io'
if (rpcUrl === undefined) {
  throw Error('Need a valid RPC url to connect to EL client')
}

const client = Client.https(rpcUrl as any)
// pick sharding spec which has cancun hf instantiated from genesis itself
// only override the chainid if provided
const chainId = Number(process.env.CHAIN_ID ?? 4844001005)
const numTxs = Number(process.env.NUM_TXS ?? 1)
console.log({ sender, rpcUrl, chainId, numTxs })

const network = 'sharding'
const shardingJson = require(`./configs/${network}.json`)

// safely change chainId without modifying undelying json
const commonJson = { ...shardingJson }
commonJson.config = { ...commonJson.config, chainId }
const common = Common.fromGethGenesis(commonJson, { chain: network })

export async function runTx(data: string, to?: string, value?: bigint) {
  return runTxHelper({ client, common, sender, pkey }, data, to, value)
}

tape(`running txes on ${rpcUrl}`, async (t) => {
  const { teardownCallBack, result } = await startNetwork(network, client, {
    filterKeywords,
    filterOutWords,
    externalRun: 'true',
  })
  t.pass(`connected to client ${result}`)

  console.log(`Checking for network running...`)
  try {
    await waitForELStart(client)
    t.pass(`${result} confirmed running`)
  } catch (e) {
    t.fail(`failed to confirm ${result} running`)
    throw e
  }

  t.test('run blob transactions', async (st) => {
    const nonceFetch = await client.request(
      'eth_getTransactionCount',
      [sender.toString(), 'latest'],
      2.0
    )
    const nonce = Number(nonceFetch.result)
    st.pass(`fetched ${sender}'s  nonce=${nonce} for blob txs`)

    const txns = await createBlobTxs(
      numTxs - 1,
      4096,
      pkey,
      nonce,
      {
        to: bytesToPrefixedHexString(randomBytes(20)),
        chainId,
        maxFeePerDataGas: BigInt(process.env.MAX_DATAFEE ?? 100000000n),
        maxPriorityFeePerGas: BigInt(process.env.MAX_PRIORITY ?? 100000000n),
        maxFeePerGas: BigInt(process.env.MAX_FEE ?? 1000000000n),
        gasLimit: BigInt(process.env.GAS_LIMIT ?? 0xffffffn),
      },
      { common }
    )
    const txHashes = []
    for (const txn of txns) {
      const res = await client.request('eth_sendRawTransaction', [txn], 2.0)
      if (res.result === undefined) {
        console.log('eth_sendRawTransaction returned invalid response', res)
        st.fail(`Unable to post all txs`)
        break
      }
      st.pass(`posted tx with hash=${res.result}`)
      txHashes.push(res.result)
    }
    st.pass(`posted txs=${txHashes.length}`)
  })

  t.test('cleanup', async (st) => {
    try {
      await teardownCallBack()
      st.pass('script terminated')
    } catch (e) {
      st.fail('could not terminate properly')
    }
    st.end()
  })

  t.end()
})
