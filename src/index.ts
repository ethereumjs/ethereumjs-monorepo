import * as crypto from 'crypto'
import * as ethUtil from 'ethereumjs-util'

const bs58check = require('bs58check')
const randomBytes = require('randombytes')
const scryptsy = require('@web3-js/scrypt-shim')
const uuidv4 = require('uuid/v4')

// parameters for the toV3() method

interface V3Params {
  kdf: string
  cipher: string
  salt: string | Buffer
  iv: string | Buffer
  uuid: string | Buffer
  dklen: number
  c: number
  n: number
  r: number
  p: number
}

interface V3ParamsStrict {
  kdf: string
  cipher: string
  salt: Buffer
  iv: Buffer
  uuid: Buffer
  dklen: number
  c: number
  n: number
  r: number
  p: number
}

function validateHexString(paramName: string, str: string, length?: number) {
  if (str.toLowerCase().startsWith('0x')) {
    str = str.slice(2)
  }
  if (!str && !length) {
    return str
  }
  if ((length as number) % 2) {
    throw new Error(`Invalid length argument, must be an even number`)
  }
  if (typeof length === 'number' && str.length !== length) {
    throw new Error(`Invalid ${paramName}, string must be ${length} hex characters`)
  }
  if (!/^([0-9a-f]{2})+$/i.test(str)) {
    const howMany = typeof length === 'number' ? length : 'empty or a non-zero even number of'
    throw new Error(`Invalid ${paramName}, string must be ${howMany} hex characters`)
  }
  return str
}

function validateBuffer(paramName: string, buff: Buffer, length?: number) {
  if (!Buffer.isBuffer(buff)) {
    const howManyHex =
      typeof length === 'number' ? `${length * 2}` : 'empty or a non-zero even number of'
    const howManyBytes = typeof length === 'number' ? ` (${length} bytes)` : ''
    throw new Error(
      `Invalid ${paramName}, must be a string (${howManyHex} hex characters) or buffer${howManyBytes}`,
    )
  }
  if (typeof length === 'number' && buff.length !== length) {
    throw new Error(`Invalid ${paramName}, buffer must be ${length} bytes`)
  }
  return buff
}

function mergeToV3ParamsWithDefaults(params?: Partial<V3Params>): V3ParamsStrict {
  const v3Defaults: V3ParamsStrict = {
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    salt: randomBytes(32),
    iv: randomBytes(16),
    uuid: randomBytes(16),
    dklen: 32,
    c: 262144,
    n: 262144,
    r: 8,
    p: 1,
  }

  if (!params) {
    return v3Defaults
  }

  if (typeof params.salt === 'string') {
    params.salt = Buffer.from(validateHexString('salt', params.salt), 'hex')
  }
  if (typeof params.iv === 'string') {
    params.iv = Buffer.from(validateHexString('iv', params.iv, 32), 'hex')
  }
  if (typeof params.uuid === 'string') {
    params.uuid = Buffer.from(validateHexString('uuid', params.uuid, 32), 'hex')
  }

  if (params.salt) {
    validateBuffer('salt', params.salt)
  }
  if (params.iv) {
    validateBuffer('iv', params.iv, 16)
  }
  if (params.uuid) {
    validateBuffer('uuid', params.uuid, 16)
  }

  return {
    ...v3Defaults,
    ...(params as V3ParamsStrict),
  }
}

// KDF

const enum KDFFunctions {
  PBKDF = 'pbkdf2',
  Scrypt = 'scrypt',
}

interface ScryptKDFParams {
  dklen: number
  n: number
  p: number
  r: number
  salt: Buffer
}

interface ScryptKDFParamsOut {
  dklen: number
  n: number
  p: number
  r: number
  salt: string
}

interface PBKDFParams {
  c: number
  dklen: number
  prf: string
  salt: Buffer
}

interface PBKDFParamsOut {
  c: number
  dklen: number
  prf: string
  salt: string
}

type KDFParams = ScryptKDFParams | PBKDFParams
type KDFParamsOut = ScryptKDFParamsOut | PBKDFParamsOut

function kdfParamsForPBKDF(opts: V3ParamsStrict): PBKDFParams {
  return {
    dklen: opts.dklen,
    salt: opts.salt,
    c: opts.c,
    prf: 'hmac-sha256',
  }
}

