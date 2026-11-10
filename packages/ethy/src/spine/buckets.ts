import type { EthyPhase, EthySpine, SnapBucket, SnapRangeCursor } from './types.ts'

/** Width of one nibble bucket in 36-bit cursor space (WP-04f / WP-04h). */
export const FULL_BUCKET_SPAN_36 = 0x10_0000_0000

/** Build 16 snap sync buckets by first account-hash nibble (0x0..0xf). */
export function createSnapBuckets(): SnapBucket[] {
  const buckets: SnapBucket[] = []
  for (let i = 0; i < 16; i++) {
    const prefix = `0x${i.toString(16)}`
    const startHash = nibbleStartHash(i)
    const limitHash = nibbleLimitHash(i)
    const origin = new Uint8Array(startHash)
    buckets.push({
      index: i,
      prefix,
      status: 'pending',
      accountsLoaded: 0,
      startHash,
      currentLastHash: origin,
      limitHash,
      subRanges: [newPrefixCursor(i, origin, limitHash, i)],
    })
  }
  return buckets
}

export function newPrefixCursor(
  bucketIndex: number,
  origin: Uint8Array,
  limit: Uint8Array,
  id: number,
): SnapRangeCursor {
  return {
    id,
    bucketIndex,
    origin: new Uint8Array(origin),
    limit: new Uint8Array(limit),
    journal: 'prefix',
  }
}

/** Legacy buckets without `subRanges` get a single prefix cursor from the saved hash span. */
export function ensureBucketSubRanges(bucket: SnapBucket): SnapRangeCursor[] {
  if (bucket.subRanges !== undefined && bucket.subRanges.length > 0) {
    if (
      bucket.subRanges.length === 1 &&
      bucket.subRanges[0]!.journal === 'prefix' &&
      compareBytes32(bucket.currentLastHash, bucket.subRanges[0]!.origin) > 0
    ) {
      bucket.subRanges[0]!.origin = new Uint8Array(bucket.currentLastHash)
    }
    return bucket.subRanges
  }
  if (bucket.status === 'done' || compareBytes32(bucket.currentLastHash, bucket.limitHash) >= 0) {
    bucket.subRanges = bucket.subRanges ?? []
    return bucket.subRanges
  }
  const origin = new Uint8Array(bucket.currentLastHash)
  const limit = new Uint8Array(bucket.limitHash)
  bucket.subRanges = [newPrefixCursor(bucket.index, origin, limit, bucket.index)]
  return bucket.subRanges
}

export function cursorSpan36(cursor: SnapRangeCursor): number {
  if (!cursorActive(cursor)) return 0
  const lo = bucketPosition36(cursor.origin)
  const hi = bucketPosition36(cursor.limit)
  return Math.max(0, hi - lo + 1)
}

export function cursorActive(cursor: SnapRangeCursor): boolean {
  return compareBytes32(cursor.origin, cursor.limit) <= 0
}

/** True when a non-refresh cursor still has uncommitted Merkle verify work (WP-06e / WP-06f). */
export function bucketCursorsPendingVerify(bucket: SnapBucket): boolean {
  const ranges = bucket.subRanges
  if (ranges === undefined) return false
  return ranges.some((c) => c.refresh !== true && (c.verifyingCount ?? 0) > 0)
}

export function cursorBlockedForDispatch(cursor: SnapRangeCursor): boolean {
  if (cursor.inFlightReqKey !== undefined) return true
  const pending = cursor.verifyingCount ?? 0
  if (pending > 0 && cursor.pipelinedVerify !== true) return true
  return false
}

/** True when the bucket has active one-account refresh cursors (WP-06f). */
export function bucketHasActiveRefreshCursors(bucket: SnapBucket): boolean {
  const ranges = bucket.subRanges
  if (ranges === undefined) return false
  return ranges.some((c) => c.refresh === true && cursorActive(c))
}

export function spineHasActiveRefreshCursors(buckets: readonly SnapBucket[]): boolean {
  return buckets.some((b) => bucketHasActiveRefreshCursors(b))
}

export function syncBucketCursorFields(bucket: SnapBucket): void {
  const ranges = bucket.subRanges
  if (ranges === undefined) {
    if (compareBytes32(bucket.currentLastHash, bucket.limitHash) >= 0) {
      bucket.status = 'done'
      bucket.assignedPeerId = undefined
    }
    return
  }
  const active = ranges.filter((c) => cursorActive(c))
  bucket.subRanges = active
  const sweepActive = active.filter((c) => c.refresh !== true)
  const refreshActive = active.filter((c) => c.refresh === true)
  if (active.length === 0) {
    if (bucketCursorsPendingVerify(bucket)) {
      bucket.status = 'verifying_proof'
      return
    }
    bucket.currentLastHash = new Uint8Array(bucket.limitHash)
    bucket.status = 'done'
    bucket.assignedPeerId = undefined
    bucket.lastStallReason = undefined
    return
  }
  if (sweepActive.length === 0 && refreshActive.length > 0) {
    if (!bucketCursorsPendingVerify(bucket)) {
      bucket.currentLastHash = new Uint8Array(bucket.limitHash)
      bucket.status = 'done'
      bucket.assignedPeerId = undefined
      bucket.lastStallReason = undefined
    }
    return
  }
  let minOrigin = sweepActive[0]!.origin
  for (const c of sweepActive) {
    if (compareBytes32(c.origin, minOrigin) < 0) {
      minOrigin = c.origin
    }
  }
  bucket.currentLastHash = new Uint8Array(minOrigin)
  if (bucket.status === 'done' && sweepActive.length > 0) {
    bucket.status = 'pending'
  }
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
  if (compareBytes32(bucket.currentLastHash, bucket.limitHash) >= 0) {
    if (
      bucket.subRanges === undefined ||
      bucket.subRanges.length === 0 ||
      (bucket.subRanges.length === 1 && bucket.subRanges[0]!.journal === 'prefix')
    ) {
      return true
    }
  }
  if (bucket.subRanges !== undefined) {
    return bucket.subRanges.every((c) => !cursorActive(c))
  }
  return compareBytes32(bucket.currentLastHash, bucket.limitHash) >= 0
}

