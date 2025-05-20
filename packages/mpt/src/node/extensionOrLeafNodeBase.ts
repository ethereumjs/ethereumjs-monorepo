import { RLP } from '@ethereumjs/rlp'

import { addHexPrefix, removeHexPrefix } from '../util/hex.ts'
import { nibblesTypeToPackedBytes } from '../util/nibbles.ts'

import type { Nibbles, RawExtensionMPTNode, RawLeafMPTNode } from '../types.ts'

export abstract class ExtensionOrLeafMPTNodeBase {
  _nibbles: Nibbles
  _value: Uint8Array
  _isLeaf: boolean

  constructor(nibbles: Nibbles, value: Uint8Array, isLeaf: boolean) {
    this._nibbles = nibbles
    this._value = value
    this._isLeaf = isLeaf
  }

  static decodeKey(key: Nibbles): Nibbles {
    return removeHexPrefix(key)
  }

  encodedKey(): Nibbles {
    return addHexPrefix(this._nibbles.slice(0), this._isLeaf)
  }

  key(k?: Nibbles): Nibbles {
    if (k !== undefined) {
      this._nibbles = k
    }

    return this._nibbles.slice(0)
  }

  keyLength() {
    return this._nibbles.length
  }

  value(v?: Uint8Array) {
    if (v !== undefined) {
      this._value = v
    }

    return this._value
  }

  raw(): RawExtensionMPTNode | RawLeafMPTNode {
    return [nibblesTypeToPackedBytes(this.encodedKey()), this._value]
  }

  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }
}
