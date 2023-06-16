import { RLP } from '@ethereumjs/rlp'

import { addHexPrefix, removeHexPrefix } from '../../util/hex.js'
import { nibblestoBytes } from '../../util/nibbles.js'

import type { Nibbles } from '../../types.js'

export class Node {
  _nibbles: Nibbles
  _value: Uint8Array
  _terminator: boolean

  constructor(nibbles: Nibbles, value: Uint8Array, terminator: boolean) {
    this._nibbles = nibbles
    this._value = value
    this._terminator = terminator
  }

  static decodeKey(key: Nibbles): Nibbles {
    return removeHexPrefix(key)
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

  encodedKey(): Nibbles {
    return addHexPrefix(this._nibbles.slice(0), this._terminator)
  }

  raw(): [Uint8Array, Uint8Array] {
    return [nibblestoBytes(this.encodedKey()), this._value]
  }

  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }
}
