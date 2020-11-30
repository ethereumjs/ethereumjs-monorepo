import crypto, { Decipher } from 'crypto'
import { debug as createDebugLogger } from 'debug'
import { publicKeyCreate, ecdh, ecdsaRecover, ecdsaSign } from 'secp256k1'
import * as rlp from 'rlp'
import { unstrictDecode } from '../util'
import { MAC } from './mac'

import {
  pk2id,
  genPrivateKey,
  keccak256,
  id2pk,
  assertEq,
  xor,
  int2buffer,
  buffer2int,
  zfill,
} from '../util'

const debug = createDebugLogger('devp2p:rlpx:peer')

function ecdhX(publicKey: Buffer, privateKey: Buffer) {
  // return (publicKey * privateKey).x
  function hashfn(x: Uint8Array, y: Uint8Array) {
    const pubKey = new Uint8Array(33)
    pubKey[0] = (y[31] & 1) === 0 ? 0x02 : 0x03
    pubKey.set(x, 1)
    return pubKey
  }
  // @ts-ignore
  return Buffer.from(ecdh(publicKey, privateKey, { hashfn }, Buffer.alloc(33)).slice(1))
}

// a straigth rip from python interop w/go ecies implementation
// for sha3, blocksize is 136 bytes
// for sha256, blocksize is 64 bytes
// NIST SP 800-56a Concatenation Key Derivation Function (see section 5.8.1).
// https://github.com/ethereum/pydevp2p/blob/master/devp2p/crypto.py#L295
// https://github.com/ethereum/go-ethereum/blob/fe532a98f9f32bb81ef0d8d013cf44327830d11e/crypto/ecies/ecies.go#L165
// https://github.com/ethereum/cpp-ethereum/blob/develop/libdevcrypto/CryptoPP.cpp#L36
function concatKDF(keyMaterial: Buffer, keyLength: number) {
  const SHA256BlockSize = 64
  const reps = ((keyLength + 7) * 8) / (SHA256BlockSize * 8)

  const buffers = []
  for (let counter = 0, tmp = Buffer.allocUnsafe(4); counter <= reps; ) {
    counter += 1
    tmp.writeUInt32BE(counter, 0)
    buffers.push(crypto.createHash('sha256').update(tmp).update(keyMaterial).digest())
  }

  return Buffer.concat(buffers).slice(0, keyLength)
}

export class ECIES {
  _privateKey: Buffer
  _publicKey: Buffer
  _remotePublicKey: Buffer | null
  _nonce: Buffer
  _remoteNonce: Buffer | null = null
  _initMsg: Buffer | null | undefined = null
  _remoteInitMsg: Buffer | null = null
  _gotEIP8Auth: boolean = false
  _gotEIP8Ack: boolean = false
  _ingressAes: Decipher | null = null
  _egressAes: Decipher | null = null
  _ingressMac: MAC | null = null
  _egressMac: MAC | null = null
  _ephemeralPrivateKey: Buffer
  _ephemeralPublicKey: Buffer
  _remoteEphemeralPublicKey: Buffer | null = null // we don't need store this key, but why don't?
  _ephemeralSharedSecret: Buffer | null = null
  _bodySize: number | null = null

  constructor(privateKey: Buffer, id: Buffer, remoteId: Buffer) {
    this._privateKey = privateKey
    this._publicKey = id2pk(id)
    this._remotePublicKey = remoteId ? id2pk(remoteId) : null

    this._nonce = crypto.randomBytes(32)
    this._ephemeralPrivateKey = genPrivateKey()
    this._ephemeralPublicKey = Buffer.from(publicKeyCreate(this._ephemeralPrivateKey, false))
  }

  _encryptMessage(data: Buffer, sharedMacData: Buffer | null = null): Buffer | undefined {
    const privateKey = genPrivateKey()
    if (!this._remotePublicKey) return
    const x = ecdhX(this._remotePublicKey, privateKey)
    const key = concatKDF(x, 32)
    const ekey = key.slice(0, 16) // encryption key
    const mkey = crypto.createHash('sha256').update(key.slice(16, 32)).digest() // MAC key

    // encrypt
    const IV = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-128-ctr', ekey, IV)
    const encryptedData = cipher.update(data)
    const dataIV = Buffer.concat([IV, encryptedData])

    // create tag
    if (!sharedMacData) {
      sharedMacData = Buffer.from([])
    }
    const tag = crypto
      .createHmac('sha256', mkey)
      .update(Buffer.concat([dataIV, sharedMacData]))
      .digest()

    const publicKey = publicKeyCreate(privateKey, false)
    return Buffer.concat([publicKey, dataIV, tag])
  }

