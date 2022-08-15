import { isFalsy } from '@ethereumjs/util'

import { Proof, ROOT_DB_KEY } from '../types'
import { CheckpointTrie } from './checkpoint'

/**
 * You can create a secure Trie where the keys are automatically hashed
 * using **keccak256** by using `import { SecureTrie as Trie } from '@ethereumjs/trie'`.
 * It has the same methods and constructor as `Trie`.
 * @class SecureTrie
 * @extends Trie
 * @public
 */
export class SecureTrie extends CheckpointTrie {
  /**
   * Gets a value given a `key`
   * @param key - the key to search for
   * @returns A Promise that resolves to `Buffer` if a value was found or `null` if no value was found.
   */
  async get(key: Buffer): Promise<Buffer | null> {
    return super.get(this.hash(key))
  }

  /**
   * Stores a given `value` at the given `key`.
   * For a falsey value, use the original key to avoid double hashing the key.
   * @param key
   * @param value
   */
  async put(key: Buffer, val: Buffer): Promise<void> {
    if (this._persistRoot && key.equals(ROOT_DB_KEY)) {
      throw new Error(`Attempted to set '${ROOT_DB_KEY.toString()}' key but it is not allowed.`)
    }

    if (isFalsy(val) || val.toString() === '') {
      await this.del(key)
    } else {
      await super.put(this.hash(key), val)
    }
  }

  /**
   * Deletes a value given a `key`.
   * @param key
   */
  async del(key: Buffer): Promise<void> {
    await super.del(this.hash(key))
  }

  /**
   * prove has been renamed to {@link SecureTrie.createProof}.
   * @deprecated
   * @param key
   */
  async prove(key: Buffer): Promise<Proof> {
    return this.createProof(key)
  }

  /**
   * Creates a proof that can be verified using {@link SecureTrie.verifyProof}.
   * @param key
   */
  async createProof(key: Buffer): Promise<Proof> {
    return super.createProof(this.hash(key))
  }

  /**
   * Verifies a proof.
   * @param rootHash
   * @param key
   * @param proof
   * @throws If proof is found to be invalid.
   * @returns The value from the key.
   */
  async verifyProof(rootHash: Buffer, key: Buffer, proof: Proof): Promise<Buffer | null> {
    return super.verifyProof(rootHash, this.hash(key), proof)
  }

  /**
   * Verifies a range proof.
   */
  verifyRangeProof(
    rootHash: Buffer,
    firstKey: Buffer | null,
    lastKey: Buffer | null,
    keys: Buffer[],
    values: Buffer[],
    proof: Buffer[] | null
  ): Promise<boolean> {
    return super.verifyRangeProof(
      rootHash,
      firstKey && this.hash(firstKey),
      lastKey && this.hash(lastKey),
      keys.map((k) => this.hash(k)),
      values,
      proof
    )
  }

  /**
   * Returns a copy of the underlying trie with the interface of SecureTrie.
   * @param includeCheckpoints - If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.
   */
  copy(includeCheckpoints = true): SecureTrie {
    const secureTrie = new SecureTrie({
      db: this.dbStorage.copy(),
      root: this.root,
      deleteFromDB: (this as any)._deleteFromDB,
      persistRoot: this._persistRoot,
      hash: (this as any)._hash,
    })
    if (includeCheckpoints && this.isCheckpoint) {
      secureTrie.db.checkpoints = [...this.db.checkpoints]
    }
    return secureTrie
  }

  /**
   * Persists the root hash in the underlying database
   */
  async persistRoot() {
    if (this._persistRoot === true) {
      await this.db.put(this.hash(ROOT_DB_KEY), this.root)
    }
  }
}
