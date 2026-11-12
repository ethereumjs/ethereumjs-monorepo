import { assert, describe, it } from 'vitest'

import { getEthyClientVersion } from '../src/clientMeta.ts'
import { P2P_REACHABILITY_HINT } from '../src/notify/p2pLink.ts'
import { createSpine, deriveCapabilities, setPhase } from '../src/spine/createSpine.ts'
import type { WidgetSpec } from '../src/spine/types.ts'
import { diagnosticsTableWidget, peersTableWidget } from '../src/tools/diagnose.ts'
import { stripAnsi, visibleWidth } from '../src/tui/ansi.ts'
import { CAPABILITY_FG, capabilityMark } from '../src/tui/capabilityMark.ts'
import { cockpitColumnWidths } from '../src/tui/cockpit.ts'
import { renderCockpit } from '../src/tui/cockpit.ts'
import { capabilityBarClockLabel } from '../src/tui/headerClock.ts'
import { measurePage } from '../src/tui/pageLayout.ts'
import {
  createInitialViewState,
  cycleDomain,
  decodeKey,
  reducePromptKey,
} from '../src/tui/prompt.ts'
import { promptCaretPosition, renderFrame } from '../src/tui/renderFrame.ts'
import { boxBottom } from '../src/tui/roundedBox.ts'
import {
  clearOverviewFocus,
  historyEntryTitle,
  inferDomainForCommandOrPrompt,
  mergeOverviewFocus,
  openDomainHelp,
  pushViewHistory,
} from '../src/tui/viewHistory.ts'
import { layoutTableColumns, renderWidgetLines } from '../src/tui/widgets.ts'

function assertFrameFits(lines: string[], cols: number, rows: number) {
  assert.equal(lines.length, rows)
  for (const line of lines) {
    assert.isAtMost(visibleWidth(line), cols)
  }
}

