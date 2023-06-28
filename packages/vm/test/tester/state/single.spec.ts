import { describe } from 'vitest'

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
  fork: parseInput(process.env.FORK),
  test: parseInput(process.env.TEST) ?? defaultStateTestArgs.test,
  skip: parseInput(process.env.SKIP) ?? defaultStateTestArgs.skip,
  customStateTest: parseInput(process.env.CUSTOMSTATETEST) ?? defaultStateTestArgs.customStateTest,
  jsontrace: parseInput(process.env.JSONTRACE, true) !== undefined,
  data: parseInput(process.env.DATA) !== undefined ? parseInt(process.env.DATA!) : undefined,
  gas: parseInput(process.env.GAS) !== undefined ? parseInt(process.env.GAS!) : undefined,
  value: parseInput(process.env.VALUE) !== undefined ? parseInt(process.env.VALUE!) : undefined,
}

const testArgs = { ...defaultStateTestArgs, ...input }
const statetest = new GeneralStateTests(testArgs)
console.log({
  test: 'state',
  skip: testArgs.skip,
  runSkipped: testArgs.runSkipped,
  fork: testArgs.fork,
  expected: statetest.expectedTests,
})
describe(`${testArgs.fork} (${statetest.expectedTests})`, async () => {
  await statetest.runTests()
})
