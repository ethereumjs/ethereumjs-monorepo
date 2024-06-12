import { BaseVerkleNode } from './baseVerkleNode.js'
import { NODE_WIDTH, VerkleNodeType } from './types.js'

import type { VerkleCrypto } from '../types.js'
import type { VerkleNodeOptions } from './types.js'

export class LeafNode extends BaseVerkleNode<VerkleNodeType.Leaf> {
  public stem: Uint8Array
  public values: Uint8Array[] // Array of 256 possible values represented as 32 byte Uint8Arrays
  public c1?: Uint8Array
  public c2?: Uint8Array
  public type = VerkleNodeType.Leaf

  constructor(options: VerkleNodeOptions[VerkleNodeType.Leaf]) {
    super(options)

    this.stem = options.stem
    this.values = options.values
    this.c1 = options.c1
    this.c2 = options.c2
  }

  static create(
    stem: Uint8Array,
    values: Uint8Array[],
    depth: number,
    commitment: Uint8Array,
    c1: Uint8Array,
    c2: Uint8Array,
    verkleCrypto: VerkleCrypto
  ): LeafNode {
    return new LeafNode({
      stem,
      values,
      depth,
      commitment,
      c1,
      c2,
      verkleCrypto,
    })
  }

  static fromRawNode(rawNode: Uint8Array[], depth: number, verkleCrypto: VerkleCrypto): LeafNode {
    const nodeType = rawNode[0][0]
    if (nodeType !== VerkleNodeType.Leaf) {
      throw new Error('Invalid node type')
    }

    // The length of the rawNode should be the # of values (node width) + 5 for the node type, the stem, the commitment and the 2 commitments
    if (rawNode.length !== NODE_WIDTH + 5) {
      throw new Error('Invalid node length')
    }

    const stem = rawNode[1]
    const commitment = rawNode[2]
    const c1 = rawNode[3]
    const c2 = rawNode[4]
    const values = rawNode.slice(5, rawNode.length)

    return new LeafNode({ depth, stem, values, c1, c2, commitment, verkleCrypto })
  }

  // Retrieve the value at the provided index from the values array
  getValue(index: number): Uint8Array | undefined {
    return this.values?.[index] ?? null
  }

  // Set the value at the provided index from the values array
  // TODO: Decide whether we need a separate "deleteValue" function since it has special handling
  // since we never actually delete a node in a verkle trie but overwrite instead
  setValue(index: number, value: Uint8Array): void {
    this.values[index] = value
  }
  // TODO: go-verkle also adds the bitlist to the raw format.
  raw(): Uint8Array[] {
    return [
      new Uint8Array([VerkleNodeType.Leaf]),
      this.stem,
      this.commitment,
      this.c1 ?? new Uint8Array(),
      this.c2 ?? new Uint8Array(),
      ...this.values,
    ]
  }

  setDepth(depth: number): void {
    this.depth = depth
  }
}
