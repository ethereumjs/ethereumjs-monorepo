import { parseGethGenesisState } from '@ethereumjs/blockchain'
import { Common } from '@ethereumjs/common'
import { privateToAddress } from '@ethereumjs/util'
import debug from 'debug'
import { Client } from 'jayson/promise'
import * as tape from 'tape'

import { Config } from '../../lib/config'
import { getLogger } from '../../lib/logging'
import { Event } from '../../lib/types'

import {
  createInlineClient,
  filterKeywords,
  filterOutWords,
  runTxHelper,
  startNetwork,
  waitForELStart,
} from './simutils'

import type { EthereumClient } from '../../lib/client'

const pkey = Buffer.from('ae557af4ceefda559c924516cabf029bedc36b68109bf8d6183fe96e04121f4e', 'hex')
const sender = '0x' + privateToAddress(pkey).toString('hex')
const client = Client.http({ port: 8545 })

const network = 'mainnet'
const networkJson = require(`./configs/${network}.json`)
const common = Common.fromGethGenesis(networkJson, { chain: network })
const customGenesisState = parseGethGenesisState(networkJson)
let ejsClient: EthereumClient | null = null

export async function runTx(data: string, to?: string, value?: bigint) {
  return runTxHelper({ client, common, sender, pkey }, data, to, value)
}

tape('simple mainnet test run', async (t) => {
  // Better add it as a option in startnetwork
  process.env.NETWORKID = `${common.networkId()}`
  const { teardownCallBack, result } = await startNetwork(network, client, {
    filterKeywords,
    filterOutWords,
    externalRun: process.env.EXTERNAL_RUN,
    withPeer: process.env.WITH_PEER,
  })

  if (result.includes('Geth')) {
    t.pass('connected to Geth')
  } else {
    t.fail('connected to wrong client')
  }

  const nodeInfo = (await client.request('admin_nodeInfo', [])).result
  t.ok(nodeInfo.enode !== undefined, 'fetched enode for peering')

  console.log(`Waiting for network to start...`)
  try {
    await waitForELStart(client)
    t.pass('geth<>lodestar started successfully')
  } catch (e) {
    t.fail('geth<>lodestar failed to start')
    throw e
  }

  // ------------Sanity checks--------------------------------
  t.test('add some EOA transfers', { skip: process.env.TARGET_PEER === undefined }, async (st) => {
    const startBalance = await client.request('eth_getBalance', [
      '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
      'latest',
    ])
    st.ok(
      startBalance.result !== undefined,
      `fetched 0x3dA33B9A0894b908DdBb00d96399e506515A1009 balance=${startBalance.result}`
    )
    await runTx('', '0x3dA33B9A0894b908DdBb00d96399e506515A1009', 1000000n)
    let balance = await client.request('eth_getBalance', [
      '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
      'latest',
    ])
    st.equal(
      BigInt(balance.result),
      BigInt(startBalance.result) + 1000000n,
      'sent a simple ETH transfer'
    )
    await runTx('', '0x3dA33B9A0894b908DdBb00d96399e506515A1009', 1000000n)
    balance = await client.request('eth_getBalance', [
      '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
      'latest',
    ])
    balance = await client.request('eth_getBalance', [
      '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
      'latest',
    ])
    st.equal(
      BigInt(balance.result),
      BigInt(startBalance.result) + 2000000n,
      'sent a simple ETH transfer 2x'
    )
    st.end()
  })

  t.test('setup snap sync', { skip: process.env.SNAP_SYNC === undefined }, async (st) => {
    // start client inline here for snap sync, no need for beacon
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const { ejsInlineClient, peerConnectedPromise } = (await createSnapClient(
      common,
      customGenesisState,
      [nodeInfo.enode]
    ).catch((e) => {
      console.log(e)
      return null
    })) ?? { ejsInlineClient: null, peerConnectedPromise: Promise.reject('Client creation error') }
    ejsClient = ejsInlineClient
    st.ok(ejsClient !== null, 'ethereumjs client started')
    const peerConnectTimeout = new Promise((_resolve, reject) => setTimeout(reject, 10000))
    try {
      await Promise.race([peerConnectedPromise, peerConnectTimeout])
      st.pass('connected to geth peer')
    } catch (e) {
      st.fail('could not connect to geth peer in 10 seconds')
    }
    st.end()
  })

  t.test('should snap sync and finish', async (st) => {
    try {
      if (ejsClient !== null) {
        // call sync if not has been called yet
        await ejsClient.services[0].synchronizer.sync()
        // wait on the sync promise to complete if it has been called independently
        await ejsClient.services[0].synchronizer['syncPromise']
        await ejsClient.stop()
      }
      await teardownCallBack()
      st.pass('network cleaned')
    } catch (e) {
      st.fail('network not cleaned properly')
    }
    st.end()
  })

  t.end()
})

async function createSnapClient(common: any, customGenesisState: any, bootnodes: any) {
  // Turn on `debug` logs, defaults to all client logging
  debug.enable(process.env.DEBUG_SNAP ?? '')
  const logger = getLogger({ logLevel: 'debug' })
  const config = new Config({
    common,
    transports: ['rlpx'],
    bootnodes,
    multiaddrs: [],
    logger,
    discDns: false,
    discV4: false,
    port: 30304,
    forceSnapSync: true,
  })
  const peerConnectedPromise = new Promise((resolve) => {
    config.events.on(Event.PEER_CONNECTED, (peer: any) => resolve(peer))
  })

  const ejsInlineClient = await createInlineClient(config, common, customGenesisState)
  return { ejsInlineClient, peerConnectedPromise }
}

process.on('uncaughtException', (err, origin) => {
  console.log({ err, origin })
  process.exit()
})
