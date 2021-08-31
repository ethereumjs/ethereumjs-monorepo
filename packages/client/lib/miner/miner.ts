import { BN } from 'ethereumjs-util'
import { ConsensusType } from '@ethereumjs/common'
import { Event } from '../types'
import { Config } from '../config'
import { FullSynchronizer } from '../sync'

export interface MinerOptions {
  /* Config */
  config: Config

  /* FullSynchronizer */
  synchronizer: FullSynchronizer
}

/**
 * @module miner
 */

/**
 * Implements Ethereum block creation and mining.
 * @memberof module:miner
 */
export class Miner {
  private config: Config
  private synchronizer: FullSynchronizer
  private assembling: boolean
  private mineInterval: number
  public running: boolean

  /* global NodeJS */
  private _nextAssemblyTimeoutId: NodeJS.Timeout | undefined

  /**
   * Create miner
   * @param options constructor parameters
   */
  constructor(options: MinerOptions) {
    this.config = options.config
    this.synchronizer = options.synchronizer
    this.running = false
    this.assembling = false
    this.mineInterval = 15000 // sensible default for a 15s period (in ms)
  }

  /**
   * Convenience alias to return the latest block in the blockchain
   */
  private async latestBlock() {
    return this.synchronizer.execution.vm.blockchain.getLatestBlock()
  }

  /**
   * Sets the timeout for the next block assembly
   */
  private queueNextAssembly(timeout?: number) {
    this._nextAssemblyTimeoutId && clearTimeout(this._nextAssemblyTimeoutId)
    this._nextAssemblyTimeoutId = setTimeout(
      this.assembleBlock.bind(this),
      timeout ?? this.mineInterval
    )
  }

  /**
   * Sets the next block assembly to latestBlock.timestamp + period
   */
  private async chainUpdated() {
    const latestBlock = await this.latestBlock()
    const period = new BN(this.mineInterval)
    const target = latestBlock.header.timestamp.muln(1000).add(period).sub(new BN(Date.now()))
    const timeout = BN.max(new BN(0), target).toNumber()
    this.config.logger.debug(
      `Miner: Chain updated with block ${latestBlock.header.number.toNumber()}. Queuing next block assembly in ${
        timeout / 1000
      }s`
    )
    this.queueNextAssembly(timeout)
  }

  /**
   * Start miner
   */
  start(): boolean {
    if (!this.config.mine || this.running) {
      return false
    }
    this.running = true
    if (this.config.chainCommon.consensusType() === ConsensusType.ProofOfAuthority) {
      // Set the mine interval to the period in ms
      this.mineInterval = this.config.chainCommon.consensusConfig().period * 1000
    }
    this.config.events.on(Event.CHAIN_UPDATED, this.chainUpdated.bind(this))
    this.queueNextAssembly()
    this.config.logger.info(`Miner started. Assembling next block in ${this.mineInterval / 1000}s`)
    return true
  }

  /**
   * Assembles a block from txs in the TxPool.
   */
  async assembleBlock() {
    if (this.assembling) {
      return
    }
    this.assembling = true

    // Abort if a new block is received while assembling this block
    let interrupt = false
    const setInterrupt = () => {
      interrupt = true
    }
    this.config.events.on(Event.CHAIN_UPDATED, setInterrupt)

    const parentBlock = await this.latestBlock()
    const { gasLimit } = parentBlock.header
    const [signerAddress, signerPrivKey] = this.config.accounts[0]

    // Use a copy of the vm to not modify the existing state.
    // The state will be updated when the newly assembled block
    // is inserted into the canonical chain.
    const vmCopy = this.synchronizer.execution.vm.copy()

    // If we are on the genesis block the canonical
    // genesis state has not been initialiezd yet.
    if (parentBlock.header.number.isZero()) {
      await vmCopy.stateManager.generateCanonicalGenesis()
    }

    let difficulty
    if (this.config.chainCommon.consensusType() === ConsensusType.ProofOfAuthority) {
      // Determine if signer is INTURN (2) or NOTURN (1)
      const signers = vmCopy.blockchain.cliqueActiveSigners()
      const signerIndex = signers.findIndex((address) => address.equals(signerAddress))
      const inTurn = parentBlock.header.number.addn(1).modn(signers.length) === signerIndex
      difficulty = inTurn ? 2 : 1
    }

    const blockBuilder = await vmCopy.buildBlock({
      parentBlock,
      headerData: {
        difficulty,
        gasLimit,
      },
      blockOpts: {
        cliqueSigner: signerPrivKey,
      },
    })

    let baseFee
    if (this.config.chainCommon.isActivatedEIP(1559)) {
      // Exclude txs below base fee
      baseFee = parentBlock.header.calcNextBaseFee()
    }
    const txs = this.synchronizer.txPool.txsByPriceAndNonce(baseFee)
    this.config.logger.info(
      `Miner: Assembling block from ${txs.length} eligible txs ${
        baseFee ? `(baseFee: ${baseFee.toNumber()})` : ''
      }`
    )
    let index = 0
    let blockFull = false
    while (index < txs.length && !blockFull && !interrupt) {
      try {
        await blockBuilder.addTransaction(txs[index])
      } catch (error) {
        if (error.message === 'tx has a higher gas limit than the remaining gas in the block') {
          if (blockBuilder.gasUsed.gt(gasLimit.subn(21000))) {
            // If block has less than 21000 gas remaining, consider it full
            blockFull = true
            this.config.logger.debug(
              `Miner: Assembled block full (gasLeft: ${gasLimit
                .sub(blockBuilder.gasUsed)
                .toNumber()})`
            )
          }
        } else {
          // If there is an error adding a tx, it will be skipped
          const hash = '0x' + txs[index].hash().toString('hex')
          this.config.logger.error(
            `Skipping tx ${hash}, error encountered when trying to add tx:\n${error}`
          )
        }
      }
      index++
    }
    if (interrupt) return
    // Build block, sealing it
    const block = await blockBuilder.build()
    this.config.logger.info(`Miner: Sealed block with ${block.transactions.length} txs`)
    this.assembling = false
    if (interrupt) return
    // Put block in blockchain and remove included txs from TxPool
    await (this.synchronizer as any).chain.putBlocks([block]) // when #1443 is merged replace this line with `await this.synchronizer.handleNewBlock(block)`
    this.synchronizer.txPool.removeNewBlockTxs([block])
    this.config.events.removeListener(Event.CHAIN_UPDATED, setInterrupt)
  }

  /**
   * Stop miner execution
   */
  stop(): boolean {
    if (!this.running) {
      return false
    }
    this.config.events.removeListener(Event.CHAIN_UPDATED, this.chainUpdated.bind(this))
    this._nextAssemblyTimeoutId && clearTimeout(this._nextAssemblyTimeoutId)
    this.running = false
    this.config.logger.info('Miner stopped.')
    return true
  }
}
