import { suite } from 'vitest'

import { BlockchainTests } from '../runners/BlockchainTestsRunner'
import { defaultBlockchainTestArgs } from '../runners/runnerUtils'

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
  ['verify-test-amount-alltests']: 0,
  count: parseInput(process.env.COUNT) !== undefined ? parseInt(process.env.COUNT!) : undefined,
  fork: parseInput(process.env.FORK),
  file: parseInput(process.env.FILE),
  dir: parseInput(process.env.DIR),
  excludedir: parseInput(process.env.EXCLUDEDIR),
  test: parseInput(process.env.TEST) ?? defaultBlockchainTestArgs.test,
  skip: parseInput(process.env.SKIP) ?? defaultBlockchainTestArgs.skip,
  customStateTest:
    parseInput(process.env.CUSTOMSTATETEST) ?? defaultBlockchainTestArgs.customStateTest,
  jsontrace: parseInput(process.env.JSONTRACE, true) !== undefined,
  data: parseInput(process.env.DATA) !== undefined ? parseInt(process.env.DATA!) : undefined,
  gas: parseInput(process.env.GAS) !== undefined ? parseInt(process.env.GAS!) : undefined,
  value: parseInput(process.env.VALUE) !== undefined ? parseInt(process.env.VALUE!) : undefined,
}

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

runSuite
