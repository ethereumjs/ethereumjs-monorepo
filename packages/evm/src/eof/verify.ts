import { EOFError, validationError } from './errors.js'
import { stackDelta } from './stackDelta.js'

import type { EVM } from '../evm.js'
import type { EOFContainer } from './container.js'

export function verifyCode(container: EOFContainer, evm: EVM) {
  validateOpcodes(container, evm)
  validateStack(container, evm)
}

function readInt16(code: Uint8Array, start: number) {
  return new DataView(code.buffer).getInt16(start)
}

function readUint16(code: Uint8Array, start: number) {
  return new DataView(code.buffer).getUint16(start)
}

function validateOpcodes(container: EOFContainer, evm: EVM) {
  // Track the intermediate bytes
  const intermediateBytes = new Set<number>()
  // Track the jump locations (for forward jumps it is unknown at the first pass if the byte is intermediate)
  const jumpLocations = new Set<number>()

  function addJump(location: number) {
    if (intermediateBytes.has(location)) {
      validationError(EOFError.InvalidRJUMP)
    }
    jumpLocations.add(location)
  }

  function addIntermediate(location: number) {
    if (jumpLocations.has(location)) {
      validationError(EOFError.InvalidRJUMP)
    }
    intermediateBytes.add(location)
  }

  // TODO (?) -> stackDelta currently only has active EOF opcodes, can use it directly (?)
  // (so no need to generate the valid opcodeNumbers)

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
  // Add these opcodes here

  opcodeNumbers.delete(0x56) // JUMP
  opcodeNumbers.delete(0x57) // JUMPI

  opcodeNumbers.delete(0x58) // PC

  opcodeNumbers.delete(0xf0) // CREATE
  opcodeNumbers.delete(0xf5) // CREATE2

  // Note: this name might be misleading since this is the list of opcodes which are OK as final opcodes in a code section
  // TODO if using stackDelta for EOF it is possible to add a "termination" boolean for the opcode to mark it as terminating
  // (so no need to generate this set here)
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

  const validJumps = new Set<number>()

  // Add all reachable code sections to
  const reachableSections: { [key: number]: Set<number> } = {}

  let codeSection = -1
  for (const code of container.body.codeSections) {
    codeSection++

    reachableSections[codeSection] = new Set()

    const returningFunction = container.body.typeSections[codeSection].outputs === 0x80

    // Tracking set of reachable opcodes
    const reachableOpcodes = new Set<number>()
    reachableOpcodes.add(0)

    // Validate that each opcode is defined
    let ptr = 0
    let lastOpcode: number = 0 // Note: code sections cannot be empty, so this number will always be set

    let currentStackHeight = container.body.typeSections[codeSection].inputs
    let maxStackHeight = currentStackHeight

    while (ptr < code.length) {
      if (!reachableOpcodes.has(ptr)) {
        validationError(EOFError.UnreachableCode)
      }
      validJumps.add(ptr)
      const opcode = code[ptr]

      currentStackHeight += stackDelta[opcode].outputs - stackDelta[opcode].inputs

      if (currentStackHeight < 0) {
        validationError(EOFError.StackUnderflow)
      }

      if (returningFunction && opcode === 0xe4) {
        validationError(EOFError.InvalidReturningSection)
      }

      lastOpcode = opcode
      if (!opcodeNumbers.has(opcode)) {
        validationError(EOFError.InvalidOpcode)
      }

      if (opcode === 0xe0 || opcode === 0xe1) {
        // RJUMP / RJUMPI
        const target = readInt16(code, ptr + 1) + ptr + 3
        if (target < 0 || target >= code.length) {
          validationError(EOFError.InvalidRJUMP)
        }
        addJump(target)
        reachableOpcodes.add(target)

        if (opcode === 0xe0) {
          // For RJUMP check that the instruction after RJUMP is reachable
          // If this is not the case, then it is not yet targeted by a forward jump
          // And hence violates the spec
          if (!reachableOpcodes.has(ptr + 3)) {
            validationError(EOFError.UnreachableCode)
          }
        }
      } else if (opcode === 0xe2) {
        // RJUMPV
        const tableSize = code[ptr + 1] + 1

        if (tableSize === undefined) {
          validationError(EOFError.OpcodeIntermediatesOOB)
        } else if (tableSize === 0) {
          validationError(EOFError.RJUMPVTableSize0)
        }

        if (ptr + tableSize * 2 + 2 >= code.length) {
          // Fall-through case
          validationError(EOFError.OpcodeIntermediatesOOB)
        }

        const newPc = ptr + 2 + tableSize * 2

        for (let i = 0; i < tableSize; i++) {
          const newPtr = ptr + 2 + i * 2
          // Add the table bytes to intermediates
          addIntermediate(newPtr)
          addIntermediate(newPtr + 1)
          const target = readInt16(code, newPtr) + newPc
          if (target < 0 || target >= code.length) {
            validationError(EOFError.OpcodeIntermediatesOOB)
          }
          addJump(target)
          reachableOpcodes.add(target)
        }

        // Special case for RJUMPV: move ptr over the table (the immediate starting byte will be added later)
        ptr += 2 * tableSize
      } else if (opcode === 0xe3 || opcode === 0xe5) {
        // CALLF / JUMPF
        const target = readUint16(code, ptr + 1)
        reachableSections[codeSection].add(target)
        if (target >= container.header.codeSizes.length) {
          validationError(EOFError.InvalidCallTarget)
        }
        if (opcode === 0xe3) {
          if (container.body.typeSections[target].outputs === 0x80) {
            // CALLF points to non-returning function which is not allowed
            validationError(EOFError.InvalidCALLFReturning)
          }
          currentStackHeight +=
            container.body.typeSections[target].outputs - container.body.typeSections[target].inputs
        } else {
          // JUMPF
          const currentOutputs = container.body.typeSections[codeSection].outputs
          const targetOutputs = container.body.typeSections[target].outputs

          if (targetOutputs > currentOutputs && !(targetOutputs === 0x80)) {
            validationError(EOFError.InvalidJUMPF)
          }

          if (returningFunction && targetOutputs <= 0x7f) {
            validationError(EOFError.InvalidReturningSection)
          }
        }
      } else if (opcode === 0xec) {
        // EOFCREATE
      } else if (opcode === 0xee) {
        // RETURNCONTRACT
      } else if (opcode === 0xd1) {
        // DATALOADN
        const dataTarget = readUint16(code, ptr + 1)
        const endOfSlice = dataTarget + 32
        if (container.header.dataSize < endOfSlice) {
          validationError(EOFError.DataLoadNOutOfBounds)
        }
      }

      // Move ptr forward over any intermediates (if any)
      // Note: for EOF this stackDelta is guaranteed to exist
      const intermediates = stackDelta[opcode].intermediates
      if (intermediates > 0) {
        for (let i = 1; i <= intermediates; i++) {
          addIntermediate(ptr + i)
        }
        ptr += intermediates // If the opcode has any intermediates, jump over it
      }
      if (ptr >= code.length) {
        validationError(EOFError.OpcodeIntermediatesOOB)
      }
      ptr++ // Move to next opcode
      if (stackDelta[opcode].terminating === undefined) {
        // If the opcode is not terminating we can add the next opcode to the reachable opcodes
        // It can be reached by sequential instruction flow
        reachableOpcodes.add(ptr)
      }
      maxStackHeight = Math.max(currentStackHeight, maxStackHeight)
    }

    // Validate that the final opcode terminates
    if (!terminatingOpcodes.has(lastOpcode)) {
      validationError(EOFError.InvalidTerminator)
    }

    if (container.body.typeSections[codeSection].maxStackHeight !== maxStackHeight) {
      validationError(EOFError.MaxStackHeightViolation)
    }
    if (maxStackHeight > 1023) {
      validationError(EOFError.MaxStackHeightLimit)
    }
  }

  // Verify that each code section can be reached from code section 0
  const sectionAccumulator = new Set<number>()
  sectionAccumulator.add(0) // 0 is always reachable
  const toCheck = [0]

  while (toCheck.length > 0) {
    const checkArray = reachableSections[toCheck.pop()!]
    for (const checkSection of checkArray) {
      if (!sectionAccumulator.has(checkSection)) {
        // Only check the reachable section if
        sectionAccumulator.add(checkSection)
        toCheck.push(checkSection)
      }
    }
  }

  if (sectionAccumulator.size !== container.header.codeSizes.length) {
    validationError(EOFError.UnreachableCodeSections)
  }
}

function validateStack(_container: EOFContainer, _evm: EVM) {
  // TODO
}
