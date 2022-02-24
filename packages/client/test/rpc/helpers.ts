import tape from 'tape'
import { Server as RPCServer, HttpServer } from 'jayson/promise'
import Blockchain from '@ethereumjs/blockchain'
import Common, { Chain as ChainEnum } from '@ethereumjs/common'
import { Address, BN } from 'ethereumjs-util'
import { RPCManager as Manager } from '../../lib/rpc'
import { getLogger } from '../../lib/logging'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain/chain'
import { parseCustomParams, parseGenesisState } from '../../lib/util'
import { TxPool } from '../../lib/sync/txpool'
import { RlpxServer } from '../../lib/net/server/rlpxserver'
import { VMExecution } from '../../lib/execution'
import { mockBlockchain } from './mockBlockchain'
import type EthereumClient from '../../lib/client'
import type { TypedTransaction } from '@ethereumjs/tx'
const request = require('supertest')
const level = require('level-mem')

const config: any = {}
config.logger = getLogger(config)

export function startRPC(methods: any, port: number = 3000) {
  const server = new RPCServer(methods)
  const httpServer = server.http()
  httpServer.listen(port)
  return httpServer
}

export function closeRPC(server: HttpServer) {
  server.close()
}

export function createManager(client: EthereumClient) {
  return new Manager(client, client.config)
}

export function createClient(clientOpts: any = {}) {
  const common: Common = clientOpts.commonChain ?? new Common({ chain: ChainEnum.Mainnet })
  const config = new Config({
    transports: [],
    common,
    saveReceipts: clientOpts.enableMetaDB,
    txLookupLimit: clientOpts.txLookupLimit,
  })
  const blockchain = clientOpts.blockchain ?? ((<any>mockBlockchain()) as Blockchain)

  const chain = clientOpts.chain ?? new Chain({ config, blockchain })
  chain.opened = true

  const defaultClientConfig = {
    opened: true,
    ethProtocolVersions: [65],
  }
  const clientConfig = { ...defaultClientConfig, ...clientOpts }

  chain.getTd = async (_hash: Buffer, _num: BN) => new BN(1000)

  config.synchronized = true
  config.lastSyncDate = Date.now()

  const servers = [
    new RlpxServer({
      config,
      bootnodes: '10.0.0.1:1234,10.0.0.2:1234',
    }),
  ]

  const synchronizer: any = {
    startingBlock: 0,
    best: () => {
      return undefined
    },
    latest: () => {
      return undefined
    },
    syncTargetHeight: clientOpts.syncTargetHeight,
    txPool: new TxPool({ config }),
  }

  let execution
  if (clientOpts.includeVM) {
    const metaDB = clientOpts.enableMetaDB ? level() : undefined
    execution = new VMExecution({ config, chain, metaDB })
  }

  let peers = [1, 2, 3]
  if (clientOpts.noPeers === true) {
    peers = []
  }

  const client: any = {
    synchronized: false,
    config,
    chain,
    execution,
    services: [
      {
        name: 'eth',
        chain,
        pool: { peers },
        protocols: [
          {
            name: 'eth',
            versions: clientConfig.ethProtocolVersions,
          },
        ],
        synchronizer,
      },
    ],
    servers,
    opened: clientConfig.opened,
    server: (name: string) => {
      return servers.find((s) => s.name === name)
    },
  }

  return client as EthereumClient
}

export function baseSetup(clientOpts: any = {}) {
  const client = createClient(clientOpts)
  const manager = createManager(client)
  const server = startRPC(manager.getMethods(clientOpts.engine === true))
  return { server, manager, client }
}

export function params(method: string, params: Array<any> = []) {
  const req = {
    jsonrpc: '2.0',
    method,
    params,
    id: 1,
  }
  return req
}

export async function baseRequest(
  t: tape.Test,
  server: HttpServer,
  req: Object,
  expect: number,
  expectRes: Function,
  endOnFinish = true
) {
  try {
    await request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(req)
      .expect(expect)
      .expect(expectRes)
    closeRPC(server)
    if (endOnFinish) {
      t.end()
    }
  } catch (err) {
    closeRPC(server)
    t.end(err)
  }
}

/**
 * Sets up a custom chain with metaDB enabled (saving receipts, logs, indexes)
 */
export async function setupChain(genesisFile: any, chainName = 'dev', clientOpts = {}) {
  const genesisParams = await parseCustomParams(genesisFile, chainName)
  const genesisState = genesisFile.alloc ? await parseGenesisState(genesisFile) : {}
  const common = new Common({
    chain: chainName,
    customChains: [[genesisParams, genesisState]],
  })
  common.setHardforkByBlockNumber(0)

  const blockchain = await Blockchain.create({
    common,
    validateBlocks: false,
    validateConsensus: false,
  })
  const client = createClient({
    ...clientOpts,
    commonChain: common,
    blockchain,
    includeVM: true,
    enableMetaDB: true,
  })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const { chain, execution } = client

  await chain.open()
  await execution?.open()
  await chain.update()

  return { chain, common, execution: execution as VMExecution, server }
}

/**
 * Creates and executes a block with the specified txs
 */
export async function runBlockWithTxs(
  chain: Chain,
  execution: VMExecution,
  txs: TypedTransaction[]
) {
  const { vm } = execution
  // build block with tx
  const parentBlock = await chain.getLatestBlock()
  const vmCopy = vm.copy()
  const blockBuilder = await vmCopy.buildBlock({
    parentBlock,
    headerData: {
      timestamp: parentBlock.header.timestamp.addn(1),
    },
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      putBlockIntoBlockchain: false,
    },
  })
  for (const tx of txs) {
    await blockBuilder.addTransaction(tx)
  }
  const block = await blockBuilder.build()

  // put block into chain and run execution
  await chain.putBlocks([block])
  await execution.run()
}

/**
 * Formats a geth genesis file and sets all hardforks to block number zero
 */
export function gethGenesisStartLondon(gethGenesis: any) {
  const londonConfig = Object.entries(gethGenesis.config)
    .map((p) => {
      if (p[0].endsWith('Block')) {
        p[1] = 0
      }
      return p
    })
    .reduce((accum: any, [k, v]: any) => {
      accum[k] = v
      return accum
    }, {}) // when compiler is >=es2019 `reduce` can be replaced with `Object.fromEntries`
  return { ...gethGenesis, config: { ...gethGenesis.config, ...londonConfig } }
}

/**
 * Randomly generated account for testing purposes (signing txs, etc.)
 * This address has preallocated balance in file `testdata/geth-genesis/pow.json`
 */
export const dummy = {
  addr: Address.fromString('0xcde098d93535445768e8a2345a2f869139f45641'),
  privKey: Buffer.from('5831aac354d13ff96a0c051af0d44c0931c2a20bdacee034ffbaa2354d84f5f8', 'hex'),
}
