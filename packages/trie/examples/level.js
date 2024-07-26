const { utf8ToBytes, bytesToUtf8 } = require('ethereum-cryptography/utils')
const { Level } = require('level')
const { MemoryLevel } = require('memory-level')

const { Trie } = require('../../dist/cjs/index.js')

const ENCODING_OPTS = { keyEncoding: 'view', valueEncoding: 'view' }

class LevelDB {
  _leveldb

  constructor(leveldb) {
    this._leveldb = leveldb ?? new MemoryLevel(ENCODING_OPTS)
  }

  async get(key) {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error) {
      // This should be `true` if the error came from LevelDB
      // so we can check for `NOT true` to identify any non-404 errors
      if (error.notFound !== true) {
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

const trie = new Trie({ db: new LevelDB(new Level('MY_TRIE_DB_LOCATION')) })

async function test() {
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const value = await trie.get(utf8ToBytes('test'))
  console.log(bytesToUtf8(value)) // 'one'
}

void test()
