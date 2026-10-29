import { assert, describe, it } from 'vitest'

import { getEthyClientVersion } from '../src/clientMeta.ts'
import { P2P_REACHABILITY_HINT } from '../src/notify/p2pLink.ts'
import { createSpine, deriveCapabilities, setPhase } from '../src/spine/createSpine.ts'
import type { WidgetSpec } from '../src/spine/types.ts'
import { stripAnsi, visibleWidth } from '../src/tui/ansi.ts'
import { CAPABILITY_FG, capabilityMark } from '../src/tui/capabilityMark.ts'
import { cockpitColumnWidths } from '../src/tui/cockpit.ts'
import { measurePage } from '../src/tui/pageLayout.ts'
import {
  createInitialViewState,
  cycleDomain,
  decodeKey,
  reducePromptKey,
} from '../src/tui/prompt.ts'
import { promptCaretPosition, renderFrame } from '../src/tui/renderFrame.ts'
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
    spineA.currentSlot = 1
    const spineB = createSpine('sepolia', 11155111n)
    spineB.currentSlot = 123456
    const topA = stripAnsi(renderFrame(spineA, view, 100, 30)[0] ?? '')
    const topB = stripAnsi(renderFrame(spineB, view, 100, 30)[0] ?? '')
    assert.equal(topA.indexOf('P2P'), topB.indexOf('P2P'))
    assert.match(topA, /Slot 1 {8}\S P2P/)
    assert.match(topB, /Slot 123456 {8}\S P2P/)
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
    assert.include(plain, '0/16 paused')
    assert.notInclude(plain, '16/16')
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
    assert.match(top, new RegExp(`^ Ethy v${getEthyClientVersion()} \\| SEPOLIA`))
    assert.equal(top[0], ' ')
    assert.equal(top[top.length - 1], ' ')
    const rule = stripAnsi(lines[1] ?? '')
    assert.equal(rule[0], '─')
    assert.equal(rule[rule.length - 1], '─')
    assert.match(top, /● P2P/)
    assert.match(top, /● SNAP/)
    assert.match(top, /● HEAD/)
    assert.match(top, /◐ AI/)
    assert.notInclude(top, 'Synced')
    assert.notInclude(top, 'Slash/Rule')
    assert.notInclude(top, '[')
    assert.match(lines[1] ?? '', /─/)
  })

  it('renderFrame() keeps right-anchored capability pills when P2P label changes', () => {
    const view = createInitialViewState()
    const spineA = createSpine('sepolia', 11155111n)
    spineA.capabilities.p2p.label = 'Connecting'
    const spineB = createSpine('sepolia', 11155111n)
    spineB.capabilities.p2p.label = '3 Peers'
    const topA = stripAnsi(renderFrame(spineA, view, 100, 30)[0] ?? '')
    const topB = stripAnsi(renderFrame(spineB, view, 100, 30)[0] ?? '')
    assert.equal(topA.indexOf('SNAP'), topB.indexOf('SNAP'))
    assert.equal(topA.indexOf('HEAD'), topB.indexOf('HEAD'))
    assert.equal(topA.indexOf('AI'), topB.indexOf('AI'))
  })

  it('renderFrame() shows 3-box cockpit and domain-lens hint row', () => {
    const spine = createSpine('sepolia', 11155111n)
    const view = createInitialViewState()
    const plain = renderFrame(spine, view, 100, 30).map((line) => stripAnsi(line))
    const joined = plain.join('\n')
    assert.include(joined, 'Node Pulse')
    assert.include(joined, '╭')
    assert.notInclude(joined, 'Which peers are connected')
    const hint = plain[plain.length - 1] ?? ''
    assert.match(hint, /Tab switch domain/)
    assert.notInclude(hint, 'Why is bucket')
    assert.match(plain[plain.length - 3] ?? '', /ethy >/)
    assert.notInclude(joined, 'All quiet')
    const raw = renderFrame(spine, view, 100, 30, {
      text: P2P_REACHABILITY_HINT,
      level: 'warn',
    })
    const footer = stripAnsi(raw[raw.length - 1] ?? '')
    assert.include(footer, P2P_REACHABILITY_HINT)
    const right = cockpitColumnWidths(measurePage(100, 30).contentWidth)[2]
    assert.isAtMost(footer.length, 100)
    assert.isAtLeast(footer.indexOf('Discovery'), 100 - right)
  })

  it('promptCaretPosition() sits just after the domain mark and draft', () => {
    const empty = promptCaretPosition(100, 30, '')
    assert.deepEqual(empty, { row: 28, col: 11 })
    const typed = promptCaretPosition(100, 30, 'ab')
    assert.deepEqual(typed, { row: 28, col: 13 })
  })

  it('renderFrame() P2P metrics show Served instead of Caps', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.serving = {
      blocksStored: 1,
      headersServed: 2,
      bodiesServed: 0,
      receiptsServed: 0,
      accessListsServed: 0,
      totalRequestsServed: 2,
      totalBytesServed: 48_000,
      earliestBlock: '100',
      latestBlock: '100',
    }
    const view = { ...createInitialViewState(), activeDomain: 'p2p' as const }
    const frame = stripAnsi(renderFrame(spine, view, 100, 30).join('\n'))
    assert.include(frame, 'Served')
    assert.include(frame, 'replies')
    assert.notInclude(frame, 'Caps')
    for (const line of renderFrame(spine, view, 100, 30)) {
      assert.equal(visibleWidth(line), 100)
    }
  })

  it('renderFrame() cockpit command box follows activeDomain', () => {
    const spine = createSpine('sepolia', 11155111n)
    const p2p = stripAnsi(renderFrame(spine, createInitialViewState(), 100, 30).join('\n'))
    const snapView = { ...createInitialViewState(), activeDomain: 'snap' as const }
    const snap = stripAnsi(renderFrame(spine, snapView, 100, 30).join('\n'))
    assert.include(p2p, '/peers')
    assert.include(snap, '/buckets')
    assert.include(snap, '/range')
    assert.include(snap, '/sample')
    assert.equal(capabilityMark('p2p', 'locked').startsWith(CAPABILITY_FG.p2p), true)
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

  it('renderFrame() reserves labeled discovery rows under the diagnostic table', () => {
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
    const widget: WidgetSpec = {
      kind: 'table',
      title: 'Diagnostic ring (latest)',
      headers: ['Time', 'Subsystem', 'Sev', 'Peer', 'Message'],
      rows: Array.from({ length: 20 }, (_, i) => [String(i), 'devp2p', 'warn', '—', 'reset']),
      footer: 'discovery',
    }
    const view = { ...createInitialViewState(), activeWidget: widget }
    const raw = renderFrame(spine, view, 120, 36)
    assertFrameFits(raw, 120, 36)
    const lines = raw.map((line) => stripAnsi(line))
    const bindAt = lines.findIndex((line) => line.includes('udp 134.93.187.137:52520'))
    const promptAt = lines.findIndex((line) => line.includes('ethy >'))
    assert.isAbove(bindAt, 0)
    assert.isAbove(promptAt, bindAt)
    const block = lines.slice(bindAt, promptAt).join('\n')
    assert.include(block, 'dial 626')
    assert.include(block, 'status 1')
    assert.include(block, 'sent 88')
    assert.include(block, 'amsterdam')
    assert.include(block, 'network 6')
    assert.include(block, 'SUBPROTOCOL_ERROR/remote 40')
  })
})

describe('[Ethy/TUI]: prompt reducer', () => {
  it('Tab on empty draft requests domain cycle', () => {
    const r = reducePromptKey(createInitialViewState(), { type: 'tab' })
    assert.equal(r.domainCycle, 1)
    assert.equal(r.view.promptDraft, '')
  })

  it('Tab completes slash prefix', () => {
    const view = { ...createInitialViewState(), promptDraft: '/p' }
    const r = reducePromptKey(view, { type: 'tab' })
    assert.equal(r.view.promptDraft, '/peers')
  })

  it('Enter on empty draft opens deep view', () => {
    const r = reducePromptKey(createInitialViewState(), { type: 'enter' })
    assert.isTrue(r.openDeepView)
  })

  it('cycleDomain() walks p2p → snap → head → ai', () => {
    assert.equal(cycleDomain('p2p', 1), 'snap')
    assert.equal(cycleDomain('ai', 1), 'p2p')
    assert.equal(cycleDomain('p2p', -1), 'ai')
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
})
