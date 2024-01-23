import { Trie } from '@ethereumjs/trie'
import { bytesToUtf8, MapDB, utf8ToBytes } from '@ethereumjs/util'

async function test() {
  const trie = await Trie.create({ db: new MapDB() })
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const value = await trie.get(utf8ToBytes('test'))
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'
}

test()
