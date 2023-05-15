import { MapDB, equalsBytes, utf8ToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import type { BatchDBOp } from '@ethereumjs/util'

tape('DB tests', (t) => {
  const db = new MapDB<Uint8Array, Uint8Array>()

  const k = utf8ToBytes('k1')
  const v = utf8ToBytes('v1')
  const k2 = utf8ToBytes('k2')
  const v2 = utf8ToBytes('v2')

  t.test('Operations: puts and gets value', async (st) => {
    await db.put(k, v)
    const res = await db.get(k)
    st.ok(equalsBytes(v, res!))
    st.end()
  })

  t.test('Operations: deletes value', async (st) => {
    await db.del(k)
    const res = await db.get(k)
    st.notOk(res)
    st.end()
  })

  t.test('Operations: batch ops', async (st) => {
    const ops = [
      { type: 'put', key: k, value: v },
      { type: 'put', key: k2, value: v2 },
    ] as BatchDBOp[]
    await db.batch(ops)
    const res = await db.get(k2)
    st.ok(equalsBytes(v2, res!))
    st.end()
  })
})
