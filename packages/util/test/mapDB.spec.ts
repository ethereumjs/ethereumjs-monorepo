import { assert, describe, it } from 'vitest'

import { MapDB } from '../src/index.js'

describe('MapDB: get', () => {
  it('should return the value for an existing key', async () => {
    const database = new Map()
    database.set('key1', 'value1')
    const mapDB = new MapDB(database)

    const result = await mapDB.get('key1')

    assert.equal(result, 'value1', 'should return the value')
  })

  it('should return undefined for a non-existing key', async () => {
    const mapDB = new MapDB()

    const result = await mapDB.get('nonExistingKey')

    assert.equal(result, undefined, 'should return undefined')
  })
})

describe('MapDB: put', () => {
  it('should add a key-value pair to the database', async () => {
    const mapDB = new MapDB()

    await mapDB.put('key1', 'value1')
    const result = await mapDB.get('key1')

    assert.equal(result, 'value1', 'should add the key-value pair')
  })
})

describe('MapDB: del', () => {
  it('should remove a key-value pair from the database', async () => {
    const database = new Map()
    database.set('key1', 'value1')
    const mapDB = new MapDB(database)

    await mapDB.del('key1')
    const result = await mapDB.get('key1')

    assert.equal(result, undefined, 'should remove the key-value pair')
  })
})

describe('MapDB: batch', () => {
  it('should perform batch operations correctly', async () => {
    const mapDB = new MapDB()

    const opStack = [
      { type: 'put', key: 'key1', value: 'value1' },
      { type: 'put', key: 'key2', value: 'value2' },
      { type: 'del', key: 'key1' },
    ]

    await mapDB.batch(opStack as any)

    const result1 = await mapDB.get('key1')
    const result2 = await mapDB.get('key2')

    assert.equal(result1, undefined, 'should remove key1')
    assert.equal(result2, 'value2', 'should add key2')
  })
})

describe('MapDB: shallowCopy', () => {
  it('should reuse underlying database in case of a shallowCopy', async () => {
    const database = new Map()
    database.set('key1', 'value1')
    const mapDB = new MapDB(database)

    const shallowCopyDB = mapDB.shallowCopy()
    database.delete('key1')

    const result = await shallowCopyDB.get('key1')
    assert.equal(result, undefined, 'should reuse underlying database in case of a shallowCopy')
  })
})

describe('MapDB: open', () => {
  it('should return a resolved promise', async () => {
    const mapDB = new MapDB()

    const promise = await mapDB.open()

    assert.equal(promise, undefined, 'should return undefined since this is a stub function')
  })
})
