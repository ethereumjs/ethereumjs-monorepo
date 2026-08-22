import { concatBytes } from './bytes.ts'

import type { PrefixedHexString } from './types.ts'

/** Opaque consensus-layer request payload bytes. */
export type RequestBytes = Uint8Array

/** Discriminator for consensus-layer request types. */
export type CLRequestType = (typeof CLRequestType)[keyof typeof CLRequestType]

/** Discriminator for consensus-layer request types. */
export const CLRequestType = {
  Deposit: 0,
  Withdrawal: 1,
  Consolidation: 2,
  /**
   * EIP-8282 builder deposit request (Amsterdam, experimental)
   */
  BuilderDeposit: 3,
  /**
   * EIP-8282 builder exit request (Amsterdam, experimental)
   */
  BuilderExit: 4,
} as const

/** JSON-RPC shape of a consensus-layer request. */
export interface RequestJSON {
  type: PrefixedHexString
  data: PrefixedHexString
}

/** Typed wrapper around a consensus-layer request byte payload. */
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

/** Parse request bytes into a {@link CLRequest}. */
export function createCLRequest(bytes: Uint8Array): CLRequest<CLRequestType> {
  switch (bytes[0]) {
    case CLRequestType.Deposit:
      return new CLRequest(CLRequestType.Deposit, bytes.subarray(1))
    case CLRequestType.Withdrawal:
      return new CLRequest(CLRequestType.Withdrawal, bytes.subarray(1))
    case CLRequestType.Consolidation:
      return new CLRequest(CLRequestType.Consolidation, bytes.subarray(1))
    case CLRequestType.BuilderDeposit:
      return new CLRequest(CLRequestType.BuilderDeposit, bytes.subarray(1))
    case CLRequestType.BuilderExit:
      return new CLRequest(CLRequestType.BuilderExit, bytes.subarray(1))
    default:
      throw Error(`Invalid request type=${bytes[0]}`)
  }
}
