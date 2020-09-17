#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const tape = require('tape')
const config = require('./config')
const testLoader = require('./testLoader')
const Common = require('@ethereumjs/common').default

/**
 * Test runner 
 * CLI arguments:
 * --state: run state tests
 * --blockchain: run blockchain tests
 * --fork: fork to use for these tests
 * --skip: comma seperated list of tests to skip. choices of: all,broken,permanent,slow. Defaults to all
 * --runSkipped: comma seperated list of tests to skip if --skip is not set. choices of: all,broken,permanent,slow. Defaults to none
 * --file: test file to run
 * --test: test name to run
 * --dir: test directory to look for tests
 * --excludeDir: test directory to exlude from testing
 * --testsPath: root directory of tests to look
 * --customStateTest: run a file with a custom state test (not in test directory)
 * --jsontrace: enable json step tracing in state tests
 * --dist: use the compiled version of the VM
 * --data: only run this state test if the transaction has this calldata
 * --gas: only run this state test if the transaction has this gasLimit
 * --value: only run this state test if the transaction has this call value
 * --debug: enable BlockchainTests debugger (compares post state against the expected post state)
 * --expected-test-amount: (optional) if present, check after tests are ran if at least this amount of tests have passed (inclusive)
 * --verify-test-amount-alltests: if this is passed, get the expected amount from tests and verify afterwards if this is the count of tests (expects tests are ran with default settings)
 */

async function runTests() {
  let name
  if (argv.state) {
    name = 'GeneralStateTests'
  } else if (argv.blockchain) {
    name = 'BlockchainTests'
  }

  const FORK_CONFIG = (argv.fork || config.DEFAULT_FORK_CONFIG)
  const FORK_CONFIG_TEST_SUITE = config.getRequiredForkConfigAlias(FORK_CONFIG)

  // Examples: Istanbul -> istanbul, MuirGlacier -> muirGlacier
  const FORK_CONFIG_VM = FORK_CONFIG.charAt(0).toLowerCase() + FORK_CONFIG.substring(1)

  /**
   * Configuration for getting the tests from the ethereum/tests repository
   */
  let testGetterArgs = {}
  testGetterArgs.skipTests = config.getSkipTests(argv.skip, argv.runSkipped ? 'NONE' : 'ALL')
  testGetterArgs.runSkipped = config.getSkipTests(argv.runSkipped, 'NONE')
  testGetterArgs.forkConfig = FORK_CONFIG_TEST_SUITE
  testGetterArgs.file = argv.file
  testGetterArgs.test = argv.test
  testGetterArgs.dir = argv.dir
  testGetterArgs.excludeDir = argv.excludeDir
  testGetterArgs.testsPath = argv.testsPath
  testGetterArgs.customStateTest = argv.customStateTest

  /**
   * Run-time configuration
   */
  let runnerArgs = {}
  runnerArgs.forkConfigVM = FORK_CONFIG_VM
  runnerArgs.forkConfigTestSuite = FORK_CONFIG_TEST_SUITE
  runnerArgs.common = config.getCommon(FORK_CONFIG_VM)
  runnerArgs.jsontrace = argv.jsontrace
  runnerArgs.dist = argv.dist
  runnerArgs.data = argv.data // GeneralStateTests
  runnerArgs.gasLimit = argv.gas // GeneralStateTests
  runnerArgs.value = argv.value // GeneralStateTests
  runnerArgs.debug = argv.debug // BlockchainTests

  let expectedTests
  if (argv['verify-test-amount-alltests']) {
    expectedTests = config.getExpectedTests(FORK_CONFIG_VM, name)
  } else if (argv['expected-test-amount']) {
    expectedTests = argv['expected-test-amount']
  }

  /**
   * Initialization output to console
   */
  const width = 50
  const fillWidth = width
  const fillParam = 20
  const delimiter = `| `.padEnd(fillWidth) + ' |'
  const formatArgs = (args) => {
    return Object.assign({}, ...
      Object.entries(args)
      .filter(([k,v]) => v && v.length !== 0)
      .map(([k,v]) => ({[k]:typeof(v) !== 'string' && v.length ? v.length : v}))
    )
  }
  const formattedGetterArgs = formatArgs(testGetterArgs)
  const formattedRunnerArgs = formatArgs(runnerArgs)
  
  console.log(`+${'-'.repeat(width)}+`)
  console.log(`| VM -> ${name} `.padEnd(fillWidth) + ' |')
  console.log(delimiter)
  console.log(`| TestGetterArgs`.padEnd(fillWidth) + ' |')
  for (const [key, value] of Object.entries(formattedGetterArgs)) {
    console.log(`| ${key.padEnd(fillParam)}: ${value}`.padEnd(fillWidth) + ' |')
  }
  console.log(delimiter)
  console.log(`| RunnerArgs`.padEnd(fillWidth) + ' |')
  for (const [key, value] of Object.entries(formattedRunnerArgs)) {
    if (key == "common") {
      const hf = value.hardfork()
      console.log(`| ${key.padEnd(fillParam)}: ${hf}`.padEnd(fillWidth) + ' |')
    } else {
      console.log(`| ${key.padEnd(fillParam)}: ${value}`.padEnd(fillWidth) + ' |')
    }
  }
  console.log(`+${'-'.repeat(width)}+`)
  console.log()

  if (argv.customStateTest) {
    const stateTestRunner = require('./GeneralStateTestsRunner.js')
    let fileName = argv.customStateTest
    tape(name, t => {
      testLoader.getTestFromSource(fileName, async (err, test) => {
        if (err) {
          return t.fail(err)
        }
        t.comment(`file: ${fileName} test: ${test.testName}`)
        await stateTestRunner(runnerArgs, test, t)
        t.end()
      })
    })
  } else {
    tape(name, async t => {
      let testIdentifier
      let failingTests = {}
      t.on('result', (o) => {
        if ((o.ok != undefined) && !o.ok) {
          if (failingTests[testIdentifier]) {
            failingTests[testIdentifier].push(o.name)
          } else {
            failingTests[testIdentifier] = [o.name]
          }
        }
      })
      const runner = require(`./${name}Runner.js`)
      // Tests for HFs before Istanbul have been moved under `LegacyTests/Constantinople`:
      // https://github.com/ethereum/tests/releases/tag/v7.0.0-beta.1

      const dirs = config.getTestDirs(FORK_CONFIG_VM, name)
      for (let dir of dirs) {
        await new Promise((resolve, reject) => {
          testLoader.getTestsFromArgs(
            dir,
            async (fileName, testName, test) => {
              let runSkipped = testGetterArgs.runSkipped
              let inRunSkipped = runSkipped.includes(fileName)
              if (runSkipped.length === 0 || inRunSkipped) {
                testIdentifier = `file: ${fileName} test: ${testName}`
                t.comment(testIdentifier)
                await runner(runnerArgs, test, t)
              }
            },
            testGetterArgs,
          )
          .then(() => {
            resolve()
          })
          .catch((error) => {
            t.fail(error)
            reject()
          })
        })
      }

      for (let failingTestIdentifier in failingTests) {
        console.log("Errors thrown in " + failingTestIdentifier + ":")
        const errors = failingTests[failingTestIdentifier]
        for (let i = 0; i < errors.length; i++) {
          console.log("\t" + errors[i])
        }
      }

      if (expectedTests) {
        t.ok(t.assertCount >= expectedTests, "expected " + expectedTests + " checks, got " + t.assertCount)
      }

      t.end()

    })
  }
}

runTests()
