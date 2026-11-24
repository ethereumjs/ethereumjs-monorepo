import { describe, expect, it } from 'vitest'

import { scanBytecodeForensics } from '../src/contracts/contractForensics.ts'

describe('contractForensics', () => {
  it('finds PUSH20 embedded address in minimal bytecode', () => {
    const hex = `73${'11'.repeat(20)}00`
    const code = Buffer.from(hex, 'hex')
    const scan = scanBytecodeForensics(code)
    expect(scan.bytecodeSize).toBe(code.length)
    expect(scan.embeddedAddresses.length).toBe(1)
    expect(scan.embeddedAddresses[0]?.startsWith('0x')).toBe(true)
  })
})
