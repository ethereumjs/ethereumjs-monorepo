import type { OpcodeEipModule } from './types.ts'

export const eip3198: OpcodeEipModule = {
  eip: 3198,
  opcodes: {
    0x48: { name: 'BASEFEE', isAsync: false, dynamicGas: false },
  },
  handlers: new Map([
    [
      0x48,
      {
        logic(runState) {
          runState.stack.push(runState.interpreter.getBlockBaseFee())
        },
      },
    ],
  ]),
}
