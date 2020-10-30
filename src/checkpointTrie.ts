import { Trie as BaseTrie } from './baseTrie'
import { ScratchReadStream } from './scratchReadStream'
import { ScratchDB } from './scratch'
import { DB } from './db'
const WriteStream = require('level-ws')

/**
 * Adds checkpointing to the {@link BaseTrie}
 */
export class CheckpointTrie extends BaseTrie {
  _mainDB: DB
  _scratch: ScratchDB | null
  _checkpoints: Buffer[]

  constructor(...args: any) {
    super(...args)
    // Reference to main DB instance
    this._mainDB = this.db
    // DB instance used for checkpoints
    this._scratch = null
    // Roots of trie at the moment of checkpoint
    this._checkpoints = []
  }

  /**
   * Is the trie during a checkpoint phase?
   */
  get isCheckpoint() {
    return this._checkpoints.length > 0
  }

  /**
   * Creates a checkpoint that can later be reverted to or committed.
   * After this is called, no changes to the trie will be permanently saved until `commit` is called.
   * To override the checkpointing mechanism use `_maindb.put` to write directly write to db.
   */
  checkpoint() {
    const wasCheckpoint = this.isCheckpoint
    this._checkpoints.push(this.root)

    // Entering checkpoint mode is not necessary for nested checkpoints
    if (!wasCheckpoint && this.isCheckpoint) {
      this._enterCpMode()
    }
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

    this._checkpoints.pop()
    if (!this.isCheckpoint) {
      await this._exitCpMode(true)
    }

    this.lock.signal()
  }

  /**
   * Reverts the trie to the state it was at when `checkpoint` was first called.
   * If during a nested checkpoint, sets root to most recent checkpoint, and sets
   * parent checkpoint as current.
   */
  async revert(): Promise<void> {
    await this.lock.wait()
    if (this.isCheckpoint) {
      this.root = this._checkpoints.pop()!
      if (!this.isCheckpoint) {
        await this._exitCpMode(false)
      }
    }
    this.lock.signal()
  }

  /**
   * Returns a copy of the underlying trie with the interface of CheckpointTrie.
   * @param includeCheckpoints - If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.
   */
  copy(includeCheckpoints = true): CheckpointTrie {
    const db = this._mainDB.copy()
    const trie = new CheckpointTrie(db._leveldb, this.root)
    if (includeCheckpoints && this.isCheckpoint) {
      trie._checkpoints = this._checkpoints.slice()
      trie._scratch = this._scratch!.copy()
      trie.db = trie._scratch
    }
    return trie
  }

  /**
   * Enter into checkpoint mode.
   * @private
   */
  _enterCpMode() {
    this._scratch = new ScratchDB(this._mainDB)
    this.db = this._scratch
  }

  /**
   * Exit from checkpoint mode.
   * @private
   */
  async _exitCpMode(commitState: boolean): Promise<void> {
    return new Promise((resolve) => {
      const scratch = this._scratch as ScratchDB
      this._scratch = null
      this.db = this._mainDB

      if (commitState) {
        this._createScratchReadStream(scratch)
          .pipe(WriteStream(this.db._leveldb))
          .on('close', resolve)
      } else {
        process.nextTick(resolve)
      }
    })
  }

  /**
   * Returns a `ScratchReadStream` based on the state updates
   * since checkpoint.
   * @private
   */
  _createScratchReadStream(scratchDb?: ScratchDB) {
    const scratch = scratchDb || this._scratch
    if (!scratch) {
      throw new Error('No scratch found to use')
    }
    const trie = new BaseTrie(scratch._leveldb, this.root)
    trie.db = scratch
    return new ScratchReadStream(trie)
  }
}
