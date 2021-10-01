#!/usr/bin/env node

import { homedir } from 'os'
import path from 'path'
import readline from 'readline'
import { randomBytes } from 'crypto'
import { ensureDirSync, readFileSync, removeSync } from 'fs-extra'
import { Server as RPCServer } from 'jayson/promise'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { _getInitializedChains } from '@ethereumjs/common/dist/chains'
import { Address, toBuffer } from 'ethereumjs-util'
import { parseMultiaddrs, parseGenesisState, parseCustomParams } from '../lib/util'
import EthereumClient from '../lib/client'
import { Config } from '../lib/config'
import { Logger } from '../lib/logging'
import { RPCManager } from '../lib/rpc'
import * as modules from '../lib/rpc/modules'
import { Event } from '../lib/types'
import type { Chain as IChain, GenesisState } from '@ethereumjs/common/dist/types'
const level = require('level')

const networks = Object.entries(_getInitializedChains().names)

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
      describe: 'Blockchain sync mode (light sync experimental)',
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
      default: `${homedir()}/Library/Ethereum/ethereumjs`,
    },
    customChain: {
      describe: 'Path to custom chain parameters json file (@ethereumjs/common format)',
      coerce: path.resolve,
    },
    customGenesisState: {
      describe: 'Path to custom genesis state json file (@ethereumjs/common format)',
      coerce: path.resolve,
    },
    gethGenesis: {
      describe: 'Import a geth genesis file for running a custom network',
      coerce: path.resolve,
    },
    transports: {
      describe: 'Network transports',
      default: Config.TRANSPORTS_DEFAULT,
      array: true,
    },
    bootnodes: {
      describe: 'Network bootnodes',
      array: true,
    },
    port: {
      describe: 'RLPx listening port',
      default: Config.PORT_DEFAULT,
    },
    multiaddrs: {
      describe: 'Network multiaddrs',
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
    helprpc: {
      describe: 'Display the JSON RPC help with a list of all RPC methods implemented (and exit)',
      boolean: true,
    },
    loglevel: {
      describe: 'Logging verbosity',
      choices: ['error', 'warn', 'info', 'debug'],
      default: Config.LOGLEVEL_DEFAULT,
    },
    maxPerRequest: {
      describe: 'Max items per block or header request',
      number: true,
      default: Config.MAXPERREQUEST_DEFAULT,
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
    dnsAddr: {
      describe: 'IPv4 address of DNS server to use when acquiring peer discovery targets',
      string: true,
      default: Config.DNSADDR_DEFAULT,
    },
    dnsNetworks: {
      describe: 'EIP-1459 ENR tree urls to query for peer discovery targets',
      array: true,
    },
    debugCode: {
      describe: 'Generate code for local debugging (internal usage mostly)',
      boolean: true,
      default: Config.DEBUGCODE_DEFAULT,
    },
    discDns: {
      describe: 'Query EIP-1459 DNS TXT records for peer discovery',
      boolean: true,
    },
    discV4: {
      describe: 'Use v4 ("findneighbour" node requests) for peer discovery',
      boolean: true,
    },
    mine: {
      describe: 'Enable private custom network mining (beta)',
      boolean: true,
      default: false,
    },
    unlock: {
      describe:
        'Comma separated list of accounts to unlock - currently only the first account is used (for sealing PoA blocks and as the default coinbase). Beta, you will be promped for a 0x-prefixed private key until keystore functionality is added - FOR YOUR SAFETY PLEASE DO NOT USE ANY ACCOUNTS HOLDING SUBSTANTIAL AMOUNTS OF ETH',
      array: true,
    },
    dev: {
      describe: 'Start an ephemeral PoA blockchain with a single miner and prefunded accounts',
      choices: [undefined, false, true, 'poa', 'pow'],
    },
    minerCoinbase: {
      describe:
        'Address for mining rewards (etherbase). If not provided, defaults to the primary account',
      string: true,
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
  const chainDataDir = config.getChainDataDirectory()
  ensureDirSync(chainDataDir)
  const stateDataDir = config.getStateDataDirectory()
  ensureDirSync(stateDataDir)

  config.logger.info(`Data directory: ${config.datadir}`)

  config.logger.info('Initializing Ethereumjs client...')
  if (config.lightserv) {
    config.logger.info(`Serving light peer requests`)
  }
  const client = new EthereumClient({
    config,
    chainDB: level(chainDataDir),
    stateDB: level(stateDataDir),
  })
  client.config.events.on(Event.SERVER_ERROR, (err) => config.logger.error(err))
  client.config.events.on(Event.SERVER_LISTENING, (details) => {
    config.logger.info(`Listener up transport=${details.transport} url=${details.url}`)
  })
  config.events.on(Event.SYNC_SYNCHRONIZED, (height) => {
    client.config.logger.info(`Synchronized blockchain at height ${height.toNumber()}`)
  })
  config.logger.info(`Connecting to network: ${config.chainCommon.chainName()}`)
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
  if (args.helprpc) {
    // Display RPC help and exit
    console.log('-'.repeat(27))
    console.log('JSON-RPC: Supported Methods')
    console.log('-'.repeat(27))
    console.log()
    modules.list.forEach((modName: string) => {
      console.log(`${modName}:`)
      RPCManager.getMethodNames((modules as any)[modName]).forEach((methodName: string) => {
        console.log(`-> ${modName.toLowerCase()}_${methodName}`)
      })
      console.log()
    })
    console.log()
    process.exit()
  }

  // give network id precedence over network name
  const chain = args.networkId ?? args.network ?? Chain.Mainnet

  // configure accounts for mining and prefunding in a local devnet
  const accounts: [address: Address, privateKey: Buffer][] = []
  if (args.unlock) {
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
        // eslint-disable-next-line no-extra-semi
        ;(rl as any).output.write('*')
      }
    })

    const question = (text: string) => {
      return new Promise<string>((resolve) => {
        rl.question(text, resolve)
      })
    }

    try {
      for (const addressString of args.unlock) {
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
    } catch (e: any) {
      console.error(`Encountered error unlocking account:\n${e.message}`)
      process.exit()
    }
    rl.close()
  }

  let common = new Common({ chain, hardfork: Hardfork.Chainstart })

  if (args.dev) {
    args.discDns = false
    if (accounts.length === 0) {
      // If generating new keys delete old chain data to prevent genesis block mismatch
      removeSync(`${args.datadir}/devnet`)
      // Create new account
      const privKey = randomBytes(32)
      const account = Address.fromPrivateKey(privKey)
      accounts.push([account, privKey])
      // prettier-ignore
      console.log(`==================================================\nAccount generated for mining blocks:\nAddress: ${account.toString()}\nPrivate key: 0x${privKey.toString( 'hex')}\nWARNING: Do not use this account for mainnet funds\n==================================================`)
    }

    const prefundAddress = accounts[0][0].toString().slice(2)
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
    const extraData = '0x' + '0'.repeat(64) + prefundAddress + '0'.repeat(130)
    const chainData = {
      ...defaultChainData,
      extraData,
      alloc: { [prefundAddress]: { balance: '0x10000000000000000000' } },
    }
    const chainParams = await parseCustomParams(chainData, 'devnet')
    const genesisState = await parseGenesisState(chainData)
    const customChainParams: [IChain, GenesisState][] = [[chainParams, genesisState]]
    common = new Common({
      chain: 'devnet',
      customChains: customChainParams,
      hardfork: Hardfork.London,
    })
  }

  // configure common based on args given
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
    const genesisParams = await parseCustomParams(
      genesisFile,
      path.parse(args.gethGenesis).base.split('.')[0]
    )
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
  const config = new Config({
    common,
    syncmode: args.syncmode,
    lightserv: args.lightserv,
    datadir,
    key,
    transports: args.transports,
    bootnodes: args.bootnodes ? parseMultiaddrs(args.bootnodes) : undefined,
    port: args.port,
    multiaddrs: args.multiaddrs ? parseMultiaddrs(args.multiaddrs) : undefined,
    rpc: args.rpc,
    rpcport: args.rpcport,
    rpcaddr: args.rpcaddr,
    loglevel: args.loglevel,
    maxPerRequest: args.maxPerRequest,
    minPeers: args.minPeers,
    maxPeers: args.maxPeers,
    dnsAddr: args.dnsAddr,
    dnsNetworks: args.dnsNetworks,
    debugCode: args.debugCode,
    discDns: args.discDns,
    discV4: args.discV4,
    mine: args.mine || args.dev,
    accounts,
    minerCoinbase: args.minerCoinbase,
  })
  logger = config.logger
  config.events.setMaxListeners(50)

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

run().catch((err) => logger?.error(err) ?? console.error(err))
