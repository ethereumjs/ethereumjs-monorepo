import { isNodeAtChainHead, raiseBestPeerHead, resolveChainHeadClock } from '../spine/chainHead.ts'
import type { EthySpine } from '../spine/types.ts'
import { BOLD, DIM, RESET } from './ansi.ts'

const CLOCK_INNER_GAP = 6

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

/** JSON-RPC endpoint is ready for wallet traffic (WP-08a). */
export function isRpcReady(spine: EthySpine): boolean {
  if (spine.rpc?.listening !== true) return false
  if (spine.demoClock === true || isNodeAtChainHead(spine)) return true
  if (
    spine.totalAccountsSynced > 0 &&
    (spine.phase === 'HEAD_FOLLOWING' || spine.phase === 'BAL_CATCHUP')
  ) {
    return true
  }
  return false
}

function formatJsonRpcLabel(spine: EthySpine): string {
  if (spine.rpc?.enabled === false) return `${DIM}JSON-RPC${RESET}`
  if (isRpcReady(spine)) return `${BOLD}JSON-RPC${RESET}`
  return `${DIM}JSON-RPC${RESET}`
}

/** Top capability bar: synchronized canonical chain head; dimmed while catching up. */
export function capabilityBarClockLabel(spine: EthySpine): string {
  const clock = resolveChainHeadClock(spine)
  if (clock === undefined) return formatJsonRpcLabel(spine)
  const atHead = isNodeAtChainHead(spine)
  const brightSlot = spine.clStatus === 'verified' || spine.demoClock === true
  const block = formatBlockLabel(clock.chainHeadBlock, atHead)
  const rpc = formatJsonRpcLabel(spine)
  if (clock.chainHeadSlot !== undefined) {
    const slot = formatSlotLabel(clock.chainHeadSlot, brightSlot, atHead)
    return `${block}${' '.repeat(CLOCK_INNER_GAP)}${slot}${' '.repeat(CLOCK_INNER_GAP)}${rpc}`
  }
  return `${block}${' '.repeat(CLOCK_INNER_GAP)}${rpc}`
}
