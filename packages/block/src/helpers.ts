import { TypeOutput, isHexString, toType } from '@ethereumjs/util'

import type { BlockHeaderBuffer, HeaderData } from './types'

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
    verkleProof,
    verklePreStateRaw,
  ] = values

  if (values.length > 18) {
    throw new Error('invalid header. More values than expected were received')
  }
  if (values.length < 17) {
    throw new Error('invalid header. Less values than expected were received')
  }

  // TODO: Consider moving this in the header constructor helpers?
  const verklePreState = (verklePreStateRaw as unknown as Buffer[][]).reduce<any>(
    (previousValue: { [key: string]: string }, currentValue: Buffer[]) => {
      const [key, value] = currentValue
      previousValue[toType(key, TypeOutput.PrefixedHexString)] = toType(
        value,
        TypeOutput.PrefixedHexString
      )
      return previousValue
    },
    {}
  )

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
    verkleProof,
    verklePreState,
  }
}

export function getDifficulty(headerData: HeaderData): bigint | null {
  const { difficulty } = headerData
  if (difficulty !== undefined) {
    return toType(difficulty, TypeOutput.BigInt)
  }
  return null
}
