import { assert, describe, it } from 'vitest'

import fs from 'fs'
import path from 'path'

import { Common, Mainnet } from '@ethereumjs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { toBytes } from 'viem'
import { createVM } from '../../src/constructors.ts'
import { runTx } from '../../src/runTx.ts'
import { makeBlockFromEnv, makeTx, setupPreConditions } from '../util.ts'
import { loadExecutionSpecFixtures, parseTest } from './executionSpecTestLoader.ts'

const customFixturesPath = process.env.TEST_PATH ?? '../execution-spec-tests'
const fixturesPath = path.resolve(customFixturesPath)
const testFile = process.env.TEST_FILE
const testCase = process.env.TEST_CASE

console.log(`Using execution-spec state tests from: ${fixturesPath}`)
if (testFile !== undefined) {
  console.log(`Filtering tests to file: ${testFile}`)
}
if (testCase !== undefined) {
  console.log(`Filtering tests to case: ${testCase}`)
}

// Create KZG instance once at the top level (expensive operation)
const kzg = new microEthKZG(trustedSetup)

if (fs.existsSync(fixturesPath) === false) {
  describe('Execution-spec state tests', () => {
    it.skip(`fixtures not found at ${fixturesPath}`, () => {})
  })
} else {
  let fixtures = loadExecutionSpecFixtures(fixturesPath, 'state_tests')

  // Filter by TEST_FILE if provided (works with or without .json extension)
  if (testFile !== undefined) {
    const normalizedTestFile = testFile.endsWith('.json') ? testFile : `${testFile}.json`
    fixtures = fixtures.filter((f) => path.basename(f.filePath) === normalizedTestFile)
  }

  // Filter by TEST_CASE if provided (matches against the test case id/name)
  if (testCase !== undefined) {
    fixtures = fixtures.filter((f) => f.id.includes(testCase))
  }

  describe('Execution-spec state tests', () => {
    if (fixtures.length === 0) {
      it.skip(`no execution-spec state fixtures found under ${fixturesPath}`, () => {})
      return
    }

    for (const { id, fork, data } of fixtures) {
      it(`${fork}: ${id}`, async () => {
        const testCase = parseTest(fork, data)
        try {
          await runStateTestCase(fork, testCase, assert, kzg)
        } catch (e: any) {
          assert.fail(e?.toString() + e.stack)
        }
      }, 3600000)
    }
  })
}

export async function runStateTestCase(
  fork: string,
  testData: any,
  t: typeof assert,
  kzg: microEthKZG,
) {
  const common = new Common({
    chain: Mainnet,
    hardfork:
      fork.toLowerCase() === 'frontier'
        ? 'chainstart'
        : fork.toLowerCase() === 'constantinoplefix'
          ? 'petersburg'
          : fork.toLowerCase(),
    customCrypto: { kzg },
  })
  const vm = await createVM({
    common,
  })

  await setupPreConditions(vm.stateManager, testData)

  let execInfo = ''
  let tx

  try {
    tx = makeTx(testData.transaction, { common })
  } catch {
    execInfo = 'tx instantiation exception'
  }

  if (tx) {
    if (tx.isValid()) {
      const block = makeBlockFromEnv(testData.env, { common })
      try {
        await runTx(vm, { tx, block })
        execInfo = 'successful tx run'
      } catch (e: any) {
        execInfo = `tx runtime error :${e.message}`
      }
    } else {
      execInfo = 'tx validation failed'
    }
  }

  const stateManagerStateRoot = await vm.stateManager.getStateRoot()
  const testDataPostStateRoot = toBytes(testData.postStateRoot)

  const msg = `State Root should match test fixture.  Tx result: (${execInfo})`

  t.deepEqual(stateManagerStateRoot, testDataPostStateRoot, msg)
}
