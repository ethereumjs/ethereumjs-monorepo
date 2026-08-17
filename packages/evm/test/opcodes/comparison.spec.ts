import { assert, describe, it } from 'vitest'

import { push1, pushBigInt, runBytecodeExpectReturn } from '../bytecodeHelpers.ts'

interface ComparisonCase {
  name: string
  bytecode: string
  expected: bigint
}

describe('[EVM/Opcodes]: comparison', () => {
  const cases: ComparisonCase[] = [
    { name: 'LT (true)', bytecode: `${push1(8)}${push1(5)}10`, expected: 1n },
    { name: 'LT (false)', bytecode: `${push1(5)}${push1(8)}10`, expected: 0n },
    { name: 'GT (true)', bytecode: `${push1(5)}${push1(8)}11`, expected: 1n },
    { name: 'GT (false)', bytecode: `${push1(8)}${push1(5)}11`, expected: 0n },
    {
      name: 'SLT (true)',
      bytecode: `${push1(5)}${pushBigInt(0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbn)}12`,
      expected: 1n,
    },
    {
      name: 'SGT (true)',
      bytecode: `${pushBigInt(0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbn)}${push1(5)}13`,
      expected: 1n,
    },
    { name: 'EQ (true)', bytecode: `${push1(7)}${push1(7)}14`, expected: 1n },
    { name: 'EQ (false)', bytecode: `${push1(7)}${push1(8)}14`, expected: 0n },
    { name: 'ISZERO (true)', bytecode: `${push1(0)}15`, expected: 1n },
    { name: 'ISZERO (false)', bytecode: `${push1(1)}15`, expected: 0n },
  ]

  for (const testCase of cases) {
    it(`${testCase.name}`, async () => {
      await runBytecodeExpectReturn(testCase.bytecode, testCase.expected)
    })
  }
})
