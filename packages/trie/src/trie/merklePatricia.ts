import debug from 'debug'
import { _cleanupNode, _cleanupBranchNode, _cleanupExtensionNode } from './operations/cleanup'
import { _deleteAtNode } from './operations/delete'
import { _getNodePath } from './operations/getNode'
import { _insertAtNode } from './operations/insert'
import { _walk } from './operations/walkTrie'
import { bytesToPrefixedHexString, equalsBytes } from '@ethereumjs/util'
import {
  decodeBranchNode,
  decodeExtensionNode,
  decodeHashedChild,
  decodeLeafNode,
  decodeNode,
} from './operations/decode'
import { getChildOf, unsetInternal } from '../proof/rangeHelpers'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { Mutex } from 'async-mutex'
import { NullNode, ProofNode } from './node'
import type { Debugger } from 'debug'
import type { MerklePatriciaTrieOptions, PathToNode } from '../types'
import { TNode } from './node/types'

export class MerklePatriciaTrie {
  static async create(options: MerklePatriciaTrieOptions): Promise<MerklePatriciaTrie> {
    return new MerklePatriciaTrie(options)
  }
  private _operationMutex: Mutex
  EMPTY_TRIE_ROOT: Uint8Array = Uint8Array.from([0x80])
  debug: Debugger
  hashFunction: (data: Uint8Array) => Uint8Array
  rootNode: TNode
  nodes?: Map<Uint8Array, TNode>
  constructor(options: MerklePatriciaTrieOptions = {}) {
    this.hashFunction = options.hashFunction ?? keccak256
    this.rootNode = options.root ?? new NullNode({ hashFunction: this.hashFunction })
    this.nodes = new Map()
    this.debug = options.debug ? options.debug.extend(`Trie`) : debug('Trie')
    this._operationMutex = new Mutex()
  }
  async _withLock<T>(operation: () => Promise<T>): Promise<T> {
    await this._operationMutex.acquire()
    try {
      return await operation()
    } finally {
      this._operationMutex.release()
    }
  }
  root(): Uint8Array {
    return this.rootNode.hash()
  }
  async lookupNodeByHash(
    hash: Uint8Array,
    debug: Debugger = this.debug
  ): Promise<TNode | undefined> {
    debug.extend(`lookupNodeByHash`)(
      `node for ${bytesToPrefixedHexString(hash)}${this.nodes!.has(hash) ? 'found' : 'not found'}`
    )
    return this.nodes!.get(hash)
  }
  async setRootByHash(rootHash: Uint8Array): Promise<Uint8Array> {
    const debug = this.debug.extend('setRootByHash')
    debug(`Setting root by hash: ${bytesToPrefixedHexString(rootHash)}`)
    if (equalsBytes(rootHash, this.EMPTY_TRIE_ROOT)) {
      this.rootNode = new NullNode({ hashFunction: this.hashFunction })
      return this.rootNode.hash()
    }

    const newRoot = await this.lookupNodeByHash(rootHash)
    if (!newRoot) {
      const proofRoot = new ProofNode({
        hash: rootHash,
        load: async () => this.lookupNodeByHash(rootHash),
        nibbles: [],
        next: Uint8Array.from([]),
        hashFunction: this.hashFunction,
      })
      this.rootNode = proofRoot
      return proofRoot.hash()
    }
    debug(`Setting root to ${newRoot.getType()}: ${newRoot.hash()}`)
    this.rootNode = newRoot
    return this.rootNode.hash()
  }
  async checkRoot(root: Uint8Array): Promise<boolean> {
    const node = await this.lookupNodeByHash(root)
    return node !== null ? true : false
  }
  async resolveProofNode(node: TNode): Promise<TNode> {
    if (node instanceof ProofNode) {
      node = (await node.load()) ?? node
    }
    return node
  }
  async storeNode(node: TNode, debug: Debugger = this.debug): Promise<void> {
    debug.extend('storeNode')(
      `[${node.getPartialKey()}] with hash: ${bytesToPrefixedHexString(node.hash())}`
    )
    this.nodes!.set(node.hash(), node)
  }
  async getPath(key: Uint8Array): Promise<PathToNode> {
    const { path, remainingNibbles } = await this._getNodePath(key, this.debug)
    return { path, remainingNibbles }
  }
  async getNode(hash: Uint8Array, debug: Debugger = this.debug): Promise<TNode> {
    const { node } = await this._getNodePath(hash, debug)
    return node
  }

  /** {@link decodeNode} */
  _decodeToNode = decodeNode.bind(this)
  _decodeHashedChild = decodeHashedChild.bind(this)
  _decodeLeafNode = decodeLeafNode.bind(this)
  _decodeExtensionNode = decodeExtensionNode.bind(this)
  _decodeBranchNode = decodeBranchNode.bind(this)

  /** {@link getChildOf} */
  _getChildOf = getChildOf.bind(this)
  /** {@link _getNodePath} */
  _getNodePath = _getNodePath.bind(this)
  /** {@link _insertAtNode }*/
  _insertAtNode = _insertAtNode.bind(this)
  /** {@link _deleteAtNode }*/
  _deleteAtNode = _deleteAtNode.bind(this)
  /** {@link _cleanupNode }*/
  _cleanupNode = _cleanupNode.bind(this)
  /** {@link _cleanupBranchNode }*/
  _cleanupBranchNode = _cleanupBranchNode.bind(this)
  /** {@link _cleanupExtensionNode }*/
  _cleanupExtensionNode = _cleanupExtensionNode.bind(this)
  /** {@link unsetInternal } */
  _unset = unsetInternal.bind(this)
  /** {@link _walk } */
  _walk = _walk.bind(this)
}
