import { Database, open } from 'lmdb'

import type { BatchDBOp, DB } from '@ethereumjs/util'

export class LMDB implements DB {
  readonly _path: string
  readonly _database: Database

  constructor(path: string) {
    this._path = path
    this._database = open({
      compression: true,
      name: '@ethereumjs/trie',
      path,
    })
  }

  async get(key: Uint8Array): Promise<Uint8Array | undefined> {
    return this._database.get(key)
  }

  async put(key: Uint8Array, val: Uint8Array): Promise<void> {
    await this._database.put(key, val)
  }

  async del(key: Uint8Array): Promise<void> {
    await this._database.remove(key)
  }

  async batch(opStack: BatchDBOp[]): Promise<void> {
    for (const op of opStack) {
      if (op.type === 'put') {
        await this.put(op.key, op.value)
      }

      if (op.type === 'del') {
        await this.del(op.key)
      }
    }
  }

  copy(): DB {
    return new LMDB(this._path)
  }

  open() {
    return Promise.resolve()
  }
}
