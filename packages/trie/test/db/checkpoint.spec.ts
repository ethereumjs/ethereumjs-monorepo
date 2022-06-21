import * as tape from 'tape'
import { BatchDBOp, CheckpointDB, LevelDB } from '../../src'

tape('DB tests', (t) => {
  const k = Buffer.from('k1')
  const v = Buffer.from('v1')
  const v2 = Buffer.from('v2')
  const v3 = Buffer.from('v3')

  t.test('Checkpointing: revert -> put (add)', async (st) => {
    const db = new CheckpointDB(new LevelDB())
    db.checkpoint(Buffer.from('1', 'hex'))
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before revert: v1')
    await db.revert()
    st.deepEqual(await db.get(k), null, 'after revert: null')
    st.end()
  })

  t.test('Checkpointing: revert -> put (update)', async (st) => {
    const db = new CheckpointDB(new LevelDB())
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
    const db = new CheckpointDB(new LevelDB())
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
    const db = new CheckpointDB(new LevelDB())
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
    const db = new CheckpointDB(new LevelDB())
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(Buffer.from('1', 'hex'))
    await db.put(k, v2)
    db.checkpoint(Buffer.from('2', 'hex'))
    await db.put(k, v3)
    await db.commit()
    st.deepEqual(await db.get(k), v3, 'after commit (second CP): v3')
    await db.revert()
    st.deepEqual(await db.get(k), v, 'after revert (first CP): v1')
    st.end()
  })
})
