import { equalsBytes } from '@ethereumjs/util'

import { createMerkleProof, verifyMerkleProof } from '../proof/proof.ts'
import { decodeRecordToNode, encodeNodeToRlp } from './nodeCodec.ts'
import { packPath } from './pathKey.ts'

import type { Proof } from '../types.ts'
import type { BinaryPathMPT } from './binaryPathMPT.ts'

export async function createProof(
  trie: BinaryPathMPT,
  key: Uint8Array,
  anchorId?: string | bigint,
): Promise<Proof> {
  if (anchorId === undefined) {
    return createMerkleProof(trie._inner, key)
  }
  const anchorRoot = trie._anchorRing.rootFor(anchorId)
  if (anchorRoot === undefined) {
    throw new Error('Unknown anchor id')
  }
  return createProofAtAnchor(trie, key, anchorId, anchorRoot)
}

async function createProofAtAnchor(
  trie: BinaryPathMPT,
  key: Uint8Array,
  anchorId: string | bigint,
  anchorRoot: Uint8Array,
): Promise<Proof> {
  const inner = trie._inner
  const { stack } = await inner.findPath(key, true)
  const nodes: Uint8Array[] = []
  for (const node of stack) {
    nodes.push(encodeNodeToRlp(node))
  }
  if (nodes.length === 0) {
    throw new Error('Empty proof path')
  }
  if (!equalsBytes(inner.root(), anchorRoot)) {
    // Historical anchor: rebuild proof nodes from path store overlay
    return createProofFromPathStore(trie, key, anchorId, anchorRoot)
  }
  return nodes
}

async function createProofFromPathStore(
  trie: BinaryPathMPT,
  key: Uint8Array,
  anchorId: string | bigint,
  anchorRoot: Uint8Array,
): Promise<Proof> {
  // Fallback: use live stack when at anchor root; otherwise verify via classic proof at anchor root
  const inner = trie._inner
  const savedRoot = inner.root()
  inner.root(anchorRoot)
  try {
    return await createMerkleProof(inner, key)
  } finally {
    inner.root(savedRoot)
  }
}

export async function createMultiProof(
  trie: BinaryPathMPT,
  keys: Uint8Array[],
  anchorId?: string | bigint,
): Promise<Proof> {
  const sorted = keys.slice().sort((a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      const d = a[i]! - b[i]!
      if (d !== 0) return d
    }
    return a.length - b.length
  })
  const seen = new Set<string>()
  const proof: Proof = []
  for (const key of sorted) {
    const p = await createProof(trie, key, anchorId)
    for (const node of p) {
      const h = trie._inner.nodeHash(node).toString()
      if (!seen.has(h)) {
        seen.add(h)
        if (proof.length === 0) {
          proof.push(node)
        } else if (!equalsBytes(proof[0]!, node)) {
          proof.push(node)
        }
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
  for (const node of [...left, ...right]) {
    const id = trie._inner.nodeHash(node).toString()
    if (seen.has(id)) continue
    seen.add(id)
    out.push(node)
  }
  return out
}

export { verifyMerkleProof }
