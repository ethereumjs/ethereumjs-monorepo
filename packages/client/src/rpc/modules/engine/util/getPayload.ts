import { bigIntToHex, bytesToHex } from '@ethereumjs/util'

import type { BlobsBundle } from '../../../../miner/index.js'
import type { BlobsBundleV1 } from '../types.js'
import type { Block, ExecutionPayload } from '@ethereumjs/block'

/**
 * Formats a block to {@link ExecutionPayloadV1}.
 */
export const blockToExecutionPayload = (block: Block, value: bigint, bundle?: BlobsBundle) => {
  const executionPayload: ExecutionPayload = block.toExecutionPayload()
  // parentBeaconBlockRoot is not part of the CL payload
  if (executionPayload.parentBeaconBlockRoot !== undefined) {
    delete executionPayload.parentBeaconBlockRoot
  }
  const blobsBundle: BlobsBundleV1 | undefined = bundle
    ? {
        commitments: bundle.commitments.map(bytesToHex),
        blobs: bundle.blobs.map(bytesToHex),
        proofs: bundle.proofs.map(bytesToHex),
      }
    : undefined

  // ethereumjs doesnot provide any transaction censoring detection (yet) to suggest
  // overriding builder/mev-boost blocks
  const shouldOverrideBuilder = false
  return { executionPayload, blockValue: bigIntToHex(value), blobsBundle, shouldOverrideBuilder }
}
