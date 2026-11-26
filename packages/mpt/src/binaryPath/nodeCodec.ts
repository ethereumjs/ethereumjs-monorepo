import { RLP } from '@ethereumjs/rlp'
import { equalsBytes } from '@ethereumjs/util'

import { BranchMPTNode, ExtensionMPTNode, LeafMPTNode } from '../node/index.ts'
import { isRawMPTNode } from '../node/util.ts'
import { addHexPrefix } from '../util/hex.ts'
import { bytesToNibbles, matchingNibbleLength, nibblesTypeToPackedBytes } from '../util/nibbles.ts'

import type { MPTNode, NodeReferenceOrRawMPTNode } from '../types.ts'
import type { BinaryPathKeccak } from './types.ts'

const TAG_BRANCH = 0x01
const TAG_EXTENSION = 0x02
const TAG_LEAF = 0x03

export const RECORD_HASH_LEN = 32

/** Serialize an in-memory node to canonical Ethereum MPT RLP. */
export function encodeNodeToRlp(node: MPTNode): Uint8Array {
  return node.serialize()
}

export function hashCanonicalRlp(rlp: Uint8Array, keccak256: BinaryPathKeccak): Uint8Array {
  return keccak256(rlp)
}

/** Packed body (no keccak trailer). */
export function encodeNodeBody(node: MPTNode): Uint8Array {
  if (node instanceof BranchMPTNode) {
    const children = node.getChildren()
    let childMask = 0
    let inlineMask = 0
    const parts: number[] = [TAG_BRANCH]
    const childPayloads: Uint8Array[] = []

    for (const [idx, ref] of children) {
      childMask |= 1 << idx
      const rlp = childRefToRlpBytes(ref)
      if (rlp.length < 32) {
        inlineMask |= 1 << idx
        const inline = new Uint8Array(1 + rlp.length)
        inline[0] = rlp.length
        inline.set(rlp, 1)
        childPayloads.push(inline)
      } else {
        const h = hashCanonicalRlp(rlp, keccak_256_default)
        childPayloads.push(h)
      }
    }
    const header = new Uint8Array(1 + 4)
    header[0] = TAG_BRANCH
    header[1] = (childMask >> 8) & 0xff
    header[2] = childMask & 0xff
    header[3] = (inlineMask >> 8) & 0xff
    header[4] = inlineMask & 0xff

    const val = node.value()
    const chunks = [header, ...childPayloads]
    if (val !== null && val.length > 0) {
      chunks.push(val)
    }
    return concatChunks(chunks)
  }
  if (node instanceof ExtensionMPTNode) {
    return encodeExtensionOrLeafBody(TAG_EXTENSION, node.key(), node.value() as Uint8Array)
  }
  if (node instanceof LeafMPTNode) {
    return encodeExtensionOrLeafBody(TAG_LEAF, node.key(), node.value())
  }
  throw new Error('Unknown node type')
}

function encodeExtensionOrLeafBody(
  tag: number,
  nibbles: number[],
  childOrValue: Uint8Array,
): Uint8Array {
  const pathBytes = packedPathBytesFromNibbles(nibbles)
  const pathLen = nibbles.length
  if (tag === TAG_LEAF) {
    const head = new Uint8Array(2 + pathBytes.length)
    head[0] = tag
    head[1] = pathLen
    head.set(pathBytes, 2)
    return concatChunks([head, childOrValue])
  }
  const childIsInline = childOrValue.length < 32 ? 1 : 0
  const head = new Uint8Array(3 + pathBytes.length)
  head[0] = tag
  head[1] = pathLen
  head.set(pathBytes, 2)
  head[2 + pathBytes.length] = childIsInline
  if (childIsInline) {
    const inline = new Uint8Array(1 + childOrValue.length)
    inline[0] = childOrValue.length
    inline.set(childOrValue, 1)
    return concatChunks([head, inline])
  }
  return concatChunks([head, childOrValue])
}

function packedPathBytesFromNibbles(nibbles: number[]): Uint8Array {
  const out = new Uint8Array(Math.ceil(nibbles.length / 2))
  for (let i = 0; i < nibbles.length; i++) {
    if (i % 2 === 0) {
      out[i >> 1] = nibbles[i]! << 4
    } else {
      out[i >> 1] |= nibbles[i]!
    }
  }
  return out
}

