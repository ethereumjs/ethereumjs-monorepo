import { type SlashDispatchCtx, dispatchSlashWidget } from '../ai/deterministicEngine.ts'
import type {
  AiOverviewSections,
  EthySpine,
  InteractionHistoryEntry,
  InteractionPage,
  TuiViewState,
  WidgetSpec,
} from '../spine/types.ts'
import { MAX_VIEW_HISTORY } from '../spine/types.ts'
import { buildDomainHelpWidget } from '../tools/help.ts'

export function pushViewHistory(view: TuiViewState, entry: InteractionHistoryEntry): TuiViewState {
  let history = [...view.viewHistory]
  let index = view.viewHistoryIndex
  if (index < history.length - 1) {
    history = history.slice(0, index + 1)
  }
  const tail = history[history.length - 1]
  if (entry.kind === 'slash' && tail?.kind === 'slash' && tail.command === entry.command) {
    history[history.length - 1] = entry
  } else {
    history.push(entry)
    if (history.length > MAX_VIEW_HISTORY) {
      history = history.slice(history.length - MAX_VIEW_HISTORY)
    }
    index = history.length - 1
  }
  return { ...view, viewHistory: history, viewHistoryIndex: index }
}

export function activateHistoryEntry(
  entry: InteractionHistoryEntry,
  spine: EthySpine,
  slashCtx: SlashDispatchCtx,
): Pick<
  TuiViewState,
  'activeWidget' | 'interactionPage' | 'interactionLabel' | 'interactionTitle' | 'showingHelp'
> {
  if (entry.kind === 'slash') {
    const widget = dispatchSlashWidget(entry.command, slashCtx)
    return {
      activeWidget: widget,
      interactionPage: entry.page,
      interactionLabel: entry.command,
      interactionTitle: undefined,
      showingHelp: false,
    }
  }
  return {
    activeWidget: entry.widget,
    interactionPage: entry.page,
    interactionLabel: entry.prompt,
    interactionTitle: entry.viewTitle,
    showingHelp: false,
  }
}

export function openDomainHelp(
  view: TuiViewState,
  spine: EthySpine,
  domain: typeof view.activeDomain,
) {
  return {
    ...view,
    activeDomain: domain,
    activeWidget: buildDomainHelpWidget(spine, domain),
    showingHelp: true,
    interactionPage: 'main' as InteractionPage,
    interactionLabel: `/help · ${domain}`,
    interactionTitle: undefined,
  }
}

export function historyEntryTitle(entry: InteractionHistoryEntry): string {
  if (entry.kind === 'ai') return entry.viewTitle
  return entry.label.split(/\s+/)[0] ?? entry.label
}

export function applyLiveSlashRefresh(
  view: TuiViewState,
  spine: EthySpine,
  slashCtx: SlashDispatchCtx,
): TuiViewState {
  if (view.showingHelp || view.viewHistory.length === 0) return view
  const entry = view.viewHistory[view.viewHistoryIndex]
  if (entry === undefined || entry.kind !== 'slash') return view
  const widget = dispatchSlashWidget(entry.command, slashCtx)
  return { ...view, activeWidget: widget }
}

export function mergeOverviewFocus(
  sections: AiOverviewSections | undefined,
  note: string | undefined,
  domain: TuiViewState['activeDomain'],
): AiOverviewSections | undefined {
  if (note === undefined) return sections
  return {
    ...sections,
    focusNote: { domain, text: note },
  }
}

export function snapshotFlipWidget(
  view: TuiViewState,
  widget: WidgetSpec,
  title: string,
): TuiViewState {
  const entry: InteractionHistoryEntry = {
    kind: 'ai',
    prompt: title,
    viewTitle: title,
    widget,
    page: 'main',
  }
  const next = pushViewHistory(view, entry)
  return {
    ...next,
    activeWidget: widget,
    showingHelp: false,
    interactionLabel: title,
    interactionTitle: title,
    interactionPage: 'main',
  }
}
