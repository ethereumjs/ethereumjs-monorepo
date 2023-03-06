import { Block } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { TransactionFactory } from '@ethereumjs/tx'
import { Withdrawal, bigIntToHex, bufferToHex, toBuffer, zeros } from '@ethereumjs/util'

import { PendingBlock } from '../../miner'
import { short } from '../../util'
import { INTERNAL_ERROR, INVALID_PARAMS, TOO_LARGE_REQUEST } from '../error-code'
import { CLConnectionManager, middleware as cmMiddleware } from '../util/CLConnectionManager'
import { middleware, validators } from '../validation'

import type { Chain } from '../../blockchain'
import type { EthereumClient } from '../../client'
import type { Config } from '../../config'
import type { VMExecution } from '../../execution'
import type { FullEthereumService } from '../../service'
import type { HeaderData } from '@ethereumjs/block'
import type { VM } from '@ethereumjs/vm'

export enum Status {
  ACCEPTED = 'ACCEPTED',
  INVALID = 'INVALID',
  INVALID_BLOCK_HASH = 'INVALID_BLOCK_HASH',
  SYNCING = 'SYNCING',
  VALID = 'VALID',
}

type Bytes8 = string
type Bytes20 = string
type Bytes32 = string
// type Root = Bytes32
type Blob = Bytes32
type Bytes48 = string
type Bytes256 = string
type VariableBytes32 = string
type Uint64 = string
type Uint256 = string

export type WithdrawalV1 = {
  index: Bytes8 // Quantity, 8 Bytes
  validatorIndex: Bytes8 // Quantity, 8 bytes
  address: Bytes20 // DATA, 20 bytes
  amount: Bytes32 // Quantity, 32 bytes
}

export type ExecutionPayload = {
  parentHash: Bytes32 // DATA, 32 Bytes
  feeRecipient: Bytes20 // DATA, 20 Bytes
  stateRoot: Bytes32 // DATA, 32 Bytes
  receiptsRoot: Bytes32 // DATA, 32 bytes
  logsBloom: Bytes256 // DATA, 256 Bytes
  prevRandao: Bytes32 // DATA, 32 Bytes
  blockNumber: Uint64 // QUANTITY, 64 Bits
  gasLimit: Uint64 // QUANTITY, 64 Bits
  gasUsed: Uint64 // QUANTITY, 64 Bits
  timestamp: Uint64 // QUANTITY, 64 Bits
  extraData: VariableBytes32 // DATA, 0 to 32 Bytes
  baseFeePerGas: Uint256 // QUANTITY, 256 Bits
  excessDataGas?: Uint256 // QUANTITY, 256 Bits
  blockHash: Bytes32 // DATA, 32 Bytes
  transactions: string[] // Array of DATA - Array of transaction rlp strings,
  withdrawals?: WithdrawalV1[] // Array of withdrawal objects
}
export type ExecutionPayloadV1 = Omit<ExecutionPayload, 'withdrawals' | 'excessDataGas'>
export type ExecutionPayloadV2 = ExecutionPayload & { withdrawals: WithdrawalV1[] }
export type ExecutionPayloadV3 = ExecutionPayload & { excessDataGas: Uint256 }

export type ForkchoiceStateV1 = {
  headBlockHash: Bytes32
  safeBlockHash: Bytes32
  finalizedBlockHash: Bytes32
}

type PayloadAttributes = {
  timestamp: Uint64
  prevRandao: Bytes32
  suggestedFeeRecipient: Bytes20
  withdrawals?: WithdrawalV1[]
}
type PayloadAttributesV1 = Omit<PayloadAttributes, 'withdrawals'>
type PayloadAttributesV2 = PayloadAttributes & { withdrawals: WithdrawalV1[] }

export type PayloadStatusV1 = {
  status: Status
  latestValidHash: Bytes32 | null
  validationError: string | null
}

export type ForkchoiceResponseV1 = {
  payloadStatus: PayloadStatusV1
  payloadId: Bytes8 | null
}

