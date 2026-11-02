/** Peer fields used by snap account / code schedulers (WP-04c). */
export type SnapSchedulePeer = {
  id: string
  caps: string[]
  snapResponsesOk: number
  snapTimeouts: number
  avgLatencyMs: number
}

export const MAX_IN_FLIGHT_PROVEN = 2
export const UNPROVEN_RANGE_TIMEOUT_MS = 4_000
export const PROVEN_RANGE_TIMEOUT_MS = 20_000
export const UNPROVEN_PEER_REST_MS = 30_000
export const PROVEN_PEER_REST_MS = 10_000

export function maxInFlightForPeer(peer: SnapSchedulePeer): number {
  if (peer.snapResponsesOk >= 2 && peer.snapTimeouts === 0) return MAX_IN_FLIGHT_PROVEN
  return 1
}

export function rangeTimeoutForPeer(peer: SnapSchedulePeer): number {
  return peer.snapResponsesOk === 0 ? UNPROVEN_RANGE_TIMEOUT_MS : PROVEN_RANGE_TIMEOUT_MS
}

export function peerRestAfterTimeout(peer: SnapSchedulePeer): number {
  return peer.snapResponsesOk === 0 ? UNPROVEN_PEER_REST_MS : PROVEN_PEER_REST_MS
}

/**
 * How long to stop asking this peer after a rejected range.
 * A page that sits below our cursor is dropped. The peer stays usable.
 * A proof shape the trie cannot accept still rests the peer.
 */
export function peerRestMsForRangeFailure(reason: string): number | undefined {
  if (reason.includes('peer returned accounts below request origin')) return undefined
  if (reason.includes('firstKey should be less than lastKey')) return PROVEN_PEER_REST_MS
  return undefined
}

export function rankSnapPeers(peers: SnapSchedulePeer[]): SnapSchedulePeer[] {
  return [...peers].sort((a, b) => {
    const aProven = a.snapResponsesOk > 0 ? 0 : 1
    const bProven = b.snapResponsesOk > 0 ? 0 : 1
    if (aProven !== bProven) return aProven - bProven
    if (aProven === 0) return a.avgLatencyMs - b.avgLatencyMs
    return 0
  })
}
