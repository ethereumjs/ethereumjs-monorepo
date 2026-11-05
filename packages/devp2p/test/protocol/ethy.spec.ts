import { RLP } from '@ethereumjs/rlp'
import { intToUnpaddedBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  encodeEthyStatus,
  parseEthyStatus,
  validateEthyStatusAgainstLocal,
} from '../../src/protocol/ethy/codec.ts'
import { EthyMessageCodes } from '../../src/protocol/ethy/codes.ts'

describe('[Devp2p/ETHY]: codecs', () => {
  const genesis = new Uint8Array(32).fill(0xab)

  it('encodeEthyStatus() uses canonical zero (0x80) for protocol version and bucket 0', () => {
    const tuple = encodeEthyStatus(11155111n, { genesisHash: genesis, bucketsBitmask: 0 })
    assert.equal(tuple.length, 9)
    const decoded = RLP.decode(RLP.encode(tuple)) as unknown[]
    assert.equal((decoded[0] as Uint8Array).length, 0)
    assert.equal((decoded[5] as Uint8Array).length, 0)
  })

  it('parseEthyStatus() round-trips STATUS fields', () => {
    const encoded = encodeEthyStatus(11155111n, {
      genesisHash: genesis,
      basePivotBlock: 100n,
      bucketsBitmask: 0x00ff,
      balEarliestBlock: 100n,
      balLatestBlock: 116n,
      latestBlockHash: new Uint8Array(32).fill(0x01),
    })
    const remote = parseEthyStatus(encoded)
    assert.equal(remote.protocolVersion, 0)
    assert.equal(remote.chainId, 11155111n)
    assert.equal(remote.basePivotBlock, 100n)
    assert.equal(remote.bucketsBitmask, 0x00ff)
    assert.equal(remote.balLatestBlock, 116n)
  })

  it('validateEthyStatusAgainstLocal() rejects chain mismatch', () => {
    const remote = parseEthyStatus(
      encodeEthyStatus(1n, { genesisHash: genesis, bucketsBitmask: 1 }),
    )
    assert.throws(() => validateEthyStatusAgainstLocal(remote, 11155111n, genesis))
  })

  it('HELLO capability version 0 encodes unpadded', () => {
    const cap = [utf8ToBytes('ethy'), intToUnpaddedBytes(0)]
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

  it('EthyMessageCodes span 0x00..0x0a', () => {
    assert.equal(EthyMessageCodes.STATUS, 0x00)
    assert.equal(EthyMessageCodes.ETHY_PEERS, 0x0a)
  })
})
