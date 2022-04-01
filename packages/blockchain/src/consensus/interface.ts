import { Block, BlockHeader } from '@ethereumjs/block'

/**
 * Interface that a consensus class needs to implement.
 */
export interface Consensus {
  /**
   * Initialize genesis for consensus mechanism
   * @param genesisBlock genesis block
   */
  genesisInit(genesisBlock: Block): Promise<void>

  /**
   * Set up consensus mechanism
   */
  setup(): Promise<void>

  /**
   * Validate block
   * @param block block to be validated
   */
  validate(block: Block): Promise<void>

  /**
   * Update consensus on new block
   * @param block new block
   * @param commonAncestor common ancestor block header
   * @param ancientHeaders array of ancestor block headers (optional)
   */
  newBlock(block: Block, commonAncestor: BlockHeader, ancientHeaders?: BlockHeader[]): Promise<void>
}
