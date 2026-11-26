import { localVerifiedBlock, resolveChainHeadClock } from '../spine/chainHead.ts'
import type { EthySpine } from '../spine/types.ts'

function countMaskBits16(mask: number): number {
  let n = mask & 0xffff
  let c = 0
  while (n !== 0) {
    c += n & 1
    n >>>= 1
  }
  return c
}

function maskHex(mask: number): string {
  return `0x${(mask & 0xffff).toString(16)}`
}

/** JSON-RPC custody telemetry shared by `ethy_custodyStatus` and `ethy_status`. */
export function custodyStatusPayload(spine: EthySpine): Record<string, unknown> {
  const assigned = spine.custodyBuckets ?? []
  let custodyBucketsMask = 0
  for (const b of assigned) {
    if (b >= 0 && b <= 15) custodyBucketsMask |= 1 << b
  }
  const closed = spine.closedBucketsMask ?? 0
  const uncovered = spine.machine?.uncoveredBucketsMask ?? 0
  const swarmReachable = (closed | (~uncovered & 0xffff)) & 0xffff
  const localHead = localVerifiedBlock(spine)
  const clock = resolveChainHeadClock(spine)
  return {
    custodyCount: spine.custodyDialCount ?? assigned.length,
    custodyBucketsMask: maskHex(custodyBucketsMask),
    closedBucketsMask: maskHex(closed),
    trieBucketsMask:
      spine.ethyTrieBucketsBitmask !== undefined
        ? maskHex(spine.ethyTrieBucketsBitmask)
        : undefined,
    swarmReachableBucketsMask: maskHex(swarmReachable),
    privateBucketsCount: countMaskBits16(closed),
    hopBuckets: spine.machine?.hopBuckets,
    balHorizon: {
      localVerifiedBlock: localHead?.toString(),
      chainHeadBlock: clock?.chainHeadBlock.toString(),
      bestPeerHead: spine.bestPeerHead?.toString(),
    },
    resolutionStats: spine.custodyResolve,
  }
}
