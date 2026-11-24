import { createSnapBuckets } from '../spine/buckets.ts'
import type { SnapBucket } from '../spine/types.ts'
import { CANONICAL_PIVOT_GRID_BLOCKS } from './canonicalPivotGrid.ts'
import { macroGenerationBlock } from './swarmGenerationPolicy.ts'

/**
 * Maximum blocks behind head where the current 1024-block macro-generation grid
 * is still fresh enough for Geth/reth `snap/1` state-trie retention (~128 blocks).
 */
export const MAX_SHADOW_SNAP_MINT_LAG_BLOCKS = 64n

/**
 * Pick a SNAP-servable block for background shadow minting.
 * Uses the 1024-block macro-generation grid when within `MAX_SHADOW_SNAP_MINT_LAG_BLOCKS`
 * of `head`; otherwise aligns to the latest 32-block beacon-epoch grid so peers still
 * retain the state trie root.
 */
export function selectShadowMintPivotBlock(head: bigint): bigint {
  if (head <= 0n) return 0n
  const gen = macroGenerationBlock(head)
  if (gen > 0n && head - gen <= MAX_SHADOW_SNAP_MINT_LAG_BLOCKS) {
    return gen
  }
  const aligned32 = (head / CANONICAL_PIVOT_GRID_BLOCKS) * CANONICAL_PIVOT_GRID_BLOCKS
  return aligned32 > 0n ? aligned32 : head
}

export type ShadowSnapMintSession = {
  stateRootHex: string
  targetPivotBlock: bigint
  balBlocksCopied: number
  mintBucketCap: number
  buckets: SnapBucket[]
  stage: 'minting' | 'bal-copy' | 'ready-to-flip' | 'done'
}

/** Fresh bucket grid for background SNAP mint (only bucket 0 active initially). */
export function createShadowMintBuckets(): SnapBucket[] {
  const buckets = createSnapBuckets()
  for (const b of buckets) {
    if (b.index === 0) {
      b.status = 'syncing'
    } else {
      b.status = 'pending'
    }
  }
  return buckets
}

/** After bucket `n` completes, allow scheduling bucket `n + 1`. */
export function nextShadowMintBucketCap(buckets: readonly SnapBucket[]): number {
  let cap = 0
  for (let i = 0; i < 16; i++) {
    const b = buckets[i]
    if (b === undefined) break
    if (b.status !== 'done') return cap
    cap = i + 1
  }
  return Math.min(cap, 15)
}

export function shadowSnapMintProgressPct(buckets: readonly SnapBucket[]): number {
  const done = buckets.filter((b) => b.status === 'done').length
  return Math.min(95, Math.round((done / 16) * 70) + 10)
}

export function shadowSnapMintReadyToFlip(buckets: readonly SnapBucket[]): boolean {
  return buckets.every((b) => b.status === 'done')
}

export function computePartialMinterMask(buckets: readonly SnapBucket[]): number {
  let mask = 0
  for (const b of buckets) {
    if (b.status === 'done') mask |= 1 << b.index
  }
  return mask
}
