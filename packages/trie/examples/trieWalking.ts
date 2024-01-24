import { Trie } from '@ethereumjs/trie'
import { utf8ToBytes } from 'ethereum-cryptography/utils'

async function main() {
  const trie = await Trie.create()
  await trie.put(utf8ToBytes('key'), utf8ToBytes('val'))
  const walk = trie.walkTrieIterable(trie.root())

  for await (const { node, currentKey } of walk) {
    // ... do something
    console.log({ node, currentKey })
  }
}
main()
