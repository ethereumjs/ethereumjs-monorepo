import { describe, it } from 'vitest'

import { GeneralStateTests } from '../runners/GeneralStateTestsRunner'
import { defaultStateTestArgs } from '../runners/runnerUtils'

const input = process.env.FORK ?? 'Paris'
const hardforks = input.split(',')
describe(`VM State Test: All-Forks = ${hardforks} `, async () => {
  for await (const hardfork of hardforks) {
    const testArgs = defaultStateTestArgs
    testArgs.state = true
    testArgs.fork = hardfork
    const test = new GeneralStateTests(testArgs)
    it(`${testArgs.fork} (${test.expectedTests})`, async () => {
      await test.runTests()
    })
  }
})
