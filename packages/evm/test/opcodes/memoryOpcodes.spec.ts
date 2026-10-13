import { describe, it } from 'vitest'

import { push1, runBytecodeExpectReturn } from '../bytecodeHelpers.ts'

describe('[EVM/Opcodes]: memory', () => {
  it('MSTORE8 + MLOAD round-trip', async () => {
    // A single byte at offset 0 occupies the MSB of the loaded 32-byte word.
    await runBytecodeExpectReturn(`${push1(0x63)}${push1(0)}53${push1(0)}51`, 0x63n << 248n)
  })

  it('MSTORE + MLOAD round-trip', async () => {
    await runBytecodeExpectReturn(`${push1(0x2a)}${push1(0)}52${push1(0)}51`, 0x2an)
  })
})
