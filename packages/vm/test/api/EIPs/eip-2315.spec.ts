import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

describe('Berlin: EIP 2315 tests', () => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [2315] })

  const runTest = async function (test: any) {
    let i = 0
    const vm = await VM.create({ common })
    vm.evm.events!.on('step', function (step: any) {
      if (test.steps.length > 0) {
        assert.equal(step.pc, test.steps[i].expectedPC)
        assert.equal(step.opcode.name, test.steps[i].expectedOpcode)
      }
      i++
    })

    const result = await vm.evm.runCode!({
      code: hexToBytes(test.code),
      gasLimit: BigInt(0xffffffffff),
    })

    assert.equal(i, test.totalSteps)
    return result
  }

  // EIP test case 1
  it('should jump into a subroutine, back out and stop', async () => {
    const test = {
      code: '60045e005c5d',
      totalSteps: 4,
      steps: [
        { expectedPC: 0, expectedOpcode: 'PUSH1' },
        { expectedPC: 2, expectedOpcode: 'JUMPSUB' },
        { expectedPC: 5, expectedOpcode: 'RETURNSUB' },
        { expectedPC: 3, expectedOpcode: 'STOP' },
      ],
    }

    const result = await runTest(test)
    assert.equal(undefined, result.exceptionError)
  })

  // EIP test case 2
  it('should go into two depths of subroutines', async () => {
    const test = {
      code: '6800000000000000000c5e005c60115e5d5c5d',
      totalSteps: 7,
      steps: [
        { expectedPC: 0, expectedOpcode: 'PUSH9' },
        { expectedPC: 10, expectedOpcode: 'JUMPSUB' },
        { expectedPC: 13, expectedOpcode: 'PUSH1' },
        { expectedPC: 15, expectedOpcode: 'JUMPSUB' },
        { expectedPC: 18, expectedOpcode: 'RETURNSUB' },
        { expectedPC: 16, expectedOpcode: 'RETURNSUB' },
        { expectedPC: 11, expectedOpcode: 'STOP' },
      ],
    }

    const result = await runTest(test)
    assert.equal(undefined, result.exceptionError)
  })

  // EIP test case 3
  it('should error on invalid jumpsub (location out of code range)', async () => {
    const test = {
      code: '6801000000000000000c5e005c60115e5d5c5d',
      totalSteps: 2,
      steps: [
        { expectedPC: 0, expectedOpcode: 'PUSH9' },
        { expectedPC: 10, expectedOpcode: 'JUMPSUB' },
      ],
    }

    const result = await runTest(test)
    assert.equal(true, result.exceptionError?.error.includes('invalid JUMPSUB at'))
  })

  // hyperledger/besu PR 717 test case
  // https://github.com/hyperledger/besu/pull/717/files#diff-5d1330bc567b68d81941896ef2d2ce88R114
  it('should error on invalid jumpsub (dest not BEGINSUB)', async () => {
    const test = {
      code: '60055e005c5d',
      totalSteps: 2,
      steps: [
        { expectedPC: 0, expectedOpcode: 'PUSH1' },
        { expectedPC: 2, expectedOpcode: 'JUMPSUB' },
      ],
    }

    const result = await runTest(test)
    assert.equal(true, result.exceptionError?.error.includes('invalid JUMPSUB at'))
  })

  // Code is same as EIP example 1 above, with JUMP substituted for JUMPSUB
  it('BEGINSUB should not be a valid dest for JUMP', async () => {
    const test = {
      code: '600456005c5d',
      totalSteps: 2,
      steps: [
        { expectedPC: 0, expectedOpcode: 'PUSH1' },
        { expectedPC: 2, expectedOpcode: 'JUMP' },
      ],
    }

    const result = await runTest(test)
    assert.equal(true, result.exceptionError?.error.includes('invalid JUMP at'))
  })

  // EIP test case 4
  it('should error when the return stack is too shallow', async () => {
    const test = {
      code: '5d5858',
      totalSteps: 1,
      steps: [{ expectedPC: 0, expectedOpcode: 'RETURNSUB' }],
    }

    const result = await runTest(test)
    assert.equal(true, result.exceptionError?.error.includes('invalid RETURNSUB'))
  })

  // EIP test case 5
  // Note: this case differs slightly from the EIP spec which expects STOP as the last step.
  it('it should hit the `virtual stop` when JUMP is on the last byte of code (EIP)', async () => {
    const test = {
      code: '6005565c5d5b60035e',
      totalSteps: 6,
      steps: [
        { expectedPC: 0, expectedOpcode: 'PUSH1' },
        { expectedPC: 2, expectedOpcode: 'JUMP' },
        { expectedPC: 5, expectedOpcode: 'JUMPDEST' },
        { expectedPC: 6, expectedOpcode: 'PUSH1' },
        { expectedPC: 8, expectedOpcode: 'JUMPSUB' },
        { expectedPC: 4, expectedOpcode: 'RETURNSUB' },
      ],
    }

    const result = await runTest(test)
    assert.equal(undefined, result.exceptionError)
  })

  // The code recursively calls itself. It should error when the returns-stack grows above 1023
  it('it should error if the return stack size limit (1023) is hit', async () => {
    const ops = [
      '60',
      '03', // PUSH1 3   # 1
      '5e', // JUMPSUB   # 2
      '5c', // BEGINSUB  # 3
      '60',
      '03', // PUSH1 3   # 4
      '5e', // JUMPSUB   # 5
    ]

    // Max return stack height is 1023
    // First return stack entry runs 4 ops (1, 2, 4, 5)
    // Next 1022 are a loop of 2 ops (4, 5)
    const expectedTotalSteps = 1022 * 2 + 4
    const test = {
      code: ops.join(''),
      totalSteps: expectedTotalSteps,
      steps: [],
    }

    const result = await runTest(test)
    assert.equal(true, result.exceptionError?.error.includes('stack overflow'))
  })

  // EIP test case 6
  it('should error when walking into BEGINSUB', async () => {
    const test = {
      code: '5c',
      totalSteps: 1,
      steps: [{ expectedPC: 0, expectedOpcode: 'BEGINSUB' }],
    }

    const result = await runTest(test)
    assert.equal(true, result.exceptionError?.error.includes('invalid BEGINSUB'))
  })
})
