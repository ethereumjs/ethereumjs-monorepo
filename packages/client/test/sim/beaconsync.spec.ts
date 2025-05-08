import { createCommonFromGethGenesis, parseGethGenesisState } from '@ethereumjs/common'
import { bytesToHex, hexToBytes, privateToAddress } from '@ethereumjs/util'
import debug from 'debug'
import { Client } from 'jayson/promise/index.js'
import { assert, describe, it } from 'vitest'

import { Config } from '../../src/config.ts'
import { Event } from '../../src/types.ts'
import { createInlineClient } from '../../src/util/index.ts'

import {
  filterKeywords,
  filterOutWords,
  runTxHelper,
  setupEngineUpdateRelay,
  startNetwork,
  waitForELStart,
} from './simutils.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { EthereumClient } from '../../src/client.ts'
import type { RlpxServer } from '../../src/net/server/index.ts'

const client = Client.http({ port: 8545 })

const network = 'mainnet'

const networkJSON = require(`./configs/${network}.json`)
const common = createCommonFromGethGenesis(networkJSON, { chain: network })
const customGenesisState = parseGethGenesisState(networkJSON)

const pkey = hexToBytes('0xae557af4ceefda559c924516cabf029bedc36b68109bf8d6183fe96e04121f4e')
// 0x97C9B168C5E14d5D369B6D88E9776E5B7b11dcC1
const sender = bytesToHex(privateToAddress(pkey))

let ejsClient: EthereumClient | null = null
let beaconSyncRelayer: any = null

// This account doesn't exist in the genesis so starting balance is zero
const EOATransferToAccount = '0x3dA33B9A0894b908DdBb00d96399e506515A1009'
let EOATransferToBalance = BigInt(0)

export async function runTx(data: PrefixedHexString | '', to?: PrefixedHexString, value?: bigint) {
  return runTxHelper({ client, common, sender, pkey }, data, to, value)
}

