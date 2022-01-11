import { Block, HeaderData } from '@ethereumjs/block'
import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx'
import { Address, BN, toBuffer, toType, TypeOutput, bufferToHex, intToHex } from 'ethereumjs-util'
import RLP from 'rlp'
import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { middleware, validators } from '../validation'
import { INTERNAL_ERROR } from '../error-code'
import type VM from '@ethereumjs/vm'
import type EthereumClient from '../../client'
import type { Chain } from '../../blockchain'
import type { Config } from '../../config'
import type { EthereumService } from '../../service'
import type { FullSynchronizer } from '../../sync'
import type { TxPool } from '../../sync/txpool'

enum Status {
  VALID = 'VALID',
  INVALID = 'INVALID',
  SYNCING = 'SYNCING',
}

type ExecutionPayload = {
  parentHash: string // DATA, 32 Bytes
  coinbase: string // DATA, 20 Bytes
  stateRoot: string // DATA, 32 Bytes
  receiptRoot: string // DATA, 32 bytes
  logsBloom: string // DATA, 256 Bytes
  random: string // DATA, 32 Bytes
  blockNumber: string // QUANTITY, 64 Bits
  gasLimit: string // QUANTITY, 64 Bits
  gasUsed: string // QUANTITY, 64 Bits
  timestamp: string // QUANTITY, 64 Bits
  extraData: string // DATA, 0 to 32 Bytes
  baseFeePerGas: string // QUANTITY, 256 Bits
  blockHash: string // DATA, 32 Bytes
  transactions: string[] // Array of DATA - Array of transaction objects,
  // each object is a byte list (DATA) representing
  // TransactionType || TransactionPayload or LegacyTransaction
  // as defined in EIP-2718.
}

type PreparePayloadParamsObject = {
  parentHash: string
  timestamp: string
  random: string
  feeRecipient: string
}

type PayloadResult = {
  block?: Block
  random?: string
  error?: Error
}

const EngineError = {
  ActionNotAllowed: {
    code: 2,
    message: 'Action not allowed',
  },
  UnknownHeader: {
    code: 4,
    message: 'Unknown header',
  },
  UnknownPayload: {
    code: 5,
    message: 'Unknown payload',
  },
}

/**
 * Formats a block to {@link ExecutionPayload}.
 */
const blockToExecutionPayload = (block: Block, random: string) => {
  const header = block.toJSON().header!
  const transactions = block.transactions.map((tx) => bufferToHex(tx.serialize())) ?? []
  const payload: ExecutionPayload = {
    blockNumber: header.number!,
    parentHash: header.parentHash!,
    coinbase: header.coinbase!,
    stateRoot: header.stateRoot!,
    receiptRoot: header.receiptTrie!,
    logsBloom: header.logsBloom!,
    gasLimit: header.gasLimit!,
    gasUsed: header.gasUsed!,
    timestamp: header.timestamp!,
    extraData: header.extraData!,
    baseFeePerGas: header.baseFeePerGas!,
    blockHash: bufferToHex(block.hash()),
    random,
    transactions,
  }
  return payload
}

/**
 * Request a block by hash from connected peers.
 * May help recover missing/reorged blocks around merge transition.
 * Times out after 10s.
 * @throws {@link EngineError.UnknownHeader}
 */
const getBlockFromPeers = async (hash: Buffer, chain: Chain, service: EthereumService) => {
  const timeout = setTimeout(() => {
    throw EngineError.UnknownHeader
  }, 10000)
  const { peers } = service.pool
  for (const peer of peers) {
    try {
      const headerResult = await peer.eth!.getBlockHeaders({ block: hash, max: 1 })
      if (headerResult) {
        const header = headerResult[1]
        const bodiesResult = await peer.eth!.getBlockBodies({ hashes: [hash] })
        if (bodiesResult) {
          const blockBody = bodiesResult[1][0]
          const block = Block.fromValuesArray([header[0].raw(), ...blockBody], {
            common: chain.config.chainCommon,
          })
          clearTimeout(timeout)
          return block
        }
      }
    } catch (error) {
      chain.config.logger.debug(`Error trying to get block from network peer ${peer.id}: ${error}`)
    }
  }
  throw EngineError.UnknownHeader
}

/**
 * Searches for a block in {@link ValidBlocks}, then the blockchain, then the network.
 * @throws {@link EngineError.UnknownHeader}
 */
const findBlock = async (
  hash: Buffer,
  validBlocks: ValidBlocks,
  chain: Chain,
  service: EthereumService
) => {
  const parentBlock = validBlocks.get(hash.toString('hex'))
  if (parentBlock) {
    return parentBlock
  } else {
    // search in chain
    try {
      const parentBlock = await chain.getBlock(hash)
      return parentBlock
    } catch (error) {
      // block not found, request from network (devp2p)
      return await getBlockFromPeers(hash, chain, service)
    }
  }
}

