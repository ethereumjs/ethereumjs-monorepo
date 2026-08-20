import type { CompressStreamOptions } from './compress-stream.ts'
import { CompressStream } from './compress-stream.ts'
import type { UncompressStreamOptions } from './uncompress-stream.ts'
import { UncompressStream } from './uncompress-stream.ts'

/** Create a Snappy framed decompress stream for e2store payloads. */
export function createUncompressStream(opts?: UncompressStreamOptions): UncompressStream {
  return new UncompressStream(opts)
}

/** Create a Snappy framed compress stream for e2store payloads. */
export function createCompressStream(opts?: CompressStreamOptions): CompressStream {
  return new CompressStream(opts)
}

export { CompressStream, UncompressStream }
export type { CompressStreamOptions, UncompressStreamOptions }
