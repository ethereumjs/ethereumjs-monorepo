import {
  KeyEncoding,
  Lock,
  MapDB,
  ValueEncoding,
  bytesToHex,
  equalsBytes,
  intToHex,
  zeros,
} from '@ethereumjs/util'
import debug from 'debug'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'

import { CheckpointDB } from './db/checkpoint.js'
import { InternalNode } from './node/internalNode.js'
import { LeafNode } from './node/leafNode.js'
import { VerkleLeafNodeValue, type VerkleNode } from './node/types.js'
import { createDeletedLeafValue, decodeNode, isLeafNode } from './node/util.js'
import {
  type Proof,
  ROOT_DB_KEY,
  type VerkleTreeOpts,
  type VerkleTreeOptsWithDefaults,
} from './types.js'
import { matchingBytesLength } from './util/index.js'

import type { DB, PutBatch, VerkleCrypto } from '@ethereumjs/util'
import type { Debugger } from 'debug'
interface Path {
  node: VerkleNode | null
  remaining: Uint8Array
  stack: Array<[VerkleNode, Uint8Array]>
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

  /** Debug logging */
  protected DEBUG: boolean
  protected _debug: Debugger = debug('verkle')
  protected debug: (...args: any) => void
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

    this.DEBUG =
      typeof window === 'undefined' ? (process?.env?.DEBUG?.includes('ethjs') ?? false) : false
    this.debug = this.DEBUG
      ? (message: string, namespaces: string[] = []) => {
          let log = this._debug
          for (const name of namespaces) {
            log = log.extend(name)
          }
          log(message)
        }
      : (..._: any) => {}

    this.DEBUG &&
      this.debug(`Trie created:
    || Root: ${bytesToHex(this._root)}
    || Persistent: ${this._opts.useRootPersistence}
    || CacheSize: ${this._opts.cacheSize}
    || ----------------`)
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

    const trie = new VerkleTree(opts)
    await trie._createRootNode()
    return trie
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
      const value = await this._db.get(root)
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
    if (key.length !== 32) throw new Error(`expected key with length 32; got ${key.length}`)
    const stem = key.slice(0, 31)
    const suffix = key[key.length - 1]
    this.DEBUG && this.debug(`Stem: ${bytesToHex(stem)}; Suffix: ${suffix}`, ['GET'])
    const res = await this.findPath(stem)
    if (res.node instanceof LeafNode) {
      // The retrieved leaf node contains an array of 256 possible values.
      // The index of the value we want is at the key's last byte
      const value = res.node.getValue(suffix)
      this.DEBUG &&
        this.debug(`Value: ${value === undefined ? 'undefined' : bytesToHex(value)}`, ['GET'])
      return value
    }

