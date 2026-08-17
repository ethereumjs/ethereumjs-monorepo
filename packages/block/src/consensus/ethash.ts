import type { Block } from '../index.ts'

/**
 * Returns the canonical difficulty for this block.
 *
 * @param block - the block whose difficulty should be calculated
 * @param parentBlock - the parent of this `Block`
 */
export function ethashCanonicalDifficulty(block: Block, parentBlock: Block): bigint {
  return block.header.ethashCanonicalDifficulty(parentBlock.header)
}
