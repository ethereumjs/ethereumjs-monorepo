import { equalsBytes, utf8ToBytes } from '@ethereumjs/util'
import * as lmdb from 'lmdb'
import { assert, describe, it } from 'vitest'

import type { BatchDBOp, DB } from '@ethereumjs/util'

class LMDB implements DB {
  private path
  private database

  constructor(path?: string) {
    this.path = path ?? './'
    this.database = lmdb.open({
      compression: true,
      name: '@ethereumjs/trie',
      path: this.path,
    })
  }

  async open() {}

  async get(key: Uint8Array) {
    return this.database.get(key)
  }

  async put(key: Uint8Array, val: Uint8Array) {
    await this.database.put(key, val)
  }

  async del(key: Uint8Array) {
    await this.database.remove(key)
  }

  async batch(opStack: BatchDBOp[]) {
    for (const op of opStack) {
      if (op.type === 'put') {
        await this.put(op.key, op.value)
      }

      if (op.type === 'del') {
        await this.del(op.key)
      }
    }
  }

  shallowCopy() {
    return new LMDB(this.path)
  }
}

describe('DB tests', () => {
  const db = new LMDB()

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
