import type { BatchDBOp, DB } from '@ethereumjs/util'

export class MapDB<TKey extends Uint8Array | string, TValue extends Uint8Array | string>
  implements DB<TKey, TValue>
{
  _database: Map<TKey, TValue>

  constructor(database?: Map<TKey, TValue>) {
    this._database = database ?? new Map<TKey, TValue>()
  }

  async get(key: TKey): Promise<TValue | undefined> {
    return this._database.get(key)
  }

  async put(key: TKey, val: TValue): Promise<void> {
    this._database.set(key, val)
  }

  async del(key: TKey): Promise<void> {
    this._database.delete(key)
  }

  async batch(opStack: BatchDBOp<TKey, TValue>[]): Promise<void> {
    for (const op of opStack) {
      if (op.type === 'del') {
        await this.del(op.key)
      }

      if (op.type === 'put') {
        await this.put(op.key, op.value)
      }
    }
  }

  copy(): DB<TKey, TValue> {
    return new MapDB<TKey, TValue>(this._database)
  }
}
