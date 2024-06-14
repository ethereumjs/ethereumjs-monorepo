import {
  KeyEncoding,
  Lock,
  MapDB,
  ValueEncoding,
  bytesToHex,
  equalsBytes,
  zeros,
} from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'

import { CheckpointDB } from './db/checkpoint.js'
import { InternalNode } from './node/internalNode.js'
import { LeafNode } from './node/leafNode.js'
import { type ChildNode, type VerkleNode } from './node/types.js'
import { decodeNode } from './node/util.js'
import {
  type Proof,
  ROOT_DB_KEY,
  type VerkleTreeOpts,
  type VerkleTreeOptsWithDefaults,
} from './types.js'
import { matchingBytesLength } from './util/index.js'
import { verifyKeyLength } from './util/keys.js'

import type { VerkleCrypto } from './types.js'
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
    db: new MapDB<Uint8Array, Uint8Array>(),
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

    if (opts?.verkleCrypto === undefined) {
      const verkleCrypto = await loadVerkleCrypto()
      if (opts === undefined)
        opts = {
          verkleCrypto,
          db: new MapDB<Uint8Array, Uint8Array>(),
        }
      else {
        opts.verkleCrypto = verkleCrypto
      }
    }

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
   * @returns A Promise that resolves to `Uint8Array` if a value was found or `undefined` if no value was found.
   */
  async get(key: Uint8Array): Promise<Uint8Array | undefined> {
    verifyKeyLength(key)
    const stem = key.slice(0, 31)

    const res = await this.findPath(stem)

    if (res.node instanceof LeafNode) {
      const keyLastByte = key[key.length - 1]

      // The retrieved leaf node contains an array of 256 possible values.
      // The index of the value we want is at the key's last byte
      const value = res.node.getValue(keyLastByte)
      return value
    }

    return
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
    const stem = key.slice(0, 31)
    // A stack of nodes to put/update in the DB once the new leaf node is inserted
    const putStack: [Uint8Array, VerkleNode][] = []
    // Find or create the leaf node
    const res = await this.findPath(stem)
    let leafNode = res.node
    const suffix = key[31]
    if (!(leafNode instanceof LeafNode)) {
      // If leafNode is missing, create it
      const values: Uint8Array[] = new Array(256).fill(new Uint8Array()) // Create new empty array of 256 values
      values[suffix] = value // Set value at key suffix

      // Create leaf node
      leafNode = await LeafNode.create(stem, values, res.stack.length, this.verkleCrypto)
    } else {
      // Found the leaf node so update the value (setValue also updates the commitments)
      leafNode.setValue(suffix, value)
    }

    // Add leaf node to put stack
    putStack.push([stem, leafNode])

    // No stack returned from `findPath` indicates no root node so let's create one
    if (res.stack.length === 0) {
      // Special case where findPath returned early because no root node exists
      // Create a root node
      const rootNode = new InternalNode({
        commitment: this.verkleCrypto.zeroCommitment,
        depth: 0,
        verkleCrypto: this.verkleCrypto,
      })

      // Update the child node's commitment and path
      rootNode.children[key[0]] = { commitment: leafNode.commitment, path: stem }

      // Update root node commitment using a zero commitment hash for the old scalar value (since this is a new root node)
      rootNode.commitment = this.verkleCrypto.updateCommitment(
        rootNode.commitment,
        key[0],
        new Uint8Array(32),
        this.verkleCrypto.hashCommitment(leafNode.commitment)
      )
      // Add root node to put stack
      putStack.push([ROOT_DB_KEY, rootNode])
      // TODO: Move depth check to putStack
      putStack[0][1].depth = 1
      await this.saveStack(putStack)
      // Set trie root to serialized (aka compressed) commitment for later use in verkle proof
      this.root(this.verkleCrypto.serializeCommitment(rootNode.commitment))
      // We're done so return early
      return
    }

    // Walk up the tree from the nearest node to the leaf and update/insert internal nodes along the way

    // Updating inner nodes
    // 1. Update `currentNode` child node commitment to leafnode, commitment of `currentNode`, and depth as needed
    // 2. Walk up result.stack doing the same thing (while inserting new internal nodes as needed and updating lower level node depth as needed)
    // 3. Use `saveStack` to put all nodes in DB
    const currentKey = leafNode.stem
    while (res.stack.length > 0) {
      console.log(res)
      // Pop the last node off the path stack
      const currentNode: VerkleNode = res.stack.pop()!

      const currentDepth = currentNode.depth
      const index = currentKey[0]
      if (currentNode instanceof InternalNode) {
        if (currentDepth === 0) {
          if (res.stack.length > 0)
            throw new Error('cannot have node of depth zero and more nodes in path')
          // We're at the root node and only need to update the child commitment/path
          // using the key and commitment from the last node in the putStack
          if (res.remaining.length === 0) {
            // If we're at depth 0 but the remaining key length is greater than 0,
            // that means theres a partially matching key so there is either an internal
            // or leaf node that partially matches the path of the leaf node we're inserting
            // so we need to update and/or insert internal nodes
            const child: ChildNode = {
              commitment: putStack[putStack.length - 1][1].commitment,
              path: putStack[putStack.length - 1][0],
            }
            currentNode.setChild(index, child)
            putStack.push([ROOT_DB_KEY, currentNode])
            // Update root
            this.root(this.verkleCrypto.serializeCommitment(currentNode.commitment))
            break
          } else {
            // We need to insert a new internal node
            // New internal node's path is the partial stem up to the the `remaining` stem in the previous findPath result
            const partialStem = stem.slice(31 - res.remaining.length)
            const newInternalNode = InternalNode.create(1, this.verkleCrypto)
            // Update leaf node commitment value in new internal node at the
            // byte position immediately after the partial stem
            // e.g. If stem is is 010003... and partial stem is 0100, the leaf node child reference
            // are set at position 3 in the new internal node's children array
            newInternalNode.setChild(stem[partialStem.length], {
              commitment: leafNode.commitment,
              // Path to the leaf node is the full stem
              path: stem,
            })
            // Update new internal node value array with previous child reference
            const oldChild = currentNode.children[partialStem.length]
            // The position of the "old child" in the new internal node children array
            // should be the index equal to the value of the byte in the old child's path at position
            // partialStem.length
            newInternalNode.setChild(oldChild.path[partialStem.length], oldChild)
            putStack.push([partialStem, newInternalNode])

            const child: ChildNode = {
              commitment: newInternalNode.commitment,
              path: partialStem,
            }
            // Current node here is the root node
            currentNode.setChild(index, child)
            putStack.push([ROOT_DB_KEY, currentNode])
          }
        }
        // const child = currentNode.getChildren(index)
        // const matchingKeyLength = matchingBytesLength(child!.path, currentKey)
        // // We have to update the internal node referenced by `child`
      }
    }
    await this.saveStack(putStack)
  }

  /**
   * Tries to find a path to the node for the given key.
   * It returns a `stack` of nodes to the closest node.
   * @param key - the search key
   * @param throwIfMissing - if true, throws if any nodes are missing. Used for verifying proofs. (default: false)
   */
  async findPath(key: Uint8Array): Promise<Path> {
    // TODO: Decide if we should allow keys longer than 31 bytes (since a verkle stem can never be longer than that)
    const result: Path = {
      node: null,
      stack: [],
      remaining: key,
    }
    if (equalsBytes(this.root(), this.EMPTY_TREE_ROOT)) return result

    // Get root node
    let rawNode = await this._db.get(ROOT_DB_KEY)
    if (rawNode === undefined)
      throw new Error('root node should exist when root not empty tree root')

    const rootNode = decodeNode(rawNode, 0, this.verkleCrypto) as InternalNode

    result.stack.push(rootNode)
    let child = rootNode.children[key[0]]

    // Root node doesn't contain a child node's commitment on the first byte of the path so we're done
    if (equalsBytes(child.commitment, this.verkleCrypto.zeroCommitment)) return result
    let finished = false
    while (!finished) {
      rawNode = await this._db.get(child.path)
      // We should always find the node if the path is specified in child.path
      if (rawNode === undefined) throw new Error(`missing node at ${bytesToHex(child.path)}`)
      const decodedNode = decodeNode(rawNode, result.stack.length, this.verkleCrypto)
      // Calculate the index of the last matching byte in the key
      const matchingKeyLength = matchingBytesLength(key, child.path)
      const foundNode = equalsBytes(key, child.path)
      if (foundNode || child.path.length >= key.length || decodedNode instanceof LeafNode) {
        // If the key and child.path are equal, then we found the node
        // If the child.path is the same length or longer than the key but doesn't match it
        // or the found node is a leaf node, we've found another node where this node should
        // be if it existed in the trie
        // i.e. the node doesn't exist in the trie
        finished = true
        if (foundNode) {
          result.node = decodedNode
          result.remaining = new Uint8Array()
          return result
        }
        // We found a different node than the one specified by `key`
        // so the sought node doesn't exist
        result.remaining = key.slice(matchingKeyLength)
        return result
      }
      // Get the next child node in the path
      const childIndex = key[matchingKeyLength]
      child = decodedNode.children[childIndex]
    }
    return result
  }

  /**
   * Creates the initial node from an empty tree.
   * @private
   */

  // TODO: Decide if we keep this.  I currently have this as part of `put`
  protected async _createInitialNode(key: Uint8Array, value: Uint8Array): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Retrieves a node from db by hash.
   */
  // TODO: Decide whether to keep or remove this.  We look up nodes by path/partial path so not sure if we need this or not
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

  // TODO: Decide if we need this.  Looks like it's left over from the MPT `trie` class
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
   * @param putStack - an array of tuples of keys (the partial path of the node in the trie) and nodes (VerkleNodes)
   */

  async saveStack(putStack: [Uint8Array, VerkleNode][]): Promise<void> {
    const opStack = putStack.map(([key, node]) => {
      return {
        type: 'put',
        key,
        value: node.serialize(),
      } as PutBatch
    })
    await this._db.batch(opStack)
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

  // TODO: Decide if we keep or not.
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

  // TODO: Decide if we need this.  We already have the `verifyProof` functionality in the `verkle-cryptography-wasm` functionality
  // and it doesn't require the use of the trie state to verify.
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
