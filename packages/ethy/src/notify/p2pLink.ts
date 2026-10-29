import type { WorkerDiscoverySnapshot } from '@ethereumjs/devp2p'

import { type NoticeBoard } from './board.ts'

/** Quiet search window before the reachability hint. Normal discovery is faster than this. */
export const P2P_QUIET_GRACE_MS = 12_000

const ONLINE_HOLD_MS = 5_000

/** Short hint when discovery never gets off the ground (network path, not peer slots). */
export const P2P_REACHABILITY_HINT = 'Discovery down. Firewall? VPN?'

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

/** True once UDP/DNS/RLPx work has visibly started (peers may still be zero). */
export function p2pDiscoveryTrafficSeen(discovery: WorkerDiscoverySnapshot | undefined): boolean {
  if (discovery === undefined) return false
  if (discovery.rlpx.dials > 0 || discovery.rlpx.connected > 0) return true
  if (discovery.dns.attempts > 0) return true
  if (discovery.bootstrap.attempts > 0) return true
  if (discovery.tablePeers > 0) return true
  return false
}

export function shouldWarnP2pReachability(snap: {
  peerCount: number
  startedAt: number
  now: number
  dnsTimedOut: boolean
  discovery?: WorkerDiscoverySnapshot
}): boolean {
  if (snap.peerCount > 0) return false
  if (p2pDiscoveryTrafficSeen(snap.discovery)) return false
  if (snap.dnsTimedOut) return true
  return snap.now - snap.startedAt >= P2P_QUIET_GRACE_MS
}

/**
 * Map peer-count and discovery health onto the notice board.
 * Call on a timer as well as on telemetry so the grace window can elapse with no events.
 */
export function syncP2pLinkNotices(
  board: NoticeBoard,
  state: P2pLinkState,
  snap: {
    peerCount: number
    startedAt: number
    now: number
    dnsTimedOut: boolean
    discovery?: WorkerDiscoverySnapshot
  },
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
    return { online: false, warned: state.warned }
  }

  if (shouldWarnP2pReachability(snap)) {
    board.post({ key: 'p2p-reachability', level: 'warn', text: P2P_REACHABILITY_HINT }, snap.now)
    return { online: false, warned: true }
  }

  if (state.warned) {
    board.clear('p2p-reachability', snap.now)
    return { online: false, warned: false }
  }

  return state
}
