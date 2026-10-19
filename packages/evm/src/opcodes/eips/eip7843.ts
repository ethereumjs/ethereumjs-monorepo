import type { OpcodeEipModule } from './types.ts'

export const eip7843: OpcodeEipModule = {
  eip: 7843,
  opcodes: {
    0x4b: { name: 'SLOTNUM', isAsync: false, dynamicGas: false },
  },
  handlers: new Map([
    [
      0x4b,
      {
        logic(runState) {
          runState.stack.push(runState.interpreter.getBlockSlotNumber())
        },
      },
    ],
  ]),
}
