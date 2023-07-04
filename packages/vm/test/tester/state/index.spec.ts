import { suite } from 'vitest'

import { GeneralStateTests } from '../runners/GeneralStateTestsRunner'
import { defaultStateTestArgs } from '../runners/runnerUtils'

const parseInput = (input: string | undefined, bool: boolean = false) => {
  if (input === undefined) {
    return undefined
  }
  if (input === '') {
    return undefined
  }
  if (input === 'true' && bool === false) {
    return undefined
  }
  return input
}

const input = {
  ['verify-test-amount-alltests']: parseInput(process.env.VERIFY_ALLTESTS) === undefined ? 0 : 1,
  count: parseInput(process.env.COUNT) !== undefined ? parseInt(process.env.COUNT!) : undefined,
  fork: parseInput(process.env.FORK) ?? 'Paris',
  test: parseInput(process.env.STATETEST),
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
console.log('----------TEST_ARGS------------')
console.log(Object.fromEntries(Object.entries(testArgs).filter(([_, v]) => v !== undefined)))
console.log('-------------------------------')

const forkSuite = suite(`${testArgs.fork} (${test.expectedTests})`, async () => {
  await test.runTests()
})

forkSuite.on('beforeAll', async () => {
  console.log('----------TEST_FORK------------')
  console.log(`${testArgs.fork} > test: ${testArgs.test}`)
  testArgs.test !== undefined &&
    console.log(`${' '.repeat(testArgs.fork.length)} > expected_tests: (${test.expectedTests})`)
  console.log('-------------------------------')
})

forkSuite.on('afterAll', async (context) => {
  let totalTestRun = 0
  let totalPassing = 0
  for await (const dir of context.tasks) {
    if (!('tasks' in dir)) {
      continue
    }
    for await (const subDir of (dir as any).tasks) {
      for await (const file of subDir.tasks) {
        const passing = file.tasks.filter((t: any) => t.result.state === 'pass').length
        totalTestRun += file.tasks.length
        totalPassing += passing
        // for await (const test of file.tasks) {
        // const passing = test.tasks.filter((t: any) => t.result.state === 'pass').length
        // totalTestRun += test.tasks.length
        // totalPassing += passing
        // }
      }
    }
  }
  console.log('---------RESULT----------------')
  console.log(`${testArgs.fork} > totalChecks: (${test.testCount} / ${test.expectedTests})`)
  console.log(`${' '.repeat(testArgs.fork.length)} > totalTests: (${totalTestRun})`)
  console.log(`${' '.repeat(testArgs.fork.length)} > totalPassing: (${totalPassing})`)
  console.log('-------------------------------')
})
