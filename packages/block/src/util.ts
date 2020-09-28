import { BNLike } from './types'
import { BN } from 'ethereumjs-util'

export function checkBufferLength(value: Buffer, expected: number): Buffer {
  const provided = value.length
  if (provided != expected) {
    throw new Error(
      `Expected Buffer length for ${value} on initialization is ${expected}, provided: ${provided}`,
    )
  }
  return value
}

export function toBN(value: BNLike | Buffer) {
  if (typeof value == 'string') {
    if (value.substr(0, 2) == '0x') {
      return new BN(Buffer.from(value.substr(2), 'hex'))
    }
  }
  return new BN(value)
}
