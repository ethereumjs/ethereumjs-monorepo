#!/usr/bin/env node

import { homedir } from 'os'
import path from 'path'
import readline from 'readline'
import { randomBytes } from 'crypto'
import { existsSync } from 'fs'
import { ensureDirSync, readFileSync, removeSync } from 'fs-extra'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { _getInitializedChains } from '@ethereumjs/common/dist/chains'
import { Address, toBuffer, BN } from 'ethereumjs-util'
import { parseMultiaddrs, parseGenesisState, parseCustomParams } from '../lib/util'
import EthereumClient from '../lib/client'
import { Config, DataDirectory, SyncMode } from '../lib/config'
import { Logger, getLogger } from '../lib/logging'
import { startRPCServers, helprpc } from './startRpc'
import type { Chain as IChain, GenesisState } from '@ethereumjs/common/dist/types'
import type { FullEthereumService } from '../lib/service'
const level = require('level')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

type Account = [address: Address, privateKey: Buffer]

const networks = Object.entries(_getInitializedChains().names)

let logger: Logger

const args = yargs(hideBin(process.argv))
  .option('network', {
    describe: 'Network',
    choices: networks.map((n) => n[1]),
    default: 'mainnet',
  })
  .option('network-id', {
    describe: 'Network ID',
    choices: networks.map((n) => parseInt(n[0])),
    default: undefined,
  })
  .option('syncmode', {
    describe: 'Blockchain sync mode (light sync experimental)',
    choices: Object.values(SyncMode),
    default: Config.SYNCMODE_DEFAULT,
  })
  .option('lightserv', {
    describe: 'Serve light peer requests',
    boolean: true,
    default: Config.LIGHTSERV_DEFAULT,
  })
  .option('datadir', {
    describe: 'Data directory for the blockchain',
    default: `${homedir()}/Library/Ethereum/ethereumjs`,
  })
  .option('customChain', {
    describe: 'Path to custom chain parameters json file (@ethereumjs/common format)',
    coerce: (arg: string) => (arg ? path.resolve(arg) : undefined),
  })
  .option('customGenesisState', {
    describe: 'Path to custom genesis state json file (@ethereumjs/common format)',
    coerce: (arg: string) => (arg ? path.resolve(arg) : undefined),
  })
  .option('gethGenesis', {
    describe: 'Import a geth genesis file for running a custom network',
    coerce: (arg: string) => (arg ? path.resolve(arg) : undefined),
  })
  .option('transports', {
    describe: 'Network transports',
    default: Config.TRANSPORTS_DEFAULT,
    array: true,
  })
  .option('bootnodes', {
    describe: 'Comma-separated list of network bootnodes',
    array: true,
  })
  .option('port', {
    describe: 'RLPx listening port',
    default: Config.PORT_DEFAULT,
  })
  .option('extIP', {
    describe: 'RLPx external IP',
    string: true,
  })
  .option('multiaddrs', {
    describe: 'Network multiaddrs',
    array: true,
  })
  .option('rpc', {
    describe: 'Enable the JSON-RPC server with HTTP endpoint',
    boolean: true,
  })
  .option('rpcport', {
    describe: 'HTTP-RPC server listening port',
    default: 8545,
  })
  .option('rpcaddr', {
    describe: 'HTTP-RPC server listening interface address',
    default: 'localhost',
  })
  .option('ws', {
    describe: 'Enable the JSON-RPC server with WS endpoint',
    boolean: true,
  })
  .option('wsPort', {
    describe: 'WS-RPC server listening port',
    default: 8545,
  })
  .option('wsAddr', {
    describe: 'WS-RPC server listening address',
    default: 'localhost',
  })
  .option('rpcEngine', {
    describe: 'Enable the JSON-RPC server for Engine namespace',
    boolean: true,
  })
  .option('rpcEnginePort', {
    describe: 'HTTP-RPC server listening port for Engine namespace',
    number: true,
    default: 8551,
  })
  .option('rpcEngineAddr', {
    describe: 'HTTP-RPC server listening interface address for Engine namespace',
    string: true,
    default: 'localhost',
  })
  .option('wsEnginePort', {
    describe: 'WS-RPC server listening port for Engine namespace',
    number: true,
    default: 8551,
  })
  .option('wsEngineAddr', {
    describe: 'WS-RPC server listening interface address for Engine namespace',
    string: true,
    default: 'localhost',
  })
  .option('rpcEngineAuth', {
    describe: 'Enable jwt authentication for Engine RPC server',
    boolean: true,
    default: true,
  })
  .option('jwt-secret', {
    describe: 'Provide a file containing a hex encoded jwt secret for Engine RPC server',
    coerce: (arg: string) => (arg ? path.resolve(arg) : undefined),
  })
  .option('helprpc', {
    describe: 'Display the JSON RPC help with a list of all RPC methods implemented (and exit)',
    boolean: true,
  })
  .option('loglevel', {
    describe: 'Logging verbosity',
    choices: ['error', 'warn', 'info', 'debug'],
    default: 'info',
  })
  .option('logFile', {
    describe: 'File to save log file (pass true for `ethereumjs.log`)',
  })
  .option('logLevelFile', {
    describe: 'Log level for logFile',
    choices: ['error', 'warn', 'info', 'debug'],
    default: 'info',
  })
  .option('logRotate', {
    describe: 'Rotate log file daily',
    boolean: true,
    default: true,
  })
  .option('logMaxFiles', {
    describe: 'Maximum number of log files when rotating (older will be deleted)',
    number: true,
    default: 5,
  })
  .option('rpcDebug', {
    describe: 'Additionally log complete RPC calls on log level debug (i.e. --loglevel=debug)',
    boolean: true,
  })
  .option('rpcCors', {
    describe: 'Configure the Access-Control-Allow-Origin CORS header for RPC server',
    string: true,
    default: '*',
  })
  .option('maxPerRequest', {
    describe: 'Max items per block or header request',
    number: true,
    default: Config.MAXPERREQUEST_DEFAULT,
  })
  .option('maxFetcherJobs', {
    describe: 'Max tasks or jobs to be created for a fetcher at a time',
    number: true,
    default: Config.MAXFETCHERJOBS_DEFAULT,
  })
  .option('minPeers', {
    describe: 'Peers needed before syncing',
    number: true,
    default: Config.MINPEERS_DEFAULT,
  })
  .option('maxPeers', {
    describe: 'Maximum peers to sync with',
    number: true,
    default: Config.MAXPEERS_DEFAULT,
  })
  .option('dnsAddr', {
    describe: 'IPv4 address of DNS server to use when acquiring peer discovery targets',
    string: true,
    default: Config.DNSADDR_DEFAULT,
  })
  .option('dnsNetworks', {
    describe: 'EIP-1459 ENR tree urls to query for peer discovery targets',
    array: true,
  })
  .option('executeBlocks', {
    describe:
      'Debug mode for reexecuting existing blocks (no services will be started), allowed input formats: 5,5-10',
    string: true,
  })
  .option('debugCode', {
    describe: 'Generate code for local debugging (internal usage mostly)',
    boolean: true,
    default: Config.DEBUGCODE_DEFAULT,
  })
  .option('discDns', {
    describe: 'Query EIP-1459 DNS TXT records for peer discovery',
    boolean: true,
  })
  .option('discV4', {
    describe: 'Use v4 ("findneighbour" node requests) for peer discovery',
    boolean: true,
  })
  .option('mine', {
    describe: 'Enable private custom network mining (beta)',
    boolean: true,
    default: false,
  })
  .option('unlock', {
    describe: `Path to file where private key (without 0x) is stored or comma separated list of accounts to unlock - 
      currently only the first account is used (for sealing PoA blocks and as the default coinbase). 
      You will be prompted for a 0x-prefixed private key if you pass a list of accounts
      FOR YOUR SAFETY PLEASE DO NOT USE ANY ACCOUNTS HOLDING SUBSTANTIAL AMOUNTS OF ETH`,
    string: true,
  })
  .option('dev', {
    describe: 'Start an ephemeral PoA blockchain with a single miner and prefunded accounts',
    choices: [undefined, false, true, 'poa', 'pow'],
  })
  .option('minerCoinbase', {
    describe:
      'Address for mining rewards (etherbase). If not provided, defaults to the primary account',
    string: true,
  })
  .option('saveReceipts', {
    describe:
      'Save tx receipts and logs in the meta db (warning: may use a large amount of storage). With `--rpc` allows querying via eth_getLogs (max 10000 logs per request) and eth_getTransactionReceipt (within `--txLookupLimit`)',
    boolean: true,
  })
  .option('disableBeaconSync', {
    describe:
      'Disables beacon (optimistic) sync if the CL provides blocks at the head of the chain',
    boolean: true,
  })
  .option('txLookupLimit', {
    describe:
      'Number of recent blocks to maintain transactions index for (default = about one year, 0 = entire chain)',
    number: true,
    default: 2350000,
  })
  .option('startBlock', {
    describe:
      'Block number to start syncing from. Must be lower than the local chain tip. Note: this is destructive and removes blocks from the blockchain, please back up your datadir before using.',
    number: true,
  }).argv

