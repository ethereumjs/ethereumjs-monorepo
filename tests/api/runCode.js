const tape = require('tape')
const async = require('async')
const VM = require('../../lib/index')

const STOP = '00'
const JUMP = '56'
const JUMPDEST = '5b'
const PUSH1 = '60'

const testCases = [
  { code: [STOP, JUMPDEST, PUSH1, '05', JUMP, JUMPDEST], pc: 1, resultPC: 6 },
  { code: [STOP, JUMPDEST, PUSH1, '05', JUMP, JUMPDEST], pc: -1, error: 'invalid opcode' },
  { code: [STOP], pc: 3, error: 'invalid opcode' },
  { code: [STOP], resultPC: 1 }
]

tape('VM.runcode: initial program counter', function (t) {
  const vm = new VM()

  testCases.forEach(function (testData, i) {
    t.test('should start the execution at the specified pc or 0 #' + i, function (st) {
      const runCodeArgs = {
        code: Buffer.from(testData.code.join(''), 'hex'),
        pc: testData.pc,
        gasLimit: 0xffff
      }
      let result

      async.series([
        function (done) {
          vm.runCode(runCodeArgs, function (err, res) {
            if (res) {
              result = res
            }

            done(err)
          })
        },
        function (done) {
          if (testData.resultPC !== undefined) {
            t.equals(result.runState.programCounter, testData.resultPC, 'runstate.programCounter')
          }

          done()
        }
      ], function (err) {
        if (testData.error) {
          err = err ? err.error : 'no error thrown'
          t.equals(err, testData.error, 'error message should match')
          err = false
        }

        t.assert(!err)
        st.end()
      })
    })
  })
})
