import tape from 'tape'
import { DB, BatchDBOp } from '../src/db'

tape('DB tests', (t) => {
  const db = new DB()

  const k = Buffer.from('k1')
  const v = Buffer.from('v1')
  const k2 = Buffer.from('k2')
  const v2 = Buffer.from('v2')
  //const k3 = Buffer.from('k3')
  const v3 = Buffer.from('v3')

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

  t.test('Checkpointing: revert -> put (add)', async (st) => {
    const db = new DB()
    db.checkpoint(Buffer.from('1', 'hex'))
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before revert: v1')
    await db.revert()
    st.deepEqual(await db.get(k), null, 'after revert: null')
    st.end()
  })

  t.test('Checkpointing: revert -> put (update)', async (st) => {
    const db = new DB()
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(Buffer.from('1', 'hex'))
    await db.put(k, v2)
    await db.put(k, v3)
    await db.revert()
    st.deepEqual(await db.get(k), v, 'after revert: v1')
    st.end()
  })

  t.test('Checkpointing: revert -> put (update) batched', async (st) => {
    const db = new DB()
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(Buffer.from('1', 'hex'))
    const ops = [
      { type: 'put', key: k, value: v2 },
      { type: 'put', key: k, value: v3 },
    ] as BatchDBOp[]
    await db.batch(ops)
    await db.revert()
    st.deepEqual(await db.get(k), v, 'after revert: v1')
    st.end()
  })

  t.test('Checkpointing: revert -> del', async (st) => {
    const db = new DB()
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(Buffer.from('1', 'hex'))
    await db.del(k)
    st.deepEqual(await db.get(k), null, 'before revert: null')
    await db.revert()
    st.deepEqual(await db.get(k), v, 'after revert: v1')
    st.end()
  })

  t.test('Checkpointing: nested checkpoints -> commit -> revert', async (st) => {
    const db = new DB()
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(Buffer.from('1', 'hex'))
    await db.put(k, v2)
    db.checkpoint(Buffer.from('2', 'hex'))
    await db.put(k, v3)
    db.commit()
    st.deepEqual(await db.get(k), v3, 'after commit (second CP): v3')
    await db.revert()
    st.deepEqual(await db.get(k), v, 'after revert (first CP): v1')
    st.end()
  })
})
