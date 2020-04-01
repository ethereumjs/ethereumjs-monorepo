import { keccak256 } from 'ethereumjs-util'
import { CheckpointTrie } from './checkpointTrie'
import { BufferCallback, ErrorCallback } from './types'

/**
 * You can create a secure Trie where the keys are automatically hashed
 * using **keccak256** by using `require('merkle-patricia-tree/secure')`.
 * It has the same methods and constructor as `Trie`.
 * @class SecureTrie
 * @extends Trie
 * @public
 */
export class SecureTrie extends CheckpointTrie {
  constructor(...args: any) {
    super(...args)
  }

  static prove(trie: SecureTrie, key: Buffer): Promise<Buffer[]> {
    const hash = keccak256(key)
    return super.prove(trie, hash)
  }

  static async verifyProof(rootHash: Buffer, key: Buffer, proof: Buffer[]): Promise<Buffer | null> {
    const hash = keccak256(key)
    return super.verifyProof(rootHash, hash, proof)
  }

  copy(): SecureTrie {
    const trie = super.copy(false)
    const db = trie.db.copy()
    return new SecureTrie(db._leveldb, this.root)
  }

  get(key: Buffer, cb: BufferCallback) {
    const hash = keccak256(key)
    super.get(hash, cb)
  }

  /**
   * For a falsey value, use the original key
   * to avoid double hashing the key.
   */
  put(key: Buffer, val: Buffer, cb: ErrorCallback) {
    if (!val) {
      this.del(key, cb)
    } else {
      const hash = keccak256(key)
      super.put(hash, val, cb)
    }
  }

  del(key: Buffer, cb: ErrorCallback) {
    const hash = keccak256(key)
    super.del(hash, cb)
  }
}
