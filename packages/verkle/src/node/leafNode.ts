import { BaseVerkleNode } from './baseVerkleNode.js'
import { NODE_WIDTH, VerkleNodeType } from './types'

import type { CommitmentPoint } from '../types'
import type { VerkleNodeOptions } from './types'

export class LeafNode extends BaseVerkleNode<VerkleNodeType.Leaf> {
  public stem: Uint8Array
  public values: Uint8Array[]
  public c1: CommitmentPoint
  public c2: CommitmentPoint
  public type = VerkleNodeType.Leaf

  constructor(options: VerkleNodeOptions[VerkleNodeType.Leaf]) {
    super(options)

    this.stem = options.stem
    this.values = options.values
    this.c1 = options.c1
    this.c2 = options.c2
  }

  commit(): Uint8Array {
    throw new Error('Not implemented')
    // const commit = TODO
    // this.commit = commit
  }

  fromValuesArray(rawNode: Uint8Array[]): LeafNode {
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

    return new LeafNode({ stem, values, c1, c2, commitment })
  }

  getValue(index: number): Uint8Array | null {
    return this.values?.[index] ?? null
  }

  // TODO: go-verkle also adds the bitlist to the raw format.
  raw(): Uint8Array[] {
    return [
      new Uint8Array([VerkleNodeType.Leaf]),
      this.stem,
      this.commitment,
      this.c1,
      this.c2,
      ...this.values,
    ]
  }
}
