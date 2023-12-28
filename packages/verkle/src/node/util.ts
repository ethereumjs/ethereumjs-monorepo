import { RLP } from '@ethereumjs/rlp'

import { InternalNode } from './internalNode.js'
import { LeafNode } from './leafNode.js'
import { type VerkleNode, VerkleNodeType } from './types.js'

export function decodeRawNode(raw: Uint8Array[]): VerkleNode {
  const nodeType = raw[0][0]
  const depth = 0
  switch (nodeType) {
    case VerkleNodeType.Internal:
      return InternalNode.fromRawNode(raw, depth)
    case VerkleNodeType.Leaf:
      return LeafNode.fromRawNode(raw, depth)
    default:
      throw new Error('Invalid node type')
  }
}

export function decodeNode(raw: Uint8Array) {
  const decoded = RLP.decode(Uint8Array.from(raw)) as Uint8Array[]
  if (!Array.isArray(decoded)) {
    throw new Error('Invalid node')
  }
  return decodeRawNode(decoded)
}

export function isRawNode(node: Uint8Array | Uint8Array[]): node is Uint8Array[] {
  return Array.isArray(node) && !(node instanceof Uint8Array)
}
