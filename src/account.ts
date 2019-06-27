const assert = require('assert')
const ethjsUtil = require('ethjs-util')
const secp256k1 = require('secp256k1')
import BN = require('bn.js')
import { toBuffer, addHexPrefix, zeros, bufferToHex, unpad } from './bytes'
import { keccak, keccak256, rlphash } from './hash'

/**
 * Returns a zero address.
 */
export const zeroAddress = function(): string {
  const addressLength = 20
  const addr = zeros(addressLength)
  return bufferToHex(addr)
}

/**
 * Checks if the address is a valid. Accepts checksummed addresses too.
 */
export const isValidAddress = function(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

/**
 * Checks if a given address is a zero address.
 */
export const isZeroAddress = function(address: string): boolean {
  const zeroAddr = zeroAddress()
  return zeroAddr === addHexPrefix(address)
}

/**
 * Returns a checksummed address.
 *
 * If a eip1191ChainId is provided, the chainId will be included in the checksum calculation. This
 * has the effect of checksummed addresses for one chain having invalid checksums for others.
 * For more details, consult EIP-1191.
 *
 * WARNING: Checksums with and without the chainId will differ. As of 2019-06-26, the most commonly
 * used variation in Ethereum was without the chainId. This may change in the future.
 */
export const toChecksumAddress = function(address: string, eip1191ChainId?: number): string {
  address = ethjsUtil.stripHexPrefix(address).toLowerCase()

  const prefix = eip1191ChainId !== undefined ? eip1191ChainId.toString() + '0x' : ''

  const hash = keccak(prefix + address).toString('hex')
  let ret = '0x'

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

/**
 * Checks if the address is a valid checksummed address.
 *
 * See toChecksumAddress' documentation for details about the eip1191ChainId parameter.
 */
export const isValidChecksumAddress = function(address: string, eip1191ChainId?: number): boolean {
  return isValidAddress(address) && toChecksumAddress(address, eip1191ChainId) === address
}

/**
 * Generates an address of a newly created contract.
 * @param from The address which is creating this new address
 * @param nonce The nonce of the from account
 */
export const generateAddress = function(from: Buffer, nonce: Buffer): Buffer {
  from = toBuffer(from)
  const nonceBN = new BN(nonce)

  if (nonceBN.isZero()) {
    // in RLP we want to encode null in the case of zero nonce
    // read the RLP documentation for an answer if you dare
    return rlphash([from, null]).slice(-20)
  }

  // Only take the lower 160bits of the hash
  return rlphash([from, Buffer.from(nonceBN.toArray())]).slice(-20)
}

/**
 * Generates an address for a contract created using CREATE2.
 * @param from The address which is creating this new address
 * @param salt A salt
 * @param initCode The init code of the contract being created
 */
export const generateAddress2 = function(
  from: Buffer | string,
  salt: Buffer | string,
  initCode: Buffer | string,
): Buffer {
  const fromBuf = toBuffer(from)
  const saltBuf = toBuffer(salt)
  const initCodeBuf = toBuffer(initCode)

  assert(fromBuf.length === 20)
  assert(saltBuf.length === 32)

  const address = keccak256(
    Buffer.concat([Buffer.from('ff', 'hex'), fromBuf, saltBuf, keccak256(initCodeBuf)]),
  )

  return address.slice(-20)
}

/**
 * Returns true if the supplied address belongs to a precompiled account (Byzantium).
 */
export const isPrecompiled = function(address: Buffer | string): boolean {
  const a = unpad(address)
  return a.length === 1 && a[0] >= 1 && a[0] <= 8
}

/**
 * Checks if the private key satisfies the rules of the curve secp256k1.
 */
export const isValidPrivate = function(privateKey: Buffer): boolean {
  return secp256k1.privateKeyVerify(privateKey)
}

/**
 * Checks if the public key satisfies the rules of the curve secp256k1
 * and the requirements of Ethereum.
 * @param publicKey The two points of an uncompressed key, unless sanitize is enabled
 * @param sanitize Accept public keys in other formats
 */
export const isValidPublic = function(publicKey: Buffer, sanitize: boolean = false): boolean {
  if (publicKey.length === 64) {
    // Convert to SEC1 for secp256k1
    return secp256k1.publicKeyVerify(Buffer.concat([Buffer.from([4]), publicKey]))
  }

  if (!sanitize) {
    return false
  }

  return secp256k1.publicKeyVerify(publicKey)
}

/**
 * Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param pubKey The two points of an uncompressed key, unless sanitize is enabled
 * @param sanitize Accept public keys in other formats
 */
export const pubToAddress = function(pubKey: Buffer, sanitize: boolean = false): Buffer {
  pubKey = toBuffer(pubKey)
  if (sanitize && pubKey.length !== 64) {
    pubKey = secp256k1.publicKeyConvert(pubKey, false).slice(1)
  }
  assert(pubKey.length === 64)
  // Only take the lower 160bits of the hash
  return keccak(pubKey).slice(-20)
}
export const publicToAddress = pubToAddress

/**
 * Returns the ethereum address of a given private key.
 * @param privateKey A private key must be 256 bits wide
 */
export const privateToAddress = function(privateKey: Buffer): Buffer {
  return publicToAddress(privateToPublic(privateKey))
}

/**
 * Returns the ethereum public key of a given private key.
 * @param privateKey A private key must be 256 bits wide
 */
export const privateToPublic = function(privateKey: Buffer): Buffer {
  privateKey = toBuffer(privateKey)
  // skip the type flag and use the X, Y points
  return secp256k1.publicKeyCreate(privateKey, false).slice(1)
}

/**
 * Converts a public key to the Ethereum format.
 */
export const importPublic = function(publicKey: Buffer): Buffer {
  publicKey = toBuffer(publicKey)
  if (publicKey.length !== 64) {
    publicKey = secp256k1.publicKeyConvert(publicKey, false).slice(1)
  }
  return publicKey
}
