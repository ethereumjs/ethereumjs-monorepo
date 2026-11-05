import type { EthySpine } from '../spine/types.ts'

/** Top capability bar clock label: CL slot, demo slot, or EL block number (WP-06d). */
export function capabilityBarClockLabel(spine: EthySpine): string {
  if (spine.clOptimisticSlot !== undefined && spine.clOptimisticSlot > 0) {
    return `Slot ${spine.clOptimisticSlot.toLocaleString('en-US')}`
  }
  if (spine.demoClock === true) {
    return `Slot ${spine.currentSlot.toLocaleString('en-US')}`
  }
  const block = spine.bestPeerHead ?? spine.headBlockNumber ?? spine.pivotBlockNumber ?? 0n
  return `Block #${block.toLocaleString('en-US')}`
}
