import { describe, expect, it } from 'vitest'

import { pairTranscripts } from '../../src/tui/pairs.ts'

import type { TranscriptLine } from '../../src/tui/model.ts'

function line(
  layer: TranscriptLine['layer'],
  dir: TranscriptLine['dir'],
  name: string,
): TranscriptLine {
  return { layer, dir, name, payloadLines: [] }
}

describe('pairTranscripts', () => {
  it('pairs a send with the other node receive and keeps that row order', () => {
    const left = [
      line('dpt', 'in', 'peer:new'),
      line('eth', 'out', 'STATUS'),
      line('eth', 'in', 'STATUS'),
      line('rlpx', 'in', 'PING'),
    ]
    const right = [
      line('rlpx', 'in', 'peer:added'),
      line('eth', 'out', 'STATUS'),
      line('eth', 'in', 'STATUS'),
      line('dpt', 'in', 'peer:new'),
      line('rlpx', 'in', 'PING'),
    ]
    const pairs = pairTranscripts(left, right, 'mirror')
    expect(names(pairs)).toEqual([
      { left: [], right: ['in peer:added'] },
      { left: ['in peer:new'], right: ['in peer:new'] },
      { left: ['out STATUS'], right: ['out STATUS'] },
      { left: ['in STATUS'], right: ['in STATUS'] },
      { left: ['in PING'], right: ['in PING'] },
    ])
  })

  it('gives the get and the header answer their own rows', () => {
    const left = [
      line('rlpx', 'in', 'PING'),
      line('rlpx', 'out', 'PONG'),
      line('eth', 'in', 'GET_BLOCK_HEADERS'),
      line('eth', 'out', 'BLOCK_HEADERS'),
    ]
    const right = [
      line('rlpx', 'in', 'PING'),
      line('rlpx', 'out', 'PONG'),
      line('eth', 'out', 'GET_BLOCK_HEADERS'),
      line('eth', 'in', 'BLOCK_HEADERS'),
    ]
    const pairs = pairTranscripts(left, right, 'mirror')
    expect(names(pairs)).toEqual([
      { left: ['in PING'], right: ['in PING'] },
      { left: ['out PONG'], right: ['out PONG'] },
      { left: ['in GET_BLOCK_HEADERS'], right: ['out GET_BLOCK_HEADERS'] },
      { left: ['out BLOCK_HEADERS'], right: ['in BLOCK_HEADERS'] },
    ])
  })

  it('keeps a local command reply off the wire pairing', () => {
    const wire = line('rlpx', 'out', 'peer list')
    const reply = { ...line('rlpx', 'out', 'peer list'), local: true }
    const pairs = pairTranscripts([reply], [wire], 'mirror')
    expect(pairs).toEqual([
      { left: [reply], right: [] },
      { left: [], right: [wire] },
    ])
  })

  it('echo mode pairs only the same direction', () => {
    const left = [line('eth', 'out', 'STATUS'), line('eth', 'in', 'STATUS')]
    const right = [line('eth', 'in', 'STATUS')]
    const pairs = pairTranscripts(left, right, 'echo')
    expect(pairs).toEqual([
      { left: [left[0]], right: [] },
      { left: [left[1]], right: [right[0]] },
    ])
  })
})

function names(pairs: { left: TranscriptLine[]; right: TranscriptLine[] }[]) {
  const label = (lines: TranscriptLine[]) => lines.map((line) => `${line.dir} ${line.name}`)
  return pairs.map((pair) => ({ left: label(pair.left), right: label(pair.right) }))
}
