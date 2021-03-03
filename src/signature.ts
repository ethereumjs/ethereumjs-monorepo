import { ecdsaSign, ecdsaRecover, publicKeyConvert } from 'ethereum-cryptography/secp256k1'
import BN from 'bn.js'
import { toBuffer, setLengthLeft, bufferToHex, bufferToInt } from './bytes'
import { keccak } from './hash'
import { assertIsBuffer } from './helpers'
import { BNLike, toType, TypeOutput } from './types'

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
export function ecsign(msgHash: Buffer, privateKey: Buffer, chainId: BNLike): ECDSASignatureBuffer
export function ecsign(msgHash: Buffer, privateKey: Buffer, chainId: any): any {
  const { signature, recid: recovery } = ecdsaSign(msgHash, privateKey)

  const r = Buffer.from(signature.slice(0, 32))
  const s = Buffer.from(signature.slice(32, 64))

  if (!chainId) {
    return { r, s, v: recovery + 27 }
  } else {
    const chainIdBN = toType(chainId, TypeOutput.BN)
    const vValue = chainIdBN
      .muln(2)
      .addn(35)
      .addn(recovery)
    const v = typeof chainId === 'number' ? vValue.toNumber() : vValue.toArrayLike(Buffer)
    return { r, s, v }
  }
}

function calculateSigRecovery(v: BNLike, chainId?: BNLike): BN {
  const vBN = toType(v, TypeOutput.BN)
  if (!chainId) {
    return vBN.subn(27)
  }
  const chainIdBN = toType(chainId, TypeOutput.BN)
  return vBN.sub(chainIdBN.muln(2).addn(35))
}

function isValidSigRecovery(recovery: number | BN): boolean {
  const rec = new BN(recovery)
  return rec.eqn(0) || rec.eqn(1)
}

/**
 * ECDSA public key recovery from signature.
 * @returns Recovered public key
 */
export const ecrecover = function(
  msgHash: Buffer,
  v: BNLike,
  r: Buffer,
  s: Buffer,
  chainId?: BNLike
): Buffer {
  const signature = Buffer.concat([setLengthLeft(r, 32), setLengthLeft(s, 32)], 64)
  const recovery = calculateSigRecovery(v, chainId)
  if (!isValidSigRecovery(recovery)) {
    throw new Error('Invalid signature v value')
  }
  const senderPubKey = ecdsaRecover(signature, recovery.toNumber(), msgHash)
  return Buffer.from(publicKeyConvert(senderPubKey, false).slice(1))
}

/**
 * Convert signature parameters into the format of `eth_sign` RPC method.
 * @returns Signature
 */
export const toRpcSig = function(v: BNLike, r: Buffer, s: Buffer, chainId?: BNLike): string {
  const recovery = calculateSigRecovery(v, chainId)
  if (!isValidSigRecovery(recovery)) {
    throw new Error('Invalid signature v value')
  }

  // geth (and the RPC eth_sign method) uses the 65 byte format used by Bitcoin
  return bufferToHex(Buffer.concat([setLengthLeft(r, 32), setLengthLeft(s, 32), toBuffer(v)]))
}

/**
 * Convert signature format of the `eth_sign` RPC method to signature parameters
 * NOTE: all because of a bug in geth: https://github.com/ethereum/go-ethereum/issues/2053
 */
export const fromRpcSig = function(sig: string): ECDSASignature {
  const buf: Buffer = toBuffer(sig)

  if (buf.length < 65) {
    throw new Error('Invalid signature length')
  }

  let v = bufferToInt(buf.slice(64))
  // support both versions of `eth_sign` responses
  if (v < 27) {
    v += 27
  }

  return {
    v: v,
    r: buf.slice(0, 32),
    s: buf.slice(32, 64)
  }
}

/**
 * Validate a ECDSA signature.
 * @param homesteadOrLater Indicates whether this is being used on either the homestead hardfork or a later one
 */
export const isValidSignature = function(
  v: BNLike,
  r: Buffer,
  s: Buffer,
  homesteadOrLater: boolean = true,
  chainId?: BNLike
): boolean {
  const SECP256K1_N_DIV_2 = new BN(
    '7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',
    16
  )
  const SECP256K1_N = new BN('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 16)

  if (r.length !== 32 || s.length !== 32) {
    return false
  }

  if (!isValidSigRecovery(calculateSigRecovery(v, chainId))) {
    return false
  }

  const rBN = new BN(r)
  const sBN = new BN(s)

  if (rBN.isZero() || rBN.gt(SECP256K1_N) || sBN.isZero() || sBN.gt(SECP256K1_N)) {
    return false
  }

  if (homesteadOrLater && sBN.cmp(SECP256K1_N_DIV_2) === 1) {
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
export const hashPersonalMessage = function(message: Buffer): Buffer {
  assertIsBuffer(message)
  const prefix = Buffer.from(
    `\u0019Ethereum Signed Message:\n${message.length.toString()}`,
    'utf-8'
  )
  return keccak(Buffer.concat([prefix, message]))
}
