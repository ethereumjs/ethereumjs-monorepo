import { type NoticeBoard } from './board.ts'

/** Quiet search window before the no-peer hint. Normal discovery is faster than this. */
export const P2P_QUIET_GRACE_MS = 12_000

const ONLINE_HOLD_MS = 5_000

const NO_PEERS = 'No peers yet. Firewall? VPN?'

export interface P2pLinkState {
  online: boolean
  warned: boolean
}

export function initialP2pLinkState(): P2pLinkState {
  return { online: false, warned: false }
}

export function discoveryLooksBlocked(message: string): boolean {
  return /ENOTFOUND|EAI_AGAIN|ENETUNREACH|EHOSTUNREACH|queryTxt/i.test(message)
}

/**
 * Map peer-count and discovery health onto the notice board.
 * Call on a timer as well as on telemetry so the grace window can elapse with no events.
 */
export function syncP2pLinkNotices(
  board: NoticeBoard,
  state: P2pLinkState,
  snap: { peerCount: number; startedAt: number; now: number; dnsTimedOut: boolean },
): P2pLinkState {
  if (snap.peerCount > 0) {
    if (!state.online) {
      board.clear('p2p-reachability', snap.now)
      board.clear('p2p-lost', snap.now)
      const text = snap.peerCount === 1 ? 'Peer connected.' : `${snap.peerCount} peers connected.`
      board.post(
        { key: 'p2p-online', level: 'info', text, relevantForMs: ONLINE_HOLD_MS },
        snap.now,
      )
    }
    return { online: true, warned: false }
  }

  if (state.online) {
    board.clear('p2p-online', snap.now)
    board.post({ key: 'p2p-lost', level: 'warn', text: NO_PEERS }, snap.now)
    return { online: false, warned: true }
  }

  if (snap.dnsTimedOut || snap.now - snap.startedAt >= P2P_QUIET_GRACE_MS) {
    board.post({ key: 'p2p-reachability', level: 'warn', text: NO_PEERS }, snap.now)
    return { online: false, warned: true }
  }

  return state
}
