import { TypeOutput, isHexString, toType } from '@ethereumjs/util'

import type { BlockHeader } from './header'
import type { BlockHeaderBuffer, HeaderData } from './types'
import type { BlobEIP4844Transaction } from '@ethereumjs/tx'

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

export function valuesArrayToHeaderData(values: BlockHeaderBuffer): HeaderData {
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
    excessDataGas,
  ] = values

  if (values.length > 18) {
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
 *
 * @param parent header for the parent block
 * @param newBlobs number of blobs contained in block
 * @returns the excess data gas for the prospective next block
 */
export const calcExcessDataGas = (parent: BlockHeader, newBlobs: number) => {
  if (!parent._common.isActivatedEIP(4844)) {
    throw new Error('excessDataGas can only be computed if EIP 4844 is activated')
  }
  if (parent.excessDataGas === undefined) {
    throw new Error('parent header does not contain excessDataGas field')
  }

  const consumedDataGas = BigInt(newBlobs) * parent._common.param('gasConfig', 'dataGasPerBlob')
  const targetDataGasPerBlock = parent._common.param('gasConfig', 'targetDataGasPerBlock')
  if (parent.excessDataGas + consumedDataGas < targetDataGasPerBlock) return 0
  else {
    return parent.excessDataGas + consumedDataGas - targetDataGasPerBlock
  }
}
