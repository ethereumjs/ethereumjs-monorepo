import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { CLRequest, KECCAK256_RLP, concatBytes, hexToBytes, randomBytes } from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import { Block, BlockHeader } from '../src/index.js'

import type { CLRequestType } from '@ethereumjs/util'

class NumberRequest extends CLRequest implements CLRequestType {
  constructor(type: number, bytes: Uint8Array) {
    super(type, bytes)
  }

  public static fromRequestData(bytes: Uint8Array): CLRequestType {
    return new NumberRequest(0x1, bytes)
  }

  serialize() {
    return concatBytes(Uint8Array.from([this.type]), this.bytes)
  }
}

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Cancun,
  eips: [7685, 4844, 4788],
})
describe('7685 tests', () => {
  it('should instantiate block with defaults', () => {
    const block = Block.fromBlockData({}, { common })
    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
    const block2 = new Block(undefined, undefined, undefined, undefined, { common })
    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
    assert.equal(block2.requests?.length, 0)
  })
  it('should instantiate a block with requests', async () => {
    const request = new NumberRequest(0x1, randomBytes(32))
    const requestsRoot = await Block.genRequestsTrieRoot([request])
    const block = Block.fromBlockData(
      {
        requests: [request],
        header: { requestsRoot },
      },
      { common }
    )
    assert.equal(block.requests?.length, 1)
    assert.deepEqual(block.header.requestsRoot, requestsRoot)
  })
  it('RequestsRootIsValid should return false when requestsRoot is invalid', async () => {
    const request = new NumberRequest(0x1, randomBytes(32))
    const block = Block.fromBlockData(
      {
        requests: [request],
        header: { requestsRoot: randomBytes(32) },
      },
      { common }
    )

    assert.equal(await block.requestsTrieIsValid(), false)
  })
  it('should validate requests order', async () => {
    const request1 = new NumberRequest(0x1, hexToBytes('0x1234'))
    const request2 = new NumberRequest(0x1, hexToBytes('0x2345'))
    const request3 = new NumberRequest(0x2, hexToBytes('0x2345'))
    const requests = [request1, request2, request3]
    const requestsRoot = await Block.genRequestsTrieRoot(requests)

    // Construct block with requests in correct order

    const block = Block.fromBlockData(
      {
        requests,
        header: { requestsRoot },
      },
      { common }
    )

    assert.ok(await block.requestsTrieIsValid())

    // Throws when requests are not ordered correctly
    await expect(async () =>
      Block.fromBlockData(
        {
          requests: [request1, request3, request2],
          header: { requestsRoot },
        },
        { common }
      )
    ).rejects.toThrow('ascending order')
  })
})

describe('fromValuesArray tests', () => {
  it('should construct a block with empty requests root', () => {
    const block = Block.fromValuesArray(
      [BlockHeader.fromHeaderData({}, { common }).raw(), [], [], [], []],
      {
        common,
      }
    )
    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
  })
  it('should construct a block with a valid requests array', async () => {
    const request1 = new NumberRequest(0x1, hexToBytes('0x1234'))
    const request2 = new NumberRequest(0x1, hexToBytes('0x2345'))
    const request3 = new NumberRequest(0x2, hexToBytes('0x2345'))
    const requests = [request1, request2, request3]
    const requestsRoot = await Block.genRequestsTrieRoot(requests)
    const serializedRequests = [request1.serialize(), request2.serialize(), request3.serialize()]

    const block = Block.fromValuesArray(
      [
        BlockHeader.fromHeaderData({ requestsRoot }, { common }).raw(),
        [],
        [],
        [],
        serializedRequests,
      ],
      {
        common,
      }
    )
    assert.deepEqual(block.header.requestsRoot, requestsRoot)
    assert.equal(block.requests?.length, 3)
  })
})
