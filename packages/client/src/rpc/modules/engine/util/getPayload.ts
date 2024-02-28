import { bigIntToHex, bytesToHex } from '@ethereumjs/util'

import type { BlobsBundle } from '../../../../miner'
import type { BlobsBundleV1 } from '../types'
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
