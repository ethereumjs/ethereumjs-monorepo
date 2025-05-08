import type { CompressStreamOptions } from './compress-stream.ts'
import { CompressStream } from './compress-stream.ts'
import type { UncompressStreamOptions } from './uncompress-stream.ts'
import { UncompressStream } from './uncompress-stream.ts'

export function createUncompressStream(opts?: UncompressStreamOptions): UncompressStream {
  return new UncompressStream(opts)
}

export function createCompressStream(opts?: CompressStreamOptions): CompressStream {
  return new CompressStream(opts)
}

export { CompressStream, UncompressStream }
export type { CompressStreamOptions, UncompressStreamOptions }
