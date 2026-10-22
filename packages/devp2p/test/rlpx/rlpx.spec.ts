// Tests written with help from CodiumAI

import assert from 'assert'
import { Common, Mainnet } from '@ethereumjs/common'
import { randomBytes } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { EventEmitter } from 'eventemitter3'
import { describe, expect, it, vi } from 'vitest'

import { RLPx, pk2id } from '../../src/index.ts'

import type { RLPxOptions } from '../../src/index.ts'

const privateKey = randomBytes(32)
describe('[Devp2p/RLPx]: transport', () => {
  it('creates RLPx with the given private key and options', () => {
    const options: RLPxOptions = {
      timeout: 10000,
      maxPeers: 10,
      clientId: new Uint8Array([6, 7, 8, 9, 10]),
      capabilities: [],
      common: new Common({ chain: Mainnet }),
    }

    const rlpx = new RLPx(privateKey, options)

    expect(rlpx).toBeInstanceOf(RLPx)
    expect(rlpx.events).toBeInstanceOf(EventEmitter)
    expect(rlpx['_privateKey']).toEqual(privateKey)
    expect(rlpx.id).toEqual(pk2id(secp256k1.getPublicKey(privateKey, false)))
    expect(rlpx['_timeout']).toEqual(options.timeout)
    expect(rlpx['_maxPeers']).toEqual(options.maxPeers)
    expect(rlpx.clientId).toEqual(options.clientId)
    expect(rlpx['_remoteClientIdFilter']).toBeUndefined()
    expect(rlpx['_capabilities']).toEqual(options.capabilities)
    assert.deepEqual(rlpx['_common'], options.common)
    expect(rlpx['_listenPort']).toBeNull()
    expect(rlpx['_dpt']).toBeNull()
    expect(rlpx['_peersQueue']).toEqual([])
    expect(rlpx['_peers']).toBeInstanceOf(Map)
    expect(rlpx['_refillIntervalId']).toBeDefined()
    expect(rlpx['_refillIntervalSelectionCounter']).toEqual(0)
  })

  it('listen() delegates to the internal server', () => {
    const options: RLPxOptions = {
      timeout: 10000,
      maxPeers: 10,
      clientId: new Uint8Array([6, 7, 8, 9, 10]),
      capabilities: [],
      common: new Common({ chain: Mainnet }),
    }

    const rlpx = new RLPx(privateKey, options)
    const mockServer = {
      listen: vi.fn(),
    }
    rlpx['_server'] = mockServer as any

    rlpx.listen(30303)

    expect(mockServer.listen).toHaveBeenCalledWith(30303)
  })

  it('throws when connect targets an already-connected peer', async () => {
    const options: RLPxOptions = {
      timeout: 10000,
      maxPeers: 10,
      clientId: new Uint8Array([6, 7, 8, 9, 10]),
      capabilities: [],
      common: new Common({ chain: Mainnet }),
    }
    const rlpx = new RLPx(privateKey, options)
    const mockPeer = {
      tcpPort: 30303,
      address: '127.0.0.1',
      id: new Uint8Array([11, 12, 13, 14, 15]),
    }
    rlpx['_peers'].set('0b0c0d0e0f', {} as any)

    try {
      await rlpx.connect(mockPeer)
      assert.fail('should throw')
    } catch (err: any) {
      assert.strictEqual(err.message, 'Already connected')
    }
  })

  it('reports open peer and queue slots from maxPeers', () => {
    const options: RLPxOptions = {
      timeout: 10000,
      maxPeers: 10,
      clientId: new Uint8Array([6, 7, 8, 9, 10]),
      capabilities: [],
      common: new Common({ chain: Mainnet }),
    }
    const rlpx = new RLPx(privateKey, options)

    assert.strictEqual(
      rlpx['_getOpenSlots'](),
      10,
      'returns default number of open slots (i.e. `max_peers`) on startup',
    )
    assert.strictEqual(
      rlpx['_getOpenQueueSlots'](),
      20,
      'returns default number of open queue slots on startup',
    )
  })
})
