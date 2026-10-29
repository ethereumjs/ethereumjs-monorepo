import type { WorkerDiscoverySnapshot } from '@ethereumjs/devp2p'
import { assert, describe, it } from 'vitest'

import { NOTICE_MIN_DWELL_MS, NoticeBoard, describeNotice } from '../src/notify/board.ts'
import {
  P2P_QUIET_GRACE_MS,
  P2P_REACHABILITY_HINT,
  discoveryLooksBlocked,
  initialP2pLinkState,
  p2pDiscoveryTrafficSeen,
  shouldWarnP2pReachability,
  syncP2pLinkNotices,
} from '../src/notify/p2pLink.ts'
import { stripAnsi } from '../src/tui/ansi.ts'
import { renderNoticeLine } from '../src/tui/noticeLine.ts'

function emptyDiscovery(overrides?: Partial<WorkerDiscoverySnapshot>): WorkerDiscoverySnapshot {
  return {
    boundAddress: '127.0.0.1',
    boundUdpPort: 30_303,
    boundTcpPort: 30_303,
    tablePeers: 0,
    bootstrap: { attempts: 0, ok: 0, fail: 0 },
    dns: { attempts: 0, peersAdded: 0 },
    rlpx: { dials: 0, connected: 0, statusOk: 0, disconnects: {} },
    dpt: { banSkips: 0, bansIssued: 0 },
    ...overrides,
  }
}

describe('[Ethy/Notices]: board', () => {
  it('holds the current notice for the minimum dwell before the next one', () => {
    const board = new NoticeBoard()
    board.post({ key: 'a', level: 'info', text: 'First' }, 0)
    board.post({ key: 'b', level: 'warn', text: 'Second' }, 1_000)
    assert.equal(describeNotice(board, 1_000)?.text, 'First')
    assert.equal(describeNotice(board, NOTICE_MIN_DWELL_MS)?.text, 'Second')
  })

  it('returns null when nothing is live', () => {
    const board = new NoticeBoard()
    assert.equal(describeNotice(board, 0), null)
  })

  it('clears after a short notice expires', () => {
    const board = new NoticeBoard()
    board.post({ key: 'brief', level: 'info', text: 'Peer connected.', relevantForMs: 5_000 }, 0)
    assert.equal(describeNotice(board, 4_000)?.text, 'Peer connected.')
    assert.equal(describeNotice(board, 5_000), null)
  })

  it('updates the same key in place', () => {
    const board = new NoticeBoard()
    board.post({ key: 'p2p-reachability', level: 'warn', text: P2P_REACHABILITY_HINT }, 0)
    board.post({ key: 'p2p-reachability', level: 'warn', text: P2P_REACHABILITY_HINT }, 500)
    assert.equal(describeNotice(board, 500)?.text, P2P_REACHABILITY_HINT)
  })
})

describe('[Ethy/Notices]: p2p link', () => {
  it('stays silent during the grace window with no peers', () => {
    const board = new NoticeBoard()
    syncP2pLinkNotices(board, initialP2pLinkState(), {
      peerCount: 0,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS - 1,
      dnsTimedOut: false,
      discovery: emptyDiscovery(),
    })
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS - 1), null)
  })

  it('shows the reachability line after grace when discovery never moved', () => {
    const board = new NoticeBoard()
    syncP2pLinkNotices(board, initialP2pLinkState(), {
      peerCount: 0,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS,
      dnsTimedOut: false,
      discovery: emptyDiscovery(),
    })
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS)?.text, P2P_REACHABILITY_HINT)
  })

  it('shows reachability early when DNS lookup fails', () => {
    const board = new NoticeBoard()
    assert.isTrue(discoveryLooksBlocked('queryTxt failed'))
    syncP2pLinkNotices(board, initialP2pLinkState(), {
      peerCount: 0,
      startedAt: 0,
      now: 1_000,
      dnsTimedOut: true,
      discovery: emptyDiscovery(),
    })
    assert.equal(describeNotice(board, 1_000)?.text, P2P_REACHABILITY_HINT)
  })

  it('stays silent after grace when P2P traffic is visible', () => {
    assert.isTrue(
      p2pDiscoveryTrafficSeen(
        emptyDiscovery({ rlpx: { dials: 3, connected: 0, statusOk: 0, disconnects: {} } }),
      ),
    )
    assert.isFalse(
      shouldWarnP2pReachability({
        peerCount: 0,
        startedAt: 0,
        now: P2P_QUIET_GRACE_MS + 1,
        dnsTimedOut: false,
        discovery: emptyDiscovery({
          rlpx: { dials: 3, connected: 0, statusOk: 0, disconnects: {} },
        }),
      }),
    )
    const board = new NoticeBoard()
    syncP2pLinkNotices(board, initialP2pLinkState(), {
      peerCount: 0,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS + 1,
      dnsTimedOut: false,
      discovery: emptyDiscovery({
        rlpx: { dials: 163, connected: 0, statusOk: 2, disconnects: {} },
      }),
    })
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS + 1), null)
  })

  it('clears reachability once discovery traffic appears', () => {
    const board = new NoticeBoard()
    let state = syncP2pLinkNotices(board, initialP2pLinkState(), {
      peerCount: 0,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS,
      dnsTimedOut: false,
      discovery: emptyDiscovery(),
    })
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS)?.text, P2P_REACHABILITY_HINT)
    state = syncP2pLinkNotices(board, state, {
      peerCount: 0,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS + 500,
      dnsTimedOut: false,
      discovery: emptyDiscovery({
        dns: { attempts: 10, peersAdded: 0 },
      }),
    })
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS + 500), null)
  })

  it('shows a brief online line then clears it', () => {
    const board = new NoticeBoard()
    let state = syncP2pLinkNotices(board, initialP2pLinkState(), {
      peerCount: 0,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS,
      dnsTimedOut: false,
      discovery: emptyDiscovery(),
    })
    state = syncP2pLinkNotices(board, state, {
      peerCount: 2,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS + 100,
      dnsTimedOut: false,
      discovery: emptyDiscovery(),
    })
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS + 100)?.text, '2 peers connected.')
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS + 100 + 5_000), null)
  })

  it('does not show reachability again when peers drop after being online', () => {
    const board = new NoticeBoard()
    let state = syncP2pLinkNotices(board, initialP2pLinkState(), {
      peerCount: 1,
      startedAt: 0,
      now: 1_000,
      dnsTimedOut: false,
      discovery: emptyDiscovery({ rlpx: { dials: 5, connected: 1, statusOk: 1, disconnects: {} } }),
    })
    state = syncP2pLinkNotices(board, state, {
      peerCount: 0,
      startedAt: 0,
      now: 2_000,
      dnsTimedOut: false,
      discovery: emptyDiscovery({
        rlpx: { dials: 20, connected: 0, statusOk: 1, disconnects: {} },
      }),
    })
    assert.equal(describeNotice(board, 2_000), null)
    assert.isFalse(state.online)
  })
})

describe('[Ethy/Notices]: line', () => {
  it('right-aligns plain text in the metrics column', () => {
    const cell = renderNoticeLine({ text: P2P_REACHABILITY_HINT, level: 'warn' }, 32)
    assert.include(stripAnsi(cell), P2P_REACHABILITY_HINT)
    assert.match(stripAnsi(cell), / {2,}Discovery/)
  })

  it('leaves the cell empty when there is no notice', () => {
    assert.equal(stripAnsi(renderNoticeLine(null, 24)), '                        ')
  })
})
