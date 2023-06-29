import { suite } from 'vitest'

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
  ['verify-test-amount-alltests']: 0,
  count: parseInput(process.env.COUNT) !== undefined ? parseInt(process.env.COUNT!) : undefined,
  fork: parseInput(process.env.FORK) ?? 'Paris',
  test: parseInput(process.env.TEST) ?? defaultStateTestArgs.test,
  skip: parseInput(process.env.SKIP) ?? defaultStateTestArgs.skip,
  customStateTest: parseInput(process.env.CUSTOMSTATETEST) ?? defaultStateTestArgs.customStateTest,
  jsontrace: parseInput(process.env.JSONTRACE, true) !== undefined,
  data: parseInput(process.env.DATA) !== undefined ? parseInt(process.env.DATA!) : undefined,
  gas: parseInput(process.env.GAS) !== undefined ? parseInt(process.env.GAS!) : undefined,
  value: parseInput(process.env.VALUE) !== undefined ? parseInt(process.env.VALUE!) : undefined,
}

const testArgs = { ...defaultStateTestArgs, ...input }
if (testArgs.test !== undefined || testArgs.customStateTest !== undefined) {
  testArgs['verify-test-amount-alltests'] = 0
}
const test = new GeneralStateTests(testArgs)
console.log({
  test: 'state',
  skip: testArgs.skip,
  runSkipped: testArgs.runSkipped,
  fork: testArgs.fork,
  expected: test.expectedTests,
})
const runSuite = suite(`${testArgs.fork} (${test.expectedTests})`, async () => {
  await test.runTests()
})

runSuite.on('beforeAll', (suite) => {
  const testSuite = {
    ...testArgs,
    test: 'state',
    verifyTestAmountAllTests: testArgs['verify-test-amount-alltests'] > 0 ? true : false,
    expected: test.expectedTests > 0 ? test.expectedTests : suite.tasks.length,
    tasks: suite.tasks.length,
  }
  console.log(
    Object.fromEntries(
      Object.entries(testSuite).filter(([_, value]) => value !== undefined && value !== '')
    )
  )
})

runSuite.on('afterAll', (suite) => {
  const completed: Map<string, string[]> = new Map()
  for (const task of suite.tasks) {
    const [name, id] = task.name.split(':')
    if (!completed.has(name)) {
      completed.set(name, [])
    }
    completed.get(name)!.push(id.slice(name.length + 1))
  }
  console.log(`Completed: ${suite.tasks.length}`)
  console.log(Object.fromEntries([...completed.entries()].map(([name, ids]) => [name, ids.length])))
})
