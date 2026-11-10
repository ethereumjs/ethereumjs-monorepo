import type { EthySpine } from '../spine/types.ts'

const CLOCK_INNER_GAP = 8

function executionBlockLabel(spine: EthySpine): string | undefined {
  const block = spine.bestPeerHead ?? spine.headBlockNumber ?? spine.pivotBlockNumber
  if (block === undefined || block === 0n) return undefined
  return `Block ${block.toLocaleString('en-US')}`
}

function consensusSlotLabel(spine: EthySpine): string | undefined {
  if (spine.clOptimisticSlot !== undefined && spine.clOptimisticSlot > 0) {
    return `Slot ${spine.clOptimisticSlot.toLocaleString('en-US')}`
  }
  if (spine.demoClock === true) {
    return `Slot ${spine.currentSlot.toLocaleString('en-US')}`
  }
  return undefined
}

/** Top capability bar: EL block (when known) left of CL/demo slot, else block-only fallback. */
export function capabilityBarClockLabel(spine: EthySpine): string {
  const block = executionBlockLabel(spine)
  const slot = consensusSlotLabel(spine)
  if (block !== undefined && slot !== undefined) {
    return `${block}${' '.repeat(CLOCK_INNER_GAP)}${slot}`
  }
  if (slot !== undefined) return slot
  if (block !== undefined) return block
  return ''
}
