/** Shared block calendar constants (WP-16d, ETHY-0-SPEC). */

export const CANONICAL_PIVOT_GRID_BLOCKS = 32n
export const ANCHOR_EPOCH_BLOCKS = 256n
export const MACRO_GENERATION_GRID_BLOCKS = 1024n
export const BAL_RETENTION_WINDOW_BLOCKS = 8192n
export const ONBOARDING_BAL_WINDOW_BLOCKS = 4096n

export function onboardingBalStartBlock(head: bigint): bigint {
  if (head <= ONBOARDING_BAL_WINDOW_BLOCKS) return 0n
  return head - ONBOARDING_BAL_WINDOW_BLOCKS + 1n
}
