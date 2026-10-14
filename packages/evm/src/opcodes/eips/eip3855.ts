import { BIGINT_0 } from '@ethereumjs/util'

import type { OpcodeEipModule } from './types.ts'

export const eip3855: OpcodeEipModule = {
  eip: 3855,
  opcodes: {
    0x5f: { name: 'PUSH0', isAsync: false, dynamicGas: false },
  },
  handlers: new Map([
    [
      0x5f,
      {
        logic(runState) {
          runState.stack.push(BIGINT_0)
        },
      },
    ],
  ]),
}