export function compareBytes32(a: Uint8Array, b: Uint8Array): number {
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

/** 36-bit position inside a snap bucket (low nibble of byte 0 plus bytes 1–4). */
export function bucketPosition36(bytes: Uint8Array): number {
  return (bytes[0]! & 0x0f) * 0x1_0000_0000 + readUInt32BE(bytes, 1)
}

function progressCursors(bucket: SnapBucket): SnapRangeCursor[] {
  return ensureBucketSubRanges(bucket).filter((c) => c.refresh !== true)
}

function remainingSpan36(bucket: SnapBucket): number {
  const ranges = progressCursors(bucket)
  let sum = 0
  for (const c of ranges) {
    if (!cursorActive(c)) continue
    sum += cursorSpan36(c)
  }
  return sum
}

/** Cursor position within a bucket range including byte[0] low nibble (WP-04f / WP-04h). */
export function bucketCursorFraction(bucket: SnapBucket): number {
  if (bucket.status === 'done') return 1
  if (bucket.subRanges !== undefined && progressCursors(bucket).length > 0) {
    const lo = bucketPosition36(bucket.startHash)
    const hi = bucketPosition36(bucket.limitHash)
    const totalSpan = Math.max(1, hi - lo + 1)
    const remaining = remainingSpan36(bucket)
    const frac = 1 - remaining / totalSpan
    return Math.min(1, Math.max(0, frac))
  }
  const cur = bucketPosition36(bucket.currentLastHash)
  const lo = bucketPosition36(bucket.startHash)
  const hi = bucketPosition36(bucket.limitHash)
  if (hi <= lo) {
    return snapBucketCursorExhausted(bucket) ? 1 : 0
  }
  if (cur <= lo) return 0
  if (cur >= hi) return 1
  return (cur - lo) / (hi - lo)
}

/** Continuous fraction of the 256-bit account range covered (`0.0 .. 1.0`). */
export function computeAccountRangeFraction(buckets: readonly SnapBucket[]): number {
  if (buckets.length === 0) return 0
  return buckets.reduce((sum, b) => sum + bucketCursorFraction(b), 0) / buckets.length
}

/** Continuous snap progress: 75% accounts, then 25% code+storage when all buckets are done (WP-06f). */
export function computeSnapProgressPct(spine: EthySpine): number {
  const buckets = spine.snapBuckets
  const accountFraction = computeAccountRangeFraction(buckets)
  const allDone = buckets.every((b) => b.status === 'done')
  if (!allDone) {
    return Math.min(100, Math.max(0, Math.round(0.75 * accountFraction * 100)))
  }
  const codeTotal = Math.max(spine.codesTotal ?? 0, spine.codesSynced + spine.codesQueued)
  const codeFrac = codeTotal <= 0 ? 1 : spine.codesSynced / codeTotal
  const storSynced = spine.storageAccountsSynced ?? 0
  const storAccTotal = Math.max(spine.storageAccountsTotal ?? 0, storSynced + spine.storageQueued)
  const storFrac = storAccTotal <= 0 ? 1 : storSynced / storAccTotal
  const cs = (codeFrac + storFrac) / 2
  return Math.min(100, Math.max(0, Math.round((0.75 + 0.25 * cs) * 100)))
}

const PROGRESS_BAR_CELLS = 16

/** Node Pulse progress row: 16 cells of █/░ plus a padded percent and optional ETA. */
export function formatProgressBar(pct: number, etaMinutes?: number): string {
  const clamped = Math.min(100, Math.max(0, pct))
  const filled = Math.round((clamped / 100) * PROGRESS_BAR_CELLS)
  const bar = `${'█'.repeat(filled)}${'░'.repeat(PROGRESS_BAR_CELLS - filled)}`
  const pctText = `${Math.round(clamped)}`.padStart(3, ' ')
  if (etaMinutes === undefined || !Number.isFinite(etaMinutes) || etaMinutes <= 0) {
    return `${bar} ${pctText}%`
  }
  const label = etaMinutes < 1 ? '<1m' : `~${Math.round(etaMinutes)}m`
  return `${bar} ${pctText}% (${label})`
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
