import { BlockHeader } from '@ethereumjs/block'
import { Blockchain, parseGethGenesisState } from '@ethereumjs/blockchain'
import { Chain as ChainEnum, Common, parseGethGenesis } from '@ethereumjs/common'
import { Address, KECCAK256_RLP, hexStringToBytes } from '@ethereumjs/util'
import { Server as RPCServer } from 'jayson/promise'
import { MemoryLevel } from 'memory-level'

import { Chain } from '../../src/blockchain/chain'
import { Config } from '../../src/config'
import { VMExecution } from '../../src/execution'
import { getLogger } from '../../src/logging'
import { RlpxServer } from '../../src/net/server/rlpxserver'
import { RPCManager as Manager } from '../../src/rpc'
import { TxPool } from '../../src/service/txpool'
import { Event } from '../../src/types'
import { createRPCServerListener, createWsRPCServerListener } from '../../src/util'

import { mockBlockchain } from './mockBlockchain'

import type { EthereumClient } from '../../src/client'
import type { FullEthereumService } from '../../src/service'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { IncomingMessage } from 'connect'
import type { HttpServer } from 'jayson/promise'
import type * as tape from 'tape'

const request = require('supertest')

const config: any = {}
config.logger = getLogger(config)

type StartRPCOpts = { port?: number; wsServer?: boolean }
type WithEngineMiddleware = { jwtSecret: Uint8Array; unlessFn?: (req: IncomingMessage) => boolean }

type createClientArgs = {
  includeVM: boolean // Instantiates the VM when creating the test client
  commonChain: Common
  enableMetaDB: boolean
  txLookupLimit: number
  syncTargetHeight: bigint
  noPeers: boolean
  blockchain: Blockchain
  chain: any // Could be anything that implements a portion of the Chain interface (varies by test)
  opened: boolean
}
export function startRPC(
  methods: any,
  opts: StartRPCOpts = { port: 3001 },
  withEngineMiddleware?: WithEngineMiddleware
) {
  const { port, wsServer } = opts
  const server = new RPCServer(methods)
  const httpServer =
    wsServer === true
      ? createWsRPCServerListener({ server, withEngineMiddleware })
      : createRPCServerListener({ server, withEngineMiddleware })
  if (!httpServer) throw Error('Could not create server')
  if (port !== undefined) httpServer.listen(port)
  return httpServer
}

export function closeRPC(server: HttpServer) {
  server.close()
}

export function createManager(client: EthereumClient) {
  return new Manager(client, client.config)
}

export function createClient(clientOpts: Partial<createClientArgs> = {}) {
  const common: Common = clientOpts.commonChain ?? new Common({ chain: ChainEnum.Mainnet })
  const config = new Config({
    transports: [],
    common,
    saveReceipts: clientOpts.enableMetaDB,
    txLookupLimit: clientOpts.txLookupLimit,
    accountCache: 10000,
    storageCache: 1000,
  })
  const blockchain = clientOpts.blockchain ?? mockBlockchain()

  // @ts-ignore TODO Move to async Chain.create() initialization
  const chain = clientOpts.chain ?? new Chain({ config, blockchain: blockchain as any })
  chain.opened = true

  const defaultClientConfig = {
    opened: true,
    ethProtocolVersions: [65],
  }
  const clientConfig = { ...defaultClientConfig, ...clientOpts }

  chain.getTd = async (_hash: Uint8Array, _num: bigint) => BigInt(1000)
  if ((chain as any)._headers !== undefined) {
    ;(chain as any)._headers.latest = BlockHeader.fromHeaderData(
      { withdrawalsRoot: common.isActivatedEIP(4895) ? KECCAK256_RLP : undefined },
      { common }
    )
  }

  config.synchronized = true
  config.lastSyncDate = Date.now()

  const servers = [
    new RlpxServer({
      config,
      bootnodes: '10.0.0.1:1234,10.0.0.2:1234',
    }),
  ]

  config.syncTargetHeight = clientOpts.syncTargetHeight

  const synchronizer = {
    startingBlock: 0,
    best: () => {
      return undefined
    },
    latest: () => {
      return undefined
    },
  }

  let execution
  if (!(clientOpts.includeVM === false)) {
    const metaDB: any = clientOpts.enableMetaDB === true ? new MemoryLevel() : undefined
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
        execution,
        switchToBeaconSync: () => {
          return undefined
        },
      },
    ],
    servers,
    opened: clientConfig.opened,
    server: (name: string) => {
      return servers.find((s) => s.name === name)
    },
  }

  if (clientOpts.includeVM === true) {
    client.services[0].txPool = new TxPool({ config, service: client.services[0] })
  }

  return client as EthereumClient
}

