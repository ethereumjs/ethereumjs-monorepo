import { bytesToBigInt, bytesToHex, toBytes } from './bytes.ts'
import { EthereumJSErrorWithoutCode } from './errors.ts'
import { isHexString } from './internal.ts'

import type { Address } from './address.ts'
import type { ToBytesInputTypes } from './bytes.ts'

/** Value that can be coerced to a bigint. */
export type BigIntLike = bigint | PrefixedHexString | number | Uint8Array

/** Value that can be coerced to bytes. */
export type BytesLike =
  | Uint8Array
  | number[]
  | number
  | bigint
  | TransformableToBytes
  | PrefixedHexString

/** Template-literal type for decimal numeric strings. */
export type NumericString = `${number}`

/** Template-literal type for `0x`-prefixed hex strings. */
export type PrefixedHexString = `0x${string}`

/**
 * A type that represents an input that can be converted to an Address.
 */
export type AddressLike = Address | Uint8Array | PrefixedHexString

/** Object that can export itself as bytes via `toBytes()`. */
export interface TransformableToBytes {
  toBytes?(): Uint8Array
}

/** Tree of byte arrays produced by nested RLP lists. */
export type NestedUint8Array = Array<Uint8Array | NestedUint8Array>

/** Type guard for {@link NestedUint8Array}. */
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

/** Target output format for {@link toType}. */
export type TypeOutput = (typeof TypeOutput)[keyof typeof TypeOutput]

/** Target output format for {@link toType}. */
export const TypeOutput = {
  Number: 0,
  BigInt: 1,
  Uint8Array: 2,
  PrefixedHexString: 3,
} as const

/** Return type map keyed by {@link TypeOutput}. */
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
/** Coerce an input value to a selected output representation. */
export function toType<T extends TypeOutput>(input: undefined, outputType: T): undefined
/** Coerce an input value to a selected output representation. */
export function toType<T extends TypeOutput>(
  input: ToBytesInputTypes,
  outputType: T,
): TypeOutputReturnType[T]
/** Coerce an input value to a selected output representation. */
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

/** Signed EIP-7702 authorization list entry (JSON form). */
export type EOACode7702AuthorizationListItem = {
  yParity: PrefixedHexString
  r: PrefixedHexString
  s: PrefixedHexString
} & EOACode7702AuthorizationListItemUnsigned

// Tuple of [chain_id, address, nonce, y_parity, r, s]
/** Signed EIP-7702 authorization tuple in bytes form. */
export type EOACode7702AuthorizationListBytesItem = [
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
]
/** Array of byte-form EIP-7702 authorization tuples. */
export type EOACode7702AuthorizationListBytes = EOACode7702AuthorizationListBytesItem[]
/** Array of JSON-form EIP-7702 authorization entries. */
export type EOACode7702AuthorizationList = EOACode7702AuthorizationListItem[]

/** Unsigned EIP-7702 authorization tuple in bytes form. */
export type EOACode7702AuthorizationListBytesItemUnsigned = [Uint8Array, Uint8Array, Uint8Array]

/** Type guard for byte-form EIP-7702 authorization lists. */
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

/** Type guard for JSON-form EIP-7702 authorization lists. */
export function isEOACode7702AuthorizationList(
  input: EOACode7702AuthorizationListBytes | EOACode7702AuthorizationList,
): input is EOACode7702AuthorizationList {
  return !isEOACode7702AuthorizationListBytes(input) // This is exactly the same method, except the output is negated.
}
