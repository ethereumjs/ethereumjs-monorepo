import { createCipheriv } from 'crypto'
import SHA3 from 'keccakjs'
import { xor } from '../util'

export default class MAC {
  constructor (secret) {
    this._hash = new SHA3(256)
    this._secret = secret
  }

  update (data) {
    this._hash.update(data)
  }

  updateHeader (data) {
    const aes = createCipheriv('aes-256-ecb', this._secret, '')
    const encrypted = aes.update(this.digest())
    this._hash.update(xor(encrypted, data))
  }

  updateBody (data) {
    this._hash.update(data)
    const prev = this.digest()
    const aes = createCipheriv('aes-256-ecb', this._secret, '')
    const encrypted = aes.update(prev)
    this._hash.update(xor(encrypted, prev))
  }

  digest () {
    return Buffer.from(this._hash.digest('hex'), 'hex').slice(0, 16)
  }
}