function kdfParamsForScrypt(opts: V3ParamsStrict): ScryptKDFParams {
  return {
    dklen: opts.dklen,
    salt: opts.salt,
    n: opts.n,
    r: opts.r,
    p: opts.p,
  }
}

// JSON keystore types

// https://github.com/ethereum/homestead-guide/blob/master/old-docs-for-reference/go-ethereum-wiki.rst/Passphrase-protected-key-store-spec.rst
interface V1Keystore {
  Address: string
  Crypto: {
    CipherText: string
    IV: string
    KeyHeader: {
      Kdf: string
      KdfParams: {
        DkLen: number
        N: number
        P: number
        R: number
        SaltLen: number
      }
      Version: string
    }
    MAC: string
    Salt: string
  }
  Id: string
  Version: string
}

// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
interface V3Keystore {
  crypto: {
    cipher: string
    cipherparams: {
      iv: string
    }
    ciphertext: string
    kdf: string
    kdfparams: KDFParamsOut
    mac: string
  }
  id: string
  version: number
}

interface EthSaleKeystore {
  encseed: string
  ethaddr: string
  btcaddr: string
  email: string
}

// wallet implementation

export default class Wallet {
  constructor(
    private readonly privateKey?: Buffer | undefined,
    private publicKey: Buffer | undefined = undefined,
  ) {
    if (privateKey && publicKey) {
      throw new Error('Cannot supply both a private and a public key to the constructor')
    }

    if (privateKey && !ethUtil.isValidPrivate(privateKey)) {
      throw new Error('Private key does not satisfy the curve requirements (ie. it is invalid)')
    }

    if (publicKey && !ethUtil.isValidPublic(publicKey)) {
      throw new Error('Invalid public key')
    }
  }

  // static methods

  public static generate(icapDirect: boolean = false): Wallet {
    if (icapDirect) {
      const max = new ethUtil.BN('088f924eeceeda7fe92e1f5b0fffffffffffffff', 16)
      while (true) {
        const privateKey = randomBytes(32)
        if (new ethUtil.BN(ethUtil.privateToAddress(privateKey)).lte(max)) {
          return new Wallet(privateKey)
        }
      }
    } else {
      return new Wallet(randomBytes(32))
    }
  }

  public static generateVanityAddress(pattern: RegExp | string): Wallet {
    if (!(pattern instanceof RegExp)) {
      pattern = new RegExp(pattern)
    }

    while (true) {
      const privateKey = randomBytes(32)
      const address = ethUtil.privateToAddress(privateKey)

      if (pattern.test(address.toString('hex'))) {
        return new Wallet(privateKey)
      }
    }
  }

  public static fromPublicKey(publicKey: Buffer, nonStrict: boolean = false): Wallet {
    if (nonStrict) {
      publicKey = ethUtil.importPublic(publicKey)
    }
    return new Wallet(undefined, publicKey)
  }

  public static fromExtendedPublicKey(extendedPublicKey: string): Wallet {
    if (extendedPublicKey.slice(0, 4) !== 'xpub') {
      throw new Error('Not an extended public key')
    }
    const publicKey: Buffer = bs58check.decode(extendedPublicKey).slice(45)
    // Convert to an Ethereum public key
    return Wallet.fromPublicKey(publicKey, true)
  }

  public static fromPrivateKey(privateKey: Buffer): Wallet {
    return new Wallet(privateKey)
  }

  public static fromExtendedPrivateKey(extendedPrivateKey: string): Wallet {
    if (extendedPrivateKey.slice(0, 4) !== 'xprv') {
      throw new Error('Not an extended private key')
    }
    const tmp: Buffer = bs58check.decode(extendedPrivateKey)
    if (tmp[45] !== 0) {
      throw new Error('Invalid extended private key')
    }
    return Wallet.fromPrivateKey(tmp.slice(46))
  }

