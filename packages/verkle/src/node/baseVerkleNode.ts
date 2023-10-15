import { RLP } from '@ethereumjs/rlp'

import { type VerkleNodeInterface, type VerkleNodeOptions, type VerkleNodeType } from './types.js'

import type { Point } from '../types.js'

export abstract class BaseVerkleNode<T extends VerkleNodeType> implements VerkleNodeInterface {
  public commitment: Point
  public depth: number

  constructor(options: VerkleNodeOptions[T]) {
    this.commitment = options.commitment
    this.depth = options.depth
  }

  abstract commit(): Point

  // Hash returns the field representation of the commitment.
  hash(): Uint8Array {
    throw new Error('Not implemented')
  }

  abstract insert(key: Uint8Array, value: Uint8Array, nodeResolverFn: () => void): void

  abstract raw(): Uint8Array[]

  /**
   * @returns the RLP serialized node
   */
  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }
}
