import { bytesToBigInt } from '@ethereumjs/util'

import { ERROR } from './exceptions.js'

import type { EVM } from './evm.js'

export const FORMAT = 0xef
export const MAGIC = 0x00
export const VERSION = 0x01

const MIN_HEADER_SIZE = 15

const KIND_TYPE = 0x01
const KIND_CODE = 0x02
const KIND_CONTAINER = 0x03
const KIND_DATA = 0x04
const TERMINATOR = 0x00

const TYPE_MIN = 0x0004
const TYPE_MAX = 0x1000
const TYPE_DIVISOR = 4

const CODE_MIN = 0x0001
const CODE_MAX = 0x0400

const CODE_SIZE_MIN = 1

const CONTAINER_MIN = 0x0001
const CONTAINER_MAX = 0x00ff

const CONTAINER_SIZE_MIN = 1

const INPUTS_MAX = 0x7f
const OUTPUTS_MAX = 0x80
const MAX_STACK_HEIGHT = 0x03ff

function safeSlice(bytes: Uint8Array, start: number, end: number) {
  const sliced = bytes.slice(start, end)
  if (sliced.length !== end - start) {
    throw new Error('Slice out of bounds')
  }
  return sliced
}

export const validateEOF = (container: Uint8Array, evm: EVM) => {
  const common = evm.common
  if (common.isActivatedEIP(3540)) {
    if (container[0] === FORMAT) {
      if (container[1] !== MAGIC) {
        throw new Error(ERROR.INVALID_EOF_MAGIC)
      } else if (container[2] !== VERSION) {
        throw new Error(ERROR.INVALID_EOF_VERSION)
      }
      if (container.length < MIN_HEADER_SIZE) {
        throw new Error(ERROR.INVALID_HEADER_SIZE)
      }
      // Valid EOF container FORMAT + MAGIC + VERSION
      if (container[3] !== KIND_TYPE) {
        throw new Error(ERROR.INVALID_KIND_TYPE)
      }
      // Note: type_count is the amount of bytes in the type section, so the actual
      // "amount" of type sections is `type_count / 4`
      const type_count = Number(bytesToBigInt(safeSlice(container, 4, 6)))
      if (type_count < TYPE_MIN || type_count > TYPE_MAX || type_count % TYPE_DIVISOR !== 0) {
        throw new Error(ERROR.INVALID_TYPE_COUNT)
      }
      if (container[6] !== KIND_CODE) {
        throw new Error(ERROR.INVALID_TYPE_COUNT)
      }
      const code_count = Number(bytesToBigInt(safeSlice(container, 7, 9)))
      if (code_count < CODE_MIN || code_count > CODE_MAX) {
        throw new Error(ERROR.INVALID_CODE_COUNT)
      }
      if (code_count !== type_count / 4) {
        throw new Error(ERROR.INVALID_CODE_COUNT_TYPES)
      }

      // Track the header position to slice.
      let slicePtr = 9

      const codeSectionsLength: number[] = []
      const containerSectionsLength: number[] = []

      for (let codeSection = 0; codeSection < code_count; codeSection++) {
        const codeLength = Number(bytesToBigInt(safeSlice(container, slicePtr, (slicePtr += 2))))
        codeSectionsLength.push(codeLength)
        if (codeLength < CODE_SIZE_MIN) {
          throw new Error(ERROR.INVALID_CODE_SIZE)
        }
      }

      const finalSlice = container[slicePtr]
      let containerSections = 0

      if (finalSlice === KIND_CONTAINER) {
        // There is an optional container section
        // This block updates slicePtr such that at the end of this block, the slicePtr points to the current
        // part of the header which we should validate (i.e. it must be the terminator byte)
        slicePtr++
        containerSections = Number(bytesToBigInt(safeSlice(container, slicePtr, (slicePtr += 2))))

        if (containerSections < CONTAINER_MIN || code_count > CONTAINER_MAX) {
          throw new Error(ERROR.INVALID_CODE_COUNT)
        }

        for (let containerSections = 0; containerSections < code_count; containerSections++) {
          const containerLength = Number(
            bytesToBigInt(safeSlice(container, slicePtr, (slicePtr += 2)))
          )
          codeSectionsLength.push(containerLength)
          if (containerLength < CONTAINER_SIZE_MIN) {
            throw new Error(ERROR.INVALID_CONTAINER_SIZE)
          }
        }
      }

      if (container[slicePtr] !== KIND_DATA) {
        throw new Error(ERROR.INVALID_KIND_DATA)
      }

      slicePtr++
      const dataSize = Number(bytesToBigInt(safeSlice(container, slicePtr, (slicePtr += 2))))

      if (container[slicePtr] !== TERMINATOR) {
        throw new Error(ERROR.INVALID_TERMINATOR_BYTE)
      }

      slicePtr++

      // Remainder the container slice is the body
      const body = container.slice(slicePtr)

      // Reset the slice ptr to validate the body
      slicePtr = 0

      const typesSection = safeSlice(body, slicePtr, (slicePtr += type_count))
      const types: {
        inputs: number
        outputs: number
        maxStackHeight: number
      }[] = []

      for (let i = 0; i < type_count / 4; i++) {
        const type = safeSlice(typesSection, i * 4, i * 4 + 4)
        const inputs = type[0]
        const outputs = type[1]
        const maxStackHeight = Number(bytesToBigInt(type.slice(3, 5)))

        if (inputs > INPUTS_MAX) {
          throw new Error(ERROR.INVALID_EOF_INPUTS)
        }
        if (outputs > OUTPUTS_MAX) {
          throw new Error(ERROR.INVALID_EOF_OUTPUTS)
        }
        if (maxStackHeight > MAX_STACK_HEIGHT) {
          throw new Error(ERROR.INVALID_EOF_MAX_STACK_HEIGHT)
        }

        if (i === 0) {
          if (inputs !== 0 || outputs !== 0x80) {
            throw new Error(ERROR.INVALID_EOF_FIRST_CODE_SECTION_TYPE)
          }
        }

        types.push({
          inputs,
          outputs,
          maxStackHeight,
        })
      }

      const codes: Uint8Array[] = []
      for (let i = 0; i < code_count; i++) {
        codes.push(safeSlice(body, slicePtr, (slicePtr += codeSectionsLength[i])))
      }
      // Validate each code section
      const opcodes = evm.getActiveOpcodes()

      const opcodeNumbers = new Set<number>()

      for (const [key] of opcodes) {
        opcodeNumbers.add(key)
      }

      // Add INVALID as valid
      opcodeNumbers.add(0xfe)

      // Remove CODESIZE, CODECOPY, EXTCODESIZE, EXTCODECOPY, EXTCODEHASH, GAS
      opcodeNumbers.delete(0x38)
      opcodeNumbers.delete(0x39)
      opcodeNumbers.delete(0x5a)
      opcodeNumbers.delete(0x3b)
      opcodeNumbers.delete(0x3c)
      opcodeNumbers.delete(0x3f)

      // Remove CALLCODE and SELFDESTRUCT
      opcodeNumbers.delete(0xf2)
      opcodeNumbers.delete(0xff)

      // TODO omnibus https://github.com/ipsilon/eof/blob/main/spec/eof.md states
      // JUMP / JUMPI / PC / CREATE / CREATE2 also banned
      // This is not in the EIPs yet

      // Note: this name might be misleading since this is the list of opcodes which are OK as final opcodes in a code section
      const terminatingOpcodes = new Set<number>()

      terminatingOpcodes.add(0x00) // STOP
      terminatingOpcodes.add(0xf3) // RETURN
      terminatingOpcodes.add(0xfd) // REVERT
      terminatingOpcodes.add(0xfe) // INVALID

      terminatingOpcodes.add(0xee) // RETURNCONTRACT

      terminatingOpcodes.add(0xe4) // RETF
      terminatingOpcodes.add(0xe5) // JUMPF

      terminatingOpcodes.add(0xe0) // RJUMPing back into code section is OK

      for (const opcode of terminatingOpcodes) {
        if (!opcodeNumbers.has(opcode)) {
          terminatingOpcodes.delete(opcode)
        }
      }

      for (const code of codes) {
        // Validate that each opcode is defined
        let ptr = 0
        let lastOpcode: number = 0 // Note: code sections cannot be empty, so this number will always be set
        while (ptr < code.length) {
          const opcode = code[ptr]
          lastOpcode = opcode
          if (!opcodeNumbers.has(opcode)) {
            throw new Error(ERROR.INVALID_EOF_CODE_OPCODE_UNDEFINED)
          }
          if (opcode >= 0x60 && opcode <= 0x7f) {
            // PUSH opcodes
            ptr += opcode - 0x5f
          }
          ptr++
        }

        // Validate that the final opcode terminates
        if (!terminatingOpcodes.has(lastOpcode)) {
          throw new Error(ERROR.INVALID_EOF_FINAL_SECTION_OPCODE)
        }
      }

      const containers: Uint8Array[] = []

      if (containerSections > 0) {
        for (let i = 0; i < containerSections; i++) {
          containers.push(safeSlice(body, slicePtr, (slicePtr += containerSectionsLength[i])))
        }

        // Recursively validate the containers
        for (const container of containers) {
          validateEOF(container, evm)
        }
      }

      // Data section validation?

      const dataSection = body.slice(slicePtr)

      if (dataSection.length > dataSize) {
        throw new Error(ERROR.INVALID_EOF_DATA_SECTION_SIZE)
      }
    } else {
      // Legacy code
    }
  }
}

export const EOF = { FORMAT, MAGIC, VERSION, validateEOF }
