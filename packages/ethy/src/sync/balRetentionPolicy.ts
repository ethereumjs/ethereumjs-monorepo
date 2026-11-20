/** Disk BAL tail archive policy (WP-11b). */

export const MAX_SERVABLE_BAL_TAIL_BLOCKS = 8192n
export const BAL_SEGMENT_BLOCKS = 256n

const MANIFEST_MAGIC = 'BALT'

export { MANIFEST_MAGIC }

export function segmentStart(block: bigint): bigint {
  if (block < 0n) return 0n
  return block - (block % BAL_SEGMENT_BLOCKS)
}

export type ContiguousBalRange = {
  earliest: bigint
  latest: bigint
  contiguousFromPivot: boolean
}

/**
 * Given sorted present block numbers and base pivot, return the contiguous suffix
 * that reaches the newest block and whether it bridges pivot+1.
 */
export function contiguousRange(
  presentBlocksSorted: readonly bigint[],
  basePivotBlock: bigint,
): ContiguousBalRange | undefined {
  if (presentBlocksSorted.length === 0) return undefined
  const sorted = [...presentBlocksSorted].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  let latest = sorted[sorted.length - 1]!
  let earliest = latest
  for (let i = sorted.length - 2; i >= 0; i--) {
    const b = sorted[i]!
    if (b + 1n === earliest) {
      earliest = b
    } else {
      break
    }
  }
  const contiguousFromPivot = basePivotBlock >= latest || earliest <= basePivotBlock + 1n
  return { earliest, latest, contiguousFromPivot }
}

/** Lowest block number safe to prune while serving buckets anchored at minChunkBlock. */
export function pruneFloor(
  minChunkBlock: bigint | undefined,
  lastVerified: bigint | undefined,
  shadowRefreshDisabled: boolean,
): bigint | undefined {
  if (minChunkBlock !== undefined && minChunkBlock > 0n) {
    return minChunkBlock
  }
  if (shadowRefreshDisabled && lastVerified !== undefined) {
    const floor =
      lastVerified > MAX_SERVABLE_BAL_TAIL_BLOCKS ? lastVerified - MAX_SERVABLE_BAL_TAIL_BLOCKS : 0n
    return floor > 0n ? floor : undefined
  }
  return undefined
}
