import { KIND_CODE, KIND_DATA, KIND_TYPE, MAGIC, TERMINATOR, VERSION } from './constants'

const defaultStreamReadOutOfBoundsError = 'reading out of bounds'
class StreamReader {
  private data: Buffer
  private ptr: number
  constructor(stream: Buffer) {
    this.data = stream
    this.ptr = 0
  }

  readBytes(amount: number, errorStr?: string) {
    const end = this.ptr + amount
    if (end > this.data.length) {
      throw new Error(
        `pos: ${this.ptr}: trying to read out of bounds: ` + errorStr ??
          defaultStreamReadOutOfBoundsError
      )
    }
    const ptr = this.ptr
    this.ptr += amount
    return this.data.slice(ptr, end)
  }

  verifyBytes(expect: Buffer, errorStr?: string) {
    const buf = this.readBytes(expect.length, errorStr)
    if (!buf.equals(expect)) {
      throw new Error(
        `pos: ${this.ptr - expect.length}: ` + (errorStr ?? 'bytes do not match expected value')
      )
    }
  }

  readUint(errorStr?: string) {
    if (this.ptr >= this.data.length) {
      throw new Error(
        `pos: ${this.ptr}: trying read out of bounds: ` + errorStr ??
          defaultStreamReadOutOfBoundsError
      )
    }
    return this.data.readUint8(this.ptr++)
  }

  verifyUint(expect: number, errorStr?: string) {
    if (this.readUint() !== expect) {
      throw new Error(`pos: ${this.ptr - 1}: ` + (errorStr ?? 'uint do not match expected value'))
    }
  }

  readUint16(errorStr?: string) {
    const end = this.ptr + 2
    if (end > this.data.length) {
      throw new Error(
        `pos: ${this.ptr - 2}: trying to read out of bounds: ` + errorStr ??
          defaultStreamReadOutOfBoundsError
      )
    }
    const ptr = this.ptr
    this.ptr += 2
    return this.data.readUint16BE(ptr)
  }

  getPtr() {
    return this.ptr
  }

  isAtEnd() {
    return this.ptr === this.data.length
  }
}

class EOFHeader {
  typeSize: number
  codeSizes: number[]
  dataSize: number
  buffer: Buffer

  private codeStartPos: number[]

  constructor(buf: Buffer) {
    const stream = new StreamReader(buf)
    stream.verifyBytes(MAGIC, 'header should start with magic bytes')
    stream.verifyUint(VERSION, `version should be ${VERSION}`)
    stream.verifyUint(KIND_TYPE, `type section marker (${KIND_TYPE}) expected`)
    const typeSize = stream.readUint16('missing type size')
    if (typeSize < 4 || typeSize % 4 !== 0) {
      throw new Error(
        `invalid type size: should be at least 4 and should be a multiple of 4. got: ${typeSize}`
      )
    }
    stream.verifyUint(KIND_CODE, `code section marker (${KIND_CODE}) expected`)
    const codeSize = stream.readUint16('missing code size')
    if (codeSize < 1) {
      throw new Error('should at least have 1 code section')
    }
    if (codeSize !== typeSize / 4) {
      throw new Error('need to have a type section for each code section')
    }
    const codeSizes = []
    for (let i = 0; i < codeSize; i++) {
      codeSizes.push(stream.readUint16('expected a code section'))
    }
    stream.verifyUint(KIND_DATA, `data section marker (${KIND_DATA}) expected`)
    const dataSize = stream.readUint16('missing data size')
    stream.verifyUint(TERMINATOR, `${TERMINATOR} terminator expected`)

    this.typeSize = typeSize
    this.codeSizes = codeSizes
    this.dataSize = dataSize
    this.buffer = buf.slice(0, stream.getPtr())
    this.codeStartPos = [0]
  }

  sections() {
    return [this.typeSize, this.codeSizes, this.dataSize]
  }
  sectionSizes() {
    return [1, this.codeSizes.length, 1]
  }

  // Returns the code position in the code section
  // This is thus not relative to the entire container, but works on the runtime code itself
  getCodePosition(section: number) {
    if (this.codeStartPos[section]) {
      return this.codeStartPos[section]
    }
    const start = this.codeStartPos.length
    let offset = this.codeStartPos[start - 1]
    for (let i = start; i <= section; i++) {
      offset += this.codeSizes[i - 1]
      this.codeStartPos[i] = offset
    }
    return offset
  }
}

interface TypeSection {
  inputs: number
  outputs: number
  maxStackHeight: number
}

class EOFBody {
  typeSections: TypeSection[]
  codeSections: Buffer[]
  entireCode: Buffer
  dataSection: Buffer
  buffer: Buffer

  constructor(buf: Buffer, header: EOFHeader) {
    const stream = new StreamReader(buf)
    const typeSections: TypeSection[] = []
    for (let i = 0; i < header.typeSize / 4; i++) {
      const inputs = stream.readUint('type section body: expected input')
      const outputs = stream.readUint('type section body: expected output')
      const maxStackHeight = stream.readUint16('type section body: expected max stack height')
      if (i === 0) {
        if (inputs !== 0) {
          throw new Error('type section body: first code section should have 0 inputs')
        }
        if (outputs !== 0) {
          throw new Error('type section body: first code section should have 0 outputs')
        }
      }
      if (inputs > 0x7f) {
        throw new Error(
          `type section body: inputs of code section ${i} exceeds 127, the maximum (got ${inputs})`
        )
      }
      if (outputs > 0x7f) {
        throw new Error(
          `type section body: inputs of code section ${i} exceeds 127, the maximum (got ${inputs})`
        )
      }
      if (maxStackHeight > 1023) {
        throw new Error(
          `type section body: max stack height should be at most 1023, got ${maxStackHeight}`
        )
      }
      typeSections.push({
        inputs,
        outputs,
        maxStackHeight,
      })
    }
    const codeStartPtr = stream.getPtr()
    const codes = []
    for (const codeSize of header.codeSizes) {
      const code = stream.readBytes(codeSize, 'code section body: expected code')
      codes.push(code)
    }
    const entireCodeSection = buf.slice(codeStartPtr, stream.getPtr())
    const dataSection = stream.readBytes(header.dataSize, 'data section body expected')

    if (!stream.isAtEnd()) {
      throw new Error('got dangling bytes in body')
    }

    this.typeSections = typeSections
    this.codeSections = codes
    this.entireCode = entireCodeSection
    this.dataSection = dataSection
    this.buffer = buf
  }
  sections() {
    return [this.typeSections, this.codeSections, this.dataSection]
  }
  size() {
    return {
      typeSize: this.typeSections.length,
      codeSize: this.codeSections.length,
      dataSize: this.dataSection.length,
    }
  }
  sectionSizes() {
    return [
      this.typeSections.map(() => 4),
      this.codeSections.map((b) => b.length),
      this.dataSection.length,
    ]
  }
}

export class EOFContainer {
  header: EOFHeader
  body: EOFBody
  buffer: Buffer

  constructor(buf: Buffer) {
    this.header = new EOFHeader(buf)
    this.body = new EOFBody(buf.slice(this.header.buffer.length), this.header)
    this.buffer = buf
  }
  // this.body.codeSections is a list of code section buffers.
  // this.getEOFCode returns one buffer for all code sections
  getEOFCode() {
    return Buffer.concat(this.body.codeSections)
  }
}
