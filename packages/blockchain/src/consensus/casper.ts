import Blockchain from '..'
import { Consensus, ConsensusOptions } from './interface'

/**
 * This class encapsulates Casper-related consensus functionality when used with the Blockchain class.
 */
export class CasperConsensus implements Consensus {
  blockchain: Blockchain

  constructor({ blockchain }: ConsensusOptions) {
    this.blockchain = blockchain
  }

  public async genesisInit(): Promise<void> {}
  public async setup(): Promise<void> {}
  public async validate(): Promise<void> {}
  public async newBlock(): Promise<void> {}
}
