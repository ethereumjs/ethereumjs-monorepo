import { CheckpointDB, MapDB } from '../db'

import { Trie } from './trie'

import type { DB, TrieOpts } from '../types'

/**
 * Adds checkpointing to the {@link Trie}
 */
export class CheckpointTrie extends Trie {
  db: CheckpointDB
  dbStorage: DB

  constructor(opts?: TrieOpts) {
    super(opts)
    this.dbStorage = opts?.db ?? new MapDB()
    this.db = new CheckpointDB(this.dbStorage)
  }

  /**
   * Is the trie during a checkpoint phase?
   */
  get isCheckpoint() {
    return this.db.isCheckpoint
  }

  /**
   * Creates a checkpoint that can later be reverted to or committed.
   * After this is called, all changes can be reverted until `commit` is called.
   */
  checkpoint() {
    this.db.checkpoint(this.root)
  }

  /**
   * Commits a checkpoint to disk, if current checkpoint is not nested.
   * If nested, only sets the parent checkpoint as current checkpoint.
   * @throws If not during a checkpoint phase
   */
  async commit(): Promise<void> {
    if (!this.isCheckpoint) {
      throw new Error('trying to commit when not checkpointed')
    }

    await this.lock.wait()
    await this.db.commit()
    await this.persistRoot()
    this.lock.signal()
  }

  /**
   * Reverts the trie to the state it was at when `checkpoint` was first called.
   * If during a nested checkpoint, sets root to most recent checkpoint, and sets
   * parent checkpoint as current.
   */
  async revert(): Promise<void> {
    if (!this.isCheckpoint) {
      throw new Error('trying to revert when not checkpointed')
    }

    await this.lock.wait()
    this.root = await this.db.revert()
    await this.persistRoot()
    this.lock.signal()
  }

  /**
   * Returns a copy of the underlying trie with the interface of CheckpointTrie.
   * @param includeCheckpoints - If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.
   */
  copy(includeCheckpoints = true): CheckpointTrie {
    const trie = new CheckpointTrie({
      db: this.dbStorage.copy(),
      root: this.root,
      deleteFromDB: (this as any)._deleteFromDB,
      persistRoot: this._persistRoot,
      hash: (this as any)._hash,
    })
    if (includeCheckpoints && this.isCheckpoint) {
      trie.db.checkpoints = [...this.db.checkpoints]
    }
    return trie
  }
}
