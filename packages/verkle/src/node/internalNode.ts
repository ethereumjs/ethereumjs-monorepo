import { type VerkleCrypto } from '../types.js'

import { BaseVerkleNode } from './baseVerkleNode.js'
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

  raw(): Uint8Array[] {
    return [
      new Uint8Array([VerkleNodeType.Internal]),
      ...this.children.map((child) => child.commitment),
      ...this.children.map((child) => child.path),
      this.commitment,
    ]
  }
}
