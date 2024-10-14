import { bigIntToHex, bytesToHex } from '@ethereumjs/util'

import type { BlobsBundle } from '../../../../miner/index.js'
import type { BlobsBundleV1 } from '../types.js'
import type { Block, ExecutionPayload } from '@ethereumjs/block'
import type { CLRequest, CLRequestType } from '@ethereumjs/util'

/**
 * Formats a block to {@link ExecutionPayloadV1}.
 */
export const blockToExecutionPayload = (
  block: Block,
  value: bigint,
  bundle?: BlobsBundle,
  requests?: CLRequest<CLRequestType>[],
) => {
  const executionPayload: ExecutionPayload = block.toExecutionPayload()
  // parentBeaconBlockRoot is not part of the CL payload
  if (executionPayload.parentBeaconBlockRoot !== undefined) {
    delete executionPayload.parentBeaconBlockRoot
  }

  const blobsBundle: BlobsBundleV1 | undefined = bundle ? bundle : undefined

  // ethereumjs does not provide any transaction censoring detection (yet) to suggest
  // overriding builder/mev-boost blocks
  const shouldOverrideBuilder = false
  return {
    executionPayload,
    executionRequests: requests?.map((req) => bytesToHex(req.data)),
    blockValue: bigIntToHex(value),
    blobsBundle,
    shouldOverrideBuilder,
  }
}
