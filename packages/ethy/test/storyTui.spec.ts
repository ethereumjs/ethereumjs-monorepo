import { describe, expect, it } from 'vitest'

import { createSpine } from '../src/spine/createSpine.ts'
import type { AiOverviewSections, ChainDispatchCard } from '../src/spine/types.ts'
import { BG, FG, visibleWidth } from '../src/tui/ansi.ts'
import { renderStoryUIComponent } from '../src/tui/components/StoryUIComponent.ts'
import { renderAiOverviewSections } from '../src/tui/interactionContent.ts'

const sampleCard: ChainDispatchCard = {
  category: 'l2',
  severity: 'notable',
  headline: 'Blob lane warms up',
  body: 'Rollup batches bought blob gas.\n\nFees ticked higher.',
  atMs: Date.now() - 12_000,
  deterministic: false,
  lens: 'economics',
  network: 'mainnet',
  blockNumber: '21402811',
  angle: 'EIP-4844 split blob and execution fees.',
  angleKind: 'history',
  curiosityQuestion: 'Will batchers pause if fees spike?',
}

describe('story TUI rendering', () => {
  it('top-aligns headline banner on row 0 to match sibling boxes and omits Ask line', () => {
    const spine = createSpine('mainnet', 1n)
    spine.economy = { hasBlocks: true, topContracts: [], recentBlocks: [] }
    const sections: AiOverviewSections = { dispatches: [sampleCard], storyIndex: 1, storyCount: 6 }
    const lines = renderAiOverviewSections(spine, sections, 60, 20)
    expect(lines[0]).toContain('Blob lane warms up')
    expect(lines[0]).toContain(BG.cyan)
    expect(lines.join('\n')).not.toContain('› Ask:')
  })

  it('never prints Ask, /story full, or overflow nag on short terminals', () => {
    const spine = createSpine('mainnet', 1n)
    spine.economy = { hasBlocks: true, topContracts: [], recentBlocks: [] }
    const longBody = Array.from(
      { length: 12 },
      (_, i) => `Paragraph ${i} with extra detail about blobs.`,
    ).join('\n\n')
    const sections: AiOverviewSections = {
      dispatches: [{ ...sampleCard, body: longBody }],
    }
    const lines = renderAiOverviewSections(spine, sections, 50, 8)
    const joined = lines.join('\n')
    expect(joined).not.toContain('/story full')
    expect(joined).not.toContain('/story to read full story')
    expect(joined).not.toContain('› Ask:')
  })

  it('StoryUIComponent lines respect innerWidth and omit Ask line cleanly', () => {
    const innerWidth = 60
    const richCard: ChainDispatchCard = {
      ...sampleCard,
      evidence: [
        { label: 'baseFee', value: '1.2 gwei' },
        { label: 'blobs', value: '6' },
      ],
      curiosityQuestion:
        'Will rollup batchers throttle blob submissions if blob base fee doubles over the next ten minutes?',
    }
    const lines = renderStoryUIComponent(richCard, innerWidth, 24)
    for (const ln of lines) {
      expect(visibleWidth(ln)).toBeLessThanOrEqual(innerWidth)
    }
    const joined = lines.join('\n')
    expect(joined).toContain('Observed:')
    expect(joined).toContain('Echo')
    expect(joined).not.toContain('› Ask:')
  })

  it('renders /story new without /story full when story fits cleanly in the AI box', () => {
    const spine = createSpine('mainnet', 1n)
    spine.economy = { hasBlocks: true, topContracts: [], recentBlocks: [] }
    const sections: AiOverviewSections = { dispatches: [sampleCard], storyIndex: 1, storyCount: 2 }
    const lines = renderAiOverviewSections(spine, sections, 60, 20)
    const joined = lines.join('\n')
    expect(joined).toContain('/story new')
    expect(joined).not.toContain('/story full')
    expect(joined).not.toContain('/story to read full story')
  })

  it('renders right-aligned block + model footer without redundant eyebrow or /story full', () => {
    const snapCard: ChainDispatchCard = {
      category: 'lore',
      severity: 'calm',
      headline: 'Validator says hi from home staking',
      body: 'Someone stamped block #21402811 with a cheerful note to their mom.',
      atMs: Date.now() - 4_000,
      deterministic: false,
      lens: 'lore',
      network: 'mainnet',
      blockNumber: '21402811',
      modelLabel: 'qwen3.5-2b',
      format: 'snap',
    }
    const spine = createSpine('mainnet', 1n)
    spine.economy = { hasBlocks: true, topContracts: [], recentBlocks: [] }
    const overviewLines = renderAiOverviewSections(
      spine,
      { dispatches: [snapCard], storyIndex: 1, storyCount: 1 },
      60,
      16,
    )
    expect(overviewLines[0]).toContain('Validator says hi from home staking')
    expect(overviewLines[0]).toContain(BG.cyan)
    expect(overviewLines[0]).toContain(FG.black)
    expect(visibleWidth(overviewLines[0]!)).toBeLessThanOrEqual(60)
    const footer = overviewLines[overviewLines.length - 1] ?? ''
    expect(footer).toContain('#21402811 · qwen3.5')
    expect(footer).toContain('/story new')
    const joined = overviewLines.join('\n')
    expect(joined).not.toContain('[STORY')
    expect(joined).not.toContain('[SNAP')
    expect(joined).not.toContain('│ Lens')

    const componentLines = renderStoryUIComponent(snapCard, 60, 16)
    expect(componentLines[0]).toContain('Validator says hi from home staking')
    expect(componentLines[0]).toContain(BG.cyan)
    expect(componentLines[0]).toContain(FG.black)
    expect(componentLines[componentLines.length - 1]).toContain('#21402811 · qwen3.5')
    expect(componentLines.join('\n')).not.toContain('[SNAP')
    expect(componentLines.join('\n')).not.toContain('│ Lens')
  })
})
