// All tests for arithmetic opcodes
// Range: 0x01 - 0x0B

import {
  BIGINT_160,
  BIGINT_224,
  BIGINT_2EXP160,
  BIGINT_2EXP224,
  BIGINT_2EXP96,
  BIGINT_96,
} from '@ethereumjs/util'
import { describe, it } from 'vitest'

import { toTwos } from '../../src/opcodes/util.js'

import { runOpcodeTest } from './utils.js'

import type { OpcodeTests } from './utils.js'

const BIGINT_2EXP256 = BigInt(2) ** BigInt(256)
const STACK_MAX_NUMBER = BIGINT_2EXP256 - BigInt(1)

function pow2(pow: number) {
  return BigInt(2) ** BigInt(pow)
}

function sign(input: bigint | number) {
  if (typeof input === 'number') {
    return toTwos(BigInt(input))
  }
  return toTwos(input)
}

export const testCases: OpcodeTests = {
  ADD: [
    { stack: [0, 0], expected: 0 },
    { stack: [1, 0], expected: 1 },
    { stack: [0, 1], expected: 1 },
    { stack: [1, 1], expected: 2 },
    { stack: [STACK_MAX_NUMBER, 1], expected: 0, name: 'overflow check' },
  ],
  MUL: [
    { stack: [0, 0], expected: 0 },
    { stack: [0, 1], expected: 0 },
    { stack: [1, 0], expected: 0 },
    { stack: [1, 1], expected: 1 },
    { stack: [1, 2], expected: 2 },
    { stack: [2, 2], expected: 4 },
    { stack: [BIGINT_2EXP256 / BigInt(2), 2], expected: 0, name: 'overflow check' },
  ],
  SUB: [
    { stack: [0, 0], expected: 0 },
    { stack: [0, 1], expected: STACK_MAX_NUMBER, name: 'underflow check' },
    { stack: [1, 0], expected: 1 },
    { stack: [1, 1], expected: 0 },
    { stack: [2, 1], expected: 1 },
    { stack: [4, 2], expected: 2 },
  ],
  DIV: [
    { stack: [0, 0], expected: 0, name: '0/0 check' },
    { stack: [0, 1], expected: 0 },
    { stack: [1, 0], expected: 0, name: '1/0 check' },
    { stack: [1, 1], expected: 1 },
    { stack: [2, 1], expected: 2 },
    { stack: [4, 2], expected: 2 },
    { stack: [pow2(255), 2], expected: pow2(254) },
  ],
  SDIV: [
    { stack: [0, 0], expected: 0, name: '0/0 check' },
    { stack: [0, 1], expected: 0 },
    { stack: [1, 0], expected: 0, name: '1/0 check' },
    { stack: [1, 1], expected: 1 },
    { stack: [2, 1], expected: 2 },
    { stack: [4, 2], expected: 2 },
    { stack: [0, sign(-1)], expected: 0 },
    { stack: [1, sign(-1)], expected: sign(-1) },
    { stack: [sign(-1), sign(-1)], expected: 1 },
    { stack: [2, sign(-1)], expected: sign(-2) },
    { stack: [4, sign(-2)], expected: sign(-2) },
  ],
  MOD: [
    { stack: [0, 0], expected: 0, name: '0%0 check' },
    { stack: [1, 0], expected: 0, name: '1%0 check' },
    { stack: [1, 1], expected: 0 },
    { stack: [2, 1], expected: 0 },
    { stack: [4, 2], expected: 0 },
    { stack: [5, 2], expected: 1 },
    { stack: [STACK_MAX_NUMBER, 2], expected: 1 },
  ],
  SMOD: [
    { stack: [0, 0], expected: 0, name: '0%0 check' },
    { stack: [1, 0], expected: 0, name: '1%0 check' },
    { stack: [1, 1], expected: 0 },
    { stack: [2, 1], expected: 0 },
    { stack: [4, 2], expected: 0 },
    { stack: [5, 2], expected: 1 },
    { stack: [sign(-1), 2], expected: sign(-1) },
    { stack: [sign(-1), sign(-2)], expected: sign(-1) },
    { stack: [sign(-1), sign(-1)], expected: sign(0) },
  ],
  ADDMOD: [
    { stack: [0, 0, 0], expected: 0, name: '(0+0)%0 check' },
    { stack: [0, 1, 0], expected: 0, name: '(0+1)%0 check' },
    { stack: [1, 0, 0], expected: 0, name: '(1+0)%0 check' },
    { stack: [1, 1, 0], expected: 0, name: '(1+1)%0 check' },
    { stack: [1, 1, 2], expected: 0 },
    { stack: [1, 2, 2], expected: 1 },
    { stack: [STACK_MAX_NUMBER, 2, 2], expected: 1 },
    { stack: [STACK_MAX_NUMBER, STACK_MAX_NUMBER, 2], expected: 0 },
  ],
  MULMOD: [
    { stack: [0, 0, 0], expected: 0, name: '(0*0)%0 check' },
    { stack: [0, 1, 0], expected: 0, name: '(0*1)%0 check' },
    { stack: [1, 0, 0], expected: 0, name: '(1*0)%0 check' },
    { stack: [1, 1, 0], expected: 0, name: '(1*1)%0 check' },
    { stack: [1, 1, 2], expected: 1 },
    { stack: [1, 2, 2], expected: 0 },
    { stack: [STACK_MAX_NUMBER, 2, 2], expected: 0 },
    { stack: [STACK_MAX_NUMBER, STACK_MAX_NUMBER, 2], expected: 1 },
  ],
  EXP: [
    // Note: the return values have been verified against results on Sepolia
    { stack: [0, 0], expected: 1, name: '0**0 check' },
    { stack: [0, 1], expected: 0, name: '0**1 check' },
    { stack: [1, 0], expected: 1, name: '1**0 check' },
    { stack: [1, 1], expected: 1 },
    { stack: [2, BIGINT_96], expected: BIGINT_2EXP96, name: '2**96 check' },
    { stack: [2, BIGINT_160], expected: BIGINT_2EXP160, name: '2**160 check' },
    { stack: [2, BIGINT_224], expected: BIGINT_2EXP224, name: '2**224 check' },
    { stack: [3, 2], expected: 3 ** 2 },
    { stack: [3, 3], expected: 3 ** 3 },
    { stack: [STACK_MAX_NUMBER, STACK_MAX_NUMBER], expected: STACK_MAX_NUMBER },
  ],
  SIGNEXTEND: [
    // SIGNEXTEND opcode explanation:
    // There are two items on the stack, the [byteLength, value]:
    // The value is interpreted to have the signed bit set at index `byteLength * 8` + 7 (call this `signIndex`)
    // Now, the signed value is extended to 256 bits
    // In practice this means:
    // If value[signIndex] = 1, this means the number is negative
    // Now left-fill all bits with 1 (so, when interpeting this number as signed in EVM, the original number does not change)
    // If value[signIndex] = 0, left-fill all bits with 0
    // This is thus handy if on stack there is an item which should be interpreted as, lets say int16 or uint16
    // If one would take this item from stack from dirty memory, this could mean that the bytes left of this
    // value are dirty, so we can clean it up.
    // Also handy to left-fill bytes with either 1s or 0s depending on the situation
    { stack: [0, 0b10000000], expected: sign(-128) },
    { stack: [0, 0b1111111100000011], expected: 3 },
    { stack: [32, STACK_MAX_NUMBER], expected: STACK_MAX_NUMBER },
    { stack: [32, 1], expected: 1 },
  ],
}

describe('Arithmetic tests', () => {
  for (const opcodeName in testCases) {
    it(`should test arithmetic opcode ${opcodeName}`, async () => {
      const testDataArray = testCases[opcodeName]
      for (const testData of testDataArray) {
        await runOpcodeTest({
          testName: testData.name,
          opcodeName,
          expected: testData.expected,
          expectedReturnType: 'topStack',
          input: testData.stack,
        })
      }
    })
  }
})
