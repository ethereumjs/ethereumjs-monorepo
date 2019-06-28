import * as crypto from 'crypto'
import * as ethUtil from 'ethereumjs-util'

const bs58check = require('bs58check')
const randomBytes = require('randombytes')
const scryptsy = require('scrypt.js')
const uuidv4 = require('uuid/v4')

// parameters for the toV3() method

interface V3Params {
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

function mergeToV3ParamsWithDefaults(params?: Partial<V3Params>): V3Params {
  const v3Defaults: V3Params = {
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
  return {
    cipher: params.cipher || 'aes-128-ctr',
    kdf: params.kdf || 'scrypt',
    salt: params.salt || randomBytes(32),
    iv: params.iv || randomBytes(16),
    uuid: params.uuid || randomBytes(16),
    dklen: params.dklen || 32,
    c: params.c || 262144,
    n: params.n || 262144,
    r: params.r || 8,
    p: params.p || 1,
  }
}

interface KDFParams {
  c: number
  prf: string
  dklen: number
  n: number
  r: number
  p: number
  salt: string
}

/**
 * Based on the parameter list passed to the Wallet.prototype.toV3() method this
 * returns a list of parameters for running the key derivation function.
 * @param params params passed into the .toV3() method
 */
function mergeKDFParamsWithDefaults(params: V3Params): KDFParams {
  const kdfDefaults = {
    c: 262144,
    prf: 'hmac-sha256',
    n: 262144,
    r: 8,
    p: 1,
    salt: params.salt.toString('hex'),
  }

  return {
    dklen: params.dklen,
    salt: kdfDefaults.salt,
    c: params.c || kdfDefaults.c,
    prf: kdfDefaults.prf,
    n: params.n || kdfDefaults.n,
    r: params.r || kdfDefaults.r,
    p: params.p || kdfDefaults.c,
  }
}

function stripUnusedKDFParamsForPBKDF2(params: KDFParams): Partial<KDFParams> {
  delete params.n
  delete params.r
  delete params.p
  return params
}

function stripUnusedKDFParamsForScrypt(params: KDFParams): Partial<KDFParams> {
  delete params.c
  delete params.prf
  return params
}

export class Wallet {
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

  // https://github.com/ethereum/go-ethereum/wiki/Passphrase-protected-key-store-spec
  public static fromV1(input: string | Object, password: string): Wallet {
    const json = typeof input === 'object' ? input : JSON.parse(input)

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
    input: string | Object,
    password: string,
    nonStrict: boolean = false,
  ): Wallet {
    const json =
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
  public static fromEthSale(input: string | Object, password: string): Wallet {
    const json = typeof input === 'object' ? input : JSON.parse(input)

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

  // public instance methods

  public getPrivateKey(): Buffer {
    return this.privKey
  }

  public getPrivateKeyString(): string {
    return ethUtil.bufferToHex(this.privKey)
  }

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

  public toV3(password: string, opts?: Partial<V3Params>) {
    if (!keyExists(this.privateKey)) {
      throw new Error('This is a public key only wallet')
    }

    const params = mergeToV3ParamsWithDefaults(opts)
    const kdfParams = mergeKDFParamsWithDefaults(params)

    let derivedKey: Buffer, finalKDFParams: Partial<KDFParams>
    if (params.kdf === 'pbkdf2') {
      derivedKey = crypto.pbkdf2Sync(
        Buffer.from(password),
        params.salt,
        kdfParams.c,
        kdfParams.dklen,
        'sha256',
      )
      finalKDFParams = stripUnusedKDFParamsForPBKDF2(kdfParams)
    } else if (params.kdf === 'scrypt') {
      // FIXME: support progress reporting callback
      derivedKey = scryptsy(
        Buffer.from(password),
        params.salt,
        kdfParams.n,
        kdfParams.r,
        kdfParams.p,
        kdfParams.dklen,
      )
      finalKDFParams = stripUnusedKDFParamsForScrypt(kdfParams)
    } else {
      throw new Error('Unsupported kdf')
    }

    const cipher: crypto.Cipher = crypto.createCipheriv(
      params.cipher,
      derivedKey.slice(0, 16),
      params.iv,
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
      id: uuidv4({ random: params.uuid }),
      address: this.getAddress().toString('hex'),
      crypto: {
        ciphertext: ciphertext.toString('hex'),
        cipherparams: { iv: params.iv.toString('hex') },
        cipher: params.cipher,
        kdf: params.kdf,
        kdfparams: finalKDFParams,
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

function keyExists(k: Buffer | undefined): k is Buffer {
  return k !== undefined
}
