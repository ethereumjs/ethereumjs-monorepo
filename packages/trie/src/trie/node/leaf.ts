import { RLP } from '@ethereumjs/rlp'
import { bufArrToArr } from '@ethereumjs/util'

import { Nibbles } from '../../types'
import { addHexPrefix, removeHexPrefix } from '../../util/hex'
import { nibblesToBuffer } from '../../util/nibbles'

export class LeafNode {
  _nibbles: Nibbles
  _value: Buffer

  constructor(nibbles: Nibbles, value: Buffer) {
    this._nibbles = nibbles
    this._value = value
  }

  static encodeKey(key: Nibbles): Nibbles {
    return addHexPrefix(key, true)
  }

  static decodeKey(encodedKey: Nibbles): Nibbles {
    return removeHexPrefix(encodedKey)
  }

  get key(): Nibbles {
    return this._nibbles.slice(0)
  }

  set key(k: Nibbles) {
    this._nibbles = k
  }

  get keyLength() {
    return this._nibbles.length
  }

  get value(): Buffer {
    return this._value
  }

  set value(v: Buffer) {
    this._value = v
  }

  encodedKey(): Nibbles {
    return LeafNode.encodeKey(this._nibbles.slice(0))
  }

  raw(): [Buffer, Buffer] {
    return [nibblesToBuffer(this.encodedKey()), this._value]
  }

  serialize(): Buffer {
    return Buffer.from(RLP.encode(bufArrToArr(this.raw())))
  }
}
