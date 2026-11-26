import type { PeerTelemetry } from '../spine/types.ts'

export type CustodyCoveragePeer = {
  ethySession?: boolean
  bucketsBitmask: number
}

export type CustodyCoverageInput = {
  closedBucketsMask: number
  peers: readonly CustodyCoveragePeer[]
}

export type CustodyCoverageResult = {
  connectedSwarmBucketsMask: number
  uncoveredBucketsMask: number
  lowRedundancyMask: number
  desiredEthyBucketsMask: number
  hopBuckets: number
  minRedundancy: number
}

function parseMask(raw: string): number {
  if (raw.startsWith('0x')) return Number.parseInt(raw, 16) & 0xffff
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? n & 0xffff : 0
}

function peerMask(p: CustodyCoveragePeer): number {
  if (p.ethySession !== true) return 0
  return p.bucketsBitmask & 0xffff
}

function countBits16(mask: number): number {
  let n = 0
  for (let i = 0; i < 16; i++) {
    if ((mask >> i) & 1) n++
  }
  return n
}

/** Per-bucket custodian count from connected ETHY peers plus local closed buckets. */
export function evaluateCustodyCoverage(input: CustodyCoverageInput): CustodyCoverageResult {
  const closed = input.closedBucketsMask & 0xffff
  let connectedSwarmBucketsMask = 0
  const peerCounts = new Uint8Array(16)
  for (const p of input.peers) {
    const mask = peerMask(p)
    if (mask === 0) continue
    connectedSwarmBucketsMask |= mask
    for (let b = 0; b < 16; b++) {
      if ((mask >> b) & 1) peerCounts[b]!++
    }
  }
  for (let b = 0; b < 16; b++) {
    if ((closed >> b) & 1) peerCounts[b]!++
  }
  const hopBuckets = countBits16(closed | connectedSwarmBucketsMask)
  const uncoveredBucketsMask = 0xffff & ~(closed | connectedSwarmBucketsMask)
  let lowRedundancyMask = 0
  let minRedundancy = 255
  for (let b = 0; b < 16; b++) {
    const c = peerCounts[b]!
    if (c < minRedundancy) minRedundancy = c
    if (c < 2) lowRedundancyMask |= 1 << b
  }
  if (minRedundancy === 255) minRedundancy = 0
  const desiredEthyBucketsMask =
    uncoveredBucketsMask !== 0 ? uncoveredBucketsMask : lowRedundancyMask & 0xffff
  return {
    connectedSwarmBucketsMask,
    uncoveredBucketsMask,
    lowRedundancyMask,
    desiredEthyBucketsMask,
    hopBuckets,
    minRedundancy,
  }
}

/** Map spine peer telemetry into coverage rows. */
export function custodyPeersFromSpine(peers: Iterable<PeerTelemetry>): CustodyCoveragePeer[] {
  const out: CustodyCoveragePeer[] = []
  for (const p of peers) {
    if (p.ethySession !== true || p.ethyStatus === undefined) continue
    out.push({
      ethySession: true,
      bucketsBitmask: parseMask(p.ethyStatus.bucketsBitmask),
    })
  }
  return out
}

export function custodyBitmask(buckets: readonly number[]): number {
  let mask = 0
  for (const b of buckets) {
    if (b >= 0 && b <= 15) mask |= 1 << b
  }
  return mask
}

/** True when every assigned nibble is closed locally. */
export function assignedBucketsClosed(assignedMask: number, closedMask: number): boolean {
  return assignedMask !== 0 && (assignedMask & ~closedMask) === 0
}
