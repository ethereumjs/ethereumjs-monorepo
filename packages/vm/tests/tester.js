#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const tape = require('tape')
const testing = require('ethereumjs-testing')
const config = require('./config')

function runTests() {
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
  let runnerArgs = argv
  runnerArgs.forkConfigVM = FORK_CONFIG_VM
  runnerArgs.forkConfigTestSuite = FORK_CONFIG_TEST_SUITE
  runnerArgs.jsontrace = argv.jsontrace
  runnerArgs.data = argv.data // GeneralStateTests
  runnerArgs.gasLimit = argv.gas // GeneralStateTests
  runnerArgs.value = argv.value // GeneralStateTests
  runnerArgs.debug = argv.debug // BlockchainTests

  if (argv.customStateTest) {
    const stateTestRunner = require('./GeneralStateTestsRunner.js')
    let fileName = argv.customStateTest
    tape(name, t => {
      testing.getTestFromSource(fileName, async (err, test) => {
        if (err) {
          return t.fail(err)
        }
        t.comment(`file: ${fileName} test: ${test.testName}`)
        await stateTestRunner(runnerArgs, test, t)
        t.end()
      })
    })
  } else {
    tape(name, t => {
      const runner = require(`./${name}Runner.js`)
      // Tests for HFs before Istanbul have been moved under `LegacyTests/Constantinople`:
      // https://github.com/ethereum/tests/releases/tag/v7.0.0-beta.1

      // TODO: Replace with Common.lteHardfork('Istanbul')
      if (testGetterArgs.forkConfig !== 'Istanbul') {
        name = 'LegacyTests/Constantinople/'.concat(name)
      }
      testing.getTestsFromArgs(
        name,
        async (fileName, testName, test) => {
          let runSkipped = testGetterArgs.runSkipped
          let inRunSkipped = runSkipped.includes(fileName)
          if (runSkipped.length === 0 || inRunSkipped) {
            t.comment(`file: ${fileName} test: ${testName}`)
            await runner(runnerArgs, test, t)
          }
        },
        testGetterArgs,
      )
      .then(() => {
        t.end()
      })
      .catch((error) => {
        t.comment(error)
      })
    })
  }
}

runTests()
