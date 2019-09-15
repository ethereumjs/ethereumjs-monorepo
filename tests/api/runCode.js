const tape = require('tape')
const async = require('async')
const BN = require('bn.js')
const VM = require('../../dist/index').default

const STOP = '00'
const JUMP = '56'
const JUMPDEST = '5b'
const PUSH1 = '60'

const testCases = [
  { code: [STOP, JUMPDEST, PUSH1, '05', JUMP, JUMPDEST], pc: 1, resultPC: 6 },
  { code: [STOP, JUMPDEST, PUSH1, '05', JUMP, JUMPDEST], pc: -1, error: 'Internal error: program counter not in range' },
  { code: [STOP], pc: 3, error: 'Internal error: program counter not in range' },
  { code: [STOP], resultPC: 1 }
]

tape('VM.runcode: initial program counter', t => {
  const vm = new VM()

  testCases.forEach((testData, i) => {
    t.test('should start the execution at the specified pc or 0 #' + i, async st => {
      const runCodeArgs = {
        code: Buffer.from(testData.code.join(''), 'hex'),
        pc: testData.pc,
        gasLimit: new BN(0xffff)
      }

      let err
      try {
        const result = await vm.runCode(runCodeArgs)
        if (testData.resultPC !== undefined) {
          t.equals(result.runState.programCounter, testData.resultPC, 'runstate.programCounter')
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
