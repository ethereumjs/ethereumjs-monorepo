import { Common } from '@ethereumjs/common'
import { privateToAddress } from '@ethereumjs/util'
import { Client } from 'jayson/promise'
import * as tape from 'tape'

import {
  filterKeywords,
  filterOutWords,
  runTxHelper,
  startNetwork,
  validateBlockHashesInclusionInBeacon,
  waitForELStart,
} from './simutils'

const pkey = Buffer.from('ae557af4ceefda559c924516cabf029bedc36b68109bf8d6183fe96e04121f4e', 'hex')
const sender = '0x' + privateToAddress(pkey).toString('hex')
const client = Client.http({ port: 8545 })

const network = 'mainnet'
const eofJson = require(`./configs/${network}.json`)
const common = Common.fromGethGenesis(eofJson, { chain: network })

export async function runTx(data: string, to?: string, value?: bigint) {
  return runTxHelper({ client, common, sender, pkey }, data, to, value)
}

tape('simple mainnet test run', async (t) => {
  const { teardownCallBack, result } = await startNetwork(network, client, {
    filterKeywords,
    filterOutWords,
    externalRun: process.env.EXTERNAL_RUN,
  })

  if (result.includes('EthereumJS')) {
    t.pass('connected to client')
  } else {
    t.fail('connected to wrong client')
  }

  console.log(`Waiting for network to start...`)
  try {
    await waitForELStart(client)
    t.pass('ethereumjs<>lodestar started successfully')
  } catch (e) {
    t.fail('ethereumjs<>lodestar failed to start')
    throw e
  }

  const blockHashes: string[] = []
  // ------------Sanity checks--------------------------------
  t.test('Simple transfer - sanity check', async (st) => {
    await runTx('', '0x3dA33B9A0894b908DdBb00d96399e506515A1009', 1000000n)
    let balance = await client.request('eth_getBalance', [
      '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
      'latest',
    ])
    st.equal(BigInt(balance.result), 1000000n, 'sent a simple ETH transfer')
    await runTx('', '0x3dA33B9A0894b908DdBb00d96399e506515A1009', 1000000n)
    balance = await client.request('eth_getBalance', [
      '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
      'latest',
    ])
    balance = await client.request('eth_getBalance', [
      '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
      'latest',
    ])
    st.equal(BigInt(balance.result), 2000000n, 'sent a simple ETH transfer 2x')
    const latestBlock = await client.request('eth_getBlockByNumber', ['latest', false])
    blockHashes.push(latestBlock.result.hash)
    st.end()
  })

  t.test('Validate execution hashes present in beacon headers', async (st) => {
    const eth2res = await (await fetch('http://127.0.0.1:9596/eth/v1/beacon/headers')).json()
    await validateBlockHashesInclusionInBeacon(
      'http://127.0.0.1:9596',
      1,
      parseInt(eth2res.data[0].header.message.slot),
      blockHashes
    )
    st.end()
  })

  t.test('should reset td', async (st) => {
    try {
      await teardownCallBack()
      st.pass('network cleaned')
    } catch (e) {
      st.fail('network not cleaned properly')
    }
    st.end()
  })

  t.end()
})
