import { MapDB, hexStringToBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { CheckpointDB } from '../../src/index.js'

import type { BatchDBOp } from '@ethereumjs/util'

describe('DB tests', () => {
  const k = utf8ToBytes('k1')
  const v = utf8ToBytes('v1')
  const v2 = utf8ToBytes('v2')
  const v3 = utf8ToBytes('v3')

  it('Checkpointing: revert -> put (add)', async () => {
    const db = new CheckpointDB({ db: new MapDB() })
    db.checkpoint(hexStringToBytes('01'))
    await db.put(k, v)
    assert.deepEqual(await db.get(k), v, 'before revert: v1')
    await db.revert()
    assert.deepEqual(await db.get(k), undefined, 'after revert: null')
  })

  it('Checkpointing: revert -> put (update)', async () => {
    const db = new CheckpointDB({ db: new MapDB() })
    await db.put(k, v)
    assert.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexStringToBytes('01'))
    await db.put(k, v2)
    await db.put(k, v3)
    await db.revert()
    assert.deepEqual(await db.get(k), v, 'after revert: v1')
  })

  it('Checkpointing: revert -> put (update) batched', async () => {
    const db = new CheckpointDB({ db: new MapDB() })
    await db.put(k, v)
    assert.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexStringToBytes('01'))
    const ops = [
      { type: 'put', key: k, value: v2 },
      { type: 'put', key: k, value: v3 },
    ] as BatchDBOp[]
    await db.batch(ops)
    await db.revert()
    assert.deepEqual(await db.get(k), v, 'after revert: v1')
  })

  it('Checkpointing: revert -> del', async () => {
    const db = new CheckpointDB({ db: new MapDB() })
    await db.put(k, v)
    assert.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexStringToBytes('01'))
    await db.del(k)
    assert.deepEqual(await db.get(k), undefined, 'before revert: undefined')
    await db.revert()
    assert.deepEqual(await db.get(k), v, 'after revert: v1')
  })

  it('Checkpointing: nested checkpoints -> commit -> revert', async () => {
    const db = new CheckpointDB({ db: new MapDB() })
    await db.put(k, v)

    assert.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexStringToBytes('01'))
    await db.put(k, v2)
    db.checkpoint(hexStringToBytes('02'))
    await db.put(k, v3)
    await db.commit()
    assert.deepEqual(await db.get(k), v3, 'after commit (second CP): v3')
    await db.revert()
    assert.deepEqual(await db.get(k), v, 'after revert (first CP): v1')
  })
})
