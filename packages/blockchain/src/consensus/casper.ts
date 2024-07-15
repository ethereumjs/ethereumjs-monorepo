import { ConsensusAlgorithm } from '@ethereumjs/common'

import type { Consensus } from '../types.js'

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

  public async validateDifficulty(): Promise<void> {}
  public async newBlock(): Promise<void> {}
}
