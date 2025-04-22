/**
 * NIST secp256r1 aka p256.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
import { type HTFMethod } from './abstract/hash-to-curve.ts'
import { p256_hasher, p256 as p256n } from './nist.ts'
/**
 * @deprecated Use `@noble/curves/nist` module directly.
 */
export const p256: typeof p256n = p256n
/**
 * @deprecated Use `@noble/curves/nist` module directly.
 */
export const secp256r1: typeof p256n = p256n
/**
 * @deprecated Use `p256_hasher` from `@noble/curves/nist` module directly.
 */
export const hashToCurve: HTFMethod<bigint> = /* @__PURE__ */ (() => p256_hasher.hashToCurve)()
/**
 * @deprecated Use `p256_hasher` from `@noble/curves/nist` module directly.
 */
export const encodeToCurve: HTFMethod<bigint> = /* @__PURE__ */ (() => p256_hasher.encodeToCurve)()
