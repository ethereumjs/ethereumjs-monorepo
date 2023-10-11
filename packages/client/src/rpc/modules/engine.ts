import { Block } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import {
  BIGINT_0,
  BIGINT_1,
  bigIntToHex,
  bytesToHex,
  bytesToUnprefixedHex,
  equalsBytes,
  hexToBytes,
  toBytes,
  zeros,
} from '@ethereumjs/util'

import { PendingBlock } from '../../miner'
import { short } from '../../util'
import {
  INTERNAL_ERROR,
  INVALID_PARAMS,
  TOO_LARGE_REQUEST,
  UNKNOWN_PAYLOAD,
  UNSUPPORTED_FORK,
  validEngineCodes,
} from '../error-code'
import { CLConnectionManager, middleware as cmMiddleware } from '../util/CLConnectionManager'
import { middleware, validators } from '../validation'

import type { Chain } from '../../blockchain'
import type { EthereumClient } from '../../client'
import type { Config } from '../../config'
import type { VMExecution } from '../../execution'
import type { BlobsBundle } from '../../miner'
import type { FullEthereumService, Skeleton } from '../../service'
import type { ExecutionPayload } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import type { VM } from '@ethereumjs/vm'

const zeroBlockHash = zeros(32)

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
type Uint64 = string
type Uint256 = string

type WithdrawalV1 = Exclude<ExecutionPayload['withdrawals'], undefined>[number]

// ExecutionPayload has higher version fields as optionals to make it easy for typescript
export type ExecutionPayloadV1 = ExecutionPayload
export type ExecutionPayloadV2 = ExecutionPayloadV1 & { withdrawals: WithdrawalV1[] }
// parentBeaconBlockRoot comes separate in new payloads and needs to be added to payload data
export type ExecutionPayloadV3 = ExecutionPayloadV2 & { excessBlobGas: Uint64; blobGasUsed: Uint64 }

export type ForkchoiceStateV1 = {
  headBlockHash: Bytes32
  safeBlockHash: Bytes32
  finalizedBlockHash: Bytes32
}

// PayloadAttributes has higher version fields as optionals to make it easy for typescript
type PayloadAttributes = {
  timestamp: Uint64
  prevRandao: Bytes32
  suggestedFeeRecipient: Bytes20
  // add higher version fields as optionals to make it easy for typescript
  withdrawals?: WithdrawalV1[]
  parentBeaconBlockRoot?: Bytes32
}

type PayloadAttributesV1 = Omit<PayloadAttributes, 'withdrawals' | 'parentBeaconBlockRoot'>
type PayloadAttributesV2 = PayloadAttributesV1 & { withdrawals: WithdrawalV1[] }
type PayloadAttributesV3 = PayloadAttributesV2 & { parentBeaconBlockRoot: Bytes32 }

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
  commitments: Bytes48[]
  blobs: Blob[]
  proofs: Bytes48[]
}

type ExecutionPayloadBodyV1 = {
  transactions: string[]
  withdrawals: WithdrawalV1[] | null
}

type ChainCache = {
  remoteBlocks: Map<String, Block>
  executedBlocks: Map<String, Block>
  invalidBlocks: Map<String, Error>
  skeleton: Skeleton
}

const EngineError = {
  UnknownPayload: {
    code: UNKNOWN_PAYLOAD,
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
  blobGasUsed: validators.uint64,
  excessBlobGas: validators.uint64,
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
  // withdrawals is optional in V2 because its backward forward compatible with V1
  withdrawals: validators.optional(validators.array(validators.withdrawal())),
}
const payloadAttributesFieldValidatorsV3 = {
  ...payloadAttributesFieldValidatorsV1,
  withdrawals: validators.array(validators.withdrawal()),
  parentBeaconBlockRoot: validators.bytes32,
}
/**
 * Formats a block to {@link ExecutionPayloadV1}.
 */
export const blockToExecutionPayload = (block: Block, value: bigint, bundle?: BlobsBundle) => {
  const blockJson = block.toJSON()
  const header = blockJson.header!
  const transactions = block.transactions.map((tx) => bytesToHex(tx.serialize())) ?? []
  const withdrawalsArr = blockJson.withdrawals ? { withdrawals: blockJson.withdrawals } : {}
  const blobsBundle: BlobsBundleV1 | undefined = bundle
    ? {
        commitments: bundle.commitments.map(bytesToHex),
        blobs: bundle.blobs.map(bytesToHex),
        proofs: bundle.proofs.map(bytesToHex),
      }
    : undefined

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
    blobGasUsed: header.blobGasUsed,
    excessBlobGas: header.excessBlobGas,
    blockHash: bytesToHex(block.hash()),
    prevRandao: header.mixHash!,
    transactions,
    ...withdrawalsArr,
  }

  // ethereumjs doesnot provide any transaction censoring detection (yet) to suggest
  // overriding builder/mev-boost blocks
  const shouldOverrideBuilder = false
  return { executionPayload, blockValue: bigIntToHex(value), blobsBundle, shouldOverrideBuilder }
}

