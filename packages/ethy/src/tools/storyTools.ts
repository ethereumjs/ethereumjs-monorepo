import type { InvestigationJournal } from '../ai/investigationJournal.ts'
import { type StoryLens, parseLensOverride } from '../ai/storyDirector.ts'
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
  const rows = journal
    .snapshot(6)
    .map((card, i) => [
      String(i + 1),
      card.lens ?? card.category,
      card.headline.slice(0, 40),
      `${Math.round((Date.now() - card.atMs) / 1000)}s`,
    ])
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
    headers: ['#', 'Lens', 'Headline', 'Age'],
    rows,
  }
}

export type StorySlashTrigger =
  | { action: 'new'; lens?: StoryLens }
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
  const idx = Number(sub)
  if (sub.length > 0 && Number.isFinite(idx) && idx >= 1 && idx <= 8) {
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
