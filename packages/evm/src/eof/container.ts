import {
  CODE_MIN,
  CODE_SIZE_MIN,
  CONTAINER_MAX,
  CONTAINER_MIN,
  CONTAINER_SIZE_MIN,
  FORMAT,
  INPUTS_MAX,
  KIND_CODE,
  KIND_CONTAINER,
  KIND_DATA,
  KIND_TYPE,
  MAGIC,
  MAX_STACK_HEIGHT,
  OUTPUTS_MAX,
  TERMINATOR,
  TYPE_DIVISOR,
  TYPE_MAX,
  TYPE_MIN,
  VERSION,
} from './constants.js'
import { EOFError, validationError } from './errors.js'
import { verifyCode } from './verify.js'

import type { EVM } from '../evm.js'

export enum EOFContainerMode {
  Default, // Default container validation
  Initmode, // Initmode container validation (for subcontainers pointed to by EOFCreate)
  TxInitmode, // Tx initmode container validation (for txs deploying EOF contracts)
}

class StreamReader {
  private data: Uint8Array
  private ptr: number
  constructor(stream: Uint8Array) {
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

  readUint(errorStr?: string) {
    if (this.ptr >= this.data.length) {
      validationError(EOFError.OutOfBounds, this.ptr, errorStr)
    }
    return this.data[this.ptr++]
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
    return new DataView(this.data.buffer).getUint16(ptr)
  }

  getPtr() {
    return this.ptr
  }

  // Get the remainder bytes of the current stream
  readRemainder() {
    return this.data.slice(this.ptr)
  }

  isAtEnd() {
    return this.ptr === this.data.length
  }
}

// TODO add initcode flags (isEOFContract)
// TODO validation: mark sections as either initcode or runtime code to validate

class EOFHeader {
  typeSize: number
  codeSizes: number[]
  containerSizes: number[]
  dataSize: number
  dataSizePtr: number // Used to edit the dataSize in RETURNCONTRACT
  buffer: Uint8Array

  private codeStartPos: number[]

  constructor(input: Uint8Array) {
    const stream = new StreamReader(input)
    stream.verifyUint(FORMAT, EOFError.FORMAT)
    stream.verifyUint(MAGIC, EOFError.MAGIC)
    stream.verifyUint(VERSION, EOFError.VERSION)
    if (input.length < 15) {
      throw new Error('err: container size less than minimum valid size')
    }
    stream.verifyUint(KIND_TYPE, EOFError.KIND_TYPE)
    const typeSize = stream.readUint16(EOFError.TypeSize)
    if (typeSize < TYPE_MIN) {
      validationError(EOFError.InvalidTypeSize, typeSize)
    }
    if (typeSize % TYPE_DIVISOR !== 0) {
      validationError(EOFError.InvalidTypeSize, typeSize)
    }
    if (typeSize > TYPE_MAX) {
      throw new Error(`err: number of code sections must not exceed 1024 (got ${typeSize})`)
    }
    stream.verifyUint(KIND_CODE, EOFError.KIND_CODE)
    const codeSize = stream.readUint16(EOFError.CodeSize)
    if (codeSize < CODE_MIN) {
      validationError(EOFError.MinCodeSections)
    }
    if (codeSize !== typeSize / TYPE_DIVISOR) {
      validationError(EOFError.TypeSections, typeSize / TYPE_DIVISOR, codeSize)
    }
    const codeSizes = []
    for (let i = 0; i < codeSize; i++) {
      const codeSectionSize = stream.readUint16(EOFError.CodeSection)
      if (codeSectionSize < CODE_SIZE_MIN) {
        validationError(EOFError.CodeSectionSize)
      }
      codeSizes.push(codeSectionSize)
    }

    // Check if there are container sections
    let nextSection = stream.readUint()
    const containerSizes: number[] = []
    if (nextSection === KIND_CONTAINER) {
      const containerSectionSize = stream.readUint16(EOFError.ContainerSize)

      if (containerSectionSize < CONTAINER_MIN) {
        validationError(EOFError.ContainerSectionSize)
      }
      if (containerSectionSize > CONTAINER_MAX) {
        validationError(EOFError.ContainerSectionSize)
      }

      for (let i = 0; i < containerSectionSize; i++) {
        const containerSize = stream.readUint16(EOFError.ContainerSection)

        if (containerSize < CONTAINER_SIZE_MIN) {
          validationError(EOFError.ContainerSectionMin)
        }

        containerSizes.push(containerSize)
      }

      nextSection = stream.readUint()
    }

    if (nextSection !== KIND_DATA) {
      validationError(EOFError.KIND_DATA)
    }

    this.dataSizePtr = stream.getPtr()

    const dataSize = stream.readUint16(EOFError.DataSize)

    stream.verifyUint(TERMINATOR, EOFError.TERMINATOR)

    this.typeSize = typeSize
    this.codeSizes = codeSizes
    this.containerSizes = containerSizes
    this.dataSize = dataSize
    this.buffer = input.slice(0, stream.getPtr())
    const relativeOffset = this.buffer.length + this.typeSize
    this.codeStartPos = [relativeOffset]
  }

  sections() {
    return [this.typeSize, this.codeSizes, this.containerSizes, this.dataSize]
  }
  sectionSizes() {
    return [1, this.codeSizes.length, this.containerSizes.length, 1]
  }

  // Returns the code position in the container for the requested section
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
  codeSections: Uint8Array[]
  containerSections: Uint8Array[]
  entireCode: Uint8Array
  dataSection: Uint8Array
  buffer: Uint8Array

  txCallData?: Uint8Array // Only available in TxInitmode

  constructor(
    buf: Uint8Array,
    header: EOFHeader,
    eofMode: EOFContainerMode = EOFContainerMode.Default
  ) {
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
        if (outputs !== 0x80) {
          validationError(EOFError.Code0Outputs)
        }
      }
      if (inputs > INPUTS_MAX) {
        validationError(EOFError.MaxInputs, i, inputs)
      }
      if (outputs > OUTPUTS_MAX) {
        validationError(EOFError.MaxOutputs, i, outputs)
      }
      if (maxStackHeight > MAX_STACK_HEIGHT) {
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

    const containers = []
    for (const [i, containerSize] of header.containerSizes.entries()) {
      try {
        const container = stream.readBytes(containerSize)
        containers.push(container)
      } catch {
        validationError(EOFError.ContainerSection, i)
      }
    }

    let dataSection: Uint8Array

    if (eofMode !== EOFContainerMode.Initmode) {
      dataSection = stream.readBytes(header.dataSize, EOFError.DataSection)

      if (eofMode === EOFContainerMode.Default) {
        if (!stream.isAtEnd()) {
          validationError(EOFError.DanglingBytes)
        }
      } else {
        // Tx init mode
        this.txCallData = stream.readRemainder()
      }
    } else {
      dataSection = stream.readRemainder()
    }

    this.typeSections = typeSections
    this.codeSections = codes
    this.containerSections = containers
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
  buffer: Uint8Array
  eofMode: EOFContainerMode

  constructor(buf: Uint8Array, eofMode: EOFContainerMode = EOFContainerMode.Default) {
    this.eofMode = eofMode
    this.header = new EOFHeader(buf)
    this.body = new EOFBody(buf.slice(this.header.buffer.length), this.header, eofMode)
    this.buffer = buf
  }
}

export function validateEOF(input: Uint8Array, evm: EVM) {
  const container = new EOFContainer(input)
  verifyCode(container, evm)
  // Recursively validate the containerSections
  for (const subContainer of container.body.containerSections) {
    validateEOF(subContainer, evm)
  }
  return container
}
