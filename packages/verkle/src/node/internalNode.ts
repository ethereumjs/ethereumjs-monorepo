import { BaseVerkleNode } from './baseVerkleNode.js'

import type { CommitmentPoint } from '../types.js'
import type { LeafNode } from './leafNode.js'
import type { VerkleNodeOptions, VerkleNodeType } from './types.js'

export class InternalNode extends BaseVerkleNode<VerkleNodeType.Internal> {
  public children: Array<InternalNode | LeafNode>
  public copyOnWrite: Record<string, CommitmentPoint>

  constructor(options: VerkleNodeOptions[VerkleNodeType.Internal]) {
    super(options)
    this.children = options.children
    this.copyOnWrite = options.copyOnWrite
  }

  commit(): Uint8Array {
    throw new Error('Not implemented')
    // const commit = TODO
    // this.commit = commit
  }
}
