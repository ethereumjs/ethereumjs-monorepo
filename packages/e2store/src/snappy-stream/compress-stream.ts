import { Transform } from 'stream'
import { compress } from 'snappyjs'
import { checksum } from './checksum.ts'

/**
 * As per the snappy framing format for streams, the size of any uncompressed chunk can be
 * no longer than 65536 bytes.
 *
 * From: https://github.com/google/snappy/blob/main/framing_format.txt#L90:L92
 */
const UNCOMPRESSED_CHUNK_SIZE = 65536

const IDENTIFIER_FRAME = new Uint8Array([
  0xff, 0x06, 0x00, 0x00, 0x73, 0x4e, 0x61, 0x50, 0x70, 0x59,
])
const COMPRESSED = new Uint8Array([0x00])
const UNCOMPRESSED = new Uint8Array([0x01])

export interface CompressStreamOptions {
  asyncCompress?: boolean
}

export class CompressStream extends Transform {
  private asyncCompress: boolean

  constructor(opts: CompressStreamOptions = {}) {
    super()
    this.asyncCompress = opts.asyncCompress ?? false
    // first push the identifier frame
    this.push(IDENTIFIER_FRAME)
  }

  private _compressed(chunk: Uint8Array, compressed: Uint8Array): void {
    const size = compressed.length + 4
    const sizeBytes = new Uint8Array(3)
    sizeBytes[0] = size & 0xff
    sizeBytes[1] = (size >> 8) & 0xff
    sizeBytes[2] = (size >> 16) & 0xff

    const result = new Uint8Array(1 + 3 + 4 + compressed.length)
    result.set(COMPRESSED, 0)
    result.set(sizeBytes, 1)
    result.set(checksum(chunk), 4)
    result.set(compressed, 8)

    this.push(result)
  }

  private _uncompressed(chunk: Uint8Array): void {
    const size = chunk.length + 4
    const sizeBytes = new Uint8Array(3)
    sizeBytes[0] = size & 0xff
    sizeBytes[1] = (size >> 8) & 0xff
    sizeBytes[2] = (size >> 16) & 0xff

    const result = new Uint8Array(1 + 3 + 4 + chunk.length)
    result.set(UNCOMPRESSED, 0)
    result.set(sizeBytes, 1)
    result.set(checksum(chunk), 4)
    result.set(chunk, 8)

    this.push(result)
  }

  _transform(chunk: Uint8Array, _enc: string, callback: (error?: Error | null) => void): void {
    if (this.asyncCompress) {
      this._asyncTransform(chunk, callback)
    } else {
      this._syncTransform(chunk, callback)
    }
  }

  private async _asyncTransform(
    chunk: Uint8Array,
    callback: (error?: Error | null) => void,
  ): Promise<void> {
    const processChunk = async (startFrom: number): Promise<void> => {
      const endAt = startFrom + Math.min(chunk.length - startFrom, UNCOMPRESSED_CHUNK_SIZE)
      const bytesChunk = chunk.slice(startFrom, endAt)

      try {
        const compressed = compress(bytesChunk)
        if (compressed.length < bytesChunk.length) {
          this._compressed(bytesChunk, compressed)
        } else {
          this._uncompressed(bytesChunk)
        }

        if (endAt < chunk.length) {
          await processChunk(endAt)
        } else {
          callback()
        }
      } catch (err) {
        callback(err as Error)
      }
    }

    await processChunk(0)
  }

  private async _syncTransform(
    chunk: Uint8Array,
    callback: (error?: Error | null) => void,
  ): Promise<void> {
    try {
      for (let i = 0; i < chunk.length; i += UNCOMPRESSED_CHUNK_SIZE) {
        const endAt = Math.min(i + UNCOMPRESSED_CHUNK_SIZE, chunk.length)
        const bytesChunk = chunk.slice(i, endAt)
        const compressed = compress(bytesChunk)

        if (compressed.length < bytesChunk.length) {
          this._compressed(bytesChunk, compressed)
        } else {
          this._uncompressed(bytesChunk)
        }
      }
      callback()
    } catch (err) {
      callback(err as Error)
    }
  }
}
