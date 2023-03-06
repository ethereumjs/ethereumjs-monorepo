const { Level } = require('level')
const { MemoryLevel } = require('memory-level')

const { Trie } = require('../dist')

const ENCODING_OPTS = { keyEncoding: 'buffer', valueEncoding: 'buffer' }

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

  copy() {
    return new LevelDB(this._leveldb)
  }
}

const trie = new Trie({ db: new LevelDB(new Level('MY_TRIE_DB_LOCATION')) })

async function test() {
  await trie.put(Buffer.from('test'), Buffer.from('one'))
  const value = await trie.get(Buffer.from('test'))
  console.log(value.toString()) // 'one'
}

test()
