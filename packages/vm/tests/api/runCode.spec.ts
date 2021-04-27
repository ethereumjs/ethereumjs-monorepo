import tape from 'tape'
import { BN } from 'ethereumjs-util'
import VM from '../../lib'
import { DefaultStateManager } from '../../lib/state'

const STOP = '00'
const JUMP = '56'
const JUMPDEST = '5b'
const PUSH1 = '60'

const testCases = [
  { code: [STOP, JUMPDEST, PUSH1, '05', JUMP, JUMPDEST], pc: 1, resultPC: 6 },
  {
    code: [STOP, JUMPDEST, PUSH1, '05', JUMP, JUMPDEST],
    pc: -1,
    error: 'Internal error: program counter not in range',
  },
  { code: [STOP], pc: 3, error: 'Internal error: program counter not in range' },
  { code: [STOP], resultPC: 1 },
]

tape('VM.runCode: initial program counter', (t) => {
  const vm = new VM()

  testCases.forEach((testData, i) => {
    t.test('should start the execution at the specified pc or 0 #' + i.toString(), async (st) => {
      const runCodeArgs = {
        code: Buffer.from(testData.code.join(''), 'hex'),
        pc: testData.pc,
        gasLimit: new BN(0xffff),
      }

      let err
      try {
        const result = await vm.runCode(runCodeArgs)
        if (testData.resultPC !== undefined) {
          t.equals(result.runState?.programCounter, testData.resultPC, 'runstate.programCounter')
        }
      } catch (e) {
        err = e
      }

      if (testData.error) {
        err = err ? err.message : 'no error thrown'
        st.equals(err, testData.error, 'error message should match')
        err = false
      }

      st.assert(!err)
      st.end()
    })
  })
})

tape('VM.runCode: interpreter', (t) => {
  t.test('should return a VmError as an exceptionError on the result', async (st) => {
    const vm = new VM()

    const INVALID_opcode = 'fe'
    const runCodeArgs = {
      code: Buffer.from(INVALID_opcode, 'hex'),
      gasLimit: new BN(0xffff),
    }

    let result: any
    try {
      result = await vm.runCode(runCodeArgs)
    } catch (e) {
      st.fail('should not throw error')
    }
    st.equal(result!.exceptionError!.errorType, 'VmError')
    st.ok(result!.exceptionError!.error.includes('invalid opcode'))
    st.end()
  })

  t.test('should throw on non-VmError', async (st) => {
    const stateManager = new DefaultStateManager()
    stateManager.putContractStorage = (..._args) => {
      throw new Error('Test')
    }
    const vm = new VM({ stateManager })

    const SSTORE = '55'
    const runCodeArgs = {
      code: Buffer.from([PUSH1, '01', PUSH1, '05', SSTORE].join(''), 'hex'),
      gasLimit: new BN(0xffff),
    }

    try {
      await vm.runCode(runCodeArgs)
      st.fail('should throw error')
    } catch (e) {
      st.ok(e.toString().includes('Test'), 'error thrown')
    }
    st.end()
  })
})
