import * as minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

if (argv.f) {
  require('./fake')
} else if (argv.a) {
  require('./api')
} else if (argv.t) {
  require('./transactionRunner')
} else {
  require('./fake')
  require('./api')
  require('./transactionRunner')
}
