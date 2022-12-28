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
