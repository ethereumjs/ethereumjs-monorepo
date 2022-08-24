import { TypeOutput, bigIntToBuffer, isFalsy, isHexString, toType } from '@ethereumjs/util'

import type { BlockHeaderBuffer, BlockOptions, HeaderData } from './types'

/**
 * Returns a 0x-prefixed hex number string from a hex string or string integer.
 * @param {string} input string to check, convert, and return
 */
export const numberToHex = function (input?: string) {
  if (isFalsy(input)) return undefined
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

export function getHeaderData(values: BlockHeaderBuffer, opts: BlockOptions = {}): HeaderData {
  if (values.length > 16) {
    throw new Error('invalid header. More values than expected were received')
  }
  if (values.length < 15) {
    throw new Error('invalid header. Less values than expected were received')
  }
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
  ] = values

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (opts.common?.isActivatedEIP(1559) && baseFeePerGas === undefined) {
    const eip1559ActivationBlock = bigIntToBuffer(opts.common?.eipBlock(1559)!)
    // number right now here is either buffer or undefined so even if number
    // is buffer 0x00, still this condition would be evaluated
    //
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (eip1559ActivationBlock && number && eip1559ActivationBlock.equals(number as Buffer)) {
      throw new Error('invalid header. baseFeePerGas should be provided')
    }
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
  } as HeaderData
}

export function getDifficulty(headerData: HeaderData): bigint {
  return toType(headerData.difficulty!, TypeOutput.BigInt)
}
