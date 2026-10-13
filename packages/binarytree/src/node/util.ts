import { RLP } from '@ethereumjs/rlp'
import { EthereumJSErrorWithoutCode } from '@ethereumjs/util'

import { InternalBinaryNode } from './internalNode.ts'
import { StemBinaryNode } from './stemNode.ts'
import { type BinaryNode, BinaryNodeType } from './types.ts'

/** Decode a raw RLP node array into a typed binary tree node. */
export function decodeRawBinaryNode(raw: Uint8Array[]): BinaryNode {
  const nodeType = raw[0][0]
  switch (nodeType) {
    case BinaryNodeType.Internal:
      return InternalBinaryNode.fromRawNode(raw)
    case BinaryNodeType.Stem:
      return StemBinaryNode.fromRawNode(raw)
    default:
      throw EthereumJSErrorWithoutCode('Invalid node type')
  }
}

/** Decode an RLP-serialized binary tree node from bytes. */
export function decodeBinaryNode(raw: Uint8Array) {
  const decoded = RLP.decode(Uint8Array.from(raw)) as Uint8Array[]
  if (!Array.isArray(decoded)) {
    throw EthereumJSErrorWithoutCode('Invalid node')
  }
  return decodeRawBinaryNode(decoded)
}

/** Type guard: value is a raw (non-RLP-wrapped) node array. */
export function isRawBinaryNode(node: Uint8Array | Uint8Array[]): node is Uint8Array[] {
  return Array.isArray(node) && !(node instanceof Uint8Array)
}

/** Type guard for {@link InternalBinaryNode}. */
export function isInternalBinaryNode(node: BinaryNode): node is InternalBinaryNode {
  return node.type === BinaryNodeType.Internal
}

/** Type guard for {@link StemBinaryNode}. */
export function isStemBinaryNode(node: BinaryNode): node is StemBinaryNode {
  return node.type === BinaryNodeType.Stem
}
