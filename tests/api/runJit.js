const tape = require('tape')
const runJit = require('../../dist/runJit')
const exceptions = require('../../dist/exceptions')

tape('Should run code with func type', (t) => {
  // TODO: Determine if account is still necessary for runJit
  // as the callers don't seem to be using results.account
  const opts = {
    account: 'account',
    code: (o) => ({ exceptionError: new exceptions.VmError('Invalid opcode') })
  }

  const vm = {}
  runJit.bind(vm)(opts, (err, res) => {
    t.ok(err, 'error should be set')
    t.equal(err.errorType, 'VmError')
    t.equal(err, res.exceptionError, 'callback error should be taken from exceptionError')
    t.equal(res.account, 'account')
    t.end()
  })
})

tape('should run stringy code', (t) => {
  const opts = {
    account: 'account',
    code: `return { exceptionError: null }`
  }

  const vm = {}
  runJit.bind(vm)(opts, (err, res) => {
    t.error(err, 'error should be null')
    t.error(res.exceptionError, 'exceptionError should be null')
    t.equal(res.account, 'account')
    t.end()
  })
})
