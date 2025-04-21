/**
 * NIST secp521r1 aka p521.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
import { type HTFMethod } from './abstract/hash-to-curve.ts'
import { p521_hasher, p521 as p521n } from './nist.ts'
/**
 * @deprecated Use `@noble/curves/nist` module directly.
 */
export const p521: typeof p521n = p521n
/**
 * @deprecated Use `@noble/curves/nist` module directly.
 */
export const secp521r1: typeof p521n = p521n
/**
 * @deprecated Use `p521_hasher` from `@noble/curves/nist` module directly.
 */
export const hashToCurve: HTFMethod<bigint> = /* @__PURE__ */ (() => p521_hasher.hashToCurve)()
/**
 * @deprecated Use `p521_hasher` from `@noble/curves/nist` module directly.
 */
export const encodeToCurve: HTFMethod<bigint> = /* @__PURE__ */ (() => p521_hasher.encodeToCurve)()
