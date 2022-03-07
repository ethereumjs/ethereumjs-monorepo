// Source of constants: https://github.com/ethereumjs/ethereumjs-units/blob/master/units.json
export enum Unit {
  Wei = 'wei',
  Kwei = 'kwei',
  Babbage = 'babbage',
  Femtoether = 'femtoether',
  Mwei = 'mwei',
  Lovelace = 'lovelace',
  Picoether = 'picoether',
  Gwei = 'gwei',
  Shannon = 'shannon',
  Nanoether = 'nanoether',
  Nano = 'nano',
  Szabo = 'szabo',
  Microether = 'microether',
  Finney = 'finney',
  Milliether = 'milliether',
  Milli = 'milli',
  Ether = 'ether',
  Eth = 'eth',
  Kether = 'kether',
  Grand = 'grand',
  Mether = 'mether',
  Gether = 'gether',
  Tether = 'tether',
}

export enum UnitValue {
  wei = 1,
  kwei = 3,
  babbage = 3,
  femtoether = 3,
  mwei = 6,
  lovelace = 6,
  picoether = 6,
  gwei = 9,
  shannon = 9,
  nanoether = 9,
  nano = 9,
  szabo = 12,
  microether = 12,
  finney = 15,
  milliether = 15,
  milli = 15,
  ether = 18,
  eth = 18,
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

  private static from(value: string, scale: UnitValue): bigint {
    // Split given number between integer and decimal part
    const [integer, decimal] = value.split('.')

    if (decimal) {
      // If there are decimals, get the new scale with the given digits
      const newScale = scale - decimal.length
      // Conver decimal to scale expected
      const newDecimal = (BigInt(decimal) * Units.BASE ** BigInt(newScale)).toString()
      // Concat to integer number and return
      return BigInt(integer.concat(newDecimal))
    }

    // If no decimal, just convert the integer to the expected scale
    return BigInt(integer) * Units.BASE ** BigInt(scale)
  }

  private static to(value: bigint, scale: UnitValue): string {
    // Convert bigint to string, to know how many digits the number has
    const stringValue = value.toString()
    // Divide the value given by the number of decimals of ETH (18)
    const integer = value / Units.BASE ** BigInt(scale)
    // If integer is NOT zero, take it into account, otherwise the entire value will be decimal
    const decimalsToTake = integer ? integer.toString().length : 0
    // Extract decimal part
    let decimal = stringValue.slice(decimalsToTake, -1)
    // Check if there are zeros at the end and if so, remove those
    if (decimal.endsWith('0')) decimal = this.removeTrailingZeros(decimal)

    // If decimal is equal to empty string, we can just return the integer

    if (decimal.length) {
      // If decimal and integer are defined, concatenate and return
      if (integer) {
        return `${integer}.${decimal}`
      }

      // There is no integer part in this number, we need to calculate
      // if we need to append zeros at the start of the decimal part and return it
      decimal = '0'.repeat(scale - stringValue.length).concat(decimal)
      return '0.'.concat(decimal)
    }
    return integer.toString()
  }

  /**
   * Expects an eth amount that will be formatted to gwei, it will expect a number with nine decimals
   * @param value amount that is going to be formatted to gwei
   * e.g: Units.toGwei(5000000000n) -> '5'
   */

  static toGwei(value: bigint): string {
    return this.to(value, UnitValue.gwei)
  }

  /**
   * Expects an amount that will be formatted to eth, it will expect a wei amount
   * @param value amount that is going to be formatter to eth
   * e.g: Units.toEth(1100000000000000000n) -> '1.1'
   */
  static toEth(value: bigint): string {
    return this.to(value, UnitValue.eth)
  }

  /**
   * Expects an amount that will be formatter to wei, it will expect an eth amount
   * @param value amount that is going to be formatted to wei
   * e.g: fromEth('1.1') -> 1100000000000000000n
   */
  static fromEth(value: string): bigint {
    return this.from(value, UnitValue.eth)
  }

  /**
   * Expects an amount that will be formatter to wei, it will expect an eth amount
   * @param value amount that is going to be formatted to gwei
   * e.g: fromGwei('5') -> 5000000000n
   */
  static fromGwei(value: string): bigint {
    return this.from(value, UnitValue.gwei)
  }
}
