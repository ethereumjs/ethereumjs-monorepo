import { hexToBytes, isHexString } from '@ethereumjs/util'

import type { Input } from '@ethereumjs/rlp'

/** JSON RLP input: nested arrays with `0x` hex strings (same convention as the rlp CLI). */
export function jsonToRlpInput(value: unknown): Input {
  if (typeof value === 'string') {
    if (isHexString(value)) {
      return hexToBytes(value)
    }
    throw new Error(`Expected 0x-prefixed hex string, got: ${value}`)
  }
  if (Array.isArray(value)) {
    return value.map((item) => jsonToRlpInput(item))
  }
  throw new Error(`Unsupported JSON for RLP input: ${typeof value}`)
}

export function rlpInputToStructured(value: Input): unknown {
  if (value instanceof Uint8Array) {
    const hex = `0x${Buffer.from(value).toString('hex')}`
    return hex
  }
  if (Array.isArray(value)) {
    return value.map((item) => rlpInputToStructured(item as Input))
  }
  return value
}
