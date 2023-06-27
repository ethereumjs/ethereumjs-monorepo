import { describe, it } from 'vitest'

import { BlockchainTests } from '../runners/BlockchainTestsRunner'
import { defaultBlockchainTestArgs } from '../runners/runnerUtils'

const forks = process.env.FORK ?? 'Paris'
const hardforks = forks.split(',')
const files =
  process.env.FILE !== undefined ? forks.split(process.env.FILE) : [defaultBlockchainTestArgs.file]
describe(`VM Blockchain Test: ${files !== undefined ? files : hardforks} `, async () => {
  for await (const file of files) {
    const testArgs = defaultBlockchainTestArgs
    testArgs.file = file
    for await (const hardfork of hardforks) {
      file !== undefined && (testArgs['verify-test-amount-alltests'] = 0)
      testArgs.blockchain = true
      testArgs.fork = hardfork
      const test = new BlockchainTests(testArgs)
      it(`${testArgs.fork} (${test.expectedTests})`, async () => {
        await test.runTests()
      })
    }
  }
})
