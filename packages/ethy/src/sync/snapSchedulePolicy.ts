/** Peer fields used by snap account / code schedulers (WP-04c). */
export type SnapSchedulePeer = {
  id: string
  caps: string[]
  snapResponsesOk: number
  snapTimeouts: number
  avgLatencyMs: number
}

export const MAX_IN_FLIGHT_PROVEN = 2
/** Extra pipeline depth for fast proven peers (WP-04g). */
export const MAX_IN_FLIGHT_FAST_PROVEN = 4
export const UNPROVEN_RANGE_TIMEOUT_MS = 4_000
export const PROVEN_RANGE_TIMEOUT_MS = 20_000
export const UNPROVEN_PEER_REST_MS = 30_000
export const PROVEN_PEER_REST_MS = 10_000

export function maxInFlightForPeer(peer: SnapSchedulePeer): number {
  if (
    peer.snapResponsesOk >= 4 &&
    peer.snapTimeouts === 0 &&
    peer.snapTimeouts * 4 <= peer.snapResponsesOk
  ) {
    return MAX_IN_FLIGHT_FAST_PROVEN
  }
  if (peer.snapResponsesOk >= 2 && peer.snapTimeouts * 4 <= peer.snapResponsesOk) {
    return MAX_IN_FLIGHT_PROVEN
  }
  return 1
}

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
      const aRtt = a.avgLatencyMs
      const bRtt = b.avgLatencyMs
      const aUnknown = aRtt === 0 ? 1 : 0
      const bUnknown = bRtt === 0 ? 1 : 0
      if (aUnknown !== bUnknown) return aUnknown - bUnknown
      return aRtt - bRtt
    }
    return 0
  })
}
