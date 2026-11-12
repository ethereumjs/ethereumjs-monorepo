/** Beacon-epoch-aligned SNAP pivot grid (WP-06g, D-116). */
export const CANONICAL_PIVOT_GRID_BLOCKS = 32n
export const CANONICAL_PIVOT_MAX_BACKWARD_OFFSET = 24n

export type CanonicalSnapPivotTarget = {
  targetBlock: bigint
  waitBlocks: bigint
}

/** Pick initial SNAP anchor block and optional forward wait to the next grid line. */
export function selectCanonicalSnapPivotTarget(headBlock: bigint): CanonicalSnapPivotTarget {
  if (headBlock < CANONICAL_PIVOT_GRID_BLOCKS) {
    return { targetBlock: headBlock, waitBlocks: 0n }
  }
  const remainder = headBlock % CANONICAL_PIVOT_GRID_BLOCKS
  if (remainder <= CANONICAL_PIVOT_MAX_BACKWARD_OFFSET) {
    return { targetBlock: headBlock - remainder, waitBlocks: 0n }
  }
  const waitBlocks = CANONICAL_PIVOT_GRID_BLOCKS - remainder
  return { targetBlock: headBlock + waitBlocks, waitBlocks }
}

/**
 * Next rolling pivot after buffered contiguous BAL tip (WP-06g).
 * Off-grid resumes snap forward to the largest grid multiple not above `contiguousTip`.
 */
export function nextCanonicalPivotBlock(
  currentPivot: bigint,
  contiguousTip: bigint,
): bigint | undefined {
  if (currentPivot % CANONICAL_PIVOT_GRID_BLOCKS === 0n) {
    const next = currentPivot + CANONICAL_PIVOT_GRID_BLOCKS
    if (contiguousTip >= next) return next
    return undefined
  }
  const aligned = (contiguousTip / CANONICAL_PIVOT_GRID_BLOCKS) * CANONICAL_PIVOT_GRID_BLOCKS
  if (aligned > currentPivot) return aligned
  return undefined
}
