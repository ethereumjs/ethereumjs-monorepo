import type { EthyPhase, SnapBucket } from './types.ts'

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

/** Snap ranges fully synced through the pivot (status `done` only). */
export function snapBucketsDoneCount(buckets: readonly SnapBucket[]): number {
  return buckets.filter((b) => b.status === 'done').length
}

/** Buckets that already hold accounts or are finished. Internal metric; not user-facing progress. */
export function bucketsWithProgress(buckets: readonly SnapBucket[]): number {
  return buckets.filter((b) => b.status === 'done' || b.accountsLoaded > 0).length
}

export function formatSnapBucketBar(buckets: readonly SnapBucket[]): string {
  let bar = ''
  for (const b of buckets) {
    if (b.status === 'done') bar += '█'
    else if (b.status === 'syncing' || b.status === 'verifying_proof') bar += '▒'
    else if (b.status === 'stalled') bar += '!'
    else bar += '░'
  }
  return bar
}

/** Eight-cell meter: filled share of `synced / (synced + queued)`. Empty when both are zero. */
export function formatQueueMeter(synced: number, queued: number, cells = 8): string {
  if (synced <= 0 && queued <= 0) return '░'.repeat(cells)
  if (queued <= 0) return '█'.repeat(cells)
  const total = synced + queued
  const filled = Math.min(cells, Math.max(0, Math.round((synced / total) * cells)))
  return `${'█'.repeat(filled)}${'░'.repeat(cells - filled)}`
}

/** Short tail for the account line when the 16-cell bar cannot show idle. */
export function snapAccountPaceNote(
  buckets: readonly SnapBucket[],
  opts: { peerCount: number; phase: EthyPhase },
): string {
  const done = snapBucketsDoneCount(buckets)
  if (done === 16) return ''
  const syncing = buckets.some((b) => b.status === 'syncing' || b.status === 'verifying_proof')
  if (syncing) return ''
  const stalled = buckets.some((b) => b.status === 'stalled')
  if (stalled) return 'stalled'
  if (opts.phase === 'SNAP_SYNCING' && opts.peerCount === 0) {
    const hasCached = buckets.some((b) => b.accountsLoaded > 0)
    if (done > 0 || hasCached) return 'paused'
    return 'no peers'
  }
  return ''
}

/** Node Pulse / cockpit line (compact — must fit a narrow column beside the 16-char bar). */
export function formatSnapRangePulse(
  buckets: readonly SnapBucket[],
  opts: { peerCount: number; phase: EthyPhase },
): string {
  const done = snapBucketsDoneCount(buckets)
  const bar = formatSnapBucketBar(buckets)
  if (done === 16) return `${bar} done`

  const syncing = buckets.some((b) => b.status === 'syncing' || b.status === 'verifying_proof')
  const stalled = buckets.some((b) => b.status === 'stalled')

  if (syncing) return `${bar} ${done}/16 syncing`
  if (stalled) return `${bar} ${done}/16 stalled`
  if (opts.phase === 'SNAP_SYNCING' && opts.peerCount === 0) {
    const hasCached = buckets.some((b) => b.accountsLoaded > 0)
    if (done > 0 || hasCached) return `${bar} ${done}/16 paused`
    return `${bar} no peers`
  }
  if (done > 0) return `${bar} ${done}/16`
  return `${bar} not started`
}

/** Short label for the SNAP capability pill. */
export function formatSnapCapabilityLabel(
  buckets: readonly SnapBucket[],
  opts: { peerCount: number; phase: EthyPhase },
): string {
  const stalled = buckets.find((b) => b.status === 'stalled')
  if (stalled) return `Stalled ${stalled.prefix}`

  const done = snapBucketsDoneCount(buckets)
  if (done === 16) return 'Complete'

  const syncing = buckets.some((b) => b.status === 'syncing' || b.status === 'verifying_proof')
  if (syncing) return `${done}/16 complete`

  if (opts.phase === 'SNAP_SYNCING' && opts.peerCount === 0) {
    if (done > 0) return `Paused · ${done}/16`
    const hasCached = buckets.some((b) => b.accountsLoaded > 0)
    if (hasCached) return 'Paused · 0/16'
    return 'Waiting for peers'
  }

  if (done > 0) return `${done}/16 complete`
  return 'Not started'
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
