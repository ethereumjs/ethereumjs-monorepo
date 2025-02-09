import { RLP } from '@ethereumjs/rlp'
import { bitsToBytes, bytesToBits } from '@ethereumjs/util'

import { BinaryNodeType } from './types.js'

import type { BinaryNodeOptions, ChildBinaryNode } from './types.js'

export class InternalBinaryNode {
  public children: Array<ChildBinaryNode | null>

  public type = BinaryNodeType.Internal

  constructor(options: BinaryNodeOptions[BinaryNodeType.Internal]) {
    this.children = options.children ?? Array(2).fill(null)
  }

  static fromRawNode(rawNode: Uint8Array[]): InternalBinaryNode {
    const nodeType = rawNode[0][0]
    if (nodeType !== BinaryNodeType.Internal) {
      throw new Error('Invalid node type')
    }

    // The length of the rawNode should be the # of children * 2 (for hash and path) + 1 for the node type
    if (rawNode.length !== 2 * 2 + 1) {
      throw new Error('Invalid node length')
    }

    const [, leftChildHash, leftChildPath, rightChildHash, rightChildPath] = rawNode

    const children = [
      leftChildHash.length > 0 ? { hash: leftChildHash, path: bytesToBits(leftChildPath) } : null,
      rightChildHash.length > 0
        ? { hash: rightChildHash, path: bytesToBits(rightChildPath) }
        : null,
    ]

    return new InternalBinaryNode({ children })
  }

  /**
   * Generates a new Internal node
   * @param children the children nodes
   * @returns a new Internal node
   */
  static create(children?: (ChildBinaryNode | null)[]): InternalBinaryNode {
    if (children !== undefined && children.length !== 2) {
      throw new Error('Internal node must have 2 children')
    }
    return new InternalBinaryNode({ children })
  }

  getChild(index: number): ChildBinaryNode | null {
    return this.children[index]
  }

  setChild(index: number, child: ChildBinaryNode | null): void {
    this.children[index] = child
  }

  /**
   * @returns the RLP serialized node
   */
  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }

  /**
   * Returns the raw serialized representation of the node as an array of Uint8Arrays.
   * @returns {Uint8Array[]} An array of Uint8Arrays representing the node's serialized internal data.
   * @dev We are storing the children node paths as Uint8Arrays for storage, but they should be re-converted to bits when decoding
   */
  raw(): Uint8Array[] {
    return [
      new Uint8Array([BinaryNodeType.Internal]),
      ...this.children.map((child) => (child !== null ? child.hash : new Uint8Array())),
      ...this.children.map((child) =>
        child !== null ? bitsToBytes(child.path) : new Uint8Array(),
      ),
    ]
  }
}
