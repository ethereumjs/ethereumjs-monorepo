import { EOFError, validationError } from './errors.js'

import type { EVM } from '../evm.js'
import type { EOFContainer } from './container.js'

export function verifyCode(container: EOFContainer, evm: EVM) {
  validateOpcodes(container, evm)
  validateStack(container, evm)
}

function validateOpcodes(container: EOFContainer, evm: EVM) {
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

  for (const code of container.body.codeSections) {
    // Validate that each opcode is defined
    let ptr = 0
    let lastOpcode: number = 0 // Note: code sections cannot be empty, so this number will always be set
    while (ptr < code.length) {
      const opcode = code[ptr]
      lastOpcode = opcode
      if (!opcodeNumbers.has(opcode)) {
        validationError(EOFError.InvalidOpcode)
      }
      if (opcode >= 0x60 && opcode <= 0x7f) {
        // PUSH opcodes
        ptr += opcode - 0x5f
      }
      ptr++
    }

    // Validate that the final opcode terminates
    if (!terminatingOpcodes.has(lastOpcode)) {
      validationError(EOFError.InvalidTerminator)
    }
  }
}

function validateStack(_container: EOFContainer, _evm: EVM) {
  // TODO
}