const pruneCachedBlocks = (chain: Chain, chainCache: ChainCache) => {
  const { remoteBlocks, executedBlocks, invalidBlocks } = chainCache
  const finalized = chain.blocks.finalized
  if (finalized !== null) {
    // prune remoteBlocks
    const pruneRemoteBlocksTill = finalized.header.number
    for (const blockHash of remoteBlocks.keys()) {
      const block = remoteBlocks.get(blockHash)
      if (block !== undefined && block.header.number <= pruneRemoteBlocksTill) {
        remoteBlocks.delete(blockHash)
      }
    }

    // prune executedBlocks
    const vm = chain.blocks.vm
    if (vm !== null) {
      const pruneExecutedBlocksTill =
        vm.header.number < finalized.header.number ? vm.header.number : finalized.header.number
      for (const blockHash of executedBlocks.keys()) {
        const block = executedBlocks.get(blockHash)
        if (block !== undefined && block.header.number <= pruneExecutedBlocksTill) {
          executedBlocks.delete(blockHash)
        }
      }
    }

    // prune invalidBlocks with some max length
    const pruneInvalidLength = invalidBlocks.size - chain.config.maxInvalidBlocksErrorCache
    let pruned = 0
    for (const blockHash of invalidBlocks.keys()) {
      if (pruned >= pruneInvalidLength) {
        break
      }
      invalidBlocks.delete(blockHash)
      pruned++
    }
  }
}

/**
 * Recursively finds parent blocks starting from the parentHash.
 */
const recursivelyFindParents = async (
  vmHeadHash: Uint8Array,
  parentHash: Uint8Array,
  chain: Chain
) => {
  if (equalsBytes(parentHash, vmHeadHash) || equalsBytes(parentHash, new Uint8Array(32))) {
    return []
  }
  const maxDepth = chain.config.engineParentLookupMaxDepth

  const parentBlocks = []
  const block = await chain.getBlock(parentHash)
  parentBlocks.push(block)

  while (!equalsBytes(parentBlocks[parentBlocks.length - 1].hash(), vmHeadHash)) {
    const block: Block = await chain.getBlock(
      parentBlocks[parentBlocks.length - 1].header.parentHash
    )
    parentBlocks.push(block)

    if (block.isGenesis()) {
      // In case we hit the genesis block we should stop finding additional parents
      break
    }

    // throw error if lookups have exceeded maxDepth
    if (parentBlocks.length > maxDepth) {
      throw Error(`recursivelyFindParents lookups deeper than maxDepth=${maxDepth}`)
    }
  }
  return parentBlocks.reverse()
}

/**
 * Returns the block hash as a 0x-prefixed hex string if found valid in the blockchain, otherwise returns null.
 */
const validExecutedChainBlock = async (
  blockOrHash: Uint8Array | Block,
  chain: Chain
): Promise<Block | null> => {
  try {
    const block = blockOrHash instanceof Block ? blockOrHash : await chain.getBlock(blockOrHash)
    const vmHead = await chain.blockchain.getIteratorHead()

    if (vmHead.header.number >= block.header.number) {
      // check if block is canonical
      const canonicalHash = await chain.blockchain.safeNumberToHash(block.header.number)
      if (canonicalHash instanceof Uint8Array && equalsBytes(block.hash(), canonicalHash)) {
        return block
      }
    }

    // if the block was canonical and executed we would have returned by now
    return null
  } catch (error: any) {
    return null
  }
}

/**
 * Returns the block hash as a 0x-prefixed hex string if found valid in the blockchain, otherwise returns null.
 */
const validHash = async (
  hash: Uint8Array,
  chain: Chain,
  chainCache: ChainCache
): Promise<string | null> => {
  const { remoteBlocks, executedBlocks, invalidBlocks, skeleton } = chainCache
  const maxDepth = chain.config.engineParentLookupMaxDepth

  try {
    let validParent: Block | null = null
    for (let inspectedParents = 0; inspectedParents < maxDepth; inspectedParents++) {
      const unPrefixedHashStr = bytesToUnprefixedHex(hash)
      validParent =
        remoteBlocks.get(unPrefixedHashStr) ??
        (await skeleton.getBlockByHash(hash, true)) ??
        (await chain.getBlock(hash))

      // if block is invalid throw error and respond with null validHash
      if (invalidBlocks.get(unPrefixedHashStr) !== undefined) {
        throw Error(`References an invalid ancestor`)
      }

      // if block is executed the return with this hash
      const isBlockExecuted =
        (executedBlocks.get(unPrefixedHashStr) ?? (await validExecutedChainBlock(hash, chain))) !==
        null
      if (isBlockExecuted) {
        return bytesToHex(hash)
      } else {
        hash = validParent.header.parentHash
      }
    }
  } catch (_error: any) {
    // ignore error thrown by the loop and return null below
  }

  // if we are here, either we can't find valid parent till maxDepth or the ancestor was invalid
  // or there was a lookup error. in all these instances return null
  return null
}

/**
 * Validates that the block satisfies post-merge conditions.
 */
const validateTerminalBlock = async (block: Block, chain: Chain): Promise<boolean> => {
  const ttd = chain.config.chainCommon.hardforkTTD(Hardfork.Paris)
  if (ttd === null) return false
  const blockTd = await chain.getTd(block.hash(), block.header.number)

  // Block is terminal if its td >= ttd and its parent td < ttd.
  // In case the Genesis block has td >= ttd it is the terminal block
  if (block.isGenesis()) return blockTd >= ttd

  const parentBlockTd = await chain.getTd(block.header.parentHash, block.header.number - BIGINT_1)
  return blockTd >= ttd && parentBlockTd < ttd
}

