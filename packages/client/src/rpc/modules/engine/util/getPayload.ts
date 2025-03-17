import { bigIntToHex, bytesToHex } from '@ethereumjs/util'

import type { Block, ExecutionPayload } from '@ethereumjs/block'
import type { CLRequest, CLRequestType } from '@ethereumjs/util'
import type { BlobsBundle } from '../../../../miner/index.ts'
import type { BlobsBundleV1 } from '../types.ts'

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

  const blobsBundle: BlobsBundleV1 | undefined = bundle ?? undefined

  // ethereumjs does not provide any transaction censoring detection (yet) to suggest
  // overriding builder/mev-boost blocks
  const shouldOverrideBuilder = false

  let executionRequests = undefined
  if (requests !== undefined) {
    executionRequests = []
    for (const request of requests) {
      if (request.bytes.length > 1) {
        executionRequests.push(bytesToHex(request.bytes))
      }
    }
  }

  return {
    executionPayload,
    executionRequests,
    blockValue: bigIntToHex(value),
    blobsBundle,
    shouldOverrideBuilder,
  }
}