    return
  }

  /**
   * Stores a given `value` at the given `key` or do a delete if `value` is empty Uint8Array
   * @param key - the key to store the value at
   * @param value - the value to store
   * @returns A Promise that resolves once value is stored.
   */
  async put(key: Uint8Array, value: Uint8Array): Promise<void> {
    if (key.length !== 32) throw new Error(`expected key with length 32; got ${key.length}`)
    const stem = key.slice(0, 31)
    const suffix = key[key.length - 1]
    this.DEBUG && this.debug(`Stem: ${bytesToHex(stem)}; Suffix: ${suffix}`, ['PUT'])

    const putStack: [Uint8Array, VerkleNode][] = []
    // Find path to nearest node
    const foundPath = await this.findPath(stem)

    // Sanity check - we should at least get the root node back
    if (foundPath.stack.length === 0) {
      throw new Error(`Root node not found in trie`)
    }

    // Step 1) Create or update the leaf node
    let leafNode: LeafNode
    // First see if leaf node already exists
    if (foundPath.node !== null) {
      // Sanity check to verify we have the right node type
      if (!isLeafNode(foundPath.node)) {
        throw new Error(
          `expected leaf node found at ${bytesToHex(stem)}. Got internal node instead`,
        )
      }
      leafNode = foundPath.node
      // Sanity check to verify we have the right leaf node
      if (!equalsBytes(leafNode.stem, stem)) {
        throw new Error(
          `invalid leaf node found. Expected stem: ${bytesToHex(stem)}; got ${bytesToHex(
            foundPath.node.stem,
          )}`,
        )
      }
    } else {
      // Leaf node doesn't exist, create a new one
      leafNode = await LeafNode.create(stem, this.verkleCrypto)
      this.DEBUG && this.debug(`Creating new leaf node at stem: ${bytesToHex(stem)}`, ['PUT'])
    }
    // Update value in leaf node and push to putStack
    if (equalsBytes(value, createDeletedLeafValue())) {
      // Special case for when the deleted leaf value or zeroes is passed to `put`
      // Writing the deleted leaf value to the suffix indicated in the key
      leafNode.setValue(suffix, VerkleLeafNodeValue.Deleted)
    } else {
      leafNode.setValue(suffix, value)
    }
    this.DEBUG &&
      this.debug(
        `Updating value for suffix: ${suffix} at leaf node with stem: ${bytesToHex(stem)}`,
        ['PUT'],
      )
    putStack.push([leafNode.hash(), leafNode])

    // `path` is the path to the last node pushed to the `putStack`
    let lastPath = leafNode.stem

    // Step 2) Determine if a new internal node is needed
    if (foundPath.stack.length > 1) {
      // Only insert new internal node if we have more than 1 node in the path
      // since a single node indicates only the root node is in the path
      const nearestNodeTuple = foundPath.stack.pop()!
      const nearestNode = nearestNodeTuple[0]
      lastPath = nearestNodeTuple[1]
      const updatedParentTuple = this.updateParent(leafNode, nearestNode, lastPath)
      putStack.push([updatedParentTuple.node.hash(), updatedParentTuple.node])
      lastPath = updatedParentTuple.lastPath

      // Step 3) Walk up trie and update child references in parent internal nodes
      while (foundPath.stack.length > 1) {
        const [nextNode, nextPath] = foundPath.stack.pop()! as [InternalNode, Uint8Array]
        // Compute the child index to be updated on `nextNode`
        const childIndex = lastPath[matchingBytesLength(lastPath, nextPath)]
        // Update child reference
        nextNode.setChild(childIndex, {
          commitment: putStack[putStack.length - 1][1].commitment,
          path: lastPath,
        })
        this.DEBUG &&
          this.debug(
            `Updating child reference for node with path: ${bytesToHex(
              lastPath,
            )} at index ${childIndex} in internal node at path ${bytesToHex(nextPath)}`,
            ['PUT'],
          )
        // Hold onto `path` to current node for updating next parent node child index
        lastPath = nextPath
        putStack.push([nextNode.hash(), nextNode])
      }
    }

    // Step 4) Update root node
    const rootNode = foundPath.stack.pop()![0] as InternalNode
    rootNode.setChild(stem[0], {
      commitment: putStack[putStack.length - 1][1].commitment,
      path: lastPath,
    })
    this.root(this.verkleCrypto.serializeCommitment(rootNode.commitment))
    this.DEBUG &&
      this.debug(
        `Updating child reference for node with path: ${bytesToHex(lastPath)} at index ${
          lastPath[0]
        } in root node`,
        ['PUT'],
      )
    this.DEBUG && this.debug(`Updating root node hash to ${bytesToHex(this._root)}`, ['PUT'])
    putStack.push([this._root, rootNode])
    await this.saveStack(putStack)
  }

  async del(key: Uint8Array): Promise<void> {
    const stem = key.slice(0, 31)
    const suffix = key[key.length - 1]
    this.DEBUG && this.debug(`Stem: ${bytesToHex(stem)}; Suffix: ${suffix}`, ['DEL'])
    await this.put(key, createDeletedLeafValue())
  }
  /**
   * Helper method for updating or creating the parent internal node for a given leaf node
   * @param leafNode the child leaf node that will be referenced by the new/updated internal node
   * returned by this method
   * @param nearestNode the nearest node to the new leaf node
   * @param pathToNode the path to `nearestNode`
   * @returns a tuple of the updated parent node and the path to that parent (i.e. the partial stem of the leaf node that leads to the parent)
   */
  updateParent(
    leafNode: LeafNode,
    nearestNode: VerkleNode,
    pathToNode: Uint8Array,
  ): { node: InternalNode; lastPath: Uint8Array } {
    // Compute the portion of leafNode.stem and nearestNode.path that match (i.e. the partial path closest to leafNode.stem)
    const partialMatchingStemIndex = matchingBytesLength(leafNode.stem, pathToNode)
    let internalNode: InternalNode
    if (isLeafNode(nearestNode)) {
      // We need to create a new internal node and set nearestNode and leafNode as child nodes of it
      // Create new internal node
      internalNode = InternalNode.create(this.verkleCrypto)
      // Set leafNode and nextNode as children of the new internal node
      internalNode.setChild(leafNode.stem[partialMatchingStemIndex], {
        commitment: leafNode.commitment,
        path: leafNode.stem,
      })
      internalNode.setChild(nearestNode.stem[partialMatchingStemIndex], {
        commitment: nearestNode.commitment,
        path: nearestNode.stem,
      })
      // Find the path to the new internal node (the matching portion of the leaf node and next node's stems)
      pathToNode = leafNode.stem.slice(0, partialMatchingStemIndex)
      this.DEBUG &&
        this.debug(`Creating new internal node at path ${bytesToHex(pathToNode)}`, ['PUT'])
    } else {
      // Nearest node is an internal node.  We need to update the appropriate child reference
      // to the new leaf node
      internalNode = nearestNode
      internalNode.setChild(leafNode.stem[partialMatchingStemIndex], {
        commitment: leafNode.commitment,
        path: leafNode.stem,
      })
      this.DEBUG &&
        this.debug(
          `Updating child reference for leaf node with stem: ${bytesToHex(
            leafNode.stem,
          )} at index ${
            leafNode.stem[partialMatchingStemIndex]
          } in internal node at path ${bytesToHex(
            leafNode.stem.slice(0, partialMatchingStemIndex),
          )}`,
          ['PUT'],
        )
    }
    return { node: internalNode, lastPath: pathToNode }
  }
  /**
   * Tries to find a path to the node for the given key.
   * It returns a `stack` of nodes to the closest node.
   * @param key - the search key
   * @param throwIfMissing - if true, throws if any nodes are missing. Used for verifying proofs. (default: false)
   */
  async findPath(key: Uint8Array): Promise<Path> {
    this.DEBUG && this.debug(`Path (${key.length}): [${bytesToHex(key)}]`, ['FIND_PATH'])
    const result: Path = {
      node: null,
      stack: [],
      remaining: key,
    }

    // TODO: Decide if findPath should return an empty stack if we have an empty trie or a path with just the empty root node
    // if (equalsBytes(this.root(), this.EMPTY_TREE_ROOT)) return result

    // Get root node
    let rawNode = await this._db.get(this.root())
    if (rawNode === undefined) throw new Error('root node should exist')

    const rootNode = decodeNode(rawNode, this.verkleCrypto) as InternalNode

    this.DEBUG && this.debug(`Starting with Root Node: [${bytesToHex(this.root())}]`, ['FIND_PATH'])
    result.stack.push([rootNode, this.root()])
    let child = rootNode.children[key[0]]

    // Root node doesn't contain a child node's commitment on the first byte of the path so we're done
    if (child === null) {
      this.DEBUG && this.debug(`Partial Path ${intToHex(key[0])} - found no child.`, ['FIND_PATH'])
      return result
    }
    let finished = false
    while (!finished) {
      // Look up child node by node hash
      rawNode = await this._db.get(this.verkleCrypto.hashCommitment(child.commitment))
      // We should always find the node if the path is specified in child.path
      if (rawNode === undefined) throw new Error(`missing node at ${bytesToHex(child.path)}`)
      const decodedNode = decodeNode(rawNode, this.verkleCrypto)

      // Calculate the index of the last matching byte in the key
      const matchingKeyLength = matchingBytesLength(key, child.path)
      const foundNode = equalsBytes(key, child.path)
      if (foundNode || child.path.length >= key.length || isLeafNode(decodedNode)) {
        // If the key and child.path are equal, then we found the node
        // If the child.path is the same length or longer than the key but doesn't match it
        // or the found node is a leaf node, we've found another node where this node should
        // be if it existed in the trie
        // i.e. the node doesn't exist in the trie
        finished = true
        if (foundNode) {
          this.DEBUG &&
            this.debug(
              `Path ${bytesToHex(key)} - found full path to node ${bytesToHex(
                decodedNode.hash(),
              )}.`,
              ['FIND_PATH'],
            )
          result.node = decodedNode
          result.remaining = new Uint8Array()
          return result
        }
        // We found a different node than the one specified by `key`
        // so the sought node doesn't exist
        result.remaining = key.slice(matchingKeyLength)
        const pathToNearestNode = isLeafNode(decodedNode) ? decodedNode.stem : child.path
        this.DEBUG &&
          this.debug(
            `Path ${bytesToHex(pathToNearestNode)} - found path to nearest node ${bytesToHex(
              decodedNode.hash(),
            )} but target node not found.`,
            ['FIND_PATH'],
          )
        result.stack.push([decodedNode, pathToNearestNode])
        return result
      }
      // Push internal node to path stack
      result.stack.push([decodedNode, key.slice(0, matchingKeyLength)])
      this.DEBUG &&
        this.debug(
          `Partial Path ${bytesToHex(
            key.slice(0, matchingKeyLength),
          )} - found next node in path ${bytesToHex(decodedNode.hash())}.`,
          ['FIND_PATH'],
        )
      // Get the next child node in the path
      const childIndex = key[matchingKeyLength]
      child = decodedNode.children[childIndex]
    }
    this.DEBUG &&
      this.debug(
        `Found partial path ${key.slice(
          31 - result.remaining.length,
        )} but sought node is not present in trie.`,
        ['FIND_PATH'],
      )
    return result
  }

  /**
   * Create empty root node for initializing an empty tree.
   * @private
   */

  protected async _createRootNode(): Promise<void> {
    const rootNode = new InternalNode({
      commitment: this.verkleCrypto.zeroCommitment,
      verkleCrypto: this.verkleCrypto,
    })

    this.DEBUG && this.debug(`No root node. Creating new root node`, ['INITIALIZE'])
    // Set trie root to serialized (aka compressed) commitment for later use in verkle proof
    this.root(this.verkleCrypto.serializeCommitment(rootNode.commitment))
    await this.saveStack([[this.root(), rootNode]])
    return
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
   * Saves the nodes from a proof into the tree.
   * @param proof
   */
  async fromProof(_proof: Proof): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Creates a proof from a tree and key that can be verified using {@link VerkleTree.verifyProof}.
   * @param key
   */
  async createProof(_key: Uint8Array): Promise<Proof> {
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
    _rootHash: Uint8Array,
    _key: Uint8Array,
    _proof: Proof,
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
