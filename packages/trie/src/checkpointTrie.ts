import { Trie as BaseTrie } from './baseTrie'

/**
 * Adds checkpointing to the {@link BaseTrie}
 */
export class CheckpointTrie extends BaseTrie {
  _checkpoints: Buffer[]

  constructor(...args: any) {
    super(...args)
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
   * After this is called, all changes can be reverted until `commit` is called.
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.isCheckpoint) {
      this.root = this._checkpoints.pop()!
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    const db = this.db.copy()
    const trie = new CheckpointTrie(db._leveldb, this.root)
    if (includeCheckpoints && this.isCheckpoint) {
      trie._checkpoints = this._checkpoints.slice()
    }
    return trie
  }

  /**
   * Enter into checkpoint mode.
   * @private
   */
  _enterCpMode() {}

  /**
   * Exit from checkpoint mode.
   * @private
   */
  async _exitCpMode(commitState: boolean): Promise<void> {
    return new Promise((resolve) => {
      /*if (commitState) {
      } else {
      }*/
      commitState = !!commitState // Temporary dummy line for linting
      resolve()
    })
  }
}
