const ethUtil = require('ethereumjs-util')

export default class BinaryValue {
  buf: Buffer
  length: number | undefined

  constructor(data?: any, length?: number) {
    let buf: Buffer
    this.length = length

    if (!data) {
      buf = length ? Buffer.alloc(length) : Buffer.from([])
    } else {
      buf = ethUtil.toBuffer(data)
    }

    if (length && buf.length !== length) {
      throw new RangeError('invalid length')
    }

    this.buf = buf
  }

  get(): Buffer {
    return this.buf
  }

  set(v: any): void {
    let buf: Buffer = ethUtil.toBuffer(v)

    if (buf.toString('hex') === '00') {
      buf = Buffer.allocUnsafe(0)
    }

    if (this.length && buf.length !== this.length) {
      throw new RangeError('value length is invalid')
    }

    this.buf = buf
  }
}
