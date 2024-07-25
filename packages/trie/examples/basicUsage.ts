import { createTrie } from '@ethereumjs/trie'
import { MapDB, bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

async function test() {
  const trie = await createTrie({ db: new MapDB() })
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const value = await trie.get(utf8ToBytes('test'))
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'
}

void test()
