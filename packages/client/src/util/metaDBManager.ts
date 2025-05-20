import { concatBytes, intToBytes } from '@ethereumjs/util'

import type { AbstractLevel } from 'abstract-level'
import type { Chain } from '../blockchain/index.ts'
import type { Config } from '../config.ts'

const encodingOpts = { keyEncoding: 'view', valueEncoding: 'view' }

export type DBKey = (typeof DBKey)[keyof typeof DBKey]

export const DBKey = {
  Receipts: 0,
  TxHash: 1,
  SkeletonBlock: 2,
  SkeletonBlockHashToNumber: 3,
  SkeletonStatus: 4,
  SkeletonUnfinalizedBlockByHash: 5,
  Preimage: 6,
} as const

export interface MetaDBManagerOptions {
  /* Chain */
  chain: Chain

  /* Config */
  config: Config

  /* Meta database (receipts, logs, indexes) */
  metaDB: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
}

/**
 * Helper class to access the metaDB with methods `put`, `get`, and `delete`
 */
export class MetaDBManager {
  protected chain: Chain
  protected config: Config
  private metaDB: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

  constructor(options: MetaDBManagerOptions) {
    this.chain = options.chain
    this.config = options.config
    this.metaDB = options.metaDB
  }

  private dbKey(type: DBKey, key: Uint8Array) {
    return concatBytes(intToBytes(type), key)
  }

  async put(type: DBKey, hash: Uint8Array, value: Uint8Array) {
    await this.metaDB.put(this.dbKey(type, hash), value, encodingOpts)
  }

  async get(type: DBKey, hash: Uint8Array): Promise<Uint8Array | null> {
    try {
      const value = await this.metaDB.get(this.dbKey(type, hash), encodingOpts)
      if (value === null || value === undefined) {
        return null
      }
      return value as Uint8Array
    } catch (error: any) {
      if (error.code === 'LEVEL_NOT_FOUND') {
        return null
      }
      throw Error
    }
  }

  async delete(type: DBKey, hash: Uint8Array) {
    await this.metaDB.del(this.dbKey(type, hash), encodingOpts)
  }
}
