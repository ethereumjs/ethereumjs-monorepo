import { EthereumJSErrorWithoutCode } from './errors.ts'
import { isHexString } from './internal.ts'

/** Assert that the input is a `0x`-prefixed hex string. @throws If validation fails */
export const assertIsHexString = function (input: string): void {
  if (!isHexString(input)) {
    const msg = `This method only supports 0x-prefixed hex strings but input was: ${input}`
    throw EthereumJSErrorWithoutCode(msg)
  }
}

/** Assert that the input is a `Uint8Array`. @throws If validation fails */
export const assertIsBytes = function (input: Uint8Array): void {
  if (!(input instanceof Uint8Array)) {
    const msg = `This method only supports Uint8Array but input was: ${input}`
    throw EthereumJSErrorWithoutCode(msg)
  }
}

/** Assert that the input is a number array. @throws If validation fails */
export const assertIsArray = function (input: number[]): void {
  if (!Array.isArray(input)) {
    const msg = `This method only supports number arrays but input was: ${input}`
    throw EthereumJSErrorWithoutCode(msg)
  }
}

/** Assert that the input is a string. @throws If validation fails */
export const assertIsString = function (input: string): void {
  if (typeof input !== 'string') {
    const msg = `This method only supports strings but input was: ${input}`
    throw EthereumJSErrorWithoutCode(msg)
  }
}
