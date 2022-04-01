import Common, { Hardfork } from '@ethereumjs/common'
import VM from '@ethereumjs/vm'
import { genPrivateKey } from '@ethereumjs/devp2p'
import { Address, BN } from 'ethereumjs-util'
import { Multiaddr } from 'multiaddr'
import { Logger, getLogger } from './logging'
import { Libp2pServer, RlpxServer } from './net/server'
import { parseTransports } from './util'
import { EventBus, EventBusType } from './types'
// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'
const level = require('level')

export enum DataDirectory {
  Chain = 'chain',
  State = 'state',
  Meta = 'meta',
}

export enum SyncMode {
  Full = 'full',
  Light = 'light',
  Beacon = 'beacon',
}

export interface ConfigOptions {
  /**
   * Specify the chain by providing a {@link Common} instance,
   * the common instance will not be modified by client
   *
   * Default: 'mainnet' Common
   */
  common?: Common

  /**
   * Synchronization mode ('full' or 'light')
   *
   * Default: 'full'
   */
  syncmode?: SyncMode

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
   * Private key for the client.
   * Use return value of {@link Config.getClientKey}.
   * If left blank, a random key will be generated and used.
   */
  key?: Buffer

  /**
   * Network transports ('rlpx' and/or 'libp2p')
   *
   * Default: `['rlpx', 'libp2p']`
   */
  transports?: string[]

  /**
   * Network bootnodes
   * (e.g. abc@18.138.108.67 or /ip4/127.0.0.1/tcp/50505/p2p/QmABC)
   */
  bootnodes?: Multiaddr[]

  /**
   * RLPx listening port
   *
   * Default: `30303`
   */
  port?: number

  /**
   * RLPx external IP
   */
  extIP?: string

  /**
   * Network multiaddrs for libp2p
   * (e.g. /ip4/127.0.0.1/tcp/50505/p2p/QmABC)
   */
  multiaddrs?: Multiaddr[]

  /**
   * Transport servers (RLPx or Libp2p)
   * Use `transports` option, only used for testing purposes
   *
   * Default: servers created from `transports` option
   */
  servers?: (RlpxServer | Libp2pServer)[]

  /**
   * Save tx receipts and logs in the meta db (default: false)
   */
  saveReceipts?: boolean

  /**
   * Number of recent blocks to maintain transactions index for
   * (default = 2350000 = about one year, 0 = entire chain)
   */
  txLookupLimit?: number

  /**
   * A custom winston logger can be provided
   * if setting logging verbosity is not sufficient
   *
   * Default: Logger with loglevel 'info'
   */
  logger?: Logger

  /**
   * Max items per block or header request
   *
   * Default: `50``
   */
  maxPerRequest?: number

  /**
   * Max jobs to be enqueued in the fetcher at any given time
   *
   * Default: `100`
   */
  maxFetcherJobs?: number

  /**
   * Number of peers needed before syncing
   *
   * Default: `1`
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

  /**
   * EIP-1459 ENR Tree urls to query via DNS for peer discovery
   */
  dnsNetworks?: string[]

  /**
   * Generate code for local debugging, currently providing a
   * code snippet which can be used to run blocks on the
   * EthereumJS VM on execution errors
   *
   * (meant to be used internally for the most part)
   */
  debugCode?: boolean

  /**
   * Query EIP-1459 DNS TXT records for peer discovery
   *
   * Default: `true` for testnets, false for mainnet
   */
  discDns?: boolean

  /**
   * Use v4 ("findneighbour" node requests) for peer discovery
   *
   * Default: `false` for testnets, true for mainnet
   */
  discV4?: boolean

  /**
   * Enable mining
   *
   * Default: `false`
   */
  mine?: boolean

  /**
   * Unlocked accounts of form [address, privateKey]
   * Currently only the first account is used to seal mined PoA blocks
   *
   * Default: []
   */
  accounts?: [address: Address, privKey: Buffer][]

  /**
   * Address for mining rewards (etherbase)
   * If not provided, defaults to the primary account.
   */
  minerCoinbase?: Address

  /**
   * If there is a reorg, this is a safe distance from which
   * to try to refetch and refeed the blocks.
   */
  safeReorgDistance?: number
}

export class Config {
  /**
   * Central event bus for events emitted by the different
   * components of the client
   */
  public readonly events: EventBusType

  public static readonly CHAIN_DEFAULT = 'mainnet'
  public static readonly SYNCMODE_DEFAULT = SyncMode.Full
  public static readonly LIGHTSERV_DEFAULT = false
  public static readonly DATADIR_DEFAULT = `./datadir`
  public static readonly TRANSPORTS_DEFAULT = ['rlpx', 'libp2p']
  public static readonly PORT_DEFAULT = 30303
  public static readonly MAXPERREQUEST_DEFAULT = 50
  public static readonly MAXFETCHERJOBS_DEFAULT = 100
  public static readonly MINPEERS_DEFAULT = 1
  public static readonly MAXPEERS_DEFAULT = 25
  public static readonly DNSADDR_DEFAULT = '8.8.8.8'
  public static readonly DEBUGCODE_DEFAULT = false
  public static readonly SAFE_REORG_DISTANCE = 100

  public readonly logger: Logger
  public readonly syncmode: SyncMode
  public readonly vm?: VM
  public readonly lightserv: boolean
  public readonly datadir: string
  public readonly key: Buffer
  public readonly transports: string[]
  public readonly bootnodes?: Multiaddr[]
  public readonly port?: number
  public readonly extIP?: string
  public readonly multiaddrs?: Multiaddr[]
  public readonly saveReceipts: boolean
  public readonly txLookupLimit: number
  public readonly maxPerRequest: number
  public readonly maxFetcherJobs: number
  public readonly minPeers: number
  public readonly maxPeers: number
  public readonly dnsAddr: string
  public readonly debugCode: boolean
  public readonly discDns: boolean
  public readonly discV4: boolean
  public readonly mine: boolean
  public readonly accounts: [address: Address, privKey: Buffer][]
  public readonly minerCoinbase?: Address
  public readonly safeReorgDistance: number

