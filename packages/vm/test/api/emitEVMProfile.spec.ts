import type { EVMPerformanceLogOutput } from '@ethereumjs/evm'
import { assert, describe, it, vi } from 'vitest'

import { emitEVMProfile } from '../../src/emitEVMProfile.ts'

describe('[VM/emitEVMProfile]: profile output', () => {
  it('emitEVMProfile() is a no-op for empty logs', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    emitEVMProfile([], 'empty profile')
    assert.strictEqual(logSpy.mock.calls.length, 0)
    logSpy.mockRestore()
  })

  it('emitEVMProfile() prints table rows for non-empty logs', () => {
    const logs: EVMPerformanceLogOutput[] = [
      {
        tag: 'ADD',
        calls: 2,
        avgTimePerCall: 0.5,
        totalTime: 1,
        staticGasUsed: 6,
        dynamicGasUsed: 0,
        gasUsed: 6,
        staticGas: 3,
        millionGasPerSecond: 6,
        blocksPerSlot: 0.001,
      },
    ]
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    emitEVMProfile(logs, 'opcode profile')
    assert.isTrue(logSpy.mock.calls.length > 0)
    const output = logSpy.mock.calls.map((call) => String(call[0])).join('\n')
    assert.include(output, 'opcode profile')
    assert.include(output, 'ADD')
    logSpy.mockRestore()
  })
})
