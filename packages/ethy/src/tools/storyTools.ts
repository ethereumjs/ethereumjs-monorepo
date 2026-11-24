import type { InvestigationJournal } from '../ai/investigationJournal.ts'
import { type StoryLens, parseBeatOverride, parseLensOverride } from '../ai/storyDirector.ts'
import type { ChainDispatchCard, WidgetSpec } from '../spine/types.ts'
import type { DebugSectionSpec } from '../spine/types.ts'

export function storyWritingPlaceholderWidget(): WidgetSpec {
  return {
    kind: 'key_value',
    title: 'Story',
    entries: [{ key: 'Status', value: 'Writing a fresh story…' }],
  }
}

export function storyWidgetFromCard(
  story: ChainDispatchCard,
  debugPage?: DebugSectionSpec[],
): WidgetSpec {
  return { kind: 'story', story, debugPage }
}

export function storyListWidget(journal: InvestigationJournal): WidgetSpec {
  const rows = journal.snapshot(6).map((card, i) => {
    const src =
      card.fallbackReason !== undefined ? 'FB' : card.modelLabel !== undefined ? 'LLM' : '—'
    return [
      String(i + 1),
      src,
      card.beatKind ?? card.lens ?? card.category,
      card.headline.slice(0, 36),
      `${Math.round((Date.now() - card.atMs) / 1000)}s`,
    ]
  })
  if (rows.length === 0) {
    return {
      kind: 'key_value',
      title: '/story list',
      entries: [{ key: 'Stories', value: 'None yet — wait for the field historian.' }],
    }
  }
  return {
    kind: 'table',
    title: 'Session stories',
    headers: ['#', 'Src', 'Beat', 'Headline', 'Age'],
    rows,
  }
}

export type StorySlashTrigger =
  | { action: 'new'; lens?: StoryLens; beat?: import('../ai/storyBeats.ts').StoryBeatKind }
  | { action: 'open'; index?: number }
  | { action: 'list' }
  | { action: 'full' }

export function parseStorySlashTrigger(line: string): StorySlashTrigger | undefined {
  const parts = line.trim().split(/\s+/)
  const cmd = parts[0]?.toLowerCase()
  if (cmd !== '/story' && cmd !== '/st') return undefined
  const sub = (parts[1] ?? '').toLowerCase()
  if (sub === 'list') return { action: 'list' }
  if (sub === 'new' || sub === 'next') return { action: 'new' }
  if (sub === 'full') return { action: 'full' }
  const lens = parseLensOverride(sub)
  if (lens !== undefined) return { action: 'new', lens }
  const beat = parseBeatOverride(sub)
  if (beat !== undefined) return { action: 'new', beat }
  const idx = Number(sub)
  if (sub.length > 0 && Number.isFinite(idx) && idx >= 1 && idx <= 6) {
    return { action: 'open', index: Math.floor(idx) }
  }
  if (parts.length === 1) return { action: 'full' }
  return undefined
}

export function dispatchStorySlash(line: string, journal: InvestigationJournal): WidgetSpec {
  const trigger = parseStorySlashTrigger(line)
  if (trigger === undefined) {
    return {
      kind: 'key_value',
      title: '/story',
      entries: [{ key: 'Usage', value: '/story · /story new · /story list · /story 1..6' }],
    }
  }
  if (trigger.action === 'list') return storyListWidget(journal)
  if (trigger.action === 'new') return storyWritingPlaceholderWidget()
  if (trigger.action === 'open') {
    const idx = (trigger.index ?? 1) - 1
    const card = journal.snapshot(6)[idx]
    if (card === undefined) {
      return {
        kind: 'key_value',
        title: '/story',
        entries: [{ key: 'Error', value: `No story #${trigger.index ?? 1} in journal` }],
      }
    }
    return storyWidgetFromCard(card)
  }
  const latest = journal.latest()
  if (latest === undefined) {
    return {
      kind: 'key_value',
      title: '/story',
      entries: [
        { key: 'Stories', value: 'None yet — autonomous stories appear in the AI column.' },
      ],
    }
  }
  return storyWidgetFromCard(latest)
}
