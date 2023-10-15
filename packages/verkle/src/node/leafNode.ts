/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseVerkleNode } from './baseVerkleNode.js'
import { NODE_WIDTH, VerkleNodeType } from './types.js'

import type { Point } from '../types.js'
import type { VerkleNodeOptions } from './types.js'

export class LeafNode extends BaseVerkleNode<VerkleNodeType.Leaf> {
  public stem: Uint8Array
  public values: Uint8Array[]
  public c1: Point
  public c2: Point
  public type = VerkleNodeType.Leaf

  constructor(options: VerkleNodeOptions[VerkleNodeType.Leaf]) {
    super(options)

    this.stem = options.stem
    this.values = options.values
    this.c1 = options.c1
    this.c2 = options.c2
  }

  static create(stem: Uint8Array, values: Uint8Array[]): LeafNode {
    throw new Error('Not implemented')
  }

  static fromRawNode(rawNode: Uint8Array[], depth: number): LeafNode {
    const nodeType = rawNode[0][0]
    if (nodeType !== VerkleNodeType.Leaf) {
      throw new Error('Invalid node type')
    }

    // The length of the rawNode should be the # of values (node width) + 5 for the node type, the stem, the commitment and the 2 commitments
    if (rawNode.length !== NODE_WIDTH + 5) {
      throw new Error('Invalid node length')
    }

    const stem = rawNode[1]
    // TODO: Convert the rawNode commitments to points
    const commitment = rawNode[2] as unknown as Point
    const c1 = rawNode[3] as unknown as Point
    const c2 = rawNode[4] as unknown as Point
    const values = rawNode.slice(5, rawNode.length)

    return new LeafNode({ depth, stem, values, c1, c2, commitment })
  }
  commit(): Point {
    throw new Error('Not implemented')
  }

  getValue(index: number): Uint8Array | null {
    return this.values?.[index] ?? null
  }

  insert(key: Uint8Array, value: Uint8Array, nodeResolverFn: () => void): void {
    const values = new Array<Uint8Array>(NODE_WIDTH)
    values[key[31]] = value
    this.insertStem(key.slice(0, 31), values, nodeResolverFn)
  }

  insertMultiple(key: Uint8Array, values: Uint8Array[]): void {
    throw new Error('Not implemented')
  }

  insertStem(key: Uint8Array, value: Uint8Array[], resolver: () => void): void {
    throw new Error('Not implemented')
  }

  // TODO: go-verkle also adds the bitlist to the raw format.
  raw(): Uint8Array[] {
    return [
      new Uint8Array([VerkleNodeType.Leaf]),
      this.stem,
      this.commitment.bytes(),
      this.c1.bytes(),
      this.c2.bytes(),
      ...this.values,
    ]
  }

  setDepth(depth: number): void {
    this.depth = depth
  }
}
