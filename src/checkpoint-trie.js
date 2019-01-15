const async = require('async')
const level = require('level-mem')
const WriteStream = require('level-ws')
const BaseTrie = require('./baseTrie')
const proof = require('./proof.js')
const ScratchReadStream = require('./scratchReadStream')
const { callTogether } = require('./util/async')

module.exports = class CheckpointTrie extends BaseTrie {
  constructor (...args) {
    super(...args)
    this._scratch = null
    this._checkpoints = []
  }

  static prove (...args) {
    return proof.prove(...args)
  }

  static verifyProof (...args) {
    return proof.verifyProof(...args)
  }

  /**
   * Is the trie during a checkpoint phase?
   */
  get isCheckpoint () {
    return this._checkpoints.length > 0
  }

  /**
   * Creates a checkpoint that can later be reverted to or committed.
   * After this is called, no changes to the trie will be permanently saved
   * until `commit` is called. Calling `putRaw` overrides the checkpointing
   * mechanism and would directly write to db.
   * @method checkpoint
   */
  checkpoint () {
    const wasCheckpoint = this.isCheckpoint
    this._checkpoints.push(this.root)

    // Entering checkpoint mode is not necessary for nested checkpoints
    if (!wasCheckpoint && this.isCheckpoint) {
      this._enterCpMode()
    }
  }

  /**
   * Commits a checkpoint to disk, if current checkpoint is not nested. If
   * nested, only sets the parent checkpoint as current checkpoint.
   * @method commit
   * @param {Function} cb the callback
   * @throws If not during a checkpoint phase
   */
  commit (cb) {
    cb = callTogether(cb, this.sem.leave)

    this.sem.take(() => {
      if (this.isCheckpoint) {
        this._checkpoints.pop()
        if (!this.isCheckpoint) {
          this._exitCpMode(true, cb)
        } else {
          cb()
        }
      } else {
        throw new Error('trying to commit when not checkpointed')
      }
    })
  }

  /**
   * Reverts the trie to the state it was at when `checkpoint` was first called.
   * If during a nested checkpoint, only sets parent as current checkpoint.
   * @method revert
   * @param {Function} cb the callback
   */
  revert (cb) {
    cb = callTogether(cb, this.sem.leave)

    this.sem.take(() => {
      if (this.isCheckpoint) {
        this.root = this._checkpoints.pop()
        if (!this.isCheckpoint) {
          this._exitCpMode(false, cb)
          return
        }
      }

      cb()
    })
  }

  /**
   * Returns a copy of the underlying trie with the interface
   * of CheckpointTrie.
   * @method copy
   */
  copy () {
    const trie = new CheckpointTrie(this.db, this.root)
    trie._scratch = this._scratch
    // trie._checkpoints = this._checkpoints.slice()
    return trie
  }

  /**
   * Returns a `ScratchReadStream` based on the state updates
   * since checkpoint.
   * @method createScratchReadStream
   */
  createScratchReadStream (scratch) {
    const trie = this.copy()
    scratch = scratch || this._scratch
    // Only read from the scratch
    trie._getDBs = [scratch]
    trie._scratch = scratch
    return new ScratchReadStream(trie)
  }

  /**
   * Puts kv-pair directly to db, ignoring checkpoints.
   * @private
   */
  _overridePutRaw (key, val, cb) {
    const dbPut = (db, cb2) => {
      db.put(key, val, {
        keyEncoding: 'binary',
        valueEncoding: 'binary'
      }, cb2)
    }
    async.each(this.__putDBs, dbPut, cb)
  }

  /**
   * Enter into checkpoint mode.
   * @private
   */
  _enterCpMode () {
    this._scratch = level()
    this._getDBs = [this._scratch].concat(this._getDBs)
    this.__putDBs = this._putDBs
    this._putDBs = [this._scratch]
    this._putRaw = this.putRaw
    this.putRaw = this._overridePutRaw
  }

  /**
   * Exit from checkpoint mode.
   * @private
   */
  _exitCpMode (commitState, cb) {
    var scratch = this._scratch
    this._scratch = null
    this._getDBs = this._getDBs.slice(1)
    this._putDBs = this.__putDBs
    this.putRaw = this._putRaw

    const flushScratch = (db, cb) => {
      this.createScratchReadStream(scratch)
        .pipe(WriteStream(db))
        .on('close', cb)
    }

    if (commitState) {
      async.map(this._putDBs, flushScratch, cb)
    } else {
      cb()
    }
  }
}
