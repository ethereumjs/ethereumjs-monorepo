import { hexToBytes, toBytes, unprefixedHexToBytes } from '@ethereumjs/util'

import type { Nibbles } from '../types.js'

// Reference: https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/
//
// Trie keys are dealt with in three distinct encodings:
//
// KEYBYTES encoding contains the actual key and nothing else. This encoding is the
// input to most API functions.
//
// HEX encoding contains one byte for each nibble of the key and an optional trailing
// 'terminator' byte of value 0x10 which indicates whether or not the node at the key
// contains a value. Hex key encoding is used for nodes loaded in memory because it's
// convenient to access.
//
// COMPACT encoding is defined by the Ethereum Yellow Paper (it's called "hex prefix
// encoding" there) and contains the bytes of the key and a flag. The high nibble of the
// first byte contains the flag; the lowest bit encoding the oddness of the length and
// the second-lowest encoding whether the node at the key is a value node. The low nibble
// of the first byte is zero in the case of an even number of nibbles and the first nibble
// in the case of an odd number. All remaining nibbles (now an even number) fit properly
// into the remaining bytes. Compact encoding is used for nodes stored on disk.

/**
 *
 * @param s byte sequence
 * @returns boolean indicating if input hex nibble sequence has terminator indicating leaf-node
 *          terminator is represented with 16 because a nibble ranges from 0 - 15(f)
 */
export const hasTerminator = (nibbles: Uint8Array) => {
  return nibbles.length > 0 && nibbles[nibbles.length - 1] === 16
}

export const nibblesToBytes = (nibbles: Uint8Array, bytes: Uint8Array) => {
  for (let bi = 0, ni = 0; ni < nibbles.length; bi += 1, ni += 2) {
    bytes[bi] = (nibbles[ni] << 4) | nibbles[ni + 1]
  }
}

export const hexToKeybytes = (hex: Uint8Array) => {
  if (hasTerminator(hex)) {
    hex = hex.subarray(0, hex.length - 1)
  }
  if (hex.length % 2 === 1) {
    throw Error("Can't convert hex key of odd length")
  }
  const key = new Uint8Array(hex.length / 2)
  nibblesToBytes(hex, key)

  return key
}

// hex to compact
export const nibblesToCompactBytes = (nibbles: Uint8Array) => {
  let terminator = 0
  if (hasTerminator(nibbles)) {
    terminator = 1
    // Remove the terminator from the sequence
    nibbles = nibbles.subarray(0, nibbles.length - 1)
  }
  const buf = new Uint8Array(nibbles.length / 2 + 1)
  // Shift the terminator info into the first nibble of buf[0]
  buf[0] = terminator << 5
  // If odd length, then add that flag into the first nibble and put the odd nibble to
  // second part of buf[0] which otherwise will be left padded with a 0
  if ((nibbles.length & 1) === 1) {
    buf[0] |= 1 << 4
    buf[0] |= nibbles[0]
    nibbles = nibbles.subarray(1)
  }
  // create bytes out of the rest even nibbles
  nibblesToBytes(nibbles, buf.subarray(1))
  return buf
}

export const bytesToNibbles = (str: Uint8Array) => {
  const l = str.length * 2 + 1
  const nibbles = new Uint8Array(l)
  for (let i = 0; i < str.length; i++) {
    const b = str[i]
    nibbles[i * 2] = b / 16
    nibbles[i * 2 + 1] = b % 16
  }
  // This will get removed from calling function if the first nibble
  // indicates that terminator is not present
  nibbles[l - 1] = 16
  return nibbles
}

export const compactBytesToNibbles = (compact: Uint8Array) => {
  if (compact.length === 0) {
    return compact
  }
  let base = bytesToNibbles(compact)
  // delete terminator flag if terminator flag was not in first nibble
  if (base[0] < 2) {
    base = base.subarray(0, base.length - 1)
  }
  // chop the terminator nibble and the even padding (if there is one)
  // i.e.  chop 2 left nibbles when even else 1 when odd
  const chop = 2 - (base[0] & 1)
  return base.subarray(chop)
}

/**
 * Packs every two nibbles into a single byte
 *
 * @param arr Nibble typed nibble array
 * @returns Uint8Array typed byte array
 */
export const nibbleTypeToPackedBytes = (arr: Nibbles): Uint8Array => {
  const buf = new Uint8Array(arr.length / 2)
  for (let i = 0; i < buf.length; i++) {
    let q = i * 2
    buf[i] = (arr[q] << 4) + arr[++q]
  }

  return buf
}

/**
 * Converts each nibble into a single byte
 *
 * @param arr Nibble typed nibble array
 * @returns Uint8Array typed byte array
 */
export const nibbleTypeToByteType = (arr: Nibbles): Uint8Array => {
  const l = arr.length
  const buf = new Uint8Array(l)
  for (let i = 0; i < buf.length; i++) {
    buf[i] = arr[i]
  }

  return buf
}

/**
 * Turns each byte into a single nibble, only extracting the lower nibble of each byte
 *
 * @param key Uint8Array typed byte array
 * @returns Nibble typed nibble array
 */
export const byteTypeToNibbleType = (key: Uint8Array): Nibbles => {
  const bkey = toBytes(key)
  const nibbles = [] as Nibbles

  for (let i = 0; i < bkey.length; i++) {
    const q = i
    nibbles[q] = bkey[i] % 16
  }

  return nibbles
}

/**
 * Takes a string path and extends it by the given extension nibbles
 *
 * @param path String node path
 * @param extension nibbles to extend by
 * @param retType string indicating whether to return the key in "keybyte" or "hex" encoding
 * @returns hex-encoded key
 */
export const pathToHexKey = (path: string, extension: Nibbles, retType: string): Uint8Array => {
  const b = hexToBytes(`0x${path}`)
  const n = byteTypeToNibbleType(b)
  if (retType === 'hex') {
    return nibbleTypeToByteType(n.concat(extension))
  } else if (retType === 'keybyte') {
    return nibbleTypeToPackedBytes(n.concat(extension))
  }
  throw Error('retType must be either "keybyte" or "hex"')
}

export const mergeAndFormatKeyPaths = (pathStrings: string[]) => {
  const ret: string[][] = []
  let paths: string[] = []
  let i = 0
  while (i < pathStrings.length) {
    const outterPathString = pathStrings[i]!.split('/')
    const outterAccountPath = outterPathString[0]
    const outterStoragePath = outterPathString[1]

    paths.push(outterAccountPath)
    if (outterStoragePath !== undefined) {
      paths.push(outterStoragePath)
    }

    let j = ++i
    while (j < pathStrings.length) {
      const innerPathString = pathStrings[j]!.split('/')
      const innerAccountPath = innerPathString[0]
      const innerStoragePath = innerPathString[1]

      if (innerAccountPath === outterAccountPath) {
        paths.push(innerStoragePath)
      } else {
        ret.push(paths)
        paths = []
        i = j
        break
      }
      j++
    }
    if (paths.length > 0) {
      ret.push(paths)
      paths = []
    }
  }
  if (paths.length > 0) ret.push(paths)

  return ret.map((pathStrings) =>
    pathStrings.map((s) => {
      if (s.length < 64) {
        // partial path is compact encoded
        return nibblesToCompactBytes(unprefixedHexToBytes(s))
      } else {
        // full path is keybyte encoded
        return hexToKeybytes(unprefixedHexToBytes(s))
      }
    })
  )
}
