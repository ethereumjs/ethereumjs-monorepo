import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

if (argv.a) {
  require('./api.spec')
} else if (argv.t) {
  require('./transactionRunner')
} else {
  require('./api.spec')
  require('./transactionRunner')
  require('./transactionFactory.spec')
  require('./eip2930.spec')
}
