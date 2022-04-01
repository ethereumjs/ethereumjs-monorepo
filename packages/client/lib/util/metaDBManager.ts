import { intToBuffer } from 'ethereumjs-util'
import { Chain } from '../blockchain'
import { Config } from '../config'
// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'

const encodingOpts = { keyEncoding: 'binary', valueEncoding: 'binary' }

/**
 * Number prepended to the db key to avoid collisions
 * when using the meta db for different data.
 *
 * Only append new items to the bottom of the list to
 * remain backward compat.
 */
export enum DBKey {
  Receipts,
  TxHash,
  SkeletonBlock,
  SkeletonStatus,
}

export interface MetaDBManagerOptions {
  /* Chain */
  chain: Chain

  /* Config */
  config: Config

  /* Meta database (receipts, logs, indexes) */
  metaDB: LevelUp
}

/**
 * Helper class to access the metaDB with methods `put`, `get`, and `delete`
 */
export class MetaDBManager {
  protected chain: Chain
  protected config: Config
  private metaDB: LevelUp

  constructor(options: MetaDBManagerOptions) {
    this.chain = options.chain
    this.config = options.config
    this.metaDB = options.metaDB
  }

  private dbKey(type: DBKey, key: Buffer) {
    return Buffer.concat([intToBuffer(type), key])
  }

  async put(type: DBKey, hash: Buffer, value: Buffer) {
    await this.metaDB.put(this.dbKey(type, hash), value, encodingOpts)
  }

  async get(type: DBKey, hash: Buffer): Promise<Buffer | null> {
    try {
      return await this.metaDB.get(this.dbKey(type, hash), encodingOpts)
    } catch (error: any) {
      if (error.type === 'NotFoundError') {
        return null
      }
      throw Error
    }
  }

  async delete(type: DBKey, hash: Buffer) {
    await this.metaDB.del(this.dbKey(type, hash), encodingOpts)
  }
}
