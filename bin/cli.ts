#!/usr/bin/env node

const chains = require('@ethereumjs/common/dist/chains').chains
const { getLogger } = require('../lib/logging')
const { parseParams, parseTransports } = require('../lib/util')
const { fromName: serverFromName } = require('../lib/net/server')
import Node from '../lib/node'
import { Server as RPCServer } from 'jayson'
import { Config } from '../lib/config'
import Common from '@ethereumjs/common'
const RPCManager = require('../lib/rpc')
const level = require('level')
const path = require('path')
const fs = require('fs-extra')

const networks = Object.entries(chains.names)
const args = require('yargs')
  .options({
    network: {
      describe: `Network`,
      choices: networks.map((n) => n[1]),
      default: networks[0][1],
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
      default: ['rlpx:port=30303', 'libp2p'],
      array: true,
    },
    rpc: {
      describe: 'Enable the JSON-RPC server',
      boolean: true,
      default: false,
    },
    rpcport: {
      describe: 'HTTP-RPC server listening port',
      number: true,
      default: 8545,
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
      default: Config.MINPEERS_DEFAULT,
    },
    params: {
      describe: 'Path to chain parameters json file',
      coerce: path.resolve,
    },
  })
  .locale('en_EN').argv
const logger = getLogger({ loglevel: args.loglevel })

async function runNode(options: any) {
  logger.info('Initializing Ethereumjs client...')
  if (options.config.lightserv) {
    logger.info(`Serving light peer requests`)
  }
  const node = new Node(options)
  node.on('error', (err: any) => logger.error(err))
  node.on('listening', (details: any) => {
    logger.info(`Listener up transport=${details.transport} url=${details.url}`)
  })
  node.on('synchronized', () => {
    logger.info('Synchronized')
  })
  logger.info(`Connecting to network: ${options.config.common.chainName()}`)
  await node.open()
  logger.info('Synchronizing blockchain...')
  await node.start()

  return node
}

function runRpcServer(node: any, options: any) {
  const { rpcport, rpcaddr } = options
  const manager = new RPCManager(node, options)
  const server = new RPCServer(manager.getMethods())
  logger.info(`RPC HTTP endpoint opened: http://${rpcaddr}:${rpcport}`)
  server.http().listen(rpcport)

  return server
}

async function run() {
  // give network id precedence over network name
  if (args.networkId) {
    const network = networks.find((n) => n[0] === `${args.networkId}`)
    if (network) {
      args.network = network[1]
    }
  }

  const common = new Common({ chain: args.network, hardfork: 'chainstart' })
  const config = new Config({
    common,
    logger,
    syncmode: args.syncmode,
    lightserv: args.lightserv,
    minPeers: args.minPeers,
    maxPeers: args.maxPeers,
  })

  // TODO: see todo below wrt resolving chain param parsing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const chainParams = args.params ? await parseParams(args.params) : args.network

  const servers = parseTransports(args.transports).map((t: any) => {
    const Server = serverFromName(t.name)
    if (t.name === 'rlpx') {
      t.options.bootnodes = t.options.bootnodes || config.common.bootstrapNodes()
    }
    return new Server({ config, ...t.options })
  })

  config.servers = servers

  const syncDataDir = config.getSyncDataDirectory()
  fs.ensureDirSync(syncDataDir)
  logger.info(`Sync data directory: ${syncDataDir}`)

  const options = {
    config,
    db: level(syncDataDir),
    rpcport: args.rpcport,
    rpcaddr: args.rpcaddr,
  }
  const node = await runNode(options)
  const server = args.rpc ? runRpcServer(node, options) : null

  process.on('SIGINT', async () => {
    logger.info('Caught interrupt signal. Shutting down...')
    if (server) server.http().close()
    await node.stop()
    logger.info('Exiting.')
    process.exit()
  })
}

run().catch((err) => logger.error(err))
