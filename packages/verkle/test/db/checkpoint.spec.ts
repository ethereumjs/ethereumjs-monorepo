import { MapDB, hexToBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, beforeEach, describe, it } from 'vitest'

import { CheckpointDB } from '../../src/index.ts'

import type { BatchDBOp } from '@ethereumjs/util'

describe('DB tests', () => {
  let db: CheckpointDB
  const k = utf8ToBytes('k1')
  const v = utf8ToBytes('v1')
  const v2 = utf8ToBytes('v2')
  const v3 = utf8ToBytes('v3')

  beforeEach(() => {
    // Set up a new CheckpointDB instance for each test
    db = new CheckpointDB({ db: new MapDB() })
  })

  it('should initialize with empty checkpoints', () => {
    assert.isEmpty(db.checkpoints)
  })

  it('should add a checkpoint', () => {
    db.checkpoint(new Uint8Array())
    assert.strictEqual(db.checkpoints.length, 1)
  })

  it('should commit the latest checkpoint', async () => {
    // Add some data to the latest checkpoint
    db.checkpoint(new Uint8Array())
    await db.put(hexToBytes('0x123'), hexToBytes('0x456'))

    await db.commit()

    // Ensure that the checkpoint is removed and the data is committed
    assert.isEmpty(db.checkpoints)
    assert.strictEqual(db._stats.db.writes, 1)
  })

  it('should revert the latest checkpoint', async () => {
    const expectedRoot = new Uint8Array()

    // Add a checkpoint
    db.checkpoint(expectedRoot)

    // Revert the checkpoint
    const actualRoot = await db.revert()

    // Ensure that the latest checkpoint is removed and the root is returned
    assert.isEmpty(db.checkpoints)
    assert.strictEqual(actualRoot, expectedRoot, 'roots should match')
  })

  it('should get a value', async () => {
    const key1 = hexToBytes('0x123')
    const val1 = hexToBytes('0x456')

    // Add some data
    await db.put(key1, val1)

    // Get the value
    const actualValue = await db.get(key1)

    // Ensure that the value is correct
    assert.deepEqual(actualValue, val1)
  })

  it('should put a value', async () => {
    const key1 = hexToBytes('0x123')
    const val1 = hexToBytes('0x456')

    // Put a value
    await db.put(key1, val1)

    // Get the value
    const actualValue = await db.get(key1)

    // Ensure that the value is correct
    assert.deepEqual(actualValue, val1)
  })

  it('should delete a value', async () => {
    const key1 = hexToBytes('0x123')
    const val1 = hexToBytes('0x456')

    // Add some data
    await db.put(key1, val1)

    // Delete the value
    await db.del(key1)

    // Ensure that the value is deleted
    const actualValue = await db.get(key1)
    assert(actualValue === undefined, 'deleted value should be undefined')
  })

  it('Checkpointing: revert -> put (add)', async () => {
    db.checkpoint(hexToBytes('0x01'))
    await db.put(k, v)
    assert.deepEqual(await db.get(k), v, 'before revert: v1')
    await db.revert()
    assert.deepEqual(await db.get(k), undefined, 'after revert: null')
  })

  it('Checkpointing: revert -> put (update)', async () => {
    await db.put(k, v)
    assert.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexToBytes('0x01'))
    await db.put(k, v2)
    await db.put(k, v3)
    await db.revert()
    assert.deepEqual(await db.get(k), v, 'after revert: v1')
  })

  it('Checkpointing: revert -> put (update) batched', async () => {
    await db.put(k, v)
    assert.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexToBytes('0x01'))
    const ops = [
      { type: 'put', key: k, value: v2 },
      { type: 'put', key: k, value: v3 },
    ] as BatchDBOp[]
    await db.batch(ops)
    await db.revert()
    assert.deepEqual(await db.get(k), v, 'after revert: v1')
  })

  it('Checkpointing: revert -> del', async () => {
    await db.put(k, v)
    assert.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexToBytes('0x01'))
    await db.del(k)
    assert.deepEqual(await db.get(k), undefined, 'before revert: undefined')
    await db.revert()
    assert.deepEqual(await db.get(k), v, 'after revert: v1')
  })

  it('Checkpointing: nested checkpoints -> commit -> revert', async () => {
    await db.put(k, v)

    assert.deepEqual(await db.get(k), v, 'before CP: v1')
    db.checkpoint(hexToBytes('0x01'))
    await db.put(k, v2)
    db.checkpoint(hexToBytes('0x02'))
    await db.put(k, v3)
    await db.commit()
    assert.deepEqual(await db.get(k), v3, 'after commit (second CP): v3')
    await db.revert()
    assert.deepEqual(await db.get(k), v, 'after revert (first CP): v1')
  })
})
