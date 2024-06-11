import { BIGINT_0, bytesToBigInt, equalsBytes } from '@ethereumjs/util'

import { type VerkleCrypto } from '../types.js'

import { BaseVerkleNode } from './baseVerkleNode.js'
import { LeafNode } from './leafNode.js'
import { NODE_WIDTH, VerkleNodeType } from './types.js'

import type { ChildNode, VerkleNodeOptions } from './types.js'

export class InternalNode extends BaseVerkleNode<VerkleNodeType.Internal> {
  // Array of tuples of uncompressed commitments (i.e. 64 byte Uint8Arrays) to child nodes along with the path to that child (i.e. the partial stem)
  public children: Array<ChildNode>
  public type = VerkleNodeType.Internal

  constructor(options: VerkleNodeOptions[VerkleNodeType.Internal]) {
    super(options)
    this.children =
      options.children ??
      new Array(256).fill({
        commitment: options.verkleCrypto.zeroCommitment,
        path: new Uint8Array(),
      })
  }

  commit(): Uint8Array {
    throw new Error('Not implemented')
  }

  // Updates the commitment value for a child node at the corresponding index
  setChild(index: number, child: ChildNode) {
    // Get previous child commitment at `index`
    const oldChild = this.children[index]
    // Updates the commitment to the child node at `index`
    this.children[index] = child
    // Updates the overall node commitment based on the update to this child
    this.commitment = this.verkleCrypto.updateCommitment(
      this.commitment,
      index,
      // The hashed child commitments are used when updating the internal node commitment
      this.verkleCrypto.hashCommitment(oldChild.commitment),
      this.verkleCrypto.hashCommitment(child.commitment)
    )
  }

  static fromRawNode(
    rawNode: Uint8Array[],
    depth: number,
    verkleCrypto: VerkleCrypto
  ): InternalNode {
    const nodeType = rawNode[0][0]
    if (nodeType !== VerkleNodeType.Internal) {
      throw new Error('Invalid node type')
    }

    // The length of the rawNode should be the # of children * 2 (for commitments and paths) + 2 for the node type and the commitment
    if (rawNode.length !== NODE_WIDTH * 2 + 2) {
      throw new Error('Invalid node length')
    }

    const commitment = rawNode[rawNode.length - 1]
    const childrenCommitments = rawNode.slice(1, NODE_WIDTH)
    const childrenPaths = rawNode.slice(NODE_WIDTH + 1, NODE_WIDTH * 2)

    const children = childrenCommitments.map((commitment, idx) => {
      return { commitment, path: childrenPaths[idx] }
    })
    return new InternalNode({ commitment, depth, verkleCrypto, children })
  }

  static create(depth: number, verkleCrypto: VerkleCrypto): InternalNode {
    const node = new InternalNode({
      commitment: verkleCrypto.zeroCommitment,
      depth,
      verkleCrypto,
    })

    return node
  }

  /**
   *
   * @param index The index in the children array to retrieve the child node commitment from
   * @returns the uncompressed 64byte commitment for the child node at the `index` position in the children array
   */
  getChildren(index: number): ChildNode | null {
    return this.children[index]
  }

  insert(key: Uint8Array, value: Uint8Array, resolver: () => void): void {
    const values = new Array<Uint8Array>(NODE_WIDTH)
    values[key[31]] = value
    this.insertStem(key.slice(0, 31), values, resolver)
  }

  // TODO: Determine how this function is used and if we need it
  insertStem(stem: Uint8Array, values: Uint8Array[], resolver: () => void): void {
    // Index of the child pointed by the next byte in the key
    const childIndex = stem[this.depth]

    const child = this.children[childIndex]

    if (child instanceof LeafNode) {
      if (equalsBytes(child.stem, stem)) {
        return child.insertMultiple(stem, values)
      }

      // A new branch node has to be inserted. Depending
      // on the next byte in both keys, a recursion into
      // the moved leaf node can occur.
      const nextByteInExistingKey = child.stem[this.depth + 1]
      const newBranch = InternalNode.create(this.depth + 1, this.verkleCrypto)
      this.children[childIndex] = {
        commitment: newBranch.commitment,
        path: child.stem.slice(0, this.depth + 1),
      }
      newBranch.children[nextByteInExistingKey] = child
      child.depth += 1

      const nextByteInInsertedKey = stem[this.depth + 1]
      if (nextByteInInsertedKey === nextByteInExistingKey) {
        return newBranch.insertStem(stem, values, resolver)
      }

      // Next word differs, so this was the last level.
      // Insert it directly into its final slot.
      // TODO: Fix this following `trie.put` logic
      let leafCommitment = this.verkleCrypto.zeroCommitment
      let c1 = this.verkleCrypto.zeroCommitment
      let c2 = this.verkleCrypto.zeroCommitment
      for (const [idx, value] of values.entries()) {
        if (bytesToBigInt(value) > BIGINT_0) {
          leafCommitment = this.verkleCrypto.updateCommitment(
            leafCommitment,
            idx,
            new Uint8Array(32),
            value
          )
          if (idx < 128) {
            // We multiply the commitment index by 2 here because each 32 byte value in the leaf node is represented as two 16 byte arrays
            c1 = this.verkleCrypto.updateCommitment(c1, idx * 2, new Uint8Array(32), value)
          } else {
            c2 = this.verkleCrypto.updateCommitment(c2, (idx - 128) * 2, new Uint8Array(32), value)
          }
        }
      }

      const leafNode = LeafNode.create(
        stem,
        values,
        this.depth + 1,
        leafCommitment,
        c1,
        c2,
        this.verkleCrypto
      )

      // TODO - Why is the leaf node set at depth + 2 instead of + 1)?
      leafNode.setDepth(this.depth + 2)
      newBranch.children[nextByteInInsertedKey] = {
        commitment: leafNode.commitment,
        path: leafNode.stem,
      }
    } else if (child instanceof InternalNode) {
      return child.insertStem(stem, values, resolver)
    } else {
      throw new Error('Invalid node type')
    }
  }

  raw(): Uint8Array[] {
    return [
      new Uint8Array([VerkleNodeType.Internal]),
      ...this.children.map((child) => child.commitment),
      ...this.children.map((child) => child.path),
      this.commitment,
    ]
  }
}
