// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'
import { Block } from '@ethereumjs/block'
import Ethash from '@ethereumjs/ethash'
import { Consensus } from './interface'

/**
 * This class encapsulates Ethash-related consensus functionality when used with the Blockchain class.
 */
export class EthashConsensus implements Consensus {
  db: LevelUp
  _ethash: Ethash

  constructor(db: LevelUp) {
    this.db = db
    this._ethash = new Ethash(this.db)
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
