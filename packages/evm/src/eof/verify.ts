import { EOFError, validationError } from './errors.js'
import { stackDelta } from './stackDelta.js'

import type { EVM } from '../evm.js'
import type { EOFContainer } from './container.js'

/**
 * Note for reviewers regarding these flags: these only reside inside `verify.ts` (this file)
 * and `container.ts`. For `container.ts`, the only behavior which ever changes is in the `DeploymentCode` mode
 * This `DeploymentCode` mode means that the subcontainer is flagged in such way that this container is launched
 * in a "deployment" mode. This means, that the data section of the body is actually allowed to contain
 * less data than is written in the header. However, once the target container (by the container in deployment)
 * mode is returned by RETURNCONTRACT it should have at least the header amount of data.
 * See also "data section lifecycle"
 * Note: the subcontainers of a container can be marked "InitCode" or "DeploymentCode".
 * InitCode cannot contain the instructions RETURN / STOP
 * InitCode is the only container type which can contain RETURNCONTRACT
 * A container can also be marked DeploymentCode, this is a subcontainer targeted by RETURNCONTRACT
 * A container cannot be marked both InitCode and DeploymentCode
 * This flag is thus to distinguish between subcontainers, and also thus also allows for data section sizes
 * lower than the size in the header in case of `InitCode`
 */
export enum ContainerSectionType {
  InitCode, // Targeted by EOFCreate
  DeploymentCode, // Targeted by RETURNCONTRACT
  RuntimeCode, // "Default" runtime code
}

/**
 * This method validates an EOF container deeply. It will validate the opcodes, validate the stack, and performs
 * various checks such as checking for forbidden opcodes in certain modes, jumps to invalid places, etc.
 * For more information, see "Code validation" of https://github.com/ipsilon/eof/blob/main/spec/eof.md
 * This is a compilation of all the extra validation rules introduced by the various EIPs
 * In particular, the stack validation EIP https://eips.ethereum.org/EIPS/eip-5450 is a big part here
 * @param container EOFContainer to verify
 * @param evm The EVM to run in (pulls opcodes from here)
 * @param mode The validation mode to run in
 * @returns Returns a Map which marks what ContainerSectionType each container is
 * NOTE: this should likely not be a map, since a container section can only be of a single type, not multiple
 */
export function verifyCode(
  container: EOFContainer,
  evm: EVM,
  mode: ContainerSectionType = ContainerSectionType.RuntimeCode,
) {
  return validateOpcodes(container, evm, mode)
}

// Helper methods to read Int16s / Uint16s
function readInt16(code: Uint8Array, start: number) {
  return new DataView(code.buffer).getInt16(start)
}

function readUint16(code: Uint8Array, start: number) {
  return new DataView(code.buffer).getUint16(start)
}

