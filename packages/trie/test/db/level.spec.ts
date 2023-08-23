import { equalsBytes, utf8ToBytes } from '@ethereumjs/util'
import { Level } from 'level'
import { MemoryLevel } from 'memory-level'
import { assert, describe, it } from 'vitest'

import type { BatchDBOp, DB } from '@ethereumjs/util'

const ENCODING_OPTS = { keyEncoding: 'view', valueEncoding: 'view' }

class LevelDB implements DB {
  private _leveldb

  constructor(leveldb: Level<Uint8Array, Uint8Array>) {
    this._leveldb = leveldb ?? new MemoryLevel(ENCODING_OPTS)
  }

  async open() {}

  async get(key: Uint8Array) {
    let value = undefined
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error) {
      // This should be `true` if the error came from LevelDB
      // so we can check for `NOT true` to identify any non-404 errors
      if (error.notFound !== true) {
        throw error
      }
    }
    return value
  }

  async put(key: Uint8Array, val: Uint8Array) {
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  async del(key: Uint8Array) {
    await this._leveldb.del(key, ENCODING_OPTS)
  }

  async batch(opStack: BatchDBOp[]) {
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }

  shallowCopy() {
    return new LevelDB(this._leveldb) as DB<Uint8Array, Uint8Array>
  }
}

describe('DB tests', () => {
  const db = new LevelDB(new Level<Uint8Array, Uint8Array>('MY_TRIE_DB_LOCATION'))

  const k = utf8ToBytes('k1')
  const v = utf8ToBytes('v1')
  const k2 = utf8ToBytes('k2')
  const v2 = utf8ToBytes('v2')

  it('Operations: puts and gets value', async () => {
    await db.put(k, v)
    const res = await db.get(k)
    assert.ok(equalsBytes(v, res!))
  })

  it('Operations: deletes value', async () => {
    await db.del(k)
    const res = await db.get(k)
    assert.notOk(res)
  })

  it('Operations: batch ops', async () => {
    const ops = [
      { type: 'put', key: k, value: v },
      { type: 'put', key: k2, value: v2 },
    ] as BatchDBOp[]
    await db.batch(ops)
    const res = await db.get(k2)
    assert.ok(equalsBytes(v2, res!))
  })
})
