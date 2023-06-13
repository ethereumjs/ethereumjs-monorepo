import * as tape from 'tape'
import { BatchDBOp, MapDB } from '../src'

tape('MapDB class', (t) => {
  t.test('get', async (t) => {
    t.test('should return the value for an existing key', async (t) => {
      const database = new Map()
      database.set('key1', 'value1')
      const mapDB = new MapDB(database)

      const result = await mapDB.get('key1')

      t.equal(result, 'value1', 'should return the value')
    })

    t.test('should return undefined for a non-existing key', async (t) => {
      const mapDB = new MapDB()

      const result = await mapDB.get('nonExistingKey')

      t.equal(result, undefined, 'should return undefined')
    })
  })

  t.test('put', async (t) => {
    t.test('should add a key-value pair to the database', async (t) => {
      const mapDB = new MapDB()

      await mapDB.put('key1', 'value1')
      const result = await mapDB.get('key1')

      t.equal(result, 'value1', 'should add the key-value pair')
    })
  })

  t.test('del', async (t) => {
    t.test('should remove a key-value pair from the database', async (t) => {
      const database = new Map()
      database.set('key1', 'value1')
      const mapDB = new MapDB(database)

      await mapDB.del('key1')
      const result = await mapDB.get('key1')

      t.equal(result, undefined, 'should remove the key-value pair')
    })
  })

  t.test('batch', async (t) => {
    t.test('should perform batch operations correctly', async (t) => {
      const mapDB = new MapDB()

      const opStack = [
        { type: 'put', key: 'key1', value: 'value1' },
        { type: 'put', key: 'key2', value: 'value2' },
        { type: 'del', key: 'key1' },
      ]

      await mapDB.batch(opStack as any)

      const result1 = await mapDB.get('key1')
      const result2 = await mapDB.get('key2')

      t.equal(result1, undefined, 'should remove key1')
      t.equal(result2, 'value2', 'should add key2')
    })
  })

  t.test('copy', (t) => {
    t.test('should create a copy of the database', async (t) => {
      const database = new Map()
      database.set('key1', 'value1')
      const mapDB = new MapDB(database)

      const copyDB = mapDB.copy()
      database.delete('key1')

      const result = await copyDB.get('key1')
      t.equal(result, 'value1', 'should create a copy of the database')
      t.end()
    })
  })

  t.test('open', (t) => {
    t.test('should return a resolved promise', async (t) => {
      const mapDB = new MapDB()

      const promise = await mapDB.open()

      t.equal(promise, undefined, 'should return a resolved promise')
    })
  })

  t.end()
})
