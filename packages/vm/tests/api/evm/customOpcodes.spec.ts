import tape from 'tape'
import VM from '../../../src'
import { AddOpcode } from '../../../src/evm/types'
import { InterpreterStep, RunState } from '../../../src/evm/interpreter'
import EVM from '../../../src/evm/evm'

tape('VM: custom opcodes', (t) => {
  const fee = 333
  const logicFee = BigInt(33)
  const totalFee = BigInt(fee) + logicFee
  const stackPush = BigInt(1)

  const testOpcode: AddOpcode = {
    opcode: 0x21,
    opcodeName: 'TEST',
    baseFee: fee,
    gasFunction: function (runState: RunState, gas: bigint) {
      return gas + logicFee
    },
    logicFunction: function (runState: RunState) {
      runState.stack.push(BigInt(stackPush))
    },
  }

  t.test('should add custom opcodes to the VM', async (st) => {
    const evm = await EVM.create({
      customOpcodes: [testOpcode],
    })
    const gas = 123456
    let correctOpcodeName = false
    evm.on('step', (e: InterpreterStep) => {
      if (e.pc === 0) {
        correctOpcodeName = e.opcode.name === testOpcode.opcodeName
      }
    })
    const res = await evm.runCode({
      code: Buffer.from('21', 'hex'),
      gasLimit: BigInt(gas),
    })
    st.ok(res.gasUsed === totalFee, 'succesfully charged correct gas')
    st.ok(res.runState!.stack._store[0] === stackPush, 'succesfully ran opcode logic')
    st.ok(correctOpcodeName, 'succesfully set opcode name')
  })

  t.test('should delete opcodes from the VM', async (st) => {
    const evm = await EVM.create({
      customOpcodes: [{ opcode: 0x20 }], // deletes KECCAK opcode
    })
    const gas = BigInt(123456)
    const res = await evm.runCode({
      code: Buffer.from('20', 'hex'),
      gasLimit: BigInt(gas),
    })
    st.ok(res.gasUsed === gas, 'succesfully deleted opcode')
  })

  t.test('should not override default opcodes', async (st) => {
    // This test ensures that always the original opcode map is used
    // Thus, each time you recreate a VM, it is in a clean state
    const evm = await EVM.create({
      customOpcodes: [{ opcode: 0x01 }], // deletes ADD opcode
    })
    const gas = BigInt(123456)
    const res = await evm.runCode({
      code: Buffer.from('01', 'hex'),
      gasLimit: BigInt(gas),
    })
    st.ok(res.gasUsed === gas, 'succesfully deleted opcode')

    const vmDefault = await VM.create()

    // PUSH 04
    // PUSH 01
    // ADD      // Adds 4 and 1 -> stack is now [5]
    // PUSH 00
    // MSTORE  // Store 5 (this is a bytes32, so 31 0 bytes and then 1 byte with value 5) at memory position 0
    // PUSH 01 // RETURNDATA length
    // PUSH 1F // RETURNDATA offset
    // RETURN  // Returns 0x05
    const result = await vmDefault.evm.runCode({
      code: Buffer.from('60046001016000526001601FF3', 'hex'),
      gasLimit: BigInt(gas),
    })
    st.ok(result.returnValue.equals(Buffer.from('05', 'hex')))
  })

  t.test('should override opcodes in the VM', async (st) => {
    testOpcode.opcode = 0x20 // Overrides KECCAK
    const evm = await EVM.create({
      customOpcodes: [testOpcode],
    })
    const gas = 123456
    const res = await evm.runCode({
      code: Buffer.from('20', 'hex'),
      gasLimit: BigInt(gas),
    })
    st.ok(res.gasUsed === totalFee, 'succesfully charged correct gas')
    st.ok(res.runState!.stack._store[0] === stackPush, 'succesfully ran opcode logic')
  })
})
