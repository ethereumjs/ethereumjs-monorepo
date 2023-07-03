import { suite } from 'vitest'

import { BlockchainTests } from '../runners/BlockchainTestsRunner'
import { defaultBlockchainTestArgs } from '../runners/runnerUtils'

import type { TestArgs } from '../runners/runnerUtils'
const CLI_ARGS: (keyof TestArgs)[] = [
  'state',
  'blockchain',
  'fork',
  'file',
  'test',
  'dir',
  'excludeDir',
  'testsPath',
  'customTestsPath',
  'customStateTest',
  'jsontrace',
  'dist',
  'data',
  'gas',
  'value',
  'debug',
  'expected-test-amount',
  'reps',
]

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
const _input: Partial<Record<keyof TestArgs, string | number | undefined>> = {
  skip: parseInput(process.env.SKIP) ?? defaultBlockchainTestArgs.skip,
  runSkipped: parseInput(process.env.RUNSKIPPED) ?? defaultBlockchainTestArgs.runSkipped,
  'verify-test-amount-alltests': 0,
}
for (const arg of CLI_ARGS) {
  _input[arg] = parseInput(process.env[arg.toUpperCase()])
}
const input: TestArgs = _input as TestArgs

const testArgs = { ...defaultBlockchainTestArgs, ...input }
testArgs.file !== undefined && (testArgs['verify-test-amount-alltests'] = 0)
const blockchainTest = new BlockchainTests(testArgs)
const runSuite = suite(
  `${testArgs.fork} (${testArgs.dir ?? blockchainTest.expectedTests})`,
  async () => {
    await blockchainTest.runTests()
  }
)

runSuite.on('beforeAll', (suite) => {
  const testSuite = {
    ...testArgs,
    test: 'blockchain',
    verifyTestAmountAllTests: testArgs['verify-test-amount-alltests'] > 0 ? true : false,
    expected: blockchainTest.expectedTests > 0 ? blockchainTest.expectedTests : suite.tasks.length,
    tasks: suite.tasks.length,
  }
  console.log({
    excludeDirArg: testArgs.excludeDir,
    excludeDirEnv: process.env.EXCLUDEDIR,
    excludeDirSte: testSuite.excludeDir,
    excludeDirInp: input.excludeDir,
  })
  console.log(
    Object.fromEntries(
      Object.entries(testSuite).filter(([_, value]) => value !== undefined && value !== '')
    )
  )
})

runSuite.on('afterAll', (suite) => {
  const completed: Map<string, string[]> = new Map()
  for (const task of suite.tasks) {
    if (!completed.has(task.name)) {
      completed.set(task.name, [])
    }
    completed.get(task.name)!.push(task.id)
  }
  console.log(`Completed: ${suite.tasks.length}`)
  console.log(Object.fromEntries([...completed.entries()].map(([name, ids]) => [name, ids.length])))
})
console.log('Running tests...')
console.log(runSuite)
runSuite
