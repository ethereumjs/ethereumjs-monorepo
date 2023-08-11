import type { CommitmentPoint } from '../types.js'
import type { InternalNode } from './internalNode.js'
import type { LeafNode } from './leafNode.js'

export enum VerkleNodeType {
  Internal,
  Leaf,
}

export interface TypedVerkleNode {
  [VerkleNodeType.Internal]: InternalNode
  [VerkleNodeType.Leaf]: LeafNode
}

export type VerkleNode = TypedVerkleNode[VerkleNodeType]

export interface VerkleNodeInterface {
  commit(): Uint8Array
  hash(): any
  serialize(): Uint8Array
}

interface BaseVerkleNodeOptions {
  // Value of the commitment
  commitment: CommitmentPoint
}

interface VerkleInternalNodeOptions extends BaseVerkleNodeOptions {
  // List of children node references of this internal node.
  children: Uint8Array[]

  // Values of the child commitments before the trie is modified by inserts.
  // This is useful because the delta of the child commitments can be used to efficiently update the node's commitment
  copyOnWrite: Record<string, CommitmentPoint>
}
interface VerkleLeafNodeOptions extends BaseVerkleNodeOptions {
  stem: Uint8Array
  values: Uint8Array[]
  c1: CommitmentPoint
  c2: CommitmentPoint
}

export interface VerkleNodeOptions {
  [VerkleNodeType.Internal]: VerkleInternalNodeOptions
  [VerkleNodeType.Leaf]: VerkleLeafNodeOptions
}

export const NODE_WIDTH = 256
