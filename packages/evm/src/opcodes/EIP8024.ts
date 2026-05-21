import { EVMError } from '../errors.ts'

import { trap } from './util.ts'

/**
 * EIP-8024: Backward compatible SWAPN, DUPN, EXCHANGE.
 *
 * This module hosts the immediate-byte validity checks and decoders for the
 * three opcodes introduced by the EIP:
 *   - DUPN     (0xe6, single-byte immediate)
 *   - SWAPN    (0xe7, single-byte immediate)
 *   - EXCHANGE (0xe8, single-byte immediate encoding a pair (n, m))
 *
 * The encoding intentionally forbids immediate bytes that look like
 * `JUMPDEST` (0x5b) or `PUSH1..PUSH32` (0x60..0x7f) so that JUMPDEST analysis
 * can remain unchanged from pre-EIP behavior.
 */

/**
 * Single-byte immediate validity for DUPN / SWAPN.
 * Spec: invalid when 90 (0x5a) < x < 128 (0x80).
 */
export function isEIP8024SingleImmediateValid(immediate: number): boolean {
  return immediate <= 0x5a || immediate >= 0x80
}

/**
 * Decodes the DUPN / SWAPN immediate byte into the stack depth `n`.
 *
 * Spec: `n = (x + 145) mod 256`, mapping valid bytes bidirectionally onto
 * n ∈ [17, 235].
 *
 * Traps with INVALID_OPCODE when the immediate is in the disallowed range.
 */
export function decodeEIP8024SingleImmediate(immediate: number): number {
  if (!isEIP8024SingleImmediateValid(immediate)) {
    trap(EVMError.errorMessages.INVALID_OPCODE)
  }
  return (immediate + 145) & 0xff
}

/**
 * Pair-byte immediate validity for EXCHANGE.
 * Spec: invalid when 81 (0x51) < x < 128 (0x80).
 */
export function isEIP8024PairImmediateValid(immediate: number): boolean {
  return immediate <= 0x51 || immediate >= 0x80
}

/**
 * Decodes the EXCHANGE immediate byte into stack distances `(n, m)`
 * expected by `Stack.exchange()`. Returned values are 1-based depths
 * below the top (top itself is never an EXCHANGE target).
 *
 * Spec: `k = x XOR 143`, `(q, r) = divmod(k, 16)`, then
 *   - `(q + 1, r + 1)` if `q < r`
 *   - `(r + 1, 29 - q)` otherwise
 *
 * Traps with INVALID_OPCODE when the immediate is in the disallowed range.
 */
export function decodeEIP8024PairImmediate(immediate: number): [number, number] {
  if (!isEIP8024PairImmediateValid(immediate)) {
    trap(EVMError.errorMessages.INVALID_OPCODE)
  }
  const k = immediate ^ 0x8f
  const q = (k >> 4) & 0xf
  const r = k & 0xf
  if (q < r) {
    return [q + 1, r + 1]
  }
  return [r + 1, 29 - q]
}
