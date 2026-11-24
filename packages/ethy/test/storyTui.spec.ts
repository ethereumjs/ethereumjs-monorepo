import { describe, expect, it } from 'vitest'

import { createSpine } from '../src/spine/createSpine.ts'
import type { AiOverviewSections, ChainDispatchCard } from '../src/spine/types.ts'
import { visibleWidth } from '../src/tui/ansi.ts'
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
  it('top-aligns editorial AI column with blank pad row first', () => {
    const spine = createSpine('mainnet', 1n)
    spine.economy = { hasBlocks: true, topContracts: [], recentBlocks: [] }
    const sections: AiOverviewSections = { dispatches: [sampleCard], storyIndex: 1, storyCount: 6 }
    const lines = renderAiOverviewSections(spine, sections, 60, 20)
    expect(lines[0]).toBe('')
    expect(lines[1]?.trim().length).toBeGreaterThan(0)
  })

  it('ends with /story hint when content overflows short terminals', () => {
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
    expect(lines[lines.length - 1]).toMatch(/\/story/)
  })

  it('StoryUIComponent lines respect innerWidth and wrap long Ask questions without clipping sections', () => {
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
    expect(joined).toContain('ten minutes?')
  })

  it('does not replace the last fitting line with overflow hint when story fits cleanly', () => {
    const spine = createSpine('mainnet', 1n)
    spine.economy = { hasBlocks: true, topContracts: [], recentBlocks: [] }
    const sections: AiOverviewSections = { dispatches: [sampleCard], storyIndex: 1, storyCount: 2 }
    const lines = renderAiOverviewSections(spine, sections, 60, 20)
    expect(lines.join('\n')).toContain('/story full')
    expect(lines.join('\n')).not.toContain('/story to read full story')
  })

  it('renders SNAP eyebrow and omits Lens box for snap-format cards', () => {
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
    ).join('\n')
    expect(overviewLines).toContain('[SNAP · qwen3.5]')
    expect(overviewLines).not.toContain('│ Lens')

    const componentLines = renderStoryUIComponent(snapCard, 60, 16).join('\n')
    expect(componentLines).toContain('[SNAP · qwen3.5]')
    expect(componentLines).not.toContain('│ Lens')
  })
})
