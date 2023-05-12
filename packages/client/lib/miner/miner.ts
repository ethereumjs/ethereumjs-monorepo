import { BlockHeader } from '@ethereumjs/block'
import { ConsensusType, Hardfork } from '@ethereumjs/common'
import { Ethash } from '@ethereumjs/ethash'
import { bytesToPrefixedHexString } from '@ethereumjs/util'
import { bytesToHex, equalsBytes } from 'ethereum-cryptography/utils'
import { MemoryLevel } from 'memory-level'

import { LevelDB } from '../execution/level'
import { Event } from '../types'

import type { Config } from '../config'
import type { VMExecution } from '../execution'
import type { FullEthereumService } from '../service'
import type { FullSynchronizer } from '../sync'
import type { CliqueConsensus } from '@ethereumjs/blockchain'
import type { CliqueConfig } from '@ethereumjs/common'
import type { Miner as EthashMiner, Solution } from '@ethereumjs/ethash'
import type { TxReceipt } from '@ethereumjs/vm'

export interface MinerOptions {
  /* Config */
  config: Config

  /* FullEthereumService */
  service: FullEthereumService

  /* Skip hardfork validation */
  skipHardForkValidation?: boolean
}

/**
 * @module miner
 */

/**
 * Implements Ethereum block creation and mining.
 * @memberof module:miner
 */
export class Miner {
  private DEFAULT_PERIOD = 10
  private _nextAssemblyTimeoutId: NodeJS.Timeout | undefined /* global NodeJS */
  private _boundChainUpdatedHandler: (() => void) | undefined
  private config: Config
  private service: FullEthereumService
  private execution: VMExecution
  private assembling: boolean
  private period: number
  private ethash: Ethash | undefined
  private ethashMiner: EthashMiner | undefined
  private nextSolution: Solution | undefined
  private skipHardForkValidation?: boolean
  public running: boolean

  /**
   * Create miner
   * @param options constructor parameters
   */
  constructor(options: MinerOptions) {
    this.config = options.config
    this.service = options.service
    this.execution = this.service.execution
    this.running = false
    this.assembling = false
    this.skipHardForkValidation = options.skipHardForkValidation
    this.period =
      ((this.config.chainCommon.consensusConfig() as CliqueConfig).period ?? this.DEFAULT_PERIOD) *
      1000 // defined in ms for setTimeout use
    if (this.config.chainCommon.consensusType() === ConsensusType.ProofOfWork) {
      this.ethash = new Ethash(new LevelDB(new MemoryLevel()) as any)
    }
  }

  /**
   * Convenience alias to return the latest block in the blockchain
   */
  private latestBlockHeader(): BlockHeader {
    return this.service.chain.headers.latest!
  }

  /**
   * Sets the timeout for the next block assembly
   */
  private async queueNextAssembly(timeout?: number) {
    if (this._nextAssemblyTimeoutId) {
      clearTimeout(this._nextAssemblyTimeoutId)
    }
    if (!this.running) {
      return
    }

    // Check if the new block to be minted isn't PoS
    const nextBlockHf = this.config.chainCommon.getHardforkByBlockNumber(
      this.service.chain.headers.height + BigInt(1),
      this.service.chain.headers.td,
      undefined
    )
    if (this.config.chainCommon.hardforkGteHardfork(nextBlockHf, Hardfork.Paris)) {
      this.config.logger.info('Miner: reached merge hardfork - stopping')
      this.stop()
      return
    }

    timeout = timeout ?? this.period

    if (this.config.chainCommon.consensusType() === ConsensusType.ProofOfAuthority) {
      // EIP-225 spec: If the signer is out-of-turn,
      // delay signing by rand(SIGNER_COUNT * 500ms)
      const [signerAddress] = this.config.accounts[0]
      const { blockchain } = this.service.chain
      const parentBlock = this.service.chain.blocks.latest!
      //eslint-disable-next-line
      const number = parentBlock.header.number + BigInt(1)
      const inTurn = await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        signerAddress,
        number
      )
      if (inTurn === false) {
        const signerCount = (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
          number
        ).length
        timeout += Math.random() * signerCount * 500
      }
    }

    this._nextAssemblyTimeoutId = setTimeout(this.assembleBlock.bind(this), timeout)

