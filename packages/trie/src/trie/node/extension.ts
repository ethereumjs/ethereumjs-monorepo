import { RLP } from '@ethereumjs/rlp'
import { bytesToPrefixedHexString } from '@ethereumjs/util'

import { addHexPrefix } from '../../util/hex'
import {
  bytesToNibbles,
  concatNibbles,
  hasMatchingNibbles,
  nibblestoBytes,
} from '../../util/nibbles'

import { LeafNode } from './leaf'
import { BaseNode, NullNode } from './node'

import type {
  EncodedChild,
  EncodedKey,
  NodeInterface,
  NodeType,
  TNode,
  TNodeOptions,
} from './types'

export class ExtensionNode extends BaseNode implements NodeInterface<'ExtensionNode'> {
  type = 'ExtensionNode' as const
  keyNibbles: number[]
  child: TNode

  constructor(options: TNodeOptions<'ExtensionNode'>) {
    super(options)
    this.keyNibbles = options.keyNibbles
    this.child = options.subNode
    if (options.source) {
      options.source.extend('ExtensionNode')(`key=[${this.keyNibbles}]`)
      options.source.extend('ExtensionNode')(
        `child={${this.child.getType()}: [${this.child.getPartialKey()}]}`
      )
      options.source.extend('ExtensionNode')(`hash=${bytesToPrefixedHexString(this.hash())}`)
    } else if (this.debug) {
      this.debug(`key=[${this.keyNibbles}]`)
      this.debug(`child={${this.child.getType()}: [${this.child.getPartialKey()}]}`)
      this.debug(`hash=${bytesToPrefixedHexString(this.hash())}`)
    }
  }
  prefixedNibbles(): number[] {
    const nibbles = this.keyNibbles
    return addHexPrefix(nibbles, false)
  }
  encodedKey(): Uint8Array {
    return nibblestoBytes(this.prefixedNibbles())
  }
  encodedChild(): EncodedChild {
    switch (this.child.getType()) {
      case 'BranchNode':
        return this.child.rlpEncode().length >= 32 ? this.child.hash() : this.child.raw()
      case 'LeafNode':
        return this.child.rlpEncode().length >= 32 ? this.child.hash() : this.child.raw()
      case 'ExtensionNode':
        return this.child.rlpEncode().length >= 32 ? this.child.hash() : this.child.raw()
      case 'ProofNode':
        return this.child.hash()
      case 'NullNode':
      default:
        throw new Error('Invalid node type')
    }
  }
  raw(): [EncodedKey, EncodedChild] {
    return [this.encodedKey(), this.encodedChild()]
  }
  rlpEncode(): Uint8Array {
    return RLP.encode(this.raw())
  }
  hash(): Uint8Array {
    return this.hashFunction(this.rlpEncode())
  }
  getChildren(): Map<number, TNode> {
    return new Map().set(0, this.child)
  }
  getChild(_key: number = 0): TNode {
    return this.child
  }
  getType(): NodeType {
    return 'ExtensionNode'
  }
  async deleteChild(_nibble: number): Promise<TNode> {
    return new NullNode({ hashFunction: this.hashFunction })
  }
  async updateKey(newKey: number[]): Promise<TNode> {
    this.markDirty()
    this.keyNibbles = newKey
    return this
  }
  updateChild(newNode: TNode): TNode {
    this.markDirty()
    // if (equalsBytes(newNode.hash(), this.child.hash())) {
    //   return this
    // }
    // const newKeyNibbles = this.keyNibbles
    // if (newKeyNibbles.length === 0) {
    //   return newNode
    // }
    // this.keyNibbles = newKeyNibbles
    this.child = newNode
    return this
  }
  async updateValue(_newValue: Uint8Array | null): Promise<TNode> {
    throw new Error('method does not exist')
  }

  getValue(): Uint8Array | null {
    return null
  }
  getPartialKey(): number[] {
    return this.keyNibbles
  }
  async get(_rawKey: Uint8Array): Promise<Uint8Array | null> {
    throw new Error('method to be deleted')
  }

  async update(value: Uint8Array): Promise<TNode> {
    this.debug && this.debug.extend('update')(`value=${value}`)
    const updatedChild = await this.child.updateValue(value)
    return this.updateChild(updatedChild)
  }

  async delete(rawKey: Uint8Array): Promise<ExtensionNode | NullNode> {
    const key = bytesToNibbles(rawKey)
    this.debug && this.debug.extend('delete')(`[${key}]`)

    if (!hasMatchingNibbles(this.keyNibbles, key)) {
      this.debug && this.debug.extend('delete')(`key does not match`)
      return this
    }
    const remainingKey = key.slice(this.keyNibbles.length)
    this.debug && this.debug.extend('delete')(`remainingKey=${remainingKey}`)
    const updatedChild = await this.child.delete(nibblestoBytes(remainingKey))
    if (updatedChild instanceof NullNode) {
      return updatedChild
    }
    if (updatedChild instanceof LeafNode) {
      const newPartialKey = concatNibbles(this.getPartialKey(), updatedChild.getPartialKey())
      await this.updateKey(newPartialKey)
      this.updateChild(updatedChild)
      return this
    }
    this.updateChild(updatedChild)
    return this
  }
  copy(): ExtensionNode {
    return new ExtensionNode({
      keyNibbles: this.keyNibbles,
      subNode: this.child,
      hashFunction: this.hashFunction,
    })
  }
}
