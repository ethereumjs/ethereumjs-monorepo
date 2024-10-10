import { RLP } from '@ethereumjs/rlp'
import { concatBytes } from 'ethereum-cryptography/utils'

import { bytesToHex, hexToBytes } from './bytes.js'

import type { PrefixedHexString } from './types.js'

export type RequestBytes = Uint8Array

export enum CLRequestType {
  Deposit = 0x00,
  Withdrawal = 0x01,
  Consolidation = 0x02,
}

export type DepositRequestV1 = {
  pubkey: PrefixedHexString // DATA 48 bytes
  withdrawalCredentials: PrefixedHexString // DATA 32 bytes
  amount: PrefixedHexString // QUANTITY 8 bytes in gwei
  signature: PrefixedHexString // DATA 96 bytes
  index: PrefixedHexString // QUANTITY 8 bytes
}

export type WithdrawalRequestV1 = {
  sourceAddress: PrefixedHexString // DATA 20 bytes
  validatorPubkey: PrefixedHexString // DATA 48 bytes
  amount: PrefixedHexString // QUANTITY 8 bytes in gwei
}

export type ConsolidationRequestV1 = {
  sourceAddress: PrefixedHexString // DATA 20 bytes
  sourcePubkey: PrefixedHexString // DATA 48 bytes
  targetPubkey: PrefixedHexString // DATA 48 bytes
}

export interface RequestJSON {
  [CLRequestType.Deposit]: DepositRequestV1
  [CLRequestType.Withdrawal]: WithdrawalRequestV1
  [CLRequestType.Consolidation]: ConsolidationRequestV1
}

export type DepositRequestData = {
  pubkey: Uint8Array
  withdrawalCredentials: Uint8Array
  // 8 bytes uint64 LE
  amount: Uint8Array
  signature: Uint8Array
  // 8 bytes uint64 LE
  index: Uint8Array
}

export type WithdrawalRequestData = {
  sourceAddress: Uint8Array
  validatorPubkey: Uint8Array
  // 8 bytes uint64 LE
  amount: Uint8Array
}

export type ConsolidationRequestData = {
  sourceAddress: Uint8Array
  sourcePubkey: Uint8Array
  targetPubkey: Uint8Array
}

export interface RequestData {
  [CLRequestType.Deposit]: DepositRequestData
  [CLRequestType.Withdrawal]: WithdrawalRequestData
  [CLRequestType.Consolidation]: ConsolidationRequestData
}

export type TypedRequestData = RequestData[CLRequestType]

export interface CLRequestInterface<T extends CLRequestType = CLRequestType> {
  readonly type: T
  serialize(): Uint8Array
  toJSON(): RequestJSON[T]
}

export abstract class CLRequest<T extends CLRequestType> implements CLRequestInterface<T> {
  readonly type: T
  abstract serialize(): Uint8Array
  abstract toJSON(): RequestJSON[T]
  constructor(type: T) {
    this.type = type
  }
}

export class DepositRequest extends CLRequest<CLRequestType.Deposit> {
  constructor(
    public readonly pubkey: Uint8Array,
    public readonly withdrawalCredentials: Uint8Array,
    // 8 bytes uint64 LE
    public readonly amount: Uint8Array,
    public readonly signature: Uint8Array,
    // 8 bytes uint64 LE
    public readonly index: Uint8Array,
  ) {
    super(CLRequestType.Deposit)
  }

  serialize() {
    return concatBytes(
      Uint8Array.from([this.type]),
      this.pubkey,
      this.withdrawalCredentials,
      this.amount,
      this.signature,
      this.index,
    )
  }

  toJSON(): DepositRequestV1 {
    return {
      pubkey: bytesToHex(this.pubkey),
      withdrawalCredentials: bytesToHex(this.withdrawalCredentials),
      amount: bytesToHex(this.amount),
      signature: bytesToHex(this.signature),
      index: bytesToHex(this.index),
    }
  }
}

export class WithdrawalRequest extends CLRequest<CLRequestType.Withdrawal> {
  constructor(
    public readonly sourceAddress: Uint8Array,
    public readonly validatorPubkey: Uint8Array,
    // 8 bytes uint64 LE
    public readonly amount: Uint8Array,
  ) {
    super(CLRequestType.Withdrawal)
  }

  serialize() {
    return concatBytes(
      Uint8Array.from([this.type]),
      this.sourceAddress,
      this.validatorPubkey,
      this.amount,
    )
  }

  toJSON(): WithdrawalRequestV1 {
    return {
      sourceAddress: bytesToHex(this.sourceAddress),
      validatorPubkey: bytesToHex(this.validatorPubkey),
      amount: bytesToHex(this.amount),
    }
  }
}