export function baseSetup(clientOpts: any = {}) {
  const client = createClient(clientOpts)
  const manager = createManager(client)
  const engineMethods = clientOpts.engine === true ? manager.getMethods(true) : {}
  const server = startRPC({ ...manager.getMethods(), ...engineMethods })
  server.once('close', () => {
    client.config.events.emit(Event.CLIENT_SHUTDOWN)
  })
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
  endOnFinish = true,
  doCloseRPCOnSuccess = true
) {
  try {
    await request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(req)
      .expect(expect)
      .expect(expectRes)
    if (doCloseRPCOnSuccess) {
      closeRPC(server)
    }
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
export async function setupChain(genesisFile: any, chainName = 'dev', clientOpts: any = {}) {
  const genesisParams = parseGethGenesis(genesisFile, chainName)
  const genesisState = parseGethGenesisState(genesisFile)

  const common = new Common({
    chain: chainName,
    customChains: [genesisParams],
  })
  common.setHardforkByBlockNumber(0, genesisParams.genesis.difficulty)

  const blockchain = await Blockchain.create({
    common,
    validateBlocks: false,
    validateConsensus: false,
    genesisState,
  })
  const client = createClient({
    ...clientOpts,
    commonChain: common,
    blockchain,
    includeVM: true,
    enableMetaDB: true,
  })
  const manager = createManager(client)
  const engineMethods = clientOpts.engine === true ? manager.getMethods(true) : {}
  const server = startRPC({ ...manager.getMethods(), ...engineMethods })
  server.once('close', () => {
    client.config.events.emit(Event.CLIENT_SHUTDOWN)
  })

  const { chain } = client
  const service = client.services.find((s) => s.name === 'eth') as FullEthereumService
  const { execution } = service

  await chain.open()
  await execution?.open()
  await chain.update()
  return { chain, common, execution: execution!, server, service }
}

/**
 * Creates and executes a block with the specified txs
 */
export async function runBlockWithTxs(
  chain: Chain,
  execution: VMExecution,
  txs: TypedTransaction[],
  fromEngine = false
) {
  const { vm } = execution
  // build block with tx
  const parentBlock = await chain.getCanonicalHeadBlock()
  const vmCopy = await vm.copy()
  const blockBuilder = await vmCopy.buildBlock({
    parentBlock,
    headerData: {
      timestamp: parentBlock.header.timestamp + BigInt(1),
    },
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      putBlockIntoBlockchain: false,
    },
  })
  for (const tx of txs) {
    await blockBuilder.addTransaction(tx, { skipHardForkValidation: true })
  }
  const block = await blockBuilder.build()

  // put block into chain and run execution
  await chain.putBlocks([block], fromEngine)
  await execution.run()
}

/**
 * Formats a geth genesis file and sets all hardforks to block number zero
 */
export function gethGenesisStartLondon(gethGenesis: any) {
  const londonConfig = Object.entries(gethGenesis.config).map((p) => {
    if (p[0].endsWith('Block')) {
      p[1] = 0
    }
    return p
  })
  return { ...gethGenesis, config: { ...gethGenesis.config, ...Object.fromEntries(londonConfig) } }
}

/**
 * Randomly generated account for testing purposes (signing txs, etc.)
 * This address has preallocated balance in file `testdata/geth-genesis/pow.json`
 */
export const dummy = {
  addr: new Address(hexStringToBytes('0xcde098d93535445768e8a2345a2f869139f45641')),
  privKey: hexStringToBytes('5831aac354d13ff96a0c051af0d44c0931c2a20bdacee034ffbaa2354d84f5f8'),
}
