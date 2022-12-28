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
