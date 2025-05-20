import { RLP } from '@ethereumjs/rlp'

import type { BranchMPTNodeBranchValue, NodeReferenceOrRawMPTNode } from '../types.ts'

export class BranchMPTNode {
  _branches: BranchMPTNodeBranchValue[]
  _value: Uint8Array | null

  constructor() {
    this._branches = new Array(16).fill(null)
    this._value = null
  }

  static fromArray(arr: Uint8Array[]): BranchMPTNode {
    const node = new BranchMPTNode()
    node._branches = arr.slice(0, 16)
    node._value = arr[16]
    return node
  }

  value(v?: Uint8Array | null): Uint8Array | null {
    if (v !== null && v !== undefined) {
      this._value = v
    }

    return this._value && this._value.length > 0 ? this._value : null
  }

  setBranch(i: number, v: BranchMPTNodeBranchValue) {
    this._branches[i] = v
  }

  raw(): BranchMPTNodeBranchValue[] {
    return [...this._branches, this._value]
  }

  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }

  getBranch(i: number): BranchMPTNodeBranchValue {
    const b = this._branches[i]
    if (b !== null && b.length > 0) {
      return b
    } else {
      return null
    }
  }

  getChildren(): [number, NodeReferenceOrRawMPTNode][] {
    const children: [number, NodeReferenceOrRawMPTNode][] = []
    for (let i = 0; i < 16; i++) {
      const b = this._branches[i]
      if (b !== null && b.length > 0) {
        children.push([i, b])
      }
    }
    return children
  }
}
