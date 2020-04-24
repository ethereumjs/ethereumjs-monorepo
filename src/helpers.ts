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