/**
 * Initializes and returns the databases needed for the client
 */
function initDBs(config: Config) {
  // Chain DB
  const chainDataDir = config.getDataDirectory(DataDirectory.Chain)
  ensureDirSync(chainDataDir)
  const chainDB = level(chainDataDir)

  // State DB
  const stateDataDir = config.getDataDirectory(DataDirectory.State)
  ensureDirSync(stateDataDir)
  const stateDB = level(stateDataDir)

  // Meta DB (receipts, logs, indexes, skeleton chain)
  const metaDataDir = config.getDataDirectory(DataDirectory.Meta)
  ensureDirSync(metaDataDir)
  const metaDB = level(metaDataDir)

  return { chainDB, stateDB, metaDB }
}

/**
 * Special block execution debug mode (does not change any state)
 */
async function executeBlocks(client: EthereumClient) {
  let first = 0
  let last = 0
  let txHashes = []
  try {
    const blockRange = (args.executeBlocks as string).split('-').map((val) => {
      const reNum = /([0-9]+)/.exec(val)
      const num = reNum ? parseInt(reNum[1]) : 0
      const reTxs = /[0-9]+\[(.*)\]/.exec(val)
      const txs = reTxs ? reTxs[1].split(',') : []
      return [num, txs]
    })
    first = blockRange[0][0] as number
    last = blockRange.length === 2 ? (blockRange[1][0] as number) : first
    txHashes = blockRange[0][1] as string[]

    if ((blockRange[0][1] as string[]).length > 0 && blockRange.length === 2) {
      throw new Error('wrong input')
    }
  } catch (e: any) {
    client.config.logger.error(
      'Wrong input format for block execution, allowed format types: 5, 5-10, 5[0xba4b5fd92a26badad3cad22eb6f7c7e745053739b5f5d1e8a3afb00f8fb2a280,[TX_HASH_2],...], 5[*] (all txs in verbose mode)'
    )
    process.exit()
  }
  const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
  if (!execution) throw new Error('executeBlocks requires execution')
  await execution.executeBlocks(first, last, txHashes)
}

