import { DB, BatchDBOp } from '@ethereumjs/util'
import { bytesToHex } from 'ethereum-cryptography/utils'

export class MapDB implements DB {
  _database: Map<string, Uint8Array>

  constructor(database?: Map<string, Uint8Array>) {
    this._database = database ?? new Map()
  }

  async get(key: Uint8Array): Promise<Uint8Array | null> {
    const result = this._database.get(bytesToHex(key))

    if (result !== undefined) {
      return result
    }

    return null
  }

  async put(key: Uint8Array, val: Uint8Array): Promise<void> {
    this._database.set(bytesToHex(key), val)
  }

  async del(key: Uint8Array): Promise<void> {
    this._database.delete(bytesToHex(key))
  }

  async batch(opStack: BatchDBOp[]): Promise<void> {
    for (const op of opStack) {
      if (op.type === 'del') {
        await this.del(op.key)
      }

      if (op.type === 'put') {
        await this.put(op.key, op.value)
      }
    }
  }

  copy(): DB {
    return new MapDB(this._database)
  }
}
