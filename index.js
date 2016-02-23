var ethUtil = require('ethereumjs-util')
var crypto = require('crypto')
var scryptsy = require('scryptsy')
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

Wallet.prototype.getPrivateKey = function () {
  return this.privKey
}

Wallet.prototype.getPrivateKeyString = function () {
  return this.getPrivateKey.toString('hex')
}

Wallet.prototype.getPublicKey = function () {
  return ethUtil.privateToPublic(this.privKey)
}

Wallet.prototype.getPublicKeyString = function () {
  return this.getPublicKey.toString('hex')
}

Wallet.prototype.getAddress = function () {
  return ethUtil.privateToAddress(this.privKey)
}

Wallet.prototype.getAddressString = function () {
  return '0x' + this.getAddress().toString('hex')
}

// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
Wallet.prototype.toV3 = function (password, opts) {
  opts = opts || {}
  var salt = opts.salt || crypto.randomBytes(32)
  var iv = opts.iv || crypto.randomBytes(16)

  var derivedKey
  var kdf = opts.kdf || 'pbkdf2'
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
    kdfparams.r = opts.r || 1
    kdfparams.p = opts.p || 8
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
    Crypto: {
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
// Let's just transform it to be compatible with V3
// FIXME: this might not be fully correct in all cases
Wallet.fromV1 = function (input, password) {
  var json = (typeof input === 'object') ? input : JSON.parse(input)
  return Wallet.fromV3({
    Crypto: {
      ciphertext: json.Crypto.CipherText,
      cipherparams: {
        iv: json.Crypto.IV
      },
      cipher: 'aes-128-cbc',
      kdf: json.Crypto.KeyHeader.Kdf,
      kdfparams: {
        dklen: json.Crypto.KeyHeader.KdfParams.DkLen,
        n: json.Crypto.KeyHeader.KdfParams.N,
        p: json.Crypto.KeyHeader.KdfParams.P,
        r: json.Crypto.KeyHeader.KdfParams.R,
        salt: json.Crypto.Salt
      },
      mac: json.Crypto.MAC
    },
    id: json.Id,
    version: 3
  }, password)
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

  var mac = ethUtil.sha3(Buffer.concat([ derivedKey.slice(16, 32), new Buffer(json.Crypto.ciphertext, 'hex') ]))
  if (mac.toString('hex') !== json.Crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong passphrase')
  }

  var decipher = crypto.createDecipheriv(json.Crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.Crypto.cipherparams.iv, 'hex'))
  var seed = decipherBuffer(decipher, new Buffer(json.Crypto.ciphertext, 'hex'))

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
