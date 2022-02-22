// Source of constants: https://www.languagesandnumbers.com/articles/en/ethereum-ether-units/
export enum Unit {
  Wei = 'wei',
  Kwei = 'kwei',
  Mwei = 'mwei',
  Gwei = 'gwei',
  Micro = 'micro',
  Milli = 'milli',
  Ether = 'ether',
  Kether = 'kether',
  Megaether = 'megaether',
  Gether = 'gether',
}

export enum UnitValue {
  'wei' = -18,
  'kwei' = -15,
  'mwei' = -12,
  'gwei' = -9,
  'micro' = -6,
  'milli' = -3,
  'ether' = 1,
  'kether' = 3,
  'megaether' = 6,
  'gether' = 9,
  'tether' = 12,
}
export type UnitsNames = keyof typeof UnitValue

export class Units {
  private static BASE: bigint = BigInt(10)

  private static removeTrailingZeros = (value: string) => {
    let zerosCounted = false
    const removeTrailingZeros = (acc: number, current: string) => {
      if (current === '0' && !zerosCounted) return acc - 1
      if (!zerosCounted) zerosCounted = true
      return acc
    }
    // Converts the amount to an array, reverses it
    // and remove trailing zeros
    const trailingZerosToRemove = value.split('').reverse().reduce(removeTrailingZeros, 0)
    return value.slice(0, trailingZerosToRemove)
  }

  static convert(
    value: number | string | bigint,
    from: UnitsNames | Unit,
    to: UnitsNames | Unit
  ): string {
    // Retrieve decimals from desired units
    const fromDecimals = UnitValue[from]
    const toDecimals = UnitValue[to]

    const absoluteValueToDecimals = Math.abs(toDecimals)

    const decimalsDif = absoluteValueToDecimals + fromDecimals
    let stringValue = value.toString()

    // Since ETH is the base unit (having 1 decimal) we don't need to do any conversion
    let decimalsToConvert = from === 'ether' ? absoluteValueToDecimals : decimalsDif
    if (to === 'ether') decimalsToConvert = Math.abs(fromDecimals)

    // If from decimals are greater than to decimals, there's no need for decimals
    // For example: 1 Eth -> Gwei 1_000_000_000
    if (fromDecimals > toDecimals) {
      const valueWithDecimals = BigInt(value) * Units.BASE ** BigInt(decimalsToConvert)
      return valueWithDecimals.toString()
    }

    // Since we know we are going to handle decimals, we need subtract the quantity of numbers
    // in the value, so we add the necessary zeros in the decimal part of the amount
    if (stringValue.length < decimalsToConvert) {
      decimalsToConvert -= stringValue.length
      const hasTrailingZeros = stringValue.endsWith('0')

      // We need to remove the zeros at the end of the final number
      // We have the zeros counted variable to flag that it's only taking
      // in account zeros from the end
      // For example: 200 Gwei -> 0.000000200 Eth
      if (hasTrailingZeros) stringValue = this.removeTrailingZeros(stringValue)
      return '0.'.concat('0'.repeat(decimalsToConvert), stringValue)
    }

    const valueWithDecimals = BigInt(value) / Units.BASE ** BigInt(decimalsToConvert)
    return valueWithDecimals.toString()
  }

  /**
   * Expects an eth amount that will be formatted to gwei, by default it will expect
   * an eth amount but a custom one can be passed
   * @param value amount that is going to be formatted to gwei
   * @param from value to convert gwei amount - by default is Eth
   */
  static toGwei(
    value: number | string | bigint,
    from: Exclude<UnitsNames, 'gwei'> = Unit.Ether
  ): string {
    return this.convert(value, from, Unit.Gwei)
  }

  /**
   * Expects an amount that will be formatted to eth, by default it will expect
   * a gwei amount but a custom one can be passed
   * @param value amount that is going to be formatter to eth
   * @param from value to convert eth amount - by default is Gwei
   */
  static toEth(
    value: number | string | bigint,
    from: Exclude<UnitsNames, 'ether'> = Unit.Gwei
  ): string {
    return this.convert(value, from, Unit.Ether)
  }
}

// Unit.convert(12.46, "eth", "gwei") -> 12460000000
// Unit.convert(12.46, "gwei", "eth") -> 0,00000001246
// Unit.convert(12460000000, "gwei", "eth") -> 12.46
