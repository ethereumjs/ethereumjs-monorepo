import type { EthySpine } from './types.ts'

export type ChainHeadClock = {
  chainHeadBlock: bigint
  chainHeadSlot?: number
}

function maxDefinedBigInt(...values: Array<bigint | undefined>): bigint | undefined {
  let best: bigint | undefined
  for (const v of values) {
    if (v === undefined || v === 0n) continue
    if (best === undefined || v > best) best = v
  }
  return best
}

/** Raise {@link EthySpine.bestPeerHead} monotonically (never rewind on stale peer telemetry). */
export function raiseBestPeerHead(spine: EthySpine, blockNumber: bigint): void {
  if (blockNumber === 0n) return
  if (spine.bestPeerHead === undefined || blockNumber > spine.bestPeerHead) {
    spine.bestPeerHead = blockNumber
  }
}

/** Best known canonical chain head on the network (independent of local sync lag). */
export function resolveChainHeadClock(spine: EthySpine): ChainHeadClock | undefined {
  const chainHeadBlock =
    maxDefinedBigInt(
      spine.clOptimisticBlockNumber,
      spine.bestPeerHead,
      spine.headBlockNumber,
      spine.lastVerifiedBlockNumber,
    ) ??
    (spine.pivotBlockNumber !== undefined && spine.pivotBlockNumber > 0n
      ? spine.pivotBlockNumber
      : undefined)
  if (chainHeadBlock === undefined) return undefined

  let chainHeadSlot: number | undefined
  if (spine.demoClock === true) {
    chainHeadSlot = spine.currentSlot
  } else if (spine.clOptimisticSlot !== undefined && spine.clOptimisticSlot > 0) {
    chainHeadSlot = spine.clOptimisticSlot
    const clBlock = spine.clOptimisticBlockNumber
    if (clBlock !== undefined && clBlock > 0n && chainHeadBlock > clBlock) {
      const delta = Number(chainHeadBlock - clBlock)
      if (delta > 0 && delta <= 32) {
        chainHeadSlot = spine.clOptimisticSlot + delta
      }
    }
  }

  return { chainHeadBlock, chainHeadSlot }
}

export function localVerifiedBlock(spine: EthySpine): bigint | undefined {
  return spine.headBlockNumber ?? spine.lastVerifiedBlockNumber
}

/** True when Ethy is in `HEAD_FOLLOWING` within `<= 2` blocks of the canonical chain head. */
export function isNodeAtChainHead(spine: EthySpine): boolean {
  if (spine.phase !== 'HEAD_FOLLOWING') return false
  const clock = resolveChainHeadClock(spine)
  const local = localVerifiedBlock(spine)
  if (clock === undefined || local === undefined) return false
  const lag = clock.chainHeadBlock > local ? clock.chainHeadBlock - local : 0n
  return lag <= 2n
}
