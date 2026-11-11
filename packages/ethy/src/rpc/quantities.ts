import { bytesToHex, hexToBigInt, hexToBytes, setLengthLeft } from '@ethereumjs/util'

export function quantityHex(n: bigint): string {
  if (n <= 0n) return '0x0'
  return `0x${n.toString(16)}`
}

export function parseQuantityHex(hex: string): bigint | undefined {
  try {
    if (!hex.startsWith('0x')) return undefined
    return hexToBigInt(hex as `0x${string}`)
  } catch {
    return undefined
  }
}

export function dataHex(bytes: Uint8Array): string {
  if (bytes.length === 0) return '0x'
  return bytesToHex(bytes)
}

export function data32Hex(bytes: Uint8Array): string {
  return bytesToHex(setLengthLeft(bytes, 32))
}

export function parseDataHex(hex: unknown): Uint8Array | undefined {
  if (typeof hex !== 'string') return undefined
  try {
    const normalized = (hex.startsWith('0x') ? hex : `0x${hex}`) as `0x${string}`
    return hexToBytes(normalized)
  } catch {
    return undefined
  }
}

export function parseData32Hex(hex: string): Uint8Array | undefined {
  try {
    const normalized = (hex.startsWith('0x') ? hex : `0x${hex}`) as `0x${string}`
    const raw = hexToBytes(normalized)
    return setLengthLeft(raw, 32)
  } catch {
    return undefined
  }
}

export function parseAddressHex(hex: string): Uint8Array | undefined {
  try {
    const raw = hexToBytes(hex as `0x${string}`)
    if (raw.length !== 20) return undefined
    return raw
  } catch {
    return undefined
  }
}
