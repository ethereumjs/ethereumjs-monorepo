import { isTruthy } from '@ethereumjs/util'
import level from 'level-mem'

import type { BatchDBOp, DB } from '@ethereumjs/trie'
import type { LevelUp } from 'levelup'

const ENCODING_OPTS = { keyEncoding: 'binary', valueEncoding: 'binary' }

export class LevelDB implements DB {
  readonly _leveldb: LevelUp

  constructor(leveldb?: LevelUp | null) {
    this._leveldb = leveldb ?? level()
  }

  async get(key: Buffer): Promise<Buffer | null> {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error: any) {
      if (isTruthy(error.notFound)) {
        // not found, returning null
      } else {
        throw error
      }
    }
    return value as Buffer
  }

  async put(key: Buffer, val: Buffer): Promise<void> {
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  async del(key: Buffer): Promise<void> {
    await this._leveldb.del(key, ENCODING_OPTS)
  }

  async batch(opStack: BatchDBOp[]): Promise<void> {
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }

  copy(): DB {
    return new LevelDB(this._leveldb)
  }
}
