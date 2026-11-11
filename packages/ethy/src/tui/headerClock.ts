import { isNodeAtChainHead, raiseBestPeerHead, resolveChainHeadClock } from '../spine/chainHead.ts'
import type { EthySpine } from '../spine/types.ts'
import { BOLD, DIM, RESET } from './ansi.ts'

const CLOCK_INNER_GAP = 8

export { isNodeAtChainHead, raiseBestPeerHead, resolveChainHeadClock }
export type { ChainHeadClock } from '../spine/chainHead.ts'

function formatBlockLabel(block: bigint, atHead: boolean): string {
  const num = block.toLocaleString('en-US')
  if (atHead) return `${BOLD}Block${RESET} ${num}`
  return `${DIM}Block ${num}${RESET}`
}

function formatSlotLabel(slot: number, brightSlot: boolean, atHead: boolean): string {
  const num = slot.toLocaleString('en-US')
  if (atHead && brightSlot) return `${BOLD}Slot${RESET} ${num}`
  return `${DIM}Slot ${num}${RESET}`
}

/** Top capability bar: synchronized canonical chain head; dimmed while catching up. */
export function capabilityBarClockLabel(spine: EthySpine): string {
  const clock = resolveChainHeadClock(spine)
  if (clock === undefined) return ''
  const atHead = isNodeAtChainHead(spine)
  const brightSlot = spine.clStatus === 'verified' || spine.demoClock === true
  const block = formatBlockLabel(clock.chainHeadBlock, atHead)
  if (clock.chainHeadSlot !== undefined) {
    const slot = formatSlotLabel(clock.chainHeadSlot, brightSlot, atHead)
    return `${block}${' '.repeat(CLOCK_INNER_GAP)}${slot}`
  }
  return block
}
