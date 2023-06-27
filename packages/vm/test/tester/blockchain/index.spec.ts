import { describe, it } from 'vitest'

import { BlockchainTests } from '../runners/BlockchainTestsRunner'
import { defaultBlockchainTestArgs } from '../runners/runnerUtils'

const input = process.env.FORK ?? 'Paris'
const hardforks = input.split(',')

describe(`VM Blockchain Test: ${hardforks} `, async () => {
  for await (const hardfork of hardforks) {
    const testArgs = defaultBlockchainTestArgs
    testArgs.blockchain = true
    testArgs.fork = hardfork
    const test = new BlockchainTests(testArgs)
    it(`${testArgs.fork} (${test.expectedTests})`, async () => {
      await test.runTests()
    })
  }
})
