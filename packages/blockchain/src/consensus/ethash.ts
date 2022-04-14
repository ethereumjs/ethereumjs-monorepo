import { Block } from '@ethereumjs/block'
import Ethash from '@ethereumjs/ethash'
import Blockchain from '..'
import { Consensus, ConsensusOptions } from './interface'

/**
 * This class encapsulates Ethash-related consensus functionality when used with the Blockchain class.
 */
export class EthashConsensus implements Consensus {
  blockchain: Blockchain
  _ethash: Ethash

  constructor({ blockchain }: ConsensusOptions) {
    this.blockchain = blockchain
    this._ethash = new Ethash(this.blockchain.db)
  }

  async validate(block: Block): Promise<void> {
    const valid = await this._ethash.verifyPOW(block)
    if (!valid) {
      throw new Error('invalid POW')
    }
  }

  public async genesisInit(): Promise<void> {}
  public async setup(): Promise<void> {}
  public async newBlock(): Promise<void> {}
}
