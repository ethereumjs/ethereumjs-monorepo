import { createSnapBuckets } from '../spine/buckets.ts'
import type { SnapBucket } from '../spine/types.ts'

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
