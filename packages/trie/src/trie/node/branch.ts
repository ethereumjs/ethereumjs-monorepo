import { RLP } from '@ethereumjs/rlp'

import { ExtensionNode } from './extension'
import { BaseNode, NullNode } from './node'

import type {
  EncodedChild,
  EncodedValue,
  NodeInterface,
  NodeType,
  TNode,
  TNodeOptions,
} from './types'

export class BranchNode extends BaseNode implements NodeInterface<'BranchNode'> {
  type = 'BranchNode' as const
  keyNibbles: number[]
  children: Array<TNode | undefined>
  value: Uint8Array | null
  branches: (Uint8Array | Uint8Array[])[]
  constructor(options: TNodeOptions<'BranchNode'>) {
    super(options)
    this.keyNibbles = []
    this.children = options?.children ?? []
    this.branches = options?.branches ?? Array.from({ length: 16 }, () => Uint8Array.from([]))
    this.value = options?.value ?? null
    this.debug && this.debug(`BranchNode created`)
  }
  getType(): NodeType {
    return 'BranchNode'
  }

  encodeChild(child: TNode | undefined): EncodedChild {
    if (child === undefined) return Uint8Array.from([])
    switch (child.getType()) {
      case 'BranchNode':
        return child.rlpEncode().length >= 32 ? child.hash() : (child.raw() as Uint8Array[])
      case 'LeafNode':
        return child.rlpEncode().length >= 32 ? child.hash() : (child.raw() as Uint8Array[])
      case 'ExtensionNode':
        return child.rlpEncode().length >= 32 ? child.hash() : (child.raw() as Uint8Array[])
      case 'ProofNode':
        return child.hash()
      case 'NullNode':
      default:
        return Uint8Array.from([])
    }
  }
  childrenRlp(): EncodedChild[] {
    const children: (Uint8Array | Uint8Array[])[] = Array.from({ length: 16 }, (_, _i) => {
      return Uint8Array.from([])
    })
    for (const [idx, child] of this.getChildren().entries()) {
      children[idx] = this.encodeChild(child)
    }
    return children
  }
  raw(): [...EncodedChild[], EncodedValue] {
    const childrenRlp = this.childrenRlp()
    const valueRlp = this.value ?? Uint8Array.from([])
    return [...childrenRlp, valueRlp]
  }
  rlpEncode(): Uint8Array {
    const encodedNode = RLP.encode(this.raw())
    return encodedNode
  }

  hash(): Uint8Array {
    const hashed = this.hashFunction(this.rlpEncode())
    return hashed
  }
  getChildren(): Map<number, TNode> {
    const children: Map<number, TNode> = new Map()
    for (let i = 0; i < 16; i++) {
      const child = this.children[i]
      if (child !== undefined && child.getType() !== 'NullNode') {
        children.set(i, child)
      }
    }
    return children
  }
  getChild(key: number): TNode | undefined {
    return this.children[key]
  }
  childNodes(): Map<number, TNode> {
    const children: Map<number, TNode> = new Map()
    for (let i = 0; i < 16; i++) {
      const child = this.children[i]
      if (child !== undefined && child.getType() !== 'NullNode') {
        children.set(i, child)
      }
    }
    return children
  }
  childCount(): number {
    return this.childNodes().size
  }
  updateChild(newChild: TNode, nibble: number): TNode {
    if (newChild.getType() === 'NullNode' && this.childCount() === 1) {
      this.debug && this.debug.extend('updateChild')(`deleting last child`)
      return new NullNode({ hashFunction: this.hashFunction })
    }
    this.markDirty()
    this.children[nibble] = newChild.getType() === 'NullNode' ? undefined : newChild
    this.branches[nibble] = this.encodeChild(this.children[nibble])
    this.debug &&
      this.debug.extend('updateChild')(
        `updating child on branch:${nibble} to ${newChild.getType()}`
      )
    return this
  }
  async deleteChild(nibble: number): Promise<TNode> {
    this.markDirty()
    this.updateChild(new NullNode({ hashFunction: this.hashFunction }), nibble)
    return this
  }
  async updateValue(value: Uint8Array | null) {
    this.markDirty()
    this.debug && this.debug.extend('updateValue')(`value=${value}`)
    this.value = value
    return this
  }
  setChild(slot: number, node: TNode): BranchNode {
    this.children[slot] = node.getType() === 'NullNode' ? undefined : node
    this.branches[slot] = this.encodeChild(this.children[slot])
    return this
  }
  getValue(): Uint8Array | null {
    return this.value
  }
  getPartialKey(): number[] {
    return this.keyNibbles
  }
  async updateKey(newKeyNibbles: number[]): Promise<TNode> {
    return new ExtensionNode({
      keyNibbles: newKeyNibbles,
      subNode: this,
      hashFunction: this.hashFunction,
    })
  }
  async get(_rawKey: Uint8Array): Promise<Uint8Array | null> {
    throw new Error('Method to be removed.')
  }
  async update(value: Uint8Array): Promise<BranchNode> {
    return this.updateValue(value)
  }
  async delete(_rawKey: Uint8Array): Promise<TNode> {
    throw new Error('Method to be removed.')
  }
  copy(): TNode {
    return new BranchNode({
      children: this.children,
      branches: this.branches,
      value: this.value,
      hashFunction: this.hashFunction,
    })
  }
}
