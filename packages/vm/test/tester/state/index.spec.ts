import { describe, it } from 'vitest'

import { GeneralStateTests } from '../runners/GeneralStateTestsRunner'
import { defaultStateTestArgs } from '../runners/runnerUtils'

const input = {
  forks: process.env.FORK?.split(',') ?? ['paris'],
  test: process.env.TEST,
  skip: process.env.SKIP ?? defaultStateTestArgs.skip,
  customStateTest: process.env.CUSTOMSTATETEST,
  jsontrace: process.env.JSONTRACE !== undefined,
  data: process.env.DATA !== undefined ? parseInt(process.env.DATA) : undefined,
  gas: process.env.GAS !== undefined ? parseInt(process.env.GAS) : undefined,
  value: process.env.VALUE !== undefined ? parseInt(process.env.VALUE) : undefined,
}

describe(`VM State Test: ${input.forks} `, async () => {
  const testArgs = { ...defaultStateTestArgs, ...input }
  if (testArgs.test !== undefined || testArgs.customStateTest !== undefined) {
    testArgs['verify-test-amount-alltests'] = 0
  }
  for await (const hardfork of input.forks) {
    testArgs.state = true
    testArgs.fork = hardfork
    const test = new GeneralStateTests(testArgs)
    it(`${testArgs.fork} (${test.expectedTests})`, async () => {
      await test.runTests()
    })
  }
})
