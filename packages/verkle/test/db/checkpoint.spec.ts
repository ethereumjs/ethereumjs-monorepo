import { assert, beforeAll, describe, it } from 'vitest'
import { CheckpointDB } from '../../src/db/checkpoint.js'
import { MapDB, hexToBytes } from '@ethereumjs/util'

describe('CheckpointDB', () => {
  let db: CheckpointDB

  beforeAll(() => {
    // Set up a new CheckpointDB instance for each test
    db = new CheckpointDB({ db: new MapDB() })
  })

  it('should initialize with empty checkpoints', () => {
    assert(db.checkpoints.length === 0)
  })

  it('should add a checkpoint', () => {
    db.checkpoint(new Uint8Array())
    assert(db.checkpoints.length === 1)
  })

  it('should commit the latest checkpoint', async () => {
    // Add some data to the latest checkpoint
    db.put(hexToBytes('0x123'), hexToBytes('0x456'))

    await db.commit()

    // Ensure that the checkpoint is removed and the data is committed
    assert(db.checkpoints.length === 0)
    assert(db._stats.db.writes === 1)
  })

  it('should revert the latest checkpoint', async () => {
    const expectedRoot = new Uint8Array()

    // Add a checkpoint
    db.checkpoint(expectedRoot)

    // Revert the checkpoint
    const actualRoot = await db.revert()

    // Ensure that the latest checkpoint is removed and the root is returned
    assert(db.checkpoints.length === 0)
    assert.equal(actualRoot, expectedRoot, 'roots should match')
  })

  it('should get a value', async () => {
    const key1 = hexToBytes('0x123')
    const val1 = hexToBytes('0x456')

    // Add some data
    await db.put(key1, val1)

    // Get the value
    const actualValue = await db.get(key1)

    // Ensure that the value is correct
    assert.equal(actualValue, val1)
  })

  it('should put a value', async () => {
    const key1 = hexToBytes('0x123')
    const val1 = hexToBytes('0x456')

    // Put a value
    await db.put(key1, val1)

    // Get the value
    const actualValue = await db.get(key1)

    // Ensure that the value is correct
    assert.equal(actualValue, val1)
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
})
