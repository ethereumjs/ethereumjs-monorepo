import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToBigInt, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { runBytecode } from './bytecodeHelpers.ts'
import { getCommon } from './eips/eof-utils.ts'

import type { InterpreterStep } from '../src/index.ts'

async function trace(
  bytecode: string,
  common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai }),
) {
  const steps: InterpreterStep[] = []
  const result = await runBytecode(bytecode, {
    common,
    beforeRun(evm) {
      evm.events.on('step', (step) => {
        steps.push(step)
      })
    },
  })
  assert.isUndefined(result.exceptionError)
  return { steps, result }
}

describe('[EVM]: step event PUSH data', () => {
  // A jump enables the cached PUSH execution path before the instruction under test.
  for (const prefix of ['', '6003565b']) {
    const mode = prefix === '' ? 'direct' : 'cached'
    for (let width = 0; width <= 32; width++) {
      it(`reports the value before PUSH${width} executes (${mode})`, async () => {
        const immediate = Uint8Array.from({ length: width }, (_, i) => (i * 17 + 3) & 0xff)
        const code = Uint8Array.from([0x5f + width, ...immediate, 0x00])
        const expected = width === 0 ? new Uint8Array([0]) : immediate
        const { steps, result } = await trace(
          prefix + Array.from(code, (byte) => byte.toString(16).padStart(2, '0')).join(''),
        )
        const step = steps.find((event) => event.pc === prefix.length / 2)!
        assert.isDefined(step)
        assert.deepEqual(step.pushData, expected)
        assert.deepEqual(step.stack, [], 'the event precedes the stack push')
        assert.deepEqual(result.runState!.stack.getStack(), [bytesToBigInt(expected)])
        assert.deepEqual(step.immediate, width === 0 ? undefined : immediate)
        const stop = steps.find((event) => event.opcode.code === 0x00)!
        assert.isDefined(stop)
        assert.isUndefined(stop.pushData, 'PUSH data does not carry over to the next step')
      })
    }

    for (const { code, width, available } of [
      { code: '60', width: 1, available: [] },
      { code: '6112', width: 2, available: [0x12] },
      { code: '61', width: 2, available: [] },
      { code: '7f12', width: 32, available: [0x12] },
      { code: '7f', width: 32, available: [] },
    ]) {
      it(`right-pads truncated PUSH data in ${code} (${mode})`, async () => {
        const expected = new Uint8Array(width)
        expected.set(available)
        const { steps, result } = await trace(prefix + code)
        const step = steps.find((event) => event.pc === prefix.length / 2)!
        assert.isDefined(step)
        assert.deepEqual(step.pushData, expected)
        assert.deepEqual(
          step.immediate,
          new Uint8Array(available),
          'raw immediate bytes stay intact',
        )
        assert.deepEqual(result.runState!.stack.getStack(), [bytesToBigInt(expected)])
      })
    }
  }

  it('preserves leading zero bytes', async () => {
    const { steps, result } = await trace('6200010200')
    assert.deepEqual(steps[0].pushData, hexToBytes('0x000102'))
    assert.deepEqual(result.runState!.stack.getStack(), [0x0102n])
  })

  it('leaves PUSH data undefined for ADD', async () => {
    const { steps } = await trace('600160020100')
    const add = steps.find((step) => step.opcode.code === 0x01)!
    assert.isDefined(add)
    assert.isUndefined(add.pushData)
  })

  it('keeps non-PUSH immediate arguments separate from PUSH data', async () => {
    // A valid EOF container with RJUMP 0 followed by STOP.
    const { steps } = await trace('ef000101000402000100040400000000800000e0000000', getCommon())
    const jump = steps.find((step) => step.opcode.code === 0xe0)!
    assert.isDefined(jump)
    assert.deepEqual(jump.immediate, new Uint8Array([0, 0]))
    assert.isUndefined(jump.pushData)
  })
})
