import { MapDB, equalsBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import type { BatchDBOp } from '@ethereumjs/util'

describe('DB tests', () => {
  const db = new MapDB<Uint8Array, Uint8Array>()

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
