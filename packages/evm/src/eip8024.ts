import { EthereumJSErrorWithoutCode } from '@ethereumjs/util'

/**
 * EIP-8024: Backward compatible SWAPN, DUPN, EXCHANGE.
 *
 * Encode and decode the single-byte immediates for:
 *   - DUPN     (`0xe6`)
 *   - SWAPN    (`0xe7`)
 *   - EXCHANGE (`0xe8`)
 *
 * The encoding forbids immediate bytes that look like `JUMPDEST` (`0x5b`)
 * or `PUSH1`..`PUSH32` (`0x60`..`0x7f`) so JUMPDEST analysis stays unchanged.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */

/**
 * DUPN / SWAPN immediate is valid when it is not in `(0x5a, 0x80)`.
 *
 * @param immediate - Raw immediate byte
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function isEIP8024SingleImmediateValid(immediate: number): boolean {
  return immediate <= 0x5a || immediate >= 0x80
}

/**
 * Encodes a DUPN / SWAPN depth as its immediate byte.
 *
 * Spec: `(n + 111) mod 256`, for `n` in `17..235`.
 *
 * @param depth - One-based stack depth (`17` is the first depth past `DUP16`)
 * @returns Immediate byte `0..255`
 * @throws When `depth` is not an integer in `17..235`
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function encodeEIP8024SingleImmediate(depth: number): number {
  if (!Number.isInteger(depth) || depth < 17 || depth > 235) {
    throw EthereumJSErrorWithoutCode(
      `EIP-8024 DUPN/SWAPN depth must be an integer from 17 to 235, got ${depth}`,
    )
  }
  return (depth + 111) & 0xff
}

/**
 * Decodes a DUPN / SWAPN immediate byte into its stack depth.
 *
 * Spec: `n = (x + 145) mod 256`, which lands in `17..235` for every valid byte.
 *
 * @param immediate - Raw immediate byte
 * @returns One-based stack depth
 * @throws When `immediate` is not an integer byte, or sits in the disallowed range
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function decodeEIP8024SingleImmediate(immediate: number): number {
  if (!Number.isInteger(immediate) || immediate < 0 || immediate > 255) {
    throw EthereumJSErrorWithoutCode(
      `EIP-8024 DUPN/SWAPN immediate must be an integer from 0 to 255, got ${immediate}`,
    )
  }
  if (!isEIP8024SingleImmediateValid(immediate)) {
    throw EthereumJSErrorWithoutCode(
      `EIP-8024 DUPN/SWAPN immediate ${immediate} is not a valid operand`,
    )
  }
  return (immediate + 145) & 0xff
}

/**
 * EXCHANGE immediate is valid when it is not in `(0x51, 0x80)`.
 *
 * @param immediate - Raw immediate byte
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function isEIP8024PairImmediateValid(immediate: number): boolean {
  return immediate <= 0x51 || immediate >= 0x80
}

/**
 * Encodes an EXCHANGE pair `(n, m)` as its immediate byte.
 *
 * Spec: `1 <= n < m` and `n + m <= 30`. The pair is the same `(n, m)` that
 * {@link decodeEIP8024PairImmediate} returns (distances below the top; the
 * top itself is never a target).
 *
 * @param n - Smaller distance below the top (`1` is the first slot under the top)
 * @param m - Larger distance below the top
 * @returns Immediate byte `0..255`
 * @throws When `(n, m)` is not an integer pair inside the spec range
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function encodeEIP8024PairImmediate(n: number, m: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(m) || !(n >= 1 && n < m && n + m <= 30)) {
    throw EthereumJSErrorWithoutCode(
      `EIP-8024 EXCHANGE depths must be integers with 1 <= n < m and n + m <= 30, got (${n}, ${m})`,
    )
  }
  const q = m <= 16 ? n - 1 : 29 - m
  const r = m <= 16 ? m - 1 : n - 1
  return ((16 * q + r) ^ 0x8f) & 0xff
}

/**
 * Decodes an EXCHANGE immediate byte into stack distances `(n, m)`.
 *
 * Spec: `k = x XOR 143`, `q = floor(k / 16)`, `r = k mod 16`, then `(q + 1, r + 1)`
 * when `q < r`, otherwise `(r + 1, 29 - q)`. Both values are distances
 * below the top (`1` is the first slot under the top).
 *
 * @param immediate - Raw immediate byte
 * @returns `[n, m]` with `1 <= n < m` and `n + m <= 30`
 * @throws When `immediate` is not an integer byte, or sits in the disallowed range
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function decodeEIP8024PairImmediate(immediate: number): [number, number] {
  if (!Number.isInteger(immediate) || immediate < 0 || immediate > 255) {
    throw EthereumJSErrorWithoutCode(
      `EIP-8024 EXCHANGE immediate must be an integer from 0 to 255, got ${immediate}`,
    )
  }
  if (!isEIP8024PairImmediateValid(immediate)) {
    throw EthereumJSErrorWithoutCode(
      `EIP-8024 EXCHANGE immediate ${immediate} is not a valid operand`,
    )
  }
  const k = immediate ^ 0x8f
  const q = (k >> 4) & 0xf
  const r = k & 0xf
  if (q < r) {
    return [q + 1, r + 1]
  }
  return [r + 1, 29 - q]
}
