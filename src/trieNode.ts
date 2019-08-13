import * as rlp from 'rlp'
import { keccak256 } from 'ethereumjs-util'
import { stringToNibbles, nibblesToBuffer } from './util/nibbles'
import { isTerminator, addHexPrefix, removeHexPrefix } from './util/hex'

enum NodeType {
  Leaf = 'leaf',
  Branch = 'branch',
  Extension = 'extention', // FIXME
  Unknown = 'unknown', // TODO
}

export class TrieNode {
  raw: Buffer[]
  type: NodeType

  constructor(type: any, key?: any, value?: any) {
    if (Array.isArray(type)) {
      this.raw = type
      this.type = TrieNode.getNodeType(type)
    } else {
      this.type = type
      if (type === 'branch') {
        var values = key
        // @ts-ignore
        this.raw = Array.apply(null, Array(17))
        if (values) {
          values.forEach(function(this: any, keyVal: any) {
            this.set.apply(this, keyVal)
          })
        }
      } else {
        this.raw = Array(2)
        this.setValue(value)
        this.setKey(key)
      }
    }
  }

  /**
   * Determines the node type.
   * @private
   * @returns {String} - the node type
   *   - leaf - if the node is a leaf
   *   - branch - if the node is a branch
   *   - extention - if the node is an extention
   *   - unknown - if something else got borked
   */
  static getNodeType(node: Buffer[]): NodeType {
    if (node.length === 17) {
      return NodeType.Branch
    } else if (node.length === 2) {
      var key = stringToNibbles(node[0])
      if (isTerminator(key)) {
        return NodeType.Leaf
      }

      return NodeType.Extension
    }
    throw new Error('invalid node type')
  }

  static isRawNode(node: any): boolean {
    return Array.isArray(node) && !Buffer.isBuffer(node)
  }

  get value(): Buffer {
    return this.getValue()
  }

  set value(v) {
    this.setValue(v)
  }

  get key(): number[] {
    return this.getKey()
  }

  set key(k) {
    this.setKey(k)
  }

  // TODO: refactor
  setValue(key: Buffer | number, value?: Buffer) {
    if (this.type !== 'branch') {
      this.raw[1] = key as Buffer
    } else {
      if (arguments.length === 1) {
        value = key as Buffer
        key = 16
      }
      this.raw[key as number] = value as Buffer
    }
  }

  // @ts-ignore
  getValue(key?: number): Buffer {
    if (this.type === 'branch') {
      if (arguments.length === 0) {
        key = 16
      }

      var val = this.raw[key as number]
      if (val !== null && val !== undefined && val.length !== 0) {
        return val
      }
    } else {
      return this.raw[1]
    }
  }

  setKey(key: Buffer | number[]) {
    if (this.type !== 'branch') {
      if (Buffer.isBuffer(key)) {
        key = stringToNibbles(key)
      } else {
        key = key.slice(0) // copy the key
      }

      key = addHexPrefix(key, this.type === 'leaf')
      this.raw[0] = nibblesToBuffer(key)
    }
  }

  // @ts-ignore
  getKey(): number[] {
    if (this.type !== 'branch') {
      let key = this.raw[0]
      let nibbles = removeHexPrefix(stringToNibbles(key))
      return nibbles
    }
  }

  serialize(): Buffer {
    return rlp.encode(this.raw)
  }

  hash(): Buffer {
    return keccak256(this.serialize())
  }

  toString(): string {
    // @ts-ignore
    let out = NodeType[this.type]
    out += ': ['
    this.raw.forEach(function(el) {
      if (Buffer.isBuffer(el)) {
        out += el.toString('hex') + ', '
      } else if (el) {
        out += 'object, '
      } else {
        out += 'empty, '
      }
    })
    out = out.slice(0, -2)
    out += ']'
    return out
  }

  getChildren(): (Buffer | number[])[][] {
    var children = []
    switch (this.type) {
      case 'leaf':
        // no children
        break
      case 'extention':
        // one child
        children.push([this.key, this.getValue()])
        break
      case 'branch':
        for (let index = 0, end = 16; index < end; index++) {
          const value = this.getValue(index)
          if (value) {
            children.push([[index], value])
          }
        }
        break
    }
    return children
  }
}
