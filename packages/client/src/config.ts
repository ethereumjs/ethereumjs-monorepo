import { Common, Hardfork } from '@ethereumjs/common'
import { genPrivateKey } from '@ethereumjs/devp2p'
import { Level } from 'level'

import { getLogger } from './logging'
import { Libp2pServer, RlpxServer } from './net/server'
import { Event, EventBus } from './types'
import { parseTransports, short } from './util'

import type { Logger } from './logging'
import type { EventBusType, MultiaddrLike } from './types'
import type { BlockHeader } from '@ethereumjs/block'
import type { Address } from '@ethereumjs/util'
import type { VM } from '@ethereumjs/vm'
import type { Multiaddr } from 'multiaddr'

export enum DataDirectory {
  Chain = 'chain',
  State = 'state',
  Meta = 'meta',
}

export enum SyncMode {
  Full = 'full',
  Light = 'light',
  None = 'none',
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
   * Whether to disable beacon (optimistic) sync if CL provides
   * blocks at the head of chain.
   *
   * Default: false
   */
  disableBeaconSync?: boolean

  /**
   * Whether to test and run snapSync. When fully ready, this needs to
   * be replaced by a more sophisticated condition based on how far back we are
   * from the head, and how to run it in conjunction with the beacon sync
   * blocks at the head of chain.
   *
   * Default: false
   */
  forceSnapSync?: boolean

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
  key?: Uint8Array

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
   * Default: `100`
   */
  maxPerRequest?: number

  /**
   * Max jobs to be enqueued in the fetcher at any given time
   *
   * Default: `100`
   */
  maxFetcherJobs?: number

  /**
   * Max outgoing multi-peer requests by the fetcher at any given time
   */
  maxFetcherRequests?: number

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
   * Start continuous VM execution (pre-Merge setting)
   */
  execution?: boolean

  /**
   * Number of blocks to execute in batch mode and logged to console
   */
  numBlocksPerIteration?: number

  /**
   * Size for the account cache (max number of accounts)
   */
  accountCache?: number

  /**
   * Size for the storage cache (max number of contracts)
   */
  storageCache?: number

  /**
   * Size for the trie cache (max number of trie nodes)
   */
  trieCache?: number

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
   * Is a single node and doesn't need peers for synchronization
   *
   * Default: `false`
   */
  isSingleNode?: boolean

  /**
   * Unlocked accounts of form [address, privateKey]
   * Currently only the first account is used to seal mined PoA blocks
   *
   * Default: []
   */
  accounts?: [address: Address, privKey: Uint8Array][]

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

  /**
   * If there is a skeleton fillCanonicalChain block lookup errors
   * because of closing chain conditions, this allows skeleton
   * to backstep and fill again using reverse block fetcher.
   */
  skeletonFillCanonicalBackStep?: number

  /**
   * If skeleton subchains can be merged, what is the minimum tail
   * gain, as subchain merge will lead to the ReverseBlockFetcher
   * reset
   */
  skeletonSubchainMergeMinimum?: number

  maxRangeBytes?: number

  maxAccountRange?: bigint
  /**
   * The time after which synced state is downgraded to unsynced
   */
  syncedStateRemovalPeriod?: number

  maxStorageRange?: bigint
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
  public static readonly TRANSPORTS_DEFAULT = ['rlpx']
  public static readonly PORT_DEFAULT = 30303
  public static readonly MAXPERREQUEST_DEFAULT = 100
  public static readonly MAXFETCHERJOBS_DEFAULT = 100
  public static readonly MAXFETCHERREQUESTS_DEFAULT = 5
  public static readonly MINPEERS_DEFAULT = 1
  public static readonly MAXPEERS_DEFAULT = 25
  public static readonly DNSADDR_DEFAULT = '8.8.8.8'
  public static readonly EXECUTION = true
  public static readonly NUM_BLOCKS_PER_ITERATION = 100
  public static readonly ACCOUNT_CACHE = 400000
  public static readonly STORAGE_CACHE = 200000
  public static readonly TRIE_CACHE = 200000
  public static readonly DEBUGCODE_DEFAULT = false
  public static readonly SAFE_REORG_DISTANCE = 100
  public static readonly SKELETON_FILL_CANONICAL_BACKSTEP = 100
  public static readonly SKELETON_SUBCHAIN_MERGE_MINIMUM = 1000
  public static readonly MAX_RANGE_BYTES = 50000
  // This should get like 100 accounts in this range
  public static readonly MAX_ACCOUNT_RANGE =
    (BigInt(2) ** BigInt(256) - BigInt(1)) / BigInt(1_000_000)
  // Larger ranges used for storage slots since assumption is slots should be much sparser than accounts
  public static readonly MAX_STORAGE_RANGE = (BigInt(2) ** BigInt(256) - BigInt(1)) / BigInt(10)
  public static readonly SYNCED_STATE_REMOVAL_PERIOD = 60000

