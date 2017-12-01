const crypto = require('crypto')
const secp256k1 = require('secp256k1')
const Buffer = require('safe-buffer').Buffer
const rlp = require('rlp-encoding')
const util = require('../util')
const MAC = require('./mac')

function ecdhX (publicKey, privateKey) {
  // return (publicKey * privateKey).x
  return secp256k1.ecdhUnsafe(publicKey, privateKey, true).slice(1)
}

// a straigth rip from python interop w/go ecies implementation
// for sha3, blocksize is 136 bytes
// for sha256, blocksize is 64 bytes
// NIST SP 800-56a Concatenation Key Derivation Function (see section 5.8.1).
// https://github.com/ethereum/pydevp2p/blob/master/devp2p/crypto.py#L295
// https://github.com/ethereum/go-ethereum/blob/fe532a98f9f32bb81ef0d8d013cf44327830d11e/crypto/ecies/ecies.go#L165
// https://github.com/ethereum/cpp-ethereum/blob/develop/libdevcrypto/CryptoPP.cpp#L36
function concatKDF (keyMaterial, keyLength) {
  const SHA256BlockSize = 64
  const reps = ((keyLength + 7) * 8) / (SHA256BlockSize * 8)

  const buffers = []
  for (let counter = 0, tmp = Buffer.allocUnsafe(4); counter <= reps;) {
    counter += 1
    tmp.writeUInt32BE(counter)
    buffers.push(crypto.createHash('sha256').update(tmp).update(keyMaterial).digest())
  }

  return Buffer.concat(buffers).slice(0, keyLength)
}

class ECIES {
  constructor (privateKey, id, remoteId) {
    this._privateKey = privateKey
    this._publicKey = util.id2pk(id)
    this._remotePublicKey = remoteId ? util.id2pk(remoteId) : null

    this._nonce = crypto.randomBytes(32)
    this._remoteNonce = null

    this._initMsg = null
    this._remoteInitMsg = null

    this._gotEIP8Auth = false
    this._gotEIP8Ack = false

    this._ingressAes = null
    this._egressAes = null

    this._ingressMac = null
    this._egressMac = null

    this._ephemeralPrivateKey = util.genPrivateKey()
    this._ephemeralPublicKey = secp256k1.publicKeyCreate(this._ephemeralPrivateKey, false)
    this._remoteEphemeralPublicKey = null // we don't need store this key, but why don't?
    this._ephemeralSharedSecret = null

    this._bodySize = null
  }

  _encryptMessage (data, sharedMacData = null) {
    const privateKey = util.genPrivateKey()
    const x = ecdhX(this._remotePublicKey, privateKey)
    const key = concatKDF(x, 32)
    const ekey = key.slice(0, 16) // encryption key
    const mkey = crypto.createHash('sha256').update(key.slice(16, 32)).digest() // MAC key

    // encrypt
    const IV = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-128-ctr', ekey, IV)
    const encryptedData = cipher.update(data)
    const dataIV = Buffer.concat([ IV, encryptedData ])

    // create tag
    if (!sharedMacData) {
      sharedMacData = Buffer.from([])
    }
    const tag = crypto.createHmac('sha256', mkey).update(Buffer.concat([dataIV, sharedMacData])).digest()

    const publicKey = secp256k1.publicKeyCreate(privateKey, false)
    return Buffer.concat([ publicKey, dataIV, tag ])
  }

  _decryptMessage (data, sharedMacData = null) {
    util.assertEq(data.slice(0, 1), Buffer.from('04', 'hex'), 'wrong ecies header')

    const publicKey = data.slice(0, 65)
    const dataIV = data.slice(65, -32)
    const tag = data.slice(-32)

    // derive keys
    const x = ecdhX(publicKey, this._privateKey)
    const key = concatKDF(x, 32)
    const ekey = key.slice(0, 16) // encryption key
    const mkey = crypto.createHash('sha256').update(key.slice(16, 32)).digest() // MAC key

    // check the tag
    if (!sharedMacData) {
      sharedMacData = Buffer.from([])
    }
    const _tag = crypto.createHmac('sha256', mkey).update(Buffer.concat([dataIV, sharedMacData])).digest()
    util.assertEq(_tag, tag, 'should have valid tag')

    // decrypt data
    const IV = dataIV.slice(0, 16)
    const encryptedData = dataIV.slice(16)
    const decipher = crypto.createDecipheriv('aes-128-ctr', ekey, IV)
    return decipher.update(encryptedData)
  }

