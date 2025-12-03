import type { assert } from 'vitest'

import { toBytes } from 'viem'
import { createVM } from '../../src/constructors.ts'
import { runTx } from '../../src/runTx.ts'
import { makeBlockFromEnv, makeTx, setupPreConditions } from '../util.ts'
import { createCommonForFork } from './executionSpecTestLoader.ts'

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