/**
 * Returns a block from a payload.
 * If errors, returns {@link PayloadStatusV1}
 */
const assembleBlock = async (
  payload: ExecutionPayload,
  chain: Chain,
  chainCache: ChainCache
): Promise<{ block?: Block; error?: PayloadStatusV1 }> => {
  const { blockNumber, timestamp } = payload
  const { config } = chain
  const common = config.chainCommon.copy()

  // This is a post merge block, so set its common accordingly
  // Can't use setHardfork flag, as the transactions will need to be deserialized
  // first before the header can be constucted with their roots
  const ttd = common.hardforkTTD(Hardfork.Paris)
  common.setHardforkBy({ blockNumber, td: ttd !== null ? ttd : undefined, timestamp })

  try {
    const block = await Block.fromExecutionPayload(payload, { common })
    // TODO: validateData is also called in applyBlock while runBlock, may be it can be optimized
    // by removing/skipping block data validation from there
    await block.validateData()
    return { block }
  } catch (error) {
    const validationError = `Error assembling block from payload: ${error}`
    config.logger.error(validationError)
    const latestValidHash = await validHash(hexToBytes(payload.parentHash), chain, chainCache)
    const response = {
      status: `${error}`.includes('Invalid blockHash') ? Status.INVALID_BLOCK_HASH : Status.INVALID,
      latestValidHash,
      validationError,
    }
    return { error: response }
  }
}

const getPayloadBody = (block: Block): ExecutionPayloadBodyV1 => {
  const transactions = block.transactions.map((tx) => bytesToHex(tx.serialize()))
  const withdrawals = block.withdrawals?.map((wt) => wt.toJSON()) ?? null

  return {
    transactions,
    withdrawals,
  }
}

function validateHardforkRange(
  chainCommon: Common,
  methodVersion: number,
  checkNotBeforeHf: Hardfork | null,
  checkNotAfterHf: Hardfork | null,
  timestamp: bigint
) {
  if (checkNotBeforeHf !== null) {
    const hfTimeStamp = chainCommon.hardforkTimestamp(checkNotBeforeHf)
    if (hfTimeStamp !== null && timestamp < hfTimeStamp) {
      throw {
        code: UNSUPPORTED_FORK,
        message: `V${methodVersion} cannot be called pre-${checkNotBeforeHf}`,
      }
    }
  }

  if (checkNotAfterHf !== null) {
    const nextHFTimestamp = chainCommon.nextHardforkBlockOrTimestamp(checkNotAfterHf)
    if (nextHFTimestamp !== null && timestamp >= nextHFTimestamp) {
      throw {
        code: UNSUPPORTED_FORK,
        message: `V${methodVersion + 1} MUST be called post-${checkNotAfterHf}`,
      }
    }
  }
}

/**
 * engine_* RPC module
 * @memberof module:rpc/modules
 */
export class Engine {
  private client: EthereumClient
  private execution: VMExecution
  private skeleton: Skeleton
  private service: FullEthereumService
  private chain: Chain
  private config: Config
  private vm: VM
  private pendingBlock: PendingBlock

  private connectionManager: CLConnectionManager

  private lastNewPayloadHF: string = ''
  private lastForkchoiceUpdatedHF: string = ''

  private remoteBlocks: Map<String, Block>
  private executedBlocks: Map<String, Block>
  private invalidBlocks: Map<String, Error>
  private chainCache: ChainCache

  private lastAnnouncementTime = Date.now()
  private lastAnnouncementStatus = ''

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

    if (this.service.skeleton === undefined) {
      throw Error('skeleton required for engine module')
    }
    this.skeleton = this.service.skeleton

    const logELStatus = () => {
      const forceShowInfo = Date.now() - this.lastAnnouncementTime > 6_000
      if (forceShowInfo) {
        this.lastAnnouncementTime = Date.now()
      }
      const fetcher = this.service.beaconSync?.fetcher

      this.lastAnnouncementStatus = this.skeleton.logSyncStatus('[ EL ]', {
        forceShowInfo,
        lastStatus: this.lastAnnouncementStatus,
        executing: this.execution.started && this.execution.running,
        fetching: fetcher !== undefined && fetcher !== null && fetcher.syncErrored === undefined,
        peers: (this.service.beaconSync as any)?.pool.size,
      })
    }

    this.connectionManager = new CLConnectionManager({
      config: this.chain.config,
      inActivityCb: logELStatus,
    })
    this.pendingBlock = new PendingBlock({ config: this.config, txPool: this.service.txPool })

