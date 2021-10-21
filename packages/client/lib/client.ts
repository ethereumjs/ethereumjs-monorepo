import events from 'events'
import { MultiaddrLike } from './types'
import { Config } from './config'
import { EthereumService, FullEthereumService, LightEthereumService } from './service'
import { Event } from './types'
// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'
import { FullSynchronizer } from './sync'
import { bufferToHex } from 'ethereumjs-util'

export interface EthereumClientOptions {
  /* Client configuration */
  config: Config

  /**
   * Database to store blocks and metadata. Should be an abstract-leveldown compliant store.
   *
   * Default: Database created by the Blockchain class
   */
  chainDB?: LevelUp

  /**
   * Database to store the state. Should be an abstract-leveldown compliant store.
   *
   * Default: Database created by the Trie class
   */
  stateDB?: LevelUp

  /* List of bootnodes to use for discovery */
  bootnodes?: MultiaddrLike[]

  /* List of supported clients */
  clientFilter?: string[]

  /* How often to discover new peers */
  refreshInterval?: number
}

/**
 * Represents the top-level ethereum node, and is responsible for managing the
 * lifecycle of included services.
 * @memberof module:node
 */
export default class EthereumClient extends events.EventEmitter {
  public config: Config

  public services: (FullEthereumService | LightEthereumService)[]

  public opened: boolean
  public started: boolean

  /**
   * Create new node
   */
  constructor(options: EthereumClientOptions) {
    super()

    this.config = options.config

    this.services = [
      this.config.syncmode === 'full'
        ? new FullEthereumService({
            config: this.config,
            chainDB: options.chainDB,
            stateDB: options.stateDB,
          })
        : new LightEthereumService({
            config: this.config,
            chainDB: options.chainDB,
          }),
    ]
    this.opened = false
    this.started = false
  }

  /**
   * Open node. Must be called before node is started
   */
  async open() {
    if (this.opened) {
      return false
    }

    this.config.events.on(Event.SERVER_ERROR, (error) => {
      this.config.logger.warn(`Server error: ${error.name} - ${error.message}`)
    })

    this.config.events.on(Event.SERVER_LISTENING, (details) => {
      this.config.logger.info(`Server listening: ${details.transport} - ${details.url}`)
    })
    await Promise.all(this.services.map((s) => s.open()))
    this.opened = true
  }

  /**
   * Starts node and all services and network servers.
   */
  async start() {
    if (this.started) {
      return false
    }
    this.config.logger.info('Connecting to network and synchronizing blockchain...')

    await Promise.all(this.services.map((s) => s.start()))
    await Promise.all(this.config.servers.map((s) => s.start()))
    await Promise.all(this.config.servers.map((s) => s.bootstrap()))
    this.started = true
  }

  /**
   * Stops node and all services and network servers.
   */
  async stop() {
    if (!this.started) {
      return false
    }
    await Promise.all(this.services.map((s) => s.stop()))
    await Promise.all(this.config.servers.map((s) => s.stop()))
    this.started = false
  }

  /**
   * Returns the service with the specified name.
   * @param name name of service
   */
  service(name: string) {
    return this.services.find((s) => s.name === name)
  }

  /**
   * Returns the server with the specified name.
   * @param name name of server
   */
  server(name: string) {
    return this.config.servers.find((s) => s.name === name)
  }

  /**
   * Execute a range of blocks on a copy of the VM
   * without changing any chain or client state
   *
   * Possible input formats:
   *
   * - Single block, '5'
   * - Range of blocks, '5-10'
   *
   */
  async executeBlocks(first: number, last: number, txHashes: string[]) {
    this.config.logger.info('Preparing for block execution (debug mode, no services started)...')

    const service = this.services.find((s) => s.name === 'eth') as EthereumService
    const synchronizer = service.synchronizer as FullSynchronizer
    const vm = synchronizer.execution.vm.copy()

    for (let blockNumber = first; blockNumber <= last; blockNumber++) {
      const block = await vm.blockchain.getBlock(blockNumber)
      const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)

      // Set the correct state root
      await vm.stateManager.setStateRoot(parentBlock.header.stateRoot)

      const td = await vm.blockchain.getTotalDifficulty(block.header.parentHash)
      vm._common.setHardforkByBlockNumber(blockNumber, td)

      if (txHashes.length === 0) {
        const res = await vm.runBlock({ block })
        this.config.logger.info(
          `Executed block num=${blockNumber} hash=0x${block.hash().toString('hex')} txs=${
            block.transactions.length
          } gasUsed=${res.gasUsed} `
        )
      } else {
        let count = 0
        for (const tx of block.transactions) {
          const txHash = bufferToHex(tx.hash())
          if (txHashes.includes(txHash)) {
            const res = await vm.runTx({ block, tx })
            this.config.logger.info(
              `Executed tx hash=${txHash} gasUsed=${res.gasUsed} from block num=${blockNumber}`
            )
            count += 1
          }
        }
        if (count === 0) {
          this.config.logger.warn(`Block number ${first} contains no txs with provided hashes`)
        }
      }
    }
  }
}
