export interface VerkleNodeOptions {
  node: InternalNode | LeafNode
}

export class VerkleNode {
  // TODO?: Directly make the VerkleNode either an InternalNode of LeafNode instead of having a node property
  public node: InternalNode | LeafNode

  constructor(options: VerkleNodeOptions) {
    this.node = options.node
  }
  // Commit computes the commitment of the node. The
  // result (the curve point) is cached.
  commit(): Point {
    throw new Error('Not implemented')
  }

  getCommitment(): Point {
    return this.node.commitment
  }

  getDepth(): number {
    return this.node.depth
  }

  // Hash returns the field representation of the commitment.
  hash(): any {
    throw new Error('Not implemented')
  }

  // TODO: Turn these two into typeguards?
  isInternalNode(): boolean {
    throw new Error('Not implemented')
  }

  isLeafNode(): boolean {
    throw new Error('Not implemented')
  }

  // Serialize encodes the node to RLP.
  serialize(): Uint8Array {
    throw new Error('Not implemented')
  }
}

type Point = any

interface BaseNode {
  // Node depth in the trie, in bits
  depth: number

  // Value of the commitment
  commitment: Point
}

// Represents an internal node (a non-leaf node)
export interface InternalNode extends BaseNode {
  // List of child nodes of this internal node.
  children: VerkleNode[]

  // Values of the child commitments before the trie is modified by inserts.
  copyOnWrite: Record<string, Point>
}

export interface LeafNode extends BaseNode {
  stem: Uint8Array
  values: Uint8Array[]
  c1: Point
  c2: Point
}
