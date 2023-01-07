import { KIND_CODE, KIND_DATA, KIND_TYPE, MAGIC, TERMINATOR, VERSION } from './constants'
import { EOFError, validationError } from './errors'

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
      validationError(EOFError.OutOfBounds, this.ptr, errorStr)
    }
    const ptr = this.ptr
    this.ptr += amount
    return this.data.slice(ptr, end)
  }

  verifyBytes(expect: Buffer, errorStr?: string) {
    const buf = this.readBytes(expect.length, errorStr)
    if (!buf.equals(expect)) {
      validationError(EOFError.VerifyBytes, this.ptr - expect.length, errorStr)
    }
  }

  readUint(errorStr?: string) {
    if (this.ptr >= this.data.length) {
      validationError(EOFError.OutOfBounds, this.ptr, errorStr)
    }
    return this.data.readUint8(this.ptr++)
  }

  verifyUint(expect: number, errorStr?: string) {
    if (this.readUint() !== expect) {
      validationError(EOFError.VerifyUint, this.ptr - 1, errorStr)
    }
  }

  readUint16(errorStr?: string) {
    const end = this.ptr + 2
    if (end > this.data.length) {
      validationError(EOFError.OutOfBounds, this.ptr, errorStr)
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
    stream.verifyBytes(MAGIC, EOFError.MAGIC)
    stream.verifyUint(VERSION, EOFError.VERSION)
    stream.verifyUint(KIND_TYPE, EOFError.KIND_TYPE)
    const typeSize = stream.readUint16(EOFError.TypeSize)
    if (typeSize < 4) {
      validationError(EOFError.InvalidTypeSize, typeSize)
    }
    if (typeSize % 4 !== 0) {
      validationError(EOFError.InvalidTypeSize, typeSize)
    }
    stream.verifyUint(KIND_CODE, EOFError.KIND_CODE)
    const codeSize = stream.readUint16(EOFError.CodeSize)
    if (codeSize < 1) {
      validationError(EOFError.MinCodeSections)
    }
    if (codeSize > 1024) {
      validationError(EOFError.MaxCodeSections)
    }
    if (codeSize !== typeSize / 4) {
      validationError(EOFError.TypeSections)
    }
    const codeSizes = []
    for (let i = 0; i < codeSize; i++) {
      const codeSectionSize = stream.readUint16(EOFError.CodeSection)
      if (codeSectionSize === 0) {
        validationError(EOFError.CodeSectionSize)
      }
      codeSizes.push(codeSectionSize)
    }
    stream.verifyUint(KIND_DATA, EOFError.KIND_DATA)
    const dataSize = stream.readUint16(EOFError.DataSize)
    stream.verifyUint(TERMINATOR, EOFError.TERMINATOR)

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

export interface TypeSection {
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
      const inputs = stream.readUint(EOFError.Inputs)
      const outputs = stream.readUint(EOFError.Outputs)
      const maxStackHeight = stream.readUint16(EOFError.MaxStackHeight)
      if (i === 0) {
        if (inputs !== 0) {
          validationError(EOFError.Code0Inputs)
        }
        if (outputs !== 0) {
          validationError(EOFError.Code0Outputs)
        }
      }
      if (inputs > 0x7f) {
        validationError(EOFError.MaxInputs, i, inputs)
      }
      if (outputs > 0x7f) {
        validationError(EOFError.MaxOutputs, i, outputs)
      }
      if (maxStackHeight > 1023) {
        validationError(EOFError.MaxStackHeightLimit, i, maxStackHeight)
      }
      typeSections.push({
        inputs,
        outputs,
        maxStackHeight,
      })
    }
    const codeStartPtr = stream.getPtr()
    const codes = []
    for (const [i, codeSize] of header.codeSizes.entries()) {
      try {
        const code = stream.readBytes(codeSize)
        codes.push(code)
      } catch {
        validationError(EOFError.CodeSection, i)
      }
    }
    const entireCodeSection = buf.slice(codeStartPtr, stream.getPtr())
    const dataSection = stream.readBytes(header.dataSize, EOFError.DataSection)

    if (!stream.isAtEnd()) {
      validationError(EOFError.DanglingBytes)
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
