import { ConsensusAlgorithm } from '@ethereumjs/common'

import type { Blockchain } from '../index.js'
import type { Consensus, ConsensusOptions } from '../types.js'
import type { Block, BlockHeader } from '@ethereumjs/block'

type MinimalEthashInterface = {
  cacheDB?: any
  verifyPOW(block: Block): Promise<boolean>
}

/**
 * This class encapsulates Ethash-related consensus functionality when used with the Blockchain class.
 */
export class EthashConsensus implements Consensus {
  blockchain: Blockchain | undefined
  algorithm: ConsensusAlgorithm
  _ethash: MinimalEthashInterface

  constructor(ethash: MinimalEthashInterface) {
    this.algorithm = ConsensusAlgorithm.Ethash
    this._ethash = ethash
  }

  async validateConsensus(block: Block): Promise<void> {
    const valid = await this._ethash.verifyPOW(block)
    if (!valid) {
      throw new Error('invalid POW')
    }
  }

  /**
   * Checks that the block's `difficulty` matches the canonical difficulty of the parent header.
   * @param header - header of block to be checked
   */
  async validateDifficulty(header: BlockHeader) {
    if (!this.blockchain) {
      throw new Error('blockchain not provided')
    }
    const parentHeader = await this.blockchain['_getHeader'](header.parentHash)
    if (header.ethashCanonicalDifficulty(parentHeader) !== header.difficulty) {
      throw new Error(`invalid difficulty ${header.errorStr()}`)
    }
  }

  public async genesisInit(): Promise<void> {}
  public async setup({ blockchain }: ConsensusOptions): Promise<void> {
    this.blockchain = blockchain
    this._ethash.cacheDB = this.blockchain!.db as any
  }
  public async newBlock(): Promise<void> {}
}