/**
 * Recursively finds parent blocks starting from the parentHash.
 */
const recursivelyFindParents = async (
  vmHeadHash: Buffer,
  parentHash: Buffer,
  validBlocks: ValidBlocks,
  chain: Chain,
  service: EthereumService
) => {
  if (parentHash.equals(vmHeadHash)) {
    return []
  }
  const parentBlocks = []
  const block = await findBlock(parentHash, validBlocks, chain, service)
  parentBlocks.push(block)
  while (!vmHeadHash.equals(parentBlocks[parentBlocks.length - 1].header.parentHash)) {
    const block: Block = await findBlock(
      parentBlocks[parentBlocks.length - 1].header.parentHash,
      validBlocks,
      chain,
      service
    )
    parentBlocks.push(block)
  }
  return parentBlocks.reverse()
}

/**
 * Returns the txs trie root for the block.
 */
const txsTrieRoot = async (txs: TypedTransaction[]) => {
  const trie = new Trie()
  for (const [i, tx] of txs.entries()) {
    await trie.put(Buffer.from(RLP.encode(i)), tx.serialize())
  }
  return trie.root
}

type PayloadId = number
type UnprefixedBlockHash = string
type PendingPayloads = Map<PayloadId, PayloadResult>
type ValidBlocks = Map<UnprefixedBlockHash, Block>

/**
 * engine_* RPC module
 * @memberof module:rpc/modules
 */
export class Engine {
  private client: EthereumClient
  private service: EthereumService
  private chain: Chain
  private config: Config
  private synchronizer: FullSynchronizer
  private vm: VM
  private txPool: TxPool
  private pendingPayloads: PendingPayloads
  private validBlocks: ValidBlocks
  private nextPayloadId = 0

  /**
   * Create engine_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    this.client = client
    this.service = client.services.find((s) => s.name === 'eth') as EthereumService
    this.chain = this.service.chain
    this.config = this.chain.config
    this.synchronizer = this.service.synchronizer as FullSynchronizer
    this.vm = this.synchronizer.execution?.vm
    this.txPool = (this.service.synchronizer as FullSynchronizer).txPool
    this.pendingPayloads = new Map()
    this.validBlocks = new Map()

    this.preparePayload = middleware(this.preparePayload.bind(this), 1, [
      [
        validators.object({
          parentHash: validators.blockHash,
          timestamp: validators.hex,
          random: validators.hex,
          feeRecipient: validators.address,
        }),
      ],
    ])
    this.getPayload = middleware(this.getPayload.bind(this), 1, [[validators.hex]])
    this.executePayload = middleware(this.executePayload.bind(this), 1, [
      [
        validators.object({
          parentHash: validators.blockHash,
          coinbase: validators.address,
          stateRoot: validators.hex,
          receiptRoot: validators.hex,
          logsBloom: validators.hex,
          random: validators.hex,
          blockNumber: validators.hex,
          gasLimit: validators.hex,
          gasUsed: validators.hex,
          timestamp: validators.hex,
          extraData: validators.hex,
          baseFeePerGas: validators.hex,
          blockHash: validators.blockHash,
          transactions: validators.array(validators.hex),
        }),
      ],
    ])
    this.consensusValidated = middleware(this.consensusValidated.bind(this), 1, [
      [
        validators.object({
          blockHash: validators.blockHash,
          status: validators.values(['VALID', 'INVALID']),
        }),
      ],
    ])
    this.forkchoiceUpdated = middleware(this.forkchoiceUpdated.bind(this), 1, [
      [
        validators.object({
          headBlockHash: validators.blockHash,
          finalizedBlockHash: validators.blockHash,
        }),
      ],
    ])
  }

  /**
   * Notifies the client will need to propose a block at some point in the future and
   * that the payload will be requested by the corresponding engine_getPayload near
   * to that point in time.
   *
   * @param params An array of one parameter:
   *   1. An object
   *       * parentHash - hash of the parent block
   *       * timestamp - value for the `timestamp` field of the new payload
   *       * random - value for the `random` field of the new payload
   *       * feeRecipient - suggested value for the `coinbase` field of the new payload
   * @returns A response object or an error. Response object:
   *       * payloadId - identifier of the payload building process
   */
  async preparePayload(params: [PreparePayloadParamsObject]) {
    const { timestamp, random, feeRecipient } = params[0]
    const parentHash = toBuffer(params[0].parentHash)

    const payloadId = this.nextPayloadId.valueOf() // clone with valueOf()
    this.pendingPayloads.set(payloadId, { random })
    this.nextPayloadId++

    setImmediate(async () => {
      try {
        const vmCopy = this.vm.copy()
        const vmHead = this.chain.headers.latest!
        const parentBlocks = await recursivelyFindParents(
          vmHead.hash(),
          parentHash,
          this.validBlocks,
          this.chain,
          this.service
        )

        for (const parent of parentBlocks) {
          const td = await vmCopy.blockchain.getTotalDifficulty(parent.hash())
          vmCopy._common.setHardforkByBlockNumber(parent.header.number, td)
          await vmCopy.runBlock({ block: parent })
          await vmCopy.blockchain.putBlock(parent)
        }

        const parentBlock = await vmCopy.blockchain.getBlock(parentHash)
        const number = parentBlock.header.number.addn(1)
        const { gasLimit } = parentBlock.header
        const baseFeePerGas = parentBlock.header.calcNextBaseFee()

        // Set the state root to ensure the resulting state
        // is based on the parent block's state
        await vmCopy.stateManager.setStateRoot(parentBlock.header.stateRoot)

        const td = await vmCopy.blockchain.getTotalDifficulty(vmHead.hash())
        vmCopy._common.setHardforkByBlockNumber(vmHead.number, td)
        const blockBuilder = await vmCopy.buildBlock({
          parentBlock,
          headerData: {
            timestamp,
            number,
            gasLimit,
            baseFeePerGas,
            coinbase: Address.fromString(feeRecipient),
          },
          blockOpts: {
            putBlockIntoBlockchain: false,
          },
        })

        const txs = await this.txPool.txsByPriceAndNonce(vmCopy.stateManager, baseFeePerGas)
        this.config.logger.info(
          `Engine: Assembling block from ${txs.length} eligible txs (baseFee: ${baseFeePerGas})`
        )
        let index = 0
        let blockFull = false
        while (index < txs.length && !blockFull) {
          try {
            await blockBuilder.addTransaction(txs[index])
          } catch (error: any) {
            if (error.message === 'tx has a higher gas limit than the remaining gas in the block') {
              if (blockBuilder.gasUsed.gt(gasLimit.subn(21000))) {
                // If block has less than 21000 gas remaining, consider it full
                blockFull = true
                this.config.logger.info(
                  `Engine: Assembled block full (gasLeft: ${gasLimit.sub(blockBuilder.gasUsed)})`
                )
              }
            } else {
              // If there is an error adding a tx, it will be skipped
              const hash = bufferToHex(txs[index].hash())
              this.config.logger.debug(
                `Skipping tx ${hash}, error encountered when trying to add tx:\n${error}`
              )
            }
          }
          index++
        }
        const block = await blockBuilder.build()
        this.pendingPayloads.set(payloadId, { block, random })
        this.validBlocks.set(block.hash().toString('hex'), block)
        this.config.logger.info(
          `Engine: Finished assembling block number=${block.header.number} txs=${
            txs.length
          } hash=${block.hash().toString('hex')}`
        )
      } catch (error: any) {
        this.pendingPayloads.set(payloadId, { error })
      }
    })

    return { payloadId: intToHex(payloadId) }
  }

