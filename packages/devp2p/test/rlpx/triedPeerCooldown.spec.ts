import { Common, Mainnet } from '@ethereumjs/common'
import { bytesToUnprefixedHex, randomBytes } from '@ethereumjs/util'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RLPx, TOO_MANY_PEERS_DIAL_HOLD_MS } from '../../src/rlpx/rlpx.ts'
import { DISCONNECT_REASON } from '../../src/types.ts'

import type { PeerInfo } from '../../src/types.ts'

const privateKey = randomBytes(32)

function createRlpx(): RLPx {
  return new RLPx(privateKey, {
    timeout: 1000,
    maxPeers: 25,
    capabilities: [],
    common: new Common({ chain: Mainnet }),
  })
}

function peer(fill: number): PeerInfo {
  return {
    id: new Uint8Array(32).fill(fill),
    address: '1.2.3.4',
    udpPort: 30303,
    tcpPort: 30303,
  }
}

describe('[Devp2p/RLPx]: TOO_MANY_PEERS dial hold', () => {
  const open: RLPx[] = []

  afterEach(() => {
    vi.useRealTimers()
    for (const rlpx of open) rlpx.destroy()
    open.length = 0
  })

  it('allows redialing a full node after the hold window', () => {
    vi.useFakeTimers()
    const rlpx = createRlpx()
    open.push(rlpx)
    const target = peer(42)
    const key = bytesToUnprefixedHex(target.id!)
    rlpx['_peersLRU'].set(key, true)

    rlpx._handlePeerDisconnect(
      {
        getId: () => target.id,
        getHelloMessage: () => ({ clientId: 'Geth/v1.15.0' }),
      } as never,
      DISCONNECT_REASON.TOO_MANY_PEERS,
      false,
    )

    expect(rlpx['_peersLRU'].has(key)).toBe(false)

    const dialed: PeerInfo[] = []
    rlpx['_connectToPeer'] = (p: PeerInfo) => {
      dialed.push(p)
    }

    rlpx['_onDiscoveredPeer'](target)
    expect(dialed).toHaveLength(0)

    vi.advanceTimersByTime(TOO_MANY_PEERS_DIAL_HOLD_MS + 1)
    rlpx['_onDiscoveredPeer'](target)
    expect(dialed).toHaveLength(1)
  })

  it('keeps reth in LRU after TOO_MANY_PEERS so DNS does not redial', () => {
    vi.useFakeTimers()
    const rlpx = createRlpx()
    open.push(rlpx)
    const target = peer(88)
    const key = bytesToUnprefixedHex(target.id!)
    rlpx['_peersLRU'].set(key, true)

    rlpx._handlePeerDisconnect(
      {
        getId: () => target.id,
        getHelloMessage: () => ({ clientId: 'Reth/v1.0.0/linux-amd64' }),
      } as never,
      DISCONNECT_REASON.TOO_MANY_PEERS,
      false,
    )

    expect(rlpx['_peersLRU'].has(key)).toBe(true)

    const dialed: PeerInfo[] = []
    rlpx['_connectToPeer'] = (p: PeerInfo) => {
      dialed.push(p)
    }

    vi.advanceTimersByTime(TOO_MANY_PEERS_DIAL_HOLD_MS * 10)
    rlpx['_onDiscoveredPeer'](target)
    expect(dialed).toHaveLength(0)
  })

  it('keeps eth-only peers in LRU when snap was not negotiated on TOO_MANY_PEERS', () => {
    vi.useFakeTimers()
    const rlpx = createRlpx()
    open.push(rlpx)
    const target = peer(77)
    const key = bytesToUnprefixedHex(target.id!)
    rlpx['_peersLRU'].set(key, true)

    rlpx._handlePeerDisconnect(
      {
        getId: () => target.id,
        getHelloMessage: () => ({ clientId: 'Geth/v1.15.0' }),
        getProtocols: () => [{ constructor: { name: 'ETH' } }],
      } as never,
      DISCONNECT_REASON.TOO_MANY_PEERS,
      false,
    )

    expect(rlpx['_peersLRU'].has(key)).toBe(true)

    const dialed: PeerInfo[] = []
    rlpx['_connectToPeer'] = (p: PeerInfo) => {
      dialed.push(p)
    }

    vi.advanceTimersByTime(TOO_MANY_PEERS_DIAL_HOLD_MS * 10)
    rlpx['_onDiscoveredPeer'](target)
    expect(dialed).toHaveLength(0)
  })

  it('keeps non-snap clients (e.g. scout) in LRU after TOO_MANY_PEERS so they never redial', () => {
    vi.useFakeTimers()
    const rlpx = createRlpx()
    open.push(rlpx)
    const target = peer(99)
    const key = bytesToUnprefixedHex(target.id!)
    rlpx['_peersLRU'].set(key, true)

    rlpx._handlePeerDisconnect(
      {
        getId: () => target.id,
        getHelloMessage: () => ({ clientId: 'eri' + 'gon/v2.60.0/linux-amd64' }),
      } as never,
      DISCONNECT_REASON.TOO_MANY_PEERS,
      false,
    )

    expect(rlpx['_peersLRU'].has(key)).toBe(true)

    const dialed: PeerInfo[] = []
    rlpx['_connectToPeer'] = (p: PeerInfo) => {
      dialed.push(p)
    }

    vi.advanceTimersByTime(TOO_MANY_PEERS_DIAL_HOLD_MS * 10)
    rlpx['_onDiscoveredPeer'](target)
    expect(dialed).toHaveLength(0)
  })
})
