import Common from '@ethereumjs/common'
import VM from '@ethereumjs/vm'
import { getLogger, Logger } from './logging'
import { Libp2pServer, RlpxServer } from './net/server'
import { parseTransports } from './util'

export interface ConfigOptions {
  /**
   * Specify the chain by providing a common instance,
   * common instance will not be modified by client
   *
   * Default: 'mainnet' Common
   */
  common?: Common

  /**
   * Synchronization mode ('full' or 'light')
   *
   * Default: 'full'
   */
  syncmode?: string

  /**
   * Provide a custom VM instance to process blocks
   *
   * Default: VM instance created by client
   */
  vm?: VM

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
   * Logging verbosity
   *
   * Choices: ['debug', 'info', 'warn', 'error', 'off']
   * Default: 'info'
   */
  loglevel?: string

  /**
   * A custom winston logger can be provided
   * if setting logging verbosity is not sufficient
   *
   * Default: Logger with loglevel 'info'
   */
  logger?: Logger

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

  /**
   * DNS server to query DNS TXT records from for peer discovery
   *
   * Default `8.8.8.8` (Google)
   */
  dnsAddr?: string
}

export class Config {
  public static readonly CHAIN_DEFAULT = 'mainnet'
  public static readonly SYNCMODE_DEFAULT = 'full'
  public static readonly LIGHTSERV_DEFAULT = false
  public static readonly DATADIR_DEFAULT = `./datadir`
  public static readonly TRANSPORTS_DEFAULT = ['rlpx:port=30303', 'libp2p']
  public static readonly RPC_DEFAULT = false
  public static readonly RPCPORT_DEFAULT = 8545
  public static readonly RPCADDR_DEFAULT = 'localhost'
  public static readonly LOGLEVEL_DEFAULT = 'info'
  public static readonly MINPEERS_DEFAULT = 2
  public static readonly MAXPEERS_DEFAULT = 25
  public static readonly DNSADDR_DEFAULT = '8.8.8.8'

  public readonly logger: Logger
  public readonly syncmode: string
  public readonly vm?: VM
  public readonly lightserv: boolean
  public readonly datadir: string
  public readonly transports: string[]
  public readonly rpc: boolean
  public readonly rpcport: number
  public readonly rpcaddr: string
  public readonly loglevel: string
  public readonly minPeers: number
  public readonly maxPeers: number
  public readonly dnsAddr: string

  public readonly chainCommon: Common
  public readonly execCommon: Common

  public readonly servers: (RlpxServer | Libp2pServer)[] = []

  constructor(options: ConfigOptions = {}) {
    this.syncmode = options.syncmode ?? Config.SYNCMODE_DEFAULT
    this.vm = options.vm
    this.lightserv = options.lightserv ?? Config.LIGHTSERV_DEFAULT
    this.transports = options.transports ?? Config.TRANSPORTS_DEFAULT
    this.datadir = options.datadir ?? Config.DATADIR_DEFAULT
    this.rpc = options.rpc ?? Config.RPC_DEFAULT
    this.rpcport = options.rpcport ?? Config.RPCPORT_DEFAULT
    this.rpcaddr = options.rpcaddr ?? Config.RPCADDR_DEFAULT
    this.loglevel = options.loglevel ?? Config.LOGLEVEL_DEFAULT
    this.minPeers = options.minPeers ?? Config.MINPEERS_DEFAULT
    this.maxPeers = options.maxPeers ?? Config.MAXPEERS_DEFAULT
    this.dnsAddr = options.dnsAddr ?? Config.DNSADDR_DEFAULT

    // TODO: map chainParams (and lib/util.parseParams) to new Common format
    const common =
      options.common ?? new Common({ chain: Config.CHAIN_DEFAULT, hardfork: 'chainstart' })
    this.chainCommon = Object.assign(Object.create(Object.getPrototypeOf(common)), common)
    this.execCommon = Object.assign(Object.create(Object.getPrototypeOf(common)), common)

    if (options.logger) {
      if (options.loglevel) {
        throw new Error('Config initialization with both logger and loglevel options not allowed')
      }

      // Logger option takes precedence
      this.logger = options.logger
    } else {
      this.logger = getLogger({ loglevel: this.loglevel })
    }

    if (options.servers) {
      if (options.transports) {
        throw new Error(
          'Config initialization with both servers and transports options not allowed'
        )
      }

      // Servers option takes precedence
      this.servers = options.servers
    } else {
      // Otherwise parse transports from transports option
      this.servers = parseTransports(this.transports).map((t) => {
        if (t.name === 'rlpx') {
          t.options.bootnodes = t.options.bootnodes || this.chainCommon.bootstrapNodes()
          t.options.dnsNetworks = t.options.dnsNetworks || this.chainCommon.dnsNetworks()
          return new RlpxServer({ config: this, ...t.options })
        } else {
          return new Libp2pServer({ config: this, ...t.options })
        }
      })
    }
  }

  /**
   * Returns the directory for storing the client chain data
   * based on syncmode and selected chain (subdirectory of 'datadir')
   */
  getChainDataDirectory(): string {
    const networkDirName = this.chainCommon.chainName()
    const chainDataDirName = this.syncmode === 'light' ? 'lightchain' : 'chain'

    const dataDir = `${this.datadir}/${networkDirName}/${chainDataDirName}`
    return dataDir
  }

  /**
   * Returns the directory for storing the client state data
   * based selected chain (subdirectory of 'datadir')
   */
  getStateDataDirectory(): string {
    const networkDirName = this.chainCommon.chainName()

    const dataDir = `${this.datadir}/${networkDirName}/state`
    return dataDir
  }
}
