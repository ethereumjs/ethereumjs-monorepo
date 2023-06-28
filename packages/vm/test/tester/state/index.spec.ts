import { describe, it } from 'vitest'

import { GeneralStateTests } from '../runners/GeneralStateTestsRunner'
import { defaultStateTestArgs } from '../runners/runnerUtils'

const parseInput = (input: string | undefined, bool: boolean = false) => {
  if (input === undefined) {
    return undefined
  }
  if (input === 'true' && bool === false) {
    return undefined
  }
  return input
}

const input = {
  forks: parseInput(process.env.FORK)?.split(',') ?? ['paris'],
  test: parseInput(process.env.TEST) ?? defaultStateTestArgs.test,
  skip: parseInput(process.env.SKIP) ?? defaultStateTestArgs.skip,
  customStateTest: parseInput(process.env.CUSTOMSTATETEST) ?? defaultStateTestArgs.customStateTest,
  jsontrace: parseInput(process.env.JSONTRACE, true) !== undefined,
  data: parseInput(process.env.DATA) !== undefined ? parseInt(process.env.DATA!) : undefined,
  gas: parseInput(process.env.GAS) !== undefined ? parseInt(process.env.GAS!) : undefined,
  value: parseInput(process.env.VALUE) !== undefined ? parseInt(process.env.VALUE!) : undefined,
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
    console.log({
      test: 'state',
      skip: testArgs.skip,
      runSkipped: testArgs.runSkipped,
      fork: testArgs.fork,
      expected: test.expectedTests,
    })
    it(`${testArgs.fork} (${test.expectedTests})`, async () => {
      await test.runTests()
    })
  }
})
