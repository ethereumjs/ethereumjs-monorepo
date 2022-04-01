// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'
import { Consensus } from './interface'

/**
 * This class encapsulates Casper-related consensus functionality when used with the Blockchain class.
 */
export class CasperConsensus implements Consensus {
  db: LevelUp

  constructor(db: LevelUp) {
    this.db = db
  }

  public async genesisInit(): Promise<void> {}
  public async setup(): Promise<void> {}
  public async validate(): Promise<void> {}
  public async newBlock(): Promise<void> {}
}
