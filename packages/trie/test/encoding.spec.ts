import {
  MapDB,
  ValueEncoding,
  bytesToHex,
  hexToBytes,
  toBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Trie } from '../src/index.js'

const key = new Uint8Array([11])
const value = new Uint8Array([255, 255])

describe('encoding hex prefixes', () => {
  it('should work', async () => {
    const trie = new Trie()
    const trie2 = new Trie()
    const hex = 'FF44A3B3'
    await trie.put(hexToBytes(`0x${hex}`), utf8ToBytes('test'))
    await trie2.put(toBytes(`0x${hex}`), utf8ToBytes('test'))
    assert.equal(bytesToHex(trie.root()), bytesToHex(trie2.root()))
  })
})

describe('support for Uint8Array', () => {
  it('should use Uint8Array in memory by default', async () => {
    const trie = new Trie()
    const db = (<any>trie)._db.db as MapDB<any, any>
    await trie.put(key, value)
    const keys = db._database.size
    assert.equal(keys, 1, 'there exists a a key in the db')
    for (const value of db._database.values()) {
      assert.ok(value instanceof Uint8Array, 'memory db defaults to Uint8Array')
    }
  })

  it('should throw when setting valueEncoding and no database provided', () => {
    assert.throws(() => {
      new Trie({ valueEncoding: ValueEncoding.String })
    })
  })

  it('should default to use strings when a database is provided', async () => {
    const trie = new Trie({ db: new MapDB() })
    const db = (<any>trie)._db.db as MapDB<any, any>
    await trie.put(key, value)
    const keys = db._database.size
    assert.equal(keys, 1, 'there exists a a key in the db')
    for (const value of db._database.values()) {
      assert.ok(
        typeof value === 'string',
        'if a database is provided, string values will be used internally',
      )
    }
  })

  it('should use Uint8Array in memory by default', async () => {
    const trie = new Trie({ db: new MapDB(), valueEncoding: ValueEncoding.Bytes })
    const db = (<any>trie)._db.db as MapDB<any, any>
    await trie.put(key, value)
    const keys = db._database.size
    assert.equal(keys, 1, 'there exists a a key in the db')
    for (const value of db._database.values()) {
      assert.ok(value instanceof Uint8Array, 'db respects valueEncoding')
    }
  })
})