describe('[Ethy/TUI]: renderFrame', () => {
  it('renderFrame() keeps Slot a fixed gap left of P2P', () => {
    const view = createInitialViewState()
    const spineA = createSpine('sepolia', 11155111n)
    spineA.demoClock = true
    spineA.currentSlot = 1
    spineA.bestPeerHead = 1n
    const spineB = createSpine('sepolia', 11155111n)
    spineB.demoClock = true
    spineB.currentSlot = 123456
    spineB.bestPeerHead = 123456n
    const topA = stripAnsi(renderFrame(spineA, view, 100, 30)[0] ?? '')
    const topB = stripAnsi(renderFrame(spineB, view, 100, 30)[0] ?? '')
    assert.equal(topA.indexOf('P2P'), topB.indexOf('P2P'))
    assert.match(topA, /Slot 1\b/)
    assert.match(topB, /Slot 123,456\b/)
    assert.isAbove(topA.indexOf('Slot'), topA.indexOf('SEPOLIA'))
  })

  it('range bar stays honest after the serving peer leaves with cached accounts', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    spine.snapBuckets[0]!.accountsLoaded = 50_000
    spine.snapBuckets[0]!.status = 'pending'
    deriveCapabilities(spine)
    const plain = stripAnsi(renderFrame(spine, createInitialViewState(), 140, 30).join('\n'))
    assert.include(plain, '░')
    assert.include(plain, 'Snap Sync · Accounts')
    assert.include(plain, 'acc ·')
    assert.notInclude(plain, 'kept')
    assert.notInclude(plain, '16/16')

    // When syncing is active with known range progress and rate, Progress shows (~Xm)
    spine.totalAccountsSynced = 13_500_000
    spine.accountsPerSec = 40_000
    spine.snapEtaMinutes = 38
    const withEta = stripAnsi(renderFrame(spine, createInitialViewState(), 140, 30).join('\n'))
    assert.include(withEta, '(~38m)')
  })

  it('node pulse uses four rows and BAL catch-up copy', () => {
    const view = createInitialViewState()
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'BAL_CATCHUP')
    spine.pivotBlockNumber = 100n
    spine.lastVerifiedBlockNumber = 110n
    spine.balCatchUp = { fromBlock: 101n, applied: 10, total: 25 }
    const catchUp = stripAnsi(renderFrame(spine, view, 160, 30).join('\n'))
    assert.include(catchUp, 'BAL Catch-Up')
    assert.include(catchUp, '10 / 25 BALs applied')
    assert.match(catchUp, /%/)
    assert.include(catchUp, '█')
    assert.notInclude(catchUp, 'kept')
    assert.notInclude(catchUp, 'previous')
    assert.notInclude(catchUp, '!')

    setPhase(spine, 'SNAP_SYNCING')
    spine.pivotBlockNumber = 1_000n
    spine.streamedBalCount = 3
    spine.bufferedBalCount = 2
    spine.pivotStepsCompleted = 1
    deriveCapabilities(spine)
    const streaming = stripAnsi(renderFrame(spine, view, 160, 30).join('\n'))
    assert.include(streaming, '+2 BALs')
    assert.include(streaming, 'step 1')

    setPhase(spine, 'HEAD_FOLLOWING')
    spine.headBlockNumber = 125n
    spine.bestPeerHead = 125n
    const head = stripAnsi(renderFrame(spine, view, 160, 30).join('\n'))
    assert.include(head, '★ Head Following · Live')
    assert.include(head, '#125')
    assert.include(head, '(live)')
    assert.include(head, '100%')
  })

  it('renderFrame() at 100x30 respects column width', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    spine.snapBuckets[3]!.status = 'stalled'
    const view = createInitialViewState()
    const lines = renderFrame(spine, view, 100, 30)
    assertFrameFits(lines, 100, 30)
    const joined = stripAnsi(lines.join('\n'))
    assert.notInclude(joined, 'Head follow')
    assert.notInclude(joined, 'Total accounts synced')
    assert.notInclude(joined, '┌')
  })

  it('renderFrame() at 80x24 respects column width', () => {
    const spine = createSpine('sepolia', 11155111n)
    const view = createInitialViewState()
    assertFrameFits(renderFrame(spine, view, 80, 24), 80, 24)
  })

  it('renderFrame() shows Ethy version and fixed capability columns on top row', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'HEAD_FOLLOWING')
    const lines = renderFrame(spine, createInitialViewState(), 100, 30)
    const top = stripAnsi(lines[0] ?? '')
    assert.match(top, new RegExp(`^   Ethy v${getEthyClientVersion()} \\| SEPOLIA`))
    assert.equal(top.slice(0, 3), '   ')
    assert.equal(top.slice(-3), '   ')
    const spacerAfterTop = stripAnsi(lines[1] ?? '')
    assert.equal(spacerAfterTop.trim(), '')
    assert.match(top, /○ Economy/)
    assert.match(top, /● State/)
    assert.match(top, /○ P2P/)
    assert.match(top, /◐ AI/)
    assert.notInclude(top, 'Synced')
    assert.notInclude(top, 'Slash/Rule')
    assert.notInclude(top, '[')
  })

  it('capabilityBarClockLabel includes JSON-RPC between slot and pills', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.clOptimisticBlockNumber = 12_071_450n
    spine.clOptimisticSlot = 11_500_000
    spine.phase = 'HEAD_FOLLOWING'
    spine.lastVerifiedBlockNumber = 12_071_450n
    spine.rpc = {
      enabled: true,
      listening: true,
      host: '127.0.0.1',
      port: 8545,
      url: 'http://127.0.0.1:8545',
      totalRequests: 0,
      totalErrors: 0,
      methodStats: {},
      recentCalls: [],
    }
    const label = stripAnsi(capabilityBarClockLabel(spine))
    assert.include(label, 'JSON-RPC')
  })

  it('capabilityBarClockLabel dims Block when lagging canonical head', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'HEAD_FOLLOWING')
    spine.headBlockNumber = 12_071_440n
    spine.bestPeerHead = 12_071_450n
    const lagging = capabilityBarClockLabel(spine)
    assert.include(lagging, '\x1b[2m')

    spine.headBlockNumber = 12_071_449n
    const atHead = capabilityBarClockLabel(spine)
    assert.include(atHead, '\x1b[1m')
    assert.include(atHead, 'Block')
  })

  it('capabilityBarClockLabel prefers CL slot over EL block number', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.clOptimisticSlot = 12_071_120
    spine.pivotBlockNumber = 12_070_000n
    const both = capabilityBarClockLabel(spine)
    assert.include(both, 'Block 12,070,000')
    assert.include(both, 'Slot 12,071,120')
    assert.isBelow(both.indexOf('Block'), both.indexOf('Slot'))
    spine.clOptimisticSlot = undefined
    spine.demoClock = undefined
    spine.bestPeerHead = 12_071_450n
    assert.include(capabilityBarClockLabel(spine), 'Block 12,071,450')
  })

  it('renderFrame() Node Pulse shows bridge target distinct from capability slot', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    spine.clOptimisticSlot = 9_999_999
    spine.pivotBlockNumber = 12_070_000n
    spine.pivotBridging = {
      fromBlock: 12_070_000n,
      currentBlock: 12_070_100n,
      targetBlock: 12_070_350n,
    }
    spine.totalAccountsSynced = 3_000_000
    const view = createInitialViewState()
    const width = 160
    const top = stripAnsi(renderFrame(spine, view, width, 30)[0] ?? '')
    const cols = measurePage(width, 30).contentWidth
    const cockpit = stripAnsi(renderCockpit(spine, view, cols).join('\n'))
    assert.include(top, 'Slot 9,999,999')
    assert.include(cockpit, '12,070,000')
    assert.include(cockpit, '12,070,350')
  })

  it('renderFrame() keeps right-anchored capability pills when P2P label changes', () => {
    const view = createInitialViewState()
    const spineA = createSpine('sepolia', 11155111n)
    spineA.capabilities.p2p.label = 'Connecting'
    const spineB = createSpine('sepolia', 11155111n)
    spineB.capabilities.p2p.label = '3 Peers'
    const topA = stripAnsi(renderFrame(spineA, view, 100, 30)[0] ?? '')
    const topB = stripAnsi(renderFrame(spineB, view, 100, 30)[0] ?? '')
    assert.equal(topA.indexOf('Economy'), topB.indexOf('Economy'))
    assert.equal(topA.indexOf('State'), topB.indexOf('State'))
    assert.equal(topA.indexOf('P2P'), topB.indexOf('P2P'))
  })

  it('renderFrame() shows 3-box cockpit and domain-lens hint row', () => {
    const spine = createSpine('sepolia', 11155111n)
    const view = createInitialViewState()
    const plain = renderFrame(spine, view, 100, 30).map((line) => stripAnsi(line))
    const joined = plain.join('\n')
    assert.include(joined, 'Stage')
    assert.notInclude(joined, 'Node Pulse')
    assert.notInclude(joined, 'Metrics')
    assert.include(joined, '╭')
    assert.notInclude(joined, 'Which peers are connected')
    const hint = plain[plain.length - 1] ?? ''
    assert.match(hint, /Tab help/)
    assert.notMatch(hint, /view history/)
    assert.notInclude(hint, 'Why is bucket')
    assert.match(plain[plain.length - 3] ?? '', /ethy >/)
    const raw = renderFrame(spine, view, 100, 30, {
      text: P2P_REACHABILITY_HINT,
      level: 'warn',
    })
    const footer = stripAnsi(raw[raw.length - 1] ?? '')
    assert.notInclude(footer, P2P_REACHABILITY_HINT)
  })

  it('promptCaretPosition() sits just after the domain mark and draft', () => {
    const empty = promptCaretPosition(100, 30, '')
    assert.deepEqual(empty, { row: 28, col: 13 })
    const typed = promptCaretPosition(100, 30, 'ab')
    assert.deepEqual(typed, { row: 28, col: 15 })
  })

  it('renderFrame() P2P metrics show Served instead of Caps', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.serving = {
      blocksStored: 1,
      headersServed: 2,
      bodiesServed: 0,
      receiptsServed: 0,
      accessListsServed: 0,
      ethyChunksServed: 0,
      ethyBalBlocksServed: 0,
      ethyBytesServed: 0,
      totalRequestsServed: 2,
      totalBytesServed: 48_000,
      earliestBlock: '100',
      latestBlock: '100',
    }
    const view = { ...createInitialViewState(), activeDomain: 'p2p' as const }
    spine.ethyBucketsBitmask = 0xffff
    const frame = stripAnsi(renderFrame(spine, view, 100, 30).join('\n'))
    assert.include(frame, 'Served')
    assert.include(frame, 'eth')
    assert.include(frame, 'ethy')
    assert.include(frame, 'replies')
    assert.notInclude(frame, 'Caps')
    for (const line of renderFrame(spine, view, 100, 30)) {
      assert.equal(visibleWidth(line), 100)
    }
  })

  it('renderFrame() starts on centered Welcome start page and Tab help opens economy commands without polluting history', () => {
    const spine = createSpine('sepolia', 11155111n)
    const startView = createInitialViewState(spine)
    assert.equal(startView.activeWidget?.kind, 'start_page')
    assert.equal(startView.showingHelp, false)
    assert.equal(startView.viewHistory.length, 1)
    const seed = startView.viewHistory[0]
    assert.equal(seed?.kind, 'slash')
    if (seed?.kind === 'slash') assert.equal(seed.command, '/welcome')

    const startFrame = stripAnsi(renderFrame(spine, startView, 120, 36).join('\n'))
    assert.include(startFrame, 'Welcome')
    assert.include(startFrame, '◆════╬════◆')
    assert.include(startFrame, 'Execution-Free Ethereum Node')
    assert.notInclude(startFrame, 'Ctrl+D')
    assert.notInclude(startFrame, '← →')

    const helpView = openDomainHelp(startView, spine)
    assert.equal(helpView.viewHistory.length, 2)
    assert.equal(helpView.viewHistoryIndex, 1)
    const helpLines = renderFrame(spine, helpView, 120, 36).map((l) => stripAnsi(l))
    const frame = helpLines.join('\n')
    assert.include(frame, '/economy')
    assert.include(frame, '/contract')
    assert.include(frame, '/buckets')
    assert.include(frame, '/peers')
    assert.include(frame, 'Commands & AI')
    assert.include(frame, 'Ctrl+D debug')
    assert.notInclude(frame, 'Commands | Debug')
    assert.include(frame, 'AI Examples')
    assert.equal(capabilityMark('p2p', 'locked').startsWith(CAPABILITY_FG.p2p), true)
    assert.equal(capabilityMark('ai', 'partial').startsWith(CAPABILITY_FG.ai), true)

    assert.isAbove(
      helpLines.findIndex((l) => l.includes('Target')),
      0,
    )
    assert.isAbove(
      helpLines.findIndex((l) => l.includes('/peers')),
      0,
    )
  })

  it('layoutTableColumns() keeps short diagnostic columns tight and gives Message the rest', () => {
    const headers = ['Time', 'Subsystem', 'Sev', 'Peer', 'Message']
    const widths = layoutTableColumns(headers, 140)
    assert.deepEqual(widths.slice(0, 4), [10, 12, 8, 8])
    assert.isAbove(widths[4] ?? 0, 60)
    const message =
      'Remote 148.251.145.225:30316: peer unreachable (ICMP or TCP reset, surfaced as ECONNRESET)'
    const lines = renderWidgetLines(
      {
        kind: 'table',
        title: 'Diagnostic ring (latest)',
        headers,
        rows: [['13:30:14', 'devp2p', 'warn', '—', message]],
      },
      140,
    )
    const row = stripAnsi(lines.find((line) => line.includes('13:30:14')) ?? '')
    assert.include(row, 'peer unreachable')
    assert.isAtMost(visibleWidth(row), 140)
    for (const line of lines) {
      assert.equal(visibleWidth(line), 140)
    }
  })

  it('renderFrame() renders table widget in workspace', () => {
    const spine = createSpine('sepolia', 11155111n)
    const widget: WidgetSpec = {
      kind: 'table',
      title: 'Test',
      headers: ['A', 'B'],
      rows: [['1', '2']],
    }
    const view = { ...createInitialViewState(), activeWidget: widget }
    const lines = renderFrame(spine, view, 100, 30)
    assert.include(lines.join('\n'), 'Test')
  })

  it('renderFrame() keeps discovery telemetry on debug page only for /diag', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.discovery = {
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
        disconnects: { 'SUBPROTOCOL_ERROR (remote dropped us)': 40 },
        handshakeRejects: { network: 6, reset: 36 },
      },
      dpt: { banSkips: 40, bansIssued: 3, lastRemote: '10.0.0.9:30303' },
    }
    const widget = diagnosticsTableWidget(spine)
    const mainView = {
      ...createInitialViewState(),
      activeWidget: widget,
      interactionPage: 'main' as const,
      interactionLabel: '/diag',
    }
    const mainPlain = stripAnsi(renderFrame(spine, mainView, 120, 36).join('\n'))
    assert.notInclude(mainPlain, 'Boot ok')
    assert.notInclude(mainPlain, 'udp 134.93.187.137')
    const debugView = { ...mainView, interactionPage: 'debug' as const }
    const debugPlain = stripAnsi(renderFrame(spine, debugView, 120, 36).join('\n'))
    assert.include(debugPlain, 'Boot ok')
    assert.include(debugPlain, 'RLPx status')
  })

  it('renderFrame() shows Economy in top cockpit row', () => {
    const spine = createSpine('sepolia', 11155111n)
    const joined = stripAnsi(renderFrame(spine, createInitialViewState(), 100, 40).join('\n'))
    assert.include(joined, 'Economy')
    assert.include(joined, 'Fee (64b)')
  })

  it('renderFrame() at 100x60 respects column width', () => {
    const spine = createSpine('sepolia', 11155111n)
    assertFrameFits(renderFrame(spine, createInitialViewState(), 100, 60), 100, 60)
  })

  it('renderFrame() keeps all 3 domain paragraphs visible when focusNote targets economy and openDomainHelp clears focusNote', () => {
    const spine = createSpine('sepolia', 11155111n)
    let view = createInitialViewState(spine)
    view.aiOverviewSections = mergeOverviewFocus(
      {
        state: 'State sync at 100%.',
        economy: 'Base fee 1.2 Gwei.',
        p2p: '7 peers active.',
      },
      'Contract 0x1234 is a DEX Router.',
      inferDomainForCommandOrPrompt('/contract 1', view.activeDomain),
    )
    assert.equal(view.aiOverviewSections?.focusNote?.domain, 'economy')
    const frameWithFocus = stripAnsi(renderFrame(spine, view, 140, 36).join('\n'))
    assert.include(frameWithFocus, 'State sync at 100%.')
    assert.include(frameWithFocus, 'Contract 0x1234 is a')
    assert.include(frameWithFocus, 'DEX Router.')
    assert.include(frameWithFocus, '7 peers active.')

    view = pushViewHistory(view, {
      kind: 'slash',
      command: '/peers',
      label: '/peers',
      page: 'main',
    })
    view = openDomainHelp(view, spine)
    assert.isUndefined(view.aiOverviewSections?.focusNote)
    const helpFrame = stripAnsi(renderFrame(spine, view, 120, 36).join('\n'))
    assert.include(helpFrame, 'Base fee 1.2 Gwei.')
    assert.include(helpFrame, 'Commands & AI')
    assert.include(helpFrame, '←')
    assert.equal(historyEntryTitle(view.viewHistory[1]!), '/peers')
    assert.equal(view.viewHistoryIndex, 2)
    assert.isUndefined(clearOverviewFocus(view.aiOverviewSections)?.focusNote)
  })
})

