import { BaseVerkleNode } from './baseVerkleNode.js'
import { NODE_WIDTH, VerkleNodeType } from './types.js'

import type { CommitmentPoint } from '../types.js'
import type { VerkleNodeOptions } from './types.js'

export class LeafNode extends BaseVerkleNode<VerkleNodeType.Leaf> {
  public stem: Uint8Array
  public values: Uint8Array[]
  public c1: CommitmentPoint
  public c2: CommitmentPoint
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

    /*
    const cfg = GetConfig();

// C1.
const c1poly: Fr[] = new Array<NodeWidth>();
const c1: Point = new Point();
let count: number;
let err: Error;
[count, err] = fillSuffixTreePoly(c1poly, values.slice(0, NodeWidth / 2));
if (err) {
  return [null, err];
}
const containsEmptyCodeHash: boolean =
  c1poly.length >= EmptyCodeHashSecondHalfIdx &&
  c1poly[EmptyCodeHashFirstHalfIdx].Equal(EmptyCodeHashFirstHalfValue) &&
  c1poly[EmptyCodeHashSecondHalfIdx].Equal(EmptyCodeHashSecondHalfValue);
if (containsEmptyCodeHash) {
  // Clear out values of the cached point.
  c1poly[EmptyCodeHashFirstHalfIdx] = FrZero;
  c1poly[EmptyCodeHashSecondHalfIdx] = FrZero;
  // Calculate the remaining part of c1 and add to the base value.
  const partialc1: Point = cfg.CommitToPoly(c1poly, NodeWidth - count - 2);
  c1.Add(EmptyCodeHashPoint, partialc1);
} else {
  c1.Copy(cfg.CommitToPoly(c1poly, NodeWidth - count));
}

// C2.
const c2poly: Fr[] = new Array<NodeWidth>();
[count, err] = fillSuffixTreePoly(c2poly, values.slice(NodeWidth / 2));
if (err) {
  return [null, err];
}
const c2: Point = cfg.CommitToPoly(c2poly, NodeWidth - count);

// Root commitment preparation for calculation.
stem = stem.slice(0, StemSize); // enforce a 31-byte length
const poly: Fr[] = new Array<NodeWidth>();
poly[0].SetUint64(1);
err = StemFromBytes(poly[1], stem);
if (err) {
  return [null, err];
}
toFrMultiple([poly[2], poly[3]], [c1, c2]);

return {
  // depth will be 0, but the commitment calculation
  // does not need it, and so it won't be free.
  values: values,
  stem: stem,
  commitment: cfg.CommitToPoly(poly, NodeWidth - 4),
  c1: c1,
  c2: c2,
}; */
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
    const commitment = rawNode[2]
    const c1 = rawNode[3]
    const c2 = rawNode[4]
    const values = rawNode.slice(5, rawNode.length)

    return new LeafNode({ depth, stem, values, c1, c2, commitment })
  }
  commit(): Uint8Array {
    throw new Error('Not implemented')
    // const commit = TODO
    // this.commit = commit
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
      this.commitment,
      this.c1,
      this.c2,
      ...this.values,
    ]
  }

  setDepth(depth: number): void {
    this.depth = depth
  }
}
