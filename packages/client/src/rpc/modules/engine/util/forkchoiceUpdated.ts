import type { Chain } from '../../../../blockchain'
import type { ChainCache } from '../types'

export const pruneCachedBlocks = (chain: Chain, chainCache: ChainCache) => {
  const { remoteBlocks, executedBlocks, invalidBlocks } = chainCache
  const finalized = chain.blocks.finalized
  if (finalized !== null) {
    // prune remoteBlocks
    const pruneRemoteBlocksTill = finalized.header.number
    for (const blockHash of remoteBlocks.keys()) {
      const block = remoteBlocks.get(blockHash)
      if (block !== undefined && block.header.number <= pruneRemoteBlocksTill) {
        remoteBlocks.delete(blockHash)
      }
    }

    // prune executedBlocks
    const vm = chain.blocks.vm
    if (vm !== null) {
      const pruneExecutedBlocksTill =
        vm.header.number < finalized.header.number ? vm.header.number : finalized.header.number
      for (const blockHash of executedBlocks.keys()) {
        const block = executedBlocks.get(blockHash)
        if (block !== undefined && block.header.number < pruneExecutedBlocksTill) {
          executedBlocks.delete(blockHash)
        }
      }
    }

    // prune invalidBlocks with some max length
    const pruneInvalidLength = invalidBlocks.size - chain.config.maxInvalidBlocksErrorCache
    let pruned = 0
    for (const blockHash of invalidBlocks.keys()) {
      if (pruned >= pruneInvalidLength) {
        break
      }
      invalidBlocks.delete(blockHash)
      pruned++
    }
  }
}
