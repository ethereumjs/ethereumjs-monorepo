import {
  KeyEncoding,
  MapDB,
  ValueEncoding,
  bytesToUnprefixedHex,
  bytesToUtf8,
  equalsBytes,
  unprefixedHexToBytes,
} from '@ethereumjs/util'

import { CheckpointDB } from './db/checkpoint.js'
import {
  type EmbeddedNode,
  type FoundNodeFunction,
  type Nibbles,
  type Proof,
  ROOT_DB_KEY,
  type VerkleTrieOpts,
  type VerkleTrieOptsWithDefaults,
} from './types.js'
import { Lock } from './util/lock.js'

import type { LeafNode, VerkleNode } from './node/verkleNode.js'
import type { BatchDBOp, DB, PutBatch } from '@ethereumjs/util'

interface Path {
  node: VerkleNode | null
  remaining: Nibbles
  stack: VerkleNode[]
}

/**
 * The basic verkle trie interface, use with `import { VerkleTrie } from '@ethereumjs/verkle'`.
 */
export class VerkleTrie {
  protected readonly _opts: VerkleTrieOptsWithDefaults = {
    useRootPersistence: false,
    useNodePruning: false,
    cacheSize: 0,
  }

  /** The root for an empty trie */
  EMPTY_TRIE_ROOT: Uint8Array

  /** The backend DB */
  protected _db!: CheckpointDB
  protected _hashLen: number
  protected _lock = new Lock()
  protected _root: Uint8Array

  /**
   * Creates a new verkle trie.
   * @param opts Options for instantiating the verkle trie
   *
   * Note: in most cases, the static {@link VerkleTrie.create} constructor should be used.  It uses the same API but provides sensible defaults
   */
  constructor(opts?: VerkleTrieOpts) {
    if (opts !== undefined) {
      this._opts = { ...this._opts, ...opts }
    }

    this.database(opts?.db ?? new MapDB<string, string>())

    this.EMPTY_TRIE_ROOT = new Uint8Array() // TODO
    this._hashLen = this.EMPTY_TRIE_ROOT.length
    this._root = this.EMPTY_TRIE_ROOT

    if (opts?.root) {
      this.root(opts.root)
    }
  }

  static async create(opts?: VerkleTrieOpts) {
    const key = ROOT_DB_KEY

    if (opts?.db !== undefined && opts?.useRootPersistence === true) {
      if (opts?.root === undefined) {
        const rootHex = await opts?.db.get(bytesToUnprefixedHex(key), {
          keyEncoding: KeyEncoding.String,
          valueEncoding: ValueEncoding.String,
        })
        opts.root = rootHex !== undefined ? unprefixedHexToBytes(rootHex) : undefined
      } else {
        await opts?.db.put(bytesToUnprefixedHex(key), bytesToUnprefixedHex(opts.root), {
          keyEncoding: KeyEncoding.String,
          valueEncoding: ValueEncoding.String,
        })
      }
    }

    return new VerkleTrie(opts)
  }

  database(db?: DB<string, string>) {
    if (db !== undefined) {
      if (db instanceof CheckpointDB) {
        throw new Error('Cannot pass in an instance of CheckpointDB')
      }

      this._db = new CheckpointDB({ db, cacheSize: this._opts.cacheSize })
    }

    return this._db
  }

  /**
   * Gets and/or Sets the current root of the `trie`
   */
  root(value?: Uint8Array | null): Uint8Array {
    if (value !== undefined) {
      if (value === null) {
        value = this.EMPTY_TRIE_ROOT
      }

      if (value.length !== this._hashLen) {
        throw new Error(`Invalid root length. Roots are ${this._hashLen} bytes`)
      }

      this._root = value
    }

    return this._root
  }

  /**
   * Checks if a given root exists.
   */
  async checkRoot(root: Uint8Array): Promise<boolean> {
    try {
      const value = await this.lookupNode(root)
      return value !== null
    } catch (error: any) {
      if (error.message === 'Missing node in DB') {
        return equalsBytes(root, this.EMPTY_TRIE_ROOT)
      } else {
        throw error
      }
    }
  }

