import { createBlockHeader } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { encodeBlockHeadersReply } from '../src/net/peerCoordinator.ts'
import {
  encodeGetBlockHeadersPayload,
  parsePivotHeaderFromBlockHeadersPayload,
} from '../src/net/pivotHeader.ts'

describe('[Ethy/Net]: pivotHeader', () => {
  it('parsePivotHeaderFromBlockHeadersPayload() round-trips a header', () => {
    const common = new Common({ chain: Mainnet, hardfork: 'paris' })
    const header = createBlockHeader(
      {
        number: 17_000_000n,
        parentHash: new Uint8Array(32),
        stateRoot: Uint8Array.from({ length: 32 }, () => 0xab),
        gasLimit: 30_000_000n,
        timestamp: 1_700_000_000n,
        difficulty: 0n,
      },
      { common, skipConsensusFormatValidation: true },
    )
    const hashHex = bytesToHex(header.hash())
    const reply = encodeBlockHeadersReply(68, header.serialize())
    const parsed = parsePivotHeaderFromBlockHeadersPayload(68, reply, hashHex, Mainnet)
    assert.ok(parsed !== null)
    assert.equal(parsed.number, 17_000_000n)
    assert.equal(bytesToHex(parsed.stateRoot), bytesToHex(header.stateRoot))
  })

  it('parsePivotHeaderFromBlockHeadersPayload() rejects hash mismatch', () => {
    const common = new Common({ chain: Mainnet, hardfork: 'paris' })
    const header = createBlockHeader(
      {
        number: 17_000_001n,
        parentHash: new Uint8Array(32),
        stateRoot: new Uint8Array(32),
        gasLimit: 30_000_000n,
        timestamp: 1_700_000_000n,
        difficulty: 0n,
      },
      { common, skipConsensusFormatValidation: true },
    )
    const reply = encodeBlockHeadersReply(68, header.serialize())
    const parsed = parsePivotHeaderFromBlockHeadersPayload(
      68,
      reply,
      '0x' + '11'.repeat(32),
      Mainnet,
    )
    assert.equal(parsed, null)
  })

  it('encodeGetBlockHeadersPayload() builds non-empty RLP', () => {
    const payload = encodeGetBlockHeadersPayload(
      68,
      '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    )
    assert.ok(payload.byteLength > 0)
  })
})
