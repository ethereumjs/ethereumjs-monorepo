import { Block, BlockHeader } from '@ethereumjs/block'
import Ethash, { EthashCacheDB } from '@ethereumjs/ethash'
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
    this._ethash = new Ethash(this.blockchain.db as unknown as EthashCacheDB)
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
    const parentHeader = (await this.blockchain.getBlock(header.parentHash)).header
    if (header.ethashCanonicalDifficulty(parentHeader) !== header.difficulty) {
      throw new Error(`invalid difficulty ${header.errorStr()}`)
    }
  }

  public async genesisInit(): Promise<void> {}
  public async setup(): Promise<void> {}
  public async newBlock(): Promise<void> {}
}
