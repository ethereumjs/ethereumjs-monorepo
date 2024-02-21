import { Block } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import {
  BIGINT_1,
  bigIntToHex,
  bytesToHex,
  bytesToUnprefixedHex,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'

import { UNSUPPORTED_FORK } from '../../error-code'

import { type BlobsBundleV1, type ChainCache, type PayloadStatusV1, Status } from './types'

import type { Chain } from '../../../blockchain'
import type { BlobsBundle } from '../../../miner'
import type { ExecutionPayloadBodyV1 } from './types'
import type { ExecutionPayload } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'

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

export const pruneCachedBlocks = (chain: Chain, chainCache: ChainCache) => {
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
        if (block !== undefined && block.header.number < pruneExecutedBlocksTill) {
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
export const recursivelyFindParents = async (
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
export const validExecutedChainBlock = async (
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
export const validHash = async (
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
export const validateTerminalBlock = async (block: Block, chain: Chain): Promise<boolean> => {
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
export const assembleBlock = async (
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

export const getPayloadBody = (block: Block): ExecutionPayloadBodyV1 => {
  const transactions = block.transactions.map((tx) => bytesToHex(tx.serialize()))
  const withdrawals = block.withdrawals?.map((wt) => wt.toJSON()) ?? null

  return {
    transactions,
    withdrawals,
  }
}

export function validateHardforkRange(
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
