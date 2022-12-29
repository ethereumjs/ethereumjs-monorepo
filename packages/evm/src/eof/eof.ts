import { handlers, opcodes as opcodeInfo } from '../opcodes'

import { FORMAT, KIND_CODE, KIND_DATA, KIND_TYPE, MAGIC, TERMINATOR } from './constants'
import { EOFContainer } from './eofContainer'

/**
 * Checks if the `code` is of EOF format
 * @param code Code to check
 * @returns
 */
const isEOFCode = (code: Buffer): boolean => {
  return code.slice(0, 2).equals(MAGIC)
}

/**
 * Returns the EOF version number
 * Note: should only be called if the code is EOF code
 * Note: if `0` is returned, this is EOF0, so legacy code
 * @param code Code to check
 */
const getEOFVersion = (code: Buffer): number => {
  if (!isEOFCode(code)) {
    return 0
  }
  return _getEOFVersion(code)
}

// Internal version of the get EOF version logic
function _getEOFVersion(code: Buffer) {
  return code[2]
}

function getEOFCode(code: Buffer): Buffer {
  if (!isEOFCode(code)) {
    return code
  }
  const numCodeSections = code.readUint16BE(7)
  const dataMarkerPosition = 9 + 2 * numCodeSections
  const dataSize = code.readUint16BE(dataMarkerPosition + 1)
  const codeEnd = code.length - dataSize

  // Add 4: data marker (1 byte), data size (2 bytes), terminator (1 byte)
  const eofBodyStart = dataMarkerPosition + 4
  // Add the type section size to find the code start section
  const codeStart = eofBodyStart + 4 * numCodeSections
  return code.slice(codeStart, codeEnd)
}

/**
 * This method checks if `code` is valid EOF code
 * Note: if the code is a legacy contract, this returns true
 * This method should only be called if EIP 3540 (EOF v1) is activated
 * TODO change this to throw if the code is invalid so we can provide reasons to why it actually fails (handy for debugging, also in practice)
 * @param code Code to check
 */
function validateCode(code: Buffer): EOFContainer | null {
  try {
    const container = new EOFContainer(code)
    if (!checkOpcodes(container)) {
      throw new Error('opcode error') // todo move errors into checkopcodes
    }
    return container
  } catch (e) {
    return null
  }
}

