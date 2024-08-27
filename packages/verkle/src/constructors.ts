import { KeyEncoding, MapDB, ValueEncoding } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'

import { ROOT_DB_KEY } from './types.js'
import { VerkleTree } from './verkleTree.js'

import type { VerkleTreeOpts } from './types.js'

export async function createVerkleTree(opts?: VerkleTreeOpts) {
  const key = ROOT_DB_KEY

  if (opts?.db !== undefined && opts?.useRootPersistence === true) {
    if (opts?.root === undefined) {
      opts.root = await opts?.db.get(key, {
        keyEncoding: KeyEncoding.Bytes,
        valueEncoding: ValueEncoding.Bytes,
      })
    } else {
      await opts?.db.put(key, opts.root, {
        keyEncoding: KeyEncoding.Bytes,
        valueEncoding: ValueEncoding.Bytes,
      })
    }
  }

  if (opts?.verkleCrypto === undefined) {
    const verkleCrypto = await loadVerkleCrypto()
    if (opts === undefined)
      opts = {
        verkleCrypto,
        db: new MapDB<Uint8Array, Uint8Array>(),
      }
    else {
      opts.verkleCrypto = verkleCrypto
    }
  }

  const trie = new VerkleTree(opts)
  await trie['_createRootNode']()
  return trie
}
