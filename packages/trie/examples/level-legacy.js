// LevelDB from https://github.com/ethereumjs/ethereumjs-monorepo/blob/ac053e1f9a364f8ae489159fecb79a3d0ddd7053/packages/trie/src/db.ts

// eslint-disable-next-line implicit-dependencies/no-implicit
const { utf8ToBytes, bytesToUtf8 } = require('ethereum-cryptography/utils')
const level = require('level-mem')

const { Trie } = require('../../dist/cjs/index.js')

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
      if (error.notFound !== undefined) {
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

  shallowCopy() {
    return new LevelDB(this._leveldb)
  }
}

const trie = new Trie({ db: new LevelDB(level('MY_TRIE_DB_LOCATION')) })

async function test() {
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const value = await trie.get(utf8ToBytes('test'))
  console.log(bytesToUtf8(value)) // 'one'
}

void test()
