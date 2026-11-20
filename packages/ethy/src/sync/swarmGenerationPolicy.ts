import { ethyKeccak256 } from '../crypto/keccak.ts'

export const MACRO_GENERATION_GRID_BLOCKS = 1024n
export const SOFT_REFRESH_AGE_BLOCKS = 1536n
export const HARD_PREFER_SNAP_AGE_BLOCKS = 4096n
export const MINT_LIVENESS_TIMEOUT_MS = 300_000

const LAMBDA_TARGET = 1.5
const T_TARGET_MS = 60_000
export const W_MIN_MS = 5_000
export const W_MAX_MS = 180_000

const U64_MASK = (1n << 64n) - 1n

export function macroGenerationBlock(head: bigint): bigint {
  if (head <= 0n) return 0n
  return (head / MACRO_GENERATION_GRID_BLOCKS) * MACRO_GENERATION_GRID_BLOCKS
}

function electionUniform(nodeId: Uint8Array, generationBlock: bigint): number {
  const genBytes = bigintToMinimalBytes(generationBlock)
  const buf = new Uint8Array(nodeId.length + genBytes.length)
  buf.set(nodeId, 0)
  buf.set(genBytes, nodeId.length)
  const hash = ethyKeccak256(buf)
  const view = new DataView(hash.buffer, hash.byteOffset, hash.byteLength)
  const hi = view.getUint32(0, false)
  const lo = view.getUint32(4, false)
  const n = (BigInt(hi) << 32n) | BigInt(lo)
  const u = Number((n + 1n) / (U64_MASK + 1n))
  return Math.min(Math.max(u, Number.EPSILON), 1 - Number.EPSILON)
}

function bigintToMinimalBytes(n: bigint): Uint8Array {
  if (n === 0n) return new Uint8Array(0)
  let hex = n.toString(16)
  if (hex.length % 2 === 1) hex = `0${hex}`
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

export function clampElectionWeight(w: number): number {
  return Math.min(4, Math.max(0.25, w))
}

export function electionWeight(opts: {
  publicEndpoint: boolean
  uptimeMs: number
  snapPeerCount: number
  knownActiveEthyPeers: number
}): number {
  const sixHours = 6 * 60 * 60 * 1000
  const thirtyMin = 30 * 60 * 1000
  let w: number
  if (opts.publicEndpoint) {
    if (opts.uptimeMs >= sixHours && opts.snapPeerCount >= 2) w = 0.35
    else if (opts.uptimeMs >= sixHours) w = 0.5
    else w = 1
  } else if (opts.uptimeMs < thirtyMin) {
    w = 3.5
  } else {
    w = 2
  }
  if (opts.knownActiveEthyPeers < 2) w *= 1.5
  return clampElectionWeight(w)
}

export function computeElectionDelayMs(opts: {
  nodeId: Uint8Array
  generationBlock: bigint
  knownActiveEthyPeers: number
  weight: number
}): number {
  const u = electionUniform(opts.nodeId, opts.generationBlock)
  const nHat = Math.max(1, opts.knownActiveEthyPeers + 1)
  const raw = W_MIN_MS + -Math.log(1 - u) * ((nHat * T_TARGET_MS) / LAMBDA_TARGET) * opts.weight
  return Math.min(W_MAX_MS, Math.max(W_MIN_MS, Math.round(raw)))
}

export type MinterAnnouncement = {
  peerId: string
  basePivotBlock: bigint
  bucketsBitmask: number
  /** PEX table row only — no direct session */
  pexOnly?: boolean
  /** Last manifest or chunk response (ms) */
  lastServeAtMs?: number
  /** First time we saw `bucketsBitmask === 0` at/above `generationBlock` (ms). */
  firstZeroMaskAtMs?: number
  connected: boolean
  headerVerified: boolean
}

export type MinterSuppressionState = 'clear' | 'suppressed' | 'stalled'

export function evaluateMinterSuppression(opts: {
  nowMs: number
  generationBlock: bigint
  /** Best locally verified EL head — ignore minters advertising pivots beyond this. */
  bestVerifiedHead?: bigint
  announcements: readonly MinterAnnouncement[]
}): {
  state: MinterSuppressionState
  suppressorPeerId?: string
  stalledPeerIds: string[]
} {
  const stalledPeerIds: string[] = []
  const headCap = opts.bestVerifiedHead
  for (const a of opts.announcements) {
    if (a.basePivotBlock < opts.generationBlock) continue
    if (headCap !== undefined && a.basePivotBlock > headCap) continue
    if (!a.headerVerified) continue
    if (a.pexOnly && a.bucketsBitmask === 0) continue
    if (a.bucketsBitmask === 0xffff) {
      return { state: 'suppressed', suppressorPeerId: a.peerId, stalledPeerIds }
    }
    if (a.bucketsBitmask === 0) {
      const since = a.firstZeroMaskAtMs ?? opts.nowMs
      if (opts.nowMs - since <= MINT_LIVENESS_TIMEOUT_MS) {
        return { state: 'suppressed', suppressorPeerId: a.peerId, stalledPeerIds }
      }
      stalledPeerIds.push(a.peerId)
      continue
    }
    if (a.bucketsBitmask > 0 && a.bucketsBitmask < 0xffff) {
      if (!a.connected) continue
      if (a.lastServeAtMs === undefined) continue
      if (opts.nowMs - a.lastServeAtMs <= MINT_LIVENESS_TIMEOUT_MS) {
        return { state: 'suppressed', suppressorPeerId: a.peerId, stalledPeerIds }
      }
      stalledPeerIds.push(a.peerId)
      continue
    }
  }
  if (stalledPeerIds.length > 0) {
    return { state: 'stalled', stalledPeerIds }
  }
  return { state: 'clear', stalledPeerIds }
}

export function backupElectionStaggerMs(nodeId: Uint8Array, generationBlock: bigint): number {
  const buf = new Uint8Array(nodeId.length + 8 + 6)
  buf.set(nodeId, 0)
  const gen = bigintToMinimalBytes(generationBlock)
  buf.set(gen, nodeId.length)
  buf.set(new TextEncoder().encode('backup'), nodeId.length + gen.length)
  const hash = ethyKeccak256(buf)
  const view = new DataView(hash.buffer, hash.byteOffset, hash.byteLength)
  const n = view.getUint32(0, false) % 75_001
  return 15_000 + n
}

/** Freshest completed snapshot pivot (non-zero bitmask). */
export function freshestCompletedEthyPivot(
  pivots: readonly { basePivotBlock: bigint; bucketsBitmask: number }[],
): bigint | undefined {
  let best: bigint | undefined
  for (const row of pivots) {
    if (row.bucketsBitmask === 0) continue
    if (row.basePivotBlock === 0n) continue
    if (best === undefined || row.basePivotBlock > best) best = row.basePivotBlock
  }
  return best
}
