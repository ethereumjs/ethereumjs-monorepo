import * as minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

if (argv.b === true) {
  require('./base.spec')
} else if (argv.l === true) {
  require('./legacy.spec')
} else if (argv.e === true) {
  require('./typedTxsAndEIP2930.spec')
  require('./eip1559.spec')
} else if (argv.t === true) {
  require('./transactionRunner')
} else if (argv.f === true) {
  require('./transactionFactory.spec')
} else if (argv.a === true) {
  // All manual API tests
  require('./base.spec')
  require('./legacy.spec')
  require('./typedTxsAndEIP2930.spec')
  require('./eip1559.spec')
  require('./transactionFactory.spec')
} else {
  require('./transactionRunner')
  require('./base.spec')
  require('./legacy.spec')
  require('./typedTxsAndEIP2930.spec')
  require('./eip1559.spec')
  require('./transactionFactory.spec')
}
