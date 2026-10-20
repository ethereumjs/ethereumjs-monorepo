import { createMPT } from '@ethereumjs/mpt'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const trie = await createMPT()
  const key = hexToBytes('0x11')

  await trie.put(key, hexToBytes('0xaa'))
  trie.checkpoint()
  await trie.put(key, hexToBytes('0xbb'))
  console.log(`In checkpoint: ${bytesToHex((await trie.get(key))!)}`)

  await trie.revert()
  console.log(`After revert: ${bytesToHex((await trie.get(key))!)}`)

  trie.checkpoint()
  await trie.put(key, hexToBytes('0xcc'))
  await trie.commit()
  console.log(`After commit: ${bytesToHex((await trie.get(key))!)}`)
}

void main()
