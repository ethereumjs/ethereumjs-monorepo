/**
 * Whether snap sync should pause discovery.
 *
 * A live snap session that has already served a page is enough to hold.
 * Two snap sessions hold even before the first page. Zero sessions always
 * resumes the search. One session that has not answered yet keeps the
 * previous choice, so startup can still look for a second peer.
 */
export function wantSnapDiscoveryHold(opts: {
  snapSessions: number
  servingSnapPeers: number
  held: boolean
}): boolean {
  if (opts.snapSessions <= 0) return false
  if (opts.servingSnapPeers >= 1 || opts.snapSessions >= 2) return true
  return opts.held
}
