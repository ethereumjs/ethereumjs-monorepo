// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'
import { Block } from '@ethereumjs/block'
import Ethash from '@ethereumjs/ethash'
import { ConsensusBase } from './base'

/**
 * This class encapsulates Ethash-related consensus functionality when used with the Blockchain class.
 */
export class EthashConsensus extends ConsensusBase {
  _ethash: Ethash | undefined

  constructor(db: LevelUp) {
    super(db)
  }

  async setup(): Promise<void> {
    this._ethash = new Ethash(this.db)
  }

  async validate(block: Block): Promise<void> {
    const valid = await this._ethash!.verifyPOW(block)
    if (!valid) {
      throw new Error('invalid POW')
    }
  }
}
