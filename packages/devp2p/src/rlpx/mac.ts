import { createCipheriv } from 'crypto'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { xor } from '../util'

export type Hash = ReturnType<typeof keccak256.create>

export class MAC {
  _hash: Hash
  _secret: Buffer
  constructor(secret: Buffer) {
    this._hash = keccak256.create()
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
