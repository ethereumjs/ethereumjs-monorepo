import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

if (argv.b) {
  import('./base.spec.js')
} else if (argv.l) {
  import('./legacy.spec.js')
} else if (argv.e) {
  import('./typedTxsAndEIP2930.spec.js')
  import('./eip1559.spec.js')
} else if (argv.t) {
  import('./transactionRunner.js')
} else if (argv.f) {
  import('./transactionFactory.spec.js')
} else if (argv.a) {
  // All manual API tests
  import('./base.spec.js')
  import('./legacy.spec.js')
  import('./typedTxsAndEIP2930.spec.js')
  import('./eip1559.spec.js')
  import('./transactionFactory.spec.js')
} else {
  import('./transactionRunner.js')
  import('./base.spec.js')
  import('./legacy.spec.js')
  import('./typedTxsAndEIP2930.spec.js')
  import('./eip1559.spec.js')
  import('./transactionFactory.spec.js')
}