  public synchronized: boolean
  public lastSyncDate: number
  /** Best known block height */
  public syncTargetHeight?: BN

  public readonly chainCommon: Common
  public readonly execCommon: Common

  public readonly servers: (RlpxServer | Libp2pServer)[] = []

  constructor(options: ConfigOptions = {}) {
    this.events = new EventBus() as EventBusType

    this.syncmode = options.syncmode ?? Config.SYNCMODE_DEFAULT
    this.vm = options.vm
    this.lightserv = options.lightserv ?? Config.LIGHTSERV_DEFAULT
    this.transports = options.transports ?? Config.TRANSPORTS_DEFAULT
    this.bootnodes = options.bootnodes
    this.port = options.port ?? Config.PORT_DEFAULT
    this.extIP = options.extIP
    this.multiaddrs = options.multiaddrs
    this.datadir = options.datadir ?? Config.DATADIR_DEFAULT
    this.key = options.key ?? genPrivateKey()
    this.saveReceipts = options.saveReceipts ?? false
    this.txLookupLimit = options.txLookupLimit ?? 2350000
    this.maxPerRequest = options.maxPerRequest ?? Config.MAXPERREQUEST_DEFAULT
    this.maxFetcherJobs = options.maxFetcherJobs ?? Config.MAXFETCHERJOBS_DEFAULT
    this.minPeers = options.minPeers ?? Config.MINPEERS_DEFAULT
    this.maxPeers = options.maxPeers ?? Config.MAXPEERS_DEFAULT
    this.dnsAddr = options.dnsAddr ?? Config.DNSADDR_DEFAULT
    this.debugCode = options.debugCode ?? Config.DEBUGCODE_DEFAULT
    this.mine = options.mine ?? false
    this.accounts = options.accounts ?? []
    this.minerCoinbase = options.minerCoinbase
    this.safeReorgDistance = options.safeReorgDistance ?? Config.SAFE_REORG_DISTANCE

    this.synchronized = false
    this.lastSyncDate = 0

    const common =
      options.common ?? new Common({ chain: Config.CHAIN_DEFAULT, hardfork: Hardfork.Chainstart })
    this.chainCommon = common.copy()
    this.execCommon = common.copy()

    this.discDns = this.getDnsDiscovery(options.discDns)
    this.discV4 = this.getV4Discovery(options.discV4)

    this.logger = options.logger ?? getLogger({ loglevel: 'error' })

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
          const bootnodes = this.bootnodes ?? (this.chainCommon.bootstrapNodes() as any)
          const dnsNetworks = options.dnsNetworks ?? this.chainCommon.dnsNetworks()
          return new RlpxServer({ config: this, bootnodes, dnsNetworks })
        } else if (t.name === 'libp2p') {
          const multiaddrs = this.multiaddrs
          const bootnodes = this.bootnodes
          return new Libp2pServer({ config: this, multiaddrs, bootnodes })
        } else {
          throw new Error(`unknown transport: ${t.name}`)
        }
      })
    }
  }

  /**
   * Returns the network directory for the chain.
   */
  getNetworkDirectory(): string {
    const networkDirName = this.chainCommon.chainName()
    return `${this.datadir}/${networkDirName}`
  }

  /**
   * Returns the location for each {@link DataDirectory}
   */
  getDataDirectory(dir: DataDirectory): string {
    const networkDir = this.getNetworkDirectory()
    switch (dir) {
      case DataDirectory.Chain: {
        const chainDataDirName = this.syncmode === SyncMode.Light ? 'lightchain' : 'chain'
        return `${networkDir}/${chainDataDirName}`
      }
      case DataDirectory.State:
        return `${networkDir}/state`
      case DataDirectory.Meta:
        return `${networkDir}/meta`
    }
  }

  /**
   * Returns the config level db.
   */
  static getConfigDB(networkDir: string): LevelUp {
    const db = level(`${networkDir}/config` as any)
    return db
  }

  /**
   * Gets the client private key from the config db.
   */
  static async getClientKey(datadir: string, common: Common) {
    const networkDir = `${datadir}/${common.chainName()}`
    const db = this.getConfigDB(networkDir)
    const encodingOpts = { keyEncoding: 'utf8', valueEncoding: 'binary' }
    const dbKey = 'config:client_key'
    let key
    try {
      key = await db.get(dbKey, encodingOpts)
    } catch (error: any) {
      if (error.type === 'NotFoundError') {
        // generate and save a new key
        key = genPrivateKey()
        await db.put(dbKey, key, encodingOpts)
      }
    }
    return key
  }

  /**
   * Returns specified option or the default setting for whether DNS-based peer discovery
   * is enabled based on chainName. `true` for ropsten, rinkeby, and goerli
   */
  getDnsDiscovery(option: boolean | undefined): boolean {
    if (option !== undefined) return option
    const dnsNets = ['ropsten', 'rinkeby', 'goerli']
    return dnsNets.includes(this.chainCommon.chainName())
  }

  /**
   * Returns specified option or the default setting for whether v4 peer discovery
   * is enabled based on chainName. `true` for `mainnet`
   */
  getV4Discovery(option: boolean | undefined): boolean {
    if (option !== undefined) return option
    return this.chainCommon.chainName() === 'mainnet'
  }
}
