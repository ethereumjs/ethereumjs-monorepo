import { ConsensusAlgorithm } from '@ethereumjs/common'
import { BIGINT_0 } from '@ethereumjs/util'

import type { Consensus } from '../types.js'
import type { BlockHeader } from '@ethereumjs/block'

/**
 * This class encapsulates Casper-related consensus functionality when used with the Blockchain class.
 */
export class CasperConsensus implements Consensus {
  algorithm: ConsensusAlgorithm

  constructor() {
    this.algorithm = ConsensusAlgorithm.Casper
  }

  public async genesisInit(): Promise<void> {}

  public async setup(): Promise<void> {}

  public async validateConsensus(): Promise<void> {}

  public async validateDifficulty(header: BlockHeader): Promise<void> {
    if (header.difficulty !== BIGINT_0) {
      const msg = 'invalid difficulty.  PoS blocks must have difficulty 0'
      throw new Error(`${msg} ${header.errorStr()}`)
    }
  }
  public async newBlock(): Promise<void> {}
}
