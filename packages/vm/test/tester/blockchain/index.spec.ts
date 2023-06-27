import { describe, it } from 'vitest'

import { BlockchainTests } from '../runners/BlockchainTestsRunner'
import { defaultBlockchainTestArgs } from '../runners/runnerUtils'

const forks = process.env.FORK ?? 'Paris'
const hardforks = forks.split(',')
const file = process.env.FILE
const dir = process.env.DIR
const excludeDir = process.env.EXCLUDEDIR
const count = process.env.COUNT
describe(
  `VM Blockchain Test: ${file !== undefined ? file : hardforks} `,
  async () => {
    const testArgs = defaultBlockchainTestArgs
    testArgs.file = file
    testArgs.dir = dir
    testArgs.excludeDir = excludeDir
    for await (const hardfork of hardforks) {
      file !== undefined && (testArgs['verify-test-amount-alltests'] = 0)
      count !== undefined && (testArgs['expected-test-amount'] = parseInt(count))
      testArgs.blockchain = true
      testArgs.fork = hardfork
      const test = new BlockchainTests(testArgs)
      it(`${testArgs.fork} (${test.expectedTests})`, async () => {
        await test.runTests()
      })
    }
  },
  { timeout: 10000 }
)
