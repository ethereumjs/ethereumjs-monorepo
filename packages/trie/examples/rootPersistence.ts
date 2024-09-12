import { createTrie } from '@ethereumjs/trie'
import { bytesToHex } from '@ethereumjs/util'

async function main() {
  const trie = await createTrie({
    useRootPersistence: true,
  })

  // this logs the empty root value that has been persisted to the trie db
  console.log(bytesToHex(trie.root())) // 0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
}
void main()
