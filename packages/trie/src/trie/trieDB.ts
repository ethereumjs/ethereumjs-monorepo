import { bytesToPrefixedHexString, equalsBytes } from '@ethereumjs/util'
import * as LRUCache from 'lru-cache'

import { TrieDatabase } from '../db'
import { ROOT_DB_KEY } from '../types'

import { MerklePatriciaTrie } from './merklePatricia'
import { NullNode, ProofNode } from './node'
import {
  _garbageCollect,
  _markReachableNodes,
  _verifyPrunedIntegrity,
} from './operations/garbageCollection'

import type { TrieDBOptions } from '../types'
import type { TNode } from './node/types'
import type { Debugger } from 'debug'

export class TrieWithDB extends MerklePatriciaTrie {
  static async create(options: TrieDBOptions): Promise<TrieWithDB> {
    const trie = new TrieWithDB(options)
    if (trie.persistent && options.rootNodeRLP) {
      await trie.database().put(trie.hashFunction(options.rootNodeRLP), options.rootNodeRLP)
      await trie.database().put(trie.keySecure(ROOT_DB_KEY), options.rootNodeRLP)
      await trie.setRootByHash(trie.keySecure(ROOT_DB_KEY))
    }
    trie.debug(`Created new Trie`)
    trie.debug(`root: ${bytesToPrefixedHexString(trie.root())}`)
    trie.debug(`secure: ${trie.secure}`)
    trie.debug(`persistent: ${trie.persistent}`)
    trie.debug(`hashFunction: ${trie.hashFunction.name}`)
    trie.debug(`useNodePruning: ${trie.useNodePruning}`)
    trie.debug(`maxCheckpoints: ${trie.maxCheckpoints}`)
    return trie
  }
  private db: TrieDatabase
  _opts: TrieDBOptions
  cache: LRUCache<Uint8Array, TNode>
  checkpoints: Uint8Array[]
  maxCheckpoints: number
  secure: boolean
  persistent: boolean
  useNodePruning: boolean
  keySecure: (key: Uint8Array) => Uint8Array

  constructor(options: TrieDBOptions = { cacheSize: 1000 }) {
    super(options)
    this.cache = options.cache ?? new LRUCache({ max: 1000 })
    if (options.db) {
      this.debug(`Building Trie from DB: ${options.db}`)
    }
    this._opts = options
    this.db = options.db ?? new TrieDatabase({ _debug: this.debug })
    this.checkpoints = options.checkpoints ?? []
    this.maxCheckpoints = options.maxCheckpoints ?? 1000
    this.useNodePruning = options.useNodePruning ?? false
    this.persistent = options.persistent ?? false
    this.secure = options.secure ?? options.useKeyHashing ?? false
    this.keySecure = this.secure ? this.hashFunction : (key: Uint8Array) => key
    this.EMPTY_TRIE_ROOT = this.keySecure(this.EMPTY_TRIE_ROOT)
  }

