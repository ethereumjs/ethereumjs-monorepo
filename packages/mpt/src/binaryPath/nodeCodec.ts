import { RLP } from '@ethereumjs/rlp'
import { equalsBytes } from '@ethereumjs/util'

import { BranchMPTNode, ExtensionMPTNode, LeafMPTNode } from '../node/index.ts'
import { isRawMPTNode } from '../node/util.ts'
import { addHexPrefix } from '../util/hex.ts'
import { bytesToNibbles, matchingNibbleLength, nibblesTypeToPackedBytes } from '../util/nibbles.ts'

import type { MPTNode, NodeReferenceOrRawMPTNode } from '../types.ts'
import type { BinaryPathKeccak } from './types.ts'

export const TAG_BRANCH = 0x01
export const TAG_EXTENSION = 0x02
export const TAG_LEAF = 0x03
/** Interior-only leaf pointer: stores path suffix + 32B hash trailer (value owned by external leaf store). */
export const TAG_EXTERNAL_LEAF = 0x04

export const RECORD_HASH_LEN = 32

export type BinaryChildRef = { inline: false; hash: Uint8Array } | { inline: true; rlp: Uint8Array }

export type BinaryBranchNode = {
  kind: 'branch'
  children: (BinaryChildRef | null)[]
  value: Uint8Array
}

export type BinaryExtensionNode = {
  kind: 'extension'
  path: Uint8Array
  child: BinaryChildRef
}

export type BinaryLeafNode = {
  kind: 'leaf'
  path: Uint8Array
  value: Uint8Array
}

export type BinaryExternalLeafNode = {
  kind: 'external-leaf'
  path: Uint8Array
}

export type BinaryPathNode =
  | BinaryBranchNode
  | BinaryExtensionNode
  | BinaryLeafNode
  | BinaryExternalLeafNode

const EMPTY_RLP_BYTES = new Uint8Array([0x80])

/** Encode raw pre-encoded RLP items as a single canonical RLP list without decoding inline children. */
function encodePreEncodedRlpList(items: Uint8Array[]): Uint8Array {
  let payloadLen = 0
  for (const item of items) payloadLen += item.length
  let header: Uint8Array
  if (payloadLen < 56) {
    header = new Uint8Array([0xc0 + payloadLen])
  } else {
    const lenBytes = encodeLengthBigEndian(payloadLen)
    header = new Uint8Array(1 + lenBytes.length)
    header[0] = 0xf7 + lenBytes.length
    header.set(lenBytes, 1)
  }
  const out = new Uint8Array(header.length + payloadLen)
  out.set(header, 0)
  let off = header.length
  for (const item of items) {
    out.set(item, off)
    off += item.length
  }
  return out
}

function encodeLengthBigEndian(len: number): Uint8Array {
  const tmp: number[] = []
  let n = len
  while (n > 0) {
    tmp.push(n & 0xff)
    n >>>= 8
  }
  tmp.reverse()
  return Uint8Array.from(tmp)
}

/** Compact Hex-Prefix encoding for MPT extension (`isLeaf = false`) or leaf (`isLeaf = true`). */
export function encodeHexPrefix(nibbles: Uint8Array, isLeaf: boolean): Uint8Array {
  const flag = isLeaf ? 2 : 0
  const odd = (nibbles.length & 1) === 1
  if (odd) {
    const out = new Uint8Array(1 + (nibbles.length >> 1))
    out[0] = ((flag | 1) << 4) | (nibbles[0]! & 0x0f)
    for (let i = 1; i < nibbles.length; i += 2) {
      out[1 + (i >> 1)] = ((nibbles[i]! & 0x0f) << 4) | (nibbles[i + 1]! & 0x0f)
    }
    return out
  }
  const out = new Uint8Array(1 + (nibbles.length >> 1))
  out[0] = flag << 4
  for (let i = 0; i < nibbles.length; i += 2) {
    out[1 + (i >> 1)] = ((nibbles[i]! & 0x0f) << 4) | (nibbles[i + 1]! & 0x0f)
  }
  return out
}

