import { type Cipher, createCipheriv } from 'crypto'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { utf8ToBytes } from '@ethereumjs/util'
import { xor } from '../util.ts'

type Hash = ReturnType<typeof keccak_256.create>

export class MAC {
  protected _hash: Hash
  protected _secret: Uint8Array
  protected _aes: Cipher
  constructor(secret: Uint8Array) {
    this._hash = keccak_256.create()
    this._secret = secret
    this._aes = createCipheriv('aes-256-ecb', this._secret, '')
    this._aes.setAutoPadding(false)
  }

  update(data: Uint8Array | string) {
    this._hash.update(typeof data === 'string' ? utf8ToBytes(data) : data)
  }

  updateHeader(data: Uint8Array | string) {
    const encrypted = this._aes.update(this.digest())
    this._hash.update(xor(encrypted, data))
  }

  updateBody(data: Uint8Array | string) {
    this._hash.update(typeof data === 'string' ? utf8ToBytes(data) : data)
    const prev = this.digest()
    const encrypted = this._aes.update(prev)
    this._hash.update(xor(encrypted, prev))
  }

  digest() {
    return Uint8Array.from(this._hash.clone().digest().subarray(0, 16))
  }
}
