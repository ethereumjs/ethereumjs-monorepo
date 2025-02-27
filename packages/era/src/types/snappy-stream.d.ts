declare module '@chainsafe/snappy-stream' {
  import type { Writable } from 'stream'
  export function createCompressStream(): Writable
  export function createUncompressStream(options?: { asBuffer: boolean }): Writable
  const snappyStream: {
    createCompressStream: typeof createCompressStream
    createUncompressStream: typeof createUncompressStream
  }
  // eslint-disable-next-line import/no-default-export
  export default snappyStream
}
