import { createCipheriv } from 'crypto'
import { Keccak, keccak_256 } from '@noble/hashes/sha3'
import { xor } from '../util'
import { Hash } from '@noble/hashes/utils'

export class MAC {
  _hash: Hash<Keccak>
  _secret: Buffer
  constructor(secret: Buffer) {
    this._hash = keccak_256.create()
    this._secret = secret
  }

  update(data: Buffer | string) {
    this._hash.update(data)
  }

  updateHeader(data: Buffer | string) {
    const aes = createCipheriv('aes-256-ecb', this._secret, '')
    const encrypted = aes.update(this.digest())
    this._hash.update(xor(encrypted, data))
  }

  updateBody(data: Buffer | string) {
    this._hash.update(data)
    const prev = this.digest()
    const aes = createCipheriv('aes-256-ecb', this._secret, '')
    const encrypted = aes.update(prev)
    this._hash.update(xor(encrypted, prev))
  }

  digest() {
    return Buffer.from(this._hash.clone().digest().slice(0, 16))
  }
}
