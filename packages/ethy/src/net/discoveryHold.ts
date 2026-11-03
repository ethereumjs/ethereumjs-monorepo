/** Target snap peers before VIP redial stops (WP-04f). */
export const VIP_SNAP_PEER_TARGET = 6

/**
 * Whether snap sync should pause discovery.
 *
 * Hold when enough proven peers are serving (>= 5), sticky while held and >= 4 serving.
 */
export function wantSnapDiscoveryHold(opts: {
  snapSessions: number
  servingSnapPeers: number
  held: boolean
}): boolean {
  if (opts.snapSessions <= 0) return false
  if (opts.servingSnapPeers >= 5) return true
  if (opts.held && opts.servingSnapPeers >= 4) return true
  return false
}

/** Connected spine peers that count toward {@link VIP_SNAP_PEER_TARGET}. */
export function countSnapPeersTowardVipTarget(
  peers: ReadonlyArray<{ snapSession?: boolean; snapResponsesOk?: number }>,
): number {
  return peers.filter((p) => p.snapSession === true && (p.snapResponsesOk ?? 0) > 0).length
}

/** VIP redial may run while below target even when discovery is paused. */
export function shouldVipReconnect(opts: {
  snapPeersTowardTarget: number
  target?: number
}): boolean {
  const target = opts.target ?? VIP_SNAP_PEER_TARGET
  return opts.snapPeersTowardTarget < target
}