function checkOpcodes(container: EOFContainer) {
  // EIP-3670 - validate all opcodes
  const opcodes = new Set(handlers.keys())
  opcodes.add(0xfe) // Add INVALID opcode to set
  opcodes.delete(0x56) // Delete JUMP opcode from set (See EIP 4750)
  opcodes.delete(0x57) // Delete JUMPI opcode from set (See EIP 4750)
  opcodes.delete(0x58) // Delete PC opcode from set (See EIP 4750)
  opcodes.delete(0xff) // Delete SELFDESTRUCT opcode from set (See EIP 3670)
  opcodes.delete(0xf2) // Delete CALLCODE opcode from set (See EIP 3670)

  let currentSection = -1

  for (const code of container.body.codeSections) {
    currentSection++
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
        for (let immediate = pos; immediate < finalPos; immediate++) {
          immediates.add(immediate)
        }
        pos = finalPos
        if (pos > code.length - 1) {
          // Push blocks must not exceed end of code section
          return false
        }
      }
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
      } else if (opcode === 0xb0) {
        // CALLF
        immediates.add(pos)
        immediates.add(pos + 1)
        const codeTarget = code.readInt16BE(pos)
        if (codeTarget >= container.header.codeSizes.length) {
          // tries to call a function which is undefined
          return false
        }
        pos += 2
      }
    }
    const terminatingOpcodes = new Set([0x00, 0xb1, 0xf3, 0xfd, 0xfe, 0xff])
    // Per EIP-3670, the final opcode of a code section must be STOP, RETURN, REVERT, INVALID, or SELFDESTRUCT
    if (!terminatingOpcodes.has(code[code.length - 1])) {
      return false
    }
    // verify if any of the RJUMP* opcodes JUMPs into an immediate value
    for (const rjumpdest of rjumpdests) {
      if (immediates.has(rjumpdest)) {
        return false
      }
    }

    // EIP 5450 stack verification
    const worklist = [0]
    const visitedSet = new Set()
    const stackHeight = [container.body.typeSections[currentSection].inputs]

    let maxHeight = 0

    while (worklist.length !== 0) {
      const pc = worklist.shift()!
      visitedSet.add(pc)
      const opcode = code[pc]
      const currentStackHeight = stackHeight[pc]
      if (terminatingOpcodes.has(opcode)) {
        if (
          opcode === 0xb1 &&
          currentStackHeight !== container.body.typeSections[currentSection].outputs
        ) {
          // RETF stack height is invalid
          return false
        }
        continue
      }
      const info = opcodeInfo[opcode]
      const nextStackHeight = currentStackHeight + info.pushes! - info.pops!

      if (nextStackHeight > 1024) {
        // stack overflow
        return false
      }
      maxHeight = Math.max(maxHeight, nextStackHeight)
      if (maxHeight > 1023) {
        return false
      }

      const nextPcs = []
      if (opcode >= 0x60 && opcode <= 0x7f) {
        // PUSH
        nextPcs.push(pc + 1 + opcode - 0x5f)
        for (let i = 1; i <= opcode - 0x5f; i++) {
          visitedSet.add(pc + 1)
        }
      } else if (opcode === 0x5c) {
        // RJUMP
        nextPcs.push(pc + 3 + code.readInt16BE(pc + 1))
        visitedSet.add(pc + 1)
        visitedSet.add(pc + 2)
      } else if (opcode === 0x5d) {
        // RJUMPI
        nextPcs.push(pc + 3)
        nextPcs.push(pc + 3 + code.readInt16BE(pc + 1))
        visitedSet.add(pc + 1)
        visitedSet.add(pc + 2)
      } else if (opcode === 0x5e) {
        // RJUMPV
        const items = code[pc + 1]
        visitedSet.add(pc + 1)
        const finalPos = pc + 2 + items * 2
        for (let i = 0; i < items; i++) {
          nextPcs.push(finalPos + code.readInt16BE(pc + 2 + i * 2))
          visitedSet.add(pc + 2 + i * 2)
          visitedSet.add(pc + 3 + i * 2)
        }
        nextPcs.push(finalPos)
      } else if (opcode === 0xb0) {
        const functionToCall = code.readUint16BE(pc + 1)
        if (currentStackHeight < container.body.typeSections[functionToCall].inputs) {
          // stack underflow on function call
          return false
        }
        visitedSet.add(pc + 1)
        visitedSet.add(pc + 2)
        // CALLF
        nextPcs.push(pc + 3)
      } else {
        nextPcs.push(pc + 1)
      }

      for (const nextPc of nextPcs) {
        if (stackHeight[nextPc] !== undefined) {
          if (stackHeight[nextPc] !== currentStackHeight) {
            return false
          }
        } else {
          stackHeight[nextPc] = currentStackHeight
          worklist.push(nextPc)
        }
      }
    }
    if (visitedSet.size !== code.length) {
      return false
    }
    if (maxHeight !== container.body.typeSections[currentSection].maxStackHeight) {
      return false
    }
  }

  return true
}

// Deprecate below opcodes (this is breaking, but we should remove those)

/**
 *
 * @param container A `Buffer` containing bytecode to be checked for EOF1 compliance
 * @returns an object containing the size of the code section and data sections for a valid
 * EOF1 container or else undefined if `container` is not valid EOF1 bytecode
 *
 * Note: See https://eips.ethereum.org/EIPS/eip-3540 for further details
 */

/* TODO figure out how to be backwards compatible (I do not think this is possible)
export const codeAnalysis = (container: Buffer) => {
  throw new Error('removed in PR 2453')
}

export const validOpcodes = (code: Buffer, common?: Common) => {
  throw new Error('removed in PR 2453')
}

export const getEOFCode = (code: Buffer) => {
  throw new Error('removed in PR 2453')
}*/

export const EOF = {
  FORMAT,
  MAGIC,
  KIND_CODE,
  KIND_DATA,
  KIND_TYPE,
  TERMINATOR,
  validateCode,
  getEOFCode,
  getEOFVersion,
  isEOFCode,
}
