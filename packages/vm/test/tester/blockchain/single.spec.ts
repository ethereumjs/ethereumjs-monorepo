import { describe } from 'vitest'

import { BlockchainTests } from '../runners/BlockchainTestsRunner'
import { defaultBlockchainTestArgs } from '../runners/runnerUtils'

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
const blockchaintest = new BlockchainTests(testArgs)
console.log({
  test: 'blockchain',
  skip: testArgs.skip,
  runSkipped: testArgs.runSkipped,
  fork: testArgs.fork,
  expected: blockchaintest.expectedTests,
})
describe(`${testArgs.fork} (${blockchaintest.expectedTests})`, async () => {
  await blockchaintest.runTests()
})
