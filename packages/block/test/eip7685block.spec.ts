import { Chain, Common, Hardfork } from '@ethereumjs/common'
import {
  DepositRequest,
  KECCAK256_RLP,
  WithdrawalRequest,
  bytesToBigInt,
  randomBytes,
} from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import {
  createBlock,
  createBlockFromRPC,
  createBlockFromValuesArray,
  createHeader,
} from '../src/constructors.js'
import { genRequestsTrieRoot } from '../src/helpers.js'
import { Block } from '../src/index.js'

import type { CLRequest, CLRequestType } from '@ethereumjs/util'

function getRandomDepositRequest(): CLRequest<CLRequestType> {
  const depositRequestData = {
    pubkey: randomBytes(48),
    withdrawalCredentials: randomBytes(32),
    amount: bytesToBigInt(randomBytes(8)),
    signature: randomBytes(96),
    index: bytesToBigInt(randomBytes(8)),
  }
  return DepositRequest.fromRequestData(depositRequestData) as CLRequest<CLRequestType>
}

function getRandomWithdrawalRequest(): CLRequest<CLRequestType> {
  const withdrawalRequestData = {
    sourceAddress: randomBytes(20),
    validatorPubkey: randomBytes(48),
    amount: bytesToBigInt(randomBytes(8)),
  }
  return WithdrawalRequest.fromRequestData(withdrawalRequestData) as CLRequest<CLRequestType>
}

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Cancun,
  eips: [7685, 4844, 4788],
})
describe('7685 tests', () => {
  it('should instantiate block with defaults', () => {
    const block = createBlock({}, { common })
    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
    const block2 = new Block(undefined, undefined, undefined, undefined, { common })
    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
    assert.equal(block2.requests?.length, 0)
  })
  it('should instantiate a block with requests', async () => {
    const request = getRandomDepositRequest()
    const requestsRoot = await genRequestsTrieRoot([request])
    const block = createBlock(
      {
        requests: [request],
        header: { requestsRoot },
      },
      { common },
    )
    assert.equal(block.requests?.length, 1)
    assert.deepEqual(block.header.requestsRoot, requestsRoot)
  })
  it('RequestsRootIsValid should return false when requestsRoot is invalid', async () => {
    const request = getRandomDepositRequest()
    const block = createBlock(
      {
        requests: [request],
        header: { requestsRoot: randomBytes(32) },
      },
      { common },
    )

    assert.equal(await block.requestsTrieIsValid(), false)
  })
  it('should validate requests order', async () => {
    const request1 = getRandomDepositRequest()
    const request2 = getRandomDepositRequest()
    const request3 = getRandomWithdrawalRequest()
    const requests = [request1, request2, request3]
    const requestsRoot = await genRequestsTrieRoot(requests)

    // Construct block with requests in correct order

    const block = createBlock(
      {
        requests,
        header: { requestsRoot },
      },
      { common },
    )

    assert.ok(await block.requestsTrieIsValid())

    // Throws when requests are not ordered correctly
    await expect(async () =>
      createBlock(
        {
          requests: [request1, request3, request2],
          header: { requestsRoot },
        },
        { common },
      ),
    ).rejects.toThrow('ascending order')
  })
})

describe('fromValuesArray tests', () => {
  it('should construct a block with empty requests root', () => {
    const block = createBlockFromValuesArray([createHeader({}, { common }).raw(), [], [], [], []], {
      common,
    })
    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
  })
  it('should construct a block with a valid requests array', async () => {
    const request1 = getRandomDepositRequest()
    const request2 = getRandomWithdrawalRequest()
    const request3 = getRandomWithdrawalRequest()
    const requests = [request1, request2, request3]
    const requestsRoot = await genRequestsTrieRoot(requests)
    const serializedRequests = [request1.serialize(), request2.serialize(), request3.serialize()]

    const block = createBlockFromValuesArray(
      [createHeader({ requestsRoot }, { common }).raw(), [], [], [], serializedRequests],
      {
        common,
      },
    )
    assert.deepEqual(block.header.requestsRoot, requestsRoot)
    assert.equal(block.requests?.length, 3)
  })
})

describe('fromRPC tests', () => {
  it('should construct a block from a JSON object', async () => {
    const request1 = getRandomDepositRequest()
    const request2 = getRandomDepositRequest()
    const request3 = getRandomWithdrawalRequest()
    const requests = [request1, request2, request3]
    const requestsRoot = await genRequestsTrieRoot(requests)
    const serializedRequests = [request1.serialize(), request2.serialize(), request3.serialize()]

    const block = createBlockFromValuesArray(
      [createHeader({ requestsRoot }, { common }).raw(), [], [], [], serializedRequests],
      {
        common,
      },
    )
    const jsonBlock = block.toJSON()
    const rpcBlock: any = { ...jsonBlock.header, requests: jsonBlock.requests }
    const createBlockFromJson = createBlockFromRPC(rpcBlock, undefined, { common })
    assert.deepEqual(block.hash(), createBlockFromJson.hash())
  })
})
