import { keccak256 } from 'ethereum-cryptography/keccak'
import { bufArrToArr } from '@ethereumjs/util'
import RLP from 'rlp'
import { nibblesToBuffer } from '../../util/nibbles'
import { addHexPrefix, removeHexPrefix } from '../../util/hex'
import { Nibbles } from '../../types'

export class ExtensionNode {
  _nibbles: Nibbles
  _value: Buffer

  constructor(nibbles: Nibbles, value: Buffer) {
    this._nibbles = nibbles
    this._value = value
  }

  static encodeKey(key: Nibbles): Nibbles {
    return addHexPrefix(key, false)
  }

  static decodeKey(key: Nibbles): Nibbles {
    return removeHexPrefix(key)
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
    return ExtensionNode.encodeKey(this._nibbles.slice(0))
  }

  raw(): [Buffer, Buffer] {
    return [nibblesToBuffer(this.encodedKey()), this._value]
  }

  serialize(): Buffer {
    return Buffer.from(RLP.encode(bufArrToArr(this.raw())))
  }

  hash(): Buffer {
    return Buffer.from(keccak256(this.serialize()))
  }
}
