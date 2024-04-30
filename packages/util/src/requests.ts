import { concatBytes } from 'ethereum-cryptography/utils'

export type RequestBytes = Uint8Array

export interface RequestData {
  type: number
  data: Uint8Array
}

export interface CLRequestType {
  readonly type: number
  readonly bytes: Uint8Array
  serialize(): Uint8Array
}

export class CLRequest implements CLRequestType {
  type: number
  bytes: Uint8Array
  constructor(type: number, bytes: Uint8Array) {
    if (type === undefined) throw new Error('request type is required')
    this.type = type
    this.bytes = bytes
  }

  serialize() {
    return concatBytes(Uint8Array.from([this.type]), this.bytes)
  }
}