/** Decode Hex-Prefix bytes back into `{ isLeaf, nibbles }`. */
export function decodeHexPrefix(hp: Uint8Array): { isLeaf: boolean; nibbles: Uint8Array } {
  if (hp.length === 0) return { isLeaf: false, nibbles: new Uint8Array(0) }
  const first = hp[0]!
  const prefix = first >> 4
  const isLeaf = (prefix & 2) !== 0
  const isOdd = (prefix & 1) !== 0
  const total = (hp.length - 1) * 2 + (isOdd ? 1 : 0)
  const nibbles = new Uint8Array(total)
  let outIdx = 0
  if (isOdd) {
    nibbles[outIdx++] = first & 0x0f
  }
  for (let i = 1; i < hp.length; i++) {
    const b = hp[i]!
    nibbles[outIdx++] = b >> 4
    nibbles[outIdx++] = b & 0x0f
  }
  return { isLeaf, nibbles }
}

/** Serialize a `BinaryPathNode` (branch / extension / leaf) into canonical Ethereum MPT RLP. */
export function encodeBinaryNodeToRlp(
  node: BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode,
): Uint8Array {
  if (node.kind === 'branch') {
    const items: Uint8Array[] = new Array(17)
    for (let i = 0; i < 16; i++) {
      const c = node.children[i]
      if (c === null || c === undefined) {
        items[i] = EMPTY_RLP_BYTES
      } else if (c.inline) {
        items[i] = c.rlp
      } else {
        items[i] = RLP.encode(c.hash)
      }
    }
    items[16] = node.value.length === 0 ? EMPTY_RLP_BYTES : RLP.encode(node.value)
    return encodePreEncodedRlpList(items)
  }
  if (node.kind === 'extension') {
    const keyItem = RLP.encode(encodeHexPrefix(node.path, false))
    const childItem = node.child.inline ? node.child.rlp : RLP.encode(node.child.hash)
    return encodePreEncodedRlpList([keyItem, childItem])
  }
  const keyItem = RLP.encode(encodeHexPrefix(node.path, true))
  const valItem = RLP.encode(node.value)
  return encodePreEncodedRlpList([keyItem, valItem])
}

/** Decode canonical Ethereum MPT RLP (e.g. an inline `< 32B` child) into a `BinaryPathNode`. */
export function decodeRlpToBinaryNode(
  rlp: Uint8Array,
): BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode {
  const raw = RLP.decode(rlp)
  if (!Array.isArray(raw)) {
    throw new Error('Invalid MPT node RLP: expected list')
  }
  if (raw.length === 17) {
    const children: (BinaryChildRef | null)[] = new Array(16).fill(null)
    for (let i = 0; i < 16; i++) {
      const slot = raw[i]
      if (slot instanceof Uint8Array) {
        if (slot.length === 0) {
          children[i] = null
        } else if (slot.length === 32) {
          children[i] = { inline: false, hash: slot }
        } else {
          throw new Error(`Unexpected branch child byte length ${slot.length}`)
        }
      } else if (Array.isArray(slot)) {
        children[i] = { inline: true, rlp: RLP.encode(slot) }
      }
    }
    const valSlot = raw[16]
    const value = valSlot instanceof Uint8Array ? valSlot : new Uint8Array(0)
    return { kind: 'branch', children, value }
  }
  if (raw.length === 2) {
    const hp = raw[0]
    if (!(hp instanceof Uint8Array)) {
      throw new Error('Invalid MPT node RLP: key must be bytes')
    }
    const { isLeaf, nibbles } = decodeHexPrefix(hp)
    if (isLeaf) {
      const val = raw[1] instanceof Uint8Array ? raw[1] : new Uint8Array(0)
      return { kind: 'leaf', path: nibbles, value: val }
    }
    const childRaw = raw[1]
    const child: BinaryChildRef =
      childRaw instanceof Uint8Array
        ? { inline: false, hash: childRaw }
        : { inline: true, rlp: RLP.encode(childRaw as never) }
    return { kind: 'extension', path: nibbles, child }
  }
  throw new Error(`Invalid MPT node RLP length ${raw.length}`)
}

