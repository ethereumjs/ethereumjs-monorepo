import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { CLRequestType, createCLRequest, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { sha256 } from '@noble/hashes/sha2.js'
import { assert, describe, it } from 'vitest'

import { createBlock, genRequestsRoot } from '../src/index.ts'

import type { CLRequest } from '@ethereumjs/util'

describe('[Block]: CLRequests tests', () => {
  // Common with EIP-7685 enabled (CLRequests)
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7685] })

  function createDepositRequest(): CLRequest<CLRequestType> {
    // Example deposit data
    const sampleDepositRequest = hexToBytes(
      '0x00ac842878bb70009552a4cfcad801d6e659c50bd50d7d03306790cb455ce7363c5b6972f0159d170f625a99b2064dbefc010000000000000000000000818ccb1c4eda80270b04d6df822b1e72dd83c3030040597307000000a747f75c72d0cf0d2b52504c7385b516f0523e2f0842416399f42b4aee5c6384a5674f6426b1cc3d0827886fa9b909e616f5c9f61f986013ed2b9bf37071cbae951136265b549f44e3c8e26233c0433e9124b7fd0dc86e82f9fedfc0a179d7690000000000000000',
    )
    return createCLRequest(sampleDepositRequest)
  }

  function createWithdrawalRequest(): CLRequest<CLRequestType> {
    // Type 1 (Withdrawal) + example data
    const withdrawalData = hexToBytes(
      '0x01000000000000000000000000000000000000000001000000000000000000000de0b6b3a7640000',
    )
    return createCLRequest(withdrawalData)
  }

  function createConsolidationRequest(): CLRequest<CLRequestType> {
    // Type 2 (Consolidation) + example data
    const consolidationData = hexToBytes('0x020000000100000000000000000000000000000000000001')
    return createCLRequest(consolidationData)
  }

  it('should create a block with deposit request', () => {
    const depositRequest = createDepositRequest()
    assert.strictEqual(depositRequest.type, CLRequestType.Deposit, 'should be a deposit request')

    const requestsHash = genRequestsRoot([depositRequest], sha256)
    const block = createBlock(
      {
        header: { requestsHash },
      },
      { common },
    )

    assert.isDefined(block.header.requestsHash, 'block should have requestsHash')
    assert.isTrue(
      equalsBytes(block.header.requestsHash!, requestsHash),
      'requestsHash should match the expected value',
    )
  })

  it('should create a block with withdrawal request', () => {
    const withdrawalRequest = createWithdrawalRequest()
    assert.strictEqual(
      withdrawalRequest.type,
      CLRequestType.Withdrawal,
      'should be a withdrawal request',
    )

    const requestsHash = genRequestsRoot([withdrawalRequest], sha256)
    const block = createBlock(
      {
        header: { requestsHash },
      },
      { common },
    )

    assert.isDefined(block.header.requestsHash, 'block should have requestsHash')
    assert.isTrue(
      equalsBytes(block.header.requestsHash!, requestsHash),
      'requestsHash should match the expected value',
    )
  })

  it('should create a block with consolidation request', () => {
    const consolidationRequest = createConsolidationRequest()
    assert.strictEqual(
      consolidationRequest.type,
      CLRequestType.Consolidation,
      'should be a consolidation request',
    )

    const requestsHash = genRequestsRoot([consolidationRequest], sha256)
    const block = createBlock(
      {
        header: { requestsHash },
      },
      { common },
    )

    assert.isDefined(block.header.requestsHash, 'block should have requestsHash')
    assert.isTrue(
      equalsBytes(block.header.requestsHash!, requestsHash),
      'requestsHash should match the expected value',
    )
  })

  it('should create a block with multiple CLRequests', () => {
    const depositRequest = createDepositRequest()
    const withdrawalRequest = createWithdrawalRequest()
    const consolidationRequest = createConsolidationRequest()

    // Requests should be sorted by type
    const requests = [depositRequest, withdrawalRequest, consolidationRequest]
    const requestsHash = genRequestsRoot(requests, sha256)

    const block = createBlock(
      {
        header: { requestsHash },
      },
      { common },
    )

    assert.isDefined(block.header.requestsHash, 'block should have requestsHash')
    assert.isTrue(
      equalsBytes(block.header.requestsHash!, requestsHash),
      'requestsHash should match the expected value',
    )
  })

  it('should validate the requests are sorted by type', () => {
    const depositRequest = createDepositRequest()
    const withdrawalRequest = createWithdrawalRequest()

    // Requests in wrong order should throw
    const requests = [withdrawalRequest, depositRequest]

    assert.throws(
      () => genRequestsRoot(requests, sha256),
      'requests are not sorted in ascending order',
      'should throw when requests are not sorted by type',
    )
  })
})
