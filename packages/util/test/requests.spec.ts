import { assert, describe, it } from 'vitest'

import { bytesToBigInt, randomBytes } from '../src/bytes.js'
import {
  CLRequestFactory,
  CLRequestType,
  DepositRequest,
  WithdrawalRequest,
} from '../src/requests.js'

import type { CLRequest } from '../src/requests.js'

describe('Requests', () => {
  it('deposit request', () => {
    const depositRequestData = {
      pubkey: randomBytes(48),
      withdrawalCredentials: randomBytes(32),
      amount: bytesToBigInt(randomBytes(8)),
      signature: randomBytes(96),
      index: bytesToBigInt(randomBytes(8)),
    }

    const depositObject = DepositRequest.fromRequestData(
      depositRequestData
    ) as CLRequest<CLRequestType>
    const depositJSON = depositObject.toJSON()
    const serialized = depositObject.serialize()
    assert.equal(serialized[0], CLRequestType.Deposit)

    const deserialized = CLRequestFactory.fromSerializedRequest(serialized)
    const deserializedJSON = deserialized.toJSON()
    assert.deepEqual(deserializedJSON, depositJSON)

    const reserialized = deserialized.serialize()
    assert.deepEqual(serialized, reserialized)
  })

  it('withdrawal request', () => {
    const withdrawalRequestData = {
      sourceAddress: randomBytes(20),
      validatorPubkey: randomBytes(48),
      amount: bytesToBigInt(randomBytes(8)),
    }

    const withdrawalObject = WithdrawalRequest.fromRequestData(
      withdrawalRequestData
    ) as CLRequest<CLRequestType>
    const withdrawalJSON = withdrawalObject.toJSON()
    const serialized = withdrawalObject.serialize()
    assert.equal(serialized[0], CLRequestType.Withdrawal)

    const deserialized = CLRequestFactory.fromSerializedRequest(serialized)
    const deserializedJSON = deserialized.toJSON()
    assert.deepEqual(deserializedJSON, withdrawalJSON)

    const reserialized = deserialized.serialize()
    assert.deepEqual(serialized, reserialized)
  })
})
