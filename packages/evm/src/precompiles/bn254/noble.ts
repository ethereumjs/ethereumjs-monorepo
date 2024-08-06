import {
  BIGINT_0,
  bigIntToBytes,
  bytesToBigInt,
  bytesToUnprefixedHex,
  concatBytes,
  equalsBytes,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { bn254 } from '@noble/curves/bn254'

import type { EVMBN254Interface } from '../../types.js'
import type { AffinePoint } from '@noble/curves/abstract/weierstrass'

const BN254_G1_INFINITY_POINT_BYTES = new Uint8Array(32)

/**
 * Converts an Uint8Array to a Noble G1 point.
 * @param input Input Uint8Array. Should be 64 bytes
 * @returns Noble G1 point
 */
function toG1Point(input: Uint8Array) {
  if (equalsBytes(input, BN254_G1_INFINITY_POINT_BYTES)) {
    return bn254.G1.ProjectivePoint.ZERO
  }

  const x = bytesToBigInt(input.subarray(0, 32))
  const y = bytesToBigInt(input.subarray(32, 64))

  const G1 = bn254.G1.ProjectivePoint.fromAffine({
    x,
    y,
  })

  return G1
}

// input: a 32-byte hex scalar Uint8Array
// output: a Noble Fr point

function toFrPoint(input: Uint8Array): bigint {
  const Fr = bn254.fields.Fr.fromBytes(input)
  if (Fr > bn254.fields.Fr.ORDER) {
    return Fr % bn254.fields.Fr.ORDER
  }
  return Fr
}

function fromG1Point(input: AffinePoint<bigint>): Uint8Array {
  const xBytes = setLengthLeft(bigIntToBytes(input.x), 32)
  const yBytes = setLengthLeft(bigIntToBytes(input.y), 32)

  return concatBytes(xBytes, yBytes)
}

/**
 * Implementation of the `EVMBN254Interface` using the `@noble/curves` JS library,
 * see https://github.com/paulmillr/noble-curves.
 *
 * This is the EVM default implementation.
 */
export class NobleBN254 implements EVMBN254Interface {
  protected readonly _rustbn: any

  constructor(rustbn: any) {
    this._rustbn = rustbn
  }

  add(input: Uint8Array): Uint8Array {
    const inputStr = bytesToUnprefixedHex(input)
    return hexToBytes(this._rustbn.ec_add(inputStr))
  }

  mul(input: Uint8Array): Uint8Array {
    const G1 = toG1Point(input.slice(0, 64))
    const scalar = toFrPoint(input.slice(64, 96))

    if (scalar === BIGINT_0) {
      return BN254_G1_INFINITY_POINT_BYTES
    }

    const result = fromG1Point(G1.multiply(scalar))
    //console.log(bytesToHex(result))
    return result

    /*const inputHex = bytesToUnprefixedHex(input)
    const resultRBN = this._rustbn.ec_mul(inputHex)
    console.log(resultRBN)
    return hexToBytes(resultRBN)*/
  }
  pairing(input: Uint8Array): Uint8Array {
    const inputStr = bytesToUnprefixedHex(input)
    return hexToBytes(this._rustbn.ec_pairing(inputStr))
  }
}
