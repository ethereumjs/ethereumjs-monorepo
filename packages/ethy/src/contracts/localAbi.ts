import { bytesToBigInt, bytesToHex } from '@ethereumjs/util'

import { shortAddress } from '../economy/format.ts'
import type { CatalogParam, EventCatalogEntry, FunctionCatalogEntry } from './signatureCatalog.ts'
import { lookupEventTopic0, lookupFunctionSelector } from './signatureCatalog.ts'

export type AbiScalarType =
  | 'address'
  | 'uint256'
  | 'uint128'
  | 'uint64'
  | 'uint8'
  | 'int256'
  | 'bool'
  | 'bytes32'
  | 'bytes4'
  | 'bytes'
  | 'string'
  | 'address[]'
  | 'uint256[]'

function readWord(data: Uint8Array, offset: number): Uint8Array | undefined {
  if (offset < 0 || offset + 32 > data.length) return undefined
  return data.subarray(offset, offset + 32)
}

function decodeScalar(type: AbiScalarType, word: Uint8Array): string | undefined {
  switch (type) {
    case 'address':
      return `0x${bytesToHex(word.subarray(12, 32))}`
    case 'uint256':
    case 'uint128':
    case 'uint64':
    case 'uint8':
      return bytesToBigInt(word).toString()
    case 'int256': {
      let v = bytesToBigInt(word)
      if (word[0]! & 0x80) {
        const mask = 2n ** 256n
        v -= mask
      }
      return v.toString()
    }
    case 'bool':
      return word.some((b) => b !== 0) ? 'true' : 'false'
    case 'bytes32':
    case 'bytes4':
      return bytesToHex(word)
    default:
      return undefined
  }
}

function decodeDynamicAt(
  data: Uint8Array,
  headOffset: number,
  type: 'bytes' | 'string' | 'address[]' | 'uint256[]',
): string | undefined {
  const rel = readWord(data, headOffset)
  if (rel === undefined) return undefined
  const off = Number(bytesToBigInt(rel))
  if (off < 0 || off >= data.length) return undefined
  const lenWord = readWord(data, off)
  if (lenWord === undefined) return undefined
  const len = Number(bytesToBigInt(lenWord))
  if (len < 0 || off + 32 + len > data.length) return undefined
  const payload = data.subarray(off + 32, off + 32 + len)
  if (type === 'bytes') return `0x${bytesToHex(payload)}`
  if (type === 'string') {
    try {
      const s = new TextDecoder('utf-8', { fatal: false }).decode(payload)
      const printable = /^[\x20-\x7e\u00a0-\ufffd]*$/.test(s)
      return printable ? `"${s}"` : `0x${bytesToHex(payload)}`
    } catch {
      return `0x${bytesToHex(payload)}`
    }
  }
  if (type === 'address[]' || type === 'uint256[]') {
    const count = len / 32
    if (count > 32 || !Number.isInteger(count)) return undefined
    const parts: string[] = []
    for (let i = 0; i < count; i++) {
      const w = readWord(data, off + 32 + i * 32)
      if (w === undefined) return undefined
      if (type === 'address[]') {
        parts.push(shortAddress(`0x${bytesToHex(w.subarray(12, 32))}`))
      } else {
        parts.push(bytesToBigInt(w).toString())
      }
    }
    return `[${parts.join(', ')}]`
  }
  return undefined
}

export function decodeAbiWords(
  types: AbiScalarType[],
  data: Uint8Array,
): Array<string | undefined> | undefined {
  if (types.length === 0) return []
  const staticTypes: AbiScalarType[] = []
  const dynamicTypes: AbiScalarType[] = []
  for (const t of types) {
    if (t === 'bytes' || t === 'string' || t.endsWith('[]')) dynamicTypes.push(t)
    else staticTypes.push(t)
  }
  const needed = staticTypes.length + dynamicTypes.length
  if (staticTypes.length * 32 > data.length && dynamicTypes.length === 0) return undefined
  const out: Array<string | undefined> = []
  let head = 0
  for (const t of types) {
    if (t === 'bytes' || t === 'string' || t === 'address[]' || t === 'uint256[]') {
      out.push(decodeDynamicAt(data, head, t))
      head += 32
    } else {
      const w = readWord(data, head)
      if (w === undefined) return undefined
      out.push(decodeScalar(t, w))
      head += 32
    }
  }
  if (out.length !== needed) return undefined
  return out
}

