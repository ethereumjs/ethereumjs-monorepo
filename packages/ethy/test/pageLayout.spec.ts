import { assert, describe, it } from 'vitest'

import { DIM, RESET, stripAnsi, visibleWidth } from '../src/tui/ansi.ts'
import {
  PAGE_PADDING,
  bandContentWidth,
  insetLine,
  layoutPage,
  measurePage,
} from '../src/tui/pageLayout.ts'

describe('[Ethy/TUI]: page layout', () => {
  it('measurePage() reserves one column on each side', () => {
    const page = measurePage(100, 30)
    assert.deepEqual(page.padding, PAGE_PADDING)
    assert.equal(page.contentWidth, 98)
  })

  it('layoutPage() insets content and keeps a delimiter full width', () => {
    const page = measurePage(20, 6)
    const lines = layoutPage(page, [
      { kind: 'content', lines: ['Title'] },
      { kind: 'delimiter', open: DIM, close: RESET },
      { kind: 'spacer' },
      { kind: 'fill', lines: ['Body'] },
      { kind: 'content', lines: ['Prompt'] },
    ])
    assert.equal(lines.length, 6)
    for (const line of lines) assert.equal(visibleWidth(line), 20)

    const title = stripAnsi(lines[0] ?? '')
    assert.equal(title[0], ' ')
    assert.equal(title[title.length - 1], ' ')
    assert.equal(title.slice(1, 6), 'Title')

    const rule = stripAnsi(lines[1] ?? '')
    assert.equal(rule, '─'.repeat(20))

    const body = stripAnsi(lines[3] ?? '')
    assert.equal(body.slice(1, 5), 'Body')
    assert.equal(stripAnsi(lines[5] ?? '').slice(1, 7), 'Prompt')
  })

  it('insetLine() can add padding on top of the page inset', () => {
    const page = measurePage(16, 1)
    const plain = insetLine(page.cols, 'Item', page.padding)
    const tighter = insetLine(page.cols, 'Item', page.padding, { left: 2 })
    assert.equal(stripAnsi(plain).slice(1, 5), 'Item')
    assert.equal(stripAnsi(tighter).slice(3, 7), 'Item')
    assert.equal(bandContentWidth(page, { left: 2 }), page.contentWidth - 2)
  })

  it('layoutPage() applies extra padding to a single band', () => {
    const page = measurePage(16, 2)
    const lines = layoutPage(page, [
      { kind: 'content', lines: ['Wide'] },
      { kind: 'content', lines: ['Nest'], padding: { left: 3, right: 1 } },
    ])
    assert.equal(stripAnsi(lines[0] ?? '').slice(1, 5), 'Wide')
    const nested = stripAnsi(lines[1] ?? '')
    assert.equal(nested.slice(0, 4), '    ')
    assert.equal(nested.slice(4, 8), 'Nest')
    assert.equal(nested[nested.length - 1], ' ')
  })
})
