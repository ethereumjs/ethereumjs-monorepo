import * as assert from 'assert'
import { keccak256, KECCAK256_RLP } from 'ethereumjs-util'
import * as rlp from 'rlp'
import { Nibbles, addHexPrefix, nibblesToBuffer, bufferToNibbles, matchingNibbleLength } from './util'

/**
 * Given a list of leaves with keys sorted in the ascending order,
 * re-creates the trie structure hashing up simultaneously the
 * branches that won't be visited again.
 * Implementation based on:
 * https://github.com/holiman/go-ethereum/blob/b7e737bdd87ba51631837f337d128282ff066d24/trie/stacktrie.go
 */
export function merkleizeList(leaves: Buffer[][]): Buffer {
  let root = new EmptyNode()

  for (let kv of leaves) {
    const key = bufferToNibbles(kv[0])
    root = root.insert(key, kv[1])
  }

  return root.hash()
}

abstract class BaseNode {
  abstract insert(key: Nibbles, value: Buffer): BaseNode;
  abstract raw(): any;
  serialize(): Buffer {
    return rlp.encode(this.raw())
  }
  hash(): Buffer {
    return keccak256(this.serialize())
  }
}

export class EmptyNode extends BaseNode {
  insert(key: Nibbles, value: Buffer): BaseNode {
    return new LeafNode(key, value)
  }

  raw(): any {
    return null
  }

  serialize(): Buffer {
    return Buffer.alloc(0)
  }

  hash(): Buffer {
    return KECCAK256_RLP
  }
}

export class LeafNode extends BaseNode {
  _key: Nibbles
  _value: Buffer

  constructor (key: Nibbles, value: Buffer) {
    super()
    this._key = key
    this._value = value
  }

  insert(key: Nibbles, value: Buffer): BaseNode {
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

  raw(): [Buffer, Buffer] {
    const encodedKey = addHexPrefix(this._key.slice(0), true)
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

  insert(key: Nibbles, value: Buffer): BaseNode {
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
    const childSerialized = rlp.encode(childRaw)
    let value = childSerialized.length < 32 ? childRaw : keccak256(childSerialized)
    const encodedKey = addHexPrefix(this._key.slice(0), false)
    return [nibblesToBuffer(encodedKey), value]
  }
}

export class BranchNode extends BaseNode {
  _children: (BaseNode | null)[]
  _value: Buffer | null

  constructor() {
    super()
    this._children = new Array(16)
    for (let i = 0; i < 16; i++) this._children[i] = null
    this._value = null
  }

  setChild(i: number, child: BaseNode) {
    this._children[i] = child
  }

  insert(key: Nibbles, value: Buffer): BaseNode {
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
      } else if (child instanceof HashNode && (<HashNode> child).embedded) {
        raw.push(child.raw())
      } else {
        const childRaw = child.raw()
        const childSerialized = rlp.encode(childRaw)
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
  _serialized: Buffer

  constructor(ref: BaseNode) {
    super()
    this._ref = ref
    this._serialized = ref.serialize()
  }

  get embedded(): boolean {
    return this._serialized.length < 32
  }

  insert(key: Nibbles, value: Buffer): BaseNode {
    throw new Error('Can\'t insert into hash node')
  }

  raw(): any {
    return this._ref.raw()
  }

  serialize(): Buffer {
    throw new Error('Cant serialize hashnode')
  }

  hash(): Buffer {
    return keccak256(this._serialized)
  }
}
