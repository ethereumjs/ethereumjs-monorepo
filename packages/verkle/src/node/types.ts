import { type VerkleCrypto } from '@ethereumjs/util'

import type { InternalVerkleNode } from './internalNode.js'
import type { LeafVerkleNode } from './leafNode.js'

export enum VerkleNodeType {
  Internal,
  Leaf,
}

export interface ChildNode {
  commitment: Uint8Array // 64 byte commitment to child node
  path: Uint8Array // path/partial stem to child node (used as DB key)
}
export interface TypedVerkleNode {
  [VerkleNodeType.Internal]: InternalVerkleNode
  [VerkleNodeType.Leaf]: LeafVerkleNode
}

export type VerkleNode = TypedVerkleNode[VerkleNodeType]

export interface VerkleNodeInterface {
  hash(): Uint8Array
  serialize(): Uint8Array
}

interface BaseVerkleNodeOptions {
  commitment: Uint8Array
  verkleCrypto: VerkleCrypto
}

interface InternalVerkleNodeOptions extends BaseVerkleNodeOptions {
  // Children nodes of this internal node.
  children?: (ChildNode | null)[]
}

export enum LeafVerkleNodeValue {
  Untouched = 0,
  Deleted = 1,
}
interface LeafVerkleNodeOptions extends BaseVerkleNodeOptions {
  stem: Uint8Array
  values?: (Uint8Array | LeafVerkleNodeValue)[]
  c1?: Uint8Array
  c2?: Uint8Array
}

export interface VerkleNodeOptions {
  [VerkleNodeType.Internal]: InternalVerkleNodeOptions
  [VerkleNodeType.Leaf]: LeafVerkleNodeOptions
}

export const NODE_WIDTH = 256