/**
 * Starts the client on a specified block number.
 * Note: this is destructive and removes blocks from the blockchain. Please back up your datadir.
 */
async function startBlock(client: EthereumClient) {
  if (!args.startBlock) return
  const startBlock = new BN(args.startBlock)
  const { blockchain } = client.chain
  const height = (await blockchain.getLatestHeader()).number
  if (height.eq(startBlock)) return
  if (height.lt(startBlock)) {
    logger.error(`Cannot start chain higher than current height ${height}`)
    process.exit()
  }
  try {
    const headBlock = await blockchain.getBlock(startBlock)
    const delBlock = await blockchain.getBlock(startBlock.addn(1))
    await blockchain.delBlock(delBlock.hash())
    logger.info(`Chain height reset to ${headBlock.header.number}`)
  } catch (err: any) {
    logger.error(`Error setting back chain in startBlock: ${err}`)
    process.exit()
  }
}

/**
 * Starts and returns the {@link EthereumClient}
 */
async function startClient(config: Config) {
  config.logger.info(`Data directory: ${config.datadir}`)
  if (config.lightserv) {
    config.logger.info(`Serving light peer requests`)
  }

  const dbs = initDBs(config)
  const client = new EthereumClient({
    config,
    ...dbs,
  })

  if (args.startBlock) {
    await startBlock(client)
  }

  await client.open()

  if (args.executeBlocks) {
    // Special block execution debug mode (does not change any state)
    await executeBlocks(client)
  } else {
    // Regular client start
    await client.start()
  }
  return client
}

