import { assert, describe, it } from 'vitest'

import { getEthyClientVersion } from '../src/clientMeta.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import type { WidgetSpec } from '../src/spine/types.ts'
import { stripAnsi, visibleWidth } from '../src/tui/ansi.ts'
import { CAPABILITY_FG, capabilityMark } from '../src/tui/capabilityMark.ts'
import {
  createInitialViewState,
  decodeKey,
  ghostForPhase,
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

  it('renderFrame() right-aligns the Tab suggestion on the hint row', () => {
    const spine = createSpine('sepolia', 11155111n)
    const ghost = 'What changed in the latest block access list?'
    const view = { ...createInitialViewState(), ghostSuggestion: ghost }
    const lines = renderFrame(spine, view, 100, 30).map((line) => stripAnsi(line))
    const hint = lines[lines.length - 1] ?? ''
    assert.match(hint, /^ Enter submit · Esc exit/)
    assert.match(hint, new RegExp(`${ghost.replace('?', '\\?')} \\[Tab\\] $`))
    assert.match(lines[lines.length - 2] ?? '', /ethy >/)

    const typing = renderFrame(spine, { ...view, promptDraft: 'hi' }, 100, 30).map((line) =>
      stripAnsi(line),
    )
    const typingHint = typing[typing.length - 1] ?? ''
    assert.match(typingHint, /^ Enter submit · Esc exit/)
    assert.notInclude(typingHint, '[Tab]')
  })

  it('promptCaretPosition() sits just after the prompt and the draft', () => {
    const empty = promptCaretPosition(100, 30, '')
    assert.deepEqual(empty, { row: 29, col: 9 })
    const typed = promptCaretPosition(100, 30, 'ab')
    assert.deepEqual(typed, { row: 29, col: 11 })
  })

  it('renderFrame() paints suggestion dots with the same marks as the top pills', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    const lines = renderFrame(spine, createInitialViewState(), 100, 30)
    const peers = lines.find((line) => line.includes('Which clients are connected')) ?? ''
    const snap = lines.find((line) => line.includes('bucket 0x3')) ?? ''
    const head = lines.find((line) => line.includes('block access list')) ?? ''
    assert.include(peers, `${CAPABILITY_FG.p2p}●`)
    assert.include(snap, `${CAPABILITY_FG.snap}◐`)
    assert.include(head, `${CAPABILITY_FG.head}○`)
    const top = lines[0] ?? ''
    assert.include(top, `${CAPABILITY_FG.p2p}●`)
    assert.include(top, `${CAPABILITY_FG.snap}◐`)
    assert.include(top, `${CAPABILITY_FG.head}○`)
    assert.equal(capabilityMark('p2p', 'locked').startsWith(CAPABILITY_FG.p2p), true)
    assert.equal(capabilityMark('p2p', 'ready').startsWith(CAPABILITY_FG.p2p), true)
  })

  it('renderFrame() splits suggestions into commands and prose', () => {
    const spine = createSpine('sepolia', 11155111n)
    const view = createInitialViewState()
    const first = renderFrame(spine, view, 100, 30).map((line) => stripAnsi(line))
    const peers = first.find((line) => line.includes('/peers')) ?? ''
    assert.match(peers.slice(1, 50), /\/peers — latency table by client/)
    assert.match(peers.slice(50), /Which clients are connected/)
    assert.notMatch(peers.slice(1, 50), /Which clients/)

    const next = renderFrame(spine, { ...view, carouselTick: 1 }, 100, 30).map((line) =>
      stripAnsi(line),
    )
    const rotated = next.find((line) => line.includes('/drop')) ?? ''
    assert.match(rotated.slice(1, 50), /\/drop — remove one peer/)
    assert.match(rotated.slice(50), /Who is the slowest peer/)
    assert.notInclude(rotated, '/peers')
  })

  it('renderFrame() places dotted suggestions between rules above the prompt', () => {
    const spine = createSpine('sepolia', 11155111n)
    const lines = renderFrame(spine, createInitialViewState(), 100, 30).map((line) =>
      stripAnsi(line),
    )
    const suggestion = lines.findIndex((line) => line.includes('Which clients are connected'))
    assert.isAbove(suggestion, 4)
    assert.equal(lines[3]?.trim(), '')
    assert.equal(lines[suggestion - 2]?.[0], '─')
    assert.equal(lines[suggestion - 1]?.trim(), '')
    assert.equal(lines[suggestion + 3]?.trim(), '')
    assert.equal(lines[suggestion + 4]?.[0], '─')
    assert.match(lines[suggestion + 5] ?? '', /ethy >/)
    assert.match(lines[lines.length - 1] ?? '', /Enter submit/)
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
  it('Tab fills ghost into draft when empty', () => {
    let view = createInitialViewState()
    const ghost = ghostForPhase('SNAP_SYNCING')
    const r = reducePromptKey(view, { type: 'tab' }, ghost)
    assert.equal(r.view.promptDraft, ghost)
  })

  it('Up/Down walks command history', () => {
    let view = createInitialViewState()
    view.history = ['a', 'b']
    view.historyIndex = 2
    let r = reducePromptKey(view, { type: 'up' }, '')
    view = r.view
    assert.equal(view.promptDraft, 'b')
    r = reducePromptKey(view, { type: 'down' }, '')
    assert.equal(r.view.promptDraft, '')
  })

  it('Enter submits non-empty draft', () => {
    const view = { ...createInitialViewState(), promptDraft: '/peers' }
    const r = reducePromptKey(view, { type: 'enter' }, '')
    assert.equal(r.submittedLine, '/peers')
  })

  it('exit action sets shouldExit', () => {
    const r = reducePromptKey(createInitialViewState(), { type: 'exit' }, '')
    assert.isTrue(r.view.shouldExit)
  })

  it('decodeKey() maps Ctrl+C to exit', () => {
    const { actions } = decodeKey('', '\u0003')
    assert.deepEqual(actions, [{ type: 'exit' }])
  })

  it('backspace removes last draft character', () => {
    const view = { ...createInitialViewState(), promptDraft: 'abc' }
    const r = reducePromptKey(view, { type: 'backspace' }, '')
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
