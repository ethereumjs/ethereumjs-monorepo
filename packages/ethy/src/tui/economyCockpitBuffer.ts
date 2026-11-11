import type { EconomySnapshot } from '../economy/types.ts'

/** Minimum interval between Economy cockpit value refreshes (reduces frame-to-frame flicker). */
export const ECONOMY_COCKPIT_REFRESH_MS = 5_000

let cached: EconomySnapshot | undefined
let cachedAt = 0

function cloneEconomySnapshot(s: EconomySnapshot): EconomySnapshot {
  return {
    ...s,
    topContracts: s.topContracts.map((r) => ({ ...r })),
    recentBlocks: s.recentBlocks.map((r) => ({ ...r })),
    txTypeSplit: s.txTypeSplit === undefined ? undefined : { ...s.txTypeSplit },
    moments: s.moments === undefined ? undefined : s.moments.map((m) => ({ ...m })),
    nibbleHeat: s.nibbleHeat === undefined ? undefined : [...s.nibbleHeat],
    skyline: s.skyline === undefined ? undefined : s.skyline.map((p) => ({ ...p })),
  }
}

/** Test hook — reset throttle state between cases. */
export function resetEconomyCockpitBuffer(): void {
  cached = undefined
  cachedAt = 0
}

/**
 * Returns a snapshot suitable for the Economy cockpit column: live while waiting
 * for the first block, then held up to {@link ECONOMY_COCKPIT_REFRESH_MS}.
 */
export function economyForCockpitDisplay(
  current: EconomySnapshot | undefined,
  nowMs = Date.now(),
): EconomySnapshot | undefined {
  if (current === undefined) {
    resetEconomyCockpitBuffer()
    return undefined
  }
  if (!current.hasBlocks) {
    resetEconomyCockpitBuffer()
    return current
  }
  const stale =
    cached === undefined || !cached.hasBlocks || nowMs - cachedAt >= ECONOMY_COCKPIT_REFRESH_MS
  if (stale) {
    cached = cloneEconomySnapshot(current)
    cachedAt = nowMs
  }
  return cached
}
