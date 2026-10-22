import type { DPT } from '../dpt/dpt.ts'
import type { RLPx } from '../rlpx/rlpx.ts'

/** Test/lab access to RLPx internals (same as legacy simulator tests). */
export function rlpxDpt(rlpx: RLPx): DPT {
  const dpt = (rlpx as unknown as { _dpt: DPT | null })._dpt
  if (dpt === null) {
    throw new Error('RLPx has no DPT')
  }
  return dpt
}

export function rlpxPeersQueue(rlpx: RLPx): unknown[] {
  return (rlpx as unknown as { _peersQueue: unknown[] })._peersQueue
}
