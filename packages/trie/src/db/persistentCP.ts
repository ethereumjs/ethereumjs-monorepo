import type { BatchDBOp, DB } from '../types'

/**
 * Checkpointing Mechanism where node put operations
 * are directly written to the database.
 *
 * This CP Mechanism is EXPERIMENTAL and might change
 * along minor release versions.
 *
 * Usage:
 *
 * ```typescript
 * const db = new MapDB() // Use your underlying DB (e.g. Level DB)
 * const cpDB = new PersistentCheckpointDB(new MapDB())
 * await Trie.create({ db })
 * ```
 *
 * A journal is keeping track of added keys for an
 * eventual later revert. The journal from the current
 * CP is kept in memory, older journals are saved to the
 * underlying DB.
 *
 * This mechanism works well with a larger amount of
 * subsequent checkpoints and/or a substantial amount
 * of new keys being added.
 *
 * Mechanism can not be used together with the `useNodePruning`
 * option.
 */
export class PersistentCheckpointDB implements DB {
  // Buffer array with roots for revert
  public checkpoints: Buffer[]
  public db: DB

  /**
   * Initialize a DB instance.
   */
  constructor(db: DB) {
    this.db = db
    // Roots of trie at the moment of checkpoint
    this.checkpoints = []
  }

  /**
   * Flush the checkpoints and use the given checkpoints instead.
   * @param {Checkpoint[]} checkpoints
   */
  setCheckpoints(checkpoints: Buffer[]) {
    this.checkpoints = checkpoints
  }

  /**
   * Is the DB during a checkpoint phase?
   */
  hasCheckpoints() {
    return this.checkpoints.length > 0
  }

  /**
   * Adds a new checkpoint to the stack
   * @param root
   */
  checkpoint(root: Buffer) {
    this.checkpoints.push(root)
  }

  /**
   * Commits the latest checkpoint
   */
  async commit() {
    this.checkpoints.pop()!
  }

  /**
   * Reverts the latest checkpoint
   */
  async revert() {
    return this.checkpoints.pop()!
  }

  /**
   * @inheritDoc
   */
  async get(key: Buffer): Promise<Buffer | null> {
    return this.db.get(key)
  }

  /**
   * @inheritDoc
   */
  async put(key: Buffer, val: Buffer): Promise<void> {
    if (this.hasCheckpoints()) {
      // TODO: Store key for eventual revert
    }
    await this.db.put(key, val)
  }

  /**
   * @inheritDoc
   */
  async del(key: Buffer): Promise<void> {
    if (this.hasCheckpoints()) {
      throw new Error(`CP mechanism not compatible with DB deletes`)
    } else {
      // delete the value on disk
      await this.db.del(key)
    }
  }

  /**
   * @inheritDoc
   */
  async batch(opStack: BatchDBOp[]): Promise<void> {
    if (this.hasCheckpoints()) {
      for (const op of opStack) {
        if (op.type === 'put') {
          await this.put(op.key, op.value)
        } else if (op.type === 'del') {
          throw new Error(`CP mechanism not compatible with DB deletes`)
        }
      }
    } else {
      await this.db.batch(opStack)
    }
  }

  /**
   * @inheritDoc
   */
  copy(): PersistentCheckpointDB {
    return new PersistentCheckpointDB(this.db)
  }
}