  public static fromV1(input: string | V1Keystore, password: string): Wallet {
    const json: V1Keystore = typeof input === 'object' ? input : JSON.parse(input)
    if (json.Version !== '1') {
      throw new Error('Not a V1 Wallet')
    }
    if (json.Crypto.KeyHeader.Kdf !== 'scrypt') {
      throw new Error('Unsupported key derivation scheme')
    }

    const kdfparams = json.Crypto.KeyHeader.KdfParams
    const derivedKey = scryptsy(
      Buffer.from(password),
      Buffer.from(json.Crypto.Salt, 'hex'),
      kdfparams.N,
      kdfparams.R,
      kdfparams.P,
      kdfparams.DkLen,
    )

    const ciphertext = Buffer.from(json.Crypto.CipherText, 'hex')
    const mac = ethUtil.keccak256(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    if (mac.toString('hex') !== json.Crypto.MAC) {
      throw new Error('Key derivation failed - possibly wrong passphrase')
    }

    const decipher = crypto.createDecipheriv(
      'aes-128-cbc',
      ethUtil.keccak256(derivedKey.slice(0, 16)).slice(0, 16),
      Buffer.from(json.Crypto.IV, 'hex'),
    )
    const seed = runCipherBuffer(decipher, ciphertext)
    return new Wallet(seed)
  }

  public static fromV3(
    input: string | V3Keystore,
    password: string,
    nonStrict: boolean = false,
  ): Wallet {
    const json: V3Keystore =
      typeof input === 'object' ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)

    if (json.version !== 3) {
      throw new Error('Not a V3 wallet')
    }

    let derivedKey: Buffer, kdfparams: any
    if (json.crypto.kdf === 'scrypt') {
      kdfparams = json.crypto.kdfparams

      // FIXME: support progress reporting callback
      derivedKey = scryptsy(
        Buffer.from(password),
        Buffer.from(kdfparams.salt, 'hex'),
        kdfparams.n,
        kdfparams.r,
        kdfparams.p,
        kdfparams.dklen,
      )
    } else if (json.crypto.kdf === 'pbkdf2') {
      kdfparams = json.crypto.kdfparams

      if (kdfparams.prf !== 'hmac-sha256') {
        throw new Error('Unsupported parameters to PBKDF2')
      }

      derivedKey = crypto.pbkdf2Sync(
        Buffer.from(password),
        Buffer.from(kdfparams.salt, 'hex'),
        kdfparams.c,
        kdfparams.dklen,
        'sha256',
      )
    } else {
      throw new Error('Unsupported key derivation scheme')
    }

    const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex')
    const mac = ethUtil.keccak256(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    if (mac.toString('hex') !== json.crypto.mac) {
      throw new Error('Key derivation failed - possibly wrong passphrase')
    }

    const decipher = crypto.createDecipheriv(
      json.crypto.cipher,
      derivedKey.slice(0, 16),
      Buffer.from(json.crypto.cipherparams.iv, 'hex'),
    )
    const seed = runCipherBuffer(decipher, ciphertext)
    return new Wallet(seed)
  }

  /*
   * Based on https://github.com/ethereum/pyethsaletool/blob/master/pyethsaletool.py
   * JSON fields: encseed, ethaddr, btcaddr, email
   */
  public static fromEthSale(input: string | EthSaleKeystore, password: string): Wallet {
    const json: EthSaleKeystore = typeof input === 'object' ? input : JSON.parse(input)

    const encseed = Buffer.from(json.encseed, 'hex')

    // key derivation
    const derivedKey = crypto.pbkdf2Sync(password, password, 2000, 32, 'sha256').slice(0, 16)

    // seed decoding (IV is first 16 bytes)
    // NOTE: crypto (derived from openssl) when used with aes-*-cbc will handle PKCS#7 padding internally
    //       see also http://stackoverflow.com/a/31614770/4964819
    const decipher = crypto.createDecipheriv('aes-128-cbc', derivedKey, encseed.slice(0, 16))
    const seed = runCipherBuffer(decipher, encseed.slice(16))

    const wallet = new Wallet(ethUtil.keccak256(seed))
    if (wallet.getAddress().toString('hex') !== json.ethaddr) {
      throw new Error('Decoded key mismatch - possibly wrong passphrase')
    }
    return wallet
  }

  // private getters

  private get pubKey(): Buffer {
    if (!keyExists(this.publicKey)) {
      this.publicKey = ethUtil.privateToPublic(this.privateKey as Buffer)
    }
    return this.publicKey
  }

  private get privKey(): Buffer {
    if (!keyExists(this.privateKey)) {
      throw new Error('This is a public key only wallet')
    }
    return this.privateKey
  }

  // public instance methods

  // tslint:disable-next-line
  public getPrivateKey(): Buffer {
    return this.privKey
  }

  public getPrivateKeyString(): string {
    return ethUtil.bufferToHex(this.privKey)
  }

  // tslint:disable-next-line
  public getPublicKey(): Buffer {
    return this.pubKey
  }

  public getPublicKeyString(): string {
    return ethUtil.bufferToHex(this.getPublicKey())
  }

  public getAddress(): Buffer {
    return ethUtil.publicToAddress(this.pubKey)
  }

  public getAddressString(): string {
    return ethUtil.bufferToHex(this.getAddress())
  }

  public getChecksumAddressString(): string {
    return ethUtil.toChecksumAddress(this.getAddressString())
  }

  public toV3(password: string, opts?: Partial<V3Params>): V3Keystore {
    if (!keyExists(this.privateKey)) {
      throw new Error('This is a public key only wallet')
    }

    const v3Params: V3ParamsStrict = mergeToV3ParamsWithDefaults(opts)

    let kdfParams: KDFParams
    let derivedKey: Buffer
    switch (v3Params.kdf) {
      case KDFFunctions.PBKDF:
        kdfParams = kdfParamsForPBKDF(v3Params)
        derivedKey = crypto.pbkdf2Sync(
          Buffer.from(password),
          kdfParams.salt,
          kdfParams.c,
          kdfParams.dklen,
          'sha256',
        )
        break
      case KDFFunctions.Scrypt:
        kdfParams = kdfParamsForScrypt(v3Params)
        // FIXME: support progress reporting callback
        derivedKey = scryptsy(
          Buffer.from(password),
          kdfParams.salt,
          kdfParams.n,
          kdfParams.r,
          kdfParams.p,
          kdfParams.dklen,
        )
        break
      default:
        throw new Error('Unsupported kdf')
    }

    const cipher: crypto.Cipher = crypto.createCipheriv(
      v3Params.cipher,
      derivedKey.slice(0, 16),
      v3Params.iv,
    )
    if (!cipher) {
      throw new Error('Unsupported cipher')
    }

    const ciphertext = runCipherBuffer(cipher, this.privKey)
    const mac = ethUtil.keccak256(
      Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext)]),
    )

    return {
      version: 3,
      id: uuidv4({ random: v3Params.uuid }),
      // @ts-ignore - the official V3 keystore spec omits the address key
      address: this.getAddress().toString('hex'),
      crypto: {
        ciphertext: ciphertext.toString('hex'),
        cipherparams: { iv: v3Params.iv.toString('hex') },
        cipher: v3Params.cipher,
        kdf: v3Params.kdf,
        kdfparams: {
          ...kdfParams,
          salt: kdfParams.salt.toString('hex'),
        },
        mac: mac.toString('hex'),
      },
    }
  }

  public getV3Filename(timestamp?: number): string {
    /*
     * We want a timestamp like 2016-03-15T17-11-33.007598288Z. Date formatting
     * is a pain in Javascript, everbody knows that. We could use moment.js,
     * but decide to do it manually in order to save space.
     *
     * toJSON() returns a pretty close version, so let's use it. It is not UTC though,
     * but does it really matter?
     *
     * Alternative manual way with padding and Date fields: http://stackoverflow.com/a/7244288/4964819
     *
     */
    const ts = timestamp ? new Date(timestamp) : new Date()
    return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', this.getAddress().toString('hex')].join(
      '',
    )
  }

  public toV3String(password: string, opts?: Partial<V3Params>): string {
    return JSON.stringify(this.toV3(password, opts))
  }
}

// helpers

function runCipherBuffer(cipher: crypto.Cipher | crypto.Decipher, data: Buffer): Buffer {
  return Buffer.concat([cipher.update(data), cipher.final()])
}

function keyExists(k: Buffer | undefined | null): k is Buffer {
  return k !== undefined && k !== null
}