describe('simple mainnet test run', async () => {
  if (process.env.EXTRA_CL_PARAMS === undefined) {
    process.env.EXTRA_CL_PARAMS = `--params.CAPELLA_FORK_EPOCH 0`
    process.env.GENESIS_DELAY = '5'
  }

  // Better add it as a option in startnetwork
  process.env.NETWORKID = `${common.chainId()}`
  const { teardownCallBack, result } = await startNetwork(network, client, {
    filterKeywords,
    filterOutWords,
    externalRun: process.env.EXTERNAL_RUN,
    withPeer: process.env.WITH_PEER,
  })
  it.skip('should connect to Geth', () => {
    if (result.includes('Geth') === true) {
      assert.isTrue(true, 'connected to Geth')
    } else {
      assert.fail('connected to wrong client: ' + result)
    }
  })

  const nodeInfo = (await client.request('admin_nodeInfo', [])).result
  it('should fetch enode', () => {
    assert.isDefined(nodeInfo.enode, 'fetched enode for peering')
  })

  console.log(`Waiting for network to start...`)
  it('should start network', async () => {
    try {
      await waitForELStart(client)
      assert.isTrue(true, 'geth<>lodestar started successfully')
    } catch (e: any) {
      assert.fail(e.message + ': geth<>lodestar failed to start')
    }
  }, 60000)

  // ------------Sanity checks--------------------------------
  it.skipIf(process.env.ADD_EOA_STATE === undefined)(
    'add some EOA transfers',
    async () => {
      let balance = await client.request('eth_getBalance', [EOATransferToAccount, 'latest'])
      assert.strictEqual(
        EOATransferToBalance,
        BigInt(balance.result),
        `fetched ${EOATransferToAccount} balance=${EOATransferToBalance}`,
      )
      balance = await client.request('eth_getBalance', [EOATransferToAccount, 'latest'])

      await runTx('', EOATransferToAccount, 1000000n)
      EOATransferToBalance += 1000000n

      balance = await client.request('eth_getBalance', [EOATransferToAccount, 'latest'])
      assert.strictEqual(BigInt(balance.result), EOATransferToBalance, 'sent a simple ETH transfer')
      await runTx('', EOATransferToAccount, 1000000n)
      EOATransferToBalance += 1000000n

      balance = await client.request('eth_getBalance', [EOATransferToAccount, 'latest'])
      assert.strictEqual(
        BigInt(balance.result),
        EOATransferToBalance,
        'sent a simple ETH transfer 2x',
      )

      balance = await client.request('eth_getBalance', [sender, 'latest'])
      assert.isDefined(balance.result, 'remaining sender balance after transfers and gas fee')
    },
    2 * 60_000,
  )

  it.skipIf(process.env.BEACON_SYNC === undefined)(
    'setup beacon sync',
    async () => {
      // start client inline here for beacon sync
      const peerBeaconUrl = 'http://127.0.0.1:9596'
      const {
        ejsInlineClient,
        peerConnectedPromise,
        beaconSyncRelayer: relayer,
      } = (await createBeaconSyncClient(
        common,
        customGenesisState,
        [nodeInfo.enode],
        peerBeaconUrl,
      ).catch((e) => {
        console.log(e)
        return null
      })) ?? {
        ejsInlineClient: null,
        peerConnectedPromise: Promise.reject('Client creation error'),
      }
      ejsClient = ejsInlineClient
      beaconSyncRelayer = relayer
      assert.isTrue(ejsClient !== null, 'ethereumjs client started')

      const enode = (ejsClient!.server() as RlpxServer)!.getRlpxInfo().enode
      const res = await client.request('admin_addPeer', [enode])
      assert.strictEqual(res.result, true, 'successfully requested Geth add EthereumJS as peer')

      const peerConnectTimeout = new Promise((_resolve, reject) => setTimeout(reject, 10000))
      try {
        await Promise.race([peerConnectedPromise, peerConnectTimeout])
        assert.isTrue(true, 'connected to geth peer')
      } catch (e) {
        console.log(e)
        assert.fail('could not connect to geth peer in 10 seconds')
      }
    },
    60_000,
  )

  it.skipIf(process.env.BEACON_SYNC === undefined)(
    'should beacon sync and finish',
    async () => {
      if (ejsClient !== null && beaconSyncRelayer !== null) {
        // wait on the sync promise to complete if it has been called independently
        const syncTimeout = new Promise((_resolve, reject) => setTimeout(reject, 8 * 60_000))
        const beaconSyncPromise = beaconSyncRelayer.start()

        try {
          // call sync if not has been called yet
          void ejsClient.service.synchronizer?.sync()
          const syncResponse = await Promise.race([beaconSyncPromise, syncTimeout])
          assert.strictEqual(
            ['SYNCED', 'VALID'].includes(syncResponse.syncState),
            true,
            'beaconSyncRelayer should have synced client',
          )
          await ejsClient.stop()
          assert.isTrue(true, 'completed beacon sync')
        } catch {
          console.log()
          assert.fail('could not complete beacon sync in 8 minutes')
        }
      } else {
        assert.fail('ethereumjs client not setup properly for beacon sync')
      }
    },
    10 * 60_000,
  )

  it('network cleanup', async () => {
    try {
      beaconSyncRelayer?.close()
      await teardownCallBack()
      assert.isTrue(true, 'network cleaned')
    } catch {
      assert.fail('network not cleaned properly')
    }
  }, 60000)
})

async function createBeaconSyncClient(
  common?: any,
  customGenesisState?: any,
  bootnodes?: any,
  peerBeaconUrl?: any,
  datadir?: any,
) {
  // Turn on `debug` logs, defaults to all client logging
  debug.enable(process.env.DEBUG_SYNC ?? '')
  const config = new Config({
    common,
    bootnodes,
    multiaddrs: [],
    discDns: false,
    discV4: false,
    port: 30304,
    maxFetcherJobs: 10,
  })
  const peerConnectedPromise = new Promise((resolve) => {
    config.events.once(Event.PEER_CONNECTED, (peer: any) => resolve(peer))
  })

  const ejsInlineClient = await createInlineClient(config, common, customGenesisState, datadir)
  const beaconSyncRelayer = await setupEngineUpdateRelay(ejsInlineClient, peerBeaconUrl)
  return { ejsInlineClient, peerConnectedPromise, beaconSyncRelayer }
}

process.on('uncaughtException', (err: any, origin: any) => {
  console.log({ err, origin })
  process.exit()
})