/**
 * Returns a configured common for devnet with a prefunded address
 */
async function setupDevnet(prefundAddress: Address) {
  const addr = prefundAddress.toString().slice(2)
  const consensusConfig =
    args.dev === 'pow'
      ? { ethash: true }
      : {
          clique: {
            period: 10,
            epoch: 30000,
          },
        }
  const defaultChainData = {
    config: {
      chainId: 123456,
      homesteadBlock: 0,
      eip150Block: 0,
      eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      berlinBlock: 0,
      londonBlock: 0,
      ...consensusConfig,
    },
    nonce: '0x0',
    timestamp: '0x614b3731',
    gasLimit: '0x47b760',
    difficulty: '0x1',
    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    coinbase: '0x0000000000000000000000000000000000000000',
    number: '0x0',
    gasUsed: '0x0',
    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    baseFeePerGas: 7,
  }
  const extraData = '0x' + '0'.repeat(64) + addr + '0'.repeat(130)
  const chainData = {
    ...defaultChainData,
    extraData,
    alloc: { [addr]: { balance: '0x10000000000000000000' } },
  }
  const chainParams = await parseCustomParams(chainData, 'devnet')
  const genesisState = await parseGenesisState(chainData)
  const customChainParams: [IChain, GenesisState][] = [[chainParams, genesisState]]
  return new Common({
    chain: 'devnet',
    customChains: customChainParams,
    hardfork: Hardfork.London,
  })
}

/**
 * Accept account input from command line
 */
async function inputAccounts() {
  const accounts: Account[] = []

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  // Hide key input
  ;(rl as any).input.on('keypress', function () {
    // get the number of characters entered so far:
    const len = (rl as any).line.length
    // move cursor back to the beginning of the input:
    readline.moveCursor((rl as any).output, -len, 0)
    // clear everything to the right of the cursor:
    readline.clearLine((rl as any).output, 1)
    // replace the original input with asterisks:
    for (let i = 0; i < len; i++) {
      ;(rl as any).output.write('*')
    }
  })

  const question = (text: string) => {
    return new Promise<string>((resolve) => {
      rl.question(text, resolve)
    })
  }

  try {
    const addresses = args.unlock.split(',')
    const isFile = existsSync(path.resolve(addresses[0]))
    if (!isFile) {
      for (const addressString of addresses) {
        const address = Address.fromString(addressString)
        const inputKey = await question(
          `Please enter the 0x-prefixed private key to unlock ${address}:\n`
        )
        ;(rl as any).history = (rl as any).history.slice(1)
        const privKey = toBuffer(inputKey)
        const derivedAddress = Address.fromPrivateKey(privKey)
        if (address.equals(derivedAddress)) {
          accounts.push([address, privKey])
        } else {
          console.error(
            `Private key does not match for ${address} (address derived: ${derivedAddress})`
          )
          process.exit()
        }
      }
    } else {
      const acc = readFileSync(path.resolve(args.unlock), 'utf-8')
      const privKey = Buffer.from(acc, 'hex')
      const derivedAddress = Address.fromPrivateKey(privKey)
      accounts.push([derivedAddress, privKey])
    }
  } catch (e: any) {
    console.error(`Encountered error unlocking account:\n${e.message}`)
    process.exit()
  }
  rl.close()
  return accounts
}

/**
 * Returns a randomly generated account
 */
function generateAccount(): Account {
  const privKey = randomBytes(32)
  const address = Address.fromPrivateKey(privKey)
  console.log('='.repeat(50))
  console.log('Account generated for mining blocks:')
  console.log(`Address: ${address}`)
  console.log(`Private key: 0x${privKey.toString('hex')}`)
  console.log('WARNING: Do not use this account for mainnet funds')
  console.log('='.repeat(50))
  return [address, privKey]
}

/**
 * Main entry point to start a client
 */
