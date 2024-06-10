import { RLP } from '@ethereumjs/rlp'
import {
  KeyEncoding,
  Lock,
  ValueEncoding,
  equalsBytes,
  intToBytes,
  setLengthLeft,
  setLengthRight,
  zeros,
} from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'

import { CheckpointDB } from './db/checkpoint.js'
import { InternalNode } from './node/internalNode.js'
import { LeafNode } from './node/leafNode.js'
import { type VerkleNode, VerkleNodeType } from './node/types.js'
import { createCValues, decodeNode, decodeRawNode, isRawNode } from './node/util.js'
import {
  type Proof,
  ROOT_DB_KEY,
  type VerkleTreeOpts,
  type VerkleTreeOptsWithDefaults,
} from './types.js'
import { WalkController, matchingBytesLength } from './util/index.js'
import { verifyKeyLength } from './util/keys.js'

import type { FoundNodeFunction, VerkleCrypto } from './types.js'
import type { BatchDBOp, DB, PutBatch } from '@ethereumjs/util'

interface Path {
  node: VerkleNode | null
  remaining: Uint8Array
  stack: VerkleNode[]
}

/**
 * The basic verkle tree interface, use with `import { VerkleTree } from '@ethereumjs/verkle'`.
 */
export class VerkleTree {
  protected readonly _opts: VerkleTreeOptsWithDefaults = {
    useRootPersistence: false,
    cacheSize: 0,
    verkleCrypto: undefined,
  }

  /** The root for an empty tree */
  EMPTY_TREE_ROOT: Uint8Array

  /** The backend DB */
  protected _db!: CheckpointDB
  protected _hashLen: number
  protected _lock = new Lock()
  protected _root: Uint8Array

  protected verkleCrypto: VerkleCrypto
  /**
   * Creates a new verkle tree.
   * @param opts Options for instantiating the verkle tree
   *
   * Note: in most cases, the static {@link VerkleTree.create} constructor should be used.  It uses the same API but provides sensible defaults
   */
  constructor(opts?: VerkleTreeOpts) {
    if (opts !== undefined) {
      this._opts = { ...this._opts, ...opts }
    }

    this.database(opts?.db)

    this.EMPTY_TREE_ROOT = zeros(32)
    this._hashLen = this.EMPTY_TREE_ROOT.length
    this._root = this.EMPTY_TREE_ROOT

    if (opts?.root) {
      this.root(opts.root)
    }

    if (opts === undefined || opts?.verkleCrypto === undefined) {
      throw new Error('instantiated verkle cryptography option required for verkle tries')
    }

    this.verkleCrypto = opts?.verkleCrypto
  }

  static async create(opts?: VerkleTreeOpts) {
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

    if (opts === undefined) {
      opts = {
        verkleCrypto: loadVerkleCrypto,
      }
    }
    opts.verkleCrypto = await loadVerkleCrypto()

    return new VerkleTree(opts)
  }

  database(db?: DB<Uint8Array, Uint8Array>) {
    if (db !== undefined) {
      if (db instanceof CheckpointDB) {
        throw new Error('Cannot pass in an instance of CheckpointDB')
      }

      this._db = new CheckpointDB({ db, cacheSize: this._opts.cacheSize })
    }

    return this._db
  }

  /**
   * Gets and/or Sets the current root of the `tree`
   */
  root(value?: Uint8Array | null): Uint8Array {
    if (value !== undefined) {
      if (value === null) {
        value = this.EMPTY_TREE_ROOT
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
        return equalsBytes(root, this.EMPTY_TREE_ROOT)
      } else {
        throw error
      }
    }
  }

