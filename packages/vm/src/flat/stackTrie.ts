import { RLP } from '@ethereumjs/rlp'
import { matchingNibbleLength } from '@ethereumjs/trie'
import { KECCAK256_RLP, addHexPrefix, bytesToHex } from '@ethereumjs/util'
import * as assert from 'assert'
import { keccak256 } from 'ethereum-cryptography/keccak'

import type { Nibbles } from '@ethereumjs/trie'

// can potentially keep the stack trie in the trie package since it uses trie package types like nibbles and helpers,
// and import it in vm flat directory for integration with snapshot and statemanager

// TODO have to rename this function or the other since there are two nibblesToBytes being exported from trie package
function nibblestoBytes(arr: Nibbles): Uint8Array {
  const buf = new Uint8Array(arr.length / 2)
  for (let i = 0; i < buf.length; i++) {
    let q = i * 2
    buf[i] = (arr[q] << 4) + arr[++q]
  }
  return buf
}

// TODO have to rename this function or the other since there are two bytesToNibbles being exported from trie package
function bytesToNibbles(key: Uint8Array): Nibbles {
  const bkey = toBytes(key)
  const nibbles = [] as Nibbles

  for (let i = 0; i < bkey.length; i++) {
    let q = i * 2
    nibbles[q] = bkey[i] >> 4
    ++q
    nibbles[q] = bkey[i] % 16
  }

  return nibbles
}

///

/**
 * Given a list of leaves with keys sorted in the ascending order,
 * re-creates the trie structure hashing up simultaneously the
 * branches that won't be visited again.
 * Implementation based on:
 * https://github.com/holiman/go-ethereum/blob/b7e737bdd87ba51631837f337d128282ff066d24/trie/stacktrie.go
 */
export function merkleizeList(leaves: Uint8Array[][]): Uint8Array {
  let root = new EmptyNode()

  for (const kv of leaves) {
    const key = bytesToNibbles(kv[0])
    root = root.insert(key, kv[1])
  }

  return root.hash()
}

abstract class BaseNode {
  abstract insert(key: Nibbles, value: Uint8Array): BaseNode
  abstract raw(): any
  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }
  hash(): Uint8Array {
    return keccak256(this.serialize())
  }
}

export class EmptyNode extends BaseNode {
  insert(key: Nibbles, value: Uint8Array): BaseNode {
    return new LeafNode(key, value)
  }

  raw(): any {
    return null
  }

  serialize(): Uint8Array {
    return new Uint8Array()
  }

  hash(): Uint8Array {
    return KECCAK256_RLP
  }
}

export class LeafNode extends BaseNode {
  _key: Nibbles
  _value: Uint8Array

  constructor(key: Nibbles, value: Uint8Array) {
    super()
    this._key = key
    this._value = value
  }

  insert(key: Nibbles, value: Uint8Array): BaseNode {
    const commonLen = matchingNibbleLength(this._key, key)
    assert(commonLen < this._key.length, 'replacing leaf is not supported')

    const newLeaf = new LeafNode(key.slice(commonLen + 1), value)
    const branch = new BranchNode()
    branch.setChild(key[commonLen], newLeaf)
    branch.setChild(this._key[commonLen], this)

    let root: BaseNode = branch
    // Need extension node for common path
    if (commonLen > 0) {
      root = new ExtensionNode(this._key.slice(0, commonLen), branch)
    }

    // Slice common part from current leaf's key
    this._key = this._key.slice(commonLen + 1)

    return root
  }

  raw(): [Uint8Array, Uint8Array] {
    const encodedKey = addHexPrefix(this._key.slice(0), true) // the true is for adding terminator
    return [nibblesToBuffer(encodedKey), this._value]
  }
}

export class ExtensionNode extends BaseNode {
  _key: Nibbles
  _child: BaseNode

  constructor(key: Nibbles, child: BaseNode) {
    super()
    this._key = key
    this._child = child
  }

  insert(key: Nibbles, value: Uint8Array): BaseNode {
    const commonLen = matchingNibbleLength(this._key, key)
    // If matching prefix, recurse into child node
    if (this._key.length === commonLen) {
      this._child = this._child.insert(key.slice(commonLen), value)
      return this
    }

    // Otherwise we'll need a new leaf, a branch and possibly an extension
    const newLeaf = new LeafNode(key.slice(commonLen + 1), value)
    const branch = new BranchNode()
    branch.setChild(key[commonLen], newLeaf)

    if (commonLen < this._key.length - 1) {
      branch.setChild(this._key[commonLen], this)
      this._key = this._key.slice(commonLen + 1)
    } else {
      branch.setChild(this._key[commonLen], this._child)
    }

    let root: BaseNode = branch
    // Need extension for common prefix
    if (commonLen > 0) {
      root = new ExtensionNode(key.slice(0, commonLen), branch)
    }

    return root
  }

  raw(): any {
    const childRaw = this._child.raw()
    const childSerialized = RLP.encode(childRaw)
    const value = childSerialized.length < 32 ? childRaw : keccak256(childSerialized)
    const encodedKey = addHexPrefix(this._key.slice(0), false)
    return [nibblesToBuffer(encodedKey), value]
  }
}

export class BranchNode extends BaseNode {
  _children: (BaseNode | null)[]
  _value: Uint8Array | null

  constructor() {
    super()
    this._children = new Array(16)
    for (let i = 0; i < 16; i++) this._children[i] = null
    this._value = null
  }

  setChild(i: number, child: BaseNode) {
    this._children[i] = child
  }

  insert(key: Nibbles, value: Uint8Array): BaseNode {
    const i = key[0]
    if (!this._children[i]) {
      this._children[i] = new EmptyNode()
    }
    // Hash previously explored branches. We can do this because we assume
    // leaves are being inserted in the ascending key order.
    for (let j = 0; j < i; j++) {
      if (!this._children[j] || this._children[j] instanceof HashNode) continue
      this._children[j] = new HashNode(this._children[j]!)
    }
    this._children[i] = this._children[i]!.insert(key.slice(1), value)
    return this
  }

  raw(): any {
    const raw = []
    for (let i = 0; i < 16; i++) {
      const child = this._children[i]
      if (!child) {
        raw.push(null)
      } else if (child instanceof HashNode && (<HashNode>child).embedded) {
        raw.push(child.raw())
      } else {
        const childRaw = child.raw()
        const childSerialized = RLP.encode(childRaw)
        if (childSerialized.length < 32) {
          raw.push(childRaw)
        } else {
          raw.push(keccak256(childSerialized))
        }
      }
    }
    raw.push(this._value)
    return raw
  }
}

// TODO: Either remove HashNode or precompute hash
//       to save on iterating already visited sub-tries.
export class HashNode extends BaseNode {
  _ref: BaseNode
  _serialized: Uint8Array

  constructor(ref: BaseNode) {
    super()
    this._ref = ref
    this._serialized = ref.serialize()
  }

  get embedded(): boolean {
    return this._serialized.length < 32
  }

  // eslint-disable-next-line
  insert(key: Nibbles, value: Uint8Array): BaseNode {
    throw new Error("Can't insert into hash node")
  }

  raw(): any {
    return this._ref.raw()
  }

  serialize(): Uint8Array {
    throw new Error('Cant serialize hashnode')
  }

  hash(): Uint8Array {
    return keccak256(this._serialized)
  }
}
