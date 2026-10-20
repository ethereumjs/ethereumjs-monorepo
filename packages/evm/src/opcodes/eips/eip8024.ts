import {
  decodeEIP8024PairImmediate,
  decodeEIP8024SingleImmediate,
  isEIP8024PairImmediateValid,
  isEIP8024SingleImmediateValid,
} from '../../eip8024.ts'
import { EVMError } from '../../errors.ts'
import { readImmediateByteOrZero, trap } from '../util.ts'

import type { OpcodeEipModule } from './types.ts'

export const eip8024: OpcodeEipModule = {
  eip: 8024,
  opcodes: {
    0xe6: { name: 'DUPN', isAsync: false, dynamicGas: false },
    0xe7: { name: 'SWAPN', isAsync: false, dynamicGas: false },
    0xe8: { name: 'EXCHANGE', isAsync: false, dynamicGas: false },
  },
  handlers: new Map([
    [
      0xe6,
      {
        immediates: 1,
        logic(runState) {
          const immediate = readImmediateByteOrZero(runState)
          if (!isEIP8024SingleImmediateValid(immediate)) {
            trap(EVMError.errorMessages.INVALID_OPCODE)
          }
          const toDup = decodeEIP8024SingleImmediate(immediate)
          runState.stack.dup(toDup)
        },
      },
    ],
    [
      0xe7,
      {
        immediates: 1,
        logic(runState) {
          const immediate = readImmediateByteOrZero(runState)
          if (!isEIP8024SingleImmediateValid(immediate)) {
            trap(EVMError.errorMessages.INVALID_OPCODE)
          }
          const toSwap = decodeEIP8024SingleImmediate(immediate)
          runState.stack.swap(toSwap)
        },
      },
    ],
    [
      0xe8,
      {
        immediates: 1,
        logic(runState) {
          const immediate = readImmediateByteOrZero(runState)
          if (!isEIP8024PairImmediateValid(immediate)) {
            trap(EVMError.errorMessages.INVALID_OPCODE)
          }
          const [x, y] = decodeEIP8024PairImmediate(immediate)
          runState.stack.exchange(x, y)
        },
      },
    ],
  ]),
}
