import type { CommitmentPoint } from '../types'
import type { VerkleNodeInterface, VerkleNodeOptions, VerkleNodeType } from './types'

export abstract class BaseVerkleNode<T extends VerkleNodeType> implements VerkleNodeInterface {
  // TODO?: Directly make the VerkleNode either an InternalNode of LeafNode instead of having a node property
  public commitment: CommitmentPoint
  public depth: number
  public type: T

  constructor(options: VerkleNodeOptions[T]) {
    this.commitment = options.commitment
    this.depth = options.depth
    this.type = options.type as T
  }
  // Commit computes the commitment of the node. The
  // result (the curve point) is cached.
  abstract commit(): CommitmentPoint

  // Hash returns the field representation of the commitment.
  hash(): any {
    throw new Error('Not implemented')
  }

  // Serialize encodes the node to RLP.
  serialize(): Uint8Array {
    throw new Error('Not implemented')
  }
}
