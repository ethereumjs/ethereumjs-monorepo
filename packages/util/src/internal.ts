/*
The MIT License

Copyright (c) 2016 Nick Dodson. nickdodson.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE
 */

import { bytesToUnprefixedHex, utf8ToBytes } from './bytes.ts'
import { EthereumJSErrorWithoutCode } from './errors.ts'

import type { PrefixedHexString } from './types.ts'

/**
 * Return whether `value` is a `0x`-prefixed hex string, optionally requiring an exact byte length.
 *
 * @param length When set, the hex body must contain exactly this many bytes
 */
export function isHexString(value: string, length?: number): value is PrefixedHexString {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) return false

  if (typeof length !== 'undefined' && length > 0 && value.length !== 2 + 2 * length) return false

  return true
}

/** Remove a leading `0x` prefix when present. @throws If the input is not a string */
export const stripHexPrefix = (str: string): string => {
  if (typeof str !== 'string')
    throw EthereumJSErrorWithoutCode(
      `[stripHexPrefix] input must be type 'string', received ${typeof str}`,
    )

  return isHexString(str) ? str.slice(2) : str
}

/** Pad a hex string to an even number of nibbles. @throws If the input is not a string */
export function padToEven(value: string): string {
  let a = value

  if (typeof a !== 'string') {
    throw EthereumJSErrorWithoutCode(
      `[padToEven] value must be type 'string', received ${typeof a}`,
    )
  }

  if (a.length % 2) a = `0${a}`

  return a
}

/** Return the UTF-8 byte length of a string. @throws If the input is not a string */
export function getBinarySize(str: string) {
  if (typeof str !== 'string') {
    throw EthereumJSErrorWithoutCode(
      `[getBinarySize] method requires input type 'string', received ${typeof str}`,
    )
  }

  return utf8ToBytes(str).byteLength
}

/**
 * Return whether `superset` contains every element of `subset`.
 *
 * When `some` is true, succeed if any subset element is present instead of all.
 * @throws If either argument is not an array
 */
export function arrayContainsArray(
  superset: unknown[],
  subset: unknown[],
  some?: boolean,
): boolean {
  if (Array.isArray(superset) !== true) {
    throw EthereumJSErrorWithoutCode(
      `[arrayContainsArray] method requires input 'superset' to be an array, got type '${typeof superset}'`,
    )
  }
  if (Array.isArray(subset) !== true) {
    throw EthereumJSErrorWithoutCode(
      `[arrayContainsArray] method requires input 'subset' to be an array, got type '${typeof subset}'`,
    )
  }

  return subset[some === true ? 'some' : 'every']((value) => superset.indexOf(value) >= 0)
}

/** Decode a hex string (optional `0x` prefix) into an ASCII string. */
export function toAscii(hex: string): string {
  let str = ''
  let i = 0
  const l = hex.length

  if (hex.substring(0, 2) === '0x') i = 2

  for (; i < l; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16)
    str += String.fromCharCode(code)
  }

  return str
}

/** Encode a UTF-8 string as a compact `0x`-prefixed hex value with outer zero nibbles stripped. */
export function fromUtf8(stringValue: string) {
  const str = utf8ToBytes(stringValue)

  // Using deprecated bytesToUnprefixedHex for performance: we're building a hex string with 0x prefix,
  // so using bytesToUnprefixedHex avoids creating an intermediate prefixed string and then stripping it.
  return `0x${padToEven(bytesToUnprefixedHex(str)).replace(/^0+|0+$/g, '')}`
}

/** Encode an ASCII string as a `0x`-prefixed hex value. */
export function fromAscii(stringValue: string) {
  let hex = ''
  for (let i = 0; i < stringValue.length; i++) {
    const code = stringValue.charCodeAt(i)
    const n = code.toString(16)
    hex += n.length < 2 ? `0${n}` : n
  }

  return `0x${hex}`
}

/**
 * Collect string values for `key` from each object in `params`.
 *
 * @example
 * ```js
 * getKeys([{a: '1', b: '2'}, {a: '3', b: '4'}], 'a') => ['1', '3']
 * ```
 * @param allowEmpty When true, missing values become empty strings instead of throwing
 * @throws If `params` is not an array or a selected value is not a string
 */
export function getKeys(params: Record<string, string>[], key: string, allowEmpty?: boolean) {
  if (!Array.isArray(params)) {
    throw EthereumJSErrorWithoutCode(
      `[getKeys] method expects input 'params' to be an array, got ${typeof params}`,
    )
  }
  if (typeof key !== 'string') {
    throw EthereumJSErrorWithoutCode(
      `[getKeys] method expects input 'key' to be type 'string', got ${typeof params}`,
    )
  }

  const result = []

  for (let i = 0; i < params.length; i++) {
    let value = params[i][key]
    if (allowEmpty === true && !value) {
      value = ''
    } else if (typeof value !== 'string') {
      throw EthereumJSErrorWithoutCode(
        `invalid abi - expected type 'string', received ${typeof value}`,
      )
    }
    result.push(value)
  }

  return result
}
