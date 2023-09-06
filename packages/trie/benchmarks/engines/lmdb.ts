import * as lmdb from 'lmdb'

import type { BatchDBOp, DB, DBObject } from '@ethereumjs/util'

export class LMDB<
  TKey extends Uint8Array | string = Uint8Array | string,
  TValue extends Uint8Array | string | DBObject = Uint8Array | string | DBObject
> implements DB<TKey, TValue>
{
  private path
  private database

  // It's necessary to use a different path for every init to avoid reading old data from a previous test
  static nonce: number

  constructor(path?: string) {
    if (LMDB.nonce === undefined) {
      LMDB.nonce = 0
    }
    this.path = path ?? `./${LMDB.nonce++}`
    this.database = lmdb.open({
      compression: true,
      name: '@ethereumjs/trie',
      path: this.path,
    })
  }

  /**
   * @inheritDoc
   */
  async get(key: TKey): Promise<TValue | undefined> {
    let value
    try {
      value = await this.database.get(key)
      if (value === null) return undefined
    } catch (error: any) {
      // https://github.com/Level/abstract-level/blob/915ad1317694d0ce8c580b5ab85d81e1e78a3137/abstract-level.js#L309
      // This should be `true` if the error came from LevelDB
      // so we can check for `NOT true` to identify any non-404 errors
      if (error.notFound !== true) {
        throw error
      }
    }

    return value as TValue
  }

  /**
   * @inheritDoc
   */
  async put(key: TKey, val: TValue): Promise<void> {
    // console.log('inside lmdb put')
    // console.log(key)

    await this.database.put(key, val)
  }

  /**
   * @inheritDoc
   */
  async del(key: TKey): Promise<void> {
    await this.database.remove(key)
  }

  /**
   * @inheritDoc
   */
  async batch(opStack: BatchDBOp<TKey, TValue>[]): Promise<void> {
    const levelOps = []
    for (const op of opStack) {
      levelOps.push({ ...op })
    }

    // TODO: Investigate why as any is necessary
    await this.database.batch(levelOps as any)
  }

  // returns a reference to itself
  shallowCopy(): DB<TKey, TValue> {
    // @ts-ignore
    return this
  }

  async open() {}

  async close() {}
}
