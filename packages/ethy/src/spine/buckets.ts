import type { SnapBucket } from './types.ts'

/** Build 16 snap sync buckets by first account-hash nibble (0x0..0xf). */
export function createSnapBuckets(): SnapBucket[] {
  const buckets: SnapBucket[] = []
  for (let i = 0; i < 16; i++) {
    const prefix = `0x${i.toString(16)}`
    const startHash = nibbleStartHash(i)
    const limitHash = nibbleLimitHash(i)
    buckets.push({
      index: i,
      prefix,
      status: 'pending',
      accountsLoaded: 0,
      startHash,
      currentLastHash: new Uint8Array(startHash),
      limitHash,
    })
  }
  return buckets
}

function nibbleStartHash(nibble: number): Uint8Array {
  const h = new Uint8Array(32)
  h[0] = nibble << 4
  return h
}

function nibbleLimitHash(nibble: number): Uint8Array {
  const h = new Uint8Array(32)
  h[0] = (nibble << 4) | 0x0f
  h.fill(0xff, 1)
  return h
}

export function findBucketByPrefix(
  spineBuckets: SnapBucket[],
  prefix: string,
): SnapBucket | undefined {
  const normalized = prefix.toLowerCase().replace(/^0x/, '')
  if (normalized.length !== 1) return undefined
  const idx = Number.parseInt(normalized, 16)
  if (Number.isNaN(idx) || idx < 0 || idx > 15) return undefined
  return spineBuckets[idx]
}
