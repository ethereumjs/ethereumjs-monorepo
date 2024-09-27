import { RLP } from '@ethereumjs/rlp'

export class BranchNode {
  _branches: (Uint8Array | Uint8Array[] | null)[]
  _value: Uint8Array

  constructor() {
    this._branches = new Array(16).fill(null)
    this._value = new Uint8Array(0)
  }

  static fromArray(arr: Uint8Array[]): BranchNode {
    const node = new BranchNode()
    node._branches = arr.slice(0, 16)
    node._value = arr[16]
    return node
  }

  value(v?: Uint8Array): Uint8Array {
    if (v !== undefined) {
      this._value = v
    }

    return this._value
  }

  setBranch(i: number, v: Uint8Array | Uint8Array[] | null) {
    this._branches[i] = v
  }

  raw(): (Uint8Array | Uint8Array[] | null)[] {
    return [...this._branches, this._value]
  }

  serialize(): Uint8Array {
    return RLP.encode(this.raw() as Uint8Array[])
  }

  getBranch(i: number) {
    const b = this._branches[i]
    if (b !== null && b.length > 0) {
      return b
    } else {
      return null
    }
  }

  getChildren(): [number, Uint8Array | Uint8Array[]][] {
    const children: [number, Uint8Array | Uint8Array[]][] = []
    for (let i = 0; i < 16; i++) {
      const b = this._branches[i]
      if (b !== null && b.length > 0) {
        children.push([i, b])
      }
    }
    return children
  }
}
