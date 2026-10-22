import { RLP } from '@ethereumjs/rlp'
import { hexToBytes, intToBytes } from '@ethereumjs/util'
import { describe, expect, it } from 'vitest'

import {
  buildGetBlockHeadersFromJson,
  encodeGetBlockHeaders,
  ethUsesRequestId,
  isDeprecatedPostMergeMessage,
} from '../../src/protocol/eth/codec.ts'

describe('eth codec', () => {
  it('wraps header gets with request id from eth/66 on', () => {
    expect(ethUsesRequestId(65)).toBe(false)
    expect(ethUsesRequestId(66)).toBe(true)
    const v65 = encodeGetBlockHeaders(65, {
      startBlock: intToBytes(0),
      limit: intToBytes(1),
      skip: intToBytes(0),
      reverse: intToBytes(0),
    })
    expect(Array.isArray(v65) && v65.length).toBe(4)
    const v68 = encodeGetBlockHeaders(
      68,
      {
        startBlock: intToBytes(0),
        limit: intToBytes(1),
        skip: intToBytes(0),
        reverse: intToBytes(0),
      },
      intToBytes(1),
    )
    const decoded = RLP.decode(RLP.encode(v68)) as unknown[]
    expect(decoded[0]).toEqual(intToBytes(1))
    expect(decoded[1]).toHaveLength(4)
  })

  it('builds spec-shaped GetBlockHeaders from JSON', () => {
    const genesis = `0x${'d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'.slice(2)}`
    const rlp = buildGetBlockHeadersFromJson(
      68,
      { requestId: '0x01', blockHash: genesis, max: 1, skip: 0, reverse: false },
      (s) => hexToBytes(s as `0x${string}`),
    )
    const decoded = RLP.decode(RLP.encode(rlp)) as unknown[]
    expect(decoded).toHaveLength(2)
    expect((decoded[1] as unknown[]).length).toBe(4)
  })

  it('flags post-merge block propagation as deprecated on eth/67+', () => {
    expect(isDeprecatedPostMergeMessage(0x01, 66)).toBe(false)
    expect(isDeprecatedPostMergeMessage(0x01, 67)).toBe(true)
  })
})
