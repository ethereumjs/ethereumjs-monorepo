var ethUtil = require('ethereumjs-util')
var crypto = require('crypto')
var scryptsy = require('scrypt.js')
var uuid = require('uuid')

function assert (val, msg) {
  if (!val) {
    throw new Error(msg || 'Assertion failed')
  }
}

function decipherBuffer (decipher, data) {
  return Buffer.concat([ decipher.update(data), decipher.final() ])
}

var Wallet = function (priv) {
  this.privKey = priv
}

Wallet.generate = function (icapDirect) {
  if (icapDirect) {
    while (true) {
      var privKey = crypto.randomBytes(32)
      if (ethUtil.privateToAddress(privKey)[0] === 0) {
        return new Wallet(privKey)
      }
    }
  } else {
    return new Wallet(crypto.randomBytes(32))
  }
}

Wallet.prototype.getPrivateKey = function () {
  return this.privKey
}

Wallet.prototype.getPrivateKeyString = function () {
  return '0x' + this.getPrivateKey().toString('hex')
}

Wallet.prototype.getPublicKey = function () {
  return ethUtil.privateToPublic(this.privKey)
}

Wallet.prototype.getPublicKeyString = function () {
  return '0x' + this.getPublicKey().toString('hex')
}

Wallet.prototype.getAddress = function () {
  return ethUtil.privateToAddress(this.privKey)
}

Wallet.prototype.getAddressString = function () {
  return '0x' + this.getAddress().toString('hex')
}

Wallet.prototype.getChecksumAddressString = function () {
  return ethUtil.toChecksumAddress(this.getAddressString())
}

// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
Wallet.prototype.toV3 = function (password, opts) {
  opts = opts || {}
  var salt = opts.salt || crypto.randomBytes(32)
  var iv = opts.iv || crypto.randomBytes(16)

  var derivedKey
  var kdf = opts.kdf || 'scrypt'
  var kdfparams = {
    dklen: opts.dklen || 32,
    salt: salt.toString('hex')
  }

  if (kdf === 'pbkdf2') {
    kdfparams.c = opts.c || 262144
    kdfparams.prf = 'hmac-sha256'
    derivedKey = crypto.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256')
  } else if (kdf === 'scrypt') {
    // FIXME: support progress reporting callback
    kdfparams.n = opts.n || 262144
    kdfparams.r = opts.r || 8
    kdfparams.p = opts.p || 1
    derivedKey = scryptsy(new Buffer(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else {
    throw new Error('Unsupported kdf')
  }

  var cipher = crypto.createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv)
  if (!cipher) {
    throw new Error('Unsupported cipher')
  }

  var ciphertext = Buffer.concat([ cipher.update(this.privKey), cipher.final() ])

  var mac = ethUtil.sha3(Buffer.concat([ derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex') ]))

  return {
    version: 3,
    id: uuid.v4({ random: opts.uuid || crypto.randomBytes(16) }),
    address: this.getAddress().toString('hex'),
    crypto: {
      ciphertext: ciphertext.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex')
      },
      cipher: opts.cipher || 'aes-128-ctr',
      kdf: kdf,
      kdfparams: kdfparams,
      mac: mac.toString('hex')
    }
  }
}

Wallet.prototype.toV3String = function (password, opts) {
  return JSON.stringify(this.toV3(password, opts))
}

Wallet.fromPrivateKey = function (priv) {
  return new Wallet(priv)
}

// https://github.com/ethereum/go-ethereum/wiki/Passphrase-protected-key-store-spec
Wallet.fromV1 = function (input, password) {
  var json = (typeof input === 'object') ? input : JSON.parse(input)

  if (json.Version !== '1') {
    throw new Error('Not a V1 wallet')
  }

  if (json.Crypto.KeyHeader.Kdf !== 'scrypt') {
    throw new Error('Unsupported key derivation scheme')
  }

  var kdfparams = json.Crypto.KeyHeader.KdfParams
  var derivedKey = scryptsy(new Buffer(password), new Buffer(json.Crypto.Salt, 'hex'), kdfparams.N, kdfparams.R, kdfparams.P, kdfparams.DkLen)

  var ciphertext = new Buffer(json.Crypto.CipherText, 'hex')

  var mac = ethUtil.sha3(Buffer.concat([ derivedKey.slice(16, 32), ciphertext ]))
  console.log(mac, json.Crypto.MAC)

  if (mac.toString('hex') !== json.Crypto.MAC) {
    throw new Error('Key derivation failed - possibly wrong passphrase')
  }

  var decipher = crypto.createDecipheriv('aes-128-cbc', ethUtil.sha3(derivedKey.slice(0, 16)).slice(0, 16), new Buffer(json.Crypto.IV, 'hex'))
  var seed = decipherBuffer(decipher, ciphertext)

  // FIXME: Remove PKCS#7 padding here?

  return new Wallet(seed)
}

Wallet.fromV3 = function (input, password) {
  var json = (typeof input === 'object') ? input : JSON.parse(input)

  if (json.version !== 3) {
    throw new Error('Not a V3 wallet')
  }

  var derivedKey
  var kdfparams
  if (json.Crypto.kdf === 'scrypt') {
    kdfparams = json.Crypto.kdfparams

    // FIXME: support progress reporting callback
    derivedKey = scryptsy(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else if (json.Crypto.kdf === 'pbkdf2') {
    kdfparams = json.Crypto.kdfparams

    if (kdfparams.prf !== 'hmac-sha256') {
      throw new Error('Unsupported parameters to PBKDF2')
    }

    derivedKey = crypto.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256')
  } else {
    throw new Error('Unsupported key derivation scheme')
  }

  var ciphertext = new Buffer(json.Crypto.ciphertext, 'hex')

  var mac = ethUtil.sha3(Buffer.concat([ derivedKey.slice(16, 32), ciphertext ]))
  if (mac.toString('hex') !== json.Crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong passphrase')
  }

  var decipher = crypto.createDecipheriv(json.Crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.Crypto.cipherparams.iv, 'hex'))
  var seed = decipherBuffer(decipher, ciphertext, 'hex')

  // FIXME: Remove PKCS#7 padding here?

  return new Wallet(seed)
}

/*
 * Based on https://github.com/ethereum/pyethsaletool/blob/master/pyethsaletool.py
 * JSON fields: encseed, ethaddr, btcaddr, email
 */
Wallet.fromEthSale = function (input, password) {
  assert(typeof password === 'string')
  var json = (typeof input === 'object') ? input : JSON.parse(input)

  var encseed = new Buffer(json.encseed, 'hex')

  // key derivation
  var derivedKey = crypto.pbkdf2Sync(password, password, 2000, 32, 'sha256').slice(0, 16)

  // seed decoding (IV is first 16 bytes)
  var decipher = crypto.createDecipheriv('aes-128-cbc', derivedKey, encseed.slice(0, 16))
  var seed = decipherBuffer(decipher, encseed.slice(16))

  // FIXME: Remove PKCS#7 padding here?

  var wallet = new Wallet(ethUtil.sha3(seed))
  if (wallet.getAddress().toString('hex') !== json.ethaddr) {
    throw new Error('Decoded key mismatch - possibly wrong passphrase')
  }
  return wallet
}

module.exports = Wallet
