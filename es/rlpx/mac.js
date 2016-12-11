const { createCipheriv } = require('crypto')
const createKeccakHash = require('keccak')
const { xor } = require('../util')

class MAC {
  constructor (secret) {
    this._hash = createKeccakHash('keccak256')
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
    return this._hash._clone().digest().slice(0, 16)
  }
}

module.exports = MAC
