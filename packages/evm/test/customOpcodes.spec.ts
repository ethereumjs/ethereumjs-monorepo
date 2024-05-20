import { equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EVM } from '../src/evm.js'

import type { InterpreterStep, RunState } from '../src/interpreter.js'
import type { AddOpcode } from '../src/types.js'

describe('VM: custom opcodes', () => {
  const fee = 333
  const logicFee = BigInt(33)
  const totalFee = BigInt(fee) + logicFee
  const stackPush = BigInt(1)

  const testOpcode: AddOpcode = {
    opcode: 0x21,
    opcodeName: 'TEST',
    baseFee: fee,
    gasFunction(runState: RunState, gas: bigint) {
      return gas + logicFee
    },
    logicFunction(runState: RunState) {
      runState.stack.push(BigInt(stackPush))
    },
  }

  it('should add custom opcodes to the EVM', async () => {
    const evm = await EVM.create({ customOpcodes: [testOpcode] })
    const gas = 123456
    let correctOpcodeName = false
    evm.events.on('step', (e: InterpreterStep) => {
      if (e.pc === 0) {
        correctOpcodeName = e.opcode.name === testOpcode.opcodeName
      }
    })
    const res = await evm.runCode({
      code: hexToBytes('0x21'),
      gasLimit: BigInt(gas),
    })
    assert.ok(res.executionGasUsed === totalFee, 'successfully charged correct gas')
    assert.ok(res.runState!.stack.peek()[0] === stackPush, 'successfully ran opcode logic')
    assert.ok(correctOpcodeName, 'successfully set opcode name')
  })

  it('should delete opcodes from the EVM', async () => {
    const evm = await EVM.create({
      customOpcodes: [{ opcode: 0x20 }], // deletes KECCAK opcode
    })
    const gas = BigInt(123456)
    const res = await evm.runCode({
      code: hexToBytes('0x20'),
      gasLimit: BigInt(gas),
    })
    assert.ok(res.executionGasUsed === gas, 'successfully deleted opcode')
  })

  it('should not override default opcodes', async () => {
    // This test ensures that always the original opcode map is used
    // Thus, each time you recreate a EVM, it is in a clean state
    const evm = await EVM.create({
      customOpcodes: [{ opcode: 0x01 }], // deletes ADD opcode
    })
    const gas = BigInt(123456)
    const res = await evm.runCode({
      code: hexToBytes('0x01'),
      gasLimit: BigInt(gas),
    })
    assert.ok(res.executionGasUsed === gas, 'successfully deleted opcode')

    const evmDefault = await EVM.create()

    // PUSH 04
    // PUSH 01
    // ADD      // Adds 4 and 1 -> stack is now [5]
    // PUSH 00
    // MSTORE  // Store 5 (this is a bytes32, so 31 0 bytes and then 1 byte with value 5) at memory position 0
    // PUSH 01 // RETURNDATA length
    // PUSH 1F // RETURNDATA offset
    // RETURN  // Returns 0x05
    const result = await evmDefault.runCode!({
      code: hexToBytes('0x60046001016000526001601FF3'),
      gasLimit: BigInt(gas),
    })
    assert.ok(equalsBytes(result.returnValue, hexToBytes('0x05')))
  })

  it('should override opcodes in the EVM', async () => {
    testOpcode.opcode = 0x20 // Overrides KECCAK
    const evm = await EVM.create({ customOpcodes: [testOpcode] })
    const gas = 123456
    const res = await evm.runCode({
      code: hexToBytes('0x20'),
      gasLimit: BigInt(gas),
    })
    assert.ok(res.executionGasUsed === totalFee, 'successfully charged correct gas')
    assert.ok(res.runState!.stack.peek()[0] === stackPush, 'successfully ran opcode logic')
  })

  it('should pass the correct EVM options when copying the EVM', async () => {
    const fee = 333
    const stackPush = BigInt(1)

    const testOpcode: AddOpcode = {
      opcode: 0x21,
      opcodeName: 'TEST',
      baseFee: fee,
      logicFunction(runState: RunState) {
        runState.stack.push(BigInt(stackPush))
      },
    }

    const evm = await EVM.create({ customOpcodes: [testOpcode] })
    evm.events.on('beforeMessage', () => {})
    evm.events.on('beforeMessage', () => {})
    const evmCopy = evm.shallowCopy()

    assert.deepEqual(
      (evmCopy as any)._customOpcodes,
      (evmCopy as any)._customOpcodes,
      'evm.shallowCopy() successfully copied customOpcodes option'
    )

    assert.equal(
      evm.events.listenerCount('beforeMessage'),
      2,
      'original EVM instance should have two listeners'
    )
    assert.equal(
      evmCopy!.events!.listenerCount('beforeMessage'),
      0,
      'copied EVM instance should have zero listeners'
    )
  })
})