  /**
   * Gets a value given a `key`
   * @param key - the key to search for
   * @returns A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.
   */
  async get(key: Uint8Array): Promise<Uint8Array | null> {
    verifyKeyLength(key)
    const nodeRLP = await this._db.get(key)
    if (nodeRLP === undefined) return null
    // We first retrieve the node and decode it
    const rawNode = RLP.decode(nodeRLP) as Uint8Array[]
    const node =
      rawNode[0][0] === VerkleNodeType.Leaf
        ? // TODO: Figure out how to determine depth from key
          LeafNode.fromRawNode(rawNode, 1, this.verkleCrypto)
        : InternalNode.fromRawNode(rawNode, 1, this.verkleCrypto)

    if (node instanceof LeafNode) {
      const keyLastByte = key[key.length - 1]

      // The retrieved leaf node contains an array of 256 possible values.
      // The index of the value we want is at the key's last byte
      return node.values?.[keyLastByte] ?? null
    }

    return null
  }

  /**
   * Stores a given `value` at the given `key` or do a delete if `value` is empty
   * (delete operations are only executed on DB with `deleteFromDB` set to `true`)
   * @param key - the key to store the value at
   * @param value - the value to store
   * @returns A Promise that resolves once value is stored.
   */
  async put(key: Uint8Array, value: Uint8Array): Promise<void> {
    verifyKeyLength(key)

    // Find or create the leaf node
    let leafNode = await this.findLeafNode(key, false)
    if (!(leafNode instanceof LeafNode)) {
      // If leafNode is missing, create it
      const values: Uint8Array[] = new Array(256).fill(new Uint8Array()) // Create new empty array of 256 values
      const suffix = key[31]
      values[suffix] = value // Set value at key suffix

      // Generate the 16 byte values representing the 32 byte values in the half of the values array that
      // contain the initial value for the leaf node
      const cValues =
        suffix < 128 ? createCValues(values.slice(0, 128)) : createCValues(values.slice(128))
      // The commitment index is the 2 * the suffix (i.e. the position of the value in the values array)
      // here because each 32 byte value in the leaf node is represented as two 16 byte values in the
      // cValues array.
      const commitmentIndex = suffix < 128 ? suffix * 2 : (suffix - 128) * 2
      let cCommitment = this.verkleCrypto.zeroCommitment
      // Update the commitment for the first 16 bytes of the value
      cCommitment = this.verkleCrypto.updateCommitment(
        cCommitment,
        commitmentIndex,
        new Uint8Array(32),
        cValues[commitmentIndex]
      )
      // Update the commitment for the second 16 bytes of the value
      cCommitment = this.verkleCrypto.updateCommitment(
        cCommitment,
        commitmentIndex + 1,
        new Uint8Array(32),
        cValues[commitmentIndex + 1]
      )
      const c1 = suffix < 128 ? cCommitment : this.verkleCrypto.zeroCommitment
      const c2 = suffix > 127 ? cCommitment : this.verkleCrypto.zeroCommitment
      // Generate a commitment for the new leaf node, using the zero commitment as a base
      // 1) Update commitment with Leaf marker (1) in position 0
      // 2) Update commitment with stem (in little endian format) in position 1
      // 3) Update commitment with c1
      // 4) update commitment with c2
      let commitment = this.verkleCrypto.updateCommitment(
        this.verkleCrypto.zeroCommitment,
        0,
        new Uint8Array(32),
        setLengthLeft(intToBytes(1), 32)
      )
      commitment = this.verkleCrypto.updateCommitment(
        commitment,
        1,
        new Uint8Array(32),
        setLengthRight(key.slice(0, 31), 32)
      )
      commitment = this.verkleCrypto.updateCommitment(
        commitment,
        2,
        new Uint8Array(32),
        // We hash the commitment when using in the leaf node commitment since c1 is 64 bytes long
        // and we need a 32 byte input for the scalar value in `updateCommitment`
        this.verkleCrypto.hashCommitment(c1)
      )
      commitment = this.verkleCrypto.updateCommitment(
        commitment,
        3,
        new Uint8Array(32),
        this.verkleCrypto.hashCommitment(c2)
      )
      leafNode = LeafNode.create(
        key.slice(0, 31),
        values,
        leafNode.length,
        commitment,
        c1,
        c2,
        this.verkleCrypto
      )
      await this._db.put(key, leafNode.serialize())
    }

    // Walk up the tree and update internal nodes
    let currentNode: VerkleNode = leafNode
    let currentKey = leafNode.stem
    let currentDepth = leafNode.depth

    while (currentDepth > 0) {
      let rawNode: Uint8Array | undefined
      let parentIndex = currentKey[currentKey.length - 1]
      let parentKey = currentKey.slice(0, currentKey.length - 1)
      while (!(rawNode instanceof Uint8Array)) {
        parentIndex = currentKey[currentKey.length - 1]
        // Parent key should be at least one shorter than the current key length
        parentKey = currentKey.slice(0, currentKey.length - 1)
        // Try to retrieve parent node - going back up the path one byte at a time
        rawNode = await this._db.get(parentKey)
        if (rawNode === null) continue
      }
      // TODO: Determine how to decide if we need to go further up the tree or create a new internal node here
      // Currently, this code would insert a new internal node at every step up the trie (which we don't want)
      // if (rawNode !== null) {
      const parentNode = InternalNode.fromRawNode(
        RLP.decode(rawNode) as Uint8Array[],
        currentDepth,
        this.verkleCrypto
      )
      // } else {
      //   parentNode = InternalNode.create(currentDepth, this.verkleCrypto)
      // }
      parentNode.setChild(parentIndex, currentNode.commitment)
      await this._db.put(parentKey, parentNode.serialize())

      currentNode = parentNode
      currentKey = parentKey
      currentDepth--
    }

    this._root = currentNode.hash()
  }

