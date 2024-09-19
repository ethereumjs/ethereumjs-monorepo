import { readFileSync } from 'fs'
import { assert, describe, it } from 'vitest'

import { TransitionTool } from '../../t8n/t8ntool.js'

import type { T8NOptions } from '../../t8n/types.js'

const t8nDir = 'test/t8n/testdata/'

const args: T8NOptions = {
  state: {
    fork: 'shanghai',
    reward: BigInt(0),
    chainid: BigInt(1),
  },
  input: {
    alloc: `${t8nDir}input/alloc.json`,
    txs: `${t8nDir}input/txs.json`,
    env: `${t8nDir}input/env.json`,
  },
  output: {
    basedir: t8nDir,
    result: `output/resultTEST.json`,
    alloc: `output/allocTEST.json`,
  },
  log: false,
}

// This test is generated using `execution-spec-tests` commit 88cab2521322191b2ec7ef7d548740c0b0a264fc, running:
// fill -k test_push0_contracts[fork_Shanghai-blockchain_test-key_sstore] --fork Shanghai tests/shanghai/eip3855_push0 --evm-bin=<ETHEREUMJS_T8NTOOL_LAUNCHER.sh>

// The test will run the TransitionTool using the inputs, and then compare if the output matches

describe('test runner config tests', () => {
  it('should run t8ntool with inputs and report the expected output', async () => {
    await TransitionTool.run(args)
    const expectedResult = JSON.parse(readFileSync(`${t8nDir}/output/result.json`).toString())
    const expectedAlloc = JSON.parse(readFileSync(`${t8nDir}/output/alloc.json`).toString())
    const reportedResult = JSON.parse(readFileSync(`${t8nDir}/output/resultTEST.json`).toString())
    const reportedAlloc = JSON.parse(readFileSync(`${t8nDir}/output/allocTEST.json`).toString())
    assert.deepStrictEqual(reportedResult, expectedResult, 'result matches expected result')
    assert.deepStrictEqual(reportedAlloc, expectedAlloc, 'alloc matches expected alloc')
  })
})
