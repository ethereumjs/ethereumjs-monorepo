import { arrToBufArr } from '@ethereumjs/util'
import RLP from 'rlp'
import { utils } from 'ethereum-cryptography/secp256k1'
import { publicKeyConvert } from 'ethereum-cryptography/secp256k1-compat'
import { keccak256 as _keccak256 } from 'ethereum-cryptography/keccak'
import { ETH } from './protocol/eth'
import { LES } from './protocol/les'
import { debug as createDebugLogger } from 'debug'

export const devp2pDebug = createDebugLogger('devp2p')

export function keccak256(...buffers: Buffer[]) {
  const buffer = Buffer.concat(buffers)
  return Buffer.from(_keccak256(buffer))
}

export function genPrivateKey(): Buffer {
  const privateKey = utils.randomPrivateKey()
  return utils.isValidPrivateKey(privateKey) ? Buffer.from(privateKey) : genPrivateKey()
}

export function pk2id(pk: Buffer): Buffer {
  if (pk.length === 33) {
    pk = Buffer.from(publicKeyConvert(pk, false))
  }
  return pk.slice(1)
}

export function id2pk(id: Buffer): Buffer {
  return Buffer.concat([Buffer.from([0x04]), id])
}

export function int2buffer(v: number | null): Buffer {
  if (v === null) {
    return Buffer.alloc(0)
  }
  let hex = v.toString(16)
  if (hex.length % 2 === 1) hex = '0' + hex
  return Buffer.from(hex, 'hex')
}

export function buffer2int(buffer: Buffer): number {
  if (buffer.length === 0) return NaN

  let n = 0
  for (let i = 0; i < buffer.length; ++i) n = n * 256 + buffer[i]
  return n
}

export function zfill(buffer: Buffer, size: number, leftpad: boolean = true): Buffer {
  if (buffer.length >= size) return buffer
  if (leftpad === undefined) leftpad = true
  const pad = Buffer.allocUnsafe(size - buffer.length).fill(0x00)
  return leftpad ? Buffer.concat([pad, buffer]) : Buffer.concat([buffer, pad])
}

export function xor(a: Buffer, b: any): Buffer {
  const length = Math.min(a.length, b.length)
  const buffer = Buffer.allocUnsafe(length)
  for (let i = 0; i < length; ++i) buffer[i] = a[i] ^ b[i]
  return buffer
}

type assertInput = Buffer | Buffer[] | ETH.StatusMsg | LES.Status | number | null

export function assertEq(
  expected: assertInput,
  actual: assertInput,
  msg: string,
  debug: Function,
  messageName?: string
): void {
  let fullMsg
  if (Buffer.isBuffer(expected) && Buffer.isBuffer(actual)) {
    if (expected.equals(actual)) return
    fullMsg = `${msg}: ${expected.toString('hex')} / ${actual.toString('hex')}`
    const debugMsg = `[ERROR] ${fullMsg}`
    if (messageName) {
      debug(messageName, debugMsg)
    } else {
      debug(debugMsg)
    }
    throw new Error(fullMsg)
  }

  if (expected === actual) return
  fullMsg = `${msg}: ${expected} / ${actual}`
  if (messageName) {
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

export function unstrictDecode(value: Buffer) {
  // rlp library throws on remainder.length !== 0
  // this utility function bypasses that
  return arrToBufArr(RLP.decode(Uint8Array.from(value), true).data)
}

// multiaddr 8.0.0 expects an Uint8Array with internal buffer starting at 0 offset
export function toNewUint8Array(buf: Uint8Array): Uint8Array {
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  return new Uint8Array(arrayBuffer)
}
