import { assert, describe, it } from 'vitest'

import fs from 'fs'
import path from 'path'

import { toBytes } from 'viem'
import { createVM } from '../../src/constructors.ts'
import { runTx } from '../../src/runTx.ts'
import { makeBlockFromEnv, makeTx, setupPreConditions } from '../util.ts'
import {
  createCommonForFork,
  loadExecutionSpecFixtures,
  parseTest,
} from './executionSpecTestLoader.ts'

const customFixturesPath = process.env.TEST_PATH ?? '../execution-spec-tests'
const fixturesPath = path.resolve(customFixturesPath)

console.log(`Using execution-spec state tests from: ${fixturesPath}`)

if (fs.existsSync(fixturesPath) === false) {
  describe('Execution-spec state tests', () => {
    it.skip(`fixtures not found at ${fixturesPath}`, () => {})
  })
} else {
  const fixtures = loadExecutionSpecFixtures(fixturesPath, 'state_tests')

  describe('Execution-spec state tests', () => {
    if (fixtures.length === 0) {
      it.skip(`no execution-spec state fixtures found under ${fixturesPath}`, () => {})
      return
    }

    for (const { id, fork, data } of fixtures) {
      it(`${fork}: ${id}`, async () => {
        const testCase = parseTest(fork, data)
        try {
          await runStateTestCase(fork, testCase, assert)
        } catch (e: any) {
          assert.fail(e?.toString() + e.stack)
        }
      }, 3600000)
    }
  })
}

export async function runStateTestCase(fork: string, testData: any, t: typeof assert) {
  const common = createCommonForFork(fork)
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
