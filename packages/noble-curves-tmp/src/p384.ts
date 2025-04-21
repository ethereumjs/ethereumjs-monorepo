/**
 * NIST secp384r1 aka p384.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
import { type HTFMethod } from './abstract/hash-to-curve.ts'
import { p384_hasher, p384 as p384n } from './nist.ts'
/**
 * @deprecated Use `@noble/curves/nist` module directly.
 */
export const p384: typeof p384n = p384n
/**
 * @deprecated Use `@noble/curves/nist` module directly.
 */
export const secp384r1: typeof p384n = p384n
/**
 * @deprecated Use `p384_hasher` from `@noble/curves/nist` module directly.
 */
export const hashToCurve: HTFMethod<bigint> = /* @__PURE__ */ (() => p384_hasher.hashToCurve)()
/**
 * @deprecated Use `p384_hasher` from `@noble/curves/nist` module directly.
 */
export const encodeToCurve: HTFMethod<bigint> = /* @__PURE__ */ (() => p384_hasher.encodeToCurve)()
