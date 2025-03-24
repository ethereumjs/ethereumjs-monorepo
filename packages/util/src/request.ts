import { concatBytes } from './bytes.ts'

import type { PrefixedHexString } from './types.ts'

export type RequestBytes = Uint8Array

export type CLRequestType = (typeof CLRequestType)[keyof typeof CLRequestType]

export const CLRequestType = {
  Deposit: 0,
  Withdrawal: 1,
  Consolidation: 2,
} as const

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

export function createCLRequest(bytes: Uint8Array): CLRequest<CLRequestType> {
  switch (bytes[0]) {
    case CLRequestType.Deposit:
      return new CLRequest(CLRequestType.Deposit, bytes.subarray(1))
    case CLRequestType.Withdrawal:
      return new CLRequest(CLRequestType.Withdrawal, bytes.subarray(1))
    case CLRequestType.Consolidation:
      return new CLRequest(CLRequestType.Consolidation, bytes.subarray(1))
    default:
      throw Error(`Invalid request type=${bytes[0]}`)
  }
}
