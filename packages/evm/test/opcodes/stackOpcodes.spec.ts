import { describe, it } from 'vitest'

import { push1, runBytecodeExpectReturn } from '../bytecodeHelpers.ts'

describe('[EVM/Opcodes]: stack', () => {
  it('POP removes the stack top', async () => {
    await runBytecodeExpectReturn(`${push1(9)}${push1(1)}50`, 9n)
  })

  it('DUP1 duplicates the stack top', async () => {
    await runBytecodeExpectReturn(`${push1(7)}80`, 7n)
  })

  it('SWAP1 exchanges the top two stack items', async () => {
    await runBytecodeExpectReturn(`${push1(2)}${push1(5)}90`, 2n)
  })
})
