import { utf8ToBytes } from 'ethereum-cryptography/utils'
import { Trie } from '../dist/cjs/index.js'
import { debug } from 'debug'

debug.enable('*')

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
  process.env.DEBUG = 'ethjs,*trie*'
  const trie = new Trie({
    useRootPersistence: true,
  })
  for (const [key, value] of trie_entries) {
    await trie.put(utf8ToBytes(key), value === null ? Uint8Array.from([]) : utf8ToBytes(value))
  }
  const proof = await trie.createProof(utf8ToBytes('doge'))
  const valid = await trie.verifyProof(trie.root(), utf8ToBytes('doge'), proof)
  console.log('valid', valid)
}

main()
