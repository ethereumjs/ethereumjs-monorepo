import { bigIntToHex, bytesToHex } from '@ethereumjs/util'

import type { Chain } from '../../../blockchain'
import type { BlobsBundle } from '../../../miner'
import type { BlobsBundleV1, ChainCache } from './types'
import type { Block, ExecutionPayload } from '@ethereumjs/block'

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