  /**
   * Gets a value given a `key`
   * @param key - the key to search for
   * @param throwIfMissing - if true, throws if any nodes are missing. Used for verifying proofs. (default: false)
   * @returns A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.
   */
  async get(key: Uint8Array, throwIfMissing = false): Promise<Uint8Array[] | null> {
    throw new Error('Not implemented')
  }

  /**
   * Stores a given `value` at the given `key` or do a delete if `value` is empty
   * (delete operations are only executed on DB with `deleteFromDB` set to `true`)
   * @param key
   * @param value
   * @returns A Promise that resolves once value is stored.
   */
  async put(key: Uint8Array, value: Uint8Array): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Deletes a value given a `key` from the trie
   * (delete operations are only executed on DB with `deleteFromDB` set to `true`)
   * @param key
   * @returns A Promise that resolves once value is deleted.
   */
  async del(key: Uint8Array): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Tries to find a path to the node for the given key.
   * It returns a `stack` of nodes to the closest node.
   * @param key - the search key
   * @param throwIfMissing - if true, throws if any nodes are missing. Used for verifying proofs. (default: false)
   */
  async findPath(key: Uint8Array, throwIfMissing = false): Promise<Path> {
    throw new Error('Not implemented')
  }

  /**
   * Walks a trie until finished.
   * @param root
   * @param onFound - callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves.
   * @returns Resolves when finished walking trie.
   */
  async walkTrie(root: Uint8Array, onFound: FoundNodeFunction): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Executes a callback for each node in the trie.
   * @param onFound - callback to call when a node is found.
   * @returns Resolves when finished walking trie.
   */
  async walkAllNodes(onFound: OnFound): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Executes a callback for each value node in the trie.
   * @param onFound - callback to call when a node is found.
   * @returns Resolves when finished walking trie.
   */
  async walkAllValueNodes(onFound: OnFound): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Creates the initial node from an empty tree.
   * @private
   */
  protected async _createInitialNode(key: Uint8Array, value: Uint8Array): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Retrieves a node from db by hash.
   */
  async lookupNode(node: Uint8Array | Uint8Array[]): Promise<TrieNode | null> {
    throw new Error('Not implemented')
  }

  /**
   * Updates a node.
   * @private
   * @param key
   * @param value
   * @param keyRemainder
   * @param stack
   */
  protected async _updateNode(
    k: Uint8Array,
    value: Uint8Array,
    keyRemainder: Nibbles,
    stack: VerkleNode[]
  ): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Deletes a node from the trie.
   * @private
   */
  protected async _deleteNode(k: Uint8Array, stack: VerkleNode[]): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Saves a stack of nodes to the database.
   *
   * @param key - the key. Should follow the stack
   * @param stack - a stack of nodes to the value given by the key
   * @param opStack - a stack of levelup operations to commit at the end of this function
   */
  async saveStack(key: Nibbles, stack: VerkleNode[], opStack: BatchDBOp[]): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Formats node to be saved by `levelup.batch`.
   * @private
   * @param node - the node to format.
   * @param topLevel - if the node is at the top level.
   * @param opStack - the opStack to push the node's data.
   * @param remove - whether to remove the node
   * @returns The node's hash used as the key or the rawNode.
   */
  _formatNode(
    node: VerkleNode,
    topLevel: boolean,
    opStack: BatchDBOp[],
    remove: boolean = false
  ): Uint8Array | (EmbeddedNode | null)[] {
    throw new Error('Not implemented')
  }