export class ConsolidationRequest extends CLRequest<CLRequestType.Consolidation> {
  constructor(
    public readonly sourceAddress: Uint8Array,
    public readonly sourcePubkey: Uint8Array,
    public readonly targetPubkey: Uint8Array,
  ) {
    super(CLRequestType.Consolidation)
  }

  serialize() {
    return concatBytes(
      Uint8Array.from([this.type]),
      this.sourceAddress,
      this.sourcePubkey,
      this.targetPubkey,
    )
  }

  toJSON(): ConsolidationRequestV1 {
    return {
      sourceAddress: bytesToHex(this.sourceAddress),
      sourcePubkey: bytesToHex(this.sourcePubkey),
      targetPubkey: bytesToHex(this.targetPubkey),
    }
  }
}

export function createDepositRequest(depositData: DepositRequestData): DepositRequest {
  const { pubkey, withdrawalCredentials, amount, signature, index } = depositData
  return new DepositRequest(pubkey, withdrawalCredentials, amount, signature, index)
}

export function createDepositRequestFromJSON(jsonData: DepositRequestV1): DepositRequest {
  const { pubkey, withdrawalCredentials, amount, signature, index } = jsonData
  return createDepositRequest({
    pubkey: hexToBytes(pubkey),
    withdrawalCredentials: hexToBytes(withdrawalCredentials),
    amount: hexToBytes(amount),
    signature: hexToBytes(signature),
    index: hexToBytes(index),
  })
}

export function createDepositRequestFromFlatData(bytes: Uint8Array): DepositRequest {
  if (bytes.length !== 48 + 32 + 8 + 96) {
    throw Error(`Invalid bytes=${bytes.length} for deposit request data`)
  }

  return createDepositRequest({
    pubkey: bytes.subarray(0, 48),
    withdrawalCredentials: bytes.subarray(48, 48 + 32),
    amount: bytes.subarray(48 + 32, 48 + 32 + 8),
    signature: bytes.subarray(48 + 32 + 8, 48 + 32 + 8 + 96),
    index: bytes.subarray(48 + 32 + 8 + 96),
  })
}

export function createWithdrawalRequest(withdrawalData: WithdrawalRequestData): WithdrawalRequest {
  const { sourceAddress, validatorPubkey, amount } = withdrawalData
  return new WithdrawalRequest(sourceAddress, validatorPubkey, amount)
}

export function createWithdrawalRequestFromJSON(jsonData: WithdrawalRequestV1): WithdrawalRequest {
  const { sourceAddress, validatorPubkey, amount } = jsonData
  return createWithdrawalRequest({
    sourceAddress: hexToBytes(sourceAddress),
    validatorPubkey: hexToBytes(validatorPubkey),
    amount: hexToBytes(amount),
  })
}

export function createWithdrawalRequestFromFlatData(bytes: Uint8Array): WithdrawalRequest {
  if (bytes.length !== 20 + 48 + 8) {
    throw Error(`Invalid bytes=${bytes.length} for withdrawal request data`)
  }
  return createWithdrawalRequest({
    sourceAddress: bytes.subarray(0, 20),
    validatorPubkey: bytes.subarray(20, 20 + 48),
    amount: bytes.subarray(20 + 48),
  })
}

export function createConsolidationRequest(
  consolidationData: ConsolidationRequestData,
): ConsolidationRequest {
  const { sourceAddress, sourcePubkey, targetPubkey } = consolidationData
  return new ConsolidationRequest(sourceAddress, sourcePubkey, targetPubkey)
}

export function createConsolidationRequestFromJSON(
  jsonData: ConsolidationRequestV1,
): ConsolidationRequest {
  const { sourceAddress, sourcePubkey, targetPubkey } = jsonData
  return createConsolidationRequest({
    sourceAddress: hexToBytes(sourceAddress),
    sourcePubkey: hexToBytes(sourcePubkey),
    targetPubkey: hexToBytes(targetPubkey),
  })
}

export function createConsolidationRequestFromFlatData(bytes: Uint8Array): ConsolidationRequest {
  const [sourceAddress, sourcePubkey, targetPubkey] = RLP.decode(bytes) as [
    Uint8Array,
    Uint8Array,
    Uint8Array,
  ]
  return createConsolidationRequest({
    sourceAddress,
    sourcePubkey,
    targetPubkey,
  })
}

export class CLRequestFactory {
  public static fromSerializedRequest(bytes: Uint8Array): CLRequest<CLRequestType> {
    switch (bytes[0]) {
      case CLRequestType.Deposit:
        return createDepositRequestFromFlatData(bytes.subarray(1))
      case CLRequestType.Withdrawal:
        return createWithdrawalRequestFromFlatData(bytes.subarray(1))
      case CLRequestType.Consolidation:
        return createConsolidationRequestFromFlatData(bytes.subarray(1))
      default:
        throw Error(`Invalid request type=${bytes[0]}`)
    }
  }
}
