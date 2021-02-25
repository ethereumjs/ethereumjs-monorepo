import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

if (argv.l) {
  require('./legacy.spec')
} else if (argv.e) {
  require('./eip2930.spec')
} else if (argv.t) {
  require('./transactionRunner')
} else {
  require('./legacy.spec')
  require('./transactionRunner')
  require('./transactionFactory.spec')
  require('./eip2930.spec')
}