  /**
   * Given payloadId, returns the most recent version of an execution payload
   * that is available by the time of the call or responds with an error.
   *
   * @param params An array of one parameter:
   *   1. payloadId - identifier of the payload building process
   * @returns Instance of {@link ExecutionPayload} or an error
   */
  async getPayload(params: [string]) {
    const payloadId = toType(params[0], TypeOutput.Number)
    const payload = this.pendingPayloads.get(payloadId)
    if (!payload) {
      throw EngineError.UnknownPayload
    }
    if (payload.error) {
      this.pendingPayloads.delete(payloadId)
      throw {
        code: INTERNAL_ERROR,
        message: payload.error.message.toString(),
      }
    }
    if (!payload.block || !payload.random) {
      // TODO implement:
      // 1) an interrupt to finish processing txs and return the block
      // 2) the ability to add/shuffle new txs while waiting (to maximize mev)
      throw {
        code: INTERNAL_ERROR,
        message: 'Payload not ready, please retry',
      }
    }
    this.pendingPayloads.delete(payloadId)
    return blockToExecutionPayload(payload.block, payload.random)
  }

  /**
   * Verifies the payload according to the execution environment
   * rule set (EIP-3675) and returns the status of the verification.
   *
   * @param params An array of one parameter:
   *   1. An object as an instance of {@link ExecutionPayload}
   * @returns An object:
   *   1. status: String - the result of the payload execution
   *        VALID - given payload is valid
   *        INVALID - given payload is invalid
   *        SYNCING - sync process is in progress
   */
  async executePayload(params: [ExecutionPayload]) {
    const [payloadData] = params
    const { blockNumber: number, receiptRoot: receiptTrie, transactions } = payloadData

    if (new BN(toBuffer(number)).gt(this.chain.headers.height.addn(1))) {
      return { status: Status.SYNCING }
    }

    try {
      const txs = []
      for (const [index, serializedTx] of transactions.entries()) {
        try {
          const tx = TransactionFactory.fromSerializedData(toBuffer(serializedTx), {
            common: this.config.chainCommon,
          })
          txs.push(tx)
        } catch (error) {
          this.config.logger.error(`Invalid tx at index ${index}: ${error}`)
          return { status: Status.INVALID }
        }
      }

      const transactionsTrie = await txsTrieRoot(txs)
      const header: HeaderData = {
        ...payloadData,
        number,
        receiptTrie,
        transactionsTrie,
      }

      let block
      try {
        block = Block.fromBlockData(
          { header, transactions: txs },
          { common: this.config.chainCommon }
        )
      } catch (error) {
        this.config.logger.debug(`Error verifying block: ${error}`)
        return { status: Status.INVALID }
      }

      const vmCopy = this.vm.copy()
      const vmHeadHash = this.chain.headers.latest!.hash()
      const parentBlocks = await recursivelyFindParents(
        vmHeadHash,
        block.header.parentHash,
        this.validBlocks,
        this.chain,
        this.service
      )

      for (const parent of parentBlocks) {
        await vmCopy.runBlock({ block: parent })
        await vmCopy.blockchain.putBlock(parent)
      }

      try {
        await vmCopy.runBlock({ block })
      } catch (error) {
        this.config.logger.debug(`Error verifying block: ${error}`)
        return { status: Status.INVALID }
      }

      this.validBlocks.set(block.hash().toString('hex'), block)
      return { status: Status.VALID }
    } catch (error: any) {
      throw {
        code: INTERNAL_ERROR,
        message: error.message.toString(),
      }
    }
  }

