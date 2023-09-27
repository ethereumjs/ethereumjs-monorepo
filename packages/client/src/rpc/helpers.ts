import { BIGINT_0, bigIntToHex, bytesToHex, intToHex } from '@ethereumjs/util'

import { INTERNAL_ERROR, INVALID_PARAMS } from './error-code'

import type { Chain } from '../blockchain'
import type { Block } from '@ethereumjs/block'
import type { JsonRpcTx, TypedTransaction } from '@ethereumjs/tx'

export function callWithStackTrace(handler: Function, debug: boolean) {
  return async (...args: any) => {
    try {
      await handler(...args)
    } catch (error: any) {
      const e: any = {
        code: error.code ?? INTERNAL_ERROR,
        message: error.message,
      }
      if (debug === true) {
        e['trace'] = error.trace
      }

      throw e
    }
  }
}

/**
 * Returns tx formatted to the standard JSON-RPC fields
 */
export const jsonRpcTx = (tx: TypedTransaction, block?: Block, txIndex?: number): JsonRpcTx => {
  const txJSON = tx.toJSON()
  return {
    blockHash: block ? bytesToHex(block.hash()) : null,
    blockNumber: block ? bigIntToHex(block.header.number) : null,
    from: tx.getSenderAddress().toString(),
    gas: txJSON.gasLimit!,
    gasPrice: txJSON.gasPrice ?? txJSON.maxFeePerGas!,
    maxFeePerGas: txJSON.maxFeePerGas,
    maxPriorityFeePerGas: txJSON.maxPriorityFeePerGas,
    type: intToHex(tx.type),
    accessList: txJSON.accessList,
    chainId: txJSON.chainId,
    hash: bytesToHex(tx.hash()),
    input: txJSON.data!,
    nonce: txJSON.nonce!,
    to: tx.to?.toString() ?? null,
    transactionIndex: txIndex !== undefined ? intToHex(txIndex) : null,
    value: txJSON.value!,
    v: txJSON.v!,
    r: txJSON.r!,
    s: txJSON.s!,
    maxFeePerBlobGas: txJSON.maxFeePerBlobGas,
    blobVersionedHashes: txJSON.blobVersionedHashes,
  }
}

/**
 * Get block by option
 */
export const getBlockByOption = async (blockOpt: string, chain: Chain) => {
  if (blockOpt === 'pending') {
    throw {
      code: INVALID_PARAMS,
      message: `"pending" is not yet supported`,
    }
  }

  let block: Block
  const latest = chain.blocks.latest ?? (await chain.getCanonicalHeadBlock())

  switch (blockOpt) {
    case 'earliest':
      block = await chain.getBlock(BIGINT_0)
      break
    case 'latest':
      block = latest
      break
    case 'safe':
      block = chain.blocks.safe ?? (await chain.getCanonicalSafeBlock())
      break
    case 'finalized':
      block = chain.blocks.finalized ?? (await chain.getCanonicalFinalizedBlock())
      break
    default: {
      const blockNumber = BigInt(blockOpt)
      if (blockNumber === latest.header.number) {
        block = latest
      } else if (blockNumber > latest.header.number) {
        throw {
          code: INVALID_PARAMS,
          message: 'specified block greater than current height',
        }
      } else {
        block = await chain.getBlock(blockNumber)
      }
    }
  }
  return block
}
