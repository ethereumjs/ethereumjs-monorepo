// LevelDB from https://github.com/ethereumjs/ethereumjs-monorepo/blob/ac053e1f9a364f8ae489159fecb79a3d0ddd7053/packages/trie/src/db.ts

// eslint-disable-next-line implicit-dependencies/no-implicit
const level = require('level-mem')

const { Trie } = require('../dist')

const ENCODING_OPTS = { keyEncoding: 'binary', valueEncoding: 'binary' }

class LevelDB {
  _leveldb

  constructor(leveldb) {
    this._leveldb = leveldb ?? level()
  }

  async get(key) {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error) {
      if (error.notFound) {
        // not found, returning null
      } else {
        throw error
      }
    }
    return value
  }

  async put(key, val) {
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  async del(key) {
    await this._leveldb.del(key, ENCODING_OPTS)
  }

  async batch(opStack) {
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }

  copy() {
    return new LevelDB(this._leveldb)
  }
}

const trie = new Trie({ db: new LevelDB(level('MY_TRIE_DB_LOCATION')) })

async function test() {
  await trie.put(Buffer.from('test'), Buffer.from('one'))
  const value = await trie.get(Buffer.from('test'))
  console.log(value.toString()) // 'one'
}

test()
