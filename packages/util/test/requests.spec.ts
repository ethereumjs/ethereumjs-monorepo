import { assert, describe, it } from 'vitest'

import { bytesToBigInt, randomBytes } from '../src/bytes.js'
import {
  CLRequestFactory,
  CLRequestType,
  createConsolidationRequest,
  createDepositRequest,
  createWithdrawalRequest,
} from '../src/request.js'

import type {
  CLRequest,
  ConsolidationRequest,
  DepositRequest,
  WithdrawalRequest,
} from '../src/request.js'

describe('Requests', () => {
  const testCases: [
    string,
    any,
    CLRequestType,
    (...args: any) => ConsolidationRequest | DepositRequest | WithdrawalRequest,
  ][] = [
    [
      'DepositRequest',
      {
        pubkey: randomBytes(48),
        withdrawalCredentials: randomBytes(32),
        amount: bytesToBigInt(randomBytes(8)),
        signature: randomBytes(96),
        index: bytesToBigInt(randomBytes(8)),
      },
      CLRequestType.Deposit,
      createDepositRequest,
    ],
    [
      'WithdrawalRequest',
      {
        sourceAddress: randomBytes(20),
        validatorPubkey: randomBytes(48),
        amount: bytesToBigInt(randomBytes(8)),
      },
      CLRequestType.Withdrawal,
      createWithdrawalRequest,
    ],
    [
      'ConsolidationRequest',
      {
        sourceAddress: randomBytes(20),
        sourcePubkey: randomBytes(48),
        targetPubkey: randomBytes(48),
      },
      CLRequestType.Consolidation,
      createConsolidationRequest,
    ],
  ]
  for (const [requestName, requestData, requestType, requestInstanceConstructor] of testCases) {
    it(`${requestName}`, () => {
      const requestObject = requestInstanceConstructor(requestData) as CLRequest<CLRequestType>
      const requestJSON = requestObject.toJSON()
      const serialized = requestObject.serialize()
      assert.equal(serialized[0], requestType)

      const deserialized = CLRequestFactory.fromSerializedRequest(serialized)
      const deserializedJSON = deserialized.toJSON()
      assert.deepEqual(deserializedJSON, requestJSON)

      const reserialized = deserialized.serialize()
      assert.deepEqual(serialized, reserialized)
    })
  }
})
