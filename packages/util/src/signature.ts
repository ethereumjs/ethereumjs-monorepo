import { signSync, recoverPublicKey } from 'ethereum-cryptography/secp256k1'
import {
  toBuffer,
  setLengthLeft,
  bigIntToBuffer,
  bufferToHex,
  bufferToInt,
  bufferToBigInt,
} from './bytes'
import { SECP256K1_ORDER, SECP256K1_ORDER_DIV_2 } from './constants'
import { keccak } from './hash'
import { assertIsBuffer } from './helpers'
import { BigIntLike, toType, TypeOutput } from './types'

export interface ECDSASignature {
  v: number
  r: Buffer
  s: Buffer
}

export interface ECDSASignatureBuffer {
  v: Buffer
  r: Buffer
  s: Buffer
}

/**
 * Returns the ECDSA signature of a message hash.
 */
export function ecsign(msgHash: Buffer, privateKey: Buffer, chainId?: number): ECDSASignature
export function ecsign(
  msgHash: Buffer,
  privateKey: Buffer,
  chainId: BigIntLike
): ECDSASignatureBuffer
export function ecsign(msgHash: Buffer, privateKey: Buffer, chainId: any): any {
  const [signature, recovery] = signSync(msgHash, privateKey, { recovered: true, der: false })

  const r = Buffer.from(signature.slice(0, 32))
  const s = Buffer.from(signature.slice(32, 64))

  if (!chainId || typeof chainId === 'number') {
    // return legacy type ECDSASignature (deprecated in favor of ECDSASignatureBuffer to handle large chainIds)
    if (chainId && !Number.isSafeInteger(chainId)) {
      throw new Error(
        'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)'
      )
    }
    const v = chainId ? recovery + (chainId * 2 + 35) : recovery + 27
    return { r, s, v }
  }

  const chainIdBigInt = toType(chainId as BigIntLike, TypeOutput.BigInt)
  const v = bigIntToBuffer(chainIdBigInt * BigInt(2) + BigInt(35) + BigInt(recovery))
  return { r, s, v }
}

function calculateSigRecovery(v: BigIntLike, chainId?: BigIntLike): bigint {
  const vBigInt = bufferToBigInt(toBuffer(v))
  if (vBigInt === BigInt(0) || vBigInt === BigInt(1)) return vBigInt;

  if (!chainId) {
    return vBigInt - BigInt(27)
  }
  const chainIdBigInt = bufferToBigInt(toBuffer(chainId))
  return vBigInt - (chainIdBigInt * BigInt(2) + BigInt(35))
}

function isValidSigRecovery(recovery: number | bigint): boolean {
  const rec = BigInt(recovery)
  return rec === BigInt(0) || rec === BigInt(1)
}

/**
 * ECDSA public key recovery from signature.
 * NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions
 * @returns Recovered public key
 */
export const ecrecover = function (
  msgHash: Buffer,
  v: BigIntLike,
  r: Buffer,
  s: Buffer,
  chainId?: BigIntLike
): Buffer {
  const signature = Buffer.concat([setLengthLeft(r, 32), setLengthLeft(s, 32)], 64)
  const recovery = calculateSigRecovery(v, chainId)
  if (!isValidSigRecovery(recovery)) {
    throw new Error('Invalid signature v value')
  }

  const senderPubKey = recoverPublicKey(msgHash, signature, Number(recovery))
  return Buffer.from(senderPubKey.slice(1))
}

/**
 * Convert signature parameters into the format of `eth_sign` RPC method.
 * NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions
 * @returns Signature
 */
export const toRpcSig = function (
  v: BigIntLike,
  r: Buffer,
  s: Buffer,
  chainId?: BigIntLike
): string {
  const recovery = calculateSigRecovery(v, chainId)
  if (!isValidSigRecovery(recovery)) {
    throw new Error('Invalid signature v value')
  }

  // geth (and the RPC eth_sign method) uses the 65 byte format used by Bitcoin
  return bufferToHex(Buffer.concat([setLengthLeft(r, 32), setLengthLeft(s, 32), toBuffer(v)]))
}

/**
 * Convert signature parameters into the format of Compact Signature Representation (EIP-2098).
 * NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions
 * @returns Signature
 */
export const toCompactSig = function (
  v: BigIntLike,
  r: Buffer,
  s: Buffer,
  chainId?: BigIntLike
): string {
  const recovery = calculateSigRecovery(v, chainId)
  if (!isValidSigRecovery(recovery)) {
    throw new Error('Invalid signature v value')
  }

  const vn = toType(v, TypeOutput.Number)
  let ss = s
  if ((vn > 28 && vn % 2 === 1) || vn === 1 || vn === 28) {
    ss = Buffer.from(s)
    ss[0] |= 0x80
  }

  return bufferToHex(Buffer.concat([setLengthLeft(r, 32), setLengthLeft(ss, 32)]))
}

/**
 * Convert signature format of the `eth_sign` RPC method to signature parameters
 * NOTE: all because of a bug in geth: https://github.com/ethereum/go-ethereum/issues/2053
 * NOTE: After EIP1559, `v` could be `0` or `1` but this function assumes
 * it's a signed message (EIP-191 or EIP-712) adding `27` at the end. Remove if needed.
 */
export const fromRpcSig = function (sig: string): ECDSASignature {
  const buf: Buffer = toBuffer(sig)

  let r: Buffer
  let s: Buffer
  let v: number
  if (buf.length >= 65) {
    r = buf.slice(0, 32)
    s = buf.slice(32, 64)
    v = bufferToInt(buf.slice(64))
  } else if (buf.length === 64) {
    // Compact Signature Representation (https://eips.ethereum.org/EIPS/eip-2098)
    r = buf.slice(0, 32)
    s = buf.slice(32, 64)
    v = bufferToInt(buf.slice(32, 33)) >> 7
    s[0] &= 0x7f
  } else {
    throw new Error('Invalid signature length')
  }

  // support both versions of `eth_sign` responses
  if (v < 27) {
    v += 27
  }

  return {
    v,
    r,
    s,
  }
}

/**
 * Validate a ECDSA signature.
 * NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions
 * @param homesteadOrLater Indicates whether this is being used on either the homestead hardfork or a later one
 */
export const isValidSignature = function (
  v: BigIntLike,
  r: Buffer,
  s: Buffer,
  homesteadOrLater: boolean = true,
  chainId?: BigIntLike
): boolean {
  if (r.length !== 32 || s.length !== 32) {
    return false
  }

  if (!isValidSigRecovery(calculateSigRecovery(v, chainId))) {
    return false
  }

  const rBigInt = bufferToBigInt(r)
  const sBigInt = bufferToBigInt(s)

  if (
    rBigInt === BigInt(0) ||
    rBigInt >= SECP256K1_ORDER ||
    sBigInt === BigInt(0) ||
    sBigInt >= SECP256K1_ORDER
  ) {
    return false
  }

  if (homesteadOrLater && sBigInt >= SECP256K1_ORDER_DIV_2) {
    return false
  }

  return true
}

/**
 * Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call.
 * The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign`
 * call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
 * used to produce the signature.
 */
export const hashPersonalMessage = function (message: Buffer): Buffer {
  assertIsBuffer(message)
  const prefix = Buffer.from(`\u0019Ethereum Signed Message:\n${message.length}`, 'utf-8')
  return keccak(Buffer.concat([prefix, message]))
}
