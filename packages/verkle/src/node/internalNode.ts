import { BIGINT_0, bytesToBigInt, equalsBytes } from '@ethereumjs/util'

import { POINT_IDENTITY } from '../util/crypto.js'

import { BaseVerkleNode } from './baseVerkleNode.js'
import { LeafNode } from './leafNode.js'
import { NODE_WIDTH, VerkleNodeType } from './types.js'

import type { VerkleCrypto } from '../types.js'
import type { VerkleNode, VerkleNodeOptions } from './types.js'

export class InternalNode extends BaseVerkleNode<VerkleNodeType.Internal> {
  // Array of references to children nodes
  public children: Array<VerkleNode | null>
  public copyOnWrite: Record<string, Uint8Array>
  public type = VerkleNodeType.Internal

  constructor(options: VerkleNodeOptions[VerkleNodeType.Internal]) {
    super(options)
    // TODO: Decide whether to fill with null or not - personal opinion - should never use null
    this.children = options.children ?? new Array(NODE_WIDTH).fill(null)
    this.copyOnWrite = options.copyOnWrite ?? {}
  }

  commit(): Uint8Array {
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
    const commitment = rawNode[rawNode.length - 1]

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

  insert(
    key: Uint8Array,
    value: Uint8Array,
    resolver: () => void,
    verkleCrypto?: VerkleCrypto
  ): void {
    const values = new Array<Uint8Array>(NODE_WIDTH)
    values[key[31]] = value
    this.insertStem(key.slice(0, 31), values, resolver, verkleCrypto!)
  }

  insertStem(
    stem: Uint8Array,
    values: Uint8Array[],
    resolver: () => void,
    verkleCrypto: VerkleCrypto
  ): void {
    // Index of the child pointed by the next byte in the key
    const childIndex = stem[this.depth]

    const child = this.children[childIndex]

    if (child instanceof LeafNode) {
      // TODO: Understand the intent of what cowChild is suppoded to do
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
        return newBranch.insertStem(stem, values, resolver, verkleCrypto)
      }

      // Next word differs, so this was the last level.
      // Insert it directly into its final slot.
      // TODO: Determine if this is how to create the correct commitment
      let leafCommitment = verkleCrypto.zeroCommitment
      let c1 = verkleCrypto.zeroCommitment
      let c2 = verkleCrypto.zeroCommitment
      for (const [idx, value] of values.entries()) {
        if (bytesToBigInt(value) > BIGINT_0) {
          leafCommitment = verkleCrypto.updateCommitment(
            leafCommitment,
            idx,
            new Uint8Array(32),
            value
          )
          if (idx < 128) {
            // We multiply the commitment index by 2 here because each 32 byte value in the leaf node is represented as two 16 byte arrays
            c1 = verkleCrypto.updateCommitment(c1, idx * 2, new Uint8Array(32), value)
          } else {
            c2 = verkleCrypto.updateCommitment(c2, (idx - 128) * 2, new Uint8Array(32), value)
          }
        }
      }

      const leafNode = LeafNode.create(stem, values, this.depth + 1, leafCommitment, c1, c2)

      // TODO - Why is the leaf node set at depth + 2 instead of + 1)?
      leafNode.setDepth(this.depth + 2)
      newBranch.cowChild(nextByteInInsertedKey)
      newBranch.children[nextByteInInsertedKey] = leafNode
    } else if (child instanceof InternalNode) {
      this.cowChild(childIndex)
      return child.insertStem(stem, values, resolver, verkleCrypto)
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
