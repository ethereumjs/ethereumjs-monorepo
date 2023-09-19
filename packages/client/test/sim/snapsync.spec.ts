import { Common } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import {
  Address,
  bytesToHex,
  hexToBytes,
  parseGethGenesisState,
  privateToAddress,
} from '@ethereumjs/util'
import debug from 'debug'
import { Client } from 'jayson/promise'
import { assert, describe, it } from 'vitest'

import { Config } from '../../src/config.js'
import { getLogger } from '../../src/logging.js'
import { Event } from '../../src/types.js'

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
import type { Trie } from '@ethereumjs/trie'

const client = Client.http({ port: 8545 })

const network = 'mainnet'
const networkJson = require(`./configs/${network}.json`)
const common = Common.fromGethGenesis(networkJson, { chain: network })
const customGenesisState = parseGethGenesisState(networkJson)

const pkey = hexToBytes('0xae557af4ceefda559c924516cabf029bedc36b68109bf8d6183fe96e04121f4e')
// 0x97C9B168C5E14d5D369B6D88E9776E5B7b11dcC1
const sender = bytesToHex(privateToAddress(pkey))
let senderBalance = BigInt(customGenesisState[sender][0])

let ejsClient: EthereumClient | null = null
let snapCompleted: Promise<unknown> | undefined = undefined
let syncedTrie: Trie | undefined = undefined

// This account doesn't exist in the genesis so starting balance is zero
const EOATransferToAccount = '0x3dA33B9A0894b908DdBb00d96399e506515A1009'
let EOATransferToBalance = BigInt(0)

export async function runTx(data: string, to?: string, value?: bigint) {
  return runTxHelper({ client, common, sender, pkey }, data, to, value)
}

