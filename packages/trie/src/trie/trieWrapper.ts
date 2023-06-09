import { KECCAK256_RLP, bytesToPrefixedHexString } from '@ethereumjs/util'
import debug from 'debug'
import { equalsBytes } from 'ethereum-cryptography/utils'
import * as LRUCache from 'lru-cache'

import { getChildOf, proofToPath } from '../proof/rangeHelpers'
import { _verifyRangeProof } from '../proof/rangeProof'
import { ROOT_DB_KEY } from '../types'
import { bulkInsert } from '../util'
import { bytesToNibbles } from '../util/nibbles'

import { ProofNode } from './node'
import { createProof, updateFromProof } from './operations/proof'
import { TrieReadStream } from './operations/readStream'
import { _walkTrieRecursively, walkTrie } from './operations/walkTrie'
import { TrieWithDB } from './trieDB'

import type { FoundNodeFunction, TrieWrapOptions } from '../types'
import type { TNode } from './node/types'
import type { Debugger } from 'debug'

export class TrieWrap extends TrieWithDB {
  static async create(options: TrieWrapOptions): Promise<TrieWrap> {
    const trie = new TrieWrap(options)
    if (options.db) {
      await trie.setDataBase(options.db)
      options.debug?.extend('create').extend('DB')(
        `Using existing DB with ${(await trie.database().keys()).length} keys`
      )
    }
    if (options.rootNodeRLP) {
      if (!equalsBytes(options.rootNodeRLP, KECCAK256_RLP)) {
        const rootHash = trie.hashFunction(options.rootNodeRLP)
        await trie.database().put(trie.hashFunction(options.rootNodeRLP), options.rootNodeRLP)
        const rootNode = new ProofNode({
          hash: rootHash,
          rlp: options.rootNodeRLP,
          hashFunction: trie.hashFunction,
          load: async () => trie.lookupNodeByHash(rootHash),
          nibbles: [],
        })
        // const rootNode = await trie._decodeToNode(options.rootNodeRLP)
        await trie.setRootNode(rootNode)
        await trie.setRootByHash(trie.hashFunction(options.rootNodeRLP))
      }
      if (trie.persistent) {
        await trie.persistRoot(trie.keySecure(ROOT_DB_KEY))
      }
    }
    if (options.root) {
      await trie.setRootNode(options.root)
    }
    if (options.rootHash) {
      await trie.setRootByHash(options.rootHash)
    }
    options.debug?.extend(`create`)(`Created new Trie`)
    options.debug?.extend(`create`)(`root: ${bytesToPrefixedHexString(trie.root())}`)
    options.debug?.extend(`create`)(`secure: ${trie.secure}`)
    options.debug?.extend(`create`)(`persistent: ${trie.persistent}`)
    options.debug?.extend(`create`)(`hashFunction: ${trie.hashFunction.name}`)
    options.debug?.extend(`create`)(`useNodePruning: ${trie.useNodePruning}`)
    options.debug?.extend(`create`)(`maxCheckpoints: ${trie.maxCheckpoints}`)
    return trie
  }
  static async fromProof(
    proof: Uint8Array[],
    options: TrieWrapOptions = {},
    dbug: Debugger = debug('Trie')
  ): Promise<TrieWrap> {
    dbug = dbug.extend('fromProof')
    dbug(`Creating new Trie from proof (length: ${proof.length})`)
    const trie = await TrieWrap.create({ ...options, rootNodeRLP: proof[0], debug: dbug })
    dbug(`Created new Trie: ${bytesToPrefixedHexString(trie.root())}`)
    const root = trie.hashFunction(proof[0])
    dbug(`Target Trie hash: ${bytesToPrefixedHexString(root)}`)
    for await (const [idx, p] of proof.reverse().entries()) {
      debug(`Storing ProofNode [${idx}]: ${p}`)
      // const node = await trie._decodeToNode(p)
      // await trie.storeNode(node)
      await trie.database().put(trie.hashFunction(p), p)
    }
    await trie.setRootByHash(root)
    // await trie.persistRoot()
    return trie
  }
  static async verifyProof(
    root: Uint8Array,
    key: Uint8Array,
    proof: Uint8Array[],
    secure: boolean = false,
    dbug: Debugger = debug('')
  ): Promise<Uint8Array | null | false> {
    dbug = dbug.extend('verifyProof')
    try {
      const trie = await TrieWrap.fromProof(proof, { secure })
      if (!equalsBytes(trie.root(), root)) {
        dbug.extend('ERROR:')('Proof Invalid: root mismatch')
        throw new Error('Proof Invalid: root mismatch')
      }
      debug(`Resolving RootNode: ${bytesToPrefixedHexString(trie.root())}`)
      const reachable = await trie.markReachableNodes(trie.rootNode)
      dbug.extend(`ProofTrie`)(`Reachable nodes: ${reachable.size}`)
      for (const [idx, p] of [...reachable.values()].entries()) {
        dbug.extend(`ProofTrie`)(`Reachable node [${idx}]: ${p}`)
      }
      for (const [idx, p] of proof.reverse().entries()) {
        dbug.extend(`ProofTrie`)(
          `Proof node [${idx}]: ${bytesToPrefixedHexString(trie.hashFunction(p))}`
        )
      }
      dbug.extend(`ProofTrie`)(`Reachable nodes: ${reachable.size}`)

      for (const [idx, p] of proof.entries()) {
        dbug.extend(`ProofNode [${idx}]`)(`${bytesToPrefixedHexString(trie.hashFunction(p))}`)
        if (!reachable.has(bytesToPrefixedHexString(trie.hashFunction(p)))) {
          dbug.extend('ERROR:')(
            `Proof Invalid: [${idx}]: ${bytesToPrefixedHexString(
              trie.hashFunction(p)
            )} is unreachable`
          )
          // throw new Error('Proof Invalid: unreachable node')
        } else {
          dbug.extend(`Proof [${idx}]`)(
            `: ${bytesToPrefixedHexString(trie.hashFunction(p))} is reachable`
          )
          // const proofNode = await trie._getNodePath(key, dbug)
          // if (equalsBytes(proofNode.node.rlpEncode(), p)) {
          //   const value = proofNode.node.getValue()
          //   dbug(`Found in ProofTrie for key [${bytesToNibbles(key)}]: ${value ? bytesToPrefixedHexString(value) : null}`)
          //   return value
          // } else {
          //   dbug(`node: ${proofNode.node.getType()}`)
          //   dbug(`path: ${proofNode.path.length} nodes`)
          //   dbug(`ProofNode Nibbles: [${bytesToNibbles(key)}]`)
          //   dbug(`remaining Nibbles: [${proofNode.remainingNibbles}]`)
          // }
        }
      }
      dbug.extend(`ProofTrie`)(`All Proof nodes reachable`)
      const value = await trie.get(key)
      dbug(
        `Found in ProofTrie for key [${bytesToNibbles(key)}]: ${
          value ? bytesToPrefixedHexString(value) : null
        }`
      )
      return value
    } catch (err: any) {
      debug(`Failed to verify proof: ${err.message}`)
      return false
    }
  }
  constructor(options: TrieWrapOptions = {}) {
    super(options)
  }
  bulkInsert = bulkInsert.bind(this)
  getChildOf = getChildOf.bind(this)
  proofToPath = proofToPath.bind(this)
  updateFromProof = updateFromProof.bind(this)
  verifyRangeProof = _verifyRangeProof.bind(this)
  walkTrie = walkTrie.bind(this)
  _createProof = createProof.bind(this)
  _walkTrieRecursively = _walkTrieRecursively.bind(this)

