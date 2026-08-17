import { Account, createAddressFromString } from '@ethereumjs/util'
import { describe, it } from 'vitest'

import { push1, runBytecodeExpectReturn } from '../bytecodeHelpers.ts'

describe('[EVM/Opcodes]: storage', () => {
  it('SSTORE + SLOAD round-trip', async () => {
    const to = createAddressFromString(`0x${'01'.repeat(20)}`)
    await runBytecodeExpectReturn(`${push1(0x2a)}${push1(0)}55${push1(0)}54`, 0x2an, {
      runCode: { to },
      beforeRun: async (evm) => {
        await evm.stateManager.putAccount(to, new Account())
      },
    })
  })
})
