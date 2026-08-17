import { describe, it } from 'vitest'

import { push1, pushBigInt, runBytecodeExpectReturn } from '../bytecodeHelpers.ts'

interface BitwiseCase {
  name: string
  bytecode: string
  expected: bigint
}

describe('[EVM/Opcodes]: bitwise', () => {
  const cases: BitwiseCase[] = [
    { name: 'AND', bytecode: `${push1(0x0f)}${push1(0xf0)}16`, expected: 0n },
    { name: 'OR', bytecode: `${push1(0x0f)}${push1(0xf0)}17`, expected: 255n },
    { name: 'XOR', bytecode: `${push1(0xff)}${push1(0x0f)}18`, expected: 240n },
    {
      name: 'NOT',
      bytecode: `${push1(0)}19`,
      expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
    },
    { name: 'BYTE', bytecode: `${pushBigInt(0x42n)}${push1(31)}1a`, expected: 0x42n },
    { name: 'SHL', bytecode: `${push1(1)}${push1(1)}1b`, expected: 2n },
    { name: 'SHR', bytecode: `${push1(4)}${push1(1)}1c`, expected: 2n },
    {
      name: 'SAR',
      bytecode: `${pushBigInt(0x8000000000000000000000000000000000000000000000000000000000000000n)}${push1(1)}1d`,
      expected: 0xc000000000000000000000000000000000000000000000000000000000000000n,
    },
  ]

  for (const testCase of cases) {
    it(`${testCase.name}`, async () => {
      await runBytecodeExpectReturn(testCase.bytecode, testCase.expected)
    })
  }
})
