import type { OpcodeEipModule } from './types.ts'

export const eip7516: OpcodeEipModule = {
  eip: 7516,
  opcodes: {
    0x4a: { name: 'BLOBBASEFEE', isAsync: false, dynamicGas: false },
  },
  handlers: new Map([
    [
      0x4a,
      {
        logic(runState) {
          runState.stack.push(runState.interpreter.getBlobBaseFee())
        },
      },
    ],
  ]),
}
