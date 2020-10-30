const os = require('os')
import Common from '@ethereumjs/common'
import { Logger } from 'winston'
import { defaultLogger } from './logging'
import { Libp2pServer, RlpxServer } from './net/server'
import { parseTransports } from './util'

export interface Options {
  /**
   * Specify the chain and hardfork by passing a Common instance.
   *
   * Default: chain 'mainnet' and hardfork 'chainstart'
   */
  common?: Common
  /**
   * The logger instance with the log level set (winston)
   *
   * Default: Logger with loglevel 'debug'
   */
  logger?: Logger
  /**
   * Synchronization mode ('fast' or 'light')
   *
   * Default: 'fast'
   */
  syncmode?: string
  /**
   * Serve light peer requests
   *
   * Default: `false`
   */
  lightserv?: boolean
  /**
   * Root data directory for the blockchain
   */
  datadir?: string
  /**
   * Network transports ('rlpx' and/or 'libp2p')
   *
   * Default: `['rlpx:port=30303', 'libp2p']`
   */
  transports?: string[]
  /**
   * Transport servers (RLPx or Libp2p)
   * Use `transports` option, only used for testing purposes
   *
   * Default: servers created from `transports` option
   */
  servers?: (RlpxServer | Libp2pServer)[]
  /**
   * Enable the JSON-RPC server
   * 
   * Default: false
   */
  rpc?: boolean
  /**
   * HTTP-RPC server listening port
   * 
   * Default: 8545
   */
  rpcport?: number
  /**
   * HTTP-RPC server listening interface
   */
  rpcaddr?: string
  /**
   * Number of peers needed before syncing
   *
   * Default: `2`
   */
  minPeers?: number
  /**
   * Maximum peers allowed
   *
   * Default: `25`
   */
  maxPeers?: number
}

export class Config {
  // Initialize Common with an explicit 'chainstart' HF set until
  // hardfork awareness is implemented within the library
  // Also a fix for https://github.com/ethereumjs/ethereumjs-vm/issues/757
  public static readonly COMMON_DEFAULT = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
  public static readonly LOGGER_DEFAULT = defaultLogger
  public static readonly SYNCMODE_DEFAULT = 'fast'
  public static readonly LIGHTSERV_DEFAULT = false
  public static readonly DATADIR_DEFAULT = `${os.homedir()}/Library/Ethereum`
  public static readonly TRANSPORTS_DEFAULT = ['rlpx:port=30303', 'libp2p']
  public static readonly RPC_DEFAULT = false
  public static readonly RPCPORT_DEFAULT = 8545
  public static readonly RPCADDR_DEFAULT = 'localhost'
  public static readonly MINPEERS_DEFAULT = 2
  public static readonly MAXPEERS_DEFAULT = 25

  public readonly common: Common
  public readonly logger: Logger
  public readonly syncmode: string
  public readonly lightserv: boolean
  public readonly datadir: string
  public readonly transports: string[]
  public readonly rpc: boolean
  public readonly rpcport: number
  public readonly rpcaddr: string
  public readonly minPeers: number
  public readonly maxPeers: number

  public readonly servers: (RlpxServer | Libp2pServer)[] = []

  constructor(options: Options = {}) {
    // TODO: map chainParams (and lib/util.parseParams) to new Common format
    this.common = options.common ?? Config.COMMON_DEFAULT
    this.logger = options.logger ?? Config.LOGGER_DEFAULT
    this.syncmode = options.syncmode ?? Config.SYNCMODE_DEFAULT
    this.lightserv = options.lightserv ?? Config.LIGHTSERV_DEFAULT
    this.transports = options.transports ?? Config.TRANSPORTS_DEFAULT
    this.datadir = options.datadir ?? Config.DATADIR_DEFAULT
    this.rpc = options.rpc ?? Config.RPC_DEFAULT
    this.rpcport = options.rpcport ?? Config.RPCPORT_DEFAULT
    this.rpcaddr = options.rpcaddr ?? Config.RPCADDR_DEFAULT
    this.minPeers = options.minPeers ?? Config.MINPEERS_DEFAULT
    this.maxPeers = options.maxPeers ?? Config.MAXPEERS_DEFAULT

    if (options.servers) {
      // Servers option takes precedence
      this.servers = options.servers
    } else {
      // Otherwise parse transports from transports option
      this.servers = parseTransports(this.transports).map((t) => {
        if (t.name === 'rlpx') {
          t.options.bootnodes = t.options.bootnodes || this.common.bootstrapNodes()
          return new RlpxServer({ config: this, ...t.options })
        } else {
          return new Libp2pServer({ config: this, ...t.options })
        }
      })
    }
  }

  /**
   * Returns the directory for storing the client sync data
   * based on syncmode and selected chain (subdirectory of 'datadir')
   */
  getSyncDataDirectory(): string {
    const syncDirName = this.syncmode === 'light' ? 'lightchaindata' : 'chaindata'
    const chain = this.common.chainName()
    const networkDirName = chain === 'mainnet' ? '' : `${chain}/`

    const dataDir = `${this.datadir}/${networkDirName}ethereumjs/${syncDirName}`
    return dataDir
  }
}
