#!/usr/bin/env node
'use strict'

const Common = require('ethereumjs-common')
const chains = require('ethereumjs-common/chains')
const { getLogger } = require('../lib/logging')
const { parse } = require('../lib/util')
const Node = require('../lib/node')
const jayson = require('jayson')
const RPCManager = require('../lib/rpc')
const { randomBytes } = require('crypto')
const os = require('os')
const path = require('path')

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
      choices: [ 'light' ],
      default: 'light'
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
    'bootnodes': {
      describe: 'Comma separated RLPx bootstrap enode URLs'
    },
    'port': {
      describe: 'Network listening port',
      default: 30303
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
    },
    'params': {
      describe: 'Path to chain parameters json file',
      coerce: path.resolve
    },
    'key': {
      describe: '32-byte hex string to generate key pair from',
      default: 'random',
      coerce: key => key.length === 64 ? Buffer.from(key, 'hex') : randomBytes(32)
    }
  })
  .locale('en_EN')
  .argv
const logger = getLogger({loglevel: args.loglevel})

async function runNode (options) {
  logger.info('Initializing Ethereumjs client...')
  const node = new Node(options)
  node.on('error', err => logger.error(err))
  node.on('listening', details => logger.info(`Listener up url=${details.url}`))
  logger.info(`Connecting to network: ${options.common.chainName()}`)
  await node.open()
  logger.info('Synchronizing blockchain...')
  node.start().then(() => logger.info('Synchronized'))

  return node
}

function runRpcServer (node, options) {
  const { rpcport, rpcaddr } = options
  const manager = new RPCManager(node, options)
  const server = jayson.server(manager.getMethods())
  logger.info(`RPC HTTP endpoint opened: http://${rpcaddr}:${rpcport}`)
  server.http().listen(rpcport)
}

async function run () {
  const syncDirName = args.syncmode === 'light' ? 'lightchaindata' : 'chaindata'
  const networkDirName = args.network === 'mainnet' ? '' : `${args.network}/`
  const chainParams = args.params ? await parse.params(args.params) : args.network
  const common = new Common(chainParams)
  const options = {
    common: common,
    logger: logger,
    transports: args.transports,
    syncmode: args.syncmode,
    dataDir: `${args.datadir}/${networkDirName}ethereumjs/${syncDirName}`,
    localPort: args.port,
    rpcport: args.rpcport,
    rpcaddr: args.rpcaddr,
    bootnodes: parse.bootnodes(args.bootnodes),
    privateKey: args.key
  }
  const node = await runNode(options)

  if (args.rpc) {
    runRpcServer(node, options)
  }
}

run().catch(err => logger.error(err))
