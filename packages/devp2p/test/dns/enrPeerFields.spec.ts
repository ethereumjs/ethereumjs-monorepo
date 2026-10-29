import { RLP } from '@ethereumjs/rlp'
import { utf8ToBytes } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import { devp2pTestData } from '@ethereumjs/testdata'
import { ENR } from '../../src/dns/enr.ts'
import { decodeEthForkIdFromEnrValue, peerFieldsFromEnrPairs } from '../../src/dns/enrPeerFields.ts'
import { genPrivateKey, pk2id } from '../../src/util.ts'

describe('[Devp2p/DNS]: ENR peer fields', () => {
  it('peerFieldsFromEnrPairs() sets id and 1-byte tcp port', () => {
    const pk = secp256k1.getPublicKey(genPrivateKey(), true)
    const obj: Record<string, Uint8Array> = {
      secp256k1: pk,
      ip: Uint8Array.from([127, 0, 0, 1]),
      tcp: Uint8Array.from([0x50]),
      udp: Uint8Array.from([0x50, 0x50]),
    }
    const peer = peerFieldsFromEnrPairs(obj)
    assert.strictEqual(peer.address, '127.0.0.1')
    assert.strictEqual(peer.tcpPort, 80)
    assert.strictEqual(peer.udpPort, 0x5050)
    assert.deepEqual(peer.id, pk2id(pk))
  })

  it('parseAndVerifyRecord() includes node id', () => {
    const peer = ENR.parseAndVerifyRecord(devp2pTestData.dns.enr)
    assert.strictEqual(peer.id?.length, 64)
  })

  it('peerFieldsFromEnrPairs() skips missing ip without throwing', () => {
    const peer = peerFieldsFromEnrPairs({ tcp: Uint8Array.from([0x01, 0xbb]) })
    assert.strictEqual(peer.address, undefined)
    assert.strictEqual(peer.tcpPort, 443)
  })

  it('decodeEthForkIdFromEnrValue() accepts nested and flat RLP', () => {
    const fork = Uint8Array.from([0x26, 0x89, 0x56, 0xb6])
    const nested = RLP.encode([[fork, new Uint8Array()]])
    const flat = RLP.encode([fork, new Uint8Array()])
    const a = decodeEthForkIdFromEnrValue(nested)
    const b = decodeEthForkIdFromEnrValue(flat)
    assert.strictEqual(a?.forkHash, '0x268956b6')
    assert.strictEqual(b?.forkHash, '0x268956b6')
    assert.strictEqual(a?.nextFork, 0n)
  })

  it('decodeEthForkIdFromEnrValue() returns undefined for garbage', () => {
    assert.strictEqual(decodeEthForkIdFromEnrValue(utf8ToBytes('nope')), undefined)
  })
})
