import assert from 'node:assert/strict'

import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

import { cliForkToLegacyNetwork } from '../forks.ts'
import { getCommon } from '../legacyCommon.ts'
import type { BlockchainTestFixtureData, ConsensusTestCase } from '../types.ts'
import { runBlockchainTest } from './legacyBlockchainRunner.ts'

export async function runLegacyBlockchainTest(testCase: ConsensusTestCase, kzg: microEthKZG) {
  const network = cliForkToLegacyNetwork(testCase.fork)
  const common = getCommon(network, kzg)
  const options = {
    forkConfigTestSuite: network,
    common,
    bls: undefined,
    bn254: undefined,
    profile: false,
    debug: false,
    testCount: 0,
  }
  await runBlockchainTest(options, testCase.data as BlockchainTestFixtureData)
}