type TransitionConfigurationV1 = {
  terminalTotalDifficulty: Uint256
  terminalBlockHash: Bytes32
  terminalBlockNumber: Uint64
}

type BlobsBundleV1 = {
  blockHash: string
  kzgs: Bytes48[]
  blobs: Blob[]
}

type ExecutionPayloadBodyV1 = {
  transactions: string[]
  withdrawals: WithdrawalV1[] | null
}

const EngineError = {
  UnknownPayload: {
    code: -32001,
    message: 'Unknown payload',
  },
}

const executionPayloadV1FieldValidators = {
  parentHash: validators.blockHash,
  feeRecipient: validators.address,
  stateRoot: validators.bytes32,
  receiptsRoot: validators.bytes32,
  logsBloom: validators.bytes256,
  prevRandao: validators.bytes32,
  blockNumber: validators.uint64,
  gasLimit: validators.uint64,
  gasUsed: validators.uint64,
  timestamp: validators.uint64,
  extraData: validators.variableBytes32,
  baseFeePerGas: validators.uint256,
  blockHash: validators.blockHash,
  transactions: validators.array(validators.hex),
}
const executionPayloadV2FieldValidators = {
  ...executionPayloadV1FieldValidators,
  withdrawals: validators.array(validators.withdrawal()),
}
const executionPayloadV3FieldValidators = {
  ...executionPayloadV2FieldValidators,
  excessDataGas: validators.uint256,
}

const forkchoiceFieldValidators = {
  headBlockHash: validators.blockHash,
  safeBlockHash: validators.blockHash,
  finalizedBlockHash: validators.blockHash,
}

const payloadAttributesFieldValidatorsV1 = {
  timestamp: validators.uint64,
  prevRandao: validators.bytes32,
  suggestedFeeRecipient: validators.address,
}
const payloadAttributesFieldValidatorsV2 = {
  ...payloadAttributesFieldValidatorsV1,
  withdrawals: validators.optional(validators.array(validators.withdrawal())),
}
/**
 * Formats a block to {@link ExecutionPayloadV1}.
 */
