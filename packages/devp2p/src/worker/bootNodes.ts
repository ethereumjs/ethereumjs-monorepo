import type { BootstrapNodeConfig, Common } from '@ethereumjs/common'
import { type PrefixedHexString, hexToBytes } from '@ethereumjs/util'

import type { DPTOptions, PeerInfo } from '../types.ts'
import type { ThreadedNetworkInitOptions } from './protocol.ts'

/** Map a chain bootstrap ENR entry to a DPT {@link PeerInfo}. */
export function peerInfoFromBootstrapNode(node: BootstrapNodeConfig): PeerInfo {
  const idHex = node.id.startsWith('0x') ? node.id : `0x${node.id}`
  return {
    address: node.ip,
    udpPort: Number(node.port),
    tcpPort: Number(node.port),
    id: hexToBytes(idHex as PrefixedHexString),
  }
}

/** Bootstrap nodes from {@link Common.bootstrapNodes}. */
export function bootstrapBootnodesFromCommon(common: Common): PeerInfo[] {
  return common.bootstrapNodes().map(peerInfoFromBootstrapNode)
}

/** EIP-1459 DNS discovery options when the chain lists ENR trees. */
export function dptDnsOptionsFromCommon(
  common: Common,
): Pick<DPTOptions, 'shouldGetDnsPeers' | 'dnsNetworks'> {
  const dnsNetworks = common.dnsNetworks()
  if (dnsNetworks.length === 0) {
    return { shouldGetDnsPeers: false, dnsNetworks: [] }
  }
  return { shouldGetDnsPeers: true, dnsNetworks }
}

/**
 * Bootnodes for worker start: explicit `opts.bootnodes` wins (including `[]`).
 * When omitted and neighbour discovery is enabled, use chain bootstrap nodes.
 */
export function resolveWorkerBootnodes(
  opts: ThreadedNetworkInitOptions,
  common: Common,
): PeerInfo[] {
  if (opts.bootnodes !== undefined) {
    return opts.bootnodes
  }
  if (opts.shouldFindNeighbours === false) {
    return []
  }
  return bootstrapBootnodesFromCommon(common)
}