    this.remoteBlocks = new Map()
    this.executedBlocks = new Map()
    this.invalidBlocks = new Map()
    this.chainCache = {
      remoteBlocks: this.remoteBlocks,
      executedBlocks: this.executedBlocks,
      invalidBlocks: this.invalidBlocks,
      skeleton: this.skeleton,
    }

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
      middleware(
        this.newPayloadV3.bind(this),
        3,
        [
          [validators.object(executionPayloadV3FieldValidators)],
          [validators.array(validators.bytes32)],
          [validators.bytes32],
        ],
        ['executionPayload', 'blobVersionedHashes', 'parentBeaconBlockRoot']
      ),
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
      logELStatus()
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
    this.forkchoiceUpdatedV3 = cmMiddleware(
      middleware(this.forkchoiceUpdatedV3.bind(this), 1, [
        [validators.object(forkchoiceFieldValidators)],
        [validators.optional(validators.object(payloadAttributesFieldValidatorsV3))],
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
  private async newPayload(
    params: [ExecutionPayload, (Bytes32[] | null)?, (Bytes32 | null)?]
  ): Promise<PayloadStatusV1> {
    const [payload, blobVersionedHashes, parentBeaconBlockRoot] = params
    if (this.config.synchronized) {
      this.connectionManager.newPayloadLog()
    }
    const { parentHash, blockHash } = payload

    // we can be strict and return with invalid if this block was previous invalidated in
    // invalidBlocks cache, but to have a more robust behavior instead:
    //
    // we remove this block from invalidBlocks for it to be evaluated again against the
    // new data/corrections the CL might be calling newPayload with
    this.invalidBlocks.delete(blockHash.slice(2))

    // newpayloadv3 comes with parentBeaconBlockRoot out of the payload
    const { block: headBlock, error } = await assembleBlock(
      {
        ...payload,
        // ExecutionPayload only handles undefined
        parentBeaconBlockRoot: parentBeaconBlockRoot ?? undefined,
      },
      this.chain,
      this.chainCache
    )
    if (headBlock === undefined || error !== undefined) {
      let response = error
      if (!response) {
        const validationError = `Error assembling block during init`
        this.config.logger.debug(validationError)
        const latestValidHash = await validHash(hexToBytes(parentHash), this.chain, this.chainCache)
        response = { status: Status.INVALID, latestValidHash, validationError }
      }
      // skip marking the block invalid as this is more of a data issue from CL
      return response
    }

    if (headBlock.common.isActivatedEIP(4844)) {
      let validationError: string | null = null
      if (blobVersionedHashes === undefined || blobVersionedHashes === null) {
        validationError = `Error verifying blobVersionedHashes: received none`
      } else {
        // Collect versioned hashes in the flat array `txVersionedHashes` to match with received
        const txVersionedHashes = []
        for (const tx of headBlock.transactions) {
          if (tx instanceof BlobEIP4844Transaction) {
            for (const vHash of tx.blobVersionedHashes) {
              txVersionedHashes.push(vHash)
            }
          }
        }

        if (blobVersionedHashes.length !== txVersionedHashes.length) {
          validationError = `Error verifying blobVersionedHashes: expected=${txVersionedHashes.length} received=${blobVersionedHashes.length}`
        } else {
          // match individual hashes
          for (let vIndex = 0; vIndex < blobVersionedHashes.length; vIndex++) {
            // if mismatch, record error and break
            if (!equalsBytes(hexToBytes(blobVersionedHashes[vIndex]), txVersionedHashes[vIndex])) {
              validationError = `Error verifying blobVersionedHashes: mismatch at index=${vIndex} expected=${short(
                txVersionedHashes[vIndex]
              )} received=${short(blobVersionedHashes[vIndex])}`
              break
            }
          }
        }
      }

      // if there was a validation error return invalid
      if (validationError !== null) {
        this.config.logger.debug(validationError)
        const latestValidHash = await validHash(hexToBytes(parentHash), this.chain, this.chainCache)
        const response = { status: Status.INVALID, latestValidHash, validationError }
        // skip marking the block invalid as this is more of a data issue from CL
        return response
      }
    } else if (blobVersionedHashes !== undefined && blobVersionedHashes !== null) {
      const validationError = `Invalid blobVersionedHashes before EIP-4844 is activated`
      const latestValidHash = await validHash(hexToBytes(parentHash), this.chain, this.chainCache)
      const response = { status: Status.INVALID, latestValidHash, validationError }
      // skip marking the block invalid as this is more of a data issue from CL
      return response
    }

    this.connectionManager.updatePayloadStats(headBlock)

    const hardfork = headBlock.common.hardfork()
    if (hardfork !== this.lastNewPayloadHF && this.lastNewPayloadHF !== '') {
      this.config.logger.info(
        `Hardfork change along new payload block number=${headBlock.header.number} hash=${short(
          headBlock.hash()
        )} old=${this.lastNewPayloadHF} new=${hardfork}`
      )
    }
    this.lastNewPayloadHF = hardfork

    // get the parent from beacon skeleton or from remoteBlocks cache or from the chain
    // to run basic validations based on parent
    try {
      const parent =
        (await this.skeleton.getBlockByHash(hexToBytes(parentHash), true)) ??
        this.remoteBlocks.get(parentHash.slice(2)) ??
        (await this.chain.getBlock(hexToBytes(parentHash)))

      // Validations with parent
      if (!parent.common.gteHardfork(Hardfork.Paris)) {
        const validTerminalBlock = await validateTerminalBlock(parent, this.chain)
        if (!validTerminalBlock) {
          const response = {
            status: Status.INVALID,
            validationError: null,
            latestValidHash: bytesToHex(zeros(32)),
          }
          this.invalidBlocks.set(
            blockHash.slice(2),
            new Error(response.validationError ?? 'Terminal block validation failed')
          )
          return response
        }
      }

      // validate 4844 transactions and fields as these validations generally happen on putBlocks
      // when parent is confirmed to be in the chain. But we can do it here early
      if (headBlock.common.isActivatedEIP(4844)) {
        try {
          headBlock.validateBlobTransactions(parent.header)
        } catch (error: any) {
          const validationError = `Invalid 4844 transactions: ${error}`
          const latestValidHash = await validHash(
            hexToBytes(parentHash),
            this.chain,
            this.chainCache
          )
          const response = { status: Status.INVALID, latestValidHash, validationError }
          // skip marking the block invalid as this is more of a data issue from CL
          return response
        }
      }

      const executedParentExists =
        this.executedBlocks.get(parentHash.slice(2)) ??
        (await validExecutedChainBlock(hexToBytes(parentHash), this.chain))
      // If the parent is not executed throw an error, it will be caught and return SYNCING or ACCEPTED.
      if (!executedParentExists) {
        throw new Error(`Parent block not yet executed number=${parent.header.number}`)
      }
    } catch (error: any) {
      // Stash the block for a potential forced forkchoice update to it later.
      this.remoteBlocks.set(bytesToUnprefixedHex(headBlock.hash()), headBlock)

      const optimisticLookup = !(await this.skeleton.setHead(headBlock, false))
      const status =
        // If the transitioned to beacon sync and this block can extend beacon chain then
        optimisticLookup === true ? Status.SYNCING : Status.ACCEPTED
      const response = { status, validationError: null, latestValidHash: null }
      return response
    }

    // This optimistic lookup keeps skeleton updated even if for e.g. beacon sync might not have
    // been initialized here but a batch of blocks new payloads arrive, most likely during sync
    // We still can't switch to beacon sync here especially if the chain is pre merge and there
    // is pow block which this client would like to mint and attempt proposing it
    //
    // Call skeleton.setHead without forcing head change to return if the block is reorged or not
    // Do optimistic lookup if not reorged
    const optimisticLookup = !(await this.skeleton.setHead(headBlock, false))
    this.remoteBlocks.set(bytesToUnprefixedHex(headBlock.hash()), headBlock)

    // we should check if the block exists executed in remoteBlocks or in chain as a check since stateroot
    // exists in statemanager is not sufficient because an invalid crafted block with valid block hash with
    // some pre-executed stateroot can be sent
    const executedBlockExists =
      this.executedBlocks.get(blockHash.slice(2)) ??
      (await validExecutedChainBlock(hexToBytes(blockHash), this.chain))
    if (executedBlockExists) {
      const response = {
        status: Status.VALID,
        latestValidHash: blockHash,
        validationError: null,
      }
      return response
    }

    const vmHead = await this.chain.blockchain.getIteratorHead()
    let blocks: Block[]
    try {
      // find parents till vmHead but limit lookups till engineParentLookupMaxDepth
      blocks = await recursivelyFindParents(vmHead.hash(), headBlock.header.parentHash, this.chain)
    } catch (error) {
      const response = { status: Status.SYNCING, latestValidHash: null, validationError: null }
      return response
    }

    blocks.push(headBlock)

    let lastBlock: Block
    try {
      for (const [i, block] of blocks.entries()) {
        lastBlock = block
        const bHash = block.hash()
        const isBlockExecuted =
          (this.executedBlocks.get(bytesToUnprefixedHex(bHash)) ??
            (await validExecutedChainBlock(bHash, this.chain))) !== null

        if (!isBlockExecuted) {
          // Only execute
          //   i) if number of blocks pending to be executed are within limit
          //   ii) Txs to execute in blocking call is within the supported limit
          // else return SYNCING/ACCEPTED and let skeleton led chain execution catch up
          const executed =
            blocks.length - i <= this.chain.config.engineNewpayloadMaxExecute &&
            block.transactions.length <= this.chain.config.engineNewpayloadMaxTxsExecute
              ? await this.execution.runWithoutSetHead({
                  block,
                  root: (i > 0 ? blocks[i - 1] : await this.chain.getBlock(block.header.parentHash))
                    .header.stateRoot,
                  setHardfork: this.chain.headers.td,
                })
              : false

          // if can't be executed then return syncing/accepted
          if (!executed) {
            this.config.logger.debug(
              `Skipping block(s) execution for headBlock=${headBlock.header.number} hash=${short(
                headBlock.hash()
              )} : pendingBlocks=${blocks.length - i}(limit=${
                this.chain.config.engineNewpayloadMaxExecute
              }) transactions=${block.transactions.length}(limit=${
                this.chain.config.engineNewpayloadMaxTxsExecute
              }) executionBusy=${this.execution.running}`
            )
            // determind status to be returned depending on if block could extend chain or not
            const status = optimisticLookup === true ? Status.SYNCING : Status.ACCEPTED
            const response = { status, latestValidHash: null, validationError: null }
            return response
          } else {
            this.executedBlocks.set(bytesToUnprefixedHex(block.hash()), block)
          }
        }
      }
    } catch (error) {
      const errorMsg = `${error}`.toLowerCase()
      if (errorMsg.includes('block') && errorMsg.includes('not found')) {
        throw {
          code: INTERNAL_ERROR,
          message: errorMsg,
        }
      }
      const validationError = `Error verifying block while running: ${errorMsg}`
      this.config.logger.error(validationError)
      const latestValidHash = await validHash(
        headBlock.header.parentHash,
        this.chain,
        this.chainCache
      )
      const response = { status: Status.INVALID, latestValidHash, validationError }
      this.invalidBlocks.set(blockHash.slice(2), error as Error)
      this.remoteBlocks.delete(blockHash.slice(2))
      try {
        await this.chain.blockchain.delBlock(lastBlock!.hash())
        // eslint-disable-next-line no-empty
      } catch {}
      try {
        await this.skeleton.deleteBlock(lastBlock!)
        // eslint-disable-next-line no-empty
      } catch {}
      return response
    }

    const response = {
      status: Status.VALID,
      latestValidHash: bytesToHex(headBlock.hash()),
      validationError: null,
    }
    return response
  }

  async newPayloadV1(params: [ExecutionPayloadV1]): Promise<PayloadStatusV1> {
    const shanghaiTimestamp = this.chain.config.chainCommon.hardforkTimestamp(Hardfork.Shanghai)
    const ts = parseInt(params[0].timestamp)
    if (shanghaiTimestamp !== null && ts >= shanghaiTimestamp) {
      throw {
        code: INVALID_PARAMS,
        message: 'NewPayloadV2 MUST be used after Shanghai is activated',
      }
    }

    return this.newPayload(params)
  }

  async newPayloadV2(params: [ExecutionPayloadV2 | ExecutionPayloadV1]): Promise<PayloadStatusV1> {
    const shanghaiTimestamp = this.chain.config.chainCommon.hardforkTimestamp(Hardfork.Shanghai)
    const eip4844Timestamp = this.chain.config.chainCommon.hardforkTimestamp(Hardfork.Cancun)
    const ts = parseInt(params[0].timestamp)

    const withdrawals = (params[0] as ExecutionPayloadV2).withdrawals

    if (eip4844Timestamp !== null && ts >= eip4844Timestamp) {
      throw {
        code: INVALID_PARAMS,
        message: 'NewPayloadV3 MUST be used after Cancun is activated',
      }
    } else if (shanghaiTimestamp === null || parseInt(params[0].timestamp) < shanghaiTimestamp) {
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
      const payloadAsV3 = params[0] as ExecutionPayloadV3
      const { excessBlobGas, blobGasUsed } = payloadAsV3

      if (excessBlobGas !== undefined && excessBlobGas !== null) {
        throw {
          code: INVALID_PARAMS,
          message: 'Invalid PayloadV2: excessBlobGas is defined',
        }
      }
      if (blobGasUsed !== undefined && blobGasUsed !== null) {
        throw {
          code: INVALID_PARAMS,
          message: 'Invalid PayloadV2: blobGasUsed is defined',
        }
      }
    }
    const newPayloadRes = await this.newPayload(params)
    if (newPayloadRes.status === Status.INVALID_BLOCK_HASH) {
      newPayloadRes.status = Status.INVALID
      newPayloadRes.latestValidHash = null
    }
    return newPayloadRes
  }

  async newPayloadV3(params: [ExecutionPayloadV3, Bytes32[], Bytes32]): Promise<PayloadStatusV1> {
    const eip4844Timestamp = this.chain.config.chainCommon.hardforkTimestamp(Hardfork.Cancun)
    const ts = parseInt(params[0].timestamp)
    if (eip4844Timestamp === null || ts < eip4844Timestamp) {
      throw {
        code: UNSUPPORTED_FORK,
        message: 'NewPayloadV{1|2} MUST be used before Cancun is activated',
      }
    }

    const newPayloadRes = await this.newPayload(params)
    if (newPayloadRes.status === Status.INVALID_BLOCK_HASH) {
      newPayloadRes.status = Status.INVALID
      newPayloadRes.latestValidHash = null
    }
    return newPayloadRes
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

    const safe = toBytes(safeBlockHash)
    const finalized = toBytes(finalizedBlockHash)

    if (!equalsBytes(finalized, zeroBlockHash) && equalsBytes(safe, zeroBlockHash)) {
      throw {
        code: INVALID_PARAMS,
        message: 'safe block can not be zero if finalized is not zero',
      }
    }

    if (this.config.synchronized) {
      this.connectionManager.newForkchoiceLog()
    }

    // It is possible that newPayload didn't start beacon sync as the payload it was asked to
    // evaluate didn't require syncing beacon. This can happen if the EL<>CL starts and CL
    // starts from a bit behind like how lodestar does
    if (!this.service.beaconSync && !this.config.disableBeaconSync) {
      await this.service.switchToBeaconSync()
    }

    const prevError = this.invalidBlocks.get(headBlockHash.slice(2))
    if (prevError !== undefined) {
      const validationError = `Received block previously marked INVALID: ${prevError.message}`
      this.config.logger.debug(validationError)
      const latestValidHash = null
      const payloadStatus = { status: Status.INVALID, latestValidHash, validationError }
      const response = { payloadStatus, payloadId: null }
      return response
    }

    /*
     * Process head block
     */
    let headBlock: Block | undefined
    try {
      const head = toBytes(headBlockHash)
      headBlock =
        this.remoteBlocks.get(headBlockHash.slice(2)) ??
        (await this.skeleton.getBlockByHash(head, true)) ??
        (await this.chain.getBlock(head))
    } catch (error) {
      this.config.logger.debug(`Forkchoice requested unknown head hash=${short(headBlockHash)}`)
      const payloadStatus = {
        status: Status.SYNCING,
        latestValidHash: null,
        validationError: null,
      }
      const response = { payloadStatus, payloadId: null }
      return response
    }

    const hardfork = headBlock.common.hardfork()
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

    // call skeleton sethead with force head change and reset beacon sync if reorg
    const reorged = await this.skeleton.setHead(headBlock, true)
    if (reorged) await this.service.beaconSync?.reorged(headBlock)
    await this.skeleton.blockingFillWithCutoff(this.chain.config.engineNewpayloadMaxExecute)

    // Only validate this as terminal block if this block's difficulty is non-zero,
    // else this is a PoS block but its hardfork could be indeterminable if the skeleton
    // is not yet connected.
    if (!headBlock.common.gteHardfork(Hardfork.Paris) && headBlock.header.difficulty > BIGINT_0) {
      const validTerminalBlock = await validateTerminalBlock(headBlock, this.chain)
      if (!validTerminalBlock) {
        const response = {
          payloadStatus: {
            status: Status.INVALID,
            validationError: null,
            latestValidHash: bytesToHex(zeros(32)),
          },
          payloadId: null,
        }
        return response
      }
    }

    const isHeadExecuted =
      (this.executedBlocks.get(headBlockHash.slice(2)) ??
        (await validExecutedChainBlock(headBlock, this.chain))) !== null
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

    /*
     * Process safe and finalized block since headBlock has been found to be executed
     * Allowed to have zero value while transition block is finalizing
     */
    let safeBlock, finalizedBlock

    if (!equalsBytes(safe, zeroBlockHash)) {
      if (equalsBytes(safe, headBlock.hash())) {
        safeBlock = headBlock
      } else {
        try {
          // Right now only check if the block is available, canonicality check is done
          // in setHead after chain.putBlocks so as to reflect latest canonical chain
          safeBlock =
            (await this.skeleton.getBlockByHash(safe, true)) ?? (await this.chain.getBlock(safe))
        } catch (_error: any) {
          throw {
            code: INVALID_PARAMS,
            message: 'safe block not available',
          }
        }
      }
    } else {
      safeBlock = undefined
    }

    if (!equalsBytes(finalized, zeroBlockHash)) {
      try {
        // Right now only check if the block is available, canonicality check is done
        // in setHead after chain.putBlocks so as to reflect latest canonical chain
        finalizedBlock =
          (await this.skeleton.getBlockByHash(finalized, true)) ??
          (await this.chain.getBlock(finalized))
      } catch (error: any) {
        throw {
          message: 'finalized block not available',
          code: INVALID_PARAMS,
        }
      }
    } else {
      finalizedBlock = undefined
    }

    const vmHeadHash = (await this.chain.blockchain.getIteratorHead()).hash()

    if (!equalsBytes(vmHeadHash, headBlock.hash())) {
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
      try {
        await this.execution.setHead(blocks, { safeBlock, finalizedBlock })
      } catch (error) {
        throw {
          message: (error as Error).message,
          code: INVALID_PARAMS,
        }
      }
      this.service.txPool.removeNewBlockTxs(blocks)

      const isPrevSynced = this.chain.config.synchronized
      this.config.updateSynchronizedState(headBlock.header)
      if (!isPrevSynced && this.chain.config.synchronized) {
        this.service.txPool.checkRunState()
      }
    } else if (!headBlock.isGenesis()) {
      // even if the vmHead is same still validations need to be done regarding the correctness
      // of the sequence and canonical-ity
      try {
        await this.execution.setHead([headBlock], { safeBlock, finalizedBlock })
      } catch (e) {
        throw {
          message: (e as Error).message,
          code: INVALID_PARAMS,
        }
      }
    }

    // prepare valid response
    let validResponse
    // If payloadAttributes is present, start building block and return payloadId
    if (payloadAttributes) {
      const { timestamp, prevRandao, suggestedFeeRecipient, withdrawals, parentBeaconBlockRoot } =
        payloadAttributes
      const timestampBigInt = BigInt(timestamp)

      if (timestampBigInt <= headBlock.header.timestamp) {
        throw {
          message: `invalid timestamp in payloadAttributes, got ${timestampBigInt}, need at least ${
            headBlock.header.timestamp + BIGINT_1
          }`,
          code: INVALID_PARAMS,
        }
      }

      const payloadId = await this.pendingBlock.start(
        await this.vm.shallowCopy(),
        headBlock,
        {
          timestamp,
          mixHash: prevRandao,
          coinbase: suggestedFeeRecipient,
          parentBeaconBlockRoot,
        },
        withdrawals
      )
      const latestValidHash = await validHash(headBlock.hash(), this.chain, this.chainCache)
      const payloadStatus = { status: Status.VALID, latestValidHash, validationError: null }
      validResponse = { payloadStatus, payloadId: bytesToHex(payloadId), headBlock }
    } else {
      const latestValidHash = await validHash(headBlock.hash(), this.chain, this.chainCache)
      const payloadStatus = { status: Status.VALID, latestValidHash, validationError: null }
      validResponse = { payloadStatus, payloadId: null, headBlock }
    }

    // before returning response prune cached blocks based on finalized and vmHead
    if (this.chain.config.pruneEngineCache) {
      pruneCachedBlocks(this.chain, this.chainCache)
    }
    return validResponse
  }

  private async forkchoiceUpdatedV1(
    params: [forkchoiceState: ForkchoiceStateV1, payloadAttributes: PayloadAttributesV1 | undefined]
  ): Promise<ForkchoiceResponseV1 & { headBlock?: Block }> {
    const payloadAttributes = params[1]
    if (payloadAttributes !== undefined && payloadAttributes !== null) {
      if (
        Object.values(payloadAttributes).filter((attr) => attr !== null && attr !== undefined)
          .length > 3
      ) {
        throw {
          code: INVALID_PARAMS,
          message: 'PayloadAttributesV1 MUST be used for forkchoiceUpdatedV2',
        }
      }
      validateHardforkRange(
        this.chain.config.chainCommon,
        1,
        null,
        Hardfork.Paris,
        BigInt(payloadAttributes.timestamp)
      )
    }

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
      if (
        Object.values(payloadAttributes).filter((attr) => attr !== null && attr !== undefined)
          .length > 4
      ) {
        throw {
          code: INVALID_PARAMS,
          message: 'PayloadAttributesV{1|2} MUST be used for forkchoiceUpdatedV2',
        }
      }

      validateHardforkRange(
        this.chain.config.chainCommon,
        2,
        null,
        Hardfork.Shanghai,
        BigInt(payloadAttributes.timestamp)
      )

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
      const parentBeaconBlockRoot = (payloadAttributes as PayloadAttributesV3).parentBeaconBlockRoot

      if (parentBeaconBlockRoot !== undefined && parentBeaconBlockRoot !== null) {
        throw {
          code: INVALID_PARAMS,
          message: 'Invalid PayloadAttributesV{1|2}: parentBlockBeaconRoot defined',
        }
      }
    }

    return this.forkchoiceUpdated(params)
  }

  private async forkchoiceUpdatedV3(
    params: [forkchoiceState: ForkchoiceStateV1, payloadAttributes: PayloadAttributesV3 | undefined]
  ): Promise<ForkchoiceResponseV1 & { headBlock?: Block }> {
    const payloadAttributes = params[1]
    if (payloadAttributes !== undefined && payloadAttributes !== null) {
      if (
        Object.values(payloadAttributes).filter((attr) => attr !== null && attr !== undefined)
          .length > 5
      ) {
        throw {
          code: INVALID_PARAMS,
          message: 'PayloadAttributesV3 MUST be used for forkchoiceUpdatedV3',
        }
      }

      validateHardforkRange(
        this.chain.config.chainCommon,
        3,
        Hardfork.Cancun,
        // this could be valid post cancun as well, if not then update the valid till hf here
        null,
        BigInt(payloadAttributes.timestamp)
      )
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
  private async getPayload(params: [Bytes8], payloadVersion: number) {
    const payloadId = params[0]
    try {
      const built = await this.pendingBlock.build(payloadId)
      if (!built) {
        throw EngineError.UnknownPayload
      }
      // The third arg returned is the minerValue which we will use to
      // value the block
      const [block, receipts, value, blobs] = built

      // do a blocking call even if execution might be busy for the moment and skip putting
      // it into chain till CL confirms with full data via new payload like versioned hashes
      // parent beacon block root
      const executed = await this.execution.runWithoutSetHead({ block }, receipts, true, true)
      if (!executed) {
        throw Error(`runWithoutSetHead did not execute the block for payload=${payloadId}`)
      }

      this.executedBlocks.set(bytesToUnprefixedHex(block.hash()), block)
      const executionPayload = blockToExecutionPayload(block, value, blobs)

      let checkNotBeforeHf: Hardfork | null
      let checkNotAfterHf: Hardfork | null

      switch (payloadVersion) {
        case 3:
          checkNotBeforeHf = Hardfork.Cancun
          checkNotAfterHf = Hardfork.Cancun
          break

        case 2:
          // no checks to be done for before as valid till paris
          checkNotBeforeHf = null
          checkNotAfterHf = Hardfork.Shanghai
          break

        case 1:
          checkNotBeforeHf = null
          checkNotAfterHf = Hardfork.Paris
          break

        default:
          throw Error(`Invalid payloadVersion=${payloadVersion}`)
      }

      validateHardforkRange(
        this.chain.config.chainCommon,
        payloadVersion,
        checkNotBeforeHf,
        checkNotAfterHf,
        BigInt(executionPayload.executionPayload.timestamp)
      )
      return executionPayload
    } catch (error: any) {
      if (validEngineCodes.includes(error.code)) throw error
      throw {
        code: INTERNAL_ERROR,
        message: error.message ?? error,
      }
    }
  }

  async getPayloadV1(params: [Bytes8]) {
    const { executionPayload } = await this.getPayload(params, 1)
    return executionPayload
  }

  async getPayloadV2(params: [Bytes8]) {
    const { executionPayload, blockValue } = await this.getPayload(params, 2)
    return { executionPayload, blockValue }
  }

  async getPayloadV3(params: [Bytes8]) {
    return this.getPayload(params, 3)
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
    const ttd = this.chain.config.chainCommon.hardforkTTD(Hardfork.Paris)
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
    const hashes = params[0].map(hexToBytes)
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

    if (count < BIGINT_1 || start < BIGINT_1) {
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
      count = currentChainHeight - start + BIGINT_1
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
