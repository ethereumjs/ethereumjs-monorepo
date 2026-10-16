import assert from 'node:assert/strict'

import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { toBytes } from 'viem'

import { createVM } from '../../../src/constructors.ts'
import { runTx } from '../../../src/runTx.ts'
import { makeBlockFromEnv, setupPreConditions } from '../../util.ts'
import { createCommonForFork, parseStateTest } from '../forkCommon.ts'
import type { StateTestFixtureData } from '../types.ts'
import { makeStateTestTx } from './stateTx.ts'

export type StateRunOptions = {
  kzg?: microEthKZG
}

export async function runStateTestCase(
  fork: string,
  testData: StateTestFixtureData,
  options?: StateRunOptions,
) {
  const kzg = options?.kzg ?? new microEthKZG(trustedSetup)
  const parsed = parseStateTest(fork, testData)
  const common = createCommonForFork(fork, testData, kzg)
  const vm = await createVM({ common })

  await setupPreConditions(vm.stateManager, { pre: parsed.pre })

  let execInfo = ''
  let tx
  try {
    tx = makeStateTestTx(parsed.transaction, { common }, parsed.expectException)
  } catch {
    execInfo = 'tx instantiation exception'
  }

  if (tx !== undefined) {
    if (tx.isValid()) {
      const block = makeBlockFromEnv(parsed.env, { common })
      try {
        await runTx(vm, { tx, block })
        execInfo = 'successful tx run'
      } catch (e: unknown) {
        execInfo = `tx runtime error :${(e as Error).message}`
      }
    } else {
      execInfo = 'tx validation failed'
    }
  }

  if (parsed.expectException !== undefined && execInfo === 'successful tx run') {
    assert.fail(
      `Expected exception ${parsed.expectException} but transaction executed successfully`,
    )
  }

  const stateRoot = await vm.stateManager.getStateRoot()
  const expectedStateRoot = toBytes(parsed.postStateRoot)

  assert.deepEqual(
    stateRoot,
    expectedStateRoot,
    `State root should match test fixture. Tx result: (${execInfo})`,
  )
}