describe('simple mainnet test run', async () => {
  if (process.env.EXTRA_CL_PARAMS === undefined) {
    process.env.EXTRA_CL_PARAMS = '--params.CAPELLA_FORK_EPOCH 0'
  }
  // Better add it as a option in startnetwork
  process.env.NETWORKID = `${common.networkId()}`
  const { teardownCallBack, result } = await startNetwork(network, client, {
    filterKeywords,
    filterOutWords,
    externalRun: process.env.EXTERNAL_RUN,
    withPeer: process.env.WITH_PEER,
  })

  if (result.includes('Geth')) {
    assert.ok(true, 'connected to Geth')
  } else {
    assert.fail('connected to wrong client')
  }

  const nodeInfo = (await client.request('admin_nodeInfo', [])).result
  assert.ok(nodeInfo.enode !== undefined, 'fetched enode for peering')

  console.log(`Waiting for network to start...`)
  try {
    await waitForELStart(client)
    assert.ok(true, 'geth<>lodestar started successfully')
  } catch (e) {
    assert.fail('geth<>lodestar failed to start')
    throw e
  }

  // ------------Sanity checks--------------------------------
  it.skipIf(process.env.ADD_EOA_STATE === undefined)(
    'add some EOA transfers',
    async () => {
      let balance = await client.request('eth_getBalance', [EOATransferToAccount, 'latest'])
      assert.equal(
        EOATransferToBalance,
        BigInt(balance.result),
        `fetched ${EOATransferToAccount} balance=${EOATransferToBalance}`
      )
      balance = await client.request('eth_getBalance', [EOATransferToAccount, 'latest'])

      await runTx('', EOATransferToAccount, 1000000n)
      EOATransferToBalance += 1000000n

      balance = await client.request('eth_getBalance', [EOATransferToAccount, 'latest'])
      assert.equal(BigInt(balance.result), EOATransferToBalance, 'sent a simple ETH transfer')
      await runTx('', EOATransferToAccount, 1000000n)
      EOATransferToBalance += 1000000n

      balance = await client.request('eth_getBalance', [EOATransferToAccount, 'latest'])
      assert.equal(BigInt(balance.result), EOATransferToBalance, 'sent a simple ETH transfer 2x')

      balance = await client.request('eth_getBalance', [sender, 'latest'])
      assert.ok(
        balance.result !== undefined,
        'remaining sender balance after transfers and gas fee'
      )
      senderBalance = BigInt(balance.result)
    },
    2 * 60_000
  )

  it.skipIf(process.env.SNAP_SYNC === undefined)(
    'setup snap sync',
    async () => {
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
      assert.ok(ejsClient !== null, 'ethereumjs client started')

      const enode = (ejsClient!.server('rlpx') as RlpxServer)!.getRlpxInfo().enode
      const res = await client.request('admin_addPeer', [enode])
      assert.equal(res.result, true, 'successfully requested Geth add EthereumJS as peer')

      const peerConnectTimeout = new Promise((_resolve, reject) => setTimeout(reject, 10000))
      try {
        await Promise.race([peerConnectedPromise, peerConnectTimeout])
        assert.ok(true, 'connected to geth peer')
      } catch (e) {
        assert.fail('could not connect to geth peer in 10 seconds')
      }
    },
    60_000
  )

  it.skipIf(process.env.SNAP_SYNC === undefined)(
    'should snap sync and finish',
    async () => {
      if (ejsClient !== null && snapCompleted !== undefined) {
        // wait on the sync promise to complete if it has been called independently
        const snapSyncTimeout = new Promise((_resolve, reject) => setTimeout(reject, 8 * 60_000))
        let syncedSnapRoot: Uint8Array | undefined = undefined

        try {
          // call sync if not has been called yet
          void ejsClient.services[0].synchronizer?.sync()
          await Promise.race([
            snapCompleted.then(([root, trie]) => {
              syncedSnapRoot = root
              syncedTrie = trie
            }),
            snapSyncTimeout,
          ])
          await ejsClient.stop()
          assert.ok(true, 'completed snap sync')
        } catch (e) {
          assert.fail('could not complete snap sync in 8 minutes')
        }

        const peerLatest = (await client.request('eth_getBlockByNumber', ['latest', false])).result
        const snapRootsMatch =
          syncedSnapRoot !== undefined && bytesToHex(syncedSnapRoot) === peerLatest.stateRoot
        assert.ok(snapRootsMatch, 'synced stateRoot should match with peer')
      } else {
        assert.fail('ethereumjs client not setup properly for snap sync')
      }
    },
    10 * 60_000
  )

  it.skipIf(syncedTrie !== undefined)('should match entire state', async () => {
    // update customGenesisState to reflect latest changes and match entire customGenesisState
    if (process.env.ADD_EOA_STATE !== undefined) {
      customGenesisState[EOATransferToAccount] = [
        `0x${EOATransferToBalance.toString(16)}`,
        undefined,
        undefined,
        BigInt(0),
      ]
      customGenesisState[sender][0] = `0x${senderBalance.toString(16)}`
    }

    const stateManager = new DefaultStateManager({ trie: syncedTrie })

    for (const addressString of Object.keys(customGenesisState)) {
      const address = Address.fromString(addressString)
      const account = await stateManager.getAccount(address)
      assert.equal(
        account.balance,
        BigInt(customGenesisState[addressString][0]),
        `${addressString} balance should match`
      )
    }
  })

  it('network cleanup', async () => {
    try {
      await teardownCallBack()
      assert.ok(true, 'network cleaned')
    } catch (e) {
      assert.fail('network not cleaned properly')
    }
  }, 60_000)
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
    config.events.once(Event.SYNC_SNAPSYNC_COMPLETE, (stateRoot: Uint8Array, trie: Trie) =>
      resolve([stateRoot, trie])
    )
  })

  const ejsInlineClient = await createInlineClient(config, common, customGenesisState)
  return { ejsInlineClient, peerConnectedPromise, snapSyncCompletedPromise }
}

process.on('uncaughtException', (err, origin) => {
  console.log({ err, origin })
  process.exit()
})
