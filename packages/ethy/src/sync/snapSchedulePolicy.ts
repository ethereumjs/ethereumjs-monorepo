/** Peer fields used by snap account / code schedulers (WP-04c, WP-06e). */
export type SnapSchedulePeer = {
  id: string
  caps: string[]
  snapResponsesOk: number
  snapTimeouts: number
  avgLatencyMs: number
  latestBlock?: bigint
  clientFamily?: string
}

export const RESPONSE_BYTES_PROBE = 128 * 1024
export const RESPONSE_BYTES_STANDARD = 256 * 1024
export const RESPONSE_BYTES_FAST = 384 * 1024

export const MAX_IN_FLIGHT_PROBE = 1
export const MAX_IN_FLIGHT_PROVEN = 4
/** Extra pipeline depth for fast proven peers (WP-04g, WP-06e). */
export const MAX_IN_FLIGHT_FAST_PROVEN = 6

export const HIGH_LATENCY_MS = 400
export const FAST_LATENCY_MS = 250

export type SnapPeerTier = 'probe' | 'standard' | 'fast'

function clientAffinityRank(family: string | undefined): number {
  const f = family?.toLowerCase() ?? ''
  if (f.includes('nethermind')) return 0
  if (f.includes('geth')) return 1
  return 2
}

export function snapPeerTier(peer: SnapSchedulePeer): SnapPeerTier {
  if (peer.avgLatencyMs > HIGH_LATENCY_MS) return 'probe'
  if (peer.snapResponsesOk < 2) return 'probe'
  if (peer.snapTimeouts * 4 > peer.snapResponsesOk) return 'probe'

  const nethermindFast =
    clientAffinityRank(peer.clientFamily) === 0 &&
    peer.snapResponsesOk >= 2 &&
    peer.snapTimeouts === 0

  const genericFast =
    peer.snapResponsesOk >= 6 &&
    peer.snapTimeouts === 0 &&
    (peer.avgLatencyMs === 0 || peer.avgLatencyMs <= FAST_LATENCY_MS)

  if (nethermindFast || genericFast) return 'fast'
  return 'standard'
}

export function responseBytesForPeer(peer: SnapSchedulePeer): number {
  switch (snapPeerTier(peer)) {
    case 'fast':
      return RESPONSE_BYTES_FAST
    case 'standard':
      return RESPONSE_BYTES_STANDARD
    default:
      return RESPONSE_BYTES_PROBE
  }
}

export function maxInFlightForPeer(peer: SnapSchedulePeer): number {
  switch (snapPeerTier(peer)) {
    case 'fast':
      return MAX_IN_FLIGHT_FAST_PROVEN
    case 'standard':
      return MAX_IN_FLIGHT_PROVEN
    default:
      return MAX_IN_FLIGHT_PROBE
  }
}

export const UNPROVEN_RANGE_TIMEOUT_MS = 4_000
export const PROVEN_RANGE_TIMEOUT_MS = 8_000
export const UNPROVEN_PEER_REST_MS = 30_000
export const PROVEN_PEER_REST_MS = 3_000

export function rangeTimeoutForPeer(peer: SnapSchedulePeer): number {
  return peer.snapResponsesOk === 0 ? UNPROVEN_RANGE_TIMEOUT_MS : PROVEN_RANGE_TIMEOUT_MS
}

export function peerRestAfterTimeout(peer: SnapSchedulePeer): number {
  return peer.snapResponsesOk === 0 ? UNPROVEN_PEER_REST_MS : PROVEN_PEER_REST_MS
}

/** True when the peer (not the bucket) should be rested after a failed range. */
export function isPeerQuarantineRangeFailure(reason: string): boolean {
  if (reason.includes('peer returned accounts below request origin')) return false
  if (reason.includes('account range timed out')) return false
  if (reason.includes('snap peer left')) return false
  return true
}

/**
 * How long to stop asking this peer after a rejected range.
 * A page that sits below our cursor is dropped. The peer stays usable.
 * A proof shape the trie cannot accept still rests the peer.
 */
export function peerRestMsForRangeFailure(
  reason: string,
  peer: SnapSchedulePeer,
  consecutivePeerFailures: number,
): number | undefined {
  if (reason.includes('peer returned accounts below request origin')) return undefined
  if (reason.includes('empty account range without proof')) {
    return peer.snapResponsesOk === 0 ? UNPROVEN_PEER_REST_MS : 5_000
  }
  if (reason.includes('firstKey should be less than lastKey')) return PROVEN_PEER_REST_MS
  if (!isPeerQuarantineRangeFailure(reason)) return undefined
  if (consecutivePeerFailures >= 2) return UNPROVEN_PEER_REST_MS
  return peer.snapResponsesOk === 0 ? UNPROVEN_PEER_REST_MS : PROVEN_PEER_REST_MS
}

export function rankSnapPeers(peers: SnapSchedulePeer[]): SnapSchedulePeer[] {
  return [...peers].sort((a, b) => {
    const aProven = a.snapResponsesOk > 0 ? 0 : 1
    const bProven = b.snapResponsesOk > 0 ? 0 : 1
    if (aProven !== bProven) return aProven - bProven
    if (aProven === 0) {
      const aClean = a.snapTimeouts === 0 ? 0 : 1
      const bClean = b.snapTimeouts === 0 ? 0 : 1
      if (aClean !== bClean) return aClean - bClean
      const aAff = clientAffinityRank(a.clientFamily)
      const bAff = clientAffinityRank(b.clientFamily)
      if (aAff !== bAff) return aAff - bAff
      const aRtt = a.avgLatencyMs
      const bRtt = b.avgLatencyMs
      const aUnknown = aRtt === 0 ? 1 : 0
      const bUnknown = bRtt === 0 ? 1 : 0
      if (aUnknown !== bUnknown) return aUnknown - bUnknown
      if (aRtt !== bRtt) return aRtt - bRtt
      return b.snapResponsesOk - a.snapResponsesOk
    }
    return 0
  })
}
