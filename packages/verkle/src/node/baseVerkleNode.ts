import { RLP } from '@ethereumjs/rlp'

import {
  NODE_WIDTH,
  type VerkleNodeInterface,
  type VerkleNodeOptions,
  type VerkleNodeType,
} from './types.js'

import type { CommitmentPoint } from '../types.js'

export abstract class BaseVerkleNode<T extends VerkleNodeType> implements VerkleNodeInterface {
  public commitment: CommitmentPoint
  public depth: number

  constructor(options: VerkleNodeOptions[T]) {
    this.commitment = options.commitment
    this.depth = options.depth
  }

  abstract commit(): CommitmentPoint

  // Hash returns the field representation of the commitment.
  hash(): any {
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
