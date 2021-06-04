import { isHexString } from 'ethjs-util'

/**
 * Returns a 0x-prefixed hex number string from a hex string or string integer.
 * @param {string} input string to check, convert, and return
 */
export const numberToHex = function (input?: string) {
  if (!input) return undefined
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

/**
 * Throws if a string is not hex prefixed
 * @param {string} input string to check hex prefix of
 */
export const assertIsHexString = function (input: string): void {
  if (!isHexString(input)) {
    const msg = `This method only supports 0x-prefixed hex strings but input was: ${input}`
    throw new Error(msg)
  }
}

/**
 * Throws if input is not a buffer
 * @param {Buffer} input value to check
 */
export const assertIsBuffer = function (input: Buffer): void {
  if (!Buffer.isBuffer(input)) {
    const msg = `This method only supports Buffer but input was: ${input}`
    throw new Error(msg)
  }
}

/**
 * Throws if input is not an array
 * @param {number[]} input value to check
 */
export const assertIsArray = function (input: number[]): void {
  if (!Array.isArray(input)) {
    const msg = `This method only supports number arrays but input was: ${input}`
    throw new Error(msg)
  }
}

/**
 * Throws if input is not a string
 * @param {string} input value to check
 */
export const assertIsString = function (input: string): void {
  if (typeof input !== 'string') {
    const msg = `This method only supports strings but input was: ${input}`
    throw new Error(msg)
  }
}
