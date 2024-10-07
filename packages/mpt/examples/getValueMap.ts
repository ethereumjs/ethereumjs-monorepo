import { createMPT } from '@ethereumjs/mpt'
import { bigIntToBytes, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const trie = await createMPT({})
  const entries: [Uint8Array, string][] = [
    [bigIntToBytes(1n), '0x' + '0a'.repeat(32)],
    [bigIntToBytes(2n), '0x' + '0b'.repeat(32)],
    [bigIntToBytes(3n), '0x' + '0c'.repeat(32)],
  ]
  for (const entry of entries) {
    await trie.put(entry[0], hexToBytes(entry[1]))
  }
  const dump = await trie.getValueMap()
  console.log(dump)
}

void main()
