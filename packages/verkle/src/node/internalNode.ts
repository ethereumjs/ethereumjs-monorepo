import { BaseVerkleNode } from './baseVerkleNode.js'
import { NODE_WIDTH, VerkleNodeType } from './types.js'

import type { CommitmentPoint } from '../types.js'
import type { VerkleNodeOptions } from './types.js'

export class InternalNode extends BaseVerkleNode<VerkleNodeType.Internal> {
  // Array of references to children nodes
  public children: CommitmentPoint[]
  public copyOnWrite: Record<string, CommitmentPoint>
  public type = VerkleNodeType.Internal

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

  static fromRawNode(rawNode: Uint8Array[]): InternalNode {
    const nodeType = rawNode[0][0]
    if (nodeType !== VerkleNodeType.Internal) {
      throw new Error('Invalid node type')
    }

    // The length of the rawNode should be the # of children, + 2 for the node type and the commitment
    if (rawNode.length !== NODE_WIDTH + 2) {
      throw new Error('Invalid node length')
    }

    const children = rawNode.slice(1, NODE_WIDTH + 2)
    const commitment = rawNode[rawNode.length - 1]

    return new InternalNode({ children, commitment, copyOnWrite: {} })
  }

  getChildren(index: number): Uint8Array | null {
    return this.children?.[index] ?? null
  }

  insert(key: Uint8Array, value: Uint8Array, resolver: () => void): void {
    const values = new Array<Uint8Array>(NODE_WIDTH)
    values[key[31]] = value
    this.insertStem(key.slice(0, 31), values, resolver)
  }

  insertStem(key)

  // TODO: go-verkle also adds the bitlist to the raw format.
  raw(): Uint8Array[] {
    return [new Uint8Array([VerkleNodeType.Internal]), ...this.children, this.commitment]
  }
}
