import { assert, describe, it } from 'vitest'

import { DiscoveryMetrics, peerFateLabel } from '../../src/discovery/metrics.ts'
import { DISCONNECT_REASON } from '../../src/types.ts'

describe('[Devp2p/Discovery]: metrics', () => {
  it('labels disconnects by who sent them and counts discovery bans', () => {
    const metrics = new DiscoveryMetrics()
    metrics.recordRlpxDisconnect(DISCONNECT_REASON.TOO_MANY_PEERS, 'remote')
    metrics.recordRlpxDisconnect(DISCONNECT_REASON.SUBPROTOCOL_ERROR, 'local')
    metrics.recordDptBan('1.2.3.4:30303', 'ping failed: Timeout')
    metrics.recordDptBanSkip('1.2.3.4:30303')

    const snap = metrics.snapshot()
    assert.equal(snap.rlpx.disconnects['TOO_MANY_PEERS (remote dropped us)'], 1)
    assert.equal(snap.rlpx.disconnects['SUBPROTOCOL_ERROR (we dropped remote)'], 1)
    assert.equal(snap.dpt.bansIssued, 1)
    assert.equal(snap.dpt.banSkips, 1)
    assert.equal(snap.dpt.lastRemote, '1.2.3.4:30303')
    assert.equal(snap.dpt.lastCause, 'already on our ban list')
    assert.equal(snap.rlpx.handshakeRejects?.slots, 1)
  })

  it('counts handshake rejects separately from discovery ping timeouts', () => {
    const metrics = new DiscoveryMetrics()
    metrics.recordHandshakeReject('genesis')
    metrics.recordHandshakeReject('reset')
    metrics.recordPeerFate('Geth/v1.16.1 eth/72', 'remote')
    metrics.recordPeerFate('Geth/v1.16.1 eth/72', 'reset')
    metrics.recordRlpxDisconnect(DISCONNECT_REASON.TIMEOUT, 'local')
    const snap = metrics.snapshot()
    assert.equal(snap.rlpx.handshakeRejects?.genesis, 1)
    assert.equal(snap.rlpx.handshakeRejects?.reset, 1)
    assert.equal(snap.rlpx.handshakeRejects?.timeout, 1)
    assert.equal(snap.rlpx.peerFates?.['Geth/v1.16.1 eth/72']?.remote, 1)
    assert.equal(snap.rlpx.peerFates?.['Geth/v1.16.1 eth/72']?.reset, 1)
  })

  it('shortens a client id to name and version', () => {
    assert.equal(
      peerFateLabel('Geth/v1.16.1-stable-abc123/linux-amd64/go1.24.0', 72),
      'Geth/v1.16.1 eth/72',
    )
    assert.equal(peerFateLabel(undefined, undefined), 'unknown eth/—')
  })
})
