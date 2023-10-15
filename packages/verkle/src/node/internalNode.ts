import { equalsBytes } from '@ethereumjs/util'

import { POINT_IDENTITY } from '../util/crypto.js'

import { BaseVerkleNode } from './baseVerkleNode.js'
import { LeafNode } from './leafNode.js'
import { NODE_WIDTH, VerkleNodeType } from './types.js'

import type { Point } from '../types.js'
import type { VerkleNode, VerkleNodeOptions } from './types.js'

export class InternalNode extends BaseVerkleNode<VerkleNodeType.Internal> {
  // Array of references to children nodes
  public children: Array<VerkleNode | null>
  public copyOnWrite: Record<string, Point>
  public type = VerkleNodeType.Internal

  /* TODO: options.children is not actually used here */
  constructor(options: VerkleNodeOptions[VerkleNodeType.Internal]) {
    super(options)
    this.children = options.children ?? new Array(NODE_WIDTH).fill(null)
    this.copyOnWrite = options.copyOnWrite ?? {}
  }

  commit(): Point {
    throw new Error('Not implemented')
  }

  cowChild(_: number): void {
    // Not implemented yet
  }

  setChild(index: number, child: VerkleNode) {
    this.children[index] = child
  }

  static fromRawNode(rawNode: Uint8Array[], depth: number): InternalNode {
    const nodeType = rawNode[0][0]
    if (nodeType !== VerkleNodeType.Internal) {
      throw new Error('Invalid node type')
    }

    // The length of the rawNode should be the # of children, + 2 for the node type and the commitment
    if (rawNode.length !== NODE_WIDTH + 2) {
      throw new Error('Invalid node length')
    }

    // TODO: Generate Point from rawNode value
    const commitment = rawNode[rawNode.length - 1] as unknown as Point

    return new InternalNode({ commitment, depth })
  }

  static create(depth: number): InternalNode {
    const node = new InternalNode({
      commitment: POINT_IDENTITY,
      depth,
    })

    return node
  }

  getChildren(index: number): VerkleNode | null {
    return this.children?.[index] ?? null
  }

  insert(key: Uint8Array, value: Uint8Array, resolver: () => void): void {
    const values = new Array<Uint8Array>(NODE_WIDTH)
    values[key[31]] = value
    this.insertStem(key.slice(0, 31), values, resolver)
  }

  insertStem(stem: Uint8Array, values: Uint8Array[], resolver: () => void): void {
    // Index of the child pointed by the next byte in the key
    const childIndex = stem[this.depth]

    const child = this.children[childIndex]

    if (child instanceof LeafNode) {
      this.cowChild(childIndex)
      if (equalsBytes(child.stem, stem)) {
        return child.insertMultiple(stem, values)
      }

      // A new branch node has to be inserted. Depending
      // on the next byte in both keys, a recursion into
      // the moved leaf node can occur.
      const nextByteInExistingKey = child.stem[this.depth + 1]
      const newBranch = InternalNode.create(this.depth + 1)
      newBranch.cowChild(nextByteInExistingKey)
      this.children[childIndex] = newBranch
      newBranch.children[nextByteInExistingKey] = child
      child.depth += 1

      const nextByteInInsertedKey = stem[this.depth + 1]
      if (nextByteInInsertedKey === nextByteInExistingKey) {
        return newBranch.insertStem(stem, values, resolver)
      }

      // Next word differs, so this was the last level.
      // Insert it directly into its final slot.
      const leafNode = LeafNode.create(stem, values)

      leafNode.setDepth(this.depth + 2)
      newBranch.cowChild(nextByteInInsertedKey)
      newBranch.children[nextByteInInsertedKey] = leafNode
    } else if (child instanceof InternalNode) {
      this.cowChild(childIndex)
      return child.insertStem(stem, values, resolver)
    } else {
      throw new Error('Invalid node type')
    }
  }

  // TODO: go-verkle also adds the bitlist to the raw format.
  raw(): Uint8Array[] {
    throw new Error('not implemented yet')
    // return [new Uint8Array([VerkleNodeType.Internal]), ...this.children, this.commitment]
  }
}
