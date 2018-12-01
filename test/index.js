const argv = require('minimist')(process.argv.slice(2))

if (argv.f) {
  require('./fake.js')
} else if (argv.a) {
  require('./api.js')
} else if (argv.t) {
  require('./transactionRunner.js')
} else {
  require('./fake.js')
  require('./api.js')
  require('./transactionRunner.js')
}