/** Compute child reference for parent branch/extension (`< 32B` RLP inlined; else 32B hash). */
export function binaryNodeToChildRef(
  node: BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode,
  keccak256: BinaryPathKeccak,
): { ref: BinaryChildRef; rlp: Uint8Array; hash: Uint8Array } {
  const rlp = encodeBinaryNodeToRlp(node)
  const hash = keccak256(rlp)
  const ref: BinaryChildRef = rlp.length < 32 ? { inline: true, rlp } : { inline: false, hash }
  return { ref, rlp, hash }
}

function packNibblesBytes(nibbles: Uint8Array): Uint8Array {
  const out = new Uint8Array((nibbles.length + 1) >> 1)
  for (let i = 0; i < nibbles.length; i++) {
    if ((i & 1) === 0) {
      out[i >> 1] = (nibbles[i]! & 0x0f) << 4
    } else {
      out[i >> 1] |= nibbles[i]! & 0x0f
    }
  }
  return out
}

function unpackNibblesBytes(buf: Uint8Array, pathLen: number): Uint8Array {
  const nibbles = new Uint8Array(pathLen)
  for (let i = 0; i < pathLen; i++) {
    const byte = buf[i >> 1]!
    nibbles[i] = (i & 1) === 0 ? byte >> 4 : byte & 0x0f
  }
  return nibbles
}

/** Pack a `BinaryPathNode` + 32-byte canonical hash trailer for `BinaryPathNodeStore`. */
export function packBinaryRecord(node: BinaryPathNode, hash: Uint8Array): Uint8Array {
  if (hash.length !== RECORD_HASH_LEN) {
    throw new Error('packBinaryRecord requires a 32-byte hash trailer')
  }
  if (node.kind === 'branch') {
    let childMask = 0
    let inlineMask = 0
    let childrenBytes = 0
    for (let i = 0; i < 16; i++) {
      const c = node.children[i]
      if (c === null || c === undefined) continue
      childMask |= 1 << i
      if (c.inline) {
        inlineMask |= 1 << i
        childrenBytes += 1 + c.rlp.length
      } else {
        childrenBytes += 32
      }
    }
    const out = new Uint8Array(5 + childrenBytes + node.value.length + RECORD_HASH_LEN)
    out[0] = TAG_BRANCH
    out[1] = (childMask >> 8) & 0xff
    out[2] = childMask & 0xff
    out[3] = (inlineMask >> 8) & 0xff
    out[4] = inlineMask & 0xff
    let off = 5
    for (let i = 0; i < 16; i++) {
      const c = node.children[i]
      if (c === null || c === undefined) continue
      if (c.inline) {
        out[off++] = c.rlp.length
        out.set(c.rlp, off)
        off += c.rlp.length
      } else {
        out.set(c.hash, off)
        off += 32
      }
    }
    if (node.value.length > 0) {
      out.set(node.value, off)
      off += node.value.length
    }
    out.set(hash, off)
    return out
  }
  if (node.kind === 'extension') {
    const pathBytes = packNibblesBytes(node.path)
    const childLen = node.child.inline ? 1 + node.child.rlp.length : 32
    const out = new Uint8Array(3 + pathBytes.length + childLen + RECORD_HASH_LEN)
    out[0] = TAG_EXTENSION
    out[1] = node.path.length
    out.set(pathBytes, 2)
    let off = 2 + pathBytes.length
    out[off++] = node.child.inline ? 1 : 0
    if (node.child.inline) {
      out[off++] = node.child.rlp.length
      out.set(node.child.rlp, off)
      off += node.child.rlp.length
    } else {
      out.set(node.child.hash, off)
      off += 32
    }
    out.set(hash, off)
    return out
  }
  if (node.kind === 'leaf') {
    const pathBytes = packNibblesBytes(node.path)
    const out = new Uint8Array(2 + pathBytes.length + node.value.length + RECORD_HASH_LEN)
    out[0] = TAG_LEAF
    out[1] = node.path.length
    out.set(pathBytes, 2)
    const off = 2 + pathBytes.length
    out.set(node.value, off)
    out.set(hash, off + node.value.length)
    return out
  }
  // TAG_EXTERNAL_LEAF: stores path suffix + 32-byte hash trailer (no value duplication).
  const pathBytes = packNibblesBytes(node.path)
  const out = new Uint8Array(2 + pathBytes.length + RECORD_HASH_LEN)
  out[0] = TAG_EXTERNAL_LEAF
  out[1] = node.path.length
  out.set(pathBytes, 2)
  out.set(hash, 2 + pathBytes.length)
  return out
}