    if (this.config.chainCommon.consensusType() === ConsensusType.ProofOfWork) {
      // If PoW, find next solution while waiting for next block assembly to start
      void this.findNextSolution()
    }
  }

  /**
   * Finds the next PoW solution.
   */
  private async findNextSolution() {
    if (typeof this.ethash === 'undefined') {
      return
    }
    this.config.logger.info('Miner: Finding next PoW solution 🔨')
    const header = this.latestBlockHeader()
    this.ethashMiner = this.ethash.getMiner(header)
    const solution = await this.ethashMiner.iterate(-1)
    if (!equalsBytes(header.hash(), this.latestBlockHeader().hash())) {
      // New block was inserted while iterating so we will discard solution
      return
    }
    this.nextSolution = solution
    this.config.logger.info('Miner: Found PoW solution 🔨')
    return solution
  }

  /**
   * Sets the next block assembly to latestBlock.timestamp + period
   */
  private async chainUpdated() {
    this.ethashMiner?.stop()
    const latestBlockHeader = this.latestBlockHeader()
    const target = Number(latestBlockHeader.timestamp) * 1000 + this.period - Date.now()
    const timeout = BigInt(0) > target ? 0 : target
    this.config.logger.debug(
      `Miner: Chain updated with block ${
        latestBlockHeader.number
      }. Queuing next block assembly in ${Math.round(timeout / 1000)}s`
    )
    await this.queueNextAssembly(timeout)
  }

  /**
   * Start miner
   */
  start(): boolean {
    if (!this.config.mine || this.running) {
      return false
    }
    this.running = true
    this._boundChainUpdatedHandler = this.chainUpdated.bind(this)
    this.config.events.on(Event.CHAIN_UPDATED, this._boundChainUpdatedHandler)
    this.config.logger.info(`Miner started. Assembling next block in ${this.period / 1000}s`)
    void this.queueNextAssembly()
    return true
  }

  /**
   * Assembles a block from txs in the TxPool and adds it to the chain.
   * If a new block is received while assembling it will abort.
   */
  async assembleBlock() {
    if (this.assembling) {
      return
    }
    this.assembling = true

    // Abort if a new block is received while assembling this block
    // eslint-disable-next-line prefer-const
    let _boundSetInterruptHandler: () => void
    let interrupt = false
    const setInterrupt = () => {
      interrupt = true
      this.assembling = false
      this.config.events.removeListener(Event.CHAIN_UPDATED, _boundSetInterruptHandler)
    }
    _boundSetInterruptHandler = setInterrupt.bind(this)
    this.config.events.once(Event.CHAIN_UPDATED, _boundSetInterruptHandler)

    const parentBlock = this.service.chain.blocks.latest!
    //eslint-disable-next-line
    const number = parentBlock.header.number + BigInt(1)
    let { gasLimit } = parentBlock.header

    if (this.config.chainCommon.consensusType() === ConsensusType.ProofOfAuthority) {
      // Abort if we have too recently signed
      const cliqueSigner = this.config.accounts[0][1]
      const header = BlockHeader.fromHeaderData(
        { number },
        { common: this.config.chainCommon, cliqueSigner }
      )
      if (
        (this.service.chain.blockchain as any).consensus.cliqueCheckRecentlySigned(header) === true
      ) {
        this.config.logger.info(`Miner: We have too recently signed, waiting for next block`)
        this.assembling = false
        return
      }
    }

    if (this.config.chainCommon.consensusType() === ConsensusType.ProofOfWork) {
      while (this.nextSolution === undefined) {
        this.config.logger.info(`Miner: Waiting to find next PoW solution 🔨`)
        await new Promise((r) => setTimeout(r, 1000))
      }
    }

    // Use a copy of the vm to not modify the existing state.
    // The state will be updated when the newly assembled block
    // is inserted into the canonical chain.
    const vmCopy = await this.execution.vm.copy()

    // Set the state root to ensure the resulting state
    // is based on the parent block's state
    await vmCopy.stateManager.setStateRoot(parentBlock.header.stateRoot)

    let difficulty
    let cliqueSigner
    let inTurn
    if (this.config.chainCommon.consensusType() === ConsensusType.ProofOfAuthority) {
      const [signerAddress, signerPrivKey] = this.config.accounts[0]
      cliqueSigner = signerPrivKey
      // Determine if signer is INTURN (2) or NOTURN (1)
      inTurn = await (vmCopy.blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        signerAddress,
        number
      )
      difficulty = inTurn ? 2 : 1
    }

    let baseFeePerGas
    const londonHardforkBlock = this.config.chainCommon.hardforkBlock(Hardfork.London)
    if (
      typeof londonHardforkBlock === 'bigint' &&
      londonHardforkBlock !== BigInt(0) &&
      number === londonHardforkBlock
    ) {
      // Get baseFeePerGas from `paramByEIP` since 1559 not currently active on common
      baseFeePerGas =
        this.config.chainCommon.paramByEIP('gasConfig', 'initialBaseFee', 1559) ?? BigInt(0)
      // Set initial EIP1559 block gas limit to 2x parent gas limit per logic in `block.validateGasLimit`
      gasLimit = gasLimit * BigInt(2)
    } else if (this.config.chainCommon.isActivatedEIP(1559) === true) {
      baseFeePerGas = parentBlock.header.calcNextBaseFee()
    }

    let calcDifficultyFromHeader
    let coinbase
    if (this.config.chainCommon.consensusType() === ConsensusType.ProofOfWork) {
      calcDifficultyFromHeader = parentBlock.header
      coinbase = this.config.minerCoinbase ?? this.config.accounts[0][0]
    }

    const blockBuilder = await vmCopy.buildBlock({
      parentBlock,
      headerData: {
        number,
        difficulty,
        gasLimit,
        baseFeePerGas,
        coinbase,
      },
      blockOpts: {
        cliqueSigner,
        hardforkByBlockNumber: true,
        calcDifficultyFromHeader,
        putBlockIntoBlockchain: false,
      },
    })

    const txs = await this.service.txPool.txsByPriceAndNonce(vmCopy, { baseFee: baseFeePerGas })
    this.config.logger.info(
      `Miner: Assembling block from ${txs.length} eligible txs ${
        typeof baseFeePerGas === 'bigint' && baseFeePerGas !== BigInt(0)
          ? `(baseFee: ${baseFeePerGas})`
          : ''
      }`
    )
    let index = 0
    let blockFull = false
    const receipts: TxReceipt[] = []
    while (index < txs.length && !blockFull && !interrupt) {
      try {
        const txResult = await blockBuilder.addTransaction(txs[index], {
          skipHardForkValidation: this.skipHardForkValidation,
        })
        if (this.config.saveReceipts) {
          receipts.push(txResult.receipt)
        }
      } catch (error) {
        if (
          (error as Error).message ===
          'tx has a higher gas limit than the remaining gas in the block'
        ) {
          if (blockBuilder.gasUsed > gasLimit - BigInt(21000)) {
            // If block has less than 21000 gas remaining, consider it full
            blockFull = true
            this.config.logger.info(
              `Miner: Assembled block full (gasLeft: ${gasLimit - blockBuilder.gasUsed})`
            )
          }
        } else if ((error as Error).message.includes('tx has a different hardfork than the vm')) {
          // We can here decide to keep a tx in pool if it belongs to future hf
          // but for simplicity just remove the tx as the sender can always retransmit
          // the tx
          this.service.txPool.removeByHash(bytesToHex(txs[index].hash()))
          this.config.logger.error(
            `Pending: Removed from txPool tx ${bytesToPrefixedHexString(
              txs[index].hash()
            )} having different hf=${txs[index].common.hardfork()} than block vm hf=${blockBuilder[
              'vm'
            ]._common.hardfork()}`
          )
        } else {
          // If there is an error adding a tx, it will be skipped
          const hash = bytesToPrefixedHexString(txs[index].hash())
          this.config.logger.debug(
            `Skipping tx ${hash}, error encountered when trying to add tx:\n${error}`
          )
        }
      }
      index++
    }
    if (interrupt) return
    // Build block, sealing it
    const block = await blockBuilder.build(this.nextSolution)
    if (this.config.saveReceipts) {
      await this.execution.receiptsManager?.saveReceipts(block, receipts)
    }
    this.config.logger.info(
      `Miner: Sealed block with ${block.transactions.length} txs ${
        this.config.chainCommon.consensusType() === ConsensusType.ProofOfWork
          ? `(difficulty: ${block.header.difficulty})`
          : `(${inTurn === true ? 'in turn' : 'not in turn'})`
      }`
    )
    this.assembling = false
    if (interrupt) return
    // Put block in blockchain
    await (this.service.synchronizer as FullSynchronizer).handleNewBlock(block)
    // Remove included txs from TxPool
    this.service.txPool.removeNewBlockTxs([block])
    this.config.events.removeListener(Event.CHAIN_UPDATED, _boundSetInterruptHandler)
  }

  /**
   * Stop miner execution
   */
  stop(): boolean {
    if (!this.running) {
      return false
    }
    this.config.events.removeListener(Event.CHAIN_UPDATED, this._boundChainUpdatedHandler!)
    if (this._nextAssemblyTimeoutId) {
      clearTimeout(this._nextAssemblyTimeoutId)
    }
    this.running = false
    this.config.logger.info('Miner stopped.')
    return true
  }
}
