import { Common } from '@ethereumjs/common'
import { parseGethGenesisState, privateToAddress } from '@ethereumjs/util'
import debug from 'debug'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'
import { Client } from 'jayson/promise'
import * as tape from 'tape'

import { Config } from '../../src/config'
import { getLogger } from '../../src/logging'
import { Event } from '../../src/types'

import {
  createInlineClient,
  filterKeywords,
  filterOutWords,
  runTxHelper,
  startNetwork,
  waitForELStart,
} from './simutils'

import type { EthereumClient } from '../../src/client'
import type { RlpxServer } from '../../src/net/server'

const pkey = hexToBytes('ae557af4ceefda559c924516cabf029bedc36b68109bf8d6183fe96e04121f4e')
const sender = '0x' + bytesToHex(privateToAddress(pkey))
const client = Client.http({ port: 8545 })

const network = 'mainnet'
const networkJson = require(`./configs/${network}.json`)
const common = Common.fromGethGenesis(networkJson, { chain: network })
const customGenesisState = parseGethGenesisState(networkJson)
let ejsClient: EthereumClient | null = null
let snapCompleted: Promise<unknown> | undefined = undefined

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
  t.test(
    'add some EOA transfers',
    { skip: process.env.ADD_EOA_STATE === undefined },
    async (st) => {
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
    }
  )

  t.test('setup snap sync', { skip: process.env.SNAP_SYNC === undefined }, async (st) => {
    // start client inline here for snap sync, no need for beacon
    const { ejsInlineClient, peerConnectedPromise, snapSyncCompletedPromise } =
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      (await createSnapClient(common, customGenesisState, [nodeInfo.enode]).catch((e) => {
        console.log(e)
        return null
      })) ?? {
        ejsInlineClient: null,
        peerConnectedPromise: Promise.reject('Client creation error'),
      }
    ejsClient = ejsInlineClient
    snapCompleted = snapSyncCompletedPromise
    st.ok(ejsClient !== null, 'ethereumjs client started')

    const enode = (ejsClient!.server('rlpx') as RlpxServer)!.getRlpxInfo().enode
    const res = await client.request('admin_addPeer', [enode])
    st.equal(res.result, true, 'successfully requested Geth add EthereumJS as peer')

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
      if (ejsClient !== null && snapCompleted !== undefined) {
        // call sync if not has been called yet
        void ejsClient.services[0].synchronizer?.sync()
        // wait on the sync promise to complete if it has been called independently
        const snapSyncTimeout = new Promise((_resolve, reject) => setTimeout(reject, 40000))
        try {
          await Promise.race([snapCompleted, snapSyncTimeout])
          st.pass('completed snap sync')
        } catch (e) {
          st.fail('could not complete snap sync in 40 seconds')
        }
        await ejsClient.stop()
      } else {
        st.fail('ethereumjs client not setup properly for snap sync')
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
    accountCache: 10000,
    storageCache: 1000,
    discDns: false,
    discV4: false,
    port: 30304,
    forceSnapSync: true,
    // Keep the single job sync range high as the state is not big
    maxAccountRange: (BigInt(2) ** BigInt(256) - BigInt(1)) / BigInt(10),
    maxFetcherJobs: 10,
  })
  const peerConnectedPromise = new Promise((resolve) => {
    config.events.once(Event.PEER_CONNECTED, (peer: any) => resolve(peer))
  })
  const snapSyncCompletedPromise = new Promise((resolve) => {
    config.events.once(Event.SYNC_SNAPSYNC_COMPLETE, (stateRoot: any) => resolve(stateRoot))
  })

  const ejsInlineClient = await createInlineClient(config, common, customGenesisState)
  return { ejsInlineClient, peerConnectedPromise, snapSyncCompletedPromise }
}

process.on('uncaughtException', (err, origin) => {
  console.log({ err, origin })
  process.exit()
})