function formatParamValue(
  name: string,
  type: string,
  value: string | undefined,
  unit?: 'wei',
): string {
  if (value === undefined) return `${name}: ?`
  if (type === 'address') return `${name}: ${shortAddress(value)}`
  if (unit === 'wei') {
    try {
      const wei = BigInt(value)
      const eth = Number(wei) / 1e18
      if (Math.abs(eth) >= 0.0001) return `${name}: ${eth.toFixed(4)} ETH`
    } catch {
      // fall through
    }
  }
  return `${name}: ${value}`
}

export function formatDecodedCall(entry: FunctionCatalogEntry, data: Uint8Array): string {
  const args = data.length > 4 ? data.subarray(4) : new Uint8Array(0)
  if (entry.params.length === 0) return `${entry.name}()`
  const types = entry.params.map((p) => p.type as AbiScalarType)
  const decoded = decodeAbiWords(types, args)
  if (decoded === undefined) return `${entry.name}(…) `
  const parts = entry.params.map((p, i) => formatParamValue(p.name, p.type, decoded[i], p.unit))
  return `${entry.name}(${parts.join(', ')})`
}

export function formatCalldataPreview(data: Uint8Array, maxLen = 80): string {
  if (data.length < 4) return '0x'
  const sel = bytesToHex(data.subarray(0, 4))
  const entry = lookupFunctionSelector(`0x${sel}`)
  const base = entry !== undefined ? formatDecodedCall(entry, data) : `0x${sel}`
  return base.length <= maxLen ? base : `${base.slice(0, maxLen - 1)}…`
}

export function formatDecodedEvent(
  entry: EventCatalogEntry,
  topics: string[],
  data: Uint8Array,
): string {
  const parts: string[] = []
  for (let i = 0; i < entry.indexedParams.length; i++) {
    const p = entry.indexedParams[i]!
    const topic = topics[i + 1]
    if (topic === undefined) {
      parts.push(`${p.name}: ?`)
      continue
    }
    const raw = hexToBytes32(topic)
    if (raw === undefined) {
      parts.push(`${p.name}: ?`)
      continue
    }
    parts.push(formatParamValue(p.name, p.type, decodeScalar(p.type as AbiScalarType, raw)))
  }
  if (entry.dataParams.length > 0) {
    const types = entry.dataParams.map((p) => p.type as AbiScalarType)
    const decoded = decodeAbiWords(types, data)
    if (decoded !== undefined) {
      for (let i = 0; i < entry.dataParams.length; i++) {
        const p = entry.dataParams[i]!
        parts.push(formatParamValue(p.name, p.type, decoded[i], p.unit))
      }
    }
  }
  return `${entry.name}(${parts.join(', ')})`
}

function hexToBytes32(hex: string): Uint8Array | undefined {
  const h = hex.startsWith('0x') ? hex.slice(2) : hex
  if (h.length !== 64) return undefined
  const out = new Uint8Array(32)
  for (let i = 0; i < 32; i++) {
    const byte = Number.parseInt(h.slice(i * 2, i * 2 + 2), 16)
    if (Number.isNaN(byte)) return undefined
    out[i] = byte
  }
  return out
}

export function formatLogPreview(topics: string[], data: Uint8Array, maxLen = 80): string {
  if (topics.length === 0) return 'Log'
  const entry = lookupEventTopic0(topics[0]!)
  if (entry === undefined) {
    const t0 = topics[0]!.slice(0, 10)
    return t0.length <= maxLen ? t0 : `${t0.slice(0, maxLen - 1)}…`
  }
  const base = formatDecodedEvent(entry, topics, data)
  return base.length <= maxLen ? base : `${base.slice(0, maxLen - 1)}…`
}
