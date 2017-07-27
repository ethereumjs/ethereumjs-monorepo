const argv = require('minimist')(process.argv.slice(2))
const async = require('async')
const tape = require('tape')
const testing = require('ethereumjs-testing')
const FORK_CONFIG = argv.fork || 'EIP158'
const skip = [
  'CreateHashCollision', // impossible hash collision on generating address
  'SuicidesMixingCoinbase', // sucides to the coinbase, since we run a blockLevel we create coinbase account.
  'TransactionMakeAccountBalanceOverflow',
  'RecursiveCreateContracts',
  'sha3_bigSize',
  'createJS_ExampleContract', // creates an account that already exsists
  'mload32bitBound_return',
  'mload32bitBound_return2',
  'QuadraticComplexitySolidity_CallDataCopy', // tests hash collisoin, sending from a contract
  'Call50000', // slow
  'Call50000_ecrec', // slow
  'Call50000_identity', // slow
  'Call50000_identity2', // slow
  'Call50000_sha256', // slow
  'Call50000_rip160', // slow
  'Call50000bytesContract50_1', // slow
  'Call50000bytesContract50_2',
  'Callcode50000', // slow
  'Return50000', // slow
  'Return50000_2', // slow
  'uncleBlockAtBlock3AfterBlock3',
  'ForkUncle', // correct behaviour unspecified (?)
  'UncleFromSideChain', // same as ForkUncle, the TD is the same for two diffent branches so its not clear which one should be the finally chain
  'bcSimpleTransitionTest', // HF stuff
  'CALL_Bounds', // nodejs crash
  'CALLCODE_Bounds', // nodejs crash
  'CREATE_Bounds', // nodejs crash
  'DELEGATECALL_Bounds', // nodejs crash
  'RevertDepthCreateAddressCollision', // test case is wrong
  'zeroSigTransactionInvChainID' // metropolis test
]

/*
NOTE: VM tests have been disabled since they are generated using Frontier gas costs, and ethereumjs-vm doesn't support historical fork rules

TODO: some VM tests do not appear to be executing (don't print an "ok" statement):
...
# file: vmLogTest test: log0_emptyMem
ok 38984 valid gas usage
# file: vmLogTest test: log0_logMemStartTooHigh
# file: vmLogTest test: log0_logMemsizeTooHigh
# file: vmLogTest test: log0_logMemsizeZero
ok 38985 valid gas usage
# file: vmLogTest test: log0_nonEmptyMem
*/

const skipVM = [
  // slow performance tests
  'loop-mul',
  'loop-add-10M',
  'loop-divadd-10M',
  'loop-divadd-unr100-10M',
  'loop-exp-16b-100k',
  'loop-exp-1b-1M',
  'loop-exp-2b-100k',
  'loop-exp-32b-100k',
  'loop-exp-4b-100k',
  'loop-exp-8b-100k',
  'loop-exp-nop-1M',
  'loop-mulmod-2M',
  // some VM tests fail because the js runner executes CALLs
  // see https://github.com/ethereum/tests/wiki/VM-Tests  > Since these tests are meant only as a basic test of VM operation, the CALL and CREATE instructions are not actually executed.
  'ABAcalls0',
  'ABAcallsSuicide0',
  'ABAcallsSuicide1',
  'CallRecursiveBomb0',
  'CallToNameRegistrator0',
  'CallToPrecompiledContract',
  'CallToReturn1',
  'PostToNameRegistrator0',
  'PostToReturn1',
  'callcodeToNameRegistrator0',
  'callcodeToReturn1',
  'callstatelessToNameRegistrator0',
  'callstatelessToReturn1',
  'createNameRegistrator'
]

if (argv.r) {
  randomized(argv.r, argv.v)
} else if (argv.s) {
  runTests('GeneralStateTests', argv)
} else if (argv.v) {
  runTests('VMTests', argv)
} else if (argv.b) {
  runTests('BlockchainTests', argv)
} else if (argv.a) {
  runAll()
}

// randomized tests
// returns 1 if the tests fails
// returns 0 if the tests succeds
function randomized (stateTest) {
  const stateRunner = require('./stateRunner.js')
  let errored = false

  tape.createStream({
    objectMode: true
  }).on('data', function (row) {
    if (row.ok === false && !errored) {
      errored = true
      process.stdout.write('1')
      process.exit()
    }
  }).on('end', function () {
    process.stdout.write('0')
  })

  try {
    stateTest = JSON.parse(stateTest)
  } catch (e) {
    console.error('invalid json')
    process.exit()
  }

  var keys = Object.keys(stateTest)
  stateTest = stateTest[keys[0]]

  tape('', t => {
    stateRunner({}, stateTest, t, t.end)
  })
}

function runTests (name, runnerArgs, cb) {
  let testGetterArgs = {}
  testGetterArgs.skipTests = skip
  testGetterArgs.skipVM = skipVM
  testGetterArgs.forkConfig = FORK_CONFIG
  testGetterArgs.file = argv.file
  testGetterArgs.test = argv.test

  runnerArgs.forkConfig = FORK_CONFIG
  runnerArgs.debug = argv.debug // for BlockchainTests
  // runnerArgs.vmtrace = true; // for VMTests

  tape(name, t => {
    const runner = require(`./${name}Runner.js`)
    testing.getTestsFromArgs(name, (fileName, testName, test) => {
      return new Promise((resolve, reject) => {
        if (name === 'VMTests') {
          // suppress some output of VMTests
          // t.comment(`file: ${fileName} test: ${testName}`)
          test.fileName = fileName
          test.testName = testName
          runner(runnerArgs, test, t, resolve)
        } else {
          t.comment(`file: ${fileName} test: ${testName}`)
          runner(runnerArgs, test, t, resolve)
        }
      }).catch(err => console.log(err))
    }, testGetterArgs).then(() => {
      t.end()
    })
  })
}

function runAll () {
  require('./tester.js')
  require('./cacheTest.js')
  require('./genesishashes.js')
  async.series([
    // runTests.bind(this, 'VMTests', {}), // VM tests disabled since we don't support Frontier gas costs
    runTests.bind(this, 'GeneralStateTests', {}),
    runTests.bind(this, 'BlockchainTests', {})
  ])
}
