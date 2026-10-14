import { BIGINT_0, BIGINT_256 } from '@ethereumjs/util'

import type { OpcodeEipModule } from './types.ts'

export const eip7939: OpcodeEipModule = {
  eip: 7939,
  opcodes: {
    0x1e: { name: 'CLZ', isAsync: false, dynamicGas: false },
  },
  handlers: new Map([
    [
      0x1e,
      {
        logic(runState) {
          const x = runState.stack.pop()
          if (x === BIGINT_0) {
            runState.stack.push(BIGINT_256)
            return
          }
          const binaryStr = x!.toString(2)
          runState.stack.push(BigInt(256 - binaryStr.length))
        },
      },
    ],
  ]),
}
