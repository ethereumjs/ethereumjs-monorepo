/**
 * Hash-based file sharding for consensus test runners.
 * Each fixture path maps to exactly one bucket in `0 .. total-1`.
 */

export interface Shard {
  index: number
  total: number
}

export function parseShardFromEnv(): Shard | undefined {
  return parseShard(process.env.TEST_SHARD ?? process.env.VITE_SHARD)
}

/**
 * Parse `i/n` (e.g. `2/4`). Returns undefined when unset or when n === 1
 * (no filtering). Throws on malformed values.
 */
export function parseShard(value: string | undefined): Shard | undefined {
  if (value === undefined || value.length === 0) return undefined
  const match = /^(\d+)\/(\d+)$/.exec(value)
  if (match === null) {
    throw new Error(`Invalid TEST_SHARD="${value}", expected i/n with 0 <= i < n`)
  }
  const index = Number(match[1])
  const total = Number(match[2])
  const invalid =
    !Number.isInteger(index) || !Number.isInteger(total) || total < 1 || index < 0 || index >= total
  if (invalid) {
    throw new Error(`Invalid TEST_SHARD="${value}", expected i/n with 0 <= i < n`)
  }
  if (total === 1) return undefined
  return { index, total }
}

/** FNV-1a hash modulo `n`, stable across processes. */
export function hashMod(value: string, n: number): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % n
}

export function fileBelongsToShard(filePath: string, shard: Shard): boolean {
  return hashMod(filePath, shard.total) === shard.index
}
