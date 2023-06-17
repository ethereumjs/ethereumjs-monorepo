import { createCipheriv } from 'crypto'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { xor } from '../util.js'

export type Hash = ReturnType<typeof keccak256.create>

export class MAC {
  _hash: Hash
  _secret: Uint8Array
  constructor(secret: Uint8Array) {
    this._hash = keccak256.create()
    this._secret = secret
  }

  update(data: Uint8Array | string) {
    this._hash.update(data)
  }

  updateHeader(data: Uint8Array | string) {
    const aes = createCipheriv('aes-256-ecb', this._secret, '')
    const encrypted = aes.update(this.digest())
    this._hash.update(xor(encrypted, data))
  }

  updateBody(data: Uint8Array | string) {
    this._hash.update(data)
    const prev = this.digest()
    const aes = createCipheriv('aes-256-ecb', this._secret, '')
    const encrypted = aes.update(prev)
    this._hash.update(xor(encrypted, prev))
  }

  digest() {
    return Uint8Array.from(this._hash.clone().digest().subarray(0, 16))
  }
}
