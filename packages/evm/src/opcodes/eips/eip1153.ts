import { BIGINT_0, bigIntToBytes, bytesToBigInt, setLengthLeft } from '@ethereumjs/util'

import { EVMError } from '../../errors.ts'
import { trap } from '../util.ts'

import type { OpcodeEipModule } from './types.ts'

export const eip1153: OpcodeEipModule = {
  eip: 1153,
  opcodes: {
    0x5c: { name: 'TLOAD', isAsync: false, dynamicGas: false },
    0x5d: { name: 'TSTORE', isAsync: false, dynamicGas: false },
  },
  handlers: new Map([
    [
      0x5c,
      {
        logic(runState) {
          const key = runState.stack.pop()
          const keyBuf = setLengthLeft(bigIntToBytes(key!), 32)
          const value = runState.interpreter.transientStorageLoad(keyBuf)
          const valueBN = value.length ? bytesToBigInt(value) : BIGINT_0
          runState.stack.push(valueBN)
        },
      },
    ],
    [
      0x5d,
      {
        logic(runState) {
          if (runState.interpreter.isStatic()) {
            trap(EVMError.errorMessages.STATIC_STATE_CHANGE)
          }
          const [key, val] = runState.stack.popN(2)
          const keyBuf = setLengthLeft(bigIntToBytes(key!), 32)
          let value
          if (val === BIGINT_0) {
            value = Uint8Array.from([])
          } else {
            value = bigIntToBytes(val!)
          }
          runState.interpreter.transientStorageStore(keyBuf, value)
        },
      },
    ],
  ]),
}
