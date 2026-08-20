import type { InternalBinaryNode } from './internalNode.ts'
import type { StemBinaryNode } from './stemNode.ts'

/** Discriminator for decoded binary tree node variants. */
export type BinaryNodeType = (typeof BinaryNodeType)[keyof typeof BinaryNodeType]

/** Node kind constants: internal branch vs stem leaf bucket. */
export const BinaryNodeType = {
  Internal: 0,
  Stem: 1,
} as const

/** Maps each {@link BinaryNodeType} to its concrete node class. */
export interface TypedBinaryNode {
  [BinaryNodeType.Internal]: InternalBinaryNode
  [BinaryNodeType.Stem]: StemBinaryNode
}

/** Union of all decoded binary tree node types. */
export type BinaryNode = TypedBinaryNode[BinaryNodeType]

/**
 * Child reference stored in an internal node.
 *
 * @param hash Child node commitment hash
 * @param path Bit path from this internal node to the child
 */
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

/** Constructor options keyed by {@link BinaryNodeType}. */
export interface BinaryNodeOptions {
  [BinaryNodeType.Internal]: InternalBinaryNodeOptions
  [BinaryNodeType.Stem]: StemBinaryNodeOptions
}

/** Number of suffix slots in a stem node. */
export const NODE_WIDTH = 256
