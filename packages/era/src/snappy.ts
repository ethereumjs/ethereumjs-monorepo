import { SnappyStream, UnsnappyStream } from 'snappystream'
import { Duplex, Writable } from 'stream'

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

    const compress = new SnappyStream()

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

    compress.end(uncompressedData)
  })
}

export async function decompressData(compressedData: Uint8Array) {
  const unsnappy = new UnsnappyStream()
  const stream = new Duplex()
  const destroy = () => {
    unsnappy.destroy()
    stream.destroy()
  }
  stream.on('error', (err) => {
    if (err.message.includes('_read() method is not implemented')) {
      // ignore errors about unimplemented methods
      return
    } else {
      throw err
    }
  })

  stream.push(compressedData)
  const data: Uint8Array = await new Promise((resolve, reject) => {
    unsnappy.on('data', (data: Uint8Array) => {
      try {
        destroy()
        resolve(data)
        // eslint-disable-next-line
      } catch {}
    })
    unsnappy.on('end', (data: any) => {
      try {
        destroy()
        resolve(data)
      } catch (err: any) {
        destroy()
        reject(`unable to deserialize data with reason - ${err.message}`)
      }
    })
    unsnappy.on('close', (data: any) => {
      try {
        destroy()
        resolve(data)
      } catch (err: any) {
        destroy()
        reject(`unable to deserialize data with reason - ${err.message}`)
      }
    })
    stream.pipe(unsnappy)
  })
  return data
}
