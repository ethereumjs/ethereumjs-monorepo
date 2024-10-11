import { createBlockFromExecutionPayload, genRequestsRoot } from '@ethereumjs/block'
import { Blob4844Tx } from '@ethereumjs/tx'
import { bytesToHex, createCLRequest, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { sha256 } from 'ethereum-cryptography/sha256'

import { short } from '../../../../util/index.js'
import { Status } from '../types.js'

import { validHash } from './generic.js'

import type { Chain } from '../../../../blockchain/index.js'
import type { ChainCache, PayloadStatusV1 } from '../types.js'
import type { Block, ExecutionPayload } from '@ethereumjs/block'
import type { PrefixedHexString } from '@ethereumjs/util'

type CLValidationData = {
  blobVersionedHashes?: PrefixedHexString[]
  executionRequests?: PrefixedHexString[]
}

/**
 * Returns a block from a payload.
 * If errors, returns {@link PayloadStatusV1}
 */
export const assembleBlock = async (
  payload: ExecutionPayload,
  clValidationData: CLValidationData,
  chain: Chain,
  chainCache: ChainCache,
): Promise<{ block?: Block; error?: PayloadStatusV1 }> => {
  const { blockNumber, timestamp } = payload
  const { config } = chain
  const common = config.chainCommon.copy()

  common.setHardforkBy({ blockNumber, timestamp })

  try {
    const block = await createBlockFromExecutionPayload(payload, { common })
    // TODO: validateData is also called in applyBlock while runBlock, may be it can be optimized
    // by removing/skipping block data validation from there
    await block.validateData()

    // Validate CL data to see if it matches with the assembled block
    const { blobVersionedHashes, executionRequests } = clValidationData

    /**
     * Validate blob versioned hashes in the context of EIP-4844 blob transactions
     */
    if (block.common.isActivatedEIP(4844)) {
      let validationError: string | null = null
      if (blobVersionedHashes === undefined) {
        validationError = `Error verifying blobVersionedHashes: received none`
      } else {
        validationError = validate4844BlobVersionedHashes(block, blobVersionedHashes)
      }

      // if there was a validation error return invalid
      if (validationError !== null) {
        throw validationError
      }
    } else if (blobVersionedHashes !== undefined) {
      const validationError = `Invalid blobVersionedHashes before EIP-4844 is activated`
      throw validationError
    }

    if (block.common.isActivatedEIP(7685)) {
      let validationError: string | null = null
      if (executionRequests === undefined) {
        validationError = `Error verifying executionRequests: received none`
      } else {
        validationError = validate7685ExecutionRequests(block, executionRequests)
      }

      // if there was a validation error return invalid
      if (validationError !== null) {
        throw validationError
      }
    } else if (executionRequests !== undefined) {
      const validationError = `Invalid executionRequests before EIP-7685 is activated`
      throw validationError
    }

    return { block }
  } catch (error) {
    const validationError = `Error assembling block from payload: ${error}`
    config.logger.error(validationError)
    const latestValidHash = await validHash(
      hexToBytes(payload.parentHash as PrefixedHexString),
      chain,
      chainCache,
    )
    const response = {
      status: `${error}`.includes('Invalid blockHash') ? Status.INVALID_BLOCK_HASH : Status.INVALID,
      latestValidHash,
      validationError,
    }
    return { error: response }
  }
}

export const validate4844BlobVersionedHashes = (
  headBlock: Block,
  blobVersionedHashes: PrefixedHexString[],
): string | null => {
  let validationError: string | null = null

  // Collect versioned hashes in the flat array `txVersionedHashes` to match with received
  const txVersionedHashes = []
  for (const tx of headBlock.transactions) {
    if (tx instanceof Blob4844Tx) {
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
      if (blobVersionedHashes[vIndex] !== txVersionedHashes[vIndex]) {
        validationError = `Error verifying blobVersionedHashes: mismatch at index=${vIndex} expected=${short(
          txVersionedHashes[vIndex],
        )} received=${short(blobVersionedHashes[vIndex])}`
        break
      }
    }
  }
  return validationError
}

export const validate7685ExecutionRequests = (
  headBlock: Block,
  executionRequests: PrefixedHexString[],
): string | null => {
  let validationError: string | null = null

  // Collect versioned hashes in the flat array `txVersionedHashes` to match with received
  const requests = executionRequests.map((req) => createCLRequest(hexToBytes(req)))
  const sha256Function = headBlock.common.customCrypto.sha256 ?? sha256
  const requestsRoot = genRequestsRoot(requests, sha256Function)

  if (!equalsBytes(requestsRoot, headBlock.header.requestsRoot!)) {
    validationError = `Invalid requestsRoot received=${bytesToHex(
      headBlock.header.requestsRoot!,
    )} expected=${bytesToHex(requestsRoot)}`
  }
  return validationError
}