  async batch(
    batch: { type: string; key: Uint8Array; value?: Uint8Array }[],
    debug: Debugger = this.debug
  ): Promise<void> {
    debug.extend('batch')(`processing batch of ${batch.length} operations`)
    for (const [idx, b] of batch.entries()) {
      const dbug = debug.extend('batch').extend(`[${idx + 1} / ${batch.length}]`)
      if (b.type === 'put' && b.value !== undefined) {
        // await this.put(b.key, b.value ?? null)
        const _key = this.keySecure(b.key)
        await this._withLock(async () => {
          const keyNibbles = bytesToNibbles(_key)
          dbug(`inserting new key/value node`)
          dbug.extend('from ROOT_NODE')(
            `${this.rootNode.getType()}: ${this.rootNode.getPartialKey()}`
          )
          dbug.extend('Insert Key')(`[${keyNibbles}]`)
          dbug.extend('Value')(`${b.value}`)
          const newNode = await this._insertAtNode(this.rootNode, keyNibbles, b.value!, debug)
          this.rootNode = newNode
          dbug.extend(`**NEW_ROOT**`)(`${bytesToPrefixedHexString(this.rootNode.hash())}`)
        })
      } else if (b.type === 'del') {
        await this.del(b.key)
      }
    }
    await this.storeNode(this.rootNode)
  }

