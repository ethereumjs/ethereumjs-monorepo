import { createCipheriv } from 'crypto'
import createKeccakHash from 'keccak'
import { xor } from '../util'

export class MAC {
  _hash: any
  _secret: Buffer
  constructor(secret: Buffer) {
    this._hash = createKeccakHash('keccak256')
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
    return this._hash._clone().digest().slice(0, 16)
  }
}