  /**
   * Communicates that full consensus validation of an execution payload
   * is complete along with its corresponding status.
   *
   * @param params An array of one parameter:
   *   1. An object - Payload validity status with respect to the consensus rules:
   *        blockHash - block hash value of the payload
   *        status: String: VALID|INVALID - result of the payload validation with respect to the proof-of-stake consensus rules
   * @returns None or an error
   */
  async consensusValidated(params: [{ blockHash: string; status: string }]) {
    const { status } = params[0]
    let { blockHash } = params[0]
    blockHash = blockHash.slice(2)

    const block = this.validBlocks.get(blockHash)

    if (!block && status === Status.VALID) {
      try {
        // Check if block may already be in canonical chain before throwing unknown header.
        await this.chain.getBlock(Buffer.from(blockHash, 'hex'))
      } catch (error) {
        throw EngineError.UnknownHeader
      }
    }

    if (block && status === Status.INVALID) {
      this.validBlocks.delete(blockHash)
    }

    return null
  }

  /**
   * Propagates the change in the fork choice to the execution client.
   *
   * @param params An array of one parameter:
   *   1. An object - The state of the fork choice:
   *        headBlockHash - block hash of the head of the canonical chain
   *        finalizedBlockHash - block hash of the most recent finalized block
   * @returns None or an error
   */
  async forkchoiceUpdated(params: [{ headBlockHash: string; finalizedBlockHash: string }]) {
    let { headBlockHash, finalizedBlockHash } = params[0]
    headBlockHash = headBlockHash.slice(2)
    finalizedBlockHash = finalizedBlockHash.slice(2)

    /*
     * Process head block
     */
    const headBlock = this.validBlocks.get(headBlockHash)
    if (!headBlock) {
      throw EngineError.UnknownHeader
    }

    const vmHeadHash = this.chain.headers.latest!.hash()
    const parentBlocks = await recursivelyFindParents(
      vmHeadHash,
      headBlock.header.parentHash,
      this.validBlocks,
      this.chain,
      this.service
    )

    const blocks = [...parentBlocks, headBlock]
    await this.chain.putBlocks(blocks, true)
    this.txPool.removeNewBlockTxs(blocks)

    if (
      !this.synchronizer.syncTargetHeight ||
      this.synchronizer.syncTargetHeight.lt(headBlock.header.number)
    ) {
      this.config.synchronized = true
      this.config.lastSyncDate = Date.now()
      this.synchronizer.syncTargetHeight = headBlock.header.number
    }

    /*
     * Process finalized block
     */
    if (finalizedBlockHash === '0'.repeat(64)) {
      // All zeros means no finalized block yet which is okay
    } else {
      let finalizedBlock
      finalizedBlock = this.validBlocks.get(finalizedBlockHash)
      if (!finalizedBlock) {
        try {
          finalizedBlock = await this.chain.getBlock(Buffer.from(finalizedBlockHash, 'hex'))
        } catch (error) {
          throw EngineError.UnknownHeader
        }
      }
      this.chain.lastFinalizedBlock = finalizedBlock
      this.validBlocks.delete(finalizedBlockHash)
    }

    this.validBlocks.delete(headBlockHash)
    return null
  }
}
