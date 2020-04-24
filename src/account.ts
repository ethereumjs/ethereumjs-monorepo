const ethjsUtil = require('ethjs-util')
import * as assert from 'assert'
import * as secp256k1 from 'secp256k1'
import * as BN from 'bn.js'
import { zeros, bufferToHex } from './bytes'
import { keccak, keccak256, rlphash } from './hash'
import { assertIsHexString, assertIsBuffer } from './helpers'

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
export const isValidAddress = function(hexAddress: string): boolean {
  assertIsHexString(hexAddress)
  return /^0x[0-9a-fA-F]{40}$/.test(hexAddress)
}

/**
 * Checks if a given address is a zero address.
 */
export const isZeroAddress = function(hexAddress: string): boolean {
  assertIsHexString(hexAddress)
  const zeroAddr = zeroAddress()
  return zeroAddr === hexAddress
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
export const toChecksumAddress = function(hexAddress: string, eip1191ChainId?: number): string {
  assertIsHexString(hexAddress)
  const address = ethjsUtil.stripHexPrefix(hexAddress).toLowerCase()

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
export const isValidChecksumAddress = function(
  hexAddress: string,
  eip1191ChainId?: number,
): boolean {
  return isValidAddress(hexAddress) && toChecksumAddress(hexAddress, eip1191ChainId) === hexAddress
}

/**
 * Generates an address of a newly created contract.
 * @param from The address which is creating this new address
 * @param nonce The nonce of the from account
 */
export const generateAddress = function(from: Buffer, nonce: Buffer): Buffer {
  assertIsBuffer(from)
  assertIsBuffer(nonce)
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
export const generateAddress2 = function(from: Buffer, salt: Buffer, initCode: Buffer): Buffer {
  assertIsBuffer(from)
  assertIsBuffer(salt)
  assertIsBuffer(initCode)

  assert(from.length === 20)
  assert(salt.length === 32)

  const address = keccak256(
    Buffer.concat([Buffer.from('ff', 'hex'), from, salt, keccak256(initCode)]),
  )

  return address.slice(-20)
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
  assertIsBuffer(pubKey)
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
  assertIsBuffer(privateKey)
  // skip the type flag and use the X, Y points
  return secp256k1.publicKeyCreate(privateKey, false).slice(1)
}

/**
 * Converts a public key to the Ethereum format.
 */
export const importPublic = function(publicKey: Buffer): Buffer {
  assertIsBuffer(publicKey)
  if (publicKey.length !== 64) {
    publicKey = secp256k1.publicKeyConvert(publicKey, false).slice(1)
  }
  return publicKey
}
