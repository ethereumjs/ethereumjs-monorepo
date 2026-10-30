import type { EthyPhase, EthySpine, SnapBucket } from './types.ts'

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

/** True when the snap cursor has reached the bucket limit. */
export function snapBucketCursorExhausted(bucket: SnapBucket): boolean {
  return compareBytes32(bucket.currentLastHash, bucket.limitHash) >= 0
}

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    const av = a[i] ?? 0
    const bv = b[i] ?? 0
    if (av !== bv) return av - bv
  }
  return 0
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

function readUInt32BE(bytes: Uint8Array, offset: number): number {
  return (
    (((bytes[offset] ?? 0) << 24) |
      ((bytes[offset + 1] ?? 0) << 16) |
      ((bytes[offset + 2] ?? 0) << 8) |
      (bytes[offset + 3] ?? 0)) >>>
    0
  )
}

/** Cursor position within a bucket range using bytes 1–4 of the account hash. */
export function bucketCursorFraction(bucket: SnapBucket): number {
  if (bucket.status === 'done') return 1
  const cur = readUInt32BE(bucket.currentLastHash, 1)
  const lo = readUInt32BE(bucket.startHash, 1)
  const hi = readUInt32BE(bucket.limitHash, 1)
  if (hi <= lo) {
    return snapBucketCursorExhausted(bucket) ? 1 : 0
  }
  if (cur <= lo) return 0
  if (cur >= hi) return 1
  return (cur - lo) / (hi - lo)
}

/** Continuous snap progress: 85% accounts, then 15% code+storage when all buckets are done. */
export function computeSnapProgressPct(spine: EthySpine): number {
  const buckets = spine.snapBuckets
  const accountFraction =
    buckets.reduce((sum, b) => sum + bucketCursorFraction(b), 0) / Math.max(1, buckets.length)
  const allDone = buckets.every((b) => b.status === 'done')
  if (!allDone) {
    return Math.min(100, Math.max(0, Math.round(0.85 * accountFraction * 100)))
  }
  const codeTotal = spine.codesSynced + spine.codesQueued
  const codeFrac = codeTotal <= 0 ? 1 : spine.codesSynced / codeTotal
  const storTotal = spine.storageSlotsSynced + spine.storageQueued
  const storFrac = storTotal <= 0 ? 1 : spine.storageSlotsSynced / storTotal
  const cs = (codeFrac + storFrac) / 2
  return Math.min(100, Math.max(0, Math.round((0.85 + 0.15 * cs) * 100)))
}

const PROGRESS_BAR_CELLS = 16

/** Node Pulse progress row: 16 cells of █/░ plus a padded percent. */
export function formatProgressBar(pct: number): string {
  const clamped = Math.min(100, Math.max(0, pct))
  const filled = Math.round((clamped / 100) * PROGRESS_BAR_CELLS)
  const bar = `${'█'.repeat(filled)}${'░'.repeat(PROGRESS_BAR_CELLS - filled)}`
  const pctText = `${Math.round(clamped)}`.padStart(3, ' ')
  return `${bar} ${pctText}%`
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
