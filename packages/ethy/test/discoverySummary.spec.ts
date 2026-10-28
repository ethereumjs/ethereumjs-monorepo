import type { WorkerDiscoverySnapshot } from '@ethereumjs/devp2p'
import { assert, describe, it } from 'vitest'

import { formatDiscoveryLines, formatDiscoverySummary } from '../src/net/discoverySummary.ts'

function sample(): WorkerDiscoverySnapshot {
  return {
    boundAddress: '134.93.187.137',
    boundUdpPort: 52520,
    boundTcpPort: 52520,
    tablePeers: 136,
    advertisedFork: { hardfork: 'amsterdam', hash: '0x6c1d9423', next: '0' },
    bootstrap: { attempts: 4, ok: 1, fail: 3 },
    dns: { attempts: 79, peersAdded: 948, resolver: 'system' },
    rlpx: {
      dials: 626,
      connected: 134,
      statusOk: 1,
      statusSent: 88,
      resetAfterHello: 30,
      disconnects: {
        'SUBPROTOCOL_ERROR (remote dropped us)': 40,
        'TOO_MANY_PEERS (remote dropped us)': 4,
      },
      handshakeRejects: { genesis: 0, network: 6, reset: 36 },
      peerFates: {
        'Geth/v1.16.1 eth/72': { remote: 18, reset: 12 },
        'Geth/v1.13.15 eth/68': { we: 6 },
      },
      lastSubprotocolError: 'Remote 10.0.0.8:30303: Network id mismatch: we=11155111 remote=369',
    },
    dpt: {
      banSkips: 40,
      bansIssued: 3,
      lastRemote: '10.0.0.9:30303',
      lastCause: 'ping failed: Timeout',
    },
  }
}

describe('[Ethy/Net]: discovery summary', () => {
  it('keeps every counter on its own labeled rows inside the width', () => {
    const lines = formatDiscoveryLines(sample(), 100, { size: 20, capacity: 100 })
    const joined = lines.join('\n')
    for (const line of lines) {
      assert.isAtMost(line.length, 100, line)
    }
    assert.include(joined, 'udp 134.93.187.137:52520')
    assert.include(joined, 'tcp 52520')
    assert.include(joined, 'table 136')
    assert.include(joined, 'ring 20/100')
    assert.include(joined, 'Discover boot 1/4')
    assert.include(joined, 'boot 1/4')
    assert.include(joined, 'fail 3')
    assert.include(joined, 'dns 948/79')
    assert.include(joined, 'resolver system')
    assert.include(joined, 'dial 626')
    assert.include(joined, 'conn 134')
    assert.include(joined, 'status 1')
    assert.include(joined, 'sent 88')
    assert.include(joined, 'amsterdam')
    assert.include(joined, '0x6c1d9423')
    assert.include(joined, 'next 0')
    assert.include(joined, 'network 6')
    assert.include(joined, 'reset 36')
    assert.include(joined, 'afterHello 30')
    assert.include(joined, 'SUBPROTOCOL_ERROR/remote 40')
    assert.include(joined, 'TOO_MANY_PEERS/remote 4')
    assert.include(joined, 'Geth/v1.16.1 eth/72 remote 18 reset 12')
    assert.include(joined, 'Geth/v1.13.15 eth/68 we 6')
    assert.include(joined, 'new 3')
    assert.include(joined, 'skip 40')
    assert.include(joined, '10.0.0.9:30303')
    assert.include(joined, 'ping failed: Timeout')
    assert.include(joined, 'Network id mismatch')
    assert.isAbove(lines.length, 1)
  })

  it('joins the same rows for a log line', () => {
    const line = formatDiscoverySummary(sample())
    assert.include(line, 'status 1')
    assert.include(line, ' · ')
  })
})
