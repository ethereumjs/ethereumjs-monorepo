import { assert, describe, it } from 'vitest'

import { push1, pushBigInt, runBytecodeExpectReturn } from '../bytecodeHelpers.ts'

interface ArithmeticCase {
  name: string
  bytecode: string
  expected: bigint
}

describe('[VM/Opcodes]: arithmetic', () => {
  const cases: ArithmeticCase[] = [
    { name: 'ADD', bytecode: `${push1(3)}${push1(5)}01`, expected: 8n },
    { name: 'SUB', bytecode: `${push1(3)}${push1(8)}03`, expected: 5n },
    { name: 'MUL', bytecode: `${push1(4)}${push1(5)}02`, expected: 20n },
    { name: 'DIV', bytecode: `${push1(3)}${push1(8)}04`, expected: 2n },
    { name: 'DIV by zero', bytecode: `${push1(0)}${push1(8)}04`, expected: 0n },
    { name: 'SDIV', bytecode: `${pushBigInt(3n)}${pushBigInt(8n)}05`, expected: 2n },
    { name: 'MOD', bytecode: `${push1(3)}${push1(8)}06`, expected: 2n },
    { name: 'MOD by zero', bytecode: `${push1(0)}${push1(8)}06`, expected: 0n },
    { name: 'SMOD', bytecode: `${push1(3)}${push1(8)}07`, expected: 2n },
    { name: 'ADDMOD', bytecode: `${push1(5)}${push1(4)}${push1(3)}08`, expected: 2n },
    { name: 'MULMOD', bytecode: `${push1(3)}${push1(2)}${push1(2)}09`, expected: 1n },
    { name: 'EXP', bytecode: `${push1(3)}${push1(2)}0a`, expected: 8n },
    { name: 'EXP exponent zero', bytecode: `${push1(0)}${push1(99)}0a`, expected: 1n },
    { name: 'EXP base zero', bytecode: `${push1(5)}${push1(0)}0a`, expected: 0n },
    { name: 'SIGNEXTEND', bytecode: `${push1(0x7f)}${push1(0)}0b`, expected: 127n },
  ]

  for (const testCase of cases) {
    it(`${testCase.name} leaves expected stack top`, async () => {
      await runBytecodeExpectReturn(testCase.bytecode, testCase.expected)
    })
  }
})
