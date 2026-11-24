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

  it('strips think blocks and unwraps markdown fences without erasing the story', () => {
    const open = String.fromCharCode(60) + 'think' + String.fromCharCode(62)
    const close = String.fromCharCode(60) + '/' + 'think' + String.fromCharCode(62)
    const raw = `${open}secret reasoning${close}
\`\`\`markdown
HEADLINE: Fenced headline
STORY: First paragraph of story.

Second paragraph stays separate.
\`\`\``
    const p = parseStoryOutput(raw)
    expect(p?.headline).toBe('Fenced headline')
    expect(p?.story).toBe('First paragraph of story.\n\nSecond paragraph stays separate.')
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

  it('strips markdown bold, [END OF REPORT], and accidental dossier meta-phrases', () => {
    const raw = `HEADLINE: **0.3 KB contract deployed**
STORY: The dossier explicitly states that \`0xabc\` was deployed in the dossier. [END OF REPORT]
QUESTION: Click the transfer to see who owns the wallet?`
    const p = parseStoryOutput(raw)!
    expect(p.headline).toBe('0.3 KB contract deployed')
    expect(p.story).not.toContain('**')
    expect(p.story).not.toContain('`')
    expect(p.story).not.toMatch(/dossier/i)
    expect(p.story).not.toMatch(/END OF REPORT/i)
    expect(p.curiosityQuestion).toBe('Check the transfer to see who owns the wallet?')
  })
})