  database(): TrieDatabase {
    return this.db
  }
  async setDataBase(db: TrieDatabase): Promise<void> {
    const newDB = new TrieDatabase({ _debug: this.debug })
    for await (const key of await db.keys()) {
      const value = await db.get(key)
      value && (await newDB.put(key, value))
    }
  }
  async checkpoint(): Promise<void> {
    this.debug.extend('checkpoint')(`${bytesToPrefixedHexString(this.rootNode.hash())}`)
    // await this.database().put(this.rootNode.hash(), this.rootNode.rlpEncode())
    this.checkpoints.push(this.rootNode.hash())
  }
  hasCheckpoints(): boolean {
    return this.checkpoints.length > 0
  }
  async lookupNodeByHash(
    hash: Uint8Array,
    debug: Debugger = this.debug
  ): Promise<TNode | undefined> {
    debug = debug.extend('lookupNodeByHash')
    debug(`${bytesToPrefixedHexString(hash)}`)
    //  Check if node in cache
    let node = this.cache.get(hash)
    if (node === undefined) {
      //  Check if node in db
      const encoded = await this.db.get(hash)
      if (!encoded) {
        return undefined
      }
      debug.extend('lookupNodeByHash')(
        `found in db: ${bytesToPrefixedHexString(this.hashFunction(encoded))}`
      )
      node = await this._decodeToNode(encoded)
    }
    if (!equalsBytes(node.hash(), hash)) {
      throw new Error(
        `Node hash mismatch.  Expected ${bytesToPrefixedHexString(
          hash
        )} but got ${bytesToPrefixedHexString(node.hash())}`
      )
    }
    debug.extend('lookupNodeByHash')(`decoded hash: ${bytesToPrefixedHexString(node.hash())}`)
    debug(`node ${node.getType() ? `found: ${node.getType()}` : `not found`}`)
    node = await this.resolveProofNode(node)
    this.cache.set(hash, node)
    return node
  }
  async storeNode(node: TNode, debug: Debugger = this.debug): Promise<void> {
    debug = debug.extend('storeNode')
    debug.extend('store').extend(node.getType())(`${bytesToPrefixedHexString(node.hash())}}`)
    if (node instanceof ProofNode) {
      node = await this.resolveProofNode(node)
    }
    if (node instanceof ProofNode) {
      return
    } else {
      const serializedNode = node.rlpEncode()
      const nodeHash = node.hash()
      this.cache.set(nodeHash, node)
      await this.db.put(nodeHash, serializedNode)
    }
  }
  async persistRoot(rootDbKey: Uint8Array = ROOT_DB_KEY): Promise<void> {
    this.debug.extend('persistRoot')(bytesToPrefixedHexString(this.rootNode.hash()))
    await this._withLock(async () => {
      await this.db.put(rootDbKey, this.rootNode.hash())
    })
  }
  async commit(): Promise<void> {
    const checkpoint = this.checkpoints.pop()
    if (checkpoint === undefined) {
      return
    }
    this.debug.extend('commit')(
      `Committing changes.  Deleting checkpoint: ${bytesToPrefixedHexString(checkpoint)}`
    )
    await this.persistRoot(this.hashFunction(ROOT_DB_KEY))
    // await this.garbageCollect()
  }
  async revert(): Promise<void> {
    const fromRoot = this.rootNode
    await this._withLock(async () => {
      if (this.checkpoints.length > 0) {
        const checkpoint = this.checkpoints.pop()
        this.debug.extend('revert')(
          `Reverting to last checkpoint: ${bytesToPrefixedHexString(checkpoint!)}`
        )
        await this.setRootByHash(checkpoint!)
        // const newRoot = await this.lookupNodeByHash(checkpoint!, this.debug.extend('revert'))
        // if (newRoot) {
        //   this.rootNode = newRoot
        // } else {
        //   this.rootNode = new NullNode({ hashFunction: this.hashFunction })
        // }
      } else {
        this.rootNode = new NullNode({ hashFunction: this.hashFunction })
      }
      this.debug.extend('revert')(
        `from: ${bytesToPrefixedHexString(fromRoot.hash())} to: ${bytesToPrefixedHexString(
          this.rootNode.hash()
        )}`
      )
    })
    // await this._deleteAtNode(fromRoot, fromRoot.getPartialKey(), this.debug.extend('revert'))
    // await this.garbageCollect()
  }
  async _pruneCheckpoints(): Promise<void> {
    while (this.checkpoints.length > this.maxCheckpoints) {
      this.checkpoints.shift()
    }
    await this.garbageCollect()
  }
  async flushCheckpoints(): Promise<void> {
    this.checkpoints = []
    await this.garbageCollect()
  }

  /** {@link _garbageCollect } */
  garbageCollect = _garbageCollect.bind(this)
  /** {@link _verifyPrunedIntegrity } */
  verifyPrunedIntegrity = _verifyPrunedIntegrity.bind(this)
  /** {@link _markReachableNodes } */
  markReachableNodes = _markReachableNodes.bind(this)
}
