import { utils } from '../src/index.js'

const { hexToBytes } = utils

// Global symbols in both browsers and Node.js since v11
// See https://github.com/microsoft/TypeScript/issues/31535
declare const TextEncoder: any
declare const TextDecoder: any

export function bytesToUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}

export function numberToBytes(a: bigint): Uint8Array {
  const hex = a.toString(16)
  const pad = hex.length % 2 ? `0${hex}` : hex
  return hexToBytes(pad)
}
