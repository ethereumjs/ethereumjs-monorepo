'use strict'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { Trie } from '../dist'

const createKeccak = require('keccak')
const bench = require('micro-bmark')
const { run, mark } = bench

const oldHash = (val: Buffer) => {
  const hash = createKeccak('keccak256').update(val).digest()
  return hash
}
// References:
// https://eth.wiki/en/fundamentals/benchmarks#the-trie
// https://gist.github.com/heikoheiko/0fa2b322560ba7794f22

const ROUNDS = 1000
const KEY_SIZE = 32

export const runTrie = async (eraSize = 9, symmetric = false, hash: Function) => {
  //@ts-ignore
  const trie = new Trie({ useKeyHashing: true, useKeyHashingFunction: hash })
  let key = Buffer.alloc(KEY_SIZE)

  for (let i = 0; i <= ROUNDS; i++) {
    key = hash(key)

    if (symmetric) {
      await trie.put(key, key)
    } else {
      const val = hash(key)
      await trie.put(key, val)
    }

    if (i % eraSize === 0) {
      key = trie.root()
    }
  }
}

run(async () => {
  await mark('noble', 5, () => runTrie(9, false, keccak256))
  await mark('cryptocoin', 5, () => runTrie(9, false, oldHash))
})
