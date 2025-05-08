import { Writable } from 'stream'
import { concatBytes } from '@ethereumjs/util'
import { createCompressStream, createUncompressStream } from './snappy-stream/index.ts'
/**
 * Compress data using snappy
 * @param uncompressedData
 * @returns compressed data
 */
export async function compressData(uncompressedData: Uint8Array): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const compressedChunks: Uint8Array[] = []
    const writableStream = new Writable({
      write(chunk: Uint8Array, encoding: string, callback: () => void) {
        compressedChunks.push(new Uint8Array(chunk))
        callback()
      },
    })

    const compress = createCompressStream()

    compress.on('error', reject)
    writableStream.on('error', reject)
    writableStream.on('finish', () => {
      const totalLength = compressedChunks.reduce((sum, chunk) => sum + chunk.length, 0)
      const result = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of compressedChunks) {
        result.set(chunk, offset)
        offset += chunk.length
      }
      resolve(result)
    })

    compress.pipe(writableStream)

    compress.write(uncompressedData)
    compress.end()
  })
}

export async function decompressData(compressedData: Uint8Array) {
  const unsnappy = createUncompressStream({ asBuffer: true })
  const destroy = () => {
    unsnappy.destroy()
  }

  const data: Uint8Array = await new Promise((resolve) => {
    const chunks: Uint8Array[] = []
    unsnappy.on('data', (data: Uint8Array) => {
      chunks.push(data)
    })

    unsnappy.on('end', () => {
      destroy()
      resolve(concatBytes(...chunks))
    })
    unsnappy.write(compressedData)
    unsnappy.end()
  })
  return data
}
