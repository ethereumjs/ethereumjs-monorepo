import { isTruthy } from '@ethereumjs/util'
import * as minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

if (isTruthy(argv.b)) {
  require('./base.spec')
} else if (isTruthy(argv.l)) {
  require('./legacy.spec')
} else if (isTruthy(argv.e)) {
  require('./typedTxsAndEIP2930.spec')
  require('./eip1559.spec')
} else if (isTruthy(argv.t)) {
  require('./transactionRunner')
} else if (isTruthy(argv.f)) {
  require('./transactionFactory.spec')
} else if (isTruthy(argv.a)) {
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
