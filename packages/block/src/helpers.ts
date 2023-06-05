import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import { TypeOutput, isHexString, toType } from '@ethereumjs/util'

import type { BlockHeader } from './header'
import type { BlockHeaderBytes, HeaderData } from './types'
import type { TypedTransaction } from '@ethereumjs/tx'

/**
 * Returns a 0x-prefixed hex number string from a hex string or string integer.
 * @param {string} input string to check, convert, and return
 */
export const numberToHex = function (input?: string) {
  if (input === undefined) return undefined
  if (!isHexString(input)) {
    const regex = new RegExp(/^\d+$/) // test to make sure input contains only digits
    if (!regex.test(input)) {
      const msg = `Cannot convert string to hex string. numberToHex only supports 0x-prefixed hex or integer strings but the given string was: ${input}`
      throw new Error(msg)
    }
    return '0x' + parseInt(input, 10).toString(16)
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
    dataGasUsed,
    excessDataGas,
  ] = values

  if (values.length > 19) {
    throw new Error('invalid header. More values than expected were received')
  }
  if (values.length < 15) {
    throw new Error('invalid header. Less values than expected were received')
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
    dataGasUsed,
    excessDataGas,
  }
}

export function getDifficulty(headerData: HeaderData): bigint | null {
  const { difficulty } = headerData
  if (difficulty !== undefined) {
    return toType(difficulty, TypeOutput.BigInt)
  }
  return null
}

/**
 * Calculates the excess data gas for a post EIP 4844 block given the parent block header.
 * @param parent header for the parent block
 * @returns the excess data gas for the prospective next block
 *
 * Note: This function expects that it is only being called on a valid block as it does not have
 * access to the "current" block's common instance to verify if 4844 is active or not.
 */
export const calcExcessDataGas = (parent: BlockHeader) => {
  // The validation of the fields and 4844 activation is already taken care in BlockHeader constructor
  const targetGasConsumed = (parent.excessDataGas ?? BigInt(0)) + (parent.dataGasUsed ?? BigInt(0))
  const targetDataGasPerBlock = parent._common.param('gasConfig', 'targetDataGasPerBlock')

  if (targetGasConsumed <= targetDataGasPerBlock) {
    return BigInt(0)
  } else {
    return targetGasConsumed - targetDataGasPerBlock
  }
}

export const getNumBlobs = (transactions: TypedTransaction[]) => {
  let numBlobs = 0
  for (const tx of transactions) {
    if (tx instanceof BlobEIP4844Transaction) {
      numBlobs += tx.versionedHashes.length
    }
  }
  return numBlobs
}

/**
 * Approximates `factor * e ** (numerator / denominator)` using Taylor expansion
 */
export const fakeExponential = (factor: bigint, numerator: bigint, denominator: bigint) => {
  let i = BigInt(1)
  let output = BigInt(0)
  let numerator_accum = factor * denominator
  while (numerator_accum > BigInt(0)) {
    output += numerator_accum
    numerator_accum = (numerator_accum * numerator) / (denominator * i)
    i++
  }

  return output / denominator
}

/**
 * Returns the price per unit of data gas for a blob transaction in the current/pending block
 * @param header - the header for the current block (or current head of the chain)
 * @returns the price in gwei per unit of data gas spent
 */
export const getDataGasPrice = (header: BlockHeader) => {
  if (header.excessDataGas === undefined) {
    throw new Error('header must have excessDataGas field populated')
  }
  return fakeExponential(
    header._common.param('gasPrices', 'minDataGasPrice'),
    header.excessDataGas,
    header._common.param('gasConfig', 'dataGasPriceUpdateFraction')
  )
}

/**
 * Returns the total fee for data gas spent in the current/pending block
 * @param header of the current/pending block
 * @param numBlobs number of blobs in the transaction
 * @returns the total data gas fee for all
 */
export const calcDataFee = (header: BlockHeader, numBlobs: number) => {
  const dataGasPerBlob = header._common.param('gasConfig', 'dataGasPerBlob')
  const dataGasUsed = dataGasPerBlob * BigInt(numBlobs)

  const dataGasPrice = getDataGasPrice(header)
  return dataGasUsed * dataGasPrice
}
