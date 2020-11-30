#!/usr/bin/env client

import { Server as RPCServer } from 'jayson'
import Common from '@ethereumjs/common'
import { parseParams } from '../lib/util'
import EthereumClient from '../lib/client'
import { Config } from '../lib/config'
import { Logger } from '../lib/logging'
import { RPCManager } from '../lib/rpc'
const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const chains = require('@ethereumjs/common/dist/chains').chains
const level = require('level')

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
      choices: ['light', 'full'],
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
      default: Config.RPCADDR_DEFAULT,
    },
    loglevel: {
      describe: 'Logging verbosity',
      choices: ['error', 'warn', 'info', 'debug'],
      default: Config.LOGLEVEL_DEFAULT,
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

let logger: Logger | null = null

/**
 * Initializes and starts a Node and reacts on the
 * main client lifecycle events
 *
 * @param config
 */
async function runNode(config: Config) {
  const syncDataDir = config.getSyncDataDirectory()
  fs.ensureDirSync(syncDataDir)
  config.logger.info(`Sync data directory: ${syncDataDir}`)

  config.logger.info('Initializing Ethereumjs client...')
  if (config.lightserv) {
    config.logger.info(`Serving light peer requests`)
  }
  const client = new EthereumClient({
    config,
    db: level(syncDataDir),
  })
  client.on('error', (err: any) => config.logger.error(err))
  client.on('listening', (details: any) => {
    config.logger.info(`Listener up transport=${details.transport} url=${details.url}`)
  })
  client.on('synchronized', () => {
    config.logger.info('Synchronized')
  })
  config.logger.info(`Connecting to network: ${config.common.chainName()}`)
  await client.open()
  config.logger.info('Synchronizing blockchain...')
  await client.start()

  return client
}

function runRpcServer(client: EthereumClient, config: Config) {
  const { rpcport, rpcaddr } = config
  const manager = new RPCManager(client, config)
  const server = new RPCServer(manager.getMethods())
  config.logger.info(`RPC HTTP endpoint opened: http://${rpcaddr}:${rpcport}`)
  server.http().listen(rpcport)

  return server
}

/**
 * Main entry point to start a client
 */
async function run() {
  // give network id precedence over network name
  let chain: string | number
  if (args.networkId) {
    chain = args.networkId
  } else {
    chain = args.network
  }

  const common = new Common({ chain, hardfork: 'chainstart' })
  const config = new Config({
    common,
    syncmode: args.syncmode,
    lightserv: args.lightserv,
    datadir: `${os.homedir()}/Library/Ethereum`,
    transports: args.transports,
    rpc: args.rpc,
    rpcport: args.rpcport,
    rpcaddr: args.rpcaddr,
    loglevel: args.loglevel,
    minPeers: args.minPeers,
    maxPeers: args.maxPeers,
  })
  logger = config.logger

  // TODO: see todo below wrt resolving chain param parsing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const chainParams = args.params ? await parseParams(args.params) : args.network

  const client = await runNode(config)
  const server = config.rpc ? runRpcServer(client, config) : null

  process.on('SIGINT', async () => {
    config.logger.info('Caught interrupt signal. Shutting down...')
    if (server) server.http().close()
    await client.stop()
    config.logger.info('Exiting.')
    process.exit()
  })
}

run().catch((err) => logger!.error(err))
