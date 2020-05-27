const tape = require('tape')
const BN = require('bn.js')
const VM = require('../../../dist/index').default

tape('Berlin: EIP 2315 tests', t => {
  let callArgs;
  let stepCounter;
  let vm;

  const runTest = async function(test, st){
    let i = 0;
    vm = new VM();

    vm.on('step', function(step){
      if (test.steps.length){
        st.equal(step.pc, test.steps[i].expectedPC)
        st.equal(step.opcode.name, test.steps[i].expectedOpcode)
      }
      i++;
    })

    const result = await vm.runCode({
      code: Buffer.from(test.code, 'hex'),
      gasLimit: new BN(0xffffffffff)
    })

    st.equal(i, test.totalSteps)
    return result;
  }

  // EIP test case 1
  t.test('should jump into a subroutine, back out and stop', async st => {
    const test = {
      code: "6004b300b2b7",
      totalSteps: 4,
      steps: [
        { expectedPC: 0, expectedOpcode: "PUSH1" },
        { expectedPC: 2, expectedOpcode: "JUMPSUB" },
        { expectedPC: 5, expectedOpcode: "RETURNSUB" },
        { expectedPC: 3, expectedOpcode: "STOP" }
      ]
    }

    const result = await runTest(test, st)
    st.equal(undefined, result.exceptionError)
    st.end()
  })

  // EIP test case 2
  t.test('should go into two depths of subroutines', async st => {
    const test = {
      code: "6800000000000000000cb300b26011b3b7b2b7",
      totalSteps: 7,
      steps: [
        { expectedPC: 0, expectedOpcode: "PUSH9" },
        { expectedPC: 10, expectedOpcode: "JUMPSUB" },
        { expectedPC: 13, expectedOpcode: "PUSH1" },
        { expectedPC: 15, expectedOpcode: "JUMPSUB" },
        { expectedPC: 18, expectedOpcode: "RETURNSUB" },
        { expectedPC: 16, expectedOpcode: "RETURNSUB" },
        { expectedPC: 11, expectedOpcode: "STOP" }
      ]
    }

    const result = await runTest(test, st)
    st.equal(undefined, result.exceptionError)
    st.end()
  })

  // EIP test case 3
  t.test('should error on invalid jump (location out of code range)', async st => {
    const test = {
      code: "6801000000000000000cb300b26011b3b7b2b7",
      totalSteps: 2,
      steps: [
        { expectedPC: 0, expectedOpcode: "PUSH9" },
        { expectedPC: 10, expectedOpcode: "JUMPSUB" },
      ]
    }

    result = await runTest(test, st)
    st.equal(true, result.exceptionError.error.includes('invalid JUMP at'))
    st.end()
  })

  // hyperledger/besu PR 717 test case
  // https://github.com/hyperledger/besu/pull/717/files#diff-5d1330bc567b68d81941896ef2d2ce88R114
  t.test('should error on invalid jump (dest not BEGINSUB)', async st => {
    const test = {
      code: "6005b300b2b7",
      totalSteps: 2,
      steps: [
        { expectedPC: 0, expectedOpcode: "PUSH1" },
        { expectedPC: 2, expectedOpcode: "JUMPSUB" }
      ]
    }

    result = await runTest(test, st)
    st.equal(true, result.exceptionError.error.includes('invalid JUMP at'))
    st.end()
  })

  // EIP test case 4
  t.test('should error when the return stack is too shallow', async st => {
    const test = {
      code: "b75858",
      totalSteps: 1,
      steps: [
        { expectedPC: 0, expectedOpcode: "RETURNSUB" }
      ]
    }

    result = await runTest(test, st)
    st.equal(true, result.exceptionError.error.includes('invalid retsub'))
    st.end()
  })

  // EIP test case 5
  // Note: this case differs slightly from the EIP spec which expects STOP as the last step.
  t.test('it should hit the `virtual stop` when JUMP is on the last byte of code (EIP)', async st => {
    const test = {
      code: "600556b2b75b6003b3",
      totalSteps: 6,
      steps: [
        { expectedPC: 0, expectedOpcode: "PUSH1" },
        { expectedPC: 2, expectedOpcode: "JUMP" },
        { expectedPC: 5, expectedOpcode: "JUMPDEST" },
        { expectedPC: 6, expectedOpcode: "PUSH1" },
        { expectedPC: 8, expectedOpcode: "JUMPSUB" },
        { expectedPC: 4, expectedOpcode: "RETURNSUB" }
      ]
    }

    result = await runTest(test, st)
    st.equal(undefined, result.exceptionError)
    st.end()
  })

  // The code recursively calls itself. It should error when the returns-stack grows above 1023
  t.test('it should error if the return stack size limit (1023) is hit', async st => {
    const ops = [
      '60', '03', // PUSH1 3   # 1
      'b3',       // JUMPSUB   # 2
      'b2',       // BEGINSUB  # 3
      '60', '03', // PUSH1 3   # 4
      'b3',       // JUMPSUB   # 5
    ]

    // Max return stack height is 1023
    // First return stack entry runs 4 ops (1, 2, 4, 5)
    // Next 1022 are a loop of 2 ops (4, 5)
    const expectedTotalSteps = (1022 * 2) + 4
    const test = {
      code: ops.join(''),
      totalSteps: expectedTotalSteps,
      steps: []
    }

    result = await runTest(test, st)
    st.equal(true, result.exceptionError.error.includes('stack overflow'))
    st.end()
  })

  // EIP test case 6
  t.test('should error when walking into BEGINSUB', async st => {
    const test = {
      code: "b2",
      totalSteps: 1,
      steps: [
        { expectedPC: 0, expectedOpcode: "BEGINSUB" }
      ]
    }

    result = await runTest(test, st)
    st.equal(true, result.exceptionError.error.includes('invalid subroutine entry'))
    st.end()
  })
})

