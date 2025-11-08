import { bytesToBigInt, bytesToHex, setLengthLeft } from '@ethereumjs/util'
import { p256 } from '@noble/curves/p256'

import { OOGResult } from '../evm.ts'

import { getPrecompileName } from './index.ts'
import type { PrecompileInput } from './types.ts'
import { gasLimitCheck } from './util.ts'

import type { ExecResult } from '../types.ts'

const P256VERIFY_GAS_COST = BigInt(6900)
const SUCCESS_RETURN = new Uint8Array(32).fill(0).map((_, i) => (i === 31 ? 1 : 0))

// Curve parameters for secp256r1
const P256_N = BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551') // Subgroup order
const P256_P = BigInt('0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff') // Base field modulus
const P256_A = BigInt('0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc') // Curve coefficient a
const P256_B = BigInt('0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b') // Curve coefficient b

export function precompile100(opts: PrecompileInput): ExecResult {
  const pName = getPrecompileName('100')
  const gasUsed = P256VERIFY_GAS_COST

  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  const data = opts.data

  // 1. Input length: Input MUST be exactly 160 bytes
  if (data.length !== 160) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: invalid input length ${data.length}, expected 160`)
    }
    return {
      executionGasUsed: gasUsed,
      returnValue: new Uint8Array(),
    }
  }

  const msgHash = data.subarray(0, 32)
  const r = data.subarray(32, 64)
  const s = data.subarray(64, 96)
  const qx = data.subarray(96, 128)
  const qy = data.subarray(128, 160)

  const rBigInt = bytesToBigInt(r)
  const sBigInt = bytesToBigInt(s)
  const qxBigInt = bytesToBigInt(qx)
  const qyBigInt = bytesToBigInt(qy)

  // 2. Signature component bounds: Both r and s MUST satisfy 0 < r < n and 0 < s < n
  if (!(rBigInt > BigInt(0) && rBigInt < P256_N && sBigInt > BigInt(0) && sBigInt < P256_N)) {
    if (opts._debug !== undefined) {
      opts._debug(
        `${pName} failed: signature component out of bounds: r=${bytesToHex(r)}, s=${bytesToHex(s)}`,
      )
    }
    return {
      executionGasUsed: gasUsed,
      returnValue: new Uint8Array(),
    }
  }

  // 3. Public key bounds: Both qx and qy MUST satisfy 0 ≤ qx < p and 0 ≤ qy < p
  if (!(qxBigInt >= BigInt(0) && qxBigInt < P256_P && qyBigInt >= BigInt(0) && qyBigInt < P256_P)) {
    if (opts._debug !== undefined) {
      opts._debug(
        `${pName} failed: public key component out of bounds: qx=${bytesToHex(qx)}, qy=${bytesToHex(qy)}`,
      )
    }
    return {
      executionGasUsed: gasUsed,
      returnValue: new Uint8Array(),
    }
  }

  // 4. Point validity: The point (qx, qy) MUST satisfy the curve equation qy^2 ≡ qx^3 + a*qx + b (mod p)
  const leftSide = (qyBigInt * qyBigInt) % P256_P
  const rightSide = (qxBigInt * qxBigInt * qxBigInt + P256_A * qxBigInt + P256_B) % P256_P

  if (leftSide !== rightSide) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: point not on curve`)
    }
    return {
      executionGasUsed: gasUsed,
      returnValue: new Uint8Array(),
    }
  }

  // 5. Point not at infinity: The point (qx, qy) MUST NOT be the point at infinity (represented as (0, 0))
  if (qxBigInt === BigInt(0) && qyBigInt === BigInt(0)) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: public key is point at infinity`)
    }
    return {
      executionGasUsed: gasUsed,
      returnValue: new Uint8Array(),
    }
  }

  try {
    // Create public key point
    const publicKey = p256.ProjectivePoint.fromAffine({
      x: qxBigInt,
      y: qyBigInt,
    })

    // Create signature
    const rBytes = setLengthLeft(r, 32)
    const sBytes = setLengthLeft(s, 32)
    const signatureBytes = new Uint8Array(64)
    signatureBytes.set(rBytes, 0)
    signatureBytes.set(sBytes, 32)

    const signature = p256.Signature.fromCompact(signatureBytes)

    // Verify signature
    const isValid = p256.verify(signature, msgHash, publicKey.toRawBytes(false))

    if (isValid) {
      if (opts._debug !== undefined) {
        opts._debug(`${pName} succeeded: signature verification passed`)
      }
      return {
        executionGasUsed: gasUsed,
        returnValue: SUCCESS_RETURN,
      }
    } else {
      if (opts._debug !== undefined) {
        opts._debug(`${pName} failed: signature verification failed`)
      }
      return {
        executionGasUsed: gasUsed,
        returnValue: new Uint8Array(),
      }
    }
  } catch (error) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: verification error: ${error}`)
    }
    return {
      executionGasUsed: gasUsed,
      returnValue: new Uint8Array(),
    }
  }
}
