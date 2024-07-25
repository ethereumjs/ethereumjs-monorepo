import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import { BIGINT_0, BIGINT_1, TypeOutput, isHexString, toType } from '@ethereumjs/util'

import type { BlockHeaderBytes, HeaderData } from './types.js'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { CLRequest, CLRequestType, PrefixedHexString, Withdrawal } from '@ethereumjs/util'

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
      `invalid header. More values than expected were received. Max: 20, got: ${values.length}`,
    )
  }
  if (values.length < 15) {
    throw new Error(
      `invalid header. Less values than expected were received. Min: 15, got: ${values.length}`,
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

/**
 * Returns the withdrawals trie root for array of Withdrawal.
 * @param wts array of Withdrawal to compute the root of
 * @param optional emptyTrie to use to generate the root
 */
export async function genWithdrawalsTrieRoot(wts: Withdrawal[], emptyTrie?: Trie) {
  const trie = emptyTrie ?? new Trie()
  for (const [i, wt] of wts.entries()) {
    await trie.put(RLP.encode(i), RLP.encode(wt.raw()))
  }
  return trie.root()
}

/**
 * Returns the txs trie root for array of TypedTransaction
 * @param txs array of TypedTransaction to compute the root of
 * @param optional emptyTrie to use to generate the root
 */
export async function genTransactionsTrieRoot(txs: TypedTransaction[], emptyTrie?: Trie) {
  const trie = emptyTrie ?? new Trie()
  for (const [i, tx] of txs.entries()) {
    await trie.put(RLP.encode(i), tx.serialize())
  }
  return trie.root()
}

/**
 * Returns the requests trie root for an array of CLRequests
 * @param requests - an array of CLRequests
 * @param emptyTrie optional empty trie used to generate the root
 * @returns a 32 byte Uint8Array representing the requests trie root
 */
export async function genRequestsTrieRoot(requests: CLRequest<CLRequestType>[], emptyTrie?: Trie) {
  // Requests should be sorted in monotonically ascending order based on type
  // and whatever internal sorting logic is defined by each request type
  if (requests.length > 1) {
    for (let x = 1; x < requests.length; x++) {
      if (requests[x].type < requests[x - 1].type)
        throw new Error('requests are not sorted in ascending order')
    }
  }
  const trie = emptyTrie ?? new Trie()
  for (const [i, req] of requests.entries()) {
    await trie.put(RLP.encode(i), req.serialize())
  }
  return trie.root()
}
