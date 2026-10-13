import { BIGINT_0, BIGINT_1 } from './constants.ts'
import { EthereumJSErrorWithoutCode } from './errors.ts'

/** Conversion constants to wei */
export const GWEI_TO_WEI = BigInt(10 ** 9) // Multiplier to convert from Gwei to Wei
/** Multiplier to convert whole ether units to wei. */
export const ETHER_TO_WEI = BigInt(10 ** 18) // Multiplier to convert from Ether to Wei

/**
 * Formats `numerator / denominator` as a fixed-point decimal string.
 *
 * @param maxDecimalFactor Power-of-ten scale for fractional digits (e.g. `1000n` → three decimals)
 */
export function formatBigDecimal(
  numerator: bigint,
  denominator: bigint,
  maxDecimalFactor: bigint,
): string {
  if (denominator === BIGINT_0) {
    denominator = BIGINT_1
  }

  const full = numerator / denominator
  const fraction = ((numerator - full * denominator) * maxDecimalFactor) / denominator

  // zeros to be added post decimal are number of zeros in maxDecimalFactor - number of digits in fraction
  const zerosPostDecimal = String(maxDecimalFactor).length - 1 - String(fraction).length
  return `${full}.${'0'.repeat(zerosPostDecimal)}${fraction}`
}

/** Helpers for converting between ether, gwei, and wei denominations. */
export class Units {
  static validateInput(amount: number | bigint): void {
    if (typeof amount === 'number' && !Number.isInteger(amount)) {
      throw EthereumJSErrorWithoutCode('Input must be an integer number')
    }
    if (BigInt(amount) < 0) {
      throw EthereumJSErrorWithoutCode('Input must be a positive number')
    }
  }

  /**
   * Convert ether units to wei.
   *
   * @throws If `amount` is negative or a non-integer number
   */
  static ether(amount: number | bigint): bigint {
    Units.validateInput(amount)
    return BigInt(amount) * ETHER_TO_WEI
  }

  /**
   * Convert gwei units to wei.
   *
   * @throws If `amount` is negative or a non-integer number
   */
  static gwei(amount: number | bigint): bigint {
    Units.validateInput(amount)
    return BigInt(amount) * GWEI_TO_WEI
  }
}
