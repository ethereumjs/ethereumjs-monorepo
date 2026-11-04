import { concatBytes, equalsBytes } from '@ethereumjs/util'
import { sha256 as nobleSha256 } from '@noble/hashes/sha2.js'

import type { Sha256Fn } from './ssz.ts'

/** Precomputed zero-hash ladder for generalized-index Merkle proofs. */
export const ZERO_HASHES: Uint8Array[] = (() => {
  const zeros: Uint8Array[] = [new Uint8Array(32)]
  for (let i = 0; i < 40; i++) {
    zeros.push(nobleSha256(concatBytes(zeros[i]!, zeros[i]!)))
  }
  return zeros
})()

export function gindexToMerklePosition(gindex: number): { depth: number; index: number } {
  const depth = Math.floor(Math.log2(gindex))
  const index = gindex - 2 ** depth
  return { depth, index }
}

export function normalizeMerkleBranch(branch: Uint8Array[], gindex: number): Uint8Array[] {
  const { depth } = gindexToMerklePosition(gindex)
  if (branch.length !== depth) {
    return branch.slice()
  }
  return branch.slice()
}

/**
 * Altair-style SHA-256 Merkle branch verification (generalized index).
 */
export function isValidMerkleBranch(
  leaf: Uint8Array,
  branch: Uint8Array[],
  depth: number,
  index: number,
  root: Uint8Array,
  sha256: Sha256Fn,
): boolean {
  if (branch.length !== depth) return false
  let value = leaf
  for (let i = 0; i < depth; i++) {
    const ithBit = (index >> i) & 1
    if (ithBit === 1) {
      value = sha256(concatBytes(branch[i]!, value))
    } else {
      value = sha256(concatBytes(value, branch[i]!))
    }
  }
  return equalsBytes(value, root)
}

/**
 * Verify a Merkle branch at a generalized index `gindex` (requires exact `depth` sibling nodes).
 */
export function isValidNormalizedMerkleBranch(
  leaf: Uint8Array,
  branch: Uint8Array[],
  gindex: number,
  root: Uint8Array,
  sha256: Sha256Fn,
): boolean {
  const { depth, index } = gindexToMerklePosition(gindex)
  return isValidMerkleBranch(leaf, branch, depth, index, root, sha256)
}

/** Compute Merkle root from a leaf placed at `(depth, index)` with zero siblings. */
export function merkleRootFromZeroBranch(
  leaf: Uint8Array,
  depth: number,
  index: number,
  sha256: Sha256Fn,
): Uint8Array {
  const branch = ZERO_HASHES.slice(0, depth)
  let value = leaf
  for (let i = 0; i < depth; i++) {
    const ithBit = (index >> i) & 1
    const sibling = branch[i]!
    if (ithBit === 1) {
      value = sha256(concatBytes(sibling, value))
    } else {
      value = sha256(concatBytes(value, sibling))
    }
  }
  return value
}