  _setupFrame (remoteData, incoming) {
    const nonceMaterial = incoming
      ? Buffer.concat([ this._nonce, this._remoteNonce ])
      : Buffer.concat([ this._remoteNonce, this._nonce ])
    const hNonce = util.keccak256(nonceMaterial)

    const IV = Buffer.allocUnsafe(16).fill(0x00)
    const sharedSecret = util.keccak256(this._ephemeralSharedSecret, hNonce)

    const aesSecret = util.keccak256(this._ephemeralSharedSecret, sharedSecret)
    this._ingressAes = crypto.createDecipheriv('aes-256-ctr', aesSecret, IV)
    this._egressAes = crypto.createDecipheriv('aes-256-ctr', aesSecret, IV)

    const macSecret = util.keccak256(this._ephemeralSharedSecret, aesSecret)
    this._ingressMac = new MAC(macSecret)
    this._ingressMac.update(Buffer.concat([ util.xor(macSecret, this._nonce), remoteData ]))
    this._egressMac = new MAC(macSecret)
    this._egressMac.update(Buffer.concat([ util.xor(macSecret, this._remoteNonce), this._initMsg ]))
  }

  createAuthEIP8 () {
    const x = ecdhX(this._remotePublicKey, this._privateKey)
    const sig = secp256k1.sign(util.xor(x, this._nonce), this._ephemeralPrivateKey)
    const data = [
      Buffer.concat([sig.signature, Buffer.from([ sig.recovery ])]),
      // util.keccak256(util.pk2id(this._ephemeralPublicKey)),
      util.pk2id(this._publicKey),
      this._nonce,
      Buffer.from([ 0x04 ])
    ]

    const dataRLP = rlp.encode(data)
    const pad = crypto.randomBytes(100 + Math.floor(Math.random() * 151)) // Random padding between 100, 250
    const authMsg = Buffer.concat([dataRLP, pad])
    const overheadLength = 113
    const sharedMacData = util.int2buffer(authMsg.length + overheadLength)
    this._initMsg = Buffer.concat([sharedMacData, this._encryptMessage(authMsg, sharedMacData)])
    return this._initMsg
  }

  createAuthNonEIP8 () {
    const x = ecdhX(this._remotePublicKey, this._privateKey)
    const sig = secp256k1.sign(util.xor(x, this._nonce), this._ephemeralPrivateKey)
    const data = Buffer.concat([
      sig.signature,
      Buffer.from([ sig.recovery ]),
      util.keccak256(util.pk2id(this._ephemeralPublicKey)),
      util.pk2id(this._publicKey),
      this._nonce,
      Buffer.from([ 0x00 ])
    ])

    this._initMsg = this._encryptMessage(data)
    return this._initMsg
  }

  parseAuthPlain (data, sharedMacData = null) {
    this._remoteInitMsg = data
    const decrypted = this._decryptMessage(data, sharedMacData)

    var signature = null
    var recoveryId = null
    var heid = null
    var remotePublicKey = null
    var nonce = null

    if (!this._gotEIP8Auth) {
      util.assertEq(decrypted.length, 194, 'invalid packet length')

      signature = decrypted.slice(0, 64)
      recoveryId = decrypted[64]
      heid = decrypted.slice(65, 97) // 32 bytes
      remotePublicKey = util.id2pk(decrypted.slice(97, 161))
      nonce = decrypted.slice(161, 193)
    } else {
      const decoded = rlp.decode(decrypted)

      signature = decoded[0].slice(0, 64)
      recoveryId = decoded[0][64]
      remotePublicKey = util.id2pk(decoded[1])
      nonce = decoded[2]
    }

    // parse packet
    this._remotePublicKey = remotePublicKey  // 64 bytes
    this._remoteNonce = nonce // 32 bytes
    // util.assertEq(decrypted[193], 0, 'invalid postfix')

    const x = ecdhX(this._remotePublicKey, this._privateKey)
    this._remoteEphemeralPublicKey = secp256k1.recover(util.xor(x, this._remoteNonce), signature, recoveryId, false)
    this._ephemeralSharedSecret = ecdhX(this._remoteEphemeralPublicKey, this._ephemeralPrivateKey)

    if (heid !== null) {
      var _heid = util.keccak256(util.pk2id(this._remoteEphemeralPublicKey))
      util.assertEq(_heid, heid, 'the hash of the ephemeral key should match')
    }
  }

