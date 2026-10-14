/**
 * Number of immediate bytes following an opcode in legacy bytecode.
 * Used by the `step` event for trace output (PUSH1–PUSH32, EIP-8024).
 */
export function opcodeImmediateByteCount(opcode: number): number {
  if (opcode >= 0x60 && opcode <= 0x7f) {
    return opcode - 0x5f
  }
  if (opcode === 0xe6 || opcode === 0xe7 || opcode === 0xe8) {
    return 1
  }
  return 0
}
