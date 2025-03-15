import {
  KeyEncoding,
  MapDB,
  ValueEncoding,
  bytesToHex,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { blake3 } from '@noble/hashes/blake3'

import { BinaryTree } from './binaryTree.ts'
import { ROOT_DB_KEY } from './types.ts'

import type { BinaryTreeOpts } from './types.ts'

export async function createBinaryTree(opts?: Partial<BinaryTreeOpts>) {
  const key = bytesToHex(ROOT_DB_KEY)

  // Provide sensible default options
  const parsedOptions = {
    ...opts,
    db: opts?.db ?? new MapDB<string, Uint8Array>(),
    useRootPersistence: opts?.useRootPersistence ?? false,
    cacheSize: opts?.cacheSize ?? 0,
    hashFunction: opts?.hashFunction ?? blake3,
  }

  if (parsedOptions.useRootPersistence === true) {
    if (parsedOptions.root === undefined) {
      const root = await parsedOptions.db.get(key, {
        keyEncoding: KeyEncoding.Bytes,
        valueEncoding: ValueEncoding.Bytes,
      })
      if (typeof root === 'string') {
        parsedOptions.root = unprefixedHexToBytes(root)
      } else {
        parsedOptions.root = root
      }
    } else {
      await parsedOptions.db.put(key, parsedOptions.root, {
        keyEncoding: KeyEncoding.Bytes,
        valueEncoding: ValueEncoding.Bytes,
      })
    }
  }

  const tree = new BinaryTree(parsedOptions)
  // If the root node does not exist, initialize the empty root node
  if (parsedOptions.root === undefined) await tree.createRootNode()
  return tree
}