describe('[Ethy/TUI]: rounded box bottom hint', () => {
  it('boxBottom() keeps full line width with optional right hint', () => {
    const plain = stripAnsi(boxBottom(80))
    assert.equal(visibleWidth(boxBottom(80)), 80)
    const hinted = boxBottom(80, 'Ctrl+D debug')
    assert.equal(visibleWidth(hinted), 80)
    assert.include(stripAnsi(hinted), 'Ctrl+D debug')
  })
})

describe('[Ethy/TUI]: prompt reducer', () => {
  it('Tab on empty draft requests help toggle', () => {
    const r = reducePromptKey(createInitialViewState(), { type: 'tab' })
    assert.equal(r.helpToggle, true)
    assert.equal(r.view.promptDraft, '')
  })

  it('Tab completes slash prefix', () => {
    const view = { ...createInitialViewState(), promptDraft: '/p' }
    const r = reducePromptKey(view, { type: 'tab' })
    assert.equal(r.view.promptDraft, '/peers')
  })

  it('Enter on empty draft opens plaza return', () => {
    const r = reducePromptKey(createInitialViewState(), { type: 'enter' })
    assert.isUndefined(r.submittedLine)
    assert.equal(r.openPlaza, true)
  })

  it('cycleDomain() walks economy → state → p2p', () => {
    assert.equal(cycleDomain('economy', 1), 'state')
    assert.equal(cycleDomain('p2p', 1), 'economy')
    assert.equal(cycleDomain('economy', -1), 'p2p')
  })

  it('decodeKey() maps left arrow on empty draft', () => {
    const { actions } = decodeKey('', '\u001b[D')
    assert.deepEqual(actions, [{ type: 'left' }])
  })

  it('Up/Down walks command history', () => {
    let view = createInitialViewState()
    view.history = ['a', 'b']
    view.historyIndex = 2
    let r = reducePromptKey(view, { type: 'up' })
    view = r.view
    assert.equal(view.promptDraft, 'b')
    r = reducePromptKey(view, { type: 'down' })
    assert.equal(r.view.promptDraft, '')
  })

  it('Enter submits non-empty draft', () => {
    const view = { ...createInitialViewState(), promptDraft: '/peers' }
    const r = reducePromptKey(view, { type: 'enter' })
    assert.equal(r.submittedLine, '/peers')
  })

  it('exit action sets shouldExit', () => {
    const r = reducePromptKey(createInitialViewState(), { type: 'exit' })
    assert.isTrue(r.view.shouldExit)
  })

  it('decodeKey() maps Ctrl+C to exit', () => {
    const { actions } = decodeKey('', '\u0003')
    assert.deepEqual(actions, [{ type: 'exit' }])
  })

  it('decodeKey() maps Ctrl+D to toggleDebug even when escapeBuffer is non-empty', () => {
    const { actions } = decodeKey('', '\u0004')
    assert.deepEqual(actions, [{ type: 'toggleDebug' }])
    const interrupted = decodeKey('\u001b', '\u0004')
    assert.deepEqual(interrupted.actions, [{ type: 'toggleDebug' }])
    assert.equal(interrupted.buffer, '')
  })

  it('Ctrl+D reducer does not mutate draft', () => {
    const view = { ...createInitialViewState(), promptDraft: '/pe' }
    const r = reducePromptKey(view, { type: 'toggleDebug' })
    assert.equal(r.toggleDebug, true)
    assert.equal(r.view.promptDraft, '/pe')
  })

  it('backspace removes last draft character', () => {
    const view = { ...createInitialViewState(), promptDraft: 'abc' }
    const r = reducePromptKey(view, { type: 'backspace' })
    assert.equal(r.view.promptDraft, 'ab')
  })

  it('decodeKey() maps DEL and BS to backspace', () => {
    assert.deepEqual(decodeKey('', '\u007f').actions, [{ type: 'backspace' }])
    assert.deepEqual(decodeKey('', '\b').actions, [{ type: 'backspace' }])
  })

  it('decodeKey() maps CSI delete to backspace', () => {
    const { actions } = decodeKey('', '\u001b[3~')
    assert.deepEqual(actions, [{ type: 'backspace' }])
  })

  it('decodeKey() ignores stray control characters', () => {
    const { actions } = decodeKey('', '\u000c')
    assert.deepEqual(actions, [{ type: 'ignore' }])
  })

  it('decodeKey() splits arrow keys across chunks', () => {
    let buf = ''
    let r = decodeKey(buf, '\u001b')
    buf = r.buffer
    assert.equal(r.actions.length, 0)
    r = decodeKey(buf, '[A')
    assert.deepEqual(r.actions, [{ type: 'up' }])
  })

  it('peersTableWidget surfaces full untruncated local enode on main page and wraps in KeyValueUIComponent', () => {
    const spine = createSpine('sepolia', 11155111n)
    const fullEnode = `enode://${'f1e12475'.repeat(16)}@127.0.0.1:30303`
    spine.discovery = {
      boundAddress: '127.0.0.1',
      boundUdpPort: 30303,
      boundTcpPort: 30303,
      tablePeers: 10,
      localEnode: fullEnode,
      advertisedFork: { hardfork: 'amsterdam', hash: '0x6c1d9423', next: '0' },
      bootstrap: { attempts: 1, ok: 1, fail: 0 },
      dns: { attempts: 1, peersAdded: 1, resolver: 'system' },
      rlpx: { dials: 1, connected: 1, statusOk: 1, statusSent: 1, disconnects: {} },
      dpt: { banSkips: 0, bansIssued: 0 },
    }
    let view = createInitialViewState(spine)
    view = {
      ...view,
      activeWidget: peersTableWidget(spine),
      interactionLabel: '/peers',
    }
    const frame = renderFrame(spine, view, 100, 30).map(stripAnsi).join('\n')
    // At 100 cols, innerWidth is ~60 cols so a 153-char enode wraps onto 3 aligned rows without ellipsis
    assert.include(frame, 'enode://f1e12475')
    assert.include(frame, '30303')
    assert.notInclude(frame, 'f1e12475…')
  })
})
