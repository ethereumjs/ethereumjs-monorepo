import { assert, describe, it } from 'vitest'

import { DiscoveryMetrics } from '../../src/discovery/metrics.ts'
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
  })
})
