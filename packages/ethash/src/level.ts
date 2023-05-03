import { MemoryLevel } from 'memory-level'

import type { BatchDBOp, DB } from '@ethereumjs/util'
import type { AbstractLevel } from 'abstract-level'

const ENCODING_OPTS = { valueEncoding: 'json' }

export class LevelDB implements DB {
  readonly _leveldb: AbstractLevel<
    string | Uint8Array,
    string | Uint8Array,
    {
      cache: string[]
      fullSize: number
      cacheSize: number
      seed: string
    }
  >

  constructor(
    leveldb?: AbstractLevel<
      string | Uint8Array,
      string | Uint8Array,
      {
        cache: string[]
        fullSize: number
        cacheSize: number
        seed: string
      }
    >
  ) {
    this._leveldb = leveldb ?? new MemoryLevel(ENCODING_OPTS)
  }

  async get(key: any): Promise<any> {
    let value
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error: any) {
      // https://github.com/Level/abstract-level/blob/915ad1317694d0ce8c580b5ab85d81e1e78a3137/abstract-level.js#L309
      // This should be `true` if the error came from LevelDB
      // so we can check for `NOT true` to identify any non-404 errors
      if (error.notFound !== true) {
        throw error
      }
    }
    return value
  }

  async put(key: Uint8Array, val: any): Promise<void> {
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  async del(key: any): Promise<void> {
    await this._leveldb.del(key)
  }

  async batch(opStack: BatchDBOp[]): Promise<void> {
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }

  copy(): DB {
    return new LevelDB(this._leveldb)
  }

  open() {
    return this._leveldb.open()
  }
}