  async copy(includeCheckpoints: boolean = true): Promise<TrieWrap> {
    this.debug.extend('copy')(`Creating copy of Trie: ${bytesToPrefixedHexString(this.root())}`)
    this.debug.extend('copy')('include checkpoints: ' + includeCheckpoints)
    this.debug.extend('copy')('checkpoints: ' + this.checkpoints.length)
    const dbCopy = await this.database().copy()
    const cacheCopy = new LRUCache<Uint8Array, TNode>({ max: this.cache.max })
    for await (const [key, value] of this.cache.entries()) {
      cacheCopy.set(key, value)
    }
    this.debug.extend('copy')(this.checkpoints.map((c) => bytesToPrefixedHexString(c)))
    const trieCopy = await TrieWrap.create({
      root: this.rootNode,
      debug: debug(this.debug.namespace).extend('copy'),
      secure: this.secure,
      db: dbCopy,
      cache: cacheCopy,
      checkpoints: includeCheckpoints ? [...this.checkpoints.slice()] : undefined,
      useRootPersistence: this.persistent,
      hashFunction: this.hashFunction,
    })
    if (!equalsBytes(trieCopy.root(), this.root())) {
      throw new Error('Failed to copy trie')
    }
    return trieCopy
  }
  async verifyProof(
    root: Uint8Array,
    key: Uint8Array,
    proof: Uint8Array[]
  ): Promise<Uint8Array | null | false> {
    key = this.keySecure(key)
    this.debug.extend(`verifyProof`)(`verify proof for key: ${bytesToPrefixedHexString(key)}`)
    this.debug.extend(`verifyProof`)(`in trie with root: ${bytesToPrefixedHexString(root)}`)
    const trie = new TrieWrap({
      rootNodeRLP: proof[0],
      persistent: this.persistent,
      useNodePruning: this.useNodePruning,
      secure: this.secure,
    })
    await trie.updateFromProof(proof, this.debug.extend('verifyProof'))
    const trieValue = await trie.get(key)
    return trieValue
  }
  async setRootNode(root: TNode) {
    this.rootNode = root
    this.useNodePruning && (await this.garbageCollect())
    const addNode: FoundNodeFunction = async (node: TNode, _) => {
      await this.storeNode(node)
    }
    const walk = this.walkTrie(this.rootNode, this.rootNode.getPartialKey(), addNode)
    for await (const _ of walk) {
      // leave empty
    }
  }

  public async put(
    _key: Uint8Array,
    _value: Uint8Array | null,
    debug: Debugger = this.debug
  ): Promise<void> {
    if (_value === null) {
      debug.extend('put')(`received null value`)
      debug(`deleting key: ${bytesToPrefixedHexString(_key)}`)
      return this.del(_key, debug)
    }
    debug = debug.extend('put')
    if (equalsBytes(_key, ROOT_DB_KEY)) {
      throw new Error(`Attempted to set '__root__' key but it is not allowed.`)
    }
    debug(
      `key: ${bytesToPrefixedHexString(_key)}} => ${bytesToPrefixedHexString(this.keySecure(_key))}`
    )
    _key = this.keySecure(_key)
    await this._withLock(async () => {
      const keyNibbles = bytesToNibbles(_key)
      debug(`inserting new key/value node`)
      debug.extend('from ROOT_NODE')(`${this.rootNode.getType()}: ${this.rootNode.getPartialKey()}`)
      debug.extend('Insert Key')(`[${keyNibbles}]`)
      debug.extend('Value')(`${_value}`)
      const oldNode = await this.getNode(_key, debug)
      const newNode = await this._insertAtNode(this.rootNode, keyNibbles, _value, debug)
      await this.storeNode(newNode)
      this.rootNode = newNode
      if (this.useNodePruning) {
        this.cache.delete(oldNode.hash())
        await this.database().del(oldNode.hash())
      }
      // debug.extend(`**NEW_ROOT**`)(`${bytesToPrefixedHexString(this.rootNode.hash())}`)
    })
    if (this.useNodePruning) {
      await this.garbageCollect()
    }
    if (this.persistent) {
      await this.persistRoot(this.keySecure(ROOT_DB_KEY))
    }
  }
  public async del(key: Uint8Array, debug: Debugger = this.debug): Promise<void> {
    key = this.keySecure(key)
    await this._withLock(async () => {
      debug = debug.extend('del')
      const keyNibbles = bytesToNibbles(key)
      debug(`deleting key: ${bytesToPrefixedHexString(key)}`)
      debug.extend(`nibbles`)(`${keyNibbles}`)
      const newNode = await this._deleteAtNode(this.rootNode, keyNibbles, debug)
      debug.extend('TRIE_UPDATE')(
        `${newNode.getType()}: ${bytesToPrefixedHexString(newNode.hash())}`
      )
      this.rootNode = newNode
      debug.extend('NEW_ROOT')(
        `${this.rootNode.getType()}: ${bytesToPrefixedHexString(this.rootNode.hash())}`
      )
      // if (this.useNodePruning) {
      //   await this.garbageCollect()
      // }
    })
    if (this.persistent) {
      await this.persistRoot(this.keySecure(ROOT_DB_KEY))
    }
    if (this.useNodePruning) {
      await this.garbageCollect()
    }
  }
  public async get(key: Uint8Array, debug: Debugger = this.debug): Promise<Uint8Array | null> {
    debug = debug.extend('get')
    key = this.keySecure(key)
    const lastNode = await this.getNode(key, debug)
    const value = lastNode.getValue()
    debug(`Returning: ${value}`)
    return value
  }
  async createReadStream(): Promise<TrieReadStream> {
    return new TrieReadStream(this)
  }
}