  public readonly logger: Logger
  public readonly syncmode: SyncMode
  public readonly vm?: VM
  public readonly lightserv: boolean
  public readonly datadir: string
  public readonly key: Uint8Array
  public readonly transports: string[]
  public readonly bootnodes?: Multiaddr[]
  public readonly port?: number
  public readonly extIP?: string
  public readonly multiaddrs?: Multiaddr[]
  public readonly saveReceipts: boolean
  public readonly txLookupLimit: number
  public readonly maxPerRequest: number
  public readonly maxFetcherJobs: number
  public readonly maxFetcherRequests: number
  public readonly minPeers: number
  public readonly maxPeers: number
  public readonly dnsAddr: string
  public readonly execution: boolean
  public readonly numBlocksPerIteration: number
  public readonly accountCache: number
  public readonly storageCache: number
  public readonly trieCache: number
  public readonly debugCode: boolean
  public readonly discDns: boolean
  public readonly discV4: boolean
  public readonly mine: boolean
  public readonly isSingleNode: boolean
  public readonly accounts: [address: Address, privKey: Uint8Array][]
  public readonly minerCoinbase?: Address

  public readonly safeReorgDistance: number
  public readonly skeletonFillCanonicalBackStep: number
  public readonly skeletonSubchainMergeMinimum: number
  public readonly maxRangeBytes: number
  public readonly maxAccountRange: bigint
  public readonly maxStorageRange: bigint
  public readonly syncedStateRemovalPeriod: number

  public readonly disableBeaconSync: boolean
  public readonly forceSnapSync: boolean
  // Just a development only flag, will/should be removed
  public readonly disableSnapSync: boolean = false

  public synchronized: boolean
  /** lastSyncDate in ms */
  public lastSyncDate: number
  /** Best known block height */
  public syncTargetHeight?: bigint
  /** Client is in the process of shutting down */
  public shutdown: boolean = false

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
    this.maxFetcherRequests = options.maxPerRequest ?? Config.MAXFETCHERREQUESTS_DEFAULT
    this.minPeers = options.minPeers ?? Config.MINPEERS_DEFAULT
    this.maxPeers = options.maxPeers ?? Config.MAXPEERS_DEFAULT
    this.dnsAddr = options.dnsAddr ?? Config.DNSADDR_DEFAULT
    this.execution = options.execution ?? Config.EXECUTION
    this.numBlocksPerIteration = options.numBlocksPerIteration ?? Config.NUM_BLOCKS_PER_ITERATION
    this.accountCache = options.accountCache ?? Config.ACCOUNT_CACHE
    this.storageCache = options.storageCache ?? Config.STORAGE_CACHE
    this.trieCache = options.trieCache ?? Config.TRIE_CACHE
    this.debugCode = options.debugCode ?? Config.DEBUGCODE_DEFAULT
    this.mine = options.mine ?? false
    this.isSingleNode = options.isSingleNode ?? false
    this.accounts = options.accounts ?? []
    this.minerCoinbase = options.minerCoinbase

