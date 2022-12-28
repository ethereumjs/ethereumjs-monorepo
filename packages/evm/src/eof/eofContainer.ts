import { KIND_CODE, KIND_DATA, KIND_TYPE, MAGIC, TERMINATOR } from './constants'

const VERSION = 0x01

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
    if (!header.slice(0, 2).equals(MAGIC)) {
      throw new Error('Should always begin with MAGIC bytes')
    } else if (VERSION !== header.readUint8(2)) {
      throw new Error(`Only VERSION "0x01" supported`)
    } else if (KIND_TYPE !== header.readUint8(3)) {
      throw new Error(`Expected KIND_TYPE byte at index ${3}`)
    } else if (KIND_DATA !== header.readUint8(9 + numCodeSections * 2)) {
      throw new Error(`Expected KIND_DATA byte at index ${9 + numCodeSections * 2}`)
    } else if (TERMINATOR !== header.readUint8(9 + numCodeSections * 2 + 3)) {
      throw new Error(`Expected TERMINATOR byte at index ${9 + numCodeSections * 2 + 3}`)
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

  sectionHeaders() {
    return [
      new EOFSectionHeader(KIND_TYPE, this.typeSize),
      new EOFSectionHeader(KIND_CODE, this.codeSize),
      new EOFSectionHeader(KIND_DATA, this.dataSize),
    ]
  }
  sectionSizes() {
    return this.sectionHeaders()
      .map((header) => {
        return header.sectionSize
      })
      .flat()
  }

  buffer() {
    const buf = Buffer.from(MAGIC)
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

export class TypeSection {
  inputs: number
  outputs: number
  maxStackHeight: number
  static fromBuffer = (buf: Buffer) => {
    const _inputs = buf.readUint8()
    const _outputs = buf.readUint8(1)
    const _msh = buf.readUint16BE(2)
    return new TypeSection(_inputs, _outputs, _msh)
  }
  constructor(inputs: number = 0, outputs: number = 0, maxStackHeight: number = 1023) {
    this.inputs = inputs
    this.outputs = outputs
    this.maxStackHeight = maxStackHeight
  }
  buffer = () => {
    const buf = Buffer.alloc(4)
    buf.writeUint8(this.inputs)
    buf.writeUint8(this.outputs)
    buf.writeUint16BE(this.maxStackHeight)
    return buf
  }
}

class EOFBody {
  typeSections: TypeSection[]
  codeSections: Buffer[]
  dataSection: Buffer
  static validate(body: EOFBody): EOFBody {
    if (body.sections().length === 0) {
      throw new Error(`There MUST be at least one section`)
    }
    if (body.typeSections.length !== body.codeSections.length + 1) {
      throw new Error(`There must be a type header for each section`)
    }
    if (body.typeSections[0].inputs !== 0 || body.typeSections[0].outputs !== 0) {
      throw new Error(`Inputs and Outputs of first section must be 0`)
    }
    return body
  }
  static fromBytes = (header: EofHeader, _body: Buffer) => {
    const typeSections = new Array(header.codeSize.length + 1).fill(0).map((v, i) => {
      return TypeSection.fromBuffer(_body.subarray(i * 4, i * 4 + 4))
    })
    const codeSections = header.codeSize.map((v, i) => {
      const start =
        i === 0
          ? header.typeSize
          : header.typeSize +
            header.codeSize.slice(0, i).reduce((a, b) => {
              return a + b
            })
      return _body.subarray(start, start + v)
    })
    const dataSection = _body.subarray(
      header.typeSize +
        header.codeSize.reduce((a, b) => {
          return a + b
        })
    )
    return EOFBody.validate(new EOFBody(typeSections, codeSections, dataSection))
  }
  constructor(typeSections: TypeSection[], codeSections: Buffer[], dataSection: Buffer) {
    this.typeSections = typeSections
    this.codeSections = codeSections
    this.dataSection = dataSection
  }
  sections() {
    return [...this.codeSections, this.dataSection]
  }
  size() {
    return {
      typeSize: Buffer.concat(this.typeSections.map((s) => s.buffer())).length,
      codeSize: Buffer.concat(this.codeSections).length,
      dataSize: this.dataSection.length,
    }
  }
  sectionSizes() {
    return [
      Buffer.concat(this.typeSections.map((s) => s.buffer())).length,
      ...this.codeSections.map((s) => s.length),
      this.dataSection.length,
    ]
  }
  buffer() {
    return Buffer.concat([
      ...this.typeSections.map((ts) => ts.buffer()),
      ...this.codeSections,
      this.dataSection,
    ])
  }
}

export class EOFContainer {
  header: EofHeader
  body: EOFBody
  static validate(container: EOFContainer): EOFContainer {
    const sizes = container.header.sectionSizes()
    for (const [idx, size] of sizes.entries()) {
      if (size !== container.body.sectionSizes()[idx]) {
        throw new Error(
          `Size: ${
            container.body.sectionSizes()[idx]
          } of section ${idx} does not match expected size: ${size}`
        )
      }
    }
    return container
  }
  static fromBytes(bytes: Buffer): EOFContainer {
    const header = EofHeader.fromBytes(bytes)
    const _body = bytes.subarray(header.buffer().length)
    const body = EOFBody.fromBytes(header, _body)
    return EOFContainer.validate(new EOFContainer(header, body))
  }
  constructor(header: EofHeader, body: EOFBody) {
    this.header = header
    this.body = body
  }
  buffer() {
    return Buffer.concat([this.header.buffer(), this.body.buffer()])
  }
}
