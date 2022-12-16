import { handlers } from './opcodes'

import type { Common } from '@ethereumjs/common'

export const FORMAT = 0xef
export const MAGIC = 0x00
export const VERSION = 0x01

/**
 *
 * @param container A `Buffer` containing bytecode to be checked for EOF1 compliance
 * @returns an object containing the size of the code section and data sections for a valid
 * EOF1 container or else undefined if `container` is not valid EOF1 bytecode
 *
 * Note: See https://eips.ethereum.org/EIPS/eip-3540 for further details
 */
export const codeAnalysis = (container: Buffer) => {
  const secCode = 0x01
  const secData = 0x02
  const secTerminator = 0x00
  let computedContainerSize = 0
  const sectionSizes = {
    code: 0,
    data: 0,
  }
  if (container[0] !== FORMAT || container[1] !== MAGIC || container[2] !== VERSION)
    // Bytecode does not contain EOF1 "magic" or version number in expected positions
    return

  if (
    // EOF1 bytecode must be more than 7 bytes long for EOF1 header plus code section (but no data section)
    container.length > 7 &&
    // EOF1 code section indicator
    container[3] === secCode &&
    // EOF1 header terminator
    container[6] === secTerminator
  ) {
    sectionSizes.code = (container[4] << 8) | container[5]
    // Calculate expected length of EOF1 container based on code section
    computedContainerSize = 7 + sectionSizes.code
    // EOF1 code section must be at least 1 byte long
    if (sectionSizes.code < 1) return
  } else if (
    // EOF1 container must be more than 10 bytes long if data section is included
    container.length > 10 &&
    // EOF1 code section indicator
    container[3] === secCode &&
    // EOF1 data section indicator
    container[6] === secData &&
    // EOF1 header terminator
    container[9] === secTerminator
  ) {
    sectionSizes.code = (container[4] << 8) | container[5]
    sectionSizes.data = (container[7] << 8) | container[8]
    // Calculate expected length of EOF1 container based on code and data sections
    computedContainerSize = 10 + sectionSizes.code + sectionSizes.data
    // Code & Data sizes cannot be 0
    if (sectionSizes.code < 1 || sectionSizes.data < 1) return
  }
  if (container.length !== computedContainerSize) {
    // Computed container length based on section details does not match length of actual bytecode
    return
  }
  return sectionSizes
}

export const validOpcodes = (code: Buffer, common?: Common) => {
  // EIP-3670 - validate all opcodes
  const opcodes = new Set(handlers.keys())
  opcodes.add(0xfe) // Add INVALID opcode to set

  const rjumpdests = new Set()
  const immediates = new Set()

  let pos = 0
  while (pos < code.length) {
    const opcode = code[pos]
    pos++
    if (!opcodes.has(opcode)) {
      // No invalid/undefined opcodes
      return false
    }
    if (opcode >= 0x60 && opcode <= 0x7f) {
      // Skip data block following PUSH* instruction
      const finalPos = pos + opcode - 0x5f
      if (common !== undefined && common.isActivatedEIP(4200)) {
        for (let immediate = pos; immediate < finalPos; immediate++) {
          immediates.add(immediate)
        }
      }
      pos = finalPos
      if (pos > code.length - 1) {
        // Push blocks must not exceed end of code section
        return false
      }
    }
    if (common !== undefined && common.isActivatedEIP(4200)) {
      // RJUMP* checks
      if (opcode === 0x5c || opcode === 0x5d) {
        // RJUMP + RJUMPI
        immediates.add(pos)
        immediates.add(pos + 1)
        if (pos + 2 > code.length - 1) {
          // RJUMP(I) relative offset is out of code bounds
          return false
        }
        // RJUMP/RJUMPI
        const target = code.readInt16BE(pos) + pos + 2
        rjumpdests.add(target)
        if (target > code.length - 1 || target < 0) {
          // JUMP is out of bounds
          return false
        }
        pos += 2
      } else if (opcode === 0x5e) {
        // RJUMPV
        const tableSize = code[pos]
        if (tableSize === 0) {
          // cannot have table size 0
          return false
        }
        const jumptableSize = tableSize * 2
        if (pos + jumptableSize + 1 > code.length - 1) {
          // JUMP table is not contained in the code
          return false
        }
        const finalPos = pos + 1 + jumptableSize
        for (let immediate = pos; immediate < finalPos; immediate++) {
          immediates.add(immediate)
        }
        // Move pos to the start of the jump table
        pos++
        for (let jumptablePosition = pos; jumptablePosition < finalPos; jumptablePosition += 2) {
          const target = code.readInt16BE(jumptablePosition) + finalPos
          rjumpdests.add(target)
          if (target > code.length - 1 || target < 0) {
            // Relative JUMP is outside code container
            return false
          }
        }
        pos = finalPos
      }
    }
  }
  const terminatingOpcodes = new Set([0x00, 0xf3, 0xfd, 0xfe, 0xff])
  // Per EIP-3670, the final opcode of a code section must be STOP, RETURN, REVERT, INVALID, or SELFDESTRUCT
  if (!terminatingOpcodes.has(code[code.length - 1])) {
    return false
  }
  if (common !== undefined && common.isActivatedEIP(4200)) {
    // verify if any of the RJUMP* opcodes JUMPs into an immediate value
    for (const rjumpdest of rjumpdests) {
      if (immediates.has(rjumpdest)) {
        return false
      }
    }
  }
  return true
}

export const getEOFCode = (code: Buffer) => {
  const sectionSizes = codeAnalysis(code)
  if (sectionSizes === undefined) {
    return code
  } else {
    const codeStart = sectionSizes.data > 0 ? 10 : 7
    return code.slice(codeStart, codeStart + sectionSizes.code)
  }
}

export const EOF = { FORMAT, MAGIC, VERSION, codeAnalysis, validOpcodes }
