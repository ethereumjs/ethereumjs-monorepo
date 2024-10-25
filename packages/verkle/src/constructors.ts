import { KeyEncoding, MapDB, ValueEncoding } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'

import { ROOT_DB_KEY } from './types.js'
import { VerkleTree } from './verkleTree.js'

import type { VerkleTreeOpts } from './types.js'

export async function createVerkleTree(opts?: Partial<VerkleTreeOpts>) {
  const key = ROOT_DB_KEY

  // Provide sensible default options
  const parsedOptions = {
    ...opts,
    db: opts?.db ?? new MapDB<Uint8Array, Uint8Array>(),
    verkleCrypto: opts?.verkleCrypto ?? (await loadVerkleCrypto()),
    useRootPersistence: opts?.useRootPersistence ?? false,
    cacheSize: opts?.cacheSize ?? 0,
  }

  if (parsedOptions.useRootPersistence === true) {
    if (parsedOptions.root === undefined) {
      parsedOptions.root = await parsedOptions.db.get(key, {
        keyEncoding: KeyEncoding.Bytes,
        valueEncoding: ValueEncoding.Bytes,
      })
    } else {
      await parsedOptions.db.put(key, parsedOptions.root, {
        keyEncoding: KeyEncoding.Bytes,
        valueEncoding: ValueEncoding.Bytes,
      })
    }
  }

  const trie = new VerkleTree(parsedOptions)
  // If the root node does not exist, initialize the empty root node
  if (parsedOptions.root === undefined) await trie.createRootNode()
  return trie
}