const blockToExecutionPayload = (block: Block, value: bigint) => {
  const blockJson = block.toJSON()
  const header = blockJson.header!
  const transactions = block.transactions.map((tx) => bufferToHex(tx.serialize())) ?? []
  const withdrawalsArr = blockJson.withdrawals ? { withdrawals: blockJson.withdrawals } : {}

  const executionPayload: ExecutionPayload = {
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
    excessDataGas: header.excessDataGas,
    blockHash: bufferToHex(block.hash()),
    prevRandao: header.mixHash!,
    transactions,
    ...withdrawalsArr,
  }
  return { executionPayload, blockValue: bigIntToHex(value) }
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
  payload: ExecutionPayload,
  chain: Chain
): Promise<{ block?: Block; error?: PayloadStatusV1 }> => {
  const {
    blockNumber: number,
    receiptsRoot: receiptTrie,
    prevRandao: mixHash,
    feeRecipient: coinbase,
    transactions,
    withdrawals: withdrawalsData,
    timestamp,
  } = payload
  const { config } = chain
  const common = config.chainCommon.copy()

  // This is a post merge block, so set its common accordingly
  const ttd = common.hardforkTTD(Hardfork.Merge)
  common.setHardforkByBlockNumber(number, ttd !== null ? ttd : undefined, timestamp)

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

  const transactionsTrie = await Block.genTransactionsTrieRoot(txs)
  const withdrawals = withdrawalsData?.map((wData) => Withdrawal.fromWithdrawalData(wData))
  const withdrawalsRoot = withdrawals ? await Block.genWithdrawalsTrieRoot(withdrawals) : undefined
  const header: HeaderData = {
    ...payload,
    number,
    receiptTrie,
    transactionsTrie,
    withdrawalsRoot,
    mixHash,
    coinbase,
  }

  let block: Block
  try {
    // we are not setting hardforkByBlockNumber or hardforkByTTD as common is already
    // correctly set to the correct hf
    block = Block.fromBlockData({ header, transactions: txs, withdrawals }, { common })
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

const getPayloadBody = (block: Block): ExecutionPayloadBodyV1 => {
  const transactions = block.transactions.map((tx) => bufferToHex(tx.serialize()))
  const withdrawals = block.withdrawals?.map((wt) => wt.toJSON()) ?? null

  return {
    transactions,
    withdrawals,
  }
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

  private lastNewPayloadHF: string = ''
  private lastForkchoiceUpdatedHF: string = ''

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
        [validators.object(executionPayloadV1FieldValidators)],
      ]),
      ([payload], response) => this.connectionManager.lastNewPayload({ payload, response })
    )

    this.newPayloadV2 = cmMiddleware(
      middleware(this.newPayloadV2.bind(this), 1, [
        [
          validators.either(
            validators.object(executionPayloadV1FieldValidators),
            validators.object(executionPayloadV2FieldValidators)
          ),
        ],
      ]),
      ([payload], response) => this.connectionManager.lastNewPayload({ payload, response })
    )

    this.newPayloadV3 = cmMiddleware(
      middleware(this.newPayloadV3.bind(this), 1, [
        [
          validators.either(
            validators.object(executionPayloadV1FieldValidators),
            validators.object(executionPayloadV2FieldValidators),
            validators.object(executionPayloadV3FieldValidators)
          ),
        ],
      ]),
      ([payload], response) => this.connectionManager.lastNewPayload({ payload, response })
    )

    const forkchoiceUpdatedResponseCMHandler = (
      [state]: ForkchoiceStateV1[],
      response?: ForkchoiceResponseV1 & { headBlock?: Block },
      error?: string
    ) => {
      this.connectionManager.lastForkchoiceUpdate({
        state,
        response,
        headBlock: response?.headBlock,
        error,
      })
      // Remove the headBlock from the response object as headBlock is bundled only for connectionManager
      delete response?.headBlock
    }

    this.forkchoiceUpdatedV1 = cmMiddleware(
      middleware(this.forkchoiceUpdatedV1.bind(this), 1, [
        [validators.object(forkchoiceFieldValidators)],
        [validators.optional(validators.object(payloadAttributesFieldValidatorsV1))],
      ]),
      forkchoiceUpdatedResponseCMHandler
    )

    this.forkchoiceUpdatedV2 = cmMiddleware(
      middleware(this.forkchoiceUpdatedV2.bind(this), 1, [
        [validators.object(forkchoiceFieldValidators)],
        [validators.optional(validators.object(payloadAttributesFieldValidatorsV2))],
      ]),
      forkchoiceUpdatedResponseCMHandler
    )

    this.getPayloadV1 = cmMiddleware(
      middleware(this.getPayloadV1.bind(this), 1, [[validators.bytes8]]),
      () => this.connectionManager.updateStatus()
    )

    this.getPayloadV2 = cmMiddleware(
      middleware(this.getPayloadV2.bind(this), 1, [[validators.bytes8]]),
      () => this.connectionManager.updateStatus()
    )

    this.getPayloadV3 = cmMiddleware(
      middleware(this.getPayloadV3.bind(this), 1, [[validators.bytes8]]),
      () => this.connectionManager.updateStatus()
    )

    this.exchangeTransitionConfigurationV1 = cmMiddleware(
      middleware(this.exchangeTransitionConfigurationV1.bind(this), 1, [
        [
          validators.object({
            terminalTotalDifficulty: validators.uint256,
            terminalBlockHash: validators.bytes32,
            terminalBlockNumber: validators.uint64,
          }),
        ],
      ]),
      () => this.connectionManager.updateStatus()
    )

    this.getBlobsBundleV1 = cmMiddleware(
      middleware(this.getBlobsBundleV1.bind(this), 1, [[validators.bytes8]]),
      () => this.connectionManager.updateStatus()
    )

    this.exchangeCapabilities = cmMiddleware(
      middleware(this.exchangeCapabilities.bind(this), 0, []),
      () => this.connectionManager.updateStatus()
    )

    this.getPayloadBodiesByHashV1 = cmMiddleware(
      middleware(this.getPayloadBodiesByHashV1.bind(this), 1, [
        [validators.array(validators.bytes32)],
      ]),
      () => this.connectionManager.updateStatus()
    )

    this.getPayloadBodiesByRangeV1 = cmMiddleware(
      middleware(this.getPayloadBodiesByRangeV1.bind(this), 2, [
        [validators.bytes8],
        [validators.bytes8],
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
  private async newPayload(params: [ExecutionPayload]): Promise<PayloadStatusV1> {
    const [payload] = params
    if (this.config.synchronized) {
      this.connectionManager.newPayloadLog()
    }
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

    this.connectionManager.updatePayloadStats(block)

    const hardfork = block._common.hardfork()
    if (hardfork !== this.lastNewPayloadHF && this.lastNewPayloadHF !== '') {
      this.config.logger.info(
        `Hardfork change along new payload block number=${block.header.number} hash=${short(
          block.hash()
        )} old=${this.lastNewPayloadHF} new=${hardfork}`
      )
    }
    this.lastNewPayloadHF = hardfork

    // This optimistic lookup keeps skeleton updated even if for e.g. beacon sync might not have
    // been initialized here but a batch of blocks new payloads arrive, most likely during sync
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

    this.remoteBlocks.set(block.hash().toString('hex'), block)

    const response = {
      status: Status.VALID,
      latestValidHash: bufferToHex(block.hash()),
      validationError: null,
    }
    return response
  }

  async newPayloadV1(params: [ExecutionPayloadV1]): Promise<PayloadStatusV1> {
    return this.newPayload(params)
  }

  async newPayloadV2(params: [ExecutionPayloadV2 | ExecutionPayloadV1]): Promise<PayloadStatusV1> {
    const shanghaiTimestamp = this.chain.config.chainCommon.hardforkTimestamp(Hardfork.Shanghai)
    const withdrawals = (params[0] as ExecutionPayloadV2).withdrawals

    if (shanghaiTimestamp === null || parseInt(params[0].timestamp) < shanghaiTimestamp) {
      if (withdrawals !== undefined && withdrawals !== null) {
        throw {
          code: INVALID_PARAMS,
          message: 'ExecutionPayloadV1 MUST be used before Shanghai is activated',
        }
      }
    } else if (parseInt(params[0].timestamp) >= shanghaiTimestamp) {
      if (withdrawals === undefined || withdrawals === null) {
        throw {
          code: INVALID_PARAMS,
          message: 'ExecutionPayloadV2 MUST be used after Shanghai is activated',
        }
      }
    }
    const newPayload = await this.newPayload(params)
    if (newPayload.status === Status.INVALID_BLOCK_HASH) {
      newPayload.status = Status.INVALID
    }
    return newPayload
  }

  async newPayloadV3(
    params: [ExecutionPayloadV3 | ExecutionPayloadV2 | ExecutionPayloadV1]
  ): Promise<PayloadStatusV1> {
    const shanghaiTimestamp = this.chain.config.chainCommon.hardforkTimestamp(Hardfork.Shanghai)
    const eip4844Timestamp = this.chain.config.chainCommon.hardforkTimestamp(
      Hardfork.ShardingForkDev
    )
    if (shanghaiTimestamp === null || parseInt(params[0].timestamp) < shanghaiTimestamp) {
      if ('withdrawals' in params[0]) {
        throw {
          code: INVALID_PARAMS,
          message: 'ExecutionPayloadV1 MUST be used before Shanghai is activated',
        }
      }
    } else if (
      parseInt(params[0].timestamp) >= shanghaiTimestamp &&
      (eip4844Timestamp === null || parseInt(params[0].timestamp) < eip4844Timestamp)
    ) {
      if (!('extraDataGas' in params[0])) {
        throw {
          code: INVALID_PARAMS,
          message: 'ExecutionPayloadV2 MUST be used if Shanghai is activated and EIP-4844 is not',
        }
      }
    } else if (eip4844Timestamp === null || parseInt(params[0].timestamp) >= eip4844Timestamp) {
      if (!('extraData' in params[0])) {
        throw {
          code: INVALID_PARAMS,
          message: 'ExecutionPayloadV3 MUST be used after EIP-4844 is activated',
        }
      }
    }
    const newPayload = await this.newPayload(params)
    if (newPayload.status === Status.INVALID_BLOCK_HASH) {
      newPayload.status = Status.INVALID
    }
    return newPayload
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
  private async forkchoiceUpdated(
    params: [forkchoiceState: ForkchoiceStateV1, payloadAttributes: PayloadAttributes | undefined]
  ): Promise<ForkchoiceResponseV1 & { headBlock?: Block }> {
    const { headBlockHash, finalizedBlockHash, safeBlockHash } = params[0]
    const payloadAttributes = params[1]

    if (this.config.synchronized) {
      this.connectionManager.newForkchoiceLog()
    }

    // It is possible that newPayload didn't start beacon sync as the payload it was asked to
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

    const hardfork = headBlock._common.hardfork()
    if (hardfork !== this.lastForkchoiceUpdatedHF && this.lastForkchoiceUpdatedHF !== '') {
      this.config.logger.info(
        `Hardfork change along forkchoice head block update number=${
          headBlock.header.number
        } hash=${short(headBlock.hash())} old=${this.lastForkchoiceUpdatedHF} new=${hardfork}`
      )
    }
    this.lastForkchoiceUpdatedHF = hardfork

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

      const isPrevSynced = this.chain.config.synchronized
      this.config.updateSynchronizedState(headBlock.header)
      if (!isPrevSynced && this.chain.config.synchronized) {
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
      const { timestamp, prevRandao, suggestedFeeRecipient, withdrawals } = payloadAttributes
      const payloadId = await this.pendingBlock.start(
        await this.vm.copy(),
        headBlock,
        {
          timestamp,
          mixHash: prevRandao,
          coinbase: suggestedFeeRecipient,
        },
        withdrawals
      )
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

  private async forkchoiceUpdatedV1(
    params: [forkchoiceState: ForkchoiceStateV1, payloadAttributes: PayloadAttributesV1 | undefined]
  ): Promise<ForkchoiceResponseV1 & { headBlock?: Block }> {
    return this.forkchoiceUpdated(params)
  }

  private async forkchoiceUpdatedV2(
    params: [
      forkchoiceState: ForkchoiceStateV1,
      payloadAttributes: PayloadAttributesV1 | PayloadAttributesV2 | undefined
    ]
  ): Promise<ForkchoiceResponseV1 & { headBlock?: Block }> {
    const payloadAttributes = params[1]
    if (payloadAttributes !== undefined && payloadAttributes !== null) {
      const shanghaiTimestamp = this.chain.config.chainCommon.hardforkTimestamp(Hardfork.Shanghai)
      const ts = BigInt(payloadAttributes.timestamp)
      const withdrawals = (payloadAttributes as PayloadAttributesV2).withdrawals
      if (withdrawals !== undefined && withdrawals !== null) {
        if (ts < shanghaiTimestamp!) {
          throw {
            code: INVALID_PARAMS,
            message: 'PayloadAttributesV1 MUST be used before Shanghai is activated',
          }
        }
      } else {
        if (ts >= shanghaiTimestamp!) {
          throw {
            code: INVALID_PARAMS,
            message: 'PayloadAttributesV2 MUST be used after Shanghai is activated',
          }
        }
      }
    }

    return this.forkchoiceUpdated(params)
  }

  /**
   * Given payloadId, returns the most recent version of an execution payload
   * that is available by the time of the call or responds with an error.
   *
   * @param params An array of one parameter:
   *   1. payloadId: DATA, 8 bytes - identifier of the payload building process
   * @returns Instance of {@link ExecutionPayloadV1} or an error
   */
  private async getPayload(params: [Bytes8]) {
    const payloadId = toBuffer(params[0])
    try {
      const built = await this.pendingBlock.build(payloadId)
      if (!built) {
        throw EngineError.UnknownPayload
      }
      // The third arg returned is the minerValue which we will use to
      // value the block
      const [block, receipts, value] = built
      await this.execution.runWithoutSetHead({ block }, receipts)
      return blockToExecutionPayload(block, value)
    } catch (error: any) {
      if (error === EngineError.UnknownPayload) throw error
      throw {
        code: INTERNAL_ERROR,
        message: error.message ?? error,
      }
    }
  }

  async getPayloadV1(params: [Bytes8]) {
    const { executionPayload } = await this.getPayload(params)
    return executionPayload
  }

  async getPayloadV2(params: [Bytes8]) {
    return this.getPayload(params)
  }

  async getPayloadV3(params: [Bytes8]) {
    return this.getPayload(params)
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

  /**
   *
   * @param params a payloadId for a pending block
   * @returns a BlobsBundle consisting of the blockhash, the blobs, and the corresponding kzg commitments
   */
  private async getBlobsBundleV1(params: [Bytes8]): Promise<BlobsBundleV1> {
    const payloadId = params[0]

    const bundle = this.pendingBlock.blobBundles.get(payloadId)
    if (bundle === undefined) {
      throw EngineError.UnknownPayload
    }

    return {
      blockHash: bundle.blockHash,
      kzgs: bundle.kzgCommitments.map((commitment) => '0x' + commitment.toString('hex')),
      blobs: bundle.blobs.map((blob) => '0x' + blob.toString('hex')),
    }
  }

  /**
   * Returns a list of engine API endpoints supported by the client
   */
  private exchangeCapabilities(_params: []): string[] {
    const caps = Object.getOwnPropertyNames(Engine.prototype)
    const engineMethods = caps.filter((el) => el !== 'constructor' && el !== 'exchangeCapabilities')
    return engineMethods.map((el) => 'engine_' + el)
  }

  /**
   *
   * @param params a list of block hashes as hex prefixed strings
   * @returns an array of ExecutionPayloadBodyV1 objects or null if a given execution payload isn't stored locally
   */
  private async getPayloadBodiesByHashV1(
    params: [[Bytes32]]
  ): Promise<(ExecutionPayloadBodyV1 | null)[]> {
    if (params[0].length > 32) {
      throw {
        code: TOO_LARGE_REQUEST,
        message: 'More than 32 execution payload bodies requested',
      }
    }
    const hashes = params[0].map((hash) => toBuffer(hash))
    const blocks: (ExecutionPayloadBodyV1 | null)[] = []
    for (const hash of hashes) {
      try {
        const block = await this.chain.getBlock(hash)
        const payloadBody = getPayloadBody(block)
        blocks.push(payloadBody)
      } catch {
        blocks.push(null)
      }
    }
    return blocks
  }

  /**
   *
   * @param params an array of 2 parameters
   *    1.  start: Bytes8 - the first block in the range
   *    2.  count: Bytes8 - the number of blocks requested
   * @returns an array of ExecutionPayloadBodyV1 objects or null if a given execution payload isn't stored locally
   */
  private async getPayloadBodiesByRangeV1(
    params: [Bytes8, Bytes8]
  ): Promise<(ExecutionPayloadBodyV1 | null)[]> {
    const start = BigInt(params[0])
    let count = BigInt(params[1])
    if (count > BigInt(32)) {
      throw {
        code: TOO_LARGE_REQUEST,
        message: 'More than 32 execution payload bodies requested',
      }
    }

    if (count < BigInt(1) || start < BigInt(1)) {
      throw {
        code: INVALID_PARAMS,
        message: 'Start and Count parameters cannot be less than 1',
      }
    }
    const currentChainHeight = this.chain.headers.height
    if (start > currentChainHeight) {
      return []
    }

    if (start + count > currentChainHeight) {
      count = currentChainHeight - start + BigInt(1)
    }
    const blocks = await this.chain.getBlocks(start, Number(count))
    const payloads: (ExecutionPayloadBodyV1 | null)[] = []
    for (const block of blocks) {
      try {
        const payloadBody = getPayloadBody(block)
        payloads.push(payloadBody)
      } catch {
        payloads.push(null)
      }
    }
    return payloads
  }
}
