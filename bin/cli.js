#!/usr/bin/env node
'use strict'

const chains = require('ethereumjs-common/chains')
const { getLogger } = require('../lib/logging')
const { FastSyncNode } = require('../lib/node')
const jayson = require('jayson')
const RPCManager = require('../lib/rpc')
const os = require('os')

const networks = Object.entries(chains.names)
const args = require('yargs')
  .options({
    'network': {
      describe: `Network`,
      choices: networks.map(n => n[1]),
      default: networks[0][1]
    },
    'syncmode': {
      describe: 'Blockchain sync mode',
      choices: [ 'fast' ],
      default: 'fast'
    },
    'datadir': {
      describe: 'Data directory for the blockchain',
      default: `${os.homedir()}/Library/Ethereum`
    },
    'transports': {
      describe: 'Network transports',
      choices: [ 'rlpx', 'libp2p' ],
      default: 'rlpx',
      array: true
    },
    'rpc': {
      describe: 'Enable the JSON-RPC server',
      boolean: true,
      default: false
    },
    'rpcport': {
      describe: 'HTTP-RPC server listening port',
      number: true,
      default: 8545
    },
    'rpcaddr': {
      describe: 'HTTP-RPC server listening interface',
      default: 'localhost'
    },
    'loglevel': {
      describe: 'Logging verbosity',
      choices: [ 'error', 'warn', 'info', 'debug' ],
      default: 'info'
    }
  })
  .locale('en_EN')
  .argv
const logger = getLogger({loglevel: args.loglevel})

async function runNode (options) {
  let node
  if (options.syncmode === 'fast') {
    node = new FastSyncNode(options)
    logger.info('Ethereumjs fast sync client initialized')
  }
  node.on('error', err => logger.error(err))
  logger.info(`Connecting to the ${options.network} network`)
  await node.open()
  logger.info('Synchronizing blockchain...')
  await node.sync()
  logger.info('Synchronized')

  return node
}

function runRpcServer (chain, options) {
  const { rpcport, rpcaddr } = options
  const manager = new RPCManager(chain, options)
  const server = jayson.server(manager.getMethods())
  logger.info(`RPC HTTP endpoint opened: http://${rpcaddr}:${rpcport}`)
  server.http().listen(rpcport)
}

async function run () {
  const syncDirName = args.syncmode === 'light' ? 'lightchaindata' : 'chaindata'
  const networkDirName = args.network === 'mainnet' ? '' : `${args.network}/`
  const options = {
    network: args.network,
    logger: logger,
    transports: args.transports,
    syncmode: args.syncmode,
    dataDir: `${args.datadir}/${networkDirName}ethereumjs/${syncDirName}`,
    rpcport: args.rpcport,
    rpcaddr: args.rpcaddr
  }
  const node = await runNode(options)

  if (args.rpc) {
    runRpcServer(node.chain, options)
  }
}

run().catch(err => logger.error(err))
