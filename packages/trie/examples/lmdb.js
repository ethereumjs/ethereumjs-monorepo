const { Trie } = require('../dist')
const { open } = require('lmdb')

class LMDB {
  constructor(path) {
    this.path = path
    this.database = open({
      compression: true,
      name: '@ethereumjs/trie',
      path,
    })
  }

  async get(key) {
    return this.database.get(key)
  }

  async put(key, val) {
    await this.database.put(key, val)
  }

  async del(key) {
    await this.database.remove(key)
  }

  async batch(opStack) {
    for (const op of opStack) {
      if (op.type === 'put') {
        await this.put(op.key, op.value)
      }

      if (op.type === 'del') {
        await this.del(op.key)
      }
    }
  }

  copy() {
    return new LMDB(this.path)
  }
}

const trie = new Trie({ db: new LMDB('MY_TRIE_DB_LOCATION') })

async function test() {
  await trie.put(Buffer.from('test'), Buffer.from('one'))
  const value = await trie.get(Buffer.from('test'))
  console.log(value.toString()) // 'one'
}

test()