  parseAuthEIP8 (data) {
    const size = util.buffer2int(data.slice(0, 2)) + 2
    util.assertEq(data.length, size, 'message length different from specified size (EIP8)')
    this.parseAuthPlain(data.slice(2), data.slice(0, 2))
  }

  createAckEIP8 () {
    const data = [
      util.pk2id(this._ephemeralPublicKey),
      this._nonce,
      Buffer.from([ 0x04 ])
    ]

    const dataRLP = rlp.encode(data)
    const pad = crypto.randomBytes(100 + Math.floor(Math.random() * 151)) // Random padding between 100, 250
    const ackMsg = Buffer.concat([dataRLP, pad])
    const overheadLength = 113
    const sharedMacData = util.int2buffer(ackMsg.length + overheadLength)
    this._initMsg = Buffer.concat([sharedMacData, this._encryptMessage(ackMsg, sharedMacData)])
    this._setupFrame(this._remoteInitMsg, true)
    return this._initMsg
  }

  createAckOld () {
    const data = Buffer.concat([
      util.pk2id(this._ephemeralPublicKey),
      this._nonce,
      Buffer.from([ 0x00 ])
    ])

    this._initMsg = this._encryptMessage(data)
    this._setupFrame(this._remoteInitMsg, true)
    return this._initMsg
  }

  parseAckPlain (data, sharedMacData = null) {
    const decrypted = this._decryptMessage(data, sharedMacData)

    var remoteEphemeralPublicKey = null
    var remoteNonce = null

    if (!this._gotEIP8Ack) {
      util.assertEq(decrypted.length, 97, 'invalid packet length')
      util.assertEq(decrypted[96], 0, 'invalid postfix')

      remoteEphemeralPublicKey = util.id2pk(decrypted.slice(0, 64))
      remoteNonce = decrypted.slice(64, 96)
    } else {
      const decoded = rlp.decode(decrypted)

      remoteEphemeralPublicKey = util.id2pk(decoded[0])
      remoteNonce = decoded[1]
    }

    // parse packet
    this._remoteEphemeralPublicKey = remoteEphemeralPublicKey
    this._remoteNonce = remoteNonce

    this._ephemeralSharedSecret = ecdhX(this._remoteEphemeralPublicKey, this._ephemeralPrivateKey)
    if (!sharedMacData) {
      sharedMacData = Buffer.from([])
    }
    this._setupFrame(Buffer.concat([sharedMacData, data]), false)
  }

  parseAckEIP8 (data) { // eslint-disable-line
    const size = util.buffer2int(data.slice(0, 2)) + 2
    util.assertEq(data.length, size, 'message length different from specified size (EIP8)')
    this.parseAckPlain(data.slice(2), data.slice(0, 2))
  }

  createHeader (size) {
    size = util.zfill(util.int2buffer(size), 3)
    let header = Buffer.concat([ size, rlp.encode([ 0, 0 ]) ]) // TODO: the rlp will contain something else someday
    header = util.zfill(header, 16, false)
    header = this._egressAes.update(header)

    this._egressMac.updateHeader(header)
    const tag = this._egressMac.digest()

    return Buffer.concat([ header, tag ])
  }

  parseHeader (data) {
    // parse header
    let header = data.slice(0, 16)
    const mac = data.slice(16, 32)

    this._ingressMac.updateHeader(header)
    const _mac = this._ingressMac.digest()
    util.assertEq(_mac, mac, 'Invalid MAC')

    header = this._ingressAes.update(header)
    this._bodySize = util.buffer2int(header.slice(0, 3))
    return this._bodySize
  }

  createBody (data) {
    data = util.zfill(data, Math.ceil(data.length / 16) * 16, false)
    const encryptedData = this._egressAes.update(data)
    this._egressMac.updateBody(encryptedData)
    const tag = this._egressMac.digest()
    return Buffer.concat([ encryptedData, tag ])
  }

  parseBody (data) {
    if (this._bodySize === null) throw new Error('need to parse header first')

    const body = data.slice(0, -16)
    const mac = data.slice(-16)
    this._ingressMac.updateBody(body)
    const _mac = this._ingressMac.digest()
    util.assertEq(_mac, mac, 'Invalid MAC')

    const size = this._bodySize
    this._bodySize = null
    return this._ingressAes.update(body).slice(0, size)
  }
}

module.exports = ECIES
