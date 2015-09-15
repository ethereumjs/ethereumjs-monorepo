const argv = require('minimist')(process.argv.slice(2))
const testing = require('ethereumjs-testing')
const runner = require('./transactionRunner.js')

if (argv.a) {
  runAll()
} else {
  runOffical()
}

function runOffical (cb) {
  var tests = testing.getTests('transaction', argv)
  testing.runTests(runner, tests, cb)
}

function runAll () {
  runOffical()
  require('./transactions.js')
}
