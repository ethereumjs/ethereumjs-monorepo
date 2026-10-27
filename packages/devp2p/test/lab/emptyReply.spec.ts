import { RLP } from '@ethereumjs/rlp'
import { hexToBytes } from '@ethereumjs/util'
import { describe, expect, it } from 'vitest'

import { emptyWireReply } from '../../src/lab/emptyReply.ts'
import { buildGetBlockHeadersFromJSON } from '../../src/protocol/eth/codec.ts'

describe('emptyWireReply', () => {
  it('answers eth66 GET_BLOCK_HEADERS with an empty header list and the same request id', () => {
    const request = buildGetBlockHeadersFromJSON(68, { requestId: '0x01', block: 0, max: 1 }, (s) =>
      hexToBytes(s as `0x${string}`),
    )
    const reply = emptyWireReply('eth', 68, 'GET_BLOCK_HEADERS', request)
    expect(reply?.name).toBe('BLOCK_HEADERS')
    const decoded = RLP.decode(RLP.encode(reply!.rlp)) as Uint8Array[]
    const reqDecoded = RLP.decode(RLP.encode(request)) as Uint8Array[]
    expect(decoded[0]).toEqual(reqDecoded[0])
    expect(decoded[1]).toEqual([])
  })

  it('does not answer a header list', () => {
    expect(emptyWireReply('eth', 68, 'BLOCK_HEADERS', [])).toBeUndefined()
  })

  it('answers snap account range with an empty proof', () => {
    const reply = emptyWireReply('snap', 1, 'GET_ACCOUNT_RANGE', [hexToBytes('0x02')])
    expect(reply?.name).toBe('ACCOUNT_RANGE')
    const decoded = RLP.decode(RLP.encode(reply!.rlp)) as unknown[]
    expect(decoded[1]).toEqual([])
    expect(decoded[2]).toEqual([])
  })

  it('answers eth71 GET_BLOCK_ACCESS_LISTS with an empty list and the same request id', () => {
    const requestId = hexToBytes('0x03')
    const reply = emptyWireReply('eth', 71, 'GET_BLOCK_ACCESS_LISTS', [requestId, []])
    expect(reply?.name).toBe('BLOCK_ACCESS_LISTS')
    const decoded = RLP.decode(RLP.encode(reply!.rlp)) as unknown[]
    expect(decoded[0]).toEqual(requestId)
    expect(decoded[1]).toEqual([])
  })
})
