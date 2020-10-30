#!/usr/bin/env node

const chains = require('@ethereumjs/common/dist/chains').chains
import { getLogger } from '../lib/logging'
import { parseParams } from '../lib/util'
import Node from '../lib/node'
import { Server as RPCServer } from 'jayson'
import { Config } from '../lib/config'
import Common from '@ethereumjs/common'
import { RPCManager } from '../lib/rpc'
const level = require('level')
const path = require('path')
const fs = require('fs-extra')

const networks = Object.entries(chains.names)
const args = require('yargs')
  .options({
    network: {
      describe: `Network`,
      choices: networks.map((n) => n[1]),
      default: 'mainnet',
    },
    'network-id': {
      describe: `Network ID`,
      choices: networks.map((n) => parseInt(n[0])),
      default: undefined,
    },
    syncmode: {
      describe: 'Blockchain sync mode',
      choices: ['light', 'fast'],
      default: Config.SYNCMODE_DEFAULT,
    },
    lightserv: {
      describe: 'Serve light peer requests',
      boolean: true,
      default: Config.LIGHTSERV_DEFAULT,
    },
    datadir: {
      describe: 'Data directory for the blockchain',
      default: Config.DATADIR_DEFAULT,
    },
    transports: {
      describe: 'Network transports',
      default: Config.TRANSPORTS_DEFAULT,
      array: true,
    },
    rpc: {
      describe: 'Enable the JSON-RPC server',
      boolean: true,
      default: Config.RPC_DEFAULT,
    },
    rpcport: {
      describe: 'HTTP-RPC server listening port',
      number: true,
      default: Config.RPCPORT_DEFAULT,
    },
    rpcaddr: {
      describe: 'HTTP-RPC server listening interface',
      default: 'localhost',
    },
    loglevel: {
      describe: 'Logging verbosity',
      choices: ['error', 'warn', 'info', 'debug'],
      default: 'info',
    },
    minPeers: {
      describe: 'Peers needed before syncing',
      number: true,
      default: Config.MINPEERS_DEFAULT,
    },
    maxPeers: {
      describe: 'Maximum peers to sync with',
      number: true,
      default: Config.MAXPEERS_DEFAULT,
    },
    params: {
      describe: 'Path to chain parameters json file',
      coerce: path.resolve,
    },
  })
  .locale('en_EN').argv
const logger = getLogger({ loglevel: args.loglevel })

/**
 * Initializes and starts a Node and reacts on the
 * main node lifecycle events
 * 
 * @param config
 */
async function runNode(config: Config) {
  const syncDataDir = config.getSyncDataDirectory()
  fs.ensureDirSync(syncDataDir)
  logger.info(`Sync data directory: ${syncDataDir}`)
  
  logger.info('Initializing Ethereumjs client...')
  if (config.lightserv) {
    logger.info(`Serving light peer requests`)
  }
  const node = new Node({
    config,
    db: level(syncDataDir),
  })
  node.on('error', (err: any) => logger.error(err))
  node.on('listening', (details: any) => {
    logger.info(`Listener up transport=${details.transport} url=${details.url}`)
  })
  node.on('synchronized', () => {
    logger.info('Synchronized')
  })
  logger.info(`Connecting to network: ${config.common.chainName()}`)
  await node.open()
  logger.info('Synchronizing blockchain...')
  await node.start()

  return node
}

function runRpcServer(node: Node, config: Config) {
  const { rpcport, rpcaddr } = config
  const manager = new RPCManager(node, config)
  const server = new RPCServer(manager.getMethods())
  logger.info(`RPC HTTP endpoint opened: http://${rpcaddr}:${rpcport}`)
  server.http().listen(rpcport)

  return server
}

/**
 * Main entry point to start a client
 */
async function run() {
  // give network id precedence over network name
  let chain: string | number
  if (args.networkId) {
    chain = args.networkId
  } else {
    chain = args.network
  }

  const common = new Common({ chain, hardfork: 'chainstart' })
  const config = new Config({
    common,
    logger,
    syncmode: args.syncmode,
    lightserv: args.lightserv,
    transports: args.transports,
    rpc: args.rpc,
    rpcport: args.rpcport,
    rpcaddr: args.rpcaddr,
    minPeers: args.minPeers,
    maxPeers: args.maxPeers,
  })

  // TODO: see todo below wrt resolving chain param parsing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const chainParams = args.params ? await parseParams(args.params) : args.network

  const node = await runNode(config)
  const server = config.rpc ? runRpcServer(node, config) : null

  process.on('SIGINT', async () => {
    logger.info('Caught interrupt signal. Shutting down...')
    if (server) server.http().close()
    await node.stop()
    logger.info('Exiting.')
    process.exit()
  })
}

run().catch((err) => logger.error(err))
