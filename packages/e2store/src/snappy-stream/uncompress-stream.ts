import { Transform } from 'stream'
import { EthereumJSErrorWithoutCode } from '@ethereumjs/rlp'
import { uncompress } from 'snappyjs'

const IDENTIFIER = new Uint8Array([0x73, 0x4e, 0x61, 0x50, 0x70, 0x59])

export interface UncompressStreamOptions {
  asBuffer?: boolean
}

type FrameType = 'identifier' | 'compressed' | 'uncompressed' | 'padding'

export class UncompressStream extends Transform {
  private asBuffer: boolean
  private foundIdentifier: boolean
  private buffer: Uint8Array[]

  constructor(opts: UncompressStreamOptions = {}) {
    super({ objectMode: !(opts.asBuffer ?? true) })
    this.asBuffer = opts.asBuffer ?? true
    this.foundIdentifier = false
    this.buffer = []
  }

  private frameSize(buffer: Uint8Array, offset: number): number {
    return buffer[offset] + (buffer[offset + 1] << 8) + (buffer[offset + 2] << 16)
  }

  private getType(value: number): FrameType {
    if (value === 0xff) return 'identifier'
    if (value === 0x00) return 'compressed'
    if (value === 0x01) return 'uncompressed'
    if (value === 0xfe) return 'padding'
    throw EthereumJSErrorWithoutCode('unknown frame type')
  }

  private concatBuffers(): Uint8Array {
    const totalLength = this.buffer.reduce((sum, buf) => sum + buf.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const buf of this.buffer) {
      result.set(buf, offset)
      offset += buf.length
    }
    return result
  }

  private _parse(callback: (error?: Error | null) => void): void {
    const buffer = this.concatBuffers()
    if (buffer.length < 4) {
      return callback()
    }

    const size = this.frameSize(buffer, 1)
    const type = this.getType(buffer[0])
    const data = buffer.slice(4, 4 + size)

    if (buffer.length - 4 < size) {
      return callback()
    }

    this.buffer = [buffer.slice(4 + size)]

    if (!this.foundIdentifier && type !== 'identifier') {
      return callback(new Error('malformed input: must begin with an identifier'))
    }

    if (type === 'identifier') {
      if (!this.areEqual(data, IDENTIFIER)) {
        return callback(new Error('malformed input: bad identifier'))
      }
      this.foundIdentifier = true
      return this._parse(callback)
    }

    if (type === 'compressed') {
      // TODO: check that the checksum matches
      try {
        const raw = uncompress(data.slice(4))
        this.push(raw)
        this._parse(callback)
      } catch (err) {
        err instanceof Error && callback(err)
      }
      return
    }

    if (type === 'uncompressed') {
      // TODO: check that the checksum matches
      const result = data.slice(4)
      this.push(result)
      this._parse(callback)
      return
    }

    if (type === 'padding') {
      return this._parse(callback)
    }
  }

  private areEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  _transform(chunk: Uint8Array, _enc: string, callback: (error?: Error | null) => void): void {
    this.buffer.push(chunk)
    this._parse(callback)
  }
}
