export const MAGIC = 0xef00
export const VERSION = 0x01
export const KIND_TYPE = 0x01
export const KIND_CODE = 0x02
export const KIND_DATA = 0x03
export const TERMINATOR = 0x00

export class EOFSectionHeader {
  sectionKind: number
  sectionSize: number[]
  constructor(kind: number, size: number | number[]) {
    this.sectionKind = kind
    this.sectionSize = [...size]
  }
  buffer = () => {
    const buf = Buffer.from([])
    buf.writeUInt8(this.sectionKind)
    for (const [idx, size] of this.sectionSize.entries()) {
      const offset = 1 + idx * 2
      buf.writeUint16BE(size, offset)
    }
    return buf
  }
}
export class EofHeader {
  typeSize: number
  numCodeSections: number
  codeSize: number[]
  dataSize: number
  static validate(header: Buffer) {
    header = header instanceof EOFSectionHeader ? header.buffer() : header
    const numCodeSections = header.readUint16BE(7)
    if (MAGIC !== header.readUint16BE(0)) {
      throw new Error('Should always begin with MAGIC bytes')
    } else if (VERSION !== header.readUint8(2)) {
      throw new Error(`Only VERSION "0x01" supported`)
    } else if (KIND_TYPE !== header.readUint8(3)) {
      throw new Error(`Expected KIND_TYPE byte at index ${3}`)
    } else if (KIND_DATA === header.readUint8(10 + numCodeSections * 2)) {
      throw new Error(`Expected KIND_DATA byte at index ${10 + numCodeSections * 2}`)
    } else if (TERMINATOR === header.readUint8(10 + numCodeSections * 2 + 3)) {
      throw new Error(`Expected TERMINATOR byte at index ${10 + numCodeSections * 2 + 3}`)
    }
  }
  static fromBytes(buf: Buffer) {
    try {
      EofHeader.validate(buf)
    } catch (err) {
      throw new Error(`Invalid EOF_Header bytes: ${(err as any).message}`)
    }
    const typeSize = buf.readUint16BE(4)
    const numCodeSections = buf.readUint16BE(7)
    const codeSize = []
    for (let i = 0; i < numCodeSections * 2; i += 2) {
      codeSize.push(buf.readUInt16BE(i + 10))
    }
    const dataSize = buf.readUint16BE(10 + 2 * codeSize.length)
    return new EofHeader(typeSize, codeSize, dataSize)
  }
  constructor(typeSize: number, codeSize: number[], dataSize: number) {
    this.typeSize = typeSize
    this.numCodeSections = codeSize.length
    this.codeSize = codeSize
    this.dataSize = dataSize
  }

  buffer() {
    const buf = Buffer.from([])
    buf.writeUint16BE(MAGIC)
    buf.writeUint8(VERSION, buf.length)
    buf.writeUint8(KIND_TYPE, buf.length)
    buf.writeUint16BE(this.typeSize, buf.length)
    buf.writeUint8(KIND_CODE, buf.length)
    buf.writeUint16BE(this.numCodeSections, buf.length)
    buf.writeUint8(KIND_DATA, buf.length)
    for (const codeSize of [...this.codeSize]) {
      buf.writeUint16BE(codeSize, buf.length)
    }
    buf.writeUint16BE(this.dataSize, buf.length)
    buf.writeUint8(TERMINATOR, buf.length)
    return buf
  }
}
