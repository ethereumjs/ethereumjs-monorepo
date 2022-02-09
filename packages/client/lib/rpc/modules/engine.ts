import { Block, HeaderData } from '@ethereumjs/block'
import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx'
import { toBuffer, bufferToHex, rlp, BN } from 'ethereumjs-util'
import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { middleware, validators } from '../validation'
import { INTERNAL_ERROR } from '../error-code'
import { PendingBlock } from '../../miner'
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
  SUCCESS = 'SUCCESS',
}

type ExecutionPayloadV1 = {
  parentHash: string // DATA, 32 Bytes
  feeRecipient: string // DATA, 20 Bytes
  stateRoot: string // DATA, 32 Bytes
  receiptsRoot: string // DATA, 32 bytes
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

type ForkchoiceStateV1 = {
  headBlockHash: string
  safeBlockHash: string
  finalizedBlockHash: string
}

type PayloadAttributesV1 = {
  timestamp: string
  random: string
  suggestedFeeRecipient: string
}

const EngineError = {
  UnknownPayload: {
    code: -32001,
    message: 'Unknown payload',
  },
  InvalidTerminalBlock: {
    code: -32002,
    message: 'Invalid terminal block',
  },
}

/**
 * Formats a block to {@link ExecutionPayload}.
 */
const blockToExecutionPayload = (block: Block) => {
  const header = block.toJSON().header!
  const transactions = block.transactions.map((tx) => bufferToHex(tx.serialize())) ?? []
  const payload: ExecutionPayloadV1 = {
    blockNumber: header.number!,
    parentHash: header.parentHash!,
    feeRecipient: header.coinbase!,
    stateRoot: header.stateRoot!,
    receiptsRoot: header.receiptTrie!,
    logsBloom: header.logsBloom!,
    gasLimit: header.gasLimit!,
    gasUsed: header.gasUsed!,
    timestamp: header.timestamp!,
    extraData: header.extraData!,
    baseFeePerGas: header.baseFeePerGas!,
    blockHash: bufferToHex(block.hash()),
    random: header.mixHash!,
    transactions,
  }
  return payload
}

/**
 * Searches for a block in {@link ValidBlocks} then the blockchain.
 */
const findBlock = async (hash: Buffer, validBlocks: ValidBlocks, chain: Chain) => {
  const parentBlock = validBlocks.get(hash.toString('hex'))
  if (parentBlock) {
    return parentBlock
  } else {
    // search in chain
    return await chain.getBlock(hash)
  }
}

/**
 * Recursively finds parent blocks starting from the parentHash.
 */
const recursivelyFindParents = async (
  vmHeadHash: Buffer,
  parentHash: Buffer,
  validBlocks: ValidBlocks,
  chain: Chain
) => {
  if (parentHash.equals(vmHeadHash) || parentHash.equals(Buffer.alloc(32))) {
    return []
  }
  const parentBlocks = []
  const block = await findBlock(parentHash, validBlocks, chain)
  parentBlocks.push(block)
  while (!parentBlocks[parentBlocks.length - 1].hash().equals(parentHash)) {
    const block: Block = await findBlock(
      parentBlocks[parentBlocks.length - 1].header.parentHash,
      validBlocks,
      chain
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
    await trie.put(rlp.encode(i), tx.serialize())
  }
  return trie.root
}

/**
 * Returns the block hash as a 0x-prefixed hex string if found valid in validBlocks or the blockchain, otherwise returns null.
 */
const validHash = async (
  hash: Buffer,
  validBlocks: ValidBlocks,
  chain: Chain
): Promise<string | null> => {
  if (validBlocks.get(hash.toString('hex'))) {
    return bufferToHex(hash)
  }
  try {
    await chain.getBlock(hash)
  } catch (error: any) {
    return null
  }
  return bufferToHex(hash)
}

type UnprefixedBlockHash = string
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
  private pendingBlock: PendingBlock
  private validBlocks: ValidBlocks
  private lastMessageID = new BN(0)

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
    this.pendingBlock = new PendingBlock({ config: this.config, txPool: this.txPool })
    this.validBlocks = new Map()

    this.executePayloadV1 = middleware(this.executePayloadV1.bind(this), 1, [
      [
        validators.object({
          parentHash: validators.blockHash,
          feeRecipient: validators.address,
          stateRoot: validators.hex,
          receiptsRoot: validators.hex,
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

    this.forkchoiceUpdatedV1 = middleware(this.forkchoiceUpdatedV1.bind(this), 1, [
      [
        validators.object({
          headBlockHash: validators.blockHash,
          safeBlockHash: validators.blockHash,
          finalizedBlockHash: validators.blockHash,
        }),
      ],
      [
        validators.optional(
          validators.object({
            timestamp: validators.hex,
            random: validators.hex,
            feeRecipient: validators.address,
          })
        ),
      ],
    ])

    this.getPayloadV1 = middleware(this.getPayloadV1.bind(this), 1, [[validators.hex]])
  }

  /**
   * Verifies the payload according to the execution environment
   * rule set (EIP-3675) and returns the status of the verification.
   *
   * @param params An array of one parameter:
   *   1. An object as an instance of {@link ExecutionPayloadV1}
   * @returns An object:
   *   1. status: String - the result of the payload execution
   *        VALID - given payload is valid
   *        INVALID - given payload is invalid
   *        SYNCING - sync process is in progress
   *   2. latestValidHash: DATA|null - the hash of the most recent
   *      valid block in the branch defined by payload and its ancestors
   *   3. validationError: String|null - validation error message
   */
  async executePayloadV1(params: [ExecutionPayloadV1]) {
    const [payloadData] = params
    const {
      blockNumber: number,
      receiptsRoot: receiptTrie,
      random: mixHash,
      feeRecipient: coinbase,
      transactions,
      parentHash,
    } = payloadData
    const common = this.config.chainCommon

    try {
      await findBlock(toBuffer(parentHash), this.validBlocks, this.chain)
    } catch (error: any) {
      return { status: Status.SYNCING, validationError: null, latestValidHash: null }
    }

    const txs = []
    for (const [index, serializedTx] of transactions.entries()) {
      try {
        const tx = TransactionFactory.fromSerializedData(toBuffer(serializedTx), { common })
        txs.push(tx)
      } catch (error) {
        const validationError = `Invalid tx at index ${index}: ${error}`
        this.config.logger.error(validationError)
        const latestValidHash = await validHash(
          toBuffer(payloadData.parentHash),
          this.validBlocks,
          this.chain
        )
        return { status: Status.INVALID, validationError, latestValidHash }
      }
    }

    const transactionsTrie = await txsTrieRoot(txs)
    const header: HeaderData = {
      ...payloadData,
      number,
      receiptTrie,
      transactionsTrie,
      mixHash,
      coinbase,
    }

    let block
    try {
      block = Block.fromBlockData({ header, transactions: txs }, { common })

      // Verify blockHash matches payload
      if (!block.hash().equals(toBuffer(payloadData.blockHash))) {
        throw new Error(
          `Invalid blockHash, expected: ${payloadData.blockHash}, received: ${bufferToHex(
            block.hash()
          )}`
        )
      }
    } catch (error) {
      const validationError = `Error verifying block during init: ${error}`
      this.config.logger.debug(validationError)
      const latestValidHash = await validHash(
        toBuffer(header.parentHash),
        this.validBlocks,
        this.chain
      )
      return { status: Status.INVALID, validationError, latestValidHash }
    }

    const vmCopy = this.vm.copy()
    const vmHead = this.chain.headers.latest!
    let blocks: Block[]
    try {
      blocks = await recursivelyFindParents(
        vmHead.hash(),
        block.header.parentHash,
        this.validBlocks,
        this.chain
      )
    } catch (error) {
      return { status: Status.SYNCING, validationError: null, latestValidHash: null }
    }

    blocks.push(block)

    try {
      for (const [i, block] of blocks.entries()) {
        const root = (i > 0 ? blocks[i - 1] : await this.chain.getBlock(block.header.parentHash))
          .header.stateRoot
        await vmCopy.runBlock({ block, root })
        await vmCopy.blockchain.putBlock(block)
      }
    } catch (error) {
      const validationError = `Error verifying block while running: ${error}`
      this.config.logger.debug(validationError)
      const latestValidHash = await validHash(block.header.parentHash, this.validBlocks, this.chain)
      return { status: Status.INVALID, validationError, latestValidHash }
    }

    this.validBlocks.set(block.hash().toString('hex'), block)
    return { status: Status.VALID, latestValidHash: bufferToHex(block.hash()) }
  }

  /**
   * Propagates the change in the fork choice to the execution client.
   *
   * @param params An array of one parameter:
   *   1. An object - The state of the fork choice:
   *        headBlockHash - block hash of the head of the canonical chain
   *        safeBlockHash - the "safe" block hash of the canonical chain under certain synchrony
   *         and honesty assumptions. This value MUST be either equal to or an ancestor of headBlockHash
   *        finalizedBlockHash - block hash of the most recent finalized block
   *   2. An object or null - instance of {@link PayloadAttributesV1}
   * @returns None or an error
   */
  async forkchoiceUpdatedV1(
    params: [forkchoiceState: ForkchoiceStateV1, payloadAttributes: PayloadAttributesV1 | undefined]
  ) {
    const { headBlockHash, finalizedBlockHash } = params[0]
    const payloadAttributes = params[1]

    /*
     * Process head block
     */
    let headBlock = this.validBlocks.get(headBlockHash.slice(2))
    if (!headBlock) {
      // In case this request was not received sequentially,
      // the block may already be in the blockchain.
      try {
        headBlock = await this.chain.getBlock(toBuffer(headBlockHash))
      } catch (error) {
        return { status: Status.SYNCING, payloadId: null }
      }
    }

    const vmHeadHash = this.chain.headers.latest!.hash()
    if (!vmHeadHash.equals(headBlock.hash())) {
      let parentBlocks
      try {
        parentBlocks = await recursivelyFindParents(
          vmHeadHash,
          headBlock.header.parentHash,
          this.validBlocks,
          this.chain
        )
      } catch (error) {
        return { status: Status.SYNCING, payloadId: null }
      }

      const blocks = [...parentBlocks, headBlock]
      await this.chain.putBlocks(blocks, true)
      await this.synchronizer.execution.run()
      this.synchronizer.checkTxPoolState()
      this.txPool.removeNewBlockTxs(blocks)

      for (const block of blocks) {
        this.validBlocks.delete(block.hash().toString('hex'))
      }

      if (
        !this.synchronizer.syncTargetHeight ||
        this.synchronizer.syncTargetHeight.lt(headBlock.header.number)
      ) {
        this.config.synchronized = true
        this.config.lastSyncDate = Date.now()
        this.synchronizer.syncTargetHeight = headBlock.header.number
      }
    }

    /*
     * Process finalized block
     */
    if (finalizedBlockHash === '0'.repeat(64)) {
      // All zeros means no finalized block yet which is okay
    } else {
      this.chain.lastFinalizedBlockHash = toBuffer(finalizedBlockHash)
    }

    /*
     * If payloadAttributes is present, start building block and return payloadId
     */
    if (payloadAttributes) {
      const { timestamp, random, suggestedFeeRecipient } = payloadAttributes
      const parentBlock = this.chain.blocks.latest!
      const payloadId = await this.pendingBlock.start(this.vm.copy(), parentBlock, {
        timestamp,
        mixHash: random,
        coinbase: suggestedFeeRecipient,
      })
      return { status: Status.SUCCESS, payloadId: bufferToHex(payloadId) }
    }

    return { status: Status.SUCCESS }
  }

  /**
   * Given payloadId, returns the most recent version of an execution payload
   * that is available by the time of the call or responds with an error.
   *
   * @param params An array of one parameter:
   *   1. payloadId: DATA, 8 bytes - identifier of the payload building process
   * @returns Instance of {@link ExecutionPayloadV1} or an error
   */
  async getPayloadV1(params: [string]) {
    const payloadId = toBuffer(params[0])
    try {
      const block = await this.pendingBlock.build(payloadId)
      if (!block) {
        throw EngineError.UnknownPayload
      }
      this.validBlocks.set(block.hash().toString('hex'), block)
      return blockToExecutionPayload(block)
    } catch (error: any) {
      if (error === EngineError.UnknownPayload) throw error
      throw {
        code: INTERNAL_ERROR,
        message: error.message ?? error,
      }
    }
  }
}
