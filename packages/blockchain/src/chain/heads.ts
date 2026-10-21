import { equalsBytes } from '@ethereumjs/util'

/** In-memory head pointers updated during put, reorg, and delete. */
export type BlockchainHeadState = {
  headHeaderHash?: Uint8Array
  headBlockHash?: Uint8Array
  heads: Record<string, Uint8Array>
}

/** New item becomes the canonical header head; block head moves only for a full block. */
export function noteCanonicalPut(
  state: BlockchainHeadState,
  blockHash: Uint8Array,
  isFullBlock: boolean,
): void {
  state.headHeaderHash = blockHash
  if (isFullBlock) {
    state.headBlockHash = blockHash
  }
}

/** Non-canonical full block with higher TD than the block head: advance block head only. */
export function noteSideChainBody(state: BlockchainHeadState, blockHash: Uint8Array): void {
  state.headBlockHash = blockHash
}

/** If a head pointer still references a hash leaving the canonical chain, move it to the parent. */
export function rewindHeadIfEquals(
  state: BlockchainHeadState,
  staleHash: Uint8Array,
  targetHash: Uint8Array,
): void {
  if (state.headHeaderHash !== undefined && equalsBytes(state.headHeaderHash, staleHash) === true) {
    state.headHeaderHash = targetHash
  }
  if (state.headBlockHash !== undefined && equalsBytes(state.headBlockHash, staleHash) === true) {
    state.headBlockHash = targetHash
  }
}

/** Move named iterator heads that still reference a stale canonical hash. */
export function rewindIteratorHeadsIfEquals(
  state: BlockchainHeadState,
  staleHash: Uint8Array,
  targetHash: Uint8Array,
): void {
  for (const name of Object.keys(state.heads)) {
    if (equalsBytes(state.heads[name], staleHash)) {
      state.heads[name] = targetHash
    }
  }
}

/** During canonical rebuild, move the block head if it matched the stale number→hash entry. */
export function rewindBlockHeadIfEquals(
  state: BlockchainHeadState,
  staleHash: Uint8Array,
  targetHash: Uint8Array,
): void {
  if (state.headBlockHash !== undefined && equalsBytes(state.headBlockHash, staleHash) === true) {
    state.headBlockHash = targetHash
  }
}
