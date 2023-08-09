import { RLP } from '@ethereumjs/rlp'

import type { VerkleNode } from './types'

export function decodeRawNode(raw: Uint8Array[]): VerkleNode {
  // TODO: Differentiate between LeafNode and InternalNode and build accordingly
  throw new Error('Not implemented')
  // if (raw.length === 17) {
  //   return BranchNode.fromArray(raw)
  // } else if (raw.length === 2) {
  //   const nibbles = bytesToNibbles(raw[0])
  //   if (isTerminator(nibbles)) {
  //     return new LeafNode(LeafNode.decodeKey(nibbles), raw[1])
  //   }
  //   return new ExtensionNode(ExtensionNode.decodeKey(nibbles), raw[1])
  // } else {
  //   throw new Error('Invalid node')
  // }
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
