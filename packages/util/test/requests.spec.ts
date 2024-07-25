import { assert, describe, it } from 'vitest'

import { bytesToBigInt, randomBytes } from '../src/bytes.js'
import {
  CLRequestFactory,
  CLRequestType,
  ConsolidationRequest,
  DepositRequest,
  WithdrawalRequest,
} from '../src/requests.js'

import type { CLRequest } from '../src/requests.js'

describe('Requests', () => {
  const testCases = [
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
      DepositRequest,
    ],
    [
      'WithdrawalRequest',
      {
        sourceAddress: randomBytes(20),
        validatorPubkey: randomBytes(48),
        amount: bytesToBigInt(randomBytes(8)),
      },
      CLRequestType.Withdrawal,
      WithdrawalRequest,
    ],
    [
      'ConsolidationRequest',
      {
        sourceAddress: randomBytes(20),
        sourcePubkey: randomBytes(48),
        targetPubkey: randomBytes(48),
      },
      CLRequestType.Consolidation,
      ConsolidationRequest,
    ],
  ]
  for (const [requestName, requestData, requestType, RequestInstanceType] of testCases) {
    it(`${requestName}`, () => {
      const requestObject = RequestInstanceType.fromRequestData(
        requestData,
      ) as CLRequest<CLRequestType>
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
