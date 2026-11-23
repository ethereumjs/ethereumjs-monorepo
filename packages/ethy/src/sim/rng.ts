/** Deterministic Mulberry32 PRNG (WP-11a). */

export type SeededRng = () => number

export function createSeededRng(seed: number): SeededRng {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

export function rngInt(rng: SeededRng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}
