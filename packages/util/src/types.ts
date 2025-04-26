import { bytesToBigInt, bytesToHex, toBytes } from './bytes.ts'
import { EthereumJSErrorWithoutCode } from './errors.ts'
import { isHexString } from './internal.ts'

import type { Address } from './address.ts'
import type { ToBytesInputTypes } from './bytes.ts'

/*
 * A type that represents an input that can be converted to a BigInt.
 */
export type BigIntLike = bigint | PrefixedHexString | number | Uint8Array

/*
 * A type that represents an input that can be converted to a Uint8Array.
 */
export type BytesLike =
  | Uint8Array
  | number[]
  | number
  | bigint
  | TransformableToBytes
  | PrefixedHexString

/*
 * A type that represents a number-like string.
 */
export type NumericString = `${number}`

/*
 * A type that represents a `0x`-prefixed hex string.
 */
export type PrefixedHexString = `0x${string}`

/**
 * A type that represents an input that can be converted to an Address.
 */
export type AddressLike = Address | Uint8Array | PrefixedHexString

export interface TransformableToBytes {
  toBytes?(): Uint8Array
}

export type NestedUint8Array = Array<Uint8Array | NestedUint8Array>

export function isNestedUint8Array(value: unknown): value is NestedUint8Array {
  if (!Array.isArray(value)) {
    return false
  }
  for (const item of value) {
    if (Array.isArray(item)) {
      if (!isNestedUint8Array(item)) {
        return false
      }
    } else if (!(item instanceof Uint8Array)) {
      return false
    }
  }
  return true
}

export type TypeOutput = (typeof TypeOutput)[keyof typeof TypeOutput]

export const TypeOutput = {
  Number: 0,
  BigInt: 1,
  Uint8Array: 2,
  PrefixedHexString: 3,
} as const

export type TypeOutputReturnType = {
  [TypeOutput.Number]: number
  [TypeOutput.BigInt]: bigint
  [TypeOutput.Uint8Array]: Uint8Array
  [TypeOutput.PrefixedHexString]: PrefixedHexString
}

/**
 * Convert an input to a specified type.
 * Input of null/undefined returns null/undefined regardless of the output type.
 * @param input value to convert
 * @param outputType type to output
 */
export function toType<T extends TypeOutput>(input: null, outputType: T): null
export function toType<T extends TypeOutput>(input: undefined, outputType: T): undefined
export function toType<T extends TypeOutput>(
  input: ToBytesInputTypes,
  outputType: T,
): TypeOutputReturnType[T]
export function toType<T extends TypeOutput>(
  input: ToBytesInputTypes,
  outputType: T,
): TypeOutputReturnType[T] | undefined | null {
  if (input === null) {
    return null
  }
  if (input === undefined) {
    return undefined
  }

  if (typeof input === 'string' && !isHexString(input)) {
    throw EthereumJSErrorWithoutCode(`A string must be provided with a 0x-prefix, given: ${input}`)
  } else if (typeof input === 'number' && !Number.isSafeInteger(input)) {
    throw EthereumJSErrorWithoutCode(
      'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)',
    )
  }

  const output = toBytes(input)

  switch (outputType) {
    case TypeOutput.Uint8Array:
      return output as TypeOutputReturnType[T]
    case TypeOutput.BigInt:
      return bytesToBigInt(output) as TypeOutputReturnType[T]
    case TypeOutput.Number: {
      const bigInt = bytesToBigInt(output)
      if (bigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw EthereumJSErrorWithoutCode(
          'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative output type)',
        )
      }
      return Number(bigInt) as TypeOutputReturnType[T]
    }
    case TypeOutput.PrefixedHexString:
      return bytesToHex(output) as TypeOutputReturnType[T]
    default:
      throw EthereumJSErrorWithoutCode('unknown outputType')
  }
}

/**
 * EIP-7702 Authorization list types
 */
export type EOACode7702AuthorizationListItemUnsigned = {
  chainId: PrefixedHexString
  address: PrefixedHexString
  nonce: PrefixedHexString
}

export type EOACode7702AuthorizationListItem = {
  yParity: PrefixedHexString
  r: PrefixedHexString
  s: PrefixedHexString
} & EOACode7702AuthorizationListItemUnsigned

// Tuple of [chain_id, address, nonce, y_parity, r, s]
export type EOACode7702AuthorizationListBytesItem = [
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
]
export type EOACode7702AuthorizationListBytes = EOACode7702AuthorizationListBytesItem[]
export type EOACode7702AuthorizationList = EOACode7702AuthorizationListItem[]

export type EOACode7702AuthorizationListBytesItemUnsigned = [Uint8Array, Uint8Array, Uint8Array]

export function isEOACode7702AuthorizationListBytes(
  input: EOACode7702AuthorizationListBytes | EOACode7702AuthorizationList,
): input is EOACode7702AuthorizationListBytes {
  if (input.length === 0) {
    return true
  }
  const firstItem = input[0]
  if (Array.isArray(firstItem)) {
    return true
  }
  return false
}

export function isEOACode7702AuthorizationList(
  input: EOACode7702AuthorizationListBytes | EOACode7702AuthorizationList,
): input is EOACode7702AuthorizationList {
  return !isEOACode7702AuthorizationListBytes(input) // This is exactly the same method, except the output is negated.
}
