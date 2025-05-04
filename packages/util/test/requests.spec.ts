import { assert, describe, it } from 'vitest'

import { concatBytes, randomBytes } from '../src/bytes.ts'
import { CLRequestType, createCLRequest } from '../src/request.ts'

import type { CLRequest } from '../src/request.ts'

describe('Requests', () => {
  const testCases: [string, { [key: string]: Uint8Array }, CLRequestType][] = [
    [
      'DepositRequest',
      {
        pubkey: randomBytes(48),
        withdrawalCredentials: randomBytes(32),
        amount: randomBytes(8),
        signature: randomBytes(96),
        index: randomBytes(8),
      },
      CLRequestType.Deposit,
    ],
    [
      'WithdrawalRequest',
      {
        sourceAddress: randomBytes(20),
        validatorPubkey: randomBytes(48),
        amount: randomBytes(8),
      },
      CLRequestType.Withdrawal,
    ],
    [
      'ConsolidationRequest',
      {
        sourceAddress: randomBytes(20),
        sourcePubkey: randomBytes(48),
        targetPubkey: randomBytes(48),
      },
      CLRequestType.Consolidation,
    ],
  ]
  for (const [requestName, requestData, requestType] of testCases) {
    it(`${requestName}`, () => {
      // flatten request bytes as per EIP-7685
      const depositRequestBytes = new Uint8Array(
        Object.values(requestData)
          .map((arr) => Array.from(arr)) // Convert Uint8Arrays to regular arrays
          .reduce((acc, curr) => acc.concat(curr), []), // Concatenate arrays
      )
      const requestObject = createCLRequest(
        concatBytes(new Uint8Array([requestType]), depositRequestBytes),
      ) as CLRequest<CLRequestType>

      assert.strictEqual(requestObject.type, requestType)
      assert.deepEqual(requestObject.data, depositRequestBytes)
    })
  }
})