  /**
   * Tries to find a path to the node for the given key.
   * It returns a `stack` of nodes to the closest node.
   * @param key - the search key
   * @param throwIfMissing - if true, throws if any nodes are missing. Used for verifying proofs. (default: false)
   */
  async findPath(key: Uint8Array): Promise<Path> {
    const result: Path = {
      node: null,
      stack: [],
      remaining: key,
    }
    if (equalsBytes(this.root(), this.EMPTY_TREE_ROOT)) return result

    // Check to see if desired node is available
    let rawNode = await this._db.get(key)
    let targetNodeBytes: Uint8Array[] = []
    if (rawNode !== undefined) {
      // Store target node bytes for deccoding later
      targetNodeBytes = RLP.decode(rawNode) as Uint8Array[]
    }

    let parentKey = key.slice(0, key.length - 1)
    rawNode = await this._db.get(parentKey)
    const stack = []
    // We walk up the parent key from the end of the key to the root
    while (parentKey.length > 0) {
      // Try to retrieve parent node - going back up the path one byte at a time
      rawNode = await this._db.get(parentKey)
      if (rawNode === undefined) {
        parentKey = parentKey.slice(0, parentKey.length - 1)
        continue
      }
      const decodedNode = RLP.decode(rawNode) as Uint8Array[]
      // Store node RLP and its corresponding path for later
      stack.push([decodedNode, parentKey])
      parentKey = parentKey.slice(0, parentKey.length - 1)
    }
    // Convert RLP of path nodes to stack of verkle nodes
    result.stack = stack.map((node, idx) =>
      decodeRawNode(node[0] as Uint8Array[], idx, this.verkleCrypto)
    )
    if (targetNodeBytes.length === 0) {
      if (stack.length === 0) {
        // Return entire key if no nodes found in trie
        result.remaining = key
      } else {
        // Get path/key of first node in stack which is the node closest to the sought node
        const lastKey = stack[0][1] as Uint8Array
        const lastIndex = matchingBytesLength(lastKey, key)
        result.remaining = key.slice(lastIndex)
      }
    } else {
      result.remaining = new Uint8Array()
      result.node = decodeRawNode(targetNodeBytes, result.stack.length, this.verkleCrypto)
    }
    return result
  }

  /**
   * Walks a tree until finished.
   * @param root
   * @param onFound - callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves.
   * @returns Resolves when finished walking tree.
   */
  async walkTree(root: Uint8Array, onFound: FoundNodeFunction): Promise<void> {
    await WalkController.newWalk(onFound, this, root)
  }