function childRefToRlpBytes(ref: NodeReferenceOrRawMPTNode): Uint8Array {
  if (ref === null) return new Uint8Array(0)
  if (ref instanceof Uint8Array && ref.length === 32) {
    return ref
  }
  if (ref instanceof Uint8Array) {
    return ref
  }
  if (isRawMPTNode(ref)) {
    return RLP.encode(ref)
  }
  return new Uint8Array(0)
}

/** Full stored record: body + keccak(canonical RLP) trailer. */
export function packRecord(node: MPTNode, keccak256: BinaryPathKeccak): Uint8Array {
  const body = encodeNodeBody(node)
  const rlp = encodeNodeToRlp(node)
  const hash = hashCanonicalRlp(rlp, keccak256)
  const out = new Uint8Array(body.length + RECORD_HASH_LEN)
  out.set(body, 0)
  out.set(hash, body.length)
  return out
}

export function recordBody(bytes: Uint8Array): Uint8Array {
  if (bytes.length < RECORD_HASH_LEN) return bytes
  return bytes.subarray(0, bytes.length - RECORD_HASH_LEN)
}

export function recordHash(bytes: Uint8Array): Uint8Array | null {
  if (bytes.length < RECORD_HASH_LEN) return null
  return bytes.subarray(bytes.length - RECORD_HASH_LEN)
}

export function decodeRecordToNode(bytes: Uint8Array): MPTNode {
  const body = recordBody(bytes)
  const tag = body[0]!
  if (tag === TAG_BRANCH) {
    const childMask = (body[1]! << 8) | body[2]!
    const inlineMask = (body[3]! << 8) | body[4]!
    const branch = new BranchMPTNode()
    let offset = 5
    for (let i = 0; i < 16; i++) {
      if ((childMask & (1 << i)) === 0) continue
      if ((inlineMask & (1 << i)) !== 0) {
        const len = body[offset]!
        offset++
        const raw = body.subarray(offset, offset + len)
        offset += len
        branch.setBranch(i, raw)
      } else {
        const h = body.subarray(offset, offset + 32)
        offset += 32
        branch.setBranch(i, h)
      }
    }
    if (offset < body.length) {
      branch.value(body.subarray(offset))
    }
    return branch
  }
  if (tag === TAG_EXTENSION) {
    const pathLen = body[1]!
    const pathBytesLen = Math.ceil(pathLen / 2)
    const nibbles = unpackPathBytes(body.subarray(2, 2 + pathBytesLen), pathLen)
    const childIsInline = body[2 + pathBytesLen]!
    let childOffset = 3 + pathBytesLen
    const child =
      childIsInline === 1
        ? (() => {
            const len = body[childOffset]!
            childOffset++
            return body.subarray(childOffset, childOffset + len)
          })()
        : body.subarray(childOffset, childOffset + 32)
    return new ExtensionMPTNode(nibbles, child)
  }
  if (tag === TAG_LEAF) {
    const pathLen = body[1]!
    const pathBytesLen = Math.ceil(pathLen / 2)
    const nibbles = unpackPathBytes(body.subarray(2, 2 + pathBytesLen), pathLen)
    const val = body.subarray(2 + pathBytesLen)
    return new LeafMPTNode(nibbles, val)
  }
  throw new Error(`Unknown packed node tag 0x${tag.toString(16)}`)
}

function unpackPathBytes(buf: Uint8Array, pathLen: number): number[] {
  const nibbles: number[] = []
  for (let i = 0; i < pathLen; i++) {
    const byte = buf[i >> 1]!
    nibbles.push(i % 2 === 0 ? byte >> 4 : byte & 0x0f)
  }
  return nibbles
}

function concatChunks(chunks: Uint8Array[]): Uint8Array {
  let len = 0
  for (const c of chunks) len += c.length
  const out = new Uint8Array(len)
  let o = 0
  for (const c of chunks) {
    out.set(c, o)
    o += c.length
  }
  return out
}

import { keccak_256 as keccak_256_default } from '@noble/hashes/sha3.js'

/** Format a child reference for parents (hash or inline raw). */
export function formatChildRef(
  node: MPTNode,
  topLevel: boolean,
  keccak256: BinaryPathKeccak,
): Uint8Array | NodeReferenceOrRawMPTNode {
  const encoded = encodeNodeToRlp(node)
  if (encoded.length >= 32 || topLevel) {
    return hashCanonicalRlp(encoded, keccak256)
  }
  return node.raw() as NodeReferenceOrRawMPTNode
}

export { matchingNibbleLength, bytesToNibbles, nibblesTypeToPackedBytes, addHexPrefix, equalsBytes }
