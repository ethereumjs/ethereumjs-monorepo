import { opcodeImmediateBytesFromModules } from './eips/apply.ts'

/**
 * Number of immediate bytes following an opcode in legacy bytecode.
 * Used by the `step` event for trace output (PUSH1–PUSH32, EIP-8024).
 */
export function opcodeImmediateByteCount(opcode: number): number {
  if (opcode >= 0x60 && opcode <= 0x7f) {
    return opcode - 0x5f
  }
  const fromModule = opcodeImmediateBytesFromModules(opcode)
  if (fromModule !== undefined) {
    return fromModule
  }
  return 0
}
