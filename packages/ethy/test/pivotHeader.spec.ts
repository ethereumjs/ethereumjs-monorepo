import { createBlockHeader } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { encodeBlockHeadersReply } from '../src/net/peerCoordinator.ts'
import {
  encodeGetBlockHeadersByNumberPayload,
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
        timestamp: 1_650_000_000n,
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

  it('parsePivotHeaderFromBlockHeadersPayload() decodes Shanghai timestamp fork', () => {
    const common = new Common({ chain: Mainnet, hardfork: 'shanghai' })
    const header = createBlockHeader(
      {
        number: 17_000_000n,
        parentHash: new Uint8Array(32),
        stateRoot: Uint8Array.from({ length: 32 }, () => 0xcd),
        gasLimit: 30_000_000n,
        timestamp: 1_681_338_477n,
        difficulty: 0n,
        withdrawalsRoot: Uint8Array.from({ length: 32 }, () => 0xee),
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

  it('parsePivotHeaderFromBlockHeadersPayload() decodes pre-merge header at low block', () => {
    const common = new Common({ chain: Mainnet, hardfork: 'homestead' })
    const header = createBlockHeader(
      {
        number: 100n,
        parentHash: new Uint8Array(32),
        stateRoot: Uint8Array.from({ length: 32 }, () => 0x12),
        gasLimit: 15_000_000n,
        timestamp: 1_000_000n,
        difficulty: 1n,
      },
      { common, skipConsensusFormatValidation: true },
    )
    const hashHex = bytesToHex(header.hash())
    const reply = encodeBlockHeadersReply(68, header.serialize())
    const parsed = parsePivotHeaderFromBlockHeadersPayload(68, reply, hashHex, Mainnet)
    assert.ok(parsed !== null)
    assert.equal(parsed.number, 100n)
  })

  it('encodeGetBlockHeadersPayload() builds non-empty RLP', () => {
    const payload = encodeGetBlockHeadersPayload(
      68,
      '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    )
    assert.ok(payload.byteLength > 0)
  })

  it('parsePivotHeaderFromBlockHeadersPayload() accepts block-number fetch without hash check', () => {
    const common = new Common({ chain: Mainnet, hardfork: 'paris' })
    const header = createBlockHeader(
      {
        number: 17_000_002n,
        parentHash: new Uint8Array(32),
        stateRoot: Uint8Array.from({ length: 32 }, () => 0x99),
        gasLimit: 30_000_000n,
        timestamp: 1_650_000_000n,
        difficulty: 0n,
      },
      { common, skipConsensusFormatValidation: true },
    )
    const reply = encodeBlockHeadersReply(68, header.serialize())
    const parsed = parsePivotHeaderFromBlockHeadersPayload(68, reply, undefined, Mainnet)
    assert.ok(parsed !== null)
    assert.equal(parsed.number, 17_000_002n)
  })

  it('encodeGetBlockHeadersByNumberPayload() builds non-empty RLP', () => {
    const payload = encodeGetBlockHeadersByNumberPayload(68, 17_000_000n)
    assert.ok(payload.byteLength > 0)
  })
})
