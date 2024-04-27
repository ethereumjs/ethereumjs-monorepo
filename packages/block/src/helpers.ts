import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import { BIGINT_0, BIGINT_1, TypeOutput, isHexString, toType } from '@ethereumjs/util'

import type { BlockHeaderBytes, HeaderData } from './types.js'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'

/**
 * Returns a 0x-prefixed hex number string from a hex string or string integer.
 * @param {string} input string to check, convert, and return
 */
export const numberToHex = function (input?: string): PrefixedHexString | undefined {
  if (input === undefined) return undefined
  if (!isHexString(input)) {
    const regex = new RegExp(/^\d+$/) // test to make sure input contains only digits
    if (!regex.test(input)) {
      const msg = `Cannot convert string to hex string. numberToHex only supports 0x-prefixed hex or integer strings but the given string was: ${input}`
      throw new Error(msg)
    }
    return `0x${parseInt(input, 10).toString(16)}`
  }
  return input
}

export function valuesArrayToHeaderData(values: BlockHeaderBytes): HeaderData {
  const [
    parentHash,
    uncleHash,
    coinbase,
    stateRoot,
    transactionsTrie,
    receiptTrie,
    logsBloom,
    difficulty,
    number,
    gasLimit,
    gasUsed,
    timestamp,
    extraData,
    mixHash,
    nonce,
    baseFeePerGas,
    withdrawalsRoot,
    blobGasUsed,
    excessBlobGas,
    parentBeaconBlockRoot,
    requestsRoot,
  ] = values

  if (values.length > 21) {
    throw new Error(
      `invalid header. More values than expected were received. Max: 20, got: ${values.length}`
    )
  }
  if (values.length < 15) {
    throw new Error(
      `invalid header. Less values than expected were received. Min: 15, got: ${values.length}`
    )
  }

  return {
    parentHash,
    uncleHash,
    coinbase,
    stateRoot,
    transactionsTrie,
    receiptTrie,
    logsBloom,
    difficulty,
    number,
    gasLimit,
    gasUsed,
    timestamp,
    extraData,
    mixHash,
    nonce,
    baseFeePerGas,
    withdrawalsRoot,
    blobGasUsed,
    excessBlobGas,
    parentBeaconBlockRoot,
    requestsRoot,
  }
}

export function getDifficulty(headerData: HeaderData): bigint | null {
  const { difficulty } = headerData
  if (difficulty !== undefined) {
    return toType(difficulty, TypeOutput.BigInt)
  }
  return null
}

export const getNumBlobs = (transactions: TypedTransaction[]) => {
  let numBlobs = 0
  for (const tx of transactions) {
    if (tx instanceof BlobEIP4844Transaction) {
      numBlobs += tx.blobVersionedHashes.length
    }
  }
  return numBlobs
}

/**
 * Approximates `factor * e ** (numerator / denominator)` using Taylor expansion
 */
export const fakeExponential = (factor: bigint, numerator: bigint, denominator: bigint) => {
  let i = BIGINT_1
  let output = BIGINT_0
  let numerator_accum = factor * denominator
  while (numerator_accum > BIGINT_0) {
    output += numerator_accum
    numerator_accum = (numerator_accum * numerator) / (denominator * i)
    i++
  }

  return output / denominator
}
