import { Block, BlockHeader } from '@ethereumjs/block'
import Blockchain from '..'

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
   * @param commonAncestor common ancestor block header (optional)
   * @param ancientHeaders array of ancestor block headers (optional)
   */
  newBlock(
    block: Block,
    commonAncestor?: BlockHeader,
    ancientHeaders?: BlockHeader[]
  ): Promise<void>
}

/**
 * Options when initializing a class that implements the Consensus interface.
 */
export interface ConsensusOptions {
  blockchain: Blockchain
}
