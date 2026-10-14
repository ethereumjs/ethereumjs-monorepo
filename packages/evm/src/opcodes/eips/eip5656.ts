import { BIGINT_3, BIGINT_31, BIGINT_32 } from '@ethereumjs/util'

import { subMemUsage } from '../util.ts'

import type { OpcodeEipModule } from './types.ts'

export const eip5656: OpcodeEipModule = {
  eip: 5656,
  opcodes: {
    0x5e: { name: 'MCOPY', isAsync: true, dynamicGas: true },
  },
  handlers: new Map([
    [
      0x5e,
      {
        logic(runState) {
          const [dst, src, length] = runState.stack.popN(3)
          const data = runState.memory.read(Number(src), Number(length), true)
          runState.memory.write(Number(dst), Number(length), data)
        },
        gas: async function (runState, gas, common) {
          const [dst, src, length] = runState.stack.peek(3)
          const wordsCopied = (length! + BIGINT_31) / BIGINT_32
          gas += BIGINT_3 * wordsCopied
          gas += subMemUsage(runState, src!, length!, common)
          gas += subMemUsage(runState, dst!, length!, common)
          return gas
        },
      },
    ],
  ]),
}
