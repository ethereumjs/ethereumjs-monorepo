import { BaseVerkleNode } from './baseVerkleNode.js'

import type { CommitmentPoint } from '../types'
import type { VerkleNodeOptions, VerkleNodeType } from './types'

export class LeafNode extends BaseVerkleNode<VerkleNodeType.Leaf> {
  public stem: Uint8Array
  public values: Uint8Array[]
  public c1: CommitmentPoint
  public c2: CommitmentPoint

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
}
