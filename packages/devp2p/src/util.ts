import { RLP } from '@ethereumjs/rlp'
import { debug as createDebugLogger } from 'debug'
import { keccak256 as _keccak256 } from 'ethereum-cryptography/keccak'
import { utils } from 'ethereum-cryptography/secp256k1'
import { publicKeyConvert } from 'ethereum-cryptography/secp256k1-compat'
import { bytesToHex, concatBytes, equalsBytes, hexToBytes } from 'ethereum-cryptography/utils'

import type { ETH } from './protocol/eth'
import type { LES } from './protocol/les'

export const devp2pDebug = createDebugLogger('devp2p')

export function keccak256(...bytes: Uint8Array[]) {
  const allBytes = concatBytes(...bytes)
  return _keccak256(allBytes)
}

export function genPrivateKey(): Uint8Array {
  const privateKey = utils.randomPrivateKey()
  return utils.isValidPrivateKey(privateKey) ? privateKey : genPrivateKey()
}

export function pk2id(pk: Uint8Array): Uint8Array {
  if (pk.length === 33) {
    pk = publicKeyConvert(pk, false)
  }
  return pk.slice(1)
}

export function id2pk(id: Uint8Array): Uint8Array {
  return concatBytes(Uint8Array.from([0x04]), id)
}

export function int2bytes(v: number | null): Uint8Array {
  if (v === null) {
    return new Uint8Array(0)
  }
  let hex = v.toString(16)
  if (hex.length % 2 === 1) hex = '0' + hex
  return hexToBytes(hex)
}

export function bytes2int(bytes: Uint8Array): number {
  if (bytes.length === 0) return NaN

  let n = 0
  for (let i = 0; i < bytes.length; ++i) n = n * 256 + bytes[i]
  return n
}

export function zfill(bytes: Uint8Array, size: number, leftpad: boolean = true): Uint8Array {
  if (bytes.length >= size) return bytes
  if (leftpad === undefined) leftpad = true
  const pad = new Uint8Array(size - bytes.length).fill(0x00)
  return leftpad ? concatBytes(pad, bytes) : concatBytes(bytes, pad)
}

export function xor(a: Uint8Array, b: any): Uint8Array {
  const length = Math.min(a.length, b.length)
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; ++i) bytes[i] = a[i] ^ b[i]
  return bytes
}

type assertInput = Uint8Array | Uint8Array[] | ETH.StatusMsg | LES.Status | number | null

export function assertEq(
  expected: assertInput,
  actual: assertInput,
  msg: string,
  debug: Function,
  messageName?: string
): void {
  let fullMsg

  if (expected instanceof Uint8Array && actual instanceof Uint8Array) {
    if (equalsBytes(expected, actual)) return
    fullMsg = `${msg}: ${bytesToHex(expected)} / ${bytesToHex(actual)}`
    const debugMsg = `[ERROR] ${fullMsg}`
    if (messageName !== undefined) {
      debug(messageName, debugMsg)
    } else {
      debug(debugMsg)
    }
    throw new Error(fullMsg)
  }

  if (expected === actual) return
  fullMsg = `${msg}: ${expected} / ${actual}`
  if (messageName !== undefined) {
    debug(messageName, fullMsg)
  } else {
    debug(fullMsg)
  }
  throw new Error(fullMsg)
}

export function formatLogId(id: string, verbose: boolean): string {
  const numChars = 7
  if (verbose) {
    return id
  } else {
    return `${id.substring(0, numChars)}`
  }
}

export function formatLogData(data: string, verbose: boolean): string {
  const maxChars = 60
  if (verbose || data.length <= maxChars) {
    return data
  } else {
    return `${data.substring(0, maxChars)}...`
  }
}

export class Deferred<T> {
  promise: Promise<T>
  resolve: (...args: any[]) => any = () => {}
  reject: (...args: any[]) => any = () => {}
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export function createDeferred<T>(): Deferred<T> {
  return new Deferred()
}

export function unstrictDecode(value: Uint8Array) {
  // rlp library throws on remainder.length !== 0
  // this utility function bypasses that
  return RLP.decode(value, true).data
}

// multiaddr 8.0.0 expects an Uint8Array with internal buffer starting at 0 offset
export function toNewUint8Array(buf: Uint8Array): Uint8Array {
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  return new Uint8Array(arrayBuffer)
}
