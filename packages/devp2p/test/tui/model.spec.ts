import { describe, expect, it } from 'vitest'

import type { LabEventRecord } from '../../src/lab/eventBus.ts'
import {
  createPaneState,
  formatCommandReply,
  normalizePeerEndpoint,
  peerMatchesFilter,
  reduceLabEvent,
} from '../../src/tui/model.ts'

describe('tui model', () => {
  it('tracks RLPx peers and ETH STATUS flags', () => {
    let pane = createPaneState('alice')
    pane = reduceLabEvent(pane, {
      v: 1,
      t: 'event',
      node: 'alice',
      dir: 'in',
      layer: 'rlpx',
      name: 'peer:added',
      peer: '127.0.0.1:30302',
      clientId: 'geth/1.0',
    })
    expect(pane.status.rlpxPeerCount).toBe(1)
    expect(pane.status.remoteClientId).toBe('geth/1.0')

    pane = reduceLabEvent(pane, {
      v: 1,
      t: 'event',
      node: 'alice',
      dir: 'out',
      layer: 'eth',
      name: 'STATUS',
      peer: '127.0.0.1:30302',
      payload: { td: '0x01' },
    })
    expect(pane.status.ethStatusSent).toBe(true)
    pane = reduceLabEvent(pane, {
      v: 1,
      t: 'event',
      node: 'alice',
      dir: 'in',
      layer: 'eth',
      name: 'STATUS',
      peer: '127.0.0.1:30302',
    })
    expect(pane.status.ethStatusReceived).toBe(true)
    expect(pane.transcript.length).toBeGreaterThan(0)

    pane = reduceLabEvent(pane, {
      v: 1,
      t: 'event',
      dir: 'in',
      layer: 'eth',
      name: 'STATUS',
      payload: ['0x44', '0x01', '0x0400', '0xaa', '0xbb', ['0xb715077d', '0xd228c8']],
    })
    const inbound = pane.transcript[pane.transcript.length - 1]!
    expect(inbound.payloadLines[0]).toBe('version  0x44')
    expect(inbound.payloadLines[2]).toBe('td  0x0400')
    expect(inbound.payloadLines).toContain('forkHash  0xb715077d')
    expect(inbound.payloadLines).toContain('forkNext  0xd228c8')

    pane = reduceLabEvent(pane, {
      v: 1,
      t: 'event',
      dir: 'in',
      layer: 'eth',
      name: 'GET_BLOCK_HEADERS',
      payload: ['0x01', ['0xabcd', '0x01', '0x00', '0x00']],
    })
    const headers = pane.transcript[pane.transcript.length - 1]!
    expect(headers.payloadLines[0]).toBe('requestId  0x01')
    expect(headers.payloadLines[1]).toBe('startBlock  0xabcd')
    expect(headers.payloadLines[4]).toBe('reverse  false')

    pane = reduceLabEvent(pane, {
      v: 1,
      t: 'event',
      dir: 'out',
      layer: 'eth',
      name: 'BLOCK_HEADERS',
      payload: ['0x01', []],
    })
    expect(pane.transcript[pane.transcript.length - 1]!.payloadLines).toEqual([
      'requestId  0x01',
      'headers  (none)',
    ])
  })

  it('filters transcript by remote peer', () => {
    let pane = createPaneState('alice')
    const ev: LabEventRecord = {
      v: 1,
      t: 'event',
      dir: 'in',
      layer: 'eth',
      name: 'BLOCK_HEADERS',
      peer: '127.0.0.1:30302',
    }
    pane = reduceLabEvent(pane, ev, { peerFilter: '127.0.0.1:30302' })
    expect(pane.transcript).toHaveLength(1)

    pane = createPaneState('alice')
    pane = reduceLabEvent(pane, ev, { peerFilter: '127.0.0.1:9999' })
    expect(pane.transcript).toHaveLength(0)
  })

  it('hides RLPx ping and pong unless keepalive is requested', () => {
    const ping = {
      v: 1,
      t: 'event' as const,
      dir: 'in' as const,
      layer: 'rlpx' as const,
      name: 'PING',
    }
    expect(reduceLabEvent(createPaneState('alice'), ping).transcript).toHaveLength(0)
    expect(
      reduceLabEvent(createPaneState('alice'), ping, { showKeepalive: true }).transcript,
    ).toHaveLength(1)
  })

  it('formats a peer list reply, including an empty table', () => {
    expect(formatCommandReply('peer.list', [{ index: 0, addr: '::ffff:127.0.0.1:30302' }])).toEqual(
      ['0  127.0.0.1:30302'],
    )
    expect(formatCommandReply('peer.list', [])).toEqual(['(none)'])
    expect(formatCommandReply('eth.send', { sent: 'STATUS' })).toBeUndefined()
  })

  it('normalizes peer endpoints for filters', () => {
    expect(normalizePeerEndpoint('::ffff:127.0.0.1:30302')).toEqual({
      host: '127.0.0.1',
      port: 30302,
    })
    expect(peerMatchesFilter('::ffff:127.0.0.1:30302', '127.0.0.1:30302')).toBe(true)
  })
})
