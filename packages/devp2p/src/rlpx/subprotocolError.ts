/**
 * A bad STATUS or a base-protocol frame ends the session.
 * A later eth or snap message that we cannot decode does not: the peer may
 * still be serving headers and state.
 */
export function subprotocolErrorDropsPeer(protocolName: string, msgCode: number): boolean {
  if (protocolName === 'Peer') return true
  if (protocolName === 'ETH' && msgCode === 0x00) return true
  return false
}
