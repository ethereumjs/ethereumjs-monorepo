import type { WorkerDiscoverySnapshot } from '@ethereumjs/devp2p'
import { assert, describe, it } from 'vitest'

import { formatDiscoverySummary } from '../src/net/discoverySummary.ts'

describe('[Ethy/Net]: discovery summary', () => {
  it('names who dropped the RLPx session and counts remote discovery bans', () => {
    const d: WorkerDiscoverySnapshot = {
      boundAddress: '127.0.0.1',
      boundUdpPort: 30303,
      boundTcpPort: 30303,
      tablePeers: 2,
      bootstrap: { attempts: 1, ok: 1, fail: 0 },
      dns: { attempts: 1, peersAdded: 1, resolver: 'system' },
      rlpx: {
        dials: 3,
        connected: 2,
        statusOk: 0,
        disconnects: { 'SUBPROTOCOL_ERROR (we dropped remote)': 2 },
        lastSubprotocolError: 'Remote RLPx 10.0.0.8:30303: invalid fork id',
      },
      dpt: {
        banSkips: 40,
        bansIssued: 3,
        lastRemote: '10.0.0.9:30303',
        lastCause: 'ping failed: Timeout',
      },
    }
    const line = formatDiscoverySummary(d)
    assert.include(line, 'SUBPROTOCOL_ERROR (we dropped remote):2')
    assert.include(line, 'lastRlpx=Remote RLPx 10.0.0.8:30303')
    assert.include(line, 'dptBan new=3 skip=40')
    assert.include(line, 'lastRemote=10.0.0.9:30303')
  })
})
