import { describe, it } from 'vitest'

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
  forks: parseInput(process.env.FORK),
  file: parseInput(process.env.FILE),
  count: parseInput(process.env.COUNT),
  test: parseInput(process.env.TEST) ?? defaultBlockchainTestArgs.test,
  skip: parseInput(process.env.SKIP) ?? defaultBlockchainTestArgs.skip,
  customStateTest:
    parseInput(process.env.CUSTOMSTATETEST) ?? defaultBlockchainTestArgs.customStateTest,
  jsontrace: parseInput(process.env.JSONTRACE, true) !== undefined,
  data: parseInput(process.env.DATA) !== undefined ? parseInt(process.env.DATA!) : undefined,
  gas: parseInput(process.env.GAS) !== undefined ? parseInt(process.env.GAS!) : undefined,
  value: parseInput(process.env.VALUE) !== undefined ? parseInt(process.env.VALUE!) : undefined,
}

const forks = input.forks ?? 'Paris'
const hardforks = forks.split(',')
describe(
  `VM Blockchain Test: ${input.file !== undefined ? input.file : hardforks} `,
  async () => {
    const testArgs = { ...defaultBlockchainTestArgs, ...input }
    for await (const hardfork of hardforks) {
      testArgs.file !== undefined && (testArgs['verify-test-amount-alltests'] = 0)
      testArgs.count !== undefined && (testArgs['expected-test-amount'] = parseInt(testArgs.count))
      testArgs.fork = hardfork
      const test = new BlockchainTests(testArgs)
      console.log({
        test: 'blockchain',
        skip: testArgs.skip,
        runSkipped: testArgs.runSkipped,
        fork: testArgs.fork,
        expected: test.expectedTests,
      })
      it(`${testArgs.fork} (${test.expectedTests})`, async () => {
        await test.runTests()
      })
    }
  },
  { timeout: 10000 }
)
