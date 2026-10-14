import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

import type { CaseResult, ConsensusTestCase } from '../types.ts'
import { runBlockchainTestCase } from './blockchain.ts'
import { runLegacyBlockchainTest } from './legacyBlockchain.ts'
import { runStateTestCase } from './state.ts'

let sharedKzg: microEthKZG | undefined

function getKzg(): microEthKZG {
  if (sharedKzg === undefined) {
    sharedKzg = new microEthKZG(trustedSetup)
  }
  return sharedKzg
}

export async function runCases(
  cases: ConsensusTestCase[],
  rootLabel: string,
): Promise<CaseResult[]> {
  const kzg = getKzg()
  const results: CaseResult[] = []

  for (const testCase of cases) {
    const start = performance.now()
    const relPath = testCase.filePath
    try {
      if (testCase.legacy === true) {
        await runLegacyBlockchainTest(testCase, kzg)
      } else if (testCase.format === 'state_tests') {
        await runStateTestCase(
          testCase.fork,
          testCase.data as import('../types.ts').StateTestFixtureData,
          {
            kzg,
          },
        )
      } else {
        await runBlockchainTestCase(
          testCase.fork,
          testCase.data as import('../types.ts').BlockchainTestFixtureData,
          kzg,
          testCase.filePath,
        )
      }
      results.push({
        id: testCase.id,
        fork: testCase.fork,
        format: testCase.format,
        filePath: testCase.filePath,
        relPath,
        pass: true,
        durationMs: performance.now() - start,
      })
    } catch (e: unknown) {
      const err = e as Error
      results.push({
        id: testCase.id,
        fork: testCase.fork,
        format: testCase.format,
        filePath: testCase.filePath,
        relPath,
        pass: false,
        error: err?.stack ?? err?.message ?? String(e),
        durationMs: performance.now() - start,
      })
    }
  }

  return results
}
