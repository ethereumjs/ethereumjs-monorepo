import { Block } from '@ethereumjs/block'
import { bigIntToHex, bytesToHex, equalsBytes } from '@ethereumjs/util'

import type { Chain } from '../../../blockchain'
import type { BlobsBundle } from '../../../miner'
import type { BlobsBundleV1, ChainCache } from './types'
import type { ExecutionPayload } from '@ethereumjs/block'

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
