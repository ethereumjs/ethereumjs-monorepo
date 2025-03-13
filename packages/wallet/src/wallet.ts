// cspell:ignore uuidv kdfparams dklen xprv xpub
import {
  bytesToHex,
  bytesToUnprefixedHex,
  concatBytes,
  equalsBytes,
  importPublic,
  isValidPrivate,
  isValidPublic,
  privateToAddress,
  privateToPublic,
  publicToAddress,
  randomBytes,
  toChecksumAddress,
  unprefixedHexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { base58check } from '@scure/base'
import * as aes from 'ethereum-cryptography/aes.js'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { pbkdf2 } from 'ethereum-cryptography/pbkdf2.js'
import { scrypt } from 'ethereum-cryptography/scrypt.js'
import { sha256 } from 'ethereum-cryptography/sha256.js'
import { v4 as uuidv4 } from 'uuid'

import type { PrefixedHexString } from '@ethereumjs/util'

const bs58check = base58check(sha256)

interface KDFParamsV1 {
  N: number
  P: number
  R: number
  DkLen: number
}
function scryptV1(password: Uint8Array, salt: Uint8Array, kdfparams: KDFParamsV1) {
  const { N, P, R, DkLen } = kdfparams
  return scrypt(password, salt, N, P, R, DkLen)
}
function scryptV3(password: string, kdfparams: ScryptKDFParams) {
  const { salt, n, p, r, dklen } = kdfparams
  return scrypt(utf8ToBytes(password), salt, n, p, r, dklen)
}
function scryptV3Out(password: string, kdfparams: ScryptKDFParamsOut) {
  const { salt, n, p, r, dklen } = kdfparams
  return scrypt(utf8ToBytes(password), unprefixedHexToBytes(salt), n, p, r, dklen)
}

// parameters for the toV3() method

interface V3Params {
  kdf: string
  cipher: string
  salt: string | Uint8Array
  iv: string | Uint8Array
  uuid: string | Uint8Array
  dklen: number
  c: number
  n: number
  r: number
  p: number
}

interface V3ParamsStrict {
  kdf: string
  cipher: string
  salt: Uint8Array
  iv: Uint8Array
  uuid: Uint8Array
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
  if (!str && length === undefined) {
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

function validateBytes(paramName: string, bytes: Uint8Array, length?: number) {
  if (!(bytes instanceof Uint8Array)) {
    const howManyHex =
      typeof length === 'number' ? `${length * 2}` : 'empty or a non-zero even number of'
    const howManyBytes = typeof length === 'number' ? ` (${length} bytes)` : ''
    throw new Error(
      `Invalid ${paramName}, must be a string (${howManyHex} hex characters) or Uint8Array${howManyBytes}`,
    )
  }
  if (typeof length === 'number' && bytes.length !== length) {
    throw new Error(`Invalid ${paramName}, Uint8Array must be ${length} bytes`)
  }
  return bytes
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
    params.salt = unprefixedHexToBytes(validateHexString('salt', params.salt))
  }
  if (typeof params.iv === 'string') {
    params.iv = unprefixedHexToBytes(validateHexString('iv', params.iv, 32))
  }
  if (typeof params.uuid === 'string') {
    params.uuid = unprefixedHexToBytes(validateHexString('uuid', params.uuid, 32))
  }

  if (params.salt) {
    validateBytes('salt', params.salt)
  }
  if (params.iv) {
    validateBytes('iv', params.iv, 16)
  }
  if (params.uuid) {
    validateBytes('uuid', params.uuid, 16)
  }

  return {
    ...v3Defaults,
    ...(params as V3ParamsStrict),
  }
}

// KDF

export type KDFFunctions = (typeof KDFFunctions)[keyof typeof KDFFunctions]

export const KDFFunctions = {
  PBKDF: 'pbkdf2',
  Scrypt: 'scrypt',
} as const

interface ScryptKDFParams {
  dklen: number
  n: number
  p: number
  r: number
  salt: Uint8Array
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
  salt: Uint8Array
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
    p: opts.p,
    r: opts.r,
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

export class Wallet {
  private readonly privateKey?: Uint8Array
  private publicKey: Uint8Array | undefined

  constructor(privateKey?: Uint8Array, publicKey?: Uint8Array) {
    this.privateKey = privateKey
    this.publicKey = publicKey
    if (privateKey && publicKey) {
      throw new Error('Cannot supply both a private and a public key to the constructor')
    }

    if (privateKey && !isValidPrivate(privateKey)) {
      throw new Error('Private key does not satisfy the curve requirements (ie. it is invalid)')
    }

    if (publicKey && !isValidPublic(publicKey)) {
      throw new Error('Invalid public key')
    }
  }

  // static methods

  /**
   * Create an instance based on a new random key.
   *
   * @param icapDirect setting this to `true` will generate an address suitable for the `ICAP Direct mode`
   */
  public static generate(icapDirect = false): Wallet {
    if (icapDirect) {
      const max = BigInt('0x088f924eeceeda7fe92e1f5b0fffffffffffffff')
      for (;;) {
        const privateKey = randomBytes(32)
        const hex = bytesToUnprefixedHex(privateToAddress(privateKey))
        if (BigInt('0x' + hex) <= max) {
          return new Wallet(privateKey)
        }
      }
    } else {
      return new Wallet(randomBytes(32))
    }
  }

  /**
   * Create an instance where the address is valid against the supplied pattern (**this will be very slow**)
   */
  public static generateVanityAddress(pattern: RegExp | string): Wallet {
    if (!(pattern instanceof RegExp)) {
      pattern = new RegExp(pattern)
    }

    for (;;) {
      const privateKey = randomBytes(32)
      const address = privateToAddress(privateKey)
      if (pattern.test(bytesToUnprefixedHex(address))) {
        return new Wallet(privateKey)
      }
    }
  }

  /**
   * Create an instance based on a public key (certain methods will not be available)
   *
   * This method only accepts uncompressed Ethereum-style public keys, unless
   * the `nonStrict` flag is set to true.
   */
  public static fromPublicKey(publicKey: Uint8Array, nonStrict = false): Wallet {
    if (nonStrict) {
      publicKey = importPublic(publicKey)
    }
    return new Wallet(undefined, publicKey)
  }

  /**
   * Create an instance based on a BIP32 extended public key (xpub)
   */
  public static fromExtendedPublicKey(extendedPublicKey: string): Wallet {
    if (extendedPublicKey.slice(0, 4) !== 'xpub') {
      throw new Error('Not an extended public key')
    }
    const publicKey: Uint8Array = bs58check.decode(extendedPublicKey).subarray(45)
    // Convert to an Ethereum public key
    return Wallet.fromPublicKey(publicKey, true)
  }

  /**
   * Create an instance based on a raw private key
   */
  public static fromPrivateKey(privateKey: Uint8Array): Wallet {
    return new Wallet(privateKey)
  }

  /**
   * Create an instance based on a BIP32 extended private key (xprv)
   */
  public static fromExtendedPrivateKey(extendedPrivateKey: string): Wallet {
    if (extendedPrivateKey.slice(0, 4) !== 'xprv') {
      throw new Error('Not an extended private key')
    }
    const tmp: Uint8Array = bs58check.decode(extendedPrivateKey)
    if (tmp[45] !== 0) {
      throw new Error('Invalid extended private key')
    }
    return Wallet.fromPrivateKey(tmp.subarray(46))
  }

  /**
   * Import a wallet (Version 1 of the Ethereum wallet format).
   *
   * @param input A JSON serialized string, or an object representing V1 Keystore.
   * @param password The keystore password.
   */
  public static async fromV1(input: string | V1Keystore, password: string): Promise<Wallet> {
    const json: V1Keystore = typeof input === 'object' ? input : JSON.parse(input)
    if (json.Version !== '1') {
      throw new Error('Not a V1 Wallet')
    }
    if (json.Crypto.KeyHeader.Kdf !== 'scrypt') {
      throw new Error('Unsupported key derivation scheme')
    }

    const kdfparams = json.Crypto.KeyHeader.KdfParams
    const salt = unprefixedHexToBytes(json.Crypto.Salt)
    const derivedKey = await scryptV1(utf8ToBytes(password), salt, kdfparams)
    const ciphertext = unprefixedHexToBytes(json.Crypto.CipherText)
    const mac = keccak256(concatBytes(derivedKey.subarray(16, 32), ciphertext))
    if (bytesToUnprefixedHex(mac) !== json.Crypto.MAC) {
      throw new Error('Key derivation failed - possibly wrong passphrase')
    }

    const seed = aes.decrypt(
      ciphertext,
      keccak256(derivedKey.subarray(0, 16)).subarray(0, 16),
      unprefixedHexToBytes(json.Crypto.IV),
      'aes-128-cbc',
    )
    return new Wallet(seed)
  }

  /**
   * Import a wallet (Version 3 of the Ethereum wallet format). Set `nonStrict` true to accept files with mixed-caps.
   *
   * @param input A JSON serialized string, or an object representing V3 Keystore.
   * @param password The keystore password.
   */
  public static async fromV3(
    input: string | V3Keystore,
    password: string,
    nonStrict = false,
  ): Promise<Wallet> {
    const json: V3Keystore =
      typeof input === 'object' ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)

    if (json.version !== 3) {
      throw new Error('Not a V3 wallet')
    }

    let derivedKey: Uint8Array, kdfparams: any
    if (json.crypto.kdf === 'scrypt') {
      kdfparams = json.crypto.kdfparams
      // FIXME: support progress reporting callback
      derivedKey = await scryptV3Out(password, kdfparams)
    } else if (json.crypto.kdf === 'pbkdf2') {
      kdfparams = json.crypto.kdfparams

      if (kdfparams.prf !== 'hmac-sha256') {
        throw new Error('Unsupported parameters to PBKDF2')
      }

      derivedKey = await pbkdf2(
        utf8ToBytes(password),
        unprefixedHexToBytes(kdfparams.salt),
        kdfparams.c,
        kdfparams.dklen,
        'sha256',
      )
    } else {
      throw new Error('Unsupported key derivation scheme')
    }

    const ciphertext = unprefixedHexToBytes(json.crypto.ciphertext)
    const mac = keccak256(concatBytes(derivedKey.subarray(16, 32), ciphertext))
    if (bytesToUnprefixedHex(mac) !== json.crypto.mac) {
      throw new Error('Key derivation failed - possibly wrong passphrase')
    }

    const seed = aes.decrypt(
      ciphertext,
      derivedKey.subarray(0, 16),
      unprefixedHexToBytes(json.crypto.cipherparams.iv),
      json.crypto.cipher,
    )
    return new Wallet(seed)
  }

  /*
   * Import an Ethereum Pre Sale wallet.
   * Based on https://github.com/ethereum/pyethsaletool/blob/master/pyethsaletool.py
   * JSON fields: encseed, ethaddr, btcaddr, email
   *
   * @param input A JSON serialized string, or an object representing EthSale Keystore.
   * @param password The keystore password.
   */
  public static async fromEthSale(
    input: string | EthSaleKeystore,
    password: string,
  ): Promise<Wallet> {
    const json: EthSaleKeystore = typeof input === 'object' ? input : JSON.parse(input)

    const encseed = unprefixedHexToBytes(json.encseed)

    // key derivation
    const pass = utf8ToBytes(password)
    const derivedKey = (await pbkdf2(pass, pass, 2000, 32, 'sha256')).subarray(0, 16)

    // seed decoding (IV is first 16 bytes)
    // NOTE: crypto (derived from openssl) when used with aes-*-cbc will handle PKCS#7 padding internally
    //       see also http://stackoverflow.com/a/31614770/4964819
    const seed = aes.decrypt(
      encseed.subarray(16),
      derivedKey,
      encseed.subarray(0, 16),
      'aes-128-cbc',
      true,
    )

    const wallet = new Wallet(keccak256(seed))
    if (bytesToUnprefixedHex(wallet.getAddress()) !== json.ethaddr) {
      throw new Error('Decoded key mismatch - possibly wrong passphrase')
    }
    return wallet
  }

  // private getters

  /**
   * Returns the wallet's public key.
   */
  private get pubKey(): Uint8Array {
    if (this.publicKey === undefined || this.publicKey === null) {
      this.publicKey = privateToPublic(this.privateKey!)
    }
    return this.publicKey
  }

  /**
   * Returns the wallet's private key.
   */
  private get privKey(): Uint8Array {
    if (this.privateKey === undefined || this.privateKey === null) {
      throw new Error('This is a public key only wallet')
    }
    return this.privateKey
  }

  // public instance methods

  /**
   * Returns the wallet's private key.
   *
   */
  public getPrivateKey(): Uint8Array {
    return this.privKey
  }

  public getPrivateKeyString(): PrefixedHexString {
    return bytesToHex(this.privKey)
  }

  /**
   * Returns the wallet's public key.
   */
  public getPublicKey(): Uint8Array {
    return this.pubKey
  }

  /**
   * Returns the wallet's public key as a "0x" prefixed hex string
   */
  public getPublicKeyString(): PrefixedHexString {
    return bytesToHex(this.getPublicKey())
  }

  /**
   * Returns the wallet's address.
   */
  public getAddress(): Uint8Array {
    return publicToAddress(this.pubKey)
  }

  /**
   * Returns the wallet's address as a "0x" prefixed hex string
   */
  public getAddressString(): PrefixedHexString {
    return bytesToHex(this.getAddress())
  }

  /**
   * Returns the wallet's private key as a "0x" prefixed hex string checksummed
   * according to [EIP 55](https://github.com/ethereum/EIPs/issues/55).
   */
  public getChecksumAddressString(): PrefixedHexString {
    return toChecksumAddress(this.getAddressString())
  }

  /**
   * Returns an Ethereum Version 3 Keystore Format object representing the wallet
   *
   * @param password The password used to encrypt the Keystore.
   * @param opts The options for the keystore. See [its spec](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition) for more info.
   */
  public async toV3(password: string, opts?: Partial<V3Params>): Promise<V3Keystore> {
    if (this.privateKey === undefined || this.privateKey === null) {
      throw new Error('This is a public key only wallet')
    }

    const v3Params: V3ParamsStrict = mergeToV3ParamsWithDefaults(opts)

    let kdfParams: KDFParams
    let derivedKey: Uint8Array
    switch (v3Params.kdf) {
      case KDFFunctions.PBKDF:
        kdfParams = kdfParamsForPBKDF(v3Params)
        derivedKey = await pbkdf2(
          utf8ToBytes(password),
          kdfParams.salt,
          kdfParams.c,
          kdfParams.dklen,
          'sha256',
        )
        break
      case KDFFunctions.Scrypt:
        kdfParams = kdfParamsForScrypt(v3Params)
        // FIXME: support progress reporting callback
        derivedKey = await scryptV3(password, kdfParams)
        break
      default:
        throw new Error('Unsupported kdf')
    }

    const ciphertext = aes.encrypt(
      this.privKey,
      derivedKey.subarray(0, 16),
      v3Params.iv,
      v3Params.cipher,
      false,
    )
    const mac = keccak256(concatBytes(derivedKey.subarray(16, 32), ciphertext))

    return {
      version: 3,
      id: uuidv4({ random: v3Params.uuid }),
      // @ts-ignore - the official V3 keystore spec omits the address key
      address: bytesToUnprefixedHex(this.getAddress()),
      crypto: {
        ciphertext: bytesToUnprefixedHex(ciphertext),
        cipherparams: { iv: bytesToUnprefixedHex(v3Params.iv) },
        cipher: v3Params.cipher,
        kdf: v3Params.kdf,
        kdfparams: {
          ...kdfParams,
          salt: bytesToUnprefixedHex(kdfParams.salt),
        },
        mac: bytesToUnprefixedHex(mac),
      },
    }
  }

  /**
   * Return the suggested filename for V3 keystores.
   */
  public getV3Filename(timestamp?: number): string {
    /*
     * We want a timestamp like 2016-03-15T17-11-33.007598288Z. Date formatting
     * is a pain in Javascript, everybody knows that. We could use moment.js,
     * but decide to do it manually in order to save space.
     *
     * toJSON() returns a pretty close version, so let's use it. It is not UTC though,
     * but does it really matter?
     *
     * Alternative manual way with padding and Date fields: http://stackoverflow.com/a/7244288/4964819
     *
     */
    const ts = timestamp !== undefined ? new Date(timestamp) : new Date()
    return [
      'UTC--',
      ts.toJSON().replace(/:/g, '-'),
      '--',
      bytesToUnprefixedHex(this.getAddress()),
    ].join('')
  }

  public async toV3String(password: string, opts?: Partial<V3Params>): Promise<string> {
    return JSON.stringify(await this.toV3(password, opts))
  }

  /**
   * Verify the publicKey, privateKey pair
   *
   * @param publicKey the public key to verify against the private key of the wallet
   */
  public verifyPublicKey(publicKey: Uint8Array): boolean {
    if (this.privateKey === undefined) return false
    return equalsBytes(privateToPublic(this.privateKey), publicKey)
  }
}