function validateOpcodes(
  container: EOFContainer,
  evm: EVM,
  mode: ContainerSectionType = ContainerSectionType.RuntimeCode,
) {
  // Track the intermediate bytes
  const intermediateBytes = new Set<number>()
  // Track the jump locations (for forward jumps it is unknown at the first pass if the byte is intermediate)
  const jumpLocations = new Set<number>()

  // Track the type of the container targets
  // Should at the end of the analysis have all the containers
  const containerTypeMap = new Map<number, ContainerSectionType>()

  function addJump(location: number) {
    if (intermediateBytes.has(location)) {
      // When trying to JUMP into an intermediate byte: this is invalid
      validationError(EOFError.InvalidRJUMP)
    }
    jumpLocations.add(location)
  }

  function addIntermediate(location: number) {
    if (jumpLocations.has(location)) {
      // When trying to add an intermediate to a location already JUMPed to: this is invalid
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

  // Add all reachable code sections
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

    // Implement the EIP 5450 stack validation algorithm
    const inputs = container.body.typeSections[codeSection].inputs
    let maxStackHeight = inputs
    // These arrays track the min/max stack height **before** executing the instruction
    const stackHeightMin: number[] = [inputs]
    const stackHeightMax: number[] = [inputs]

    // This loop will loop over the entire code section and will validate various rules
    // For (most) validation rules, see https://github.com/ipsilon/eof/blob/main/spec/eof.md
    // For all validation rules per opcode, find the corresponding EIP, the rules are there
    while (ptr < code.length) {
      // This set tracks the successor opcodes of this opcode (for stack purposes)
      const successorSet = new Set<number>()

      // ReachableOpcodes: this can likely be deleted after implementing the 5450 algorithm
      if (!reachableOpcodes.has(ptr)) {
        validationError(EOFError.UnreachableCode)
      }

      if (stackHeightMin[ptr] === undefined || stackHeightMax[ptr] === undefined) {
        // This error either means that the code is unreachable,
        // or it is possible that it is only reachable via a backwards jump
        validationError(EOFError.UnreachableCode)
      }

      validJumps.add(ptr)
      const opcode = code[ptr]

      const minStackCurrent = stackHeightMin[ptr]
      const maxStackCurrent = stackHeightMax[ptr]

      const opcodeInputs = stackDelta[opcode].inputs
      const opcodeOutputs = stackDelta[opcode].outputs

      if (minStackCurrent - opcodeInputs < 0) {
        validationError(EOFError.StackUnderflow)
      }

      const delta = opcodeOutputs - opcodeInputs

      let minStackNext = minStackCurrent + delta
      let maxStackNext = maxStackCurrent + delta

      if (maxStackNext > 1023) {
        // TODO verify if 1023 or 1024 is the right constant
        validationError(EOFError.StackOverflow)
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

        successorSet.add(target)

        addJump(target)
        reachableOpcodes.add(target)

        if (opcode === 0xe0) {
          // For RJUMP check that the instruction after RJUMP is reachable
          // If this is not the case, then it is not yet targeted by a forward jump
          // And hence violates the spec
          if (!reachableOpcodes.has(ptr + 3) && ptr + 3 < code.length) {
            // Note: the final condition above ensures that the bytes after ptr are there
            // This is an edge case, if the container ends with RJUMP (which is valid)
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

          successorSet.add(target)

          addJump(target)
          reachableOpcodes.add(target)
        }

        // Special case for RJUMPV: move ptr over the table (the immediate starting byte will be added later)
        // In this special case, add the immediate starting byte
        addIntermediate(ptr + 1)
        ptr += 2 * tableSize + 1
      } else if (opcode === 0xe3 || opcode === 0xe5) {
        // CALLF / JUMPF
        const target = readUint16(code, ptr + 1)
        reachableSections[codeSection].add(target)
        if (target >= container.header.codeSizes.length) {
          validationError(EOFError.InvalidCallTarget)
        }
        if (opcode === 0xe3) {
          // CALLF
          const targetOutputs = container.body.typeSections[target].outputs
          const targetInputs = container.body.typeSections[target].inputs
          if (targetOutputs === 0x80) {
            // CALLF points to non-returning function which is not allowed
            validationError(EOFError.InvalidCALLFReturning)
          }

          if (minStackCurrent < targetInputs) {
            validationError(EOFError.StackUnderflow)
          }

          if (
            maxStackCurrent + container.body.typeSections[target].maxStackHeight - targetInputs >
            1024
          ) {
            validationError(EOFError.StackOverflow)
          }

          minStackNext += targetOutputs - targetInputs
          maxStackNext += targetOutputs - targetInputs
        } else {
          // JUMPF
          const currentOutputs = container.body.typeSections[codeSection].outputs
          const targetOutputs = container.body.typeSections[target].outputs
          const targetInputs = container.body.typeSections[target].inputs
          const targetNonReturning = targetOutputs === 0x80

          if (targetOutputs > currentOutputs && !targetNonReturning) {
            // Spec rule:
            // JUMPF operand must point to a code section with equal or fewer number of outputs as
            // the section in which it resides, or to a section with 0x80 as outputs (non-returning)
            validationError(EOFError.InvalidJUMPF)
          }

          if (returningFunction && targetOutputs <= 0x7f) {
            // Current function is returning, but target is not, cannot jump into this
            validationError(EOFError.InvalidReturningSection)
          }

          if (targetNonReturning) {
            // Target is returning
            if (minStackCurrent < targetInputs) {
              validationError(EOFError.StackUnderflow)
            }
          } else {
            // Target is returning
            const expectedStack = currentOutputs + targetInputs - targetOutputs
            if (!(minStackCurrent === maxStackCurrent && maxStackCurrent === expectedStack)) {
              validationError(EOFError.InvalidStackHeight)
            }
          }
          if (
            maxStackCurrent + container.body.typeSections[target].maxStackHeight - targetInputs >
            1024
          ) {
            //console.log(maxStackCurrent, targetOutputs, targetInputs, targetNonReturning)
            validationError(EOFError.StackOverflow)
          }
        }
      } else if (opcode === 0xe4) {
        // RETF
        // Stack height must match the outputs of current code section
        const outputs = container.body.typeSections[codeSection].outputs
        if (!(minStackCurrent === maxStackCurrent && maxStackCurrent === outputs)) {
          validationError(EOFError.InvalidStackHeight)
        }
      } else if (opcode === 0xe6) {
        // DUPN
        const toDup = code[ptr + 1]
        if (toDup + 1 > minStackCurrent) {
          validationError(EOFError.StackUnderflow)
        }
      } else if (opcode === 0xe7) {
        // SWAPN
        const toSwap = code[ptr + 1]
        // TODO: EVMONEs test wants this to be `toSwap + 2`, but that seems to be incorrect
        // Will keep `toSwap + 1` for now
        if (toSwap + 1 > minStackCurrent) {
          validationError(EOFError.StackUnderflow)
        }
      } else if (opcode === 0xe8) {
        // EXCHANGE
        const exchangeRaw = code[ptr + 1]
        const n = (exchangeRaw >> 4) + 1
        const m = (exchangeRaw & 0x0f) + 1
        if (n + m + 1 > minStackCurrent) {
          validationError(EOFError.StackUnderflow)
        }
      } else if (opcode === 0xec) {
        // EOFCREATE
        const target = code[ptr + 1]
        if (target >= container.header.containerSizes.length) {
          validationError(EOFError.InvalidEOFCreateTarget)
        }
        if (containerTypeMap.has(target)) {
          if (containerTypeMap.get(target) !== ContainerSectionType.InitCode) {
            validationError(EOFError.ContainerDoubleType)
          }
        }
        containerTypeMap.set(target, ContainerSectionType.InitCode)
      } else if (opcode === 0xee) {
        // RETURNCONTRACT

        if (mode !== ContainerSectionType.InitCode) {
          validationError(EOFError.ContainerTypeError)
        }

        const target = code[ptr + 1]
        if (target >= container.header.containerSizes.length) {
          validationError(EOFError.InvalidRETURNContractTarget)
        }
        if (containerTypeMap.has(target)) {
          if (containerTypeMap.get(target) !== ContainerSectionType.DeploymentCode) {
            validationError(EOFError.ContainerDoubleType)
          }
        }
        containerTypeMap.set(target, ContainerSectionType.DeploymentCode)
      } else if (opcode === 0xd1) {
        // DATALOADN
        const dataTarget = readUint16(code, ptr + 1)
        const endOfSlice = dataTarget + 32
        if (container.header.dataSize < endOfSlice) {
          validationError(EOFError.DataLoadNOutOfBounds)
        }
      } else if (opcode === 0x00 || opcode === 0xf3) {
        // STOP / RETURN

        if (mode === ContainerSectionType.InitCode) {
          validationError(EOFError.ContainerTypeError)
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

        // Add next opcode to successorSet
        // NOTE: these are all opcodes except RJUMP
        if (opcode !== 0xe0) {
          successorSet.add(ptr)
        }
      }

      // TODO here validate stack / reachability and stack overflow check

      for (const successor of successorSet) {
        if (successor < ptr) {
          // Reached via backwards jump
          if (
            stackHeightMin[successor] !== minStackNext ||
            stackHeightMax[successor] !== maxStackNext
          ) {
            validationError(EOFError.UnstableStack)
          }
        }

        if (stackHeightMax[successor] === undefined) {
          // Target is seen for first time
          stackHeightMin[successor] = minStackNext
          stackHeightMax[successor] = maxStackNext
        } else {
          stackHeightMin[successor] = Math.min(stackHeightMin[successor], minStackNext)
          stackHeightMax[successor] = Math.max(stackHeightMax[successor], maxStackNext)
        }
      }

      maxStackHeight = Math.max(maxStackNext, maxStackHeight)
    }

    // Validate that the final opcode terminates
    if (!terminatingOpcodes.has(lastOpcode)) {
      validationError(EOFError.InvalidTerminator)
    }

    if (container.body.typeSections[codeSection].maxStackHeight !== maxStackHeight) {
      validationError(EOFError.MaxStackHeightViolation)
    }
    if (maxStackHeight > 1023) {
      // TODO verify if 1023 or 1024 is the right constant
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

  if (containerTypeMap.size !== container.header.containerSizes.length) {
    validationError(EOFError.UnreachableContainerSections)
  }

  return containerTypeMap
}
