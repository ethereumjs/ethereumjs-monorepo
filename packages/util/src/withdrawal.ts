import { Address } from './address.ts'
import { bigIntToHex, bytesToHex, toBytes } from './bytes.ts'
import { BIGINT_0 } from './constants.ts'
import { TypeOutput, toType } from './types.ts'

import type { AddressLike, BigIntLike, PrefixedHexString } from './types.ts'

/**
 * Flexible input data type for EIP-4895 withdrawal data with amount in Gwei to
 * match CL representation and for eventual ssz withdrawalsRoot
 */
export type WithdrawalData = {
  index: BigIntLike
  validatorIndex: BigIntLike
  address: AddressLike
  amount: BigIntLike
}

/**
 * JSON RPC interface for EIP-4895 withdrawal data with amount in Gwei to
 * match CL representation and for eventual ssz withdrawalsRoot
 */
export interface JSONRPCWithdrawal {
  index: PrefixedHexString // QUANTITY - bigint 8 bytes
  validatorIndex: PrefixedHexString // QUANTITY - bigint 8 bytes
  address: PrefixedHexString // DATA, 20 Bytes  address to withdraw to
  amount: PrefixedHexString // QUANTITY - bigint amount in Gwei 8 bytes
}

export type WithdrawalBytes = [Uint8Array, Uint8Array, Uint8Array, Uint8Array]
/**
 * Convert a withdrawal to a byte array
 * @param withdrawal the withdrawal to convert
 * @returns byte array of the withdrawal
 */
export function withdrawalToBytesArray(withdrawal: Withdrawal | WithdrawalData): WithdrawalBytes {
  const { index, validatorIndex, address, amount } = withdrawal
  const indexBytes =
    toType(index, TypeOutput.BigInt) === BIGINT_0
      ? new Uint8Array()
      : toType(index, TypeOutput.Uint8Array)
  const validatorIndexBytes =
    toType(validatorIndex, TypeOutput.BigInt) === BIGINT_0
      ? new Uint8Array()
      : toType(validatorIndex, TypeOutput.Uint8Array)
  const addressBytes =
    address instanceof Address ? address.bytes : toType(address, TypeOutput.Uint8Array)

  const amountBytes =
    toType(amount, TypeOutput.BigInt) === BIGINT_0
      ? new Uint8Array()
      : toType(amount, TypeOutput.Uint8Array)

  return [indexBytes, validatorIndexBytes, addressBytes, amountBytes]
}
/**
 * Representation of EIP-4895 withdrawal data
 */
export class Withdrawal {
  public readonly index: bigint
  public readonly validatorIndex: bigint
  public readonly address: Address
  public readonly amount: bigint

  /**
   * This constructor assigns and validates the values.
   * Use the static factory methods to assist in creating a Withdrawal object from varying data types.
   * Its amount is in Gwei to match CL representation and for eventual ssz withdrawalsRoot
   */
  constructor(index: bigint, validatorIndex: bigint, address: Address, amount: bigint) {
    this.index = index
    this.validatorIndex = validatorIndex
    this.address = address
    this.amount = amount
  }

  raw() {
    return withdrawalToBytesArray(this)
  }

  toValue() {
    return {
      index: this.index,
      validatorIndex: this.validatorIndex,
      address: this.address.bytes,
      amount: this.amount,
    }
  }

  toJSON() {
    return {
      index: bigIntToHex(this.index),
      validatorIndex: bigIntToHex(this.validatorIndex),
      address: bytesToHex(this.address.bytes),
      amount: bigIntToHex(this.amount),
    }
  }
}

/**
 * Creates a validator withdrawal request to be submitted to the consensus layer
 * @param withdrawalData the consensus layer index and validator index values for the
 * validator requesting the withdrawal and the address and withdrawal amount of the request
 * @returns a {@link Withdrawal} object
 */
export function createWithdrawal(withdrawalData: WithdrawalData) {
  const {
    index: indexData,
    validatorIndex: validatorIndexData,
    address: addressData,
    amount: amountData,
  } = withdrawalData
  const index = toType(indexData, TypeOutput.BigInt)
  const validatorIndex = toType(validatorIndexData, TypeOutput.BigInt)
  const address = addressData instanceof Address ? addressData : new Address(toBytes(addressData))
  const amount = toType(amountData, TypeOutput.BigInt)

  return new Withdrawal(index, validatorIndex, address, amount)
}

/**
 * Creates a validator withdrawal request to be submitted to the consensus layer from
 * an RLP list
 * @param withdrawalArray decoded RLP list of withdrawal data elements
 * @returns a {@link Withdrawal} object
 */
export function createWithdrawalFromBytesArray(withdrawalArray: WithdrawalBytes) {
  if (withdrawalArray.length !== 4) {
    throw Error(`Invalid withdrawalArray length expected=4 actual=${withdrawalArray.length}`)
  }
  const [index, validatorIndex, address, amount] = withdrawalArray
  return createWithdrawal({ index, validatorIndex, address, amount })
}