  /**
   * The given hash of operations (key additions or deletions) are executed on the trie
   * (delete operations are only executed on DB with `deleteFromDB` set to `true`)
   * @example
   * const ops = [
   *    { type: 'del', key: Uint8Array.from('father') }
   *  , { type: 'put', key: Uint8Array.from('name'), value: Uint8Array.from('Yuri Irsenovich Kim') }
   *  , { type: 'put', key: Uint8Array.from('dob'), value: Uint8Array.from('16 February 1941') }
   *  , { type: 'put', key: Uint8Array.from('spouse'), value: Uint8Array.from('Kim Young-sook') }
   *  , { type: 'put', key: Uint8Array.from('occupation'), value: Uint8Array.from('Clown') }
   * ]
   * await trie.batch(ops)
   * @param ops
   */
  async batch(ops: BatchDBOp[]): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Saves the nodes from a proof into the trie.
   * @param proof
   */
  async fromProof(proof: Proof): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Creates a proof from a trie and key that can be verified using {@link Trie.verifyProof}.
   * @param key
   */
  async createProof(key: Uint8Array): Promise<Proof> {
    throw new Error('Not implemented')
  }

  /**
   * Verifies a proof.
   * @param rootHash
   * @param key
   * @param proof
   * @throws If proof is found to be invalid.
   * @returns The value from the key, or null if valid proof of non-existence.
   */
  async verifyProof(
    rootHash: Uint8Array,
    key: Uint8Array,
    proof: Proof
  ): Promise<Uint8Array | null> {
    throw new Error('Not implemented')
  }

  /**
   * The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.
   * @return Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`
   */
  createReadStream(): any {
    throw new Error('Not implemented')
  }

  /**
   * Returns a copy of the underlying trie.
   *
   * Note on db: the copy will create a reference to the
   * same underlying database.
   *
   * Note on cache: for memory reasons a copy will not
   * recreate a new LRU cache but initialize with cache
   * being deactivated.
   *
   * @param includeCheckpoints - If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.
   */
  shallowCopy(includeCheckpoints = true): VerkleTrie {
    const trie = new VerkleTrie({
      ...this._opts,
      db: this._db.db.shallowCopy(),
      root: this.root(),
      cacheSize: 0,
    })
    if (includeCheckpoints && this.hasCheckpoints()) {
      trie._db.setCheckpoints(this._db.checkpoints)
    }
    return trie
  }

  /**
   * Persists the root hash in the underlying database
   */
  async persistRoot() {
    if (this._opts.useRootPersistence) {
      await this._db.put(this.appliedKey(ROOT_DB_KEY), this.root())
    }
  }

  /**
   * Finds all nodes that are stored directly in the db
   * (some nodes are stored raw inside other nodes)
   * called by {@link ScratchReadStream}
   * @private
   */
  protected async _findDbNodes(onFound: FoundNodeFunction): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Returns the key practically applied for trie construction
   * depending on the `useKeyHashing` option being set or not.
   * @param key
   */
  protected appliedKey(key: Uint8Array) {
    throw new Error('Not implemented')
  }

  protected hash(msg: Uint8Array): Uint8Array {
    throw new Error('Not implemented')
  }

  /**
   * Is the trie during a checkpoint phase?
   */
  hasCheckpoints() {
    return this._db.hasCheckpoints()
  }

  /**
   * Creates a checkpoint that can later be reverted to or committed.
   * After this is called, all changes can be reverted until `commit` is called.
   */
  checkpoint() {
    this._db.checkpoint(this.root())
  }

  /**
   * Commits a checkpoint to disk, if current checkpoint is not nested.
   * If nested, only sets the parent checkpoint as current checkpoint.
   * @throws If not during a checkpoint phase
   */
  async commit(): Promise<void> {
    if (!this.hasCheckpoints()) {
      throw new Error('trying to commit when not checkpointed')
    }

    await this._lock.acquire()
    await this._db.commit()
    await this.persistRoot()
    this._lock.release()
  }

  /**
   * Reverts the trie to the state it was at when `checkpoint` was first called.
   * If during a nested checkpoint, sets root to most recent checkpoint, and sets
   * parent checkpoint as current.
   */
  async revert(): Promise<void> {
    if (!this.hasCheckpoints()) {
      throw new Error('trying to revert when not checkpointed')
    }

    await this._lock.acquire()
    this.root(await this._db.revert())
    await this.persistRoot()
    this._lock.release()
  }

  /**
   * Flushes all checkpoints, restoring the initial checkpoint state.
   */
  flushCheckpoints() {
    this._db.checkpoints = []
  }
}
