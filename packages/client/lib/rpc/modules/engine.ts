import { Block, HeaderData } from '@ethereumjs/block'
import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx'
import { toBuffer, bufferToHex, rlp, BN, zeros } from 'ethereumjs-util'
import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { Hardfork } from '@ethereumjs/common'

import { middleware, validators } from '../validation'
import { INTERNAL_ERROR, INVALID_PARAMS } from '../error-code'
import { short } from '../../util'
import { PendingBlock } from '../../miner'
import { CLConnectionManager } from '../util/CLConnectionManager'
import type VM from '@ethereumjs/vm'
import type EthereumClient from '../../client'
import type { Chain } from '../../blockchain'
import type { VMExecution } from '../../execution'
import type { Config } from '../../config'
import type { FullEthereumService } from '../../service'

export enum Status {
  ACCEPTED = 'ACCEPTED',
  INVALID = 'INVALID',
  INVALID_BLOCK_HASH = 'INVALID_BLOCK_HASH',
  INVALID_TERMINAL_BLOCK = 'INVALID_TERMINAL_BLOCK',
  SYNCING = 'SYNCING',
  VALID = 'VALID',
}

export type ExecutionPayloadV1 = {
  parentHash: string // DATA, 32 Bytes
  feeRecipient: string // DATA, 20 Bytes
  stateRoot: string // DATA, 32 Bytes
  receiptsRoot: string // DATA, 32 bytes
  logsBloom: string // DATA, 256 Bytes
  prevRandao: string // DATA, 32 Bytes
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

export type ForkchoiceStateV1 = {
  headBlockHash: string
  safeBlockHash: string
  finalizedBlockHash: string
}

type PayloadAttributesV1 = {
  timestamp: string
  prevRandao: string
  suggestedFeeRecipient: string
}

export type PayloadStatusV1 = {
  status: Status
  latestValidHash: string | null
  validationError: string | null
}

export type ForkchoiceResponseV1 = {
  payloadStatus: PayloadStatusV1
  payloadId: string | null
}

type TransitionConfigurationV1 = {
  terminalTotalDifficulty: string
  terminalBlockHash: string
  terminalBlockNumber: string
}

const EngineError = {
  UnknownPayload: {
    code: -32001,
    message: 'Unknown payload',
  },
}

/**
 * Formats a block to {@link ExecutionPayloadV1}.
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
    prevRandao: header.mixHash!,
    transactions,
  }
  return payload
}

/**
 * Recursively finds parent blocks starting from the parentHash.
 */
const recursivelyFindParents = async (vmHeadHash: Buffer, parentHash: Buffer, chain: Chain) => {
  if (parentHash.equals(vmHeadHash) || parentHash.equals(Buffer.alloc(32))) {
    return []
  }
  const parentBlocks = []
  const block = await chain.getBlock(parentHash)
  parentBlocks.push(block)
  while (!parentBlocks[parentBlocks.length - 1].hash().equals(parentHash)) {
    const block: Block = await chain.getBlock(
      parentBlocks[parentBlocks.length - 1].header.parentHash
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
 * Returns the block hash as a 0x-prefixed hex string if found valid in the blockchain, otherwise returns null.
 */
const validHash = async (hash: Buffer, chain: Chain): Promise<string | null> => {
  try {
    await chain.getBlock(hash)
  } catch (error: any) {
    return null
  }
  return bufferToHex(hash)
}

/**
 * Returns the block hash as a 0x-prefixed hex string if found valid in the blockchain, otherwise returns null.
 */
const validBlock = async (hash: Buffer, chain: Chain): Promise<Block | null> => {
  try {
    return await chain.getBlock(hash)
  } catch (error: any) {
    return null
  }
}

/**
 *  Validate that the block satisfies post-merge conditions.
 */
const validateTerminalBlock = async (block: Block, chain: Chain): Promise<boolean> => {
  const td = chain.config.chainCommon.hardforkTD(Hardfork.Merge)
  if (td === undefined || td === null) return false
  const ttd = new BN(td)
  const blockTd = await chain.getTd(block.hash(), block.header.number)

  // Block is terminal if its td >= ttd and its parent td < ttd.
  // In case the Genesis block has td >= ttd it is the terminal block
  if (block.isGenesis()) return blockTd.gte(ttd)

  const parentBlockTd = await chain.getTd(block.header.parentHash, block.header.number.subn(1))
  return blockTd.gte(ttd) && parentBlockTd.lt(ttd)
}

/**
 * Returns a block from a payload.
 * If errors, returns {@link PayloadStatusV1}
 */
const assembleBlock = async (
  payload: ExecutionPayloadV1,
  chain: Chain
): Promise<{ block?: Block; error?: PayloadStatusV1 }> => {
  const {
    blockNumber: number,
    receiptsRoot: receiptTrie,
    prevRandao: mixHash,
    feeRecipient: coinbase,
    transactions,
  } = payload
  const { config } = chain
  const { chainCommon: common } = config

  const txs = []
  for (const [index, serializedTx] of transactions.entries()) {
    try {
      const tx = TransactionFactory.fromSerializedData(toBuffer(serializedTx), { common })
      txs.push(tx)
    } catch (error) {
      const validationError = `Invalid tx at index ${index}: ${error}`
      config.logger.error(validationError)
      const latestValidHash = await validHash(toBuffer(payload.parentHash), chain)
      const response = { status: Status.INVALID, latestValidHash, validationError }
      return { error: response }
    }
  }

  const transactionsTrie = await txsTrieRoot(txs)
  const header: HeaderData = {
    ...payload,
    number,
    receiptTrie,
    transactionsTrie,
    mixHash,
    coinbase,
  }

  let block: Block
  try {
    block = Block.fromBlockData(
      { header, transactions: txs },
      { common, hardforkByTD: chain.headers.td }
    )

    // Verify blockHash matches payload
    if (!block.hash().equals(toBuffer(payload.blockHash))) {
      const validationError = `Invalid blockHash, expected: ${
        payload.blockHash
      }, received: ${bufferToHex(block.hash())}`
      config.logger.debug(validationError)
      const latestValidHash = await validHash(toBuffer(header.parentHash), chain)
      const response = { status: Status.INVALID_BLOCK_HASH, latestValidHash, validationError }
      return { error: response }
    }
  } catch (error) {
    const validationError = `Error verifying block during init: ${error}`
    config.logger.debug(validationError)
    const latestValidHash = await validHash(toBuffer(header.parentHash), chain)
    const response = { status: Status.INVALID, latestValidHash, validationError }
    return { error: response }
  }

  return { block }
}

/**
 * engine_* RPC module
 * @memberof module:rpc/modules
 */
export class Engine {
  private client: EthereumClient
  private execution: VMExecution
  private service: FullEthereumService
  private chain: Chain
  private config: Config
  private vm: VM
  private pendingBlock: PendingBlock
  private remoteBlocks: Map<String, Block>
  private connectionManager: CLConnectionManager

  /**
   * Create engine_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    this.client = client
    this.service = client.services.find((s) => s.name === 'eth') as FullEthereumService
    this.chain = this.service.chain
    this.config = this.chain.config
    if (!this.service.execution) {
      throw Error('execution required for engine module')
    }
    this.execution = this.service.execution
    this.vm = this.execution.vm
    this.connectionManager = new CLConnectionManager({ config: this.chain.config })
    this.pendingBlock = new PendingBlock({ config: this.config, txPool: this.service.txPool })
    this.remoteBlocks = new Map()

    this.newPayloadV1 = middleware(this.newPayloadV1.bind(this), 1, [
      [
        validators.object({
          parentHash: validators.blockHash,
          feeRecipient: validators.address,
          stateRoot: validators.hex,
          receiptsRoot: validators.hex,
          logsBloom: validators.hex,
          prevRandao: validators.hex,
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
            prevRandao: validators.hex,
            suggestedFeeRecipient: validators.address,
          })
        ),
      ],
    ])

    this.getPayloadV1 = middleware(this.getPayloadV1.bind(this), 1, [[validators.hex]])

    this.exchangeTransitionConfigurationV1 = middleware(
      this.exchangeTransitionConfigurationV1.bind(this),
      1,
      [
        [
          validators.object({
            terminalTotalDifficulty: validators.hex,
            terminalBlockHash: validators.hex,
            terminalBlockNumber: validators.hex,
          }),
        ],
      ]
    )
  }

  /**
   * Verifies the payload according to the execution environment
   * rule set (EIP-3675) and returns the status of the verification.
   *
   * @param params An array of one parameter:
   *   1. An object as an instance of {@link ExecutionPayloadV1}
   * @returns An object of shape {@link PayloadStatusV1}:
   *   1. status: String - the result of the payload execution
   *        VALID - given payload is valid
   *        INVALID - given payload is invalid
   *        SYNCING - sync process is in progress
   *        ACCEPTED - blockHash is valid, doesn't extend the canonical chain, hasn't been fully validated
   *        INVALID_BLOCK_HASH - blockHash validation failed
   *        INVALID_TERMINAL_BLOCK - block fails transition block validity
   *   2. latestValidHash: DATA|null - the hash of the most recent
   *      valid block in the branch defined by payload and its ancestors
   *   3. validationError: String|null - validation error message
   */
  async newPayloadV1(params: [ExecutionPayloadV1]): Promise<PayloadStatusV1> {
    const [payload] = params
    const { parentHash, blockHash } = payload

    const { block, error } = await assembleBlock(payload, this.chain)
    if (!block || error) {
      let response = error
      if (!response) {
        const validationError = `Error assembling block during init`
        this.config.logger.debug(validationError)
        const latestValidHash = await validHash(toBuffer(payload.parentHash), this.chain)
        response = { status: Status.INVALID, latestValidHash, validationError }
      }
      this.connectionManager.lastNewPayload({ payload, response })
      return response
    }

    const blockExists = await validBlock(toBuffer(blockHash), this.chain)
    if (blockExists !== null) {
      const isBlockExecuted = await this.vm.stateManager.hasStateRoot(blockExists.header.stateRoot)
      if (isBlockExecuted) {
        const response = {
          status: Status.VALID,
          latestValidHash: blockHash,
          validationError: null,
        }
        this.connectionManager.lastNewPayload({ payload: params[0], response })
        return response
      } else {
        /** Seems like the block isn't executed yet, force execution */
        void this.service.beaconSync?.runExecution(true)
      }
    }

    try {
      const parent = await this.chain.getBlock(toBuffer(parentHash))
      const isBlockExecuted = await this.vm.stateManager.hasStateRoot(parent.header.stateRoot)
      // If the parent is not executed throw error, this would lead to catching the
      // error and suitably sending SYNCING or ACCEPTED response.
      if (!isBlockExecuted) {
        throw new Error(`Parent block not yet executed number=${parent.header.number}`)
      }
      if (!parent._common.gteHardfork(Hardfork.Merge)) {
        const validTerminalBlock = await validateTerminalBlock(parent, this.chain)
        if (!validTerminalBlock) {
          const response = {
            status: Status.INVALID_TERMINAL_BLOCK,
            validationError: null,
            latestValidHash: null,
          }
          this.connectionManager.lastNewPayload({ payload: params[0], response })
          return response
        }
      }
    } catch (error: any) {
      if (!this.service.beaconSync && !this.config.disableBeaconSync) {
        await this.service.switchToBeaconSync()
      }
      const status = (await this.service.beaconSync?.extendChain(block))
        ? Status.SYNCING
        : Status.ACCEPTED
      if (status === Status.ACCEPTED) {
        // Stash the block for a potential forced forkchoice update to it later.
        this.remoteBlocks.set(block.hash().toString('hex'), block)
      }
      const response = { status, validationError: null, latestValidHash: null }
      this.connectionManager.lastNewPayload({ payload: params[0], response })
      return response
    }

    const vmHead = this.chain.headers.latest!
    let blocks: Block[]
    try {
      blocks = await recursivelyFindParents(vmHead.hash(), block.header.parentHash, this.chain)
    } catch (error) {
      const response = { status: Status.SYNCING, latestValidHash: null, validationError: null }
      this.connectionManager.lastNewPayload({ payload: params[0], response })
      return response
    }

    blocks.push(block)

    try {
      for (const [i, block] of blocks.entries()) {
        const root = (i > 0 ? blocks[i - 1] : await this.chain.getBlock(block.header.parentHash))
          .header.stateRoot
        await this.execution.runWithoutSetHead({ block, root, hardforkByTD: this.chain.headers.td })
      }
    } catch (error) {
      const validationError = `Error verifying block while running: ${error}`
      this.config.logger.error(validationError)
      const latestValidHash = await validHash(block.header.parentHash, this.chain)
      const response = { status: Status.INVALID, latestValidHash, validationError }
      this.connectionManager.lastNewPayload({ payload: params[0], response })
      return response
    }

    const response = {
      status: Status.VALID,
      latestValidHash: bufferToHex(block.hash()),
      validationError: null,
    }
    this.connectionManager.lastNewPayload({ payload: params[0], response })
    return response
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
   * @returns An object:
   *   1. payloadStatus: {@link PayloadStatusV1}; values of the `status` field in the context of this method are restricted to the following subset::
   *        VALID
   *        INVALID
   *        SYNCING
   *        INVALID_TERMINAL_BLOCK
   *   2. payloadId: DATA|null - 8 Bytes - identifier of the payload build process or `null`
   */
  async forkchoiceUpdatedV1(
    params: [forkchoiceState: ForkchoiceStateV1, payloadAttributes: PayloadAttributesV1 | undefined]
  ): Promise<ForkchoiceResponseV1> {
    const { headBlockHash, finalizedBlockHash, safeBlockHash } = params[0]
    const payloadAttributes = params[1]

    /*
     * Process head block
     */
    let headBlock: Block
    try {
      headBlock = await this.chain.getBlock(toBuffer(headBlockHash))
    } catch (error) {
      headBlock =
        (await this.service.beaconSync?.skeleton.getBlockByHash(toBuffer(headBlockHash))) ??
        (this.remoteBlocks.get(headBlockHash.slice(2)) as Block)
      if (!headBlock) {
        this.config.logger.debug(`Forkchoice requested unknown head hash=${short(headBlockHash)}`)
        const payloadStatus = {
          status: Status.SYNCING,
          latestValidHash: null,
          validationError: null,
        }
        const response = { payloadStatus, payloadId: null }
        this.connectionManager.lastForkchoiceUpdate({
          state: params[0],
          response,
        })
        return response
      } else {
        this.config.logger.debug(
          `Forkchoice requested sync to new head number=${headBlock.header.number} hash=${short(
            headBlock.hash()
          )}`
        )
        this.service.beaconSync?.setHead(headBlock)
        this.remoteBlocks.delete(headBlockHash.slice(2))
      }
    }

    // Only validate this as terminal block if this block's difficulty is non-zero.
    // else this is a PoS block but its hardfork could be indeterminable if the skeleton
    // is not yet connected.
    // TODO: validate the terminal block when skeleton connects , otherwise mark skeleton
    // as invalid and throw errors if invalid skeleton is refered to
    if (!headBlock._common.gteHardfork(Hardfork.Merge) && headBlock.header.difficulty.gtn(0)) {
      const validTerminalBlock = await validateTerminalBlock(headBlock, this.chain)
      if (!validTerminalBlock) {
        const response = {
          payloadStatus: {
            status: Status.INVALID_TERMINAL_BLOCK,
            validationError: null,
            latestValidHash: null,
          },
          payloadId: null,
        }
        this.connectionManager.lastForkchoiceUpdate({
          state: params[0],
          response,
        })
        return response
      }
    }

    if (safeBlockHash !== headBlockHash) {
      try {
        await this.chain.getBlock(toBuffer(safeBlockHash))
      } catch (error) {
        const message = 'safe block hash not available'
        this.connectionManager.lastForkchoiceUpdate({
          state: params[0],
          response: undefined,
          error: message,
        })
        throw {
          code: INVALID_PARAMS,
          message,
        }
      }
    }

    const vmHeadHash = this.chain.headers.latest!.hash()
    if (!vmHeadHash.equals(headBlock.hash())) {
      let parentBlocks: Block[] = []
      if (this.chain.headers.latest?.number.lt(headBlock.header.number)) {
        try {
          const parent = await this.chain.getBlock(toBuffer(headBlock.header.parentHash))
          const isBlockExecuted = await this.vm.stateManager.hasStateRoot(parent.header.stateRoot)
          if (!isBlockExecuted) {
            throw new Error(`Parent block not yet executed number=${parent.header.number}`)
          }

          parentBlocks = await recursivelyFindParents(
            vmHeadHash,
            headBlock.header.parentHash,
            this.chain
          )
        } catch (error) {
          const payloadStatus = {
            status: Status.SYNCING,
            latestValidHash: null,
            validationError: null,
          }
          const response = { payloadStatus, payloadId: null }
          this.connectionManager.lastForkchoiceUpdate({
            state: params[0],
            response,
          })
          return response
        }
      }

      const blocks = [...parentBlocks, headBlock]
      await this.execution.setHead(blocks)
      this.service.txPool.removeNewBlockTxs(blocks)

      const timeDiff = new Date().getTime() / 1000 - headBlock.header.timestamp.toNumber()
      if (
        (!this.config.syncTargetHeight ||
          this.config.syncTargetHeight.lt(headBlock.header.number)) &&
        timeDiff < 30
      ) {
        this.config.synchronized = true
        this.config.lastSyncDate = Date.now()
        this.config.syncTargetHeight = headBlock.header.number
        this.service.txPool.checkRunState()
      }
    }

    /*
     * Process finalized block
     * All zeros means no finalized block yet which is okay
     */
    const zeroHash = zeros(32)
    const finalizedHash = toBuffer(finalizedBlockHash)
    if (!finalizedHash.equals(zeroHash)) {
      try {
        this.chain.lastFinalizedBlockHash = (
          await this.chain.getBlock(toBuffer(finalizedBlockHash))
        ).hash()
      } catch (error) {
        throw {
          message: 'finalized block hash not available',
          code: INVALID_PARAMS,
        }
      }
    }

    /*
     * If payloadAttributes is present, start building block and return payloadId
     */
    if (payloadAttributes) {
      const { timestamp, prevRandao, suggestedFeeRecipient } = payloadAttributes
      const parentBlock = this.chain.blocks.latest!
      const payloadId = await this.pendingBlock.start(this.vm, parentBlock, {
        timestamp,
        mixHash: prevRandao,
        coinbase: suggestedFeeRecipient,
      })
      const latestValidHash = await validHash(headBlock.hash(), this.chain)
      const payloadStatus = { status: Status.VALID, latestValidHash, validationError: null }
      const response = { payloadStatus, payloadId: bufferToHex(payloadId) }
      this.connectionManager.lastForkchoiceUpdate({
        state: params[0],
        response,
        headBlock,
      })
      return response
    }

    const latestValidHash = await validHash(headBlock.hash(), this.chain)
    const payloadStatus = { status: Status.VALID, latestValidHash, validationError: null }
    const response = { payloadStatus, payloadId: null }
    this.connectionManager.lastForkchoiceUpdate({
      state: params[0],
      response,
      headBlock,
    })
    return response
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
    this.connectionManager.updateStatus()
    const payloadId = toBuffer(params[0])
    try {
      const built = await this.pendingBlock.build(payloadId)
      if (!built) {
        throw EngineError.UnknownPayload
      }
      const [block, receipts] = built
      await this.execution.runWithoutSetHead({ block }, receipts)
      return blockToExecutionPayload(block)
    } catch (error: any) {
      if (error === EngineError.UnknownPayload) throw error
      throw {
        code: INTERNAL_ERROR,
        message: error.message ?? error,
      }
    }
  }

  /**
   * Compare transition configuration parameters.
   *
   * @param params An array of one parameter:
   *   1. transitionConfiguration: Object - instance of {@link TransitionConfigurationV1}
   * @returns Instance of {@link TransitionConfigurationV1} or an error
   */
  async exchangeTransitionConfigurationV1(
    params: [TransitionConfigurationV1]
  ): Promise<TransitionConfigurationV1> {
    this.connectionManager.updateStatus()
    const { terminalTotalDifficulty, terminalBlockHash, terminalBlockNumber } = params[0]
    const td = this.chain.config.chainCommon.hardforkTD(Hardfork.Merge)
    if (td === undefined || td === null) {
      throw {
        code: INTERNAL_ERROR,
        message: 'terminalTotalDifficulty not set internally',
      }
    }
    if (!td.eq(new BN(toBuffer(terminalTotalDifficulty)))) {
      throw {
        code: INVALID_PARAMS,
        message: `terminalTotalDifficulty set to ${td}, received ${parseInt(
          terminalTotalDifficulty
        )}`,
      }
    }
    // Note: our client does not yet support block whitelisting (terminalBlockHash/terminalBlockNumber)
    // since we are not yet fast enough to run along tip-of-chain mainnet execution
    return { terminalTotalDifficulty, terminalBlockHash, terminalBlockNumber }
  }
}