    this.safeReorgDistance = options.safeReorgDistance ?? Config.SAFE_REORG_DISTANCE
    this.skeletonFillCanonicalBackStep =
      options.skeletonFillCanonicalBackStep ?? Config.SKELETON_FILL_CANONICAL_BACKSTEP
    this.skeletonSubchainMergeMinimum =
      options.skeletonSubchainMergeMinimum ?? Config.SKELETON_SUBCHAIN_MERGE_MINIMUM
    this.maxRangeBytes = options.maxRangeBytes ?? Config.MAX_RANGE_BYTES
    this.maxAccountRange = options.maxAccountRange ?? Config.MAX_ACCOUNT_RANGE
    this.maxStorageRange = options.maxStorageRange ?? Config.MAX_STORAGE_RANGE
    this.syncedStateRemovalPeriod =
      options.syncedStateRemovalPeriod ?? Config.SYNCED_STATE_REMOVAL_PERIOD

    this.disableBeaconSync = options.disableBeaconSync ?? false
    this.forceSnapSync = options.forceSnapSync ?? false

    // Start it off as synchronized if this is configured to mine or as single node
    this.synchronized = this.isSingleNode ?? this.mine
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
          const bootnodes: MultiaddrLike =
            this.bootnodes ?? (this.chainCommon.bootstrapNodes() as any)
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

    this.events.once(Event.CLIENT_SHUTDOWN, () => {
      this.shutdown = true
    })
  }

  /**
   * Update the synchronized state of the chain
   * @param option latest to update the sync state with
   * @emits {@link Event.SYNC_SYNCHRONIZED}
   */
  updateSynchronizedState(latest?: BlockHeader | null, emitSyncEvent?: boolean) {
    // If no syncTargetHeight has been discovered from peer and neither the client is set
    // for mining/single run (validator), then sync state can't be updated
    if ((this.syncTargetHeight ?? BigInt(0)) === BigInt(0) && !this.mine && !this.isSingleNode) {
      return
    }

    if (latest !== null && latest !== undefined) {
      const height = latest.number
      if (height >= (this.syncTargetHeight ?? BigInt(0))) {
        this.syncTargetHeight = height
        this.lastSyncDate =
          typeof latest.timestamp === 'bigint' && latest.timestamp > 0n
            ? Number(latest.timestamp) * 1000
            : Date.now()

        const diff = Date.now() - this.lastSyncDate
        // update synchronized
        if (diff < this.syncedStateRemovalPeriod) {
          if (!this.synchronized) {
            this.synchronized = true
            // Log to console the sync status
            this.logger.info('*'.repeat(60))
            this.logger.info(
              `Synchronized blockchain at height=${height} hash=${short(latest.hash())} 🎉`
            )
            this.logger.info('*'.repeat(60))
          }

          if (emitSyncEvent === true) {
            this.events.emit(Event.SYNC_SYNCHRONIZED, height)
          }
        }
      }
    } else {
      if (this.synchronized && !this.mine && !this.isSingleNode) {
        const diff = Date.now() - this.lastSyncDate
        if (diff >= this.syncedStateRemovalPeriod) {
          this.synchronized = false
          this.logger.info(
            `Sync status reset (no chain updates for ${Math.round(diff / 1000)} seconds).`
          )
        }
      }
    }

    this.logger.debug(
      `Client synchronized=${this.synchronized}${
        latest !== null && latest !== undefined ? ' height=' + latest.number : ''
      } syncTargetHeight=${this.syncTargetHeight} lastSyncDate=${
        (Date.now() - this.lastSyncDate) / 1000
      } secs ago`
    )
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
  static getConfigDB(networkDir: string) {
    return new Level<string | Uint8Array, Uint8Array>(`${networkDir}/config`)
  }

  /**
   * Gets the client private key from the config db.
   */
  static async getClientKey(datadir: string, common: Common) {
    const networkDir = `${datadir}/${common.chainName()}`
    const db = this.getConfigDB(networkDir)
    const encodingOpts = { keyEncoding: 'utf8', valueEncoding: 'view' }
    const dbKey = 'config:client_key'
    let key
    try {
      key = await db.get(dbKey, encodingOpts)
    } catch (error: any) {
      if (error.code === 'LEVEL_NOT_FOUND') {
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
    const dnsNets = ['ropsten', 'rinkeby', 'goerli', 'sepolia']
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
