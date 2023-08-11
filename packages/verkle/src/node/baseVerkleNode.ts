import { RLP } from '@ethereumjs/rlp'

import type { CommitmentPoint } from '../types.js'
import type { VerkleNodeInterface, VerkleNodeOptions, VerkleNodeType } from './types.js'

export abstract class BaseVerkleNode<T extends VerkleNodeType> implements VerkleNodeInterface {
  public commitment: CommitmentPoint

  constructor(options: VerkleNodeOptions[T]) {
    this.commitment = options.commitment
  }

  abstract commit(): CommitmentPoint

  // Hash returns the field representation of the commitment.
  hash(): any {
    throw new Error('Not implemented')
  }

  abstract raw(): Uint8Array[]

  /**
   * @returns the RLP serialized node
   */
  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }
}
