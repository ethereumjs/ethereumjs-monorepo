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

  it('skips PUSH immediate bytes when scanning opcode flags and embedded addresses', () => {
    // PUSH32 containing 0xff / 0xf4 / 0xf0 / 0xf5 / 0x5c / 0x49 immediate bytes followed by STOP
    const hex = `7f${'fff4f0f55c49'.padEnd(64, 'ab')}00`
    const code = Buffer.from(hex, 'hex')
    const scan = scanBytecodeForensics(code)
    expect(scan.opcodeFlags.selfdestruct).toBe(false)
    expect(scan.opcodeFlags.delegatecall).toBe(false)
    expect(scan.opcodeFlags.create).toBe(false)
    expect(scan.opcodeFlags.create2).toBe(false)
    expect(scan.opcodeFlags.tstore).toBe(false)
    expect(scan.opcodeFlags.blobhash).toBe(false)
    expect(scan.embeddedAddresses).toEqual([])
  })
})
