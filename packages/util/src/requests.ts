import { concatBytes } from 'ethereum-cryptography/utils'

export type RequestBytes = Uint8Array

export interface RequestData {
  type: number
  data: Uint8Array
}

export interface CLRequestType<T> {
  readonly type: number
  readonly bytes: Uint8Array
  greaterThan(a: T): boolean
  serialize(): Uint8Array
}

export abstract class CLRequest implements CLRequestType<any> {
  type: number
  bytes: Uint8Array = new Uint8Array()
  constructor(type: number, bytes: Uint8Array) {
    if (type === undefined) throw new Error('request type is required')
    this.type = type
    this.bytes = bytes
  }
  public abstract greaterThan(a: CLRequestType<any>): boolean

  serialize() {
    return concatBytes(Uint8Array.from([this.type]), this.bytes)
  }
}
