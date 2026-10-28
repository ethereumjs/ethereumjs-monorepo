import { assert, describe, it } from 'vitest'

import { NOTICE_MIN_DWELL_MS, NoticeBoard, describeNotice } from '../src/notify/board.ts'
import {
  P2P_QUIET_GRACE_MS,
  discoveryLooksBlocked,
  initialP2pLinkState,
  syncP2pLinkNotices,
} from '../src/notify/p2pLink.ts'
import { stripAnsi } from '../src/tui/ansi.ts'
import { renderNoticeLine } from '../src/tui/noticeLine.ts'

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
    board.post({ key: 'p2p-reachability', level: 'warn', text: 'No peers yet. Firewall? VPN?' }, 0)
    board.post(
      { key: 'p2p-reachability', level: 'warn', text: 'No peers yet. Firewall? VPN?' },
      500,
    )
    assert.equal(describeNotice(board, 500)?.text, 'No peers yet. Firewall? VPN?')
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
    })
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS - 1), null)
  })

  it('shows the short no-peer line after grace or DNS trouble', () => {
    const board = new NoticeBoard()
    syncP2pLinkNotices(board, initialP2pLinkState(), {
      peerCount: 0,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS,
      dnsTimedOut: false,
    })
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS)?.text, 'No peers yet. Firewall? VPN?')
    const board2 = new NoticeBoard()
    assert.isTrue(discoveryLooksBlocked('queryTxt failed'))
    syncP2pLinkNotices(board2, initialP2pLinkState(), {
      peerCount: 0,
      startedAt: 0,
      now: 1_000,
      dnsTimedOut: true,
    })
    assert.equal(describeNotice(board2, 1_000)?.text, 'No peers yet. Firewall? VPN?')
  })

  it('shows a brief online line then clears it', () => {
    const board = new NoticeBoard()
    let state = syncP2pLinkNotices(board, initialP2pLinkState(), {
      peerCount: 0,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS,
      dnsTimedOut: false,
    })
    state = syncP2pLinkNotices(board, state, {
      peerCount: 2,
      startedAt: 0,
      now: P2P_QUIET_GRACE_MS + 100,
      dnsTimedOut: false,
    })
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS + 100)?.text, '2 peers connected.')
    assert.equal(describeNotice(board, P2P_QUIET_GRACE_MS + 100 + 5_000), null)
  })
})

describe('[Ethy/Notices]: line', () => {
  it('right-aligns plain text in the metrics column', () => {
    const cell = renderNoticeLine({ text: 'No peers yet. Firewall? VPN?', level: 'warn' }, 32)
    assert.include(stripAnsi(cell), 'No peers yet. Firewall? VPN?')
    assert.match(stripAnsi(cell), / {2,}No peers/)
  })

  it('leaves the cell empty when there is no notice', () => {
    assert.equal(stripAnsi(renderNoticeLine(null, 24)), '                        ')
  })
})
