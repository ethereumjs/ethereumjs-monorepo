import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

/** Pack nibble path (0..64 nibbles) into `[lengthByte, ...packedBytes]`. */
export function packPath(nibbles: ArrayLike<number>): Uint8Array {
  const len = nibbles.length
  if (len > 64) {
    throw new Error('Path exceeds 64 nibbles')
  }
  const byteCount = (len + 1) >> 1
  const out = new Uint8Array(1 + byteCount)
  out[0] = len
  for (let i = 0; i < byteCount; i++) {
    const ni = i << 1
    const hi = nibbles[ni]! & 0x0f
    const lo = ni + 1 < len ? nibbles[ni + 1]! & 0x0f : 0
    out[1 + i] = (hi << 4) | lo
  }
  return out
}

/** Unpack a path key into a `Uint8Array` of nibble values (`0..15`). */
export function unpackPath(pathKey: Uint8Array): Uint8Array {
  const len = pathKey[0] ?? 0
  const nibbles = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    const byte = pathKey[1 + (i >> 1)]!
    nibbles[i] = (i & 1) === 0 ? byte >> 4 : byte & 0x0f
  }
  return nibbles
}

/** Expand key bytes into nibbles (`0..15`), optionally stripping `prefixLen` leading nibbles. */
export function keyToNibbles(key: Uint8Array, prefixLen = 0): Uint8Array {
  const total = key.length << 1
  const outLen = total - prefixLen
  const out = new Uint8Array(outLen)
  for (let i = 0; i < outLen; i++) {
    const kIdx = prefixLen + i
    const byte = key[kIdx >> 1]!
    out[i] = (kIdx & 1) === 0 ? byte >> 4 : byte & 0x0f
  }
  return out
}

/** Pack an even-length nibble array (`0..15`) back into raw key bytes. */
export function nibblesToKeyBytes(nibbles: ArrayLike<number>): Uint8Array {
  if ((nibbles.length & 1) !== 0) {
    throw new Error('Cannot convert odd-length nibble path to key bytes')
  }
  const out = new Uint8Array(nibbles.length >> 1)
  for (let i = 0; i < out.length; i++) {
    out[i] = ((nibbles[i << 1]! & 0x0f) << 4) | (nibbles[(i << 1) + 1]! & 0x0f)
  }
  return out
}

/** Nibble at index `i` in a key (two nibbles per byte). */
export function nibbleAtKey(key: Uint8Array, i: number): number {
  const byte = key[i >> 1]!
  return (i & 1) === 0 ? byte >> 4 : byte & 0x0f
}

/** Length of longest common prefix between two nibble sequences. */
export function commonPrefixLen(a: ArrayLike<number>, b: ArrayLike<number>): number {
  const max = Math.min(a.length, b.length)
  let i = 0
  while (i < max && a[i] === b[i]) {
    i++
  }
  return i
}

/** Concatenate two nibble arrays. */
export function concatNibbles(a: ArrayLike<number>, b: ArrayLike<number>): Uint8Array {
  const out = new Uint8Array(a.length + b.length)
  for (let i = 0; i < a.length; i++) out[i] = a[i]!
  for (let i = 0; i < b.length; i++) out[a.length + i] = b[i]!
  return out
}

/** Append one nibble (`0..15`) to a nibble path. */
export function appendNibble(path: Uint8Array, nibble: number): Uint8Array {
  const out = new Uint8Array(path.length + 1)
  out.set(path, 0)
  out[path.length] = nibble & 0x0f
  return out
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
  return packPath(appendNibble(unpackPath(pathKey), nibble))
}

export function pathKeyHex(pathKey: Uint8Array): string {
  return bytesToUnprefixedHex(pathKey)
}

export function ownedPathKey(pathKey: Uint8Array): Uint8Array {
  const c = new Uint8Array(pathKey.length)
  c.set(pathKey)
  return c
}

export function pathKeysEqual(a: Uint8Array, b: Uint8Array): boolean {
  return equalsBytes(a, b)
}
