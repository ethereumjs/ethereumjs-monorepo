const { utf8ToBytes, bytesToUtf8 } = require('ethereum-cryptography/utils')
const { open } = require('lmdb')

const { Trie } = require('../../dist/cjs/index.js')

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

  shallowCopy() {
    return new LMDB(this.path)
  }
}

const trie = new Trie({ db: new LMDB('MY_TRIE_DB_LOCATION') })

async function test() {
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const value = await trie.get(utf8ToBytes('test'))
  console.log(bytesToUtf8(value)) // 'one'
}

void test()
