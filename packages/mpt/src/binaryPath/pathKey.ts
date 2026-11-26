import { bytesToHex, equalsBytes } from '@ethereumjs/util'

/** Pack nibble path (0..64 nibbles) into `[lengthByte, ...packedBytes]`. */
export function packPath(nibbles: readonly number[]): Uint8Array {
  const len = nibbles.length
  if (len > 64) {
    throw new Error('Path exceeds 64 nibbles')
  }
  const byteCount = Math.ceil(len / 2)
  const out = new Uint8Array(1 + byteCount)
  out[0] = len
  for (let i = 0; i < byteCount; i++) {
    const ni = i * 2
    const hi = nibbles[ni] ?? 0
    const lo = ni + 1 < len ? nibbles[ni + 1]! : 0
    out[1 + i] = (hi << 4) | lo
  }
  return out
}

/** Unpack a path key to nibbles. */
export function unpackPath(pathKey: Uint8Array): number[] {
  const len = pathKey[0] ?? 0
  const nibbles: number[] = []
  for (let i = 0; i < len; i++) {
    const byte = pathKey[1 + (i >> 1)]!
    nibbles.push(i % 2 === 0 ? byte >> 4 : byte & 0x0f)
  }
  return nibbles
}

/** Nibble at index `i` in a 32-byte key (two nibbles per byte). */
export function nibbleAtKey(key: Uint8Array, i: number): number {
  const byte = key[i >> 1]!
  return (i & 1) === 0 ? byte >> 4 : byte & 0x0f
}

/** Unsigned lexicographic compare of two byte keys. */
export function compareKeysLex(a: Uint8Array, b: Uint8Array): number {
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) {
    const d = a[i]! - b[i]!
    if (d !== 0) return d
  }
  return a.length - b.length
}

export function appendNibbleToPath(pathKey: Uint8Array, nibble: number): Uint8Array {
  return packPath([...unpackPath(pathKey), nibble])
}

export function pathKeyHex(pathKey: Uint8Array): string {
  return bytesToHex(pathKey)
}

export function ownedPathKey(pathKey: Uint8Array): Uint8Array {
  const c = new Uint8Array(pathKey.length)
  c.set(pathKey)
  return c
}

export function pathKeysEqual(a: Uint8Array, b: Uint8Array): boolean {
  return equalsBytes(a, b)
}
