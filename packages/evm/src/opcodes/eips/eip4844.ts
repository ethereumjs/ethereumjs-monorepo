import { BIGINT_0 } from '@ethereumjs/util'

import type { OpcodeEipModule } from './types.ts'

export const eip4844Blobhash: OpcodeEipModule = {
  eip: 4844,
  opcodes: {
    0x49: { name: 'BLOBHASH', isAsync: false, dynamicGas: false },
  },
  handlers: new Map([
    [
      0x49,
      {
        logic(runState) {
          const index = runState.stack.pop()
          if (runState.env.blobVersionedHashes.length > Number(index)) {
            runState.stack.push(BigInt(runState.env.blobVersionedHashes[Number(index!)]))
          } else {
            runState.stack.push(BIGINT_0)
          }
        },
      },
    ],
  ]),
}
