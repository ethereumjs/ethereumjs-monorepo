/**
 * These utilities for constructing blobs are borrowed from https://github.com/Inphi/eip4844-interop.git
 */
const BYTES_PER_FIELD_ELEMENT = 32
const FIELD_ELEMENTS_PER_BLOB = 4096
const USEFUL_BYTES_PER_BLOB = 32 * FIELD_ELEMENTS_PER_BLOB
const MAX_BLOBS_PER_TX = 2
const MAX_USEFUL_BYTES_PER_TX = USEFUL_BYTES_PER_BLOB * MAX_BLOBS_PER_TX - 1
const BLOB_SIZE = BYTES_PER_FIELD_ELEMENT * FIELD_ELEMENTS_PER_BLOB

function get_padded(data: Buffer, blobs_len: number) {
  const pdata = Buffer.alloc(blobs_len * USEFUL_BYTES_PER_BLOB)
  const datalen = Buffer.byteLength(data)
  pdata.fill(data, 0, datalen)
  pdata[datalen] = 0x80
  return pdata
}

function get_blob(data: Buffer) {
  const blob = Buffer.alloc(BLOB_SIZE, 'binary')
  for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i++) {
    const chunk = Buffer.alloc(32, 'binary')
    chunk.fill(data.subarray(i * 31, (i + 1) * 31), 0, 31)
    blob.fill(chunk, i * 32, (i + 1) * 32)
  }

  return blob
}

export function get_blobs(input: string) {
  const data = Buffer.from(input, 'binary')
  const len = Buffer.byteLength(data)
  if (len === 0) {
    throw Error('invalid blob data')
  }
  if (len > MAX_USEFUL_BYTES_PER_TX) {
    throw Error('blob data is too large')
  }

  const blobs_len = Math.ceil(len / USEFUL_BYTES_PER_BLOB)

  const pdata = get_padded(data, blobs_len)

  const blobs = []
  for (let i = 0; i < blobs_len; i++) {
    const chunk = pdata.subarray(i * USEFUL_BYTES_PER_BLOB, (i + 1) * USEFUL_BYTES_PER_BLOB)
    const blob = get_blob(chunk)
    blobs.push(blob)
  }

  return blobs
}
