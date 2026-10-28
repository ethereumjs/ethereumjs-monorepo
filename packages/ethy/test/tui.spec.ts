import { assert, describe, it } from 'vitest'

import { getEthyClientVersion } from '../src/clientMeta.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import type { WidgetSpec } from '../src/spine/types.ts'
import { stripAnsi, visibleWidth } from '../src/tui/ansi.ts'
import { CAPABILITY_FG, capabilityMark } from '../src/tui/capabilityMark.ts'
import {
  createInitialViewState,
  cycleDomain,
  decodeKey,
  reducePromptKey,
} from '../src/tui/prompt.ts'
import { promptCaretPosition, renderFrame } from '../src/tui/renderFrame.ts'

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
    assert.equal(stripAnsi(plain[plain.length - 2] ?? '').trim(), '')
  })

  it('promptCaretPosition() sits just after the domain mark and draft', () => {
    const empty = promptCaretPosition(100, 30, '')
    assert.deepEqual(empty, { row: 28, col: 11 })
    const typed = promptCaretPosition(100, 30, 'ab')
    assert.deepEqual(typed, { row: 28, col: 13 })
  })

  it('renderFrame() cockpit command box follows activeDomain', () => {
    const spine = createSpine('sepolia', 11155111n)
    const p2p = stripAnsi(renderFrame(spine, createInitialViewState(), 100, 30).join('\n'))
    const snapView = { ...createInitialViewState(), activeDomain: 'snap' as const }
    const snap = stripAnsi(renderFrame(spine, snapView, 100, 30).join('\n'))
    assert.include(p2p, '/peers')
    assert.include(snap, '/buckets')
    assert.equal(capabilityMark('p2p', 'locked').startsWith(CAPABILITY_FG.p2p), true)
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
