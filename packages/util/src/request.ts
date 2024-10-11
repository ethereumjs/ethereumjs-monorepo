import { concatBytes } from 'ethereum-cryptography/utils'

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
  type: PrefixedHexString
  data: PrefixedHexString
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

export class CLRequest<T extends CLRequestType> {
  // for easy use
  public readonly bytes: Uint8Array

  constructor(
    public readonly type: T,
    public readonly data: Uint8Array,
  ) {
    this.bytes = concatBytes(new Uint8Array([this.type]), data)
  }
}

export class DepositRequest extends CLRequest<CLRequestType.Deposit> {
  constructor(requestData: Uint8Array) {
    super(CLRequestType.Deposit, requestData)
  }
}

export class WithdrawalRequest extends CLRequest<CLRequestType.Withdrawal> {
  constructor(requestData: Uint8Array) {
    super(CLRequestType.Withdrawal, requestData)
  }
}

export class ConsolidationRequest extends CLRequest<CLRequestType.Consolidation> {
  constructor(requestData: Uint8Array) {
    super(CLRequestType.Consolidation, requestData)
  }
}

export function createCLRequest<T extends CLRequestType>(bytes: Uint8Array): CLRequest<T> {
  switch (bytes[0]) {
    case CLRequestType.Deposit:
      return new DepositRequest(bytes.subarray(1)) as CLRequest<T>
    case CLRequestType.Withdrawal:
      return new WithdrawalRequest(bytes.subarray(1)) as CLRequest<T>
    case CLRequestType.Consolidation:
      return new ConsolidationRequest(bytes.subarray(1)) as CLRequest<T>
    default:
      throw Error(`Invalid request type=${bytes[0]}`)
  }
}
