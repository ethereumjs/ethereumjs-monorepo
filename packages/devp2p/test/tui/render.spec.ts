import { describe, expect, it } from 'vitest'

import { stripAnsi } from '../../src/tui/ansi.ts'
import { createPaneState } from '../../src/tui/model.ts'
import { computeLayout, renderTui } from '../../src/tui/render.ts'

describe('tui render', () => {
  it('aligns prompts and status under each pane', () => {
    const left = createPaneState('alice', {
      listenLabel: '127.0.0.1:30300',
      rlpxPeerCount: 1,
      lastPeer: '::ffff:10.0.0.1:30302',
    })
    const right = createPaneState('bob', {
      listenLabel: '127.0.0.1:30302',
      rlpxPeerCount: 1,
      lastPeer: '10.0.0.2:30300',
    })
    left.transcript.push({
      layer: 'eth',
      dir: 'out',
      name: 'STATUS',
      payloadLines: ['td  0x01'],
    })
    const layout = computeLayout(100, 24)
    const frame = renderTui(
      {
        left,
        right,
        leftDraft: 'peer list',
        rightDraft: '',
        focus: 'left',
        rightHasPrompt: true,
        footerHint: 'Tab focus',
      },
      layout,
    )
    const plain = stripAnsi(frame)
    const lines = plain.split('\n')
    expect(lines[0]).toContain('alice')
    expect(lines[0]).toContain('bob')
    expect(lines[1]).toContain('10.0.0.1:30302')
    expect(lines[1]).toContain('10.0.0.2:30300')
    expect(lines[1]).not.toContain('::ffff:')
    const prompt = lines.find((line) => line.includes('alice>'))
    expect(prompt).toContain('bob>')
    expect(prompt).toContain('peer list')
    expect(plain).toContain('STATUS')
  })

  it('pads the shorter action box to the taller side', () => {
    const left = createPaneState('alice', { listenLabel: '127.0.0.1:30300' })
    const right = createPaneState('bob', { listenLabel: '127.0.0.1:30302' })
    left.transcript.push({
      layer: 'eth',
      dir: 'out',
      name: 'STATUS',
      payloadLines: ['td  0x01'],
    })
    right.transcript.push({
      layer: 'eth',
      dir: 'out',
      name: 'STATUS',
      payloadLines: ['td  0x01', 'bestHash  0xab', 'genesisHash  0xcd'],
    })
    const frame = renderTui(
      {
        left,
        right,
        leftDraft: '',
        rightDraft: '',
        focus: 'left',
        rightHasPrompt: true,
        footerHint: 'q quit',
      },
      computeLayout(100, 24),
    )
    const lines = stripAnsi(frame).split('\n')
    const top = lines.findIndex((line) => line.includes('┌'))
    const bottom = lines.findIndex((line, i) => i > top && line.includes('└'))
    expect(top).toBeGreaterThan(0)
    expect(bottom - top).toBe(5)
    const inner = lines.slice(top + 1, bottom)
    expect(inner).toHaveLength(4)
    for (const line of inner) {
      expect(line.split('│').length - 1).toBe(4)
    }
    expect(inner.some((line) => line.includes('genesisHash'))).toBe(true)
    expect(inner[0]).toContain('STATUS')
  })
})
