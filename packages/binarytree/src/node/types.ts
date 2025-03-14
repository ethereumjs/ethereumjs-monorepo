import type { InternalBinaryNode } from './internalNode.ts'
import type { StemBinaryNode } from './stemNode.ts'

export type BinaryNodeType = (typeof BinaryNodeType)[keyof typeof BinaryNodeType]
export const BinaryNodeType = {
  Internal: 0,
  Stem: 1,
} as const

export interface TypedBinaryNode {
  [BinaryNodeType.Internal]: InternalBinaryNode
  [BinaryNodeType.Stem]: StemBinaryNode
}

export type BinaryNode = TypedBinaryNode[BinaryNodeType]

/**
 * @dev A child node in a binary tree internal node.
 * @param hash The hash of the child node.
 * @param path The path to the child node, in bits.
 * */
export type ChildBinaryNode = {
  hash: Uint8Array
  path: number[]
}

interface InternalBinaryNodeOptions {
  children?: (ChildBinaryNode | null)[]
}

interface StemBinaryNodeOptions {
  stem: Uint8Array
  values?: (Uint8Array | null)[]
}

export interface BinaryNodeOptions {
  [BinaryNodeType.Internal]: InternalBinaryNodeOptions
  [BinaryNodeType.Stem]: StemBinaryNodeOptions
}

export const NODE_WIDTH = 256
