/** Why an RLPx session failed before a validated ETH STATUS. */
export const HANDSHAKE_REJECT_KEYS = [
  'genesis',
  'network',
  'fork',
  'reset',
  'slots',
  'timeout',
] as const

export type HandshakeRejectKey = (typeof HANDSHAKE_REJECT_KEYS)[number]

/**
 * Bucket a peer error or disconnect into a handshake reject reason.
 * Discovery ping timeouts are not handshake failures and return undefined.
 */
export function classifyHandshakeReject(message: string): HandshakeRejectKey | undefined {
  const text = message.toLowerCase()
  if (text.includes('genesis')) return 'genesis'
  if (text.includes('network id')) return 'network'
  if (text.includes('fork')) return 'fork'
  if (text.includes('econnreset') || text.includes('epipe') || text.includes('peer unreachable')) {
    return 'reset'
  }
  if (text.includes('too_many_peers') || text.includes('too many peers')) return 'slots'
  if (text.includes('timeout error: ping')) return undefined
  if (text.includes('timeout')) return 'timeout'
  return undefined
}
