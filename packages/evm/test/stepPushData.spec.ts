import { equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEVM } from '../src/index.ts'

import type { InterpreterStep } from '../src/index.ts'

describe('step event pushData', () => {
  it('sets pushData for PUSH0', async () => {
    const evm = await createEVM()
    const steps: InterpreterStep[] = []
    evm.events.on('step', (e) => {
      steps.push(e)
    })
    await evm.runCode({ code: hexToBytes('0x5f00'), gasLimit: 100000n })
    const pushStep = steps.find((s) => s.opcode.code === 0x5f)
    assert.isDefined(pushStep?.pushData)
    assert.isTrue(equalsBytes(pushStep!.pushData!, new Uint8Array([0])))
  })

  it('sets pushData for PUSH1 to the immediate byte(s)', async () => {
    const evm = await createEVM()
    const steps: InterpreterStep[] = []
    evm.events.on('step', (e) => {
      steps.push(e)
    })
    await evm.runCode({ code: hexToBytes('0x60ab00'), gasLimit: 100000n })
    const pushStep = steps.find((s) => s.opcode.code === 0x60)
    assert.isDefined(pushStep?.pushData)
    assert.isTrue(equalsBytes(pushStep!.pushData!, new Uint8Array([0xab])))
  })

  it('sets pushData length 32 for PUSH32', async () => {
    const evm = await createEVM()
    const steps: InterpreterStep[] = []
    evm.events.on('step', (e) => {
      steps.push(e)
    })
    const imm = '01'.repeat(32)
    await evm.runCode({ code: hexToBytes(`0x7f${imm}00`), gasLimit: 100000n })
    const pushStep = steps.find((s) => s.opcode.code === 0x7f)
    assert.isDefined(pushStep?.pushData)
    assert.strictEqual(pushStep!.pushData!.length, 32)
  })

  it('does not set pushData for non-PUSH opcodes', async () => {
    const evm = await createEVM()
    const steps: InterpreterStep[] = []
    evm.events.on('step', (e) => {
      steps.push(e)
    })
    await evm.runCode({ code: hexToBytes('0x600160020100'), gasLimit: 100000n })
    const addStep = steps.find((s) => s.opcode.code === 0x01)
    assert.isUndefined(addStep?.pushData)
  })
})
