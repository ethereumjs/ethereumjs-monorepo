/**
 * Run with DEBUG=ethjs,trie:* to see debug log ouput
 */
import { Trie, createProof, verifyProof } from '@ethereumjs/trie'
import { utf8ToBytes } from '@ethereumjs/util'

const trie_entries: [string, string | null][] = [
  ['do', 'verb'],
  ['ether', 'wookiedoo'],
  ['horse', 'stallion'],
  ['shaman', 'horse'],
  ['doge', 'coin'],
  ['ether', null],
  ['dog', 'puppy'],
  ['shaman', null],
]

const main = async () => {
  const trie = new Trie({
    useRootPersistence: true,
  })
  for (const [key, value] of trie_entries) {
    await trie.put(utf8ToBytes(key), value === null ? Uint8Array.from([]) : utf8ToBytes(value))
  }
  const proof = await createProof(trie, utf8ToBytes('doge'))
  const valid = await verifyProof(trie, trie.root(), utf8ToBytes('doge'), proof)
  console.log('valid', valid)
}

void main()