  /**
   * Tries to find the leaf node leading up to the given key, or null if not found.
   * @param key - the search key
   * @param throwIfMissing - if true, throws if any nodes are missing. Used for verifying proofs. (default: false)
   */
  async findLeafNode(key: Uint8Array, throwIfMissing = false): Promise<LeafNode | VerkleNode[]> {
    const { node, stack } = await this.findPath(key)
    if (!(node instanceof LeafNode)) {
      if (throwIfMissing) {
        throw new Error('leaf node not found')
      }
      // return depth of remaining nodes
      return stack
    }
    return node
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
  async lookupNode(node: Uint8Array | Uint8Array[]): Promise<VerkleNode | null> {
    throw new Error('not implemented')
    // if (isRawNode(node)) {
    //   return decodeRawNode(node)
    // }
    // const value = await this._db.get(node)
    // if (value !== undefined) {
    //   return decodeNode(value)
    // } else {
    //   // Dev note: this error message text is used for error checking in `checkRoot`, `verifyProof`, and `findPath`
    //   throw new Error('Missing node in DB')
    // }
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
    keyRemainder: Uint8Array,
    stack: VerkleNode[]
  ): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Saves a stack of nodes to the database.
   *
   * @param key - the key. Should follow the stack
   * @param stack - a stack of nodes to the value given by the key
   * @param opStack - a stack of levelup operations to commit at the end of this function
   */
  async saveStack(
    key: Uint8Array,
    stack: VerkleNode[],
    opStack: PutBatch<Uint8Array, Uint8Array>[]
  ): Promise<void> {
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
    opStack: PutBatch<Uint8Array, Uint8Array>,
    remove: boolean = false
  ): Uint8Array {
    throw new Error('Not implemented')
  }

  /**
   * The given hash of operations (key additions or deletions) are executed on the tree
   * (delete operations are only executed on DB with `deleteFromDB` set to `true`)
   * @example
   * const ops = [
   *    { type: 'del', key: Uint8Array.from('father') }
   *  , { type: 'put', key: Uint8Array.from('name'), value: Uint8Array.from('Yuri Irsenovich Kim') }
   *  , { type: 'put', key: Uint8Array.from('dob'), value: Uint8Array.from('16 February 1941') }
   *  , { type: 'put', key: Uint8Array.from('spouse'), value: Uint8Array.from('Kim Young-sook') }
   *  , { type: 'put', key: Uint8Array.from('occupation'), value: Uint8Array.from('Clown') }
   * ]
   * await tree.batch(ops)
   * @param ops
   */
  async batch(ops: BatchDBOp[]): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Saves the nodes from a proof into the tree.
   * @param proof
   */
  async fromProof(proof: Proof): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Creates a proof from a tree and key that can be verified using {@link VerkleTree.verifyProof}.
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
   * @return Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `tree`
   */
  createReadStream(): any {
    throw new Error('Not implemented')
  }

  /**
   * Returns a copy of the underlying tree.
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
  shallowCopy(includeCheckpoints = true): VerkleTree {
    const tree = new VerkleTree({
      ...this._opts,
      db: this._db.db.shallowCopy(),
      root: this.root(),
      cacheSize: 0,
      verkleCrypto: this.verkleCrypto,
    })
    if (includeCheckpoints && this.hasCheckpoints()) {
      tree._db.setCheckpoints(this._db.checkpoints)
    }
    return tree
  }

  /**
   * Persists the root hash in the underlying database
   */
  async persistRoot() {
    if (this._opts.useRootPersistence) {
      await this._db.put(ROOT_DB_KEY, this.root())
    }
  }

  /**
   * Finds all nodes that are stored directly in the db
   * (some nodes are stored raw inside other nodes)
   * called by {@link ScratchReadStream}
   * @private
   */
  protected async _findDbNodes(onFound: () => void): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Is the tree during a checkpoint phase?
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
   * Reverts the tree to the state it was at when `checkpoint` was first called.
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
