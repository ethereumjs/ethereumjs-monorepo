const HDKey = require('hdkey')
const Wallet = require('./index.js')

function EthereumHDKey () {
}

/*
 * Horrible wrapping.
 */
function fromHDKey (hdkey) {
  var ret = new EthereumHDKey()
  ret._hdkey = hdkey
  return ret
}

EthereumHDKey.fromMasterSeed = function (seedBuffer) {
  return fromHDKey(HDKey.fromMasterSeed(seedBuffer))
}

EthereumHDKey.fromExtendedKey = function (base58key) {
  return fromHDKey(HDKey.fromExtendedKey(base58key))
}

EthereumHDKey.prototype.privateExtendedKey = function () {
  // FIXME: change this according to the outcome of https://github.com/cryptocoinjs/hdkey/issues/7
  if (!this._hdkey._privateKey) {
    throw new Error('Private key is not available')
  }
  return this._hdkey.privateExtendedKey
}

EthereumHDKey.prototype.publicExtendedKey = function () {
  return this._hdkey.publicExtendedKey
}

EthereumHDKey.prototype.derivePath = function (path) {
  return fromHDKey(this._hdkey.derive(path))
}

EthereumHDKey.prototype.deriveChild = function (index) {
  return fromHDKey(this._hdkey.deriveChild(index))
}

EthereumHDKey.prototype.getWallet = function () {
  if (this._hdkey._privateKey) {
    return Wallet.fromPrivateKey(this._hdkey._privateKey)
  } else {
    return Wallet.fromPublicKey(this._hdkey._publicKey, true)
  }
}

module.exports = EthereumHDKey
