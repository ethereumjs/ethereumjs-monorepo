import { bytesToHex, equalsBytes } from 'ethereum-cryptography/utils'

import {
  generateAddress,
  generateAddress2,
  isValidAddress,
  privateToAddress,
  pubToAddress,
} from './account'
import { bigIntToBytes, bytesToBigInt, toBytes, zeros } from './bytes'

/**
 * Handling and generating Ethereum addresses
 */
export class Address {
  public readonly bytes: Uint8Array

  constructor(bytes: Uint8Array) {
    if (bytes.length !== 20) {
      throw new Error('Invalid address length')
    }
    this.bytes = bytes
  }

  /**
   * Returns the zero address.
   */
  static zero(): Address {
    return new Address(zeros(20))
  }

  /**
   * Returns an Address object from a hex-encoded string.
   * @param str - Hex-encoded address
   */
  static fromString(str: string): Address {
    if (!isValidAddress(str)) {
      throw new Error('Invalid address')
    }
    return new Address(toBytes(str))
  }

  /**
   * Returns an address for a given public key.
   * @param pubKey The two points of an uncompressed key
   */
  static fromPublicKey(pubKey: Buffer): Address {
    if (!Buffer.isBuffer(pubKey)) {
      throw new Error('Public key should be Buffer')
    }
    const buf = pubToAddress(pubKey)
    return new Address(buf)
  }

  /**
   * Returns an address for a given private key.
   * @param privateKey A private key must be 256 bits wide
   */
  static fromPrivateKey(privateKey: Buffer): Address {
    if (!Buffer.isBuffer(privateKey)) {
      throw new Error('Private key should be Buffer')
    }
    const buf = privateToAddress(privateKey)
    return new Address(buf)
  }

  /**
   * Generates an address for a newly created contract.
   * @param from The address which is creating this new address
   * @param nonce The nonce of the from account
   */
  static generate(from: Address, nonce: bigint): Address {
    if (typeof nonce !== 'bigint') {
      throw new Error('Expected nonce to be a bigint')
    }
    return new Address(generateAddress(from.bytes, bigIntToBytes(nonce)))
  }

  /**
   * Generates an address for a contract created using CREATE2.
   * @param from The address which is creating this new address
   * @param salt A salt
   * @param initCode The init code of the contract being created
   */
  static generate2(from: Address, salt: Buffer, initCode: Buffer): Address {
    if (!Buffer.isBuffer(salt)) {
      throw new Error('Expected salt to be a Buffer')
    }
    if (!Buffer.isBuffer(initCode)) {
      throw new Error('Expected initCode to be a Buffer')
    }
    return new Address(generateAddress2(from.bytes, salt, initCode))
  }

  /**
   * Is address equal to another.
   */
  equals(address: Address): boolean {
    return equalsBytes(this.bytes, address.bytes)
  }

  /**
   * Is address zero.
   */
  isZero(): boolean {
    return this.equals(Address.zero())
  }

  /**
   * True if address is in the address range defined
   * by EIP-1352
   */
  isPrecompileOrSystemAddress(): boolean {
    const address = bytesToBigInt(this.bytes)
    const rangeMin = BigInt(0)
    const rangeMax = BigInt('0xffff')
    return address >= rangeMin && address <= rangeMax
  }

  /**
   * Returns hex encoding of address.
   */
  toString(): string {
    return bytesToHex(this.bytes)
  }

  /**
   * Returns Buffer representation of address.
   */
  toBytes(): Buffer {
    return Buffer.from(this.bytes)
  }
}
