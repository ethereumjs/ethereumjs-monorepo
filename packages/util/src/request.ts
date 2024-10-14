import { concatBytes } from 'ethereum-cryptography/utils'

import type { PrefixedHexString } from './types.js'

export type RequestBytes = Uint8Array

export enum CLRequestType {
  Deposit = 0x00,
  Withdrawal = 0x01,
  Consolidation = 0x02,
}

export interface RequestJSON {
  type: PrefixedHexString
  data: PrefixedHexString
}

export class CLRequest<T extends CLRequestType> {
  // for easy use
  public readonly bytes: Uint8Array

  get type() {
    return this.bytes[0] as T
  }

  get data() {
    return this.bytes.subarray(1)
  }

  constructor(requestType: T, requestData: Uint8Array) {
    this.bytes = concatBytes(new Uint8Array([requestType]), requestData)
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