  _decryptMessage(data: Buffer, sharedMacData: Buffer | null = null): Buffer {
    assertEq(
      data.slice(0, 1),
      Buffer.from('04', 'hex'),
      'wrong ecies header (possible cause: EIP8 upgrade)',
      debug
    )

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
    const _tag = crypto
      .createHmac('sha256', mkey)
      .update(Buffer.concat([dataIV, sharedMacData]))
      .digest()
    assertEq(_tag, tag, 'should have valid tag', debug)

    // decrypt data
    const IV = dataIV.slice(0, 16)
    const encryptedData = dataIV.slice(16)
    const decipher = crypto.createDecipheriv('aes-128-ctr', ekey, IV)
    return decipher.update(encryptedData)
  }

  _setupFrame(remoteData: Buffer, incoming: boolean): void {
    if (!this._remoteNonce) return
    const nonceMaterial = incoming
      ? Buffer.concat([this._nonce, this._remoteNonce])
      : Buffer.concat([this._remoteNonce, this._nonce])
    const hNonce = keccak256(nonceMaterial)

    if (!this._ephemeralSharedSecret) return
    const IV = Buffer.allocUnsafe(16).fill(0x00)
    const sharedSecret = keccak256(this._ephemeralSharedSecret, hNonce)

    const aesSecret = keccak256(this._ephemeralSharedSecret, sharedSecret)
    this._ingressAes = crypto.createDecipheriv('aes-256-ctr', aesSecret, IV)
    this._egressAes = crypto.createDecipheriv('aes-256-ctr', aesSecret, IV)

    const macSecret = keccak256(this._ephemeralSharedSecret, aesSecret)
    this._ingressMac = new MAC(macSecret)
    this._ingressMac.update(Buffer.concat([xor(macSecret, this._nonce), remoteData]))
    this._egressMac = new MAC(macSecret)

    if (!this._initMsg) return
    this._egressMac.update(Buffer.concat([xor(macSecret, this._remoteNonce), this._initMsg]))
  }

  createAuthEIP8() {
    if (!this._remotePublicKey) return
    const x = ecdhX(this._remotePublicKey, this._privateKey)
    const sig = ecdsaSign(xor(x, this._nonce), this._ephemeralPrivateKey)
    const data = [
      Buffer.concat([Buffer.from(sig.signature), Buffer.from([sig.recid])]),
      // keccak256(pk2id(this._ephemeralPublicKey)),
      pk2id(this._publicKey),
      this._nonce,
      Buffer.from([0x04]),
    ]

    const dataRLP = rlp.encode(data)
    const pad = crypto.randomBytes(100 + Math.floor(Math.random() * 151)) // Random padding between 100, 250
    const authMsg = Buffer.concat([dataRLP, pad])
    const overheadLength = 113
    const sharedMacData = int2buffer(authMsg.length + overheadLength)
    const encryptedMsg = this._encryptMessage(authMsg, sharedMacData)
    if (!encryptedMsg) return
    this._initMsg = Buffer.concat([sharedMacData, encryptedMsg])
    return this._initMsg
  }

  createAuthNonEIP8(): Buffer | undefined {
    if (!this._remotePublicKey) return
    const x = ecdhX(this._remotePublicKey, this._privateKey)
    const sig = ecdsaSign(xor(x, this._nonce), this._ephemeralPrivateKey)
    const data = Buffer.concat([
      Buffer.from(sig.signature),
      Buffer.from([sig.recid]),
      keccak256(pk2id(this._ephemeralPublicKey)),
      pk2id(this._publicKey),
      this._nonce,
      Buffer.from([0x00]),
    ])

    this._initMsg = this._encryptMessage(data)
    return this._initMsg
  }

  parseAuthPlain(data: Buffer, sharedMacData: Buffer | null = null): Buffer | undefined {
    const prefix = sharedMacData !== null ? sharedMacData : Buffer.from([])
    this._remoteInitMsg = Buffer.concat([prefix, data])
    const decrypted = this._decryptMessage(data, sharedMacData)

    let signature = null
    let recoveryId = null
    let heid = null
    let remotePublicKey = null
    let nonce = null

    if (!this._gotEIP8Auth) {
      assertEq(decrypted.length, 194, 'invalid packet length', debug)

      signature = decrypted.slice(0, 64)
      recoveryId = decrypted[64]
      heid = decrypted.slice(65, 97) // 32 bytes
      remotePublicKey = id2pk(decrypted.slice(97, 161))
      nonce = decrypted.slice(161, 193)
    } else {
      const decoded = unstrictDecode(decrypted) as Buffer[]

      signature = decoded[0].slice(0, 64)
      recoveryId = decoded[0][64]
      remotePublicKey = id2pk(decoded[1])
      nonce = decoded[2]
    }

    // parse packet
    this._remotePublicKey = remotePublicKey // 64 bytes
    this._remoteNonce = nonce // 32 bytes
    // assertEq(decrypted[193], 0, 'invalid postfix', debug)

    const x = ecdhX(this._remotePublicKey, this._privateKey)

    if (!this._remoteNonce) return
    this._remoteEphemeralPublicKey = Buffer.from(
      ecdsaRecover(signature, recoveryId, xor(x, this._remoteNonce), false)
    )

    if (!this._remoteEphemeralPublicKey) return
    this._ephemeralSharedSecret = ecdhX(this._remoteEphemeralPublicKey, this._ephemeralPrivateKey)
    if (heid !== null && this._remoteEphemeralPublicKey) {
      assertEq(
        keccak256(pk2id(this._remoteEphemeralPublicKey)),
        heid,
        'the hash of the ephemeral key should match',
        debug
      )
    }
  }

