import { describe, expect, it } from 'vitest'

import { emptyCursor, moveHistory, pushHistoryLine } from '../../src/tui/history.ts'
import { pushKey } from '../../src/tui/keys.ts'

describe('tui history', () => {
  it('caps lines and skips a repeated last command', () => {
    let lines: string[] = []
    lines = pushHistoryLine(lines, 'peer list', 2)
    lines = pushHistoryLine(lines, 'peer list', 2)
    lines = pushHistoryLine(lines, 'dpt ping 127.0.0.1 30303', 2)
    lines = pushHistoryLine(lines, 'eth send STATUS', 2)
    expect(lines).toEqual(['dpt ping 127.0.0.1 30303', 'eth send STATUS'])
  })

  it('walks up to the previous command and down to the draft', () => {
    const lines = ['peer list', 'eth send STATUS']
    let cursor = emptyCursor(lines)
    let draft = 'rlpx ping'
    ;({ cursor, draft } = moveHistory(lines, cursor, draft, 'up'))
    expect(draft).toBe('eth send STATUS')
    ;({ cursor, draft } = moveHistory(lines, cursor, draft, 'up'))
    expect(draft).toBe('peer list')
    ;({ cursor, draft } = moveHistory(lines, cursor, draft, 'down'))
    expect(draft).toBe('eth send STATUS')
    ;({ cursor, draft } = moveHistory(lines, cursor, draft, 'down'))
    expect(draft).toBe('rlpx ping')
    expect(cursor.index).toBe(lines.length)
  })
})

describe('tui keys', () => {
  it('reads an up arrow escape sequence', () => {
    let buffer = ''
    let action: ReturnType<typeof pushKey>['action']
    for (const ch of '\u001b[A') {
      ;({ buffer, action } = pushKey(buffer, ch))
    }
    expect(buffer).toBe('')
    expect(action).toEqual({ type: 'up' })
  })
})
