import { Block } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import { TransactionFactory } from '@ethereumjs/tx'
import { bufferToHex, toBuffer, zeros } from '@ethereumjs/util'

import { PendingBlock } from '../../miner'
import { short } from '../../util'
import { INTERNAL_ERROR, INVALID_PARAMS } from '../error-code'
import { CLConnectionManager, middleware as cmMiddleware } from '../util/CLConnectionManager'
import { middleware, validators } from '../validation'

import type { Chain } from '../../blockchain'
import type { EthereumClient } from '../../client'
import type { Config } from '../../config'
import type { VMExecution } from '../../execution'
import type { FullEthereumService } from '../../service'
import type { HeaderData } from '@ethereumjs/block'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { VM } from '@ethereumjs/vm'

export enum Status {
  ACCEPTED = 'ACCEPTED',
  INVALID = 'INVALID',
  INVALID_BLOCK_HASH = 'INVALID_BLOCK_HASH',
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
    await trie.put(Buffer.from(RLP.encode(i)), tx.serialize())
  }
  return trie.root()
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
 * Validates that the block satisfies post-merge conditions.
 */
const validateTerminalBlock = async (block: Block, chain: Chain): Promise<boolean> => {
  const ttd = chain.config.chainCommon.hardforkTTD(Hardfork.Merge)
  if (ttd === null) return false
  const blockTd = await chain.getTd(block.hash(), block.header.number)

  // Block is terminal if its td >= ttd and its parent td < ttd.
  // In case the Genesis block has td >= ttd it is the terminal block
  if (block.isGenesis()) return blockTd >= ttd

  const parentBlockTd = await chain.getTd(block.header.parentHash, block.header.number - BigInt(1))
  return blockTd >= ttd && parentBlockTd < ttd
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
  const common = config.chainCommon.copy()

  // This is a post merge block, so set its common accordingly
  const ttd = common.hardforkTTD(Hardfork.Merge)
  common.setHardforkByBlockNumber(number, ttd !== null ? ttd : undefined)

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
    // we are not setting hardforkByBlockNumber or hardforkByTTD as common is already
    // correctly set to the correct hf
    block = Block.fromBlockData({ header, transactions: txs }, { common })

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
    if (this.service.execution === undefined) {
      throw Error('execution required for engine module')
    }
    this.execution = this.service.execution
    this.vm = this.execution.vm
    this.connectionManager = new CLConnectionManager({ config: this.chain.config })
    this.pendingBlock = new PendingBlock({ config: this.config, txPool: this.service.txPool })
    this.remoteBlocks = new Map()

    this.newPayloadV1 = cmMiddleware(
      middleware(this.newPayloadV1.bind(this), 1, [
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
      ]),
      ([payload], response) => this.connectionManager.lastNewPayload({ payload, response })
    )

    this.forkchoiceUpdatedV1 = cmMiddleware(
      middleware(this.forkchoiceUpdatedV1.bind(this), 1, [
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
      ]),
      ([state], response, error) => {
        this.connectionManager.lastForkchoiceUpdate({
          state,
          response,
          headBlock: response?.headBlock,
          error,
        })
        // Remove the headBlock from the response object as headBlock is bundled only for connectionManager
        delete response?.headBlock
      }
    )

    this.getPayloadV1 = cmMiddleware(
      middleware(this.getPayloadV1.bind(this), 1, [[validators.hex]]),
      () => this.connectionManager.updateStatus()
    )

    this.exchangeTransitionConfigurationV1 = cmMiddleware(
      middleware(this.exchangeTransitionConfigurationV1.bind(this), 1, [
        [
          validators.object({
            terminalTotalDifficulty: validators.hex,
            terminalBlockHash: validators.hex,
            terminalBlockNumber: validators.hex,
          }),
        ],
      ]),
      () => this.connectionManager.updateStatus()
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
      return response
    }

    // This optimistic lookup keeps skeleton updated even if for e.g. beacon sync might not have
    // been intialized here but a batch of blocks new payloads arrive, most likely during sync
    // We still can't switch to beacon sync here especially if the chain is pre merge and there
    // is pow block which this client would like to mint and attempt proposing it
    const optimisticLookup = await this.service.beaconSync?.extendChain(block)

    const blockExists = await validBlock(toBuffer(blockHash), this.chain)
    if (blockExists) {
      const isBlockExecuted = await this.vm.stateManager.hasStateRoot(blockExists.header.stateRoot)
      if (isBlockExecuted) {
        const response = {
          status: Status.VALID,
          latestValidHash: blockHash,
          validationError: null,
        }
        return response
      }
    }

    try {
      const parent = await this.chain.getBlock(toBuffer(parentHash))
      if (!parent._common.gteHardfork(Hardfork.Merge)) {
        const validTerminalBlock = await validateTerminalBlock(parent, this.chain)
        if (!validTerminalBlock) {
          const response = {
            status: Status.INVALID,
            validationError: null,
            latestValidHash: bufferToHex(zeros(32)),
          }
          return response
        }
      }
      const isBlockExecuted = await this.vm.stateManager.hasStateRoot(parent.header.stateRoot)
      // If the parent is not executed throw an error, it will be caught and return SYNCING or ACCEPTED.
      if (!isBlockExecuted) {
        throw new Error(`Parent block not yet executed number=${parent.header.number}`)
      }
    } catch (error: any) {
      const status =
        // If the transitioned to beacon sync and this block can extend beacon chain then
        optimisticLookup === true ? Status.SYNCING : Status.ACCEPTED
      if (status === Status.ACCEPTED) {
        // Stash the block for a potential forced forkchoice update to it later.
        this.remoteBlocks.set(block.hash().toString('hex'), block)
      }
      const response = { status, validationError: null, latestValidHash: null }
      return response
    }

    const vmHead = this.chain.headers.latest!
    let blocks: Block[]
    try {
      blocks = await recursivelyFindParents(vmHead.hash(), block.header.parentHash, this.chain)
    } catch (error) {
      const response = { status: Status.SYNCING, latestValidHash: null, validationError: null }
      return response
    }

    blocks.push(block)

    try {
      for (const [i, block] of blocks.entries()) {
        const root = (i > 0 ? blocks[i - 1] : await this.chain.getBlock(block.header.parentHash))
          .header.stateRoot
        await this.execution.runWithoutSetHead({
          block,
          root,
          hardforkByTTD: this.chain.headers.td,
        })
      }
    } catch (error) {
      const validationError = `Error verifying block while running: ${error}`
      this.config.logger.error(validationError)
      const latestValidHash = await validHash(block.header.parentHash, this.chain)
      const response = { status: Status.INVALID, latestValidHash, validationError }
      return response
    }

    const response = {
      status: Status.VALID,
      latestValidHash: bufferToHex(block.hash()),
      validationError: null,
    }
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
   *   2. payloadId: DATA|null - 8 Bytes - identifier of the payload build process or `null`
   *   3. headBlock: Block|undefined - Block corresponding to headBlockHash if found
   */
  async forkchoiceUpdatedV1(
    params: [forkchoiceState: ForkchoiceStateV1, payloadAttributes: PayloadAttributesV1 | undefined]
  ): Promise<ForkchoiceResponseV1 & { headBlock?: Block }> {
    const { headBlockHash, finalizedBlockHash, safeBlockHash } = params[0]
    const payloadAttributes = params[1]

    // It is possible that newPayload didnt start beacon sync as the payload it was asked to
    // evaluate didn't require syncing beacon. This can happen if the EL<>CL starts and CL
    // starts from a bit behind like how lodestar does
    if (!this.service.beaconSync && !this.config.disableBeaconSync) {
      await this.service.switchToBeaconSync()
    }

    /*
     * Process head block
     */
    let headBlock: Block | undefined
    try {
      headBlock = await this.chain.getBlock(toBuffer(headBlockHash))
    } catch (error) {
      headBlock =
        (await this.service.beaconSync?.skeleton.getBlockByHash(toBuffer(headBlockHash))) ??
        this.remoteBlocks.get(headBlockHash.slice(2))
      if (headBlock === undefined) {
        this.config.logger.debug(`Forkchoice requested unknown head hash=${short(headBlockHash)}`)
        const payloadStatus = {
          status: Status.SYNCING,
          latestValidHash: null,
          validationError: null,
        }
        const response = { payloadStatus, payloadId: null }
        return response
      } else {
        this.remoteBlocks.delete(headBlockHash.slice(2))
      }
    }

    // Always keep beaconSync skeleton updated so that it stays updated with any skeleton sync
    // requirements that might come later because of reorg or CL restarts
    this.config.logger.debug(
      `Forkchoice requested update to new head number=${headBlock.header.number} hash=${short(
        headBlock.hash()
      )}`
    )
    await this.service.beaconSync?.setHead(headBlock)

    // Only validate this as terminal block if this block's difficulty is non-zero,
    // else this is a PoS block but its hardfork could be indeterminable if the skeleton
    // is not yet connected.
    if (!headBlock._common.gteHardfork(Hardfork.Merge) && headBlock.header.difficulty > BigInt(0)) {
      const validTerminalBlock = await validateTerminalBlock(headBlock, this.chain)
      if (!validTerminalBlock) {
        const response = {
          payloadStatus: {
            status: Status.INVALID,
            validationError: null,
            latestValidHash: bufferToHex(zeros(32)),
          },
          payloadId: null,
        }
        return response
      }
    }

    const isHeadExecuted = await this.vm.stateManager.hasStateRoot(headBlock.header.stateRoot)
    if (!isHeadExecuted) {
      // execution has not yet caught up, so lets just return sync
      const payloadStatus = {
        status: Status.SYNCING,
        latestValidHash: null,
        validationError: null,
      }
      const response = { payloadStatus, payloadId: null }
      return response
    }

    const vmHeadHash = this.chain.headers.latest!.hash()
    if (!vmHeadHash.equals(headBlock.hash())) {
      let parentBlocks: Block[] = []
      if (this.chain.headers.latest && this.chain.headers.latest.number < headBlock.header.number) {
        try {
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
          return response
        }
      }

      const blocks = [...parentBlocks, headBlock]
      await this.execution.setHead(blocks)
      this.service.txPool.removeNewBlockTxs(blocks)

      const timeDiff = new Date().getTime() / 1000 - Number(headBlock.header.timestamp)
      if (
        (typeof this.config.syncTargetHeight !== 'bigint' ||
          this.config.syncTargetHeight === BigInt(0) ||
          this.config.syncTargetHeight < headBlock.header.number) &&
        timeDiff < 30
      ) {
        this.config.synchronized = true
        this.config.lastSyncDate = Date.now()
        this.config.syncTargetHeight = headBlock.header.number
        this.service.txPool.checkRunState()
      }
    }

    /*
     * Process safe and finalized block
     * Allowed to have zero value while transition block is finalizing
     */
    const zeroBlockHash = zeros(32)
    const safe = toBuffer(safeBlockHash)
    if (!safe.equals(headBlock.hash()) && !safe.equals(zeroBlockHash)) {
      try {
        await this.chain.getBlock(safe)
      } catch (error) {
        const message = 'safe block not available'
        throw {
          code: INVALID_PARAMS,
          message,
        }
      }
    }
    const finalized = toBuffer(finalizedBlockHash)
    if (!finalized.equals(zeroBlockHash)) {
      try {
        await this.chain.getBlock(finalized)
      } catch (error) {
        throw {
          message: 'finalized block not available',
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
      const payloadId = await this.pendingBlock.start(await this.vm.copy(), parentBlock, {
        timestamp,
        mixHash: prevRandao,
        coinbase: suggestedFeeRecipient,
      })
      const latestValidHash = await validHash(headBlock.hash(), this.chain)
      const payloadStatus = { status: Status.VALID, latestValidHash, validationError: null }
      const response = { payloadStatus, payloadId: bufferToHex(payloadId), headBlock }
      return response
    }

    const latestValidHash = await validHash(headBlock.hash(), this.chain)
    const payloadStatus = { status: Status.VALID, latestValidHash, validationError: null }
    const response = { payloadStatus, payloadId: null, headBlock }
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
    const { terminalTotalDifficulty, terminalBlockHash, terminalBlockNumber } = params[0]
    const ttd = this.chain.config.chainCommon.hardforkTTD(Hardfork.Merge)
    if (ttd === undefined || ttd === null) {
      throw {
        code: INTERNAL_ERROR,
        message: 'terminalTotalDifficulty not set internally',
      }
    }
    if (ttd !== BigInt(terminalTotalDifficulty)) {
      throw {
        code: INVALID_PARAMS,
        message: `terminalTotalDifficulty set to ${ttd}, received ${parseInt(
          terminalTotalDifficulty
        )}`,
      }
    }
    // Note: our client does not yet support block whitelisting (terminalBlockHash/terminalBlockNumber)
    // since we are not yet fast enough to run along tip-of-chain mainnet execution
    return { terminalTotalDifficulty, terminalBlockHash, terminalBlockNumber }
  }
}
