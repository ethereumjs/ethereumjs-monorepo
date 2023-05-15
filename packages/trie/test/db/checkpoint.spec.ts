import { MapDB, hexStringToBytes, utf8ToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { CheckpointDB } from '../../src'

import type { BatchDBOp } from '@ethereumjs/util'

tape('DB tests', (t) => {
  const k = utf8ToBytes('k1')
  const v = utf8ToBytes('v1')
  const v2 = utf8ToBytes('v2')
  const v3 = utf8ToBytes('v3')

  t.test('Checkpointing: revert -> put (add)', async (st) => {
    const db = new CheckpointDB({ db: new MapDB() })
    db.checkpoint(hexStringToBytes('01'))
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before revert: v1')
    await db.revert()
    st.deepEqual(await db.get(k), undefined, 'after revert: null')
    st.end()
  })

  t.test('Checkpointing: revert -> put (update)', async (st) => {
    const db = new CheckpointDB({ db: new MapDB() })
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexStringToBytes('01'))
    await db.put(k, v2)
    await db.put(k, v3)
    await db.revert()
    st.deepEqual(await db.get(k), v, 'after revert: v1')
    st.end()
  })

  t.test('Checkpointing: revert -> put (update) batched', async (st) => {
    const db = new CheckpointDB({ db: new MapDB() })
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexStringToBytes('01'))
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
    const db = new CheckpointDB({ db: new MapDB() })
    await db.put(k, v)
    st.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexStringToBytes('01'))
    await db.del(k)
    st.deepEqual(await db.get(k), undefined, 'before revert: undefined')
    await db.revert()
    st.deepEqual(await db.get(k), v, 'after revert: v1')
    st.end()
  })

  t.test('Checkpointing: nested checkpoints -> commit -> revert', async (st) => {
    const db = new CheckpointDB({ db: new MapDB() })
    await db.put(k, v)

    st.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexStringToBytes('01'))
    await db.put(k, v2)
    db.checkpoint(hexStringToBytes('02'))
    await db.put(k, v3)
    await db.commit()
    st.deepEqual(await db.get(k), v3, 'after commit (second CP): v3')
    await db.revert()
    st.deepEqual(await db.get(k), v, 'after revert (first CP): v1')
    st.end()
  })
})
