import { concatBytes } from 'ethereum-cryptography/utils'

import { toBytes } from './bytes.js'

import type { BytesLike } from './types.js'

export type RequestBytes = Uint8Array

export interface RequestData {
  type: number
  data: BytesLike
}
export class CLRequest {
  type: number
  data: Uint8Array
  constructor(type: number, data?: Uint8Array) {
    if (type === undefined) throw new Error('request type is required')
    this.type = type
    this.data = data ?? new Uint8Array()
  }

  public static fromRequestsData = (requestData: RequestData) => {
    return new CLRequest(requestData.type, toBytes(requestData.data))
  }

  serialize = () => {
    return concatBytes(Uint8Array.from([this.type]), this.data)
  }
}
