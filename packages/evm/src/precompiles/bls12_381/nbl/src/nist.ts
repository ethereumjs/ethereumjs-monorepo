/**
 * NIST secp256r1 aka p256.
 * https://www.secg.org/sec2-v2.pdf, https://neuromancer.sk/std/nist/P-256
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
import { sha256, sha384, sha512 } from '@noble/hashes/sha2'
import { type CurveFnWithCreate, createCurve } from './_shortw_utils.ts'
import { type Hasher, createHasher } from './abstract/hash-to-curve.ts'
import { Field } from './abstract/modular.ts'
import { mapToCurveSimpleSWU } from './abstract/weierstrass.ts'

const Fp256 = Field(BigInt('0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff'))
const p256_a = Fp256.create(BigInt('-3'))
const p256_b = BigInt('0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b')

/**
 * secp256r1 curve, ECDSA and ECDH methods.
 * Field: `2n**224n * (2n**32n-1n) + 2n**192n + 2n**96n-1n`
 */
// prettier-ignore
export const p256: CurveFnWithCreate = createCurve(
  {
    a: p256_a,
    b: p256_b,
    Fp: Fp256,
    n: BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'),
    Gx: BigInt('0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296'),
    Gy: BigInt('0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5'),
    h: BigInt(1),
    lowS: false,
  } as const,
  sha256,
)
/** Alias to p256. */
export const secp256r1: CurveFnWithCreate = p256

const p256_mapSWU = /* @__PURE__ */ (() =>
  mapToCurveSimpleSWU(Fp256, {
    A: p256_a,
    B: p256_b,
    Z: Fp256.create(BigInt('-10')),
  }))()

/** Hashing / encoding to p256 points / field. RFC 9380 methods. */
export const p256_hasher: Hasher<bigint> = /* @__PURE__ */ (() =>
  createHasher(secp256r1.ProjectivePoint, (scalars: bigint[]) => p256_mapSWU(scalars[0]), {
    DST: 'P256_XMD:SHA-256_SSWU_RO_',
    encodeDST: 'P256_XMD:SHA-256_SSWU_NU_',
    p: Fp256.ORDER,
    m: 1,
    k: 128,
    expand: 'xmd',
    hash: sha256,
  }))()

// Field over which we'll do calculations.
const Fp384 = Field(
  BigInt(
    '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff',
  ),
)
const p384_a = Fp384.create(BigInt('-3'))
// prettier-ignore
const p384_b = BigInt(
  '0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef',
)

/**
 * secp384r1 curve, ECDSA and ECDH methods.
 * Field: `2n**384n - 2n**128n - 2n**96n + 2n**32n - 1n`.
 * */
// prettier-ignore
export const p384: CurveFnWithCreate = createCurve(
  {
    a: p384_a,
    b: p384_b,
    Fp: Fp384,
    n: BigInt(
      '0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973',
    ),
    Gx: BigInt(
      '0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7',
    ),
    Gy: BigInt(
      '0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f',
    ),
    h: BigInt(1),
    lowS: false,
  } as const,
  sha384,
)
/** Alias to p384. */
export const secp384r1: CurveFnWithCreate = p384

const p384_mapSWU = /* @__PURE__ */ (() =>
  mapToCurveSimpleSWU(Fp384, {
    A: p384_a,
    B: p384_b,
    Z: Fp384.create(BigInt('-12')),
  }))()

/** Hashing / encoding to p384 points / field. RFC 9380 methods. */
export const p384_hasher: Hasher<bigint> = /* @__PURE__ */ (() =>
  createHasher(secp384r1.ProjectivePoint, (scalars: bigint[]) => p384_mapSWU(scalars[0]), {
    DST: 'P384_XMD:SHA-384_SSWU_RO_',
    encodeDST: 'P384_XMD:SHA-384_SSWU_NU_',
    p: Fp384.ORDER,
    m: 1,
    k: 192,
    expand: 'xmd',
    hash: sha384,
  }))()

// Field over which we'll do calculations.
const Fp521 = Field(
  BigInt(
    '0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  ),
)

const p521_a = Fp521.create(BigInt('-3'))
const p521_b = BigInt(
  '0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00',
)

/**
 * NIST secp521r1 aka p521 curve, ECDSA and ECDH methods.
 * Field: `2n**521n - 1n`.
 */
// prettier-ignore
export const p521: CurveFnWithCreate = createCurve(
  {
    a: p521_a,
    b: p521_b,
    Fp: Fp521,
    n: BigInt(
      '0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409',
    ),
    Gx: BigInt(
      '0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66',
    ),
    Gy: BigInt(
      '0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650',
    ),
    h: BigInt(1),
    lowS: false,
    allowedPrivateKeyLengths: [130, 131, 132], // P521 keys are variable-length. Normalize to 132b
  } as const,
  sha512,
)
export const secp521r1: CurveFnWithCreate = p521

const p521_mapSWU = /* @__PURE__ */ (() =>
  mapToCurveSimpleSWU(Fp521, {
    A: p521_a,
    B: p521_b,
    Z: Fp521.create(BigInt('-4')),
  }))()

/** Hashing / encoding to p521 points / field. RFC 9380 methods. */
export const p521_hasher: Hasher<bigint> = /* @__PURE__ */ (() =>
  createHasher(secp521r1.ProjectivePoint, (scalars: bigint[]) => p521_mapSWU(scalars[0]), {
    DST: 'P521_XMD:SHA-512_SSWU_RO_',
    encodeDST: 'P521_XMD:SHA-512_SSWU_NU_',
    p: Fp521.ORDER,
    m: 1,
    k: 256,
    expand: 'xmd',
    hash: sha512,
  }))()
