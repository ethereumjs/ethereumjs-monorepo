import { bytesToUtf8, equalsBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { LevelDB } from '../../benchmarks/engines/level.js'
import { Trie } from '../../src/index.js'

import type { BatchDBOp } from '@ethereumjs/util'

describe('DB tests', () => {
  const db = new LevelDB()

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

  it('Reads and writes to trie that uses level db', async () => {
    const trie = new Trie({ db })

    await trie.put(utf8ToBytes('test'), utf8ToBytes('one'), true)
    const value = await trie.get(utf8ToBytes('test'))
    assert.equal(bytesToUtf8(value), 'one') // 'one'
  })
})
