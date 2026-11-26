import { bytesToUnprefixedHex } from '@ethereumjs/util'

import { verifyMerkleProof } from '../proof/proof.ts'
import { decodeRlpToBinaryNode, encodeBinaryNodeToRlp, unpackBinaryRecord } from './nodeCodec.ts'
import {
  appendNibble,
  commonPrefixLen,
  compareKeysLex,
  concatNibbles,
  keyToNibbles,
  packPath,
} from './pathKey.ts'

import type { Proof } from '../types.ts'
import type { BinaryPathMPT } from './binaryPathMPT.ts'
import type { BinaryBranchNode, BinaryExtensionNode, BinaryLeafNode } from './nodeCodec.ts'

export async function createProof(
  trie: BinaryPathMPT,
  key: Uint8Array,
  anchorId?: string | bigint,
): Promise<Proof> {
  trie._assertKeyMatchesPrefix(key)
  if (anchorId !== undefined && trie._anchorRing.rootFor(anchorId) === undefined) {
    throw new Error('Unknown anchor id')
  }
  const rootBytes = await trie._readRecordAt(packPath(new Uint8Array(0)), anchorId)
  if (rootBytes === null) {
    return []
  }
  const proof: Proof = []
  let path: Uint8Array = new Uint8Array(0)
  let rem: Uint8Array = keyToNibbles(key, trie._prefixLength)
  let current: BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode =
    await trie._materializeRecord(path, rootBytes)
  let currentIsInline = false

  while (true) {
    if (!currentIsInline) {
      proof.push(encodeBinaryNodeToRlp(current))
    }
    if (current.kind === 'leaf') {
      break
    }
    if (current.kind === 'extension') {
      const lcp = commonPrefixLen(current.path, rem)
      if (lcp < current.path.length) {
        break
      }
      path = concatNibbles(path, current.path)
      rem = rem.subarray(current.path.length)
      if (current.child.inline) {
        current = decodeRlpToBinaryNode(current.child.rlp)
        currentIsInline = true
      } else {
        const nextBytes = await trie._readRecordAt(packPath(path), anchorId)
        if (nextBytes === null) break
        current = await trie._materializeRecord(path, nextBytes)
        currentIsInline = false
      }
      continue
    }
    // Branch node
    if (rem.length === 0) {
      break
    }
    const nibble = rem[0]!
    const childRef = current.children[nibble]
    if (childRef === null || childRef === undefined) {
      break
    }
    path = appendNibble(path, nibble)
    rem = rem.subarray(1)
    if (childRef.inline) {
      current = decodeRlpToBinaryNode(childRef.rlp)
      currentIsInline = true
    } else {
      const nextBytes = await trie._readRecordAt(packPath(path), anchorId)
      if (nextBytes === null) break
      current = await trie._materializeRecord(path, nextBytes)
      currentIsInline = false
    }
  }
  return proof
}

export async function createMultiProof(
  trie: BinaryPathMPT,
  keys: Uint8Array[],
  anchorId?: string | bigint,
): Promise<Proof> {
  const sorted = keys.slice().sort(compareKeysLex)
  const seen = new Set<string>()
  const proof: Proof = []
  for (const key of sorted) {
    const p = await createProof(trie, key, anchorId)
    for (const nodeRlp of p) {
      const h = bytesToUnprefixedHex(trie._hashRlp(nodeRlp))
      if (!seen.has(h)) {
        seen.add(h)
        proof.push(nodeRlp)
      }
    }
  }
  return proof
}

export async function createRangeBoundaryProof(
  trie: BinaryPathMPT,
  originHash32: Uint8Array,
  lastHash32: Uint8Array,
  anchorId?: string | bigint,
): Promise<Proof> {
  const left = await createProof(trie, originHash32, anchorId)
  const right = await createProof(trie, lastHash32, anchorId)
  const seen = new Set<string>()
  const out: Proof = []
  for (const nodeRlp of [...left, ...right]) {
    const id = bytesToUnprefixedHex(trie._hashRlp(nodeRlp))
    if (seen.has(id)) continue
    seen.add(id)
    out.push(nodeRlp)
  }
  return out
}

export { unpackBinaryRecord, verifyMerkleProof }
