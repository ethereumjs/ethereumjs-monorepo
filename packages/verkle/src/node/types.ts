import type { CommitmentPoint } from '../types'
import type { InternalNode } from './internalNode'
import type { LeafNode } from './leafNode'

export enum VerkleNodeType {
  Internal = 'Internal',
  Leaf = 'Leaf',
}

export interface VerkleNode {
  [VerkleNodeType.Internal]: InternalNode
  [VerkleNodeType.Leaf]: LeafNode
}

export interface VerkleNodeInterface {
  commit(): Uint8Array
  hash(): any
  serialize(): Uint8Array
}

interface BaseVerkleNodeOptions {
  // Node depth in the trie, in bits
  depth: number

  // Value of the commitment
  commitment: CommitmentPoint

  // Node type (leaf or internal)
  type: VerkleNodeType
}

interface VerkleInternalNodeOptions extends BaseVerkleNodeOptions {
  // List of child nodes of this internal node.
  children: Array<InternalNode | LeafNode>

  // Values of the child commitments before the trie is modified by inserts.
  // This is useful because the delta of the child commitments can be used to efficiently update the node's commitment
  copyOnWrite: Record<string, CommitmentPoint>
  type: VerkleNodeType.Internal
}
interface VerkleLeafNodeOptions extends BaseVerkleNodeOptions {
  stem: Uint8Array
  values: Uint8Array[]
  c1: CommitmentPoint
  c2: CommitmentPoint
  type: VerkleNodeType.Leaf
}

export interface VerkleNodeOptions {
  [VerkleNodeType.Internal]: VerkleInternalNodeOptions
  [VerkleNodeType.Leaf]: VerkleLeafNodeOptions
}
