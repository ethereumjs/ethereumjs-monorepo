import { RLP } from '@ethereumjs/rlp'

import { type VerkleNodeInterface, type VerkleNodeOptions, type VerkleNodeType } from './types.ts'

import type { VerkleCrypto } from '@ethereumjs/util'

export abstract class BaseVerkleNode<T extends VerkleNodeType> implements VerkleNodeInterface {
  public commitment: Uint8Array
  protected verkleCrypto: VerkleCrypto
  constructor(options: VerkleNodeOptions[T]) {
    this.commitment = options.commitment
    this.verkleCrypto = options.verkleCrypto
  }

  // Hash returns the field representation of the commitment.
  hash(): Uint8Array {
    return this.verkleCrypto.hashCommitment(this.commitment)
  }

  // Returns an array of Uint8Arrays containing the values necessary to reconstruct a node from the DB (where we store them in a RLP serialized format)
  abstract raw(): Uint8Array[]

  /**
   * @returns the RLP serialized node
   */
  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }
}
