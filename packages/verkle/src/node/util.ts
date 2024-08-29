import { RLP } from '@ethereumjs/rlp'
import { setLengthRight } from '@ethereumjs/util'

import { InternalNode } from './internalNode.js'
import { LeafNode } from './leafNode.js'
import { VerkleLeafNodeValue, type VerkleNode, VerkleNodeType } from './types.js'

import type { VerkleCrypto } from '@ethereumjs/util'

export function decodeRawNode(raw: Uint8Array[], verkleCrypto: VerkleCrypto): VerkleNode {
  const nodeType = raw[0][0]
  switch (nodeType) {
    case VerkleNodeType.Internal:
      return InternalNode.fromRawNode(raw, verkleCrypto)
    case VerkleNodeType.Leaf:
      return LeafNode.fromRawNode(raw, verkleCrypto)
    default:
      throw new Error('Invalid node type')
  }
}

export function decodeNode(raw: Uint8Array, verkleCrypto: VerkleCrypto) {
  const decoded = RLP.decode(Uint8Array.from(raw)) as Uint8Array[]
  if (!Array.isArray(decoded)) {
    throw new Error('Invalid node')
  }
  return decodeRawNode(decoded, verkleCrypto)
}

export function isRawNode(node: Uint8Array | Uint8Array[]): node is Uint8Array[] {
  return Array.isArray(node) && !(node instanceof Uint8Array)
}

export function isLeafNode(node: VerkleNode): node is LeafNode {
  return node.type === VerkleNodeType.Leaf
}

export function isInternalNode(node: VerkleNode): node is InternalNode {
  return node.type === VerkleNodeType.Internal
}

export const createUntouchedLeafValue = () => new Uint8Array(32)

/**
 * Generates a 32 byte array of zeroes and sets the 129th bit to 1, which the EIP
 * refers to as the leaf marker to indicate a leaf value that has been touched previously
 * and contains only zeroes
 *
 * Note: this value should only used in the commitment update process
 *
 * @returns a 32 byte array of zeroes with the 129th bit set to 1
 */
export const createDeletedLeafValue = () => {
  const bytes = new Uint8Array(32)
  // Set the 129th bit to 1 directly by setting the 17th byte (index 16) to 0x80
  bytes[16] = 0x80

  return bytes
}

export const createDefaultLeafValues = () => new Array(256).fill(0)

/***
 * Converts 128 32byte values of a leaf node into an array of 256 32 byte values representing
 * the first and second 16 bytes of each value right padded with zeroes for generating a
 * commitment for half of a leaf node's values
 * @param values - an array of Uint8Arrays representing the first or second set of 128 values
 * stored by the verkle trie leaf node
 * Returns an array of 256 32 byte UintArrays with the leaf marker set for each value that is
 * deleted
 */
export const createCValues = (values: (Uint8Array | VerkleLeafNodeValue)[]) => {
  if (values.length !== 128)
    throw new Error(`got wrong number of values, expected 128, got ${values.length}`)
  const expandedValues: Uint8Array[] = new Array(256)
  for (let x = 0; x < 128; x++) {
    const retrievedValue = values[x]
    let val: Uint8Array
    switch (retrievedValue) {
      case VerkleLeafNodeValue.Untouched: // Leaf value that has never been written before
        val = createUntouchedLeafValue()
        break
      case VerkleLeafNodeValue.Deleted: // Leaf value that has been written with zeros (either zeroes or a deleted value)
        val = createDeletedLeafValue()
        break
      default:
        val = retrievedValue
        break
    }
    // We add 16 trailing zeros to each value since all commitments are padded to an array of 32 byte values
    expandedValues[x * 2] = setLengthRight(val.slice(0, 16), 32)
    // Apply leaf marker to all touched values (i.e. flip 129th bit)
    if (retrievedValue !== VerkleLeafNodeValue.Untouched) expandedValues[x * 2][16] = 0x80
    expandedValues[x * 2 + 1] = setLengthRight(val.slice(16), 32)
  }
  return expandedValues
}