async function run() {
  if (args.helprpc) {
    // Output RPC help and exit
    return helprpc()
  }

  // Give network id precedence over network name
  const chain = args.networkId ?? args.network ?? Chain.Mainnet

  // Configure accounts for mining and prefunding in a local devnet
  const accounts: Account[] = []
  if (args.unlock) {
    accounts.push(...(await inputAccounts()))
  }

  let common = new Common({ chain, hardfork: Hardfork.Chainstart })

  if (args.dev) {
    args.discDns = false
    if (accounts.length === 0) {
      // If generating new keys delete old chain data to prevent genesis block mismatch
      removeSync(`${args.datadir}/devnet`)
      // Create new account
      accounts.push(generateAccount())
    }
    const prefundAddress = accounts[0][0]
    common = await setupDevnet(prefundAddress)
  }

  // Configure common based on args given
  if (
    (args.customChainParams || args.customGenesisState || args.gethGenesis) &&
    (!(args.network === 'mainnet') || args.networkId)
  ) {
    console.error('cannot specify both custom chain parameters and preset network ID')
    process.exit()
  }
  // Use custom chain parameters file if specified
  if (args.customChain) {
    if (!args.customGenesisState) {
      console.error('cannot have custom chain parameters without genesis state')
      process.exit()
    }
    try {
      const customChainParams = JSON.parse(readFileSync(args.customChain, 'utf-8'))
      const genesisState = JSON.parse(readFileSync(args.customGenesisState, 'utf-8'))
      common = new Common({
        chain: customChainParams.name,
        customChains: [[customChainParams, genesisState]],
      })
    } catch (err: any) {
      console.error(`invalid chain parameters: ${err.message}`)
      process.exit()
    }
  } else if (args.gethGenesis) {
    // Use geth genesis parameters file if specified
    const genesisFile = JSON.parse(readFileSync(args.gethGenesis, 'utf-8'))
    const chainName = path.parse(args.gethGenesis).base.split('.')[0]
    const genesisParams = await parseCustomParams(genesisFile, chainName)
    const genesisState = genesisFile.alloc ? await parseGenesisState(genesisFile) : {}
    common = new Common({
      chain: genesisParams.name,
      customChains: [[genesisParams, genesisState]],
    })
  }

  if (args.mine && accounts.length === 0) {
    console.error(
      'Please provide an account to mine blocks with `--unlock [address]` or use `--dev` to generate'
    )
    process.exit()
  }

  const datadir = args.datadir ?? Config.DATADIR_DEFAULT
  const configDirectory = `${datadir}/${common.chainName()}/config`
  ensureDirSync(configDirectory)
  const key = await Config.getClientKey(datadir, common)
  logger = getLogger(args)
  const bootnodes = args.bootnodes ? parseMultiaddrs(args.bootnodes) : undefined
  const multiaddrs = args.multiaddrs ? parseMultiaddrs(args.multiaddrs) : undefined
  const config = new Config({
    accounts,
    bootnodes,
    common,
    datadir,
    debugCode: args.debugCode,
    discDns: args.discDns,
    discV4: args.discV4,
    dnsAddr: args.dnsAddr,
    dnsNetworks: args.dnsNetworks,
    extIP: args.extIP,
    key,
    lightserv: args.lightserv,
    logger,
    maxPeers: args.maxPeers,
    maxPerRequest: args.maxPerRequest,
    maxFetcherJobs: args.maxFetcherJobs,
    mine: args.mine || args.dev,
    minerCoinbase: args.minerCoinbase,
    minPeers: args.minPeers,
    multiaddrs,
    port: args.port,
    saveReceipts: args.saveReceipts,
    syncmode: args.syncmode,
    disableBeaconSync: args.disableBeaconSync,
    transports: args.transports,
    txLookupLimit: args.txLookupLimit,
  })
  config.events.setMaxListeners(50)

  const client = await startClient(config)
  const servers = args.rpc || args.rpcEngine ? startRPCServers(client, args) : []

  process.on('SIGINT', async () => {
    config.logger.info('Caught interrupt signal. Shutting down...')
    servers.forEach((s) => s.http().close())
    await client.stop()
    config.logger.info('Exiting.')
    process.exit()
  })
}

run().catch((err) => logger?.error(err.message.toString()) ?? console.error(err))
