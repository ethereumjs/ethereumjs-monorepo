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
import { buildDomainHelpWidget, buildHelpWidget } from '../tools/help.ts'

export function openPlazaView(
  view: TuiViewState,
  spine: EthySpine,
  slashCtx: SlashDispatchCtx,
): TuiViewState {
  const canPlaza =
    spine.phase === 'HEAD_FOLLOWING' ||
    (spine.demoClock === true && spine.economy?.hasBlocks === true)
  if (!canPlaza) {
    return {
      ...view,
      activeWidget: { kind: 'start_page' },
      showingHelp: false,
      interactionPage: 'main',
      interactionLabel: undefined,
      interactionTitle: undefined,
    }
  }
  const widget = dispatchSlashWidget('/live', slashCtx)
  const entry: InteractionHistoryEntry = {
    kind: 'slash',
    command: '/live',
    label: '/live',
    page: 'main',
  }
  const next = pushViewHistory(view, entry)
  return {
    ...next,
    activeWidget: widget,
    showingHelp: false,
    interactionPage: 'main',
    interactionLabel: '/live',
    interactionTitle: undefined,
  }
}

export function activateLivePlazaFlip(view: TuiViewState, widget: WidgetSpec): TuiViewState {
  const entry: InteractionHistoryEntry = {
    kind: 'slash',
    command: '/live',
    label: '/live',
    page: 'main',
  }
  const next = pushViewHistory(view, entry)
  return {
    ...next,
    activeWidget: widget,
    showingHelp: false,
    interactionLabel: '/live',
    interactionTitle: undefined,
    interactionPage: 'main',
  }
}

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
> & { overviewNote?: string } {
  if (entry.kind === 'slash') {
    if (entry.frozenWidget !== undefined) {
      return {
        activeWidget: entry.frozenWidget,
        interactionPage: entry.page,
        interactionLabel: entry.command,
        interactionTitle: undefined,
        showingHelp: false,
      }
    }
    const widget = dispatchSlashWidget(entry.command, slashCtx)
    const overviewNote =
      widget.kind !== 'domain_help' && 'assistantComment' in widget
        ? widget.assistantComment
        : undefined
    return {
      activeWidget: widget,
      interactionPage: entry.page,
      interactionLabel: entry.command,
      interactionTitle: undefined,
      showingHelp: widget.kind === 'domain_help',
      overviewNote,
    }
  }
  return {
    activeWidget: entry.widget,
    interactionPage: entry.page,
    interactionLabel: entry.prompt,
    interactionTitle: entry.viewTitle,
    showingHelp: entry.widget.kind === 'domain_help',
    overviewNote: entry.overviewNote,
  }
}

export function openDomainHelp(
  view: TuiViewState,
  spine: EthySpine,
  domain?: TuiViewState['activeDomain'],
): TuiViewState {
  const widget =
    domain !== undefined ? buildDomainHelpWidget(spine, domain) : buildHelpWidget(spine)
  const command = domain !== undefined ? `/help ${domain}` : '/help'
  const label = domain !== undefined ? `/help · ${domain}` : '/help'
  const entry: InteractionHistoryEntry = {
    kind: 'slash',
    command,
    label,
    page: 'main',
  }
  const next = pushViewHistory(view, entry)
  return {
    ...next,
    ...(domain !== undefined ? { activeDomain: domain } : {}),
    activeWidget: widget,
    showingHelp: true,
    interactionPage: 'main' as InteractionPage,
    interactionLabel: label,
    interactionTitle: undefined,
    aiOverviewSections: clearOverviewFocus(view.aiOverviewSections),
  }
}

export function clearOverviewFocus(
  sections: AiOverviewSections | undefined,
): AiOverviewSections | undefined {
  if (sections === undefined || sections.focusNote === undefined) return sections
  const { focusNote: _dropped, ...rest } = sections
  return rest
}

export function inferDomainForCommandOrPrompt(
  text: string,
  fallback: TuiViewState['activeDomain'],
): TuiViewState['activeDomain'] {
  const lower = text.trim().toLowerCase()
  const cmd = lower.split(/\s+/)[0] ?? ''
  if (
    cmd === '/live' ||
    cmd === '/plaza' ||
    cmd === '/head' ||
    cmd === '/economy' ||
    cmd === '/e' ||
    cmd === '/contract' ||
    cmd === '/co'
  ) {
    return 'economy'
  }
  if (
    cmd === '/peers' ||
    cmd === '/p' ||
    cmd === '/ethy' ||
    cmd === '/rpc' ||
    cmd === '/send' ||
    cmd === '/diag' ||
    cmd === '/d' ||
    cmd === '/drop'
  ) {
    return 'p2p'
  }
  if (
    cmd === '/buckets' ||
    cmd === '/b' ||
    cmd === '/snap' ||
    cmd === '/range' ||
    cmd === '/ra' ||
    cmd === '/sample' ||
    cmd === '/sa' ||
    cmd === '/account' ||
    cmd === '/a' ||
    cmd === '/bal' ||
    cmd === '/cl' ||
    cmd === '/pause' ||
    cmd === '/resume' ||
    cmd === '/reassign' ||
    cmd === '/r' ||
    cmd === '/simulate' ||
    cmd === '/s'
  ) {
    return 'state'
  }
  if (/contract|economy|base\s*fee|basefee|gwei|tps|volume|swap|erc-20|dex/i.test(lower)) {
    return 'economy'
  }
  if (/peer|client|latency|ethy|handshake|enode|dpt|rlpx/i.test(lower)) {
    return 'p2p'
  }
  if (/bucket|stall|snap|account|storage|bal|slot|head|pivot/i.test(lower)) {
    return 'state'
  }
  return fallback
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
  if (view.viewHistory.length === 0) return view
  const entry = view.viewHistory[view.viewHistoryIndex]
  if (entry === undefined || entry.kind !== 'slash') return view
  if (entry.frozenWidget !== undefined) return view
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
