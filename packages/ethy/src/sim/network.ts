/** Sparse overlay + DHT hit model (WP-11a) — pure, no I/O. */

export function ethyDhtHitRate(ethyPublicOnline: number, backboneDhtSize: number): number {
  const denom = ethyPublicOnline + Math.max(1, backboneDhtSize)
  return ethyPublicOnline / denom
}

export function shouldSeeEthySeederInDht(rngUnit: number, hitRate: number): boolean {
  return rngUnit <= hitRate
}
