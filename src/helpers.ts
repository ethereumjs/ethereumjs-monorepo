const ethjsUtil = require('ethjs-util')

/**
 * Throws if a string is not hex prefixed
 * @param {string} input string to check hex prefix of
 */
export const assertIsHexString = function(input: string): void {
  const msg = `This method only supports 0x-prefixed hex strings but input was: ${input}`
  if (!ethjsUtil.isHexString(input)) {
    throw new Error(msg)
  }
}

/**
 * Throws if input is not a buffer
 * @param {Buffer} input value to check
 */
export const assertIsBuffer = function(input: Buffer): void {
  const msg = `This method only supports Buffer but input was: ${input}`
  if (!Buffer.isBuffer(input)) {
    throw new Error(msg)
  }
}

/**
 * Throws if input is not an array
 * @param {number[]} input value to check
 */
export const assertIsArray = function(input: number[]): void {
  const msg = `This method only supports number arrays but input was: ${input}`
  if (!Array.isArray(input)) {
    throw new Error(msg)
  }
}

/**
 * Throws if input is not a string
 * @param {string} input value to check
 */
export const assertIsString = function(input: string): void {
  const msg = `This method only supports strings but input was: ${input}`
  if (typeof input !== 'string') {
    throw new Error(msg)
  }
}