/** Unpack a stored binary record into `{ node, hash }`. */
export function unpackBinaryRecord(bytes: Uint8Array): { node: BinaryPathNode; hash: Uint8Array } {
  if (bytes.length < RECORD_HASH_LEN + 1) {
    throw new Error('Corrupt packed binary node record')
  }
  const body = bytes.subarray(0, bytes.length - RECORD_HASH_LEN)
  const hash = bytes.subarray(bytes.length - RECORD_HASH_LEN)
  const tag = body[0]!
  if (tag === TAG_BRANCH) {
    const childMask = (body[1]! << 8) | body[2]!
    const inlineMask = (body[3]! << 8) | body[4]!
    const children: (BinaryChildRef | null)[] = new Array(16).fill(null)
    let off = 5
    for (let i = 0; i < 16; i++) {
      if ((childMask & (1 << i)) === 0) continue
      if ((inlineMask & (1 << i)) !== 0) {
        const len = body[off++]!
        const rlp = body.slice(off, off + len)
        off += len
        children[i] = { inline: true, rlp }
      } else {
        const childHash = body.slice(off, off + 32)
        off += 32
        children[i] = { inline: false, hash: childHash }
      }
    }
    const value = off < body.length ? body.slice(off) : new Uint8Array(0)
    return { node: { kind: 'branch', children, value }, hash }
  }
  if (tag === TAG_EXTENSION) {
    const pathLen = body[1]!
    const pathBytesLen = (pathLen + 1) >> 1
    const path = unpackNibblesBytes(body.subarray(2, 2 + pathBytesLen), pathLen)
    let off = 2 + pathBytesLen
    const isInline = body[off++]! === 1
    const child: BinaryChildRef = isInline
      ? (() => {
          const len = body[off++]!
          const rlp = body.slice(off, off + len)
          return { inline: true, rlp }
        })()
      : { inline: false, hash: body.slice(off, off + 32) }
    return { node: { kind: 'extension', path, child }, hash }
  }
  if (tag === TAG_LEAF) {
    const pathLen = body[1]!
    const pathBytesLen = (pathLen + 1) >> 1
    const path = unpackNibblesBytes(body.subarray(2, 2 + pathBytesLen), pathLen)
    const value = body.slice(2 + pathBytesLen)
    return { node: { kind: 'leaf', path, value }, hash }
  }
  if (tag === TAG_EXTERNAL_LEAF) {
    const pathLen = body[1]!
    const pathBytesLen = (pathLen + 1) >> 1
    const path = unpackNibblesBytes(body.subarray(2, 2 + pathBytesLen), pathLen)
    return { node: { kind: 'external-leaf', path }, hash }
  }
  throw new Error(`Unknown packed node tag 0x${tag.toString(16)}`)
}

