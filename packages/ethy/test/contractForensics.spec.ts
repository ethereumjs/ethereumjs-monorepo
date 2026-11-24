import { describe, expect, it } from 'vitest'

import { scanBytecodeForensics } from '../src/contracts/contractForensics.ts'
import { formatCalldataPreview } from '../src/contracts/localAbi.ts'

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

  it('formats EIP-7702 proxyTarget and calldata previews without double 0x0x prefix', () => {
    const eip7702 = Buffer.from(`ef0100${'22'.repeat(20)}`, 'hex')
    const scan = scanBytecodeForensics(eip7702)
    expect(scan.fingerprint.proxyKind).toBe('EIP-7702')
    expect(scan.fingerprint.proxyTarget).toBe(`0x${'22'.repeat(20)}`)

    // ERC-20 transfer(address,uint256) selector 0xa9059cbb + recipient + amount
    const calldata = Buffer.from(
      `a9059cbb${'0'.repeat(24)}${'33'.repeat(20)}${'0'.repeat(62)}0a`,
      'hex',
    )
    const preview = formatCalldataPreview(calldata)
    expect(preview).toContain('transfer(')
    expect(preview).not.toContain('0x0x')
  })
})
