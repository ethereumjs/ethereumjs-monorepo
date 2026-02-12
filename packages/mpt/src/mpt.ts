// Some more secure presets when using e.g. JS `call`
'use strict'

import { RLP } from '@ethereumjs/rlp'
import {
  BIGINT_0,
  EthereumJSErrorWithoutCode,
  KeyEncoding,
  Lock,
  MapDB,
  RLP_EMPTY_STRING,
  ValueEncoding,
  bytesToBigInt,
  bytesToHex,
  bytesToUnprefixedHex,
  bytesToUtf8,
  concatBytes,
  equalsBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import debug from 'debug'

import { CheckpointDB } from './db/checkpointDB.ts'
import {
  BranchMPTNode,
  ExtensionMPTNode,
  LeafMPTNode,
  decodeMPTNode,
  decodeRawMPTNode,
  isRawMPTNode,
} from './node/index.ts'
import { ROOT_DB_KEY } from './types.ts'
import { _walkTrie } from './util/asyncWalk.ts'
import { bytesToNibbles, matchingNibbleLength, nibblesTypeToPackedBytes } from './util/nibbles.ts'
import { WalkController } from './util/walkController.ts'

import type { BatchDBOp, DB } from '@ethereumjs/util'
import type { Debugger } from 'debug'
import type {
  BranchMPTNodeBranchValue,
  FoundNodeFunction,
  MPTNode,
  MPTOpts,
  MPTOptsWithDefaults,
  Nibbles,
  NodeReferenceOrRawMPTNode,
  Path,
  TrieShallowCopyOpts,
} from './types.ts'
import type { OnFound } from './util/asyncWalk.ts'

/**
 * The basic trie interface, use with `import { MerklePatriciaTrie } from '@ethereumjs/mpt'`.
 *
 * A MerklePatriciaTrie object can be created with the constructor method:
 *
 * - {@link createMPT}
 *
 * A sparse MerklePatriciaTrie object can be created from a merkle proof:
 *
 * - {@link createMPTFromProof}
 */
/**
 * Merkle Patricia Trie - a space-optimized trie where each node with only one child
 * is merged with its parent. Used for Ethereum state and storage.
 *
 * Node types:
 * - Branch: 16-way branch + optional value (for keys ending at this node)
 * - Extension: short path (nibbles) → child node
 * - Leaf: remaining path (nibbles) → value
 */
export class MerklePatriciaTrie {
  /** Options with defaults applied */
  protected readonly _opts: MPTOptsWithDefaults = {
    useKeyHashing: false,
    useKeyHashingFunction: keccak_256,
    keyPrefix: undefined,
    useRootPersistence: false,
    useNodePruning: false,
    cacheSize: 0,
    valueEncoding: ValueEncoding.String,
  }

  /** The root for an empty trie */
  EMPTY_TRIE_ROOT: Uint8Array

  /** The backend DB */
  protected _db!: CheckpointDB
  protected _hashLen: number
  protected _lock = new Lock()
  protected _root: Uint8Array

  /** Debug logging */
  protected DEBUG: boolean
  protected _debug: Debugger = debug('mpt:#')
  protected debug: (...args: any) => void

  /**
   * Creates a new trie.
   * @param opts Options for instantiating the trie
   *
   * Note: in most cases, {@link createMPT} constructor should be used.  It uses the same API but provides sensible defaults
   */
  constructor(opts?: MPTOpts) {
    if (opts?.valueEncoding !== undefined && opts.db === undefined) {
      throw EthereumJSErrorWithoutCode('`valueEncoding` can only be set if a `db` is provided')
    }
    if (opts !== undefined) {
      this._opts = { ...this._opts, ...opts }
      this._opts.useKeyHashingFunction =
        opts.common?.customCrypto.keccak256 ?? opts.useKeyHashingFunction ?? keccak_256
    }
    const valueEncoding =
      opts?.db !== undefined ? (opts.valueEncoding ?? ValueEncoding.String) : ValueEncoding.Bytes

    this.DEBUG =
      typeof window === 'undefined' ? (process?.env?.DEBUG?.includes('ethjs') ?? false) : false
    this.debug = this.DEBUG
      ? (message: string, namespaces: string[] = []) => {
          let logger = this._debug
          for (const namespace of namespaces) {
            logger = logger.extend(namespace)
          }
          logger(message)
        }
      : (..._args: unknown[]) => {}

    this.database(opts?.db ?? new MapDB<string, Uint8Array>(), valueEncoding)

    this.EMPTY_TRIE_ROOT = this.hash(RLP_EMPTY_STRING)
    this._hashLen = this.EMPTY_TRIE_ROOT.length
    this._root = this.EMPTY_TRIE_ROOT

    if (opts?.root) {
      this.root(opts.root)
    }
    this.DEBUG &&
      this.debug(`Trie created:
    || Root: ${bytesToHex(this.root())}
    || Secure: ${this._opts.useKeyHashing}
    || Persistent: ${this._opts.useRootPersistence}
    || Pruning: ${this._opts.useNodePruning}
    || CacheSize: ${this._opts.cacheSize}
    || ----------------`)
  }

  database(db?: DB<string, string | Uint8Array>, valueEncoding?: ValueEncoding) {
    if (db !== undefined) {
      if (db instanceof CheckpointDB) {
        throw EthereumJSErrorWithoutCode('Cannot pass in an instance of CheckpointDB')
      }

      this._db = new CheckpointDB({ db, cacheSize: this._opts.cacheSize, valueEncoding })
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
      this.DEBUG && this.debug(`Setting root to ${bytesToHex(value)}`)
      if (value.length !== this._hashLen) {
        throw EthereumJSErrorWithoutCode(
          `Invalid root length. Roots are ${this._hashLen} bytes, got ${value.length} bytes`,
        )
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
  async get(key: Uint8Array, throwIfMissing = false): Promise<Uint8Array | null> {
    this.DEBUG && this.debug(`Key: ${bytesToHex(key)}`, ['get'])
    const { node, remaining } = await this.findPath(this.appliedKey(key), throwIfMissing)
    let value: Uint8Array | null = null
    if (node && remaining.length === 0) {
      value = node.value()
    }
    this.DEBUG && this.debug(`Value: ${value === null ? 'null' : bytesToHex(value)}`, ['get'])
    return value
  }

  /**
   * Stores a given `value` at the given `key` or do a delete if `value` is empty
   * (delete operations are only executed on DB with `deleteFromDB` set to `true`)
   * @param key
   * @param value
   * @returns A Promise that resolves once value is stored.
   */
  async put(
    key: Uint8Array,
    value: Uint8Array | null,
    skipKeyTransform: boolean = false,
  ): Promise<void> {
    this.DEBUG && this.debug(`Key: ${bytesToHex(key)}`, ['put'])
    this.DEBUG && this.debug(`Value: ${value === null ? 'null' : bytesToHex(value)}`, ['put'])
    if (this._opts.useRootPersistence && equalsBytes(key, ROOT_DB_KEY)) {
      throw EthereumJSErrorWithoutCode(
        `Attempted to set '${bytesToUtf8(ROOT_DB_KEY)}' key but it is not allowed.`,
      )
    }

    // If value is empty, delete
    if (value === null || value.length === 0) {
      return this.del(key)
    }

    await this._lock.acquire()
    const appliedKey = skipKeyTransform ? key : this.appliedKey(key)
    if (equalsBytes(this.root(), this.EMPTY_TRIE_ROOT)) {
      await this._createInitialNode(appliedKey, value)
    } else {
      const { remaining, stack } = await this.findPath(appliedKey)
      let ops: BatchDBOp[] = []
      if (this._opts.useNodePruning) {
        const val = await this.get(key)
        // Only delete keys if it either does not exist, or if it gets updated
        // (The update will update the hash of the node, thus we can delete the original leaf node)
        if (val === null || !equalsBytes(val, value)) {
          ops = this._createPruneDeleteOps(stack)
        }
      }
      // then update
      await this._updateNode(appliedKey, value, remaining, stack)
      if (this._opts.useNodePruning) {
        // Only after updating the node we can delete the keyHashes
        await this._db.batch(ops)
      }
    }
    await this.persistRoot()
    this._lock.release()
  }

  /**
   * Deletes a value given a `key` from the trie
   * (delete operations are only executed on DB with `deleteFromDB` set to `true`)
   * @param key
   * @returns A Promise that resolves once value is deleted.
   */
  async del(key: Uint8Array, skipKeyTransform: boolean = false): Promise<void> {
    this.DEBUG && this.debug(`Key: ${bytesToHex(key)}`, ['del'])
    await this._lock.acquire()
    const appliedKey = skipKeyTransform ? key : this.appliedKey(key)
    const { node, stack } = await this.findPath(appliedKey)

    let ops: BatchDBOp[] = []
    // Only delete if the `key` currently has any value
    if (this._opts.useNodePruning && node !== null) {
      ops = this._createPruneDeleteOps(stack)
    }
    if (node) {
      await this._deleteNode(appliedKey, stack)
    }
    if (this._opts.useNodePruning) {
      // Only after deleting the node it is possible to delete the keyHashes
      await this._db.batch(ops)
    }
    await this.persistRoot()
    this._lock.release()
  }

  // ─── Path finding ───────────────────────────────────────────────────────────

  /**
   * Finds the path from root to the node for the given key.
   * Walks the trie, matching nibbles at each level. Returns the target node (if found)
   * and the stack of nodes along the path (needed for updates/deletes).
   *
   * @param key - the search key (bytes)
   * @param throwIfMissing - if true, throws when nodes are missing (e.g. proof verification)
   * @param partialPath - optional pre-loaded stack for resuming from a mid-path node
   */
  async findPath(
    key: Uint8Array,
    throwIfMissing = false,
    partialPath: {
      stack: MPTNode[]
    } = {
      stack: [],
    },
  ): Promise<Path> {
    const targetKey = bytesToNibbles(key)
    const keyLen = targetKey.length
    const stack: MPTNode[] = Array.from({ length: keyLen })

    // Pre-fill stack from partialPath when resuming a previous walk
    let pathProgress = 0
    for (let stackIndex = 0; stackIndex < partialPath.stack.length - 1; stackIndex++) {
      stack[stackIndex] = partialPath.stack[stackIndex]
      pathProgress +=
        stack[stackIndex] instanceof BranchMPTNode
          ? 1
          : (stack[stackIndex] as ExtensionMPTNode).keyLength()
    }

    this.DEBUG && this.debug(`Target (${targetKey.length}): [${targetKey}]`, ['find_path'])
    let result: Path | null = null

    const onFound: FoundNodeFunction = async (
      _nodeRef,
      node,
      currentKeyNibbles,
      walkController,
    ) => {
      stack[pathProgress] = node as MPTNode

      if (node instanceof BranchMPTNode) {
        if (pathProgress === keyLen) {
          result = { node, remaining: [], stack }
        } else {
          const branchIndex = targetKey[pathProgress]
          const branchNode = node.getBranch(branchIndex)
          this.DEBUG &&
            this.debug(
              branchNode === null
                ? 'NULL'
                : `Branch ${branchIndex}: ${branchNode instanceof Uint8Array ? bytesToHex(branchNode) : 'raw'}`,
              ['find_path', 'branch_node'],
            )
          if (!branchNode) {
            result = { node: null, remaining: targetKey.slice(pathProgress), stack }
          } else {
            pathProgress++
            walkController.onlyBranchIndex(node, currentKeyNibbles, branchIndex)
          }
        }
      } else if (node instanceof LeafMPTNode) {
        const leafStartProgress = pathProgress
        if (keyLen - pathProgress > node.key().length) {
          result = { node: null, remaining: targetKey.slice(leafStartProgress), stack }
          return
        }
        for (const nibble of node.key()) {
          if (nibble !== targetKey[pathProgress]) {
            result = { node: null, remaining: targetKey.slice(leafStartProgress), stack }
            return
          }
          pathProgress++
        }
        result = { node, remaining: [], stack }
      } else if (node instanceof ExtensionMPTNode) {
        const extensionStartProgress = pathProgress
        this.DEBUG &&
          this.debug(
            `Extension key: [${node.key()}] vs expected [${targetKey.slice(pathProgress, pathProgress + node.key().length)}]`,
            ['find_path', 'extension_node'],
          )
        for (const nibble of node.key()) {
          if (nibble !== targetKey[pathProgress]) {
            result = { node: null, remaining: targetKey.slice(extensionStartProgress), stack }
            return
          }
          pathProgress++
        }
        walkController.allChildren(node, currentKeyNibbles)
      }
    }
    const startingNode = partialPath.stack[partialPath.stack.length - 1]
    const start = startingNode !== undefined ? this.hash(startingNode.serialize()) : this.root()
    try {
      this.DEBUG &&
        this.debug(
          `Walking trie from ${startingNode === undefined ? 'ROOT' : 'NODE'}: ${bytesToHex(start)}`,
          ['find_path'],
        )
      await this.walkTrie(start, onFound)
    } catch (error: any) {
      if (error.message !== 'Missing node in DB' || throwIfMissing) {
        throw error
      }
    }

    if (result === null) {
      result = { node: null, remaining: [], stack }
    }
    this.DEBUG &&
      this.debug(
        result.node !== null
          ? `Target Node FOUND for ${bytesToNibbles(key)}`
          : `Target Node NOT FOUND`,
        ['find_path'],
      )

    result.stack = result.stack.filter((stackEntry) => stackEntry !== undefined)
    this.DEBUG &&
      this.debug(
        `Result:
        || Node: ${result.node === null ? 'null' : result.node.constructor.name}
        || Remaining: [${result.remaining}]\n|| Stack: ${result.stack
          .map((stackEntry) => stackEntry.constructor.name)
          .join(', ')}`,
        ['find_path'],
      )
    return result
  }

  /**
   * Walks a trie until finished.
   * @param root
   * @param onFound - callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves.
   * @returns Resolves when finished walking trie.
   */
  async walkTrie(root: Uint8Array, onFound: FoundNodeFunction): Promise<void> {
    await WalkController.newWalk(onFound, this, root)
  }

  walkTrieIterable = _walkTrie.bind(this)

  /**
   * Executes a callback for each node in the trie.
   * @param onFound - callback to call when a node is found.
   * @returns Resolves when finished walking trie.
   */
  async walkAllNodes(onFound: OnFound): Promise<void> {
    for await (const { node, currentKey } of this.walkTrieIterable(this.root())) {
      await onFound(node, currentKey)
    }
  }

  /**
   * Executes a callback for each value node in the trie.
   * @param onFound - callback to call when a node is found.
   * @returns Resolves when finished walking trie.
   */
  async walkAllValueNodes(onFound: OnFound): Promise<void> {
    for await (const { node, currentKey } of this.walkTrieIterable(
      this.root(),
      [],
      undefined,
      async (node) => {
        return (
          node instanceof LeafMPTNode || (node instanceof BranchMPTNode && node.value() !== null)
        )
      },
    )) {
      await onFound(node, currentKey)
    }
  }

  // ─── Node persistence (internal) ─────────────────────────────────────────────

  /**
   * Creates the initial leaf node when inserting into an empty trie.
   * @private
   */
  protected async _createInitialNode(key: Uint8Array, value: Uint8Array): Promise<void> {
    const newNode = new LeafMPTNode(bytesToNibbles(key), value)

    const encoded = newNode.serialize()
    this.root(this.hash(encoded))
    await this._db.put(this._getDbKey(this.root()), encoded)
    await this.persistRoot()
  }

  /**
   * Retrieves a node from db by hash.
   */
  async lookupNode(node: Uint8Array | Uint8Array[]): Promise<MPTNode> {
    if (isRawMPTNode(node)) {
      const decoded = decodeRawMPTNode(node)
      this.DEBUG && this.debug(`${decoded.constructor.name}`, ['lookup_node', 'raw_node'])
      return decoded
    }
    this.DEBUG && this.debug(`${bytesToHex(node)}`, ['lookup_node', 'by_hash'])
    const value = (await this._db.get(this._getDbKey(node))) ?? null

    if (value === null) {
      // Dev note: this error message text is used for error checking in `checkRoot`, `verifyMPTWithMerkleProof`, and `findPath`
      throw EthereumJSErrorWithoutCode('Missing node in DB')
    }

    const decoded = decodeMPTNode(value)
    this.DEBUG && this.debug(`${decoded.constructor.name} found in DB`, ['lookup_node', 'by_hash'])
    return decoded
  }

  /**
   * True when we're updating an existing leaf value (key already exists, no structural change).
   * @private
   */
  protected _isMatchingLeafUpdate(
    lastNode: MPTNode,
    stack: MPTNode[],
    fullKeyNibbles: Nibbles,
    keyRemainder: Nibbles,
  ): boolean {
    if (!(lastNode instanceof LeafMPTNode) || keyRemainder.length !== 0) {
      return false
    }
    let keyOffset = 0
    for (const stackNode of stack) {
      keyOffset += stackNode instanceof BranchMPTNode ? 1 : stackNode.key().length
    }
    return (
      matchingNibbleLength(lastNode.key(), fullKeyNibbles.slice(keyOffset)) ===
      lastNode.key().length
    )
  }

  /**
   * Applies a value update given the path from findPath. Modifies the stack in-place
   * to represent the new structure, then calls saveStack to persist.
   *
   * Three cases:
   * 1. Match leaf: key exists, just update value (no structure change)
   * 2. Branch: add new leaf to branch, or set branch value
   * 3. Extension/Leaf with diverging path: create new branch at divergence, re-hang old + new leaf
   *
   * @private
   */
  protected async _updateNode(
    keyBytes: Uint8Array,
    value: Uint8Array,
    keyRemainder: Nibbles,
    stack: MPTNode[],
  ): Promise<void> {
    const opStack: BatchDBOp[] = []
    const lastNode = stack.pop()
    if (!lastNode) {
      throw EthereumJSErrorWithoutCode('Stack underflow')
    }

    const fullKeyNibbles = bytesToNibbles(keyBytes)
    const matchLeaf = this._isMatchingLeafUpdate(lastNode, stack, fullKeyNibbles, keyRemainder)

    if (matchLeaf) {
      // Case 1: Key already exists at this leaf – update value in place
      lastNode.value(value)
      stack.push(lastNode)
    } else if (lastNode instanceof BranchMPTNode) {
      // Case 2: Insert into branch – either new leaf on empty slot or set branch value
      stack.push(lastNode)
      if (keyRemainder.length !== 0) {
        keyRemainder.shift()
        stack.push(new LeafMPTNode(keyRemainder, value))
      } else {
        lastNode.value(value)
      }
    } else {
      // Case 3: Last node is Extension or Leaf – path diverges. Create branch at divergence point
      const lastKey = lastNode.key()
      const matchingLength = matchingNibbleLength(lastKey, keyRemainder)
      const newBranchMPTNode = new BranchMPTNode()

      if (matchingLength !== 0) {
        const newExtNode = new ExtensionMPTNode(lastNode.key().slice(0, matchingLength), value)
        stack.push(newExtNode)
        lastKey.splice(0, matchingLength)
        keyRemainder.splice(0, matchingLength)
      }

      stack.push(newBranchMPTNode)

      if (lastKey.length !== 0) {
        const branchKey = lastKey.shift()!
        if (lastKey.length !== 0 || lastNode instanceof LeafMPTNode) {
          lastNode.key(lastKey)
          const formattedNode = this._formatNode(
            lastNode,
            false,
            opStack,
          ) as NodeReferenceOrRawMPTNode
          newBranchMPTNode.setBranch(branchKey, formattedNode)
        } else {
          this._formatNode(lastNode, false, opStack, true)
          newBranchMPTNode.setBranch(branchKey, lastNode.value())
        }
      } else {
        newBranchMPTNode.value(lastNode.value())
      }

      if (keyRemainder.length !== 0) {
        keyRemainder.shift()
        stack.push(new LeafMPTNode(keyRemainder, value))
      } else {
        newBranchMPTNode.value(value)
      }
    }

    await this.saveStack(fullKeyNibbles, stack, opStack)
  }

  /**
   * Removes a key from the trie. Handles two main cases:
   * - Deleting from a leaf: remove leaf, possibly collapse parent branch
   * - Deleting from a branch value: clear value, possibly collapse if branch has single child
   *
   * When a branch ends up with only one child after deletion, we collapse it into
   * an extension (or merge with parent extension) to keep the trie minimal.
   *
   * @private
   */
  protected async _deleteNode(keyBytes: Uint8Array, stack: MPTNode[]): Promise<void> {
    /**
     * Collapses a branch with one child into a simpler structure.
     * Parent can be: Branch (branch→branch), Extension (ext→branch), or null (branch is root).
     */
    const collapseBranchWithOneChild = (
      pathNibbles: Nibbles,
      branchIndex: number,
      childNode: MPTNode,
      parentNode: MPTNode | null | undefined,
      nodeStack: MPTNode[],
    ): Nibbles => {
      const parentIsBranchOrRoot =
        parentNode === null || parentNode === undefined || parentNode instanceof BranchMPTNode

      if (parentIsBranchOrRoot) {
        if (parentNode instanceof BranchMPTNode) nodeStack.push(parentNode)
        if (childNode instanceof BranchMPTNode) {
          const extensionNode = new ExtensionMPTNode([branchIndex], new Uint8Array())
          nodeStack.push(extensionNode)
          pathNibbles.push(branchIndex)
        } else {
          const childNodeKey = childNode.key()
          childNodeKey.unshift(branchIndex)
          childNode.key(childNodeKey.slice(0))
          nodeStack.push(childNode)
          return pathNibbles.concat(childNodeKey)
        }
        nodeStack.push(childNode)
        return pathNibbles
      }

      if (!(parentNode instanceof ExtensionMPTNode)) {
        throw EthereumJSErrorWithoutCode('Expected extension node')
      }
      const parentKey = parentNode.key()
      if (childNode instanceof BranchMPTNode) {
        parentKey.push(branchIndex)
        pathNibbles.push(branchIndex)
        parentNode.key(parentKey)
        nodeStack.push(parentNode)
      } else {
        const childNodeKey = childNode.key()
        childNodeKey.unshift(branchIndex)
        const fullPath = parentKey.concat(childNodeKey)
        childNode.key(fullPath)
        nodeStack.push(childNode)
        return pathNibbles.concat(childNodeKey)
      }
      nodeStack.push(childNode)
      return pathNibbles
    }

    let lastNode = stack.pop()
    if (lastNode === undefined) throw EthereumJSErrorWithoutCode('missing last node')
    let parentNode = stack.pop()
    const opStack: BatchDBOp[] = []
    let pathNibbles = bytesToNibbles(keyBytes)

    if (parentNode === undefined) {
      this.root(this.EMPTY_TRIE_ROOT)
      return
    }

    if (lastNode instanceof BranchMPTNode) {
      lastNode.value(null)
    } else {
      // Deleting a leaf: remove it from parent branch, then consider collapsing
      if (!(parentNode instanceof BranchMPTNode)) {
        throw EthereumJSErrorWithoutCode('Expected branch node')
      }
      const lastNodeKey = lastNode.key()
      pathNibbles.splice(pathNibbles.length - lastNodeKey.length)
      this._formatNode(lastNode, false, opStack, true)
      parentNode.setBranch(pathNibbles.pop()!, null)
      lastNode = parentNode
      parentNode = stack.pop()
    }

    const branchNodes: [number, NodeReferenceOrRawMPTNode][] = lastNode.getChildren()

    if (branchNodes.length === 1) {
      // add the one remaining branch node to node above it
      const branchNode = branchNodes[0][1]
      const branchNodeKey = branchNodes[0][0]

      // Special case where one needs to delete an extra node:
      // In this case, after updating the branch, the branch node has just one branch left
      // However, this violates the trie spec; this should be converted in either an ExtensionMPTNode
      // Or a LeafMPTNode
      // Since this branch is deleted, one can thus also delete this branch from the DB
      // So add this to the `opStack` and mark the keyHash to be deleted
      if (this._opts.useNodePruning) {
        // If the branchNode has length < 32, it will be a RawNode (Uint8Array[]) instead of a Uint8Array
        // In that case, we need to serialize and hash it into a Uint8Array, otherwise the operation will throw
        const hashToDelete = isRawMPTNode(branchNode)
          ? this.hash(RLP.encode(branchNode))
          : branchNode
        opStack.push({ type: 'del', key: this._getDbKey(hashToDelete) })
      }

      // look up node
      const foundNode = await this.lookupNode(branchNode)
      pathNibbles = collapseBranchWithOneChild(
        pathNibbles,
        branchNodeKey,
        foundNode,
        parentNode as MPTNode,
        stack,
      )
      await this.saveStack(pathNibbles, stack, opStack)
    } else {
      // Branch has multiple children: just persist the updated branch
      if (parentNode) {
        stack.push(parentNode)
      }

      stack.push(lastNode)
      await this.saveStack(pathNibbles, stack, opStack)
    }
  }

  /**
   * Persists the modified node stack to the DB. Processes nodes from leaf toward root,
   * wiring each node's references (extension value, branch slot) to its child's hash.
   *
   * @param key - nibble path that corresponds to the stack
   * @param stack - nodes from findPath/update, bottom (leaf) to top (root)
   * @param opStack - put/del operations accumulated by _formatNode
   */
  async saveStack(pathNibbles: Nibbles, stack: MPTNode[], opStack: BatchDBOp[]): Promise<void> {
    let childHash: Uint8Array | undefined

    while (stack.length > 0) {
      const node = stack.pop()
      if (node === undefined) {
        throw EthereumJSErrorWithoutCode('saveStack: missing node')
      }
      if (node instanceof LeafMPTNode || node instanceof ExtensionMPTNode) {
        pathNibbles.splice(pathNibbles.length - node.key().length)
      }
      if (node instanceof ExtensionMPTNode && childHash !== undefined) {
        node.value(childHash)
      }
      if (node instanceof BranchMPTNode && childHash !== undefined) {
        const branchIndex = pathNibbles.pop()
        node.setBranch(branchIndex!, childHash)
      }
      childHash = this._formatNode(node, stack.length === 0, opStack) as Uint8Array
    }

    if (childHash !== undefined) {
      this.root(childHash)
    }
    await this._db.batch(opStack)
    await this.persistRoot()
  }

  /**
   * Serializes a node and either stores it (put) or schedules removal (del).
   * Nodes ≥32 bytes (or top-level) are hashed and stored; smaller nodes are inlined as raw.
   *
   * @param node - the node to persist
   * @param topLevel - if true, always store (root must be in DB)
   * @param opStack - accumulates put/del operations for batch commit
   * @param remove - if true, schedule del (used when pruning)
   * @returns hash (for references) or raw encoding (for inline)
   */
  _formatNode(
    node: MPTNode,
    topLevel: boolean,
    opStack: BatchDBOp[],
    remove: boolean = false,
  ): Uint8Array | NodeReferenceOrRawMPTNode | BranchMPTNodeBranchValue[] {
    const encoded = node.serialize()

    if (encoded.length >= 32 || topLevel) {
      const nodeHash = this.hash(encoded)
      const dbKey = this._getDbKey(nodeHash)

      if (remove) {
        if (this._opts.useNodePruning) {
          opStack.push({ type: 'del', key: dbKey })
        }
      } else {
        opStack.push({ type: 'put', key: dbKey, value: encoded })
      }
      return nodeHash
    }

    return node.raw()
  }

  /**
   * The given hash of operations (key additions or deletions) are executed on the trie
   * (delete operations are only executed on DB with `deleteFromDB` set to `true`)
   * @example
   * const ops = [
   *    { type: 'del', key: Uint8Array.from('father') }
   *  , { type: 'put', key: Uint8Array.from('name'), value: Uint8Array.from('Yuri Irsenovich Kim') } // cspell:disable-line
   *  , { type: 'put', key: Uint8Array.from('dob'), value: Uint8Array.from('16 February 1941') }
   *  , { type: 'put', key: Uint8Array.from('spouse'), value: Uint8Array.from('Kim Young-sook') } // cspell:disable-line
   *  , { type: 'put', key: Uint8Array.from('occupation'), value: Uint8Array.from('Clown') }
   * ]
   * await trie.batch(ops)
   * @param ops
   */
  async batch(ops: BatchDBOp[], skipKeyTransform?: boolean): Promise<void> {
    for (const op of ops) {
      if (op.type === 'put') {
        if (op.value === null || op.value === undefined) {
          throw EthereumJSErrorWithoutCode('Invalid batch db operation')
        }
        await this.put(op.key, op.value, skipKeyTransform)
      } else if (op.type === 'del') {
        await this.del(op.key, skipKeyTransform)
      }
    }
    await this.persistRoot()
  }

  /**
   * Verifies that every key in the DB is reachable from the root. Used to ensure
   * pruning is correct – unreachable keys indicate a bug or corrupt state.
   */
  async verifyPrunedIntegrity(): Promise<boolean> {
    // Using deprecated bytesToUnprefixedHex for performance: used for string comparisons with database keys.
    const roots = [
      bytesToUnprefixedHex(this.root()),
      bytesToUnprefixedHex(this.appliedKey(ROOT_DB_KEY)),
    ]
    for (const dbKeyHex of (this._db.db as any)._database.keys()) {
      if (roots.includes(dbKeyHex)) {
        // The root key can never be found from the trie, otherwise this would
        // convert the tree from a directed acyclic graph to a directed cycling graph
        continue
      }

      // Track if key is found
      let found = false
      try {
        await this.walkTrie(this.root(), async (_, node, currentKeyNibbles, walkController) => {
          if (found) return
          if (node instanceof BranchMPTNode) {
            for (const branchRef of node._branches) {
              if (
                branchRef !== null &&
                bytesToUnprefixedHex(
                  isRawMPTNode(branchRef)
                    ? walkController.trie.appliedKey(RLP.encode(branchRef))
                    : branchRef,
                ) === dbKeyHex
              ) {
                found = true
                return
              }
            }
            walkController.allChildren(node, currentKeyNibbles)
          }
          if (node instanceof ExtensionMPTNode) {
            if (bytesToUnprefixedHex(node.value()) === dbKeyHex) {
              found = true
              return
            }
            walkController.allChildren(node, currentKeyNibbles)
          }
        })
      } catch {
        return false
      }
      if (!found) {
        return false
      }
    }
    return true
  }

  /**
   * Returns a copy of the underlying trie.
   *
   * Note on db: the copy will create a reference to the
   * same underlying database.
   *
   * Note on cache: for memory reasons a copy will by default
   * not recreate a new LRU cache but initialize with cache
   * being deactivated. This behavior can be overwritten by
   * explicitly setting `cacheSize` as an option on the method.
   *
   * @param includeCheckpoints - If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.
   */
  shallowCopy(includeCheckpoints = true, opts?: TrieShallowCopyOpts): MerklePatriciaTrie {
    const trie = new MerklePatriciaTrie({
      ...this._opts,
      db: this._db.db.shallowCopy(),
      root: this.root(),
      cacheSize: 0,
      ...(opts ?? {}),
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
      this.DEBUG &&
        this.debug(
          `Persisting root: \n|| RootHash: ${bytesToHex(this.root())}\n|| RootKey: ${bytesToHex(
            this.appliedKey(ROOT_DB_KEY),
          )}`,
          ['persist_root'],
        )
      await this._db.put(this._getDbKey(this.appliedKey(ROOT_DB_KEY)), this.root())
    }
  }

  /**
   * Finds all nodes that are stored directly in the db
   * (some nodes are stored raw inside other nodes)
   * called by {@link ScratchReadStream}
   * @private
   */
  protected async _findDbNodes(onFound: FoundNodeFunction): Promise<void> {
    const outerOnFound: FoundNodeFunction = async (nodeRef, node, key, walkController) => {
      if (isRawMPTNode(nodeRef)) {
        if (node !== null) {
          walkController.allChildren(node, key)
        }
      } else {
        onFound(nodeRef, node, key, walkController)
      }
    }
    await this.walkTrie(this.root(), outerOnFound)
  }

  // ─── DB helpers ─────────────────────────────────────────────────────────────

  /** Applies keyPrefix to a hash when multiple tries share a DB. */
  protected _getDbKey(hash: Uint8Array): Uint8Array {
    return this._opts.keyPrefix ? concatBytes(this._opts.keyPrefix, hash) : hash
  }

  /** Builds del ops for nodes that will be replaced (pruning). */
  protected _createPruneDeleteOps(stack: MPTNode[]): BatchDBOp[] {
    return stack.map((node) => {
      const deletedHash = this.hash(node.serialize())
      return {
        type: 'del' as const,
        key: this._getDbKey(deletedHash),
        opts: { keyEncoding: KeyEncoding.Bytes },
      }
    })
  }

  /** Applies key hashing (keccak) when useKeyHashing is enabled (Ethereum-style). */
  protected appliedKey(key: Uint8Array) {
    if (this._opts.useKeyHashing) {
      return this.hash(key)
    }
    return key
  }

  protected hash(inputBytes: Uint8Array): Uint8Array {
    return Uint8Array.from(this._opts.useKeyHashingFunction.call(undefined, inputBytes))
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
    this.DEBUG && this.debug(`${bytesToHex(this.root())}`, ['checkpoint'])
    this._db.checkpoint(this.root())
  }

  /**
   * Commits a checkpoint to disk, if current checkpoint is not nested.
   * If nested, only sets the parent checkpoint as current checkpoint.
   * @throws If not during a checkpoint phase
   */
  async commit(): Promise<void> {
    if (!this.hasCheckpoints()) {
      throw EthereumJSErrorWithoutCode('trying to commit when not checkpointed')
    }
    this.DEBUG && this.debug(`${bytesToHex(this.root())}`, ['commit'])
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
      throw EthereumJSErrorWithoutCode('trying to revert when not checkpointed')
    }

    this.DEBUG && this.debug(`${bytesToHex(this.root())}`, ['revert', 'before'])
    await this._lock.acquire()
    this.root(await this._db.revert())
    await this.persistRoot()
    this._lock.release()
    this.DEBUG && this.debug(`${bytesToHex(this.root())}`, ['revert', 'after'])
  }

  /**
   * Flushes all checkpoints, restoring the initial checkpoint state.
   */
  flushCheckpoints() {
    this.DEBUG &&
      this.debug(`Deleting ${this._db.checkpoints.length} checkpoints.`, ['flush_checkpoints'])
    this._db.checkpoints = []
  }

  /**
   * Returns a list of values stored in the trie
   * @param startKey first unhashed key in the range to be returned (defaults to 0).  Note, all keys must be of the same length or undefined behavior will result
   * @param limit - the number of keys to be returned (undefined means all keys)
   * @returns an object with two properties (a map of all key/value pairs in the trie - or in the specified range) and then a `nextKey` reference if a range is specified
   */
  async getValueMap(
    startKey = BIGINT_0,
    limit?: number,
  ): Promise<{ values: { [key: string]: string }; nextKey: null | string }> {
    let inRange = limit !== undefined ? false : true
    let valueCount = 0
    const values: { [key: string]: string } = {}
    let nextKey: string | null = null
    await this.walkAllValueNodes(async (node: MPTNode, currentKey: number[]) => {
      if (node instanceof LeafMPTNode) {
        const keyBytes = nibblesTypeToPackedBytes(currentKey.concat(node.key()))
        if (!inRange) {
          // Check if the key is already in the correct range.
          if (bytesToBigInt(keyBytes) >= startKey) {
            inRange = true
          } else {
            return
          }
        }

        if (limit === undefined || valueCount < limit) {
          values[bytesToHex(keyBytes)] = bytesToHex(node._value)
          valueCount++
        } else if (valueCount === limit) {
          nextKey = bytesToHex(keyBytes)
        }
      }
    })
    return {
      values,
      nextKey,
    }
  }
}
