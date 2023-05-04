import { MemoryLevel } from 'memory-level'

import type { BatchDBOp, DB } from '@ethereumjs/util'
import type { AbstractLevel } from 'abstract-level'

//export const ENCODING_OPTS = { keyEncoding: 'view', valueEncoding: 'view' }

/**
 * LevelDB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export class LevelDB implements DB {
  _leveldb: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

  /**
   * Initialize a DB instance. If `leveldb` is not provided, DB
   * defaults to an [in-memory store](https://github.com/Level/memdown).
   * @param leveldb - An abstract-leveldown compliant store
   */
  constructor(
    leveldb?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
  ) {
    this._leveldb = leveldb ?? new MemoryLevel()
  }

  /**
   * @inheritDoc
   */
  // @ts-expect-error
  async get(key: Uint8Array | string): Promise<Uint8Array | string | undefined> {
    let value
    let encoding = undefined
    // Set value encoding based on key type or specific key names so values are interpreted correctly by Level
    if (
      key instanceof Uint8Array ||
      key === 'CliqueSigners' ||
      key === 'CliqueVotes' ||
      key === 'CliqueBlockSignersSnapshot'
    )
      encoding = 'view'
    if (key === 'heads' || typeof key === 'number') {
      encoding = 'json'
    }
    try {
      value = await this._leveldb.get(key, {
        valueEncoding: encoding,
      })
      if (value === null) return undefined
    } catch (error: any) {
      // https://github.com/Level/abstract-level/blob/915ad1317694d0ce8c580b5ab85d81e1e78a3137/abstract-level.js#L309
      // This should be `true` if the error came from LevelDB
      // so we can check for `NOT true` to identify any non-404 errors
      if (error.notFound !== true) {
        throw error
      }
    }
    // eslint-disable-next-line
    if (value instanceof Buffer) value = Uint8Array.from(value)
    return value
  }

  /**
   * @inheritDoc
   */
  async put(key: Uint8Array | string, val: Uint8Array | string | any): Promise<void> {
    let valEncoding: string
    if (typeof val === 'string') {
      valEncoding = 'string'
    } else if (val instanceof Uint8Array) {
      valEncoding = 'view'
    } else valEncoding = 'json'
    await this._leveldb.put(key, val, { valueEncoding: valEncoding })
  }

  /**
   * @inheritDoc
   */
  async del(key: Uint8Array): Promise<void> {
    await this._leveldb.del(key)
  }

  /**
   * @inheritDoc
   */
  async batch(opStack: BatchDBOp[]): Promise<void> {
    await this._leveldb.batch(opStack)
  }

  /**
   * @inheritDoc
   */
  copy(): DB {
    //@ts-expect-error
    return new LevelDB(this._leveldb)
  }

  open() {
    return this._leveldb.open()
  }
}
