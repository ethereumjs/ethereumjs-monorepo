import { describe, expect, it } from 'vitest'

import { parseStoryOutput } from '../src/ai/parseStoryOutput.ts'

describe('parseStoryOutput', () => {
  it('parses labeled sections', () => {
    const raw = `HEADLINE: Blob fees tick up
STORY: Base Batcher bought blob space.
ANGLE: EIP-4844 (2024).
CURIOSITY: Will fees fall overnight?
COMMAND: /signals`
    const p = parseStoryOutput(raw)
    expect(p?.headline).toContain('Blob fees')
    expect(p?.story).toContain('Base Batcher')
    expect(p?.command).toBe('/signals')
  })

  it('strips think blocks and markdown fences', () => {
    const open = String.fromCharCode(60) + 'think' + String.fromCharCode(62)
    const close = String.fromCharCode(60) + '/' + 'think' + String.fromCharCode(62)
    const raw = `${open}secret reasoning${close}
HEADLINE: x
STORY: y`
    const p = parseStoryOutput(raw)
    expect(p?.headline).toBe('x')
    expect(p?.story).toContain('y')
  })

  it('salvages long plain prose without headers', () => {
    const raw =
      'A long quiet stretch on Sepolia still leaves fingerprints. ' +
      'Validators graffiti-test client builds while contracts deploy with test ETH only. ' +
      'That is dress rehearsal, not stolen funds.'
    const p = parseStoryOutput(raw)
    expect(p?.headline.length).toBeGreaterThan(10)
    expect(p?.story.length).toBeGreaterThan(40)
  })

  it('strips internal signal kind jargon from output', () => {
    const raw = `HEADLINE: Watch delegation_surge
STORY: score 52 on l2_blob_pressure anomaly.`
    const p = parseStoryOutput(raw)!
    expect(p.headline).not.toMatch(/delegation_surge/i)
    expect(p.story).not.toMatch(/score\s+52/)
  })
})
