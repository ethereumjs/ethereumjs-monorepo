import { Common, Mainnet } from '@ethereumjs/common'
import { type Input, RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, intToUnpaddedBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { statyCapableFromDiscv4Record } from '../../src/dns/enrPeerFields.ts'
import { discv4ENRList } from '../../src/dpt/discv4Enr.ts'
import {
  MAX_STATY_PROOF_NODES,
  STATY,
  encodeStatyStatus,
  parseStatyStatus,
  statyMessageNameToCode,
} from '../../src/protocol/staty.ts'
import { validateStatyStatusAgainstLocal } from '../../src/protocol/staty/codec.ts'
import { StatyMessageCodes } from '../../src/protocol/staty/codes.ts'
import type { Peer } from '../../src/rlpx/peer.ts'
import { DISCONNECT_REASON } from '../../src/types.ts'
import { genPrivateKey } from '../../src/util.ts'

describe('[Devp2p/STATY]: codecs', () => {
  const genesis = new Uint8Array(32).fill(0xab)

  it('encodeStatyStatus() uses canonical zero (0x80) for protocol version', () => {
    const tuple = encodeStatyStatus(11155111n, { genesisHash: genesis })
    assert.equal(tuple.length, 10)
    const decoded = RLP.decode(RLP.encode(tuple)) as unknown[]
    assert.equal((decoded[0] as Uint8Array).length, 0)
  })

  it('parseStatyStatus() round-trips STATUS fields', () => {
    const encoded = encodeStatyStatus(11155111n, {
      genesisHash: genesis,
      earliestEpoch: 1n,
      latestEpoch: 4n,
      epochMask: 0x0fn,
      witnessCountHint: 8,
      codeCountHint: 2,
    })
    const remote = parseStatyStatus(encoded)
    assert.equal(remote.protocolVersion, 0)
    assert.equal(remote.chainId, 11155111n)
    assert.equal(remote.latestEpoch, 4n)
    assert.equal(remote.witnessCountHint, 8)
  })

  it('parseStatyStatus() ignores an 11th trailing field', () => {
    const encoded = encodeStatyStatus(1n, { genesisHash: genesis, latestEpoch: 2n })
    const withExtra = [...encoded, intToUnpaddedBytes(99)]
    const remote = parseStatyStatus(withExtra)
    assert.equal(remote.latestEpoch, 2n)
  })

  it('validateStatyStatusAgainstLocal() rejects chain mismatch', () => {
    const remote = parseStatyStatus(encodeStatyStatus(1n, { genesisHash: genesis }))
    assert.throws(() => validateStatyStatusAgainstLocal(remote, 11155111n, genesis))
  })

  it('HELLO capability version 0 encodes unpadded for staty', () => {
    const cap = [utf8ToBytes('staty'), intToUnpaddedBytes(0)]
    const payload = RLP.encode([
      intToUnpaddedBytes(5),
      utf8ToBytes('test'),
      [cap],
      new Uint8Array(0),
      new Uint8Array(64),
    ])
    const decoded = RLP.decode(payload) as unknown[]
    const caps = decoded[2] as unknown[]
    const ver = (caps[0] as unknown[])[1] as Uint8Array
    assert.equal(ver.length, 0)
  })

  it('StatyMessageCodes span 0x00..0x0a and name map', () => {
    assert.equal(StatyMessageCodes.STATUS, 0x00)
    assert.equal(StatyMessageCodes.STATY_PEERS, 0x0a)
    assert.equal(statyMessageNameToCode('GET_EPOCH_PART'), StatyMessageCodes.GET_EPOCH_PART)
  })

  it('round-trips GET/EPOCH wire tuples for all message pairs', () => {
    const reqId = bigIntToUnpaddedBytes(1n)
    const hash = new Uint8Array(32).fill(0x01)
    const code = new Uint8Array([0x60, 0x00])
    const messages: unknown[][] = [
      [reqId, bigIntToUnpaddedBytes(2n)],
      [
        reqId,
        bigIntToUnpaddedBytes(2n),
        bigIntToUnpaddedBytes(10n),
        hash,
        bigIntToUnpaddedBytes(0n),
        [],
      ],
      [reqId, bigIntToUnpaddedBytes(2n), intToUnpaddedBytes(0), intToUnpaddedBytes(0)],
      [
        reqId,
        bigIntToUnpaddedBytes(2n),
        intToUnpaddedBytes(0),
        intToUnpaddedBytes(0),
        bigIntToUnpaddedBytes(10n),
        hash,
        [],
        [],
        [],
      ],
      [reqId, bigIntToUnpaddedBytes(5n), intToUnpaddedBytes(524288), [[hash, []]]],
      [reqId, []],
      [reqId, [hash], intToUnpaddedBytes(524288)],
      [reqId, [code]],
      [reqId, intToUnpaddedBytes(16)],
      [reqId, []],
    ]
    for (const msg of messages) {
      const round = RLP.decode(RLP.encode(msg as Input)) as unknown[]
      assert.deepEqual(round.length, msg.length)
    }
  })

  it('discv4 ENR staty tag marks capability', () => {
    const record = discv4ENRList(
      genPrivateKey(),
      { address: '127.0.0.1', udpPort: 30303, tcpPort: 30303 },
      {
        includeStatyTag: true,
      },
    )
    assert.isTrue(statyCapableFromDiscv4Record(record))
  })

  it('STATY._handleMessage() disconnects and suppresses emit when EPOCH_PART exceeds proof cap or RLP is invalid', () => {
    const disconnects: number[] = []
    const fakePeer = {
      common: new Common({ chain: Mainnet }),
      _hello: null,
      _socket: { remoteAddress: '127.0.0.1', remotePort: 30303 },
      disconnect: (reason: number) => disconnects.push(reason),
    } as unknown as Peer
    const staty = new STATY(0, fakePeer, () => {})
    staty.setLocalStatusFields({ genesisHash: genesis })

    const emitted: number[] = []
    staty.events.on('message', (code: number) => emitted.push(code))

    const tooManyProofs = Array.from({ length: MAX_STATY_PROOF_NODES + 1 }, () => new Uint8Array(1))
    const oversizedPart = RLP.encode([
      bigIntToUnpaddedBytes(1n),
      bigIntToUnpaddedBytes(1n),
      intToUnpaddedBytes(0),
      intToUnpaddedBytes(0),
      bigIntToUnpaddedBytes(256n),
      new Uint8Array(32),
      [],
      [],
      tooManyProofs,
    ])
    staty._handleMessage(StatyMessageCodes.EPOCH_PART, oversizedPart)
    assert.deepEqual(disconnects, [DISCONNECT_REASON.SUBPROTOCOL_ERROR])
    assert.equal(emitted.length, 0)

    // Malformed RLP disconnects cleanly without throwing
    staty._handleMessage(StatyMessageCodes.EPOCH_PART, new Uint8Array([0xff, 0xff]))
    assert.equal(disconnects.length, 2)
    assert.equal(emitted.length, 0)

    // Repeat STATUS emits 'status' then 'statusUpdated'
    const events: string[] = []
    staty.events.on('status', () => events.push('status'))
    staty.events.on('statusUpdated', () => events.push('statusUpdated'))
    const s1 = RLP.encode(encodeStatyStatus(1n, { genesisHash: genesis, latestEpoch: 1n }))
    const s2 = RLP.encode(encodeStatyStatus(1n, { genesisHash: genesis, latestEpoch: 2n }))
    staty._handleMessage(StatyMessageCodes.STATUS, s1)
    staty._handleMessage(StatyMessageCodes.STATUS, s2)
    assert.deepEqual(events, ['status', 'statusUpdated'])
  })
})
