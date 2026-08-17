import { createAddressFromString, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { RETURN_TOP, runBytecode } from '../bytecodeHelpers.ts'

describe('[EVM/Opcodes]: environment', () => {
  it('ADDRESS pushes execution address', async () => {
    const to = createAddressFromString(`0x${'42'.repeat(20)}`)
    const res = await runBytecode(`30${RETURN_TOP}`, { runCode: { to } })
    assert.isUndefined(res.exceptionError)
    assert.strictEqual(res.returnValue.length, 32)
    assert.strictEqual(
      res.returnValue.slice(12).reduce((s, b) => s + b.toString(16).padStart(2, '0'), ''),
      '42'.repeat(20),
    )
  })

  it('CALLER pushes caller address', async () => {
    const caller = createAddressFromString(`0x${'aa'.repeat(20)}`)
    const res = await runBytecode(`33${RETURN_TOP}`, { runCode: { caller } })
    assert.isUndefined(res.exceptionError)
    assert.strictEqual(
      res.returnValue.slice(12).reduce((s, b) => s + b.toString(16).padStart(2, '0'), ''),
      'aa'.repeat(20),
    )
  })

  it('CALLDATASIZE pushes input length', async () => {
    const data = hexToBytes('0xdeadbeef')
    const res = await runBytecode(`36${RETURN_TOP}`, { runCode: { data } })
    assert.isUndefined(res.exceptionError)
    assert.strictEqual(res.returnValue[31], 4)
  })

  it('CALLVALUE pushes call value', async () => {
    const res = await runBytecode(`34${RETURN_TOP}`, { runCode: { value: 9n } })
    assert.isUndefined(res.exceptionError)
    assert.strictEqual(res.returnValue[31], 9)
  })
})
