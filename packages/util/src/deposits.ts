import { bigIntToHex, bytesToHex } from './bytes.js'
import { BIGINT_0 } from './constants.js'
import { TypeOutput, toType } from './types.js'

import type { BigIntLike, BytesLike, PrefixedHexString } from './types.js'

export type DepositData = {
  pubkey: BytesLike
  withdrawalCredentials: BytesLike
  amount: BigIntLike
  signature: BytesLike
  index: BigIntLike
}

export interface JsonRpcDeposit {
  pubkey: PrefixedHexString // DATA - 48 bytes
  withdrawalCredentials: PrefixedHexString // DATA - 32 bytes
  amount: PrefixedHexString // QUANTITY, 64 bytes
  signature: PrefixedHexString // DATA - 96 bytes
  index: PrefixedHexString // QUANTITY - 64 bytes
}

export type DepositBytes = [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array]

/**
 * Representation of EIP-6110 Deposit data
 */
export class Deposit {
  constructor(
    public readonly pubkey: Uint8Array,
    public readonly withdrawalCredentials: Uint8Array,
    public readonly amount: bigint,
    public readonly signature: Uint8Array,
    public readonly index: bigint
  ) {}

  public static fromDepositData(depositData: DepositData) {
    const {
      pubkey: pubkeyData,
      withdrawalCredentials: withdrawalCredentialsData,
      amount: amountData,
      signature: signatureData,
      index: indexData,
    } = depositData
    const pubkey = toType(pubkeyData, TypeOutput.Uint8Array)
    const withdrawalCredentials = toType(withdrawalCredentialsData, TypeOutput.Uint8Array)
    const signature = toType(signatureData, TypeOutput.Uint8Array)
    const amount = toType(amountData, TypeOutput.BigInt)
    const index = toType(indexData, TypeOutput.BigInt)

    return new Deposit(pubkey, withdrawalCredentials, amount, signature, index)
  }

  public static fromValuesArray(depositArray: DepositBytes) {
    if (depositArray.length !== 5) {
      throw Error(`Invalid depositArray length expected=5 actual=${depositArray.length}`)
    }
    const [pubkey, withdrawalCredentials, amount, signature, index] = depositArray
    return Deposit.fromDepositData({ pubkey, withdrawalCredentials, amount, signature, index })
  }

  /**
   * Convert a withdrawal to a buffer array
   * @param withdrawal the withdrawal to convert
   * @returns buffer array of the withdrawal
   */
  public static toBytesArray(deposit: Deposit | DepositData): DepositBytes {
    const { pubkey, withdrawalCredentials, amount, signature, index } = deposit
    const pubkeyBytes = toType(pubkey, TypeOutput.Uint8Array)
    const withdrawalCredentialsBytes = toType(withdrawalCredentials, TypeOutput.Uint8Array)
    const amountBytes =
      toType(amount, TypeOutput.BigInt) === BIGINT_0
        ? new Uint8Array()
        : toType(amount, TypeOutput.Uint8Array)
    const signatureBytes = toType(signature, TypeOutput.Uint8Array)
    const indexBytes =
      toType(index, TypeOutput.BigInt) === BIGINT_0
        ? new Uint8Array()
        : toType(index, TypeOutput.Uint8Array)

    return [pubkeyBytes, withdrawalCredentialsBytes, amountBytes, signatureBytes, indexBytes]
  }

  raw() {
    return Deposit.toBytesArray(this)
  }

  toValue() {
    return {
      pubkey: this.pubkey,
      withdrawalCredentials: this.withdrawalCredentials,
      amount: this.amount,
      signature: this.signature,
      index: this.index,
    }
  }

  toJSON() {
    return {
      pubkey: bytesToHex(this.pubkey),
      withdrawalCredentials: bytesToHex(this.withdrawalCredentials),
      amount: bigIntToHex(this.amount),
      signature: bytesToHex(this.signature),
      index: bigIntToHex(this.index),
    }
  }
}
