import { bytesToBigInt } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { describe, it } from 'vitest'

import { push1, runBytecodeExpectReturn } from '../bytecodeHelpers.ts'

describe('[EVM/Opcodes]: crypto', () => {
  it('SHA3 hashes empty memory', async () => {
    const expected = bytesToBigInt(keccak_256(new Uint8Array()))
    await runBytecodeExpectReturn(`${push1(0)}${push1(0)}20`, expected)
  })
})

describe('[EVM/Opcodes]: control flow', () => {
  it('JUMP lands on JUMPDEST', async () => {
    // PUSH1 0x03 JUMP JUMPDEST PUSH1 0x07
    await runBytecodeExpectReturn('6003565b6007', 7n)
  })

  it('JUMPI skips jump when condition is zero', async () => {
    await runBytecodeExpectReturn('60006008576009', 9n)
  })

  it('JUMPI takes jump when condition is non-zero', async () => {
    await runBytecodeExpectReturn('6001600757600a5b600b', 11n)
  })
})
