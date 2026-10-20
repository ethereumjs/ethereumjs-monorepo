import assert from 'node:assert/strict'
import { inspect } from 'node:util'

import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

import type { CaseResult, ConsensusTestCase } from '../types.ts'
import { runBlockchainTestCase } from './blockchain.ts'
import { runLegacyBlockchainTest } from './legacyBlockchain.ts'
import { runStateTestCase } from './state.ts'

let sharedKzg: microEthKZG | undefined

export function formatCaseError(e: unknown): string {
  if (e instanceof assert.AssertionError) {
    const parts: string[] = []
    if (e.stack !== undefined) parts.push(e.stack)
    else parts.push(e.message)
    if (e.actual !== undefined) {
      parts.push(
        `AssertionError actual: ${typeof e.actual === 'string' ? e.actual : inspect(e.actual, { depth: 4, maxArrayLength: 20 })}`,
      )
    }
    if (e.expected !== undefined) {
      parts.push(
        `AssertionError expected: ${typeof e.expected === 'string' ? e.expected : inspect(e.expected, { depth: 4, maxArrayLength: 20 })}`,
      )
    }
    return parts.join('\n')
  }
  if (e instanceof Error) {
    return e.stack ?? e.message
  }
  return String(e)
}

function getKzg(): microEthKZG {
  if (sharedKzg === undefined) {
    sharedKzg = new microEthKZG(trustedSetup)
  }
  return sharedKzg
}

export type RunCasesHooks = {
  onCaseComplete?: (result: CaseResult, index: number, total: number) => void
}

export async function runCases(
  cases: ConsensusTestCase[],
  rootLabel: string,
  hooks?: RunCasesHooks,
): Promise<CaseResult[]> {
  const kzg = getKzg()
  const results: CaseResult[] = []

  const total = cases.length
  for (let index = 0; index < cases.length; index++) {
    const testCase = cases[index]!
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
      const ok: CaseResult = {
        id: testCase.id,
        fork: testCase.fork,
        format: testCase.format,
        filePath: testCase.filePath,
        relPath,
        pass: true,
        durationMs: performance.now() - start,
      }
      results.push(ok)
      hooks?.onCaseComplete?.(ok, index, total)
    } catch (e: unknown) {
      const fail: CaseResult = {
        id: testCase.id,
        fork: testCase.fork,
        format: testCase.format,
        filePath: testCase.filePath,
        relPath,
        pass: false,
        error: formatCaseError(e),
        durationMs: performance.now() - start,
      }
      results.push(fail)
      hooks?.onCaseComplete?.(fail, index, total)
    }
  }

  return results
}
