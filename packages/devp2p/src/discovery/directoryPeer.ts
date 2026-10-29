import type { PeerInfo } from '../types.ts'

/** Bootnode or DNS ENR peer for this chain. discv4 neighbors are not chain-specific. */
export function markChainDirectoryPeer(peer: PeerInfo): PeerInfo {
  peer.chainDirectory = true
  return peer
}

export function isChainDirectoryPeer(peer: PeerInfo): boolean {
  return peer.chainDirectory === true
}