  parseAuthEIP8(data: Buffer): void {
    const size = buffer2int(data.slice(0, 2)) + 2
    assertEq(data.length, size, 'message length different from specified size (EIP8)', debug)
    this.parseAuthPlain(data.slice(2), data.slice(0, 2))
  }

  createAckEIP8(): Buffer | undefined {
    const data = [pk2id(this._ephemeralPublicKey), this._nonce, Buffer.from([0x04])]

    const dataRLP = rlp.encode(data)
    const pad = crypto.randomBytes(100 + Math.floor(Math.random() * 151)) // Random padding between 100, 250
    const ackMsg = Buffer.concat([dataRLP, pad])
    const overheadLength = 113
    const sharedMacData = int2buffer(ackMsg.length + overheadLength)
    const encryptedMsg = this._encryptMessage(ackMsg, sharedMacData)
    if (!encryptedMsg) return
    this._initMsg = Buffer.concat([sharedMacData, encryptedMsg])

    if (!this._remoteInitMsg) return
    this._setupFrame(this._remoteInitMsg, true)
    return this._initMsg
  }

  createAckOld(): Buffer | undefined {
    const data = Buffer.concat([pk2id(this._ephemeralPublicKey), this._nonce, Buffer.from([0x00])])

    this._initMsg = this._encryptMessage(data)

    if (!this._remoteInitMsg) return
    this._setupFrame(this._remoteInitMsg, true)
    return this._initMsg
  }

  parseAckPlain(data: Buffer, sharedMacData: Buffer | null = null): void {
    const decrypted = this._decryptMessage(data, sharedMacData)

    let remoteEphemeralPublicKey = null
    let remoteNonce = null

    if (!this._gotEIP8Ack) {
      assertEq(decrypted.length, 97, 'invalid packet length', debug)
      assertEq(decrypted[96], 0, 'invalid postfix', debug)

      remoteEphemeralPublicKey = id2pk(decrypted.slice(0, 64))
      remoteNonce = decrypted.slice(64, 96)
    } else {
      const decoded = unstrictDecode(decrypted) as Buffer[]

      remoteEphemeralPublicKey = id2pk(decoded[0])
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

  parseAckEIP8(data: Buffer): void {
    // eslint-disable-line
    const size = buffer2int(data.slice(0, 2)) + 2
    assertEq(data.length, size, 'message length different from specified size (EIP8)', debug)
    this.parseAckPlain(data.slice(2), data.slice(0, 2))
  }

  createHeader(size: number): Buffer | undefined {
    const bufSize = zfill(int2buffer(size), 3)
    let header = Buffer.concat([bufSize, rlp.encode([0, 0])]) // TODO: the rlp will contain something else someday
    header = zfill(header, 16, false)
    if (!this._egressAes) return
    header = this._egressAes.update(header)

    if (!this._egressMac) return
    this._egressMac.updateHeader(header)
    const tag = this._egressMac.digest()

    return Buffer.concat([header, tag])
  }

  parseHeader(data: Buffer): number | undefined {
    // parse header
    let header = data.slice(0, 16)
    const mac = data.slice(16, 32)

    if (!this._ingressMac) return
    this._ingressMac.updateHeader(header)
    const _mac = this._ingressMac.digest()
    assertEq(_mac, mac, 'Invalid MAC', debug)

    if (!this._ingressAes) return
    header = this._ingressAes.update(header)
    this._bodySize = buffer2int(header.slice(0, 3))
    return this._bodySize
  }

  createBody(data: Buffer): Buffer | undefined {
    data = zfill(data, Math.ceil(data.length / 16) * 16, false)
    if (!this._egressAes) return
    const encryptedData = this._egressAes.update(data)

    if (!this._egressMac) return
    this._egressMac.updateBody(encryptedData)
    const tag = this._egressMac.digest()
    return Buffer.concat([encryptedData, tag])
  }

  parseBody(data: Buffer): Buffer | undefined {
    if (this._bodySize === null) throw new Error('need to parse header first')

    const body = data.slice(0, -16)
    const mac = data.slice(-16)

    if (!this._ingressMac) return
    this._ingressMac.updateBody(body)
    const _mac = this._ingressMac.digest()
    assertEq(_mac, mac, 'Invalid MAC', debug)

    const size = this._bodySize
    this._bodySize = null

    if (!this._ingressAes) return
    return this._ingressAes.update(body).slice(0, size)
  }
}
