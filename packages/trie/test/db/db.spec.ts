import * as tape from 'tape'
import { BatchDBOp, LevelDB } from '../../src'

tape('DB tests', (t) => {
  const db = new LevelDB()

  const k = Buffer.from('k1')
  const v = Buffer.from('v1')
  const k2 = Buffer.from('k2')
  const v2 = Buffer.from('v2')

  t.test('Operations: puts and gets value', async (st) => {
    await db.put(k, v)
    const res = await db.get(k)
    st.ok(v.equals(res!))
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
    st.ok(v2.equals(res!))
    st.end()
  })
})