export function recordBody(bytes: Uint8Array): Uint8Array {
  if (bytes.length < RECORD_HASH_LEN) return bytes
  return bytes.subarray(0, bytes.length - RECORD_HASH_LEN)
}

export function recordHash(bytes: Uint8Array): Uint8Array | null {
  if (bytes.length < RECORD_HASH_LEN) return null
  return bytes.subarray(bytes.length - RECORD_HASH_LEN)
}

// --- Classic MPTNode codec interop helpers (used by nodeCodec.spec.ts and diagnostics) ---

/** Serialize an in-memory classic `MPTNode` to canonical Ethereum MPT RLP. */
export function encodeNodeToRlp(node: MPTNode): Uint8Array {
  return node.serialize()
}

export function hashCanonicalRlp(rlp: Uint8Array, keccak256: BinaryPathKeccak): Uint8Array {
  return keccak256(rlp)
}

function mptChildRefToBinaryChild(ref: NodeReferenceOrRawMPTNode): BinaryChildRef | null {
  if (ref === null) return null
  if (ref instanceof Uint8Array) {
    if (ref.length === 0) return null
    if (ref.length === 32) return { inline: false, hash: ref }
    return { inline: true, rlp: ref }
  }
  if (isRawMPTNode(ref)) {
    return { inline: true, rlp: RLP.encode(ref) }
  }
  return null
}

function mptNodeToBinaryNode(
  node: MPTNode,
): BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode {
  if (node instanceof BranchMPTNode) {
    const children: (BinaryChildRef | null)[] = new Array(16).fill(null)
    for (const [idx, ref] of node.getChildren()) {
      children[idx] = mptChildRefToBinaryChild(ref)
    }
    const val = node.value()
    return { kind: 'branch', children, value: val ?? new Uint8Array(0) }
  }
  if (node instanceof ExtensionMPTNode) {
    const val = node.value()
    const child = mptChildRefToBinaryChild(val as unknown as NodeReferenceOrRawMPTNode)
    if (child === null) throw new Error('ExtensionMPTNode missing child reference')
    return { kind: 'extension', path: Uint8Array.from(node.key()), child }
  }
  if (node instanceof LeafMPTNode) {
    return { kind: 'leaf', path: Uint8Array.from(node.key()), value: node.value() }
  }
  throw new Error('Unknown node type')
}

/** Pack a classic `MPTNode` into a canonical binary record with 32-byte keccak trailer. */
export function packRecord(node: MPTNode, keccak256: BinaryPathKeccak): Uint8Array {
  const bin = mptNodeToBinaryNode(node)
  const rlp = encodeBinaryNodeToRlp(bin)
  return packBinaryRecord(bin, keccak256(rlp))
}

/** Decode a packed binary record back into a classic `MPTNode` (with proper inline RLP decoding). */
export function decodeRecordToNode(bytes: Uint8Array): MPTNode {
  const { node } = unpackBinaryRecord(bytes)
  if (node.kind === 'branch') {
    const branch = new BranchMPTNode()
    for (let i = 0; i < 16; i++) {
      const c = node.children[i]
      if (c === null || c === undefined) continue
      if (c.inline) {
        branch.setBranch(i, RLP.decode(c.rlp) as NodeReferenceOrRawMPTNode)
      } else {
        branch.setBranch(i, c.hash)
      }
    }
    if (node.value.length > 0) {
      branch.value(node.value)
    }
    return branch
  }
  if (node.kind === 'extension') {
    const child = node.child.inline ? (RLP.decode(node.child.rlp) as Uint8Array) : node.child.hash
    return new ExtensionMPTNode(Array.from(node.path), child)
  }
  if (node.kind === 'leaf') {
    return new LeafMPTNode(Array.from(node.path), node.value)
  }
  throw new Error('Cannot decode external-leaf pointer to classic MPTNode without leaf value')
}

export { matchingNibbleLength, bytesToNibbles, nibblesTypeToPackedBytes, addHexPrefix, equalsBytes }
