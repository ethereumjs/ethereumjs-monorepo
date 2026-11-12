import { completeSlashDraft } from '../ai/slashComplete.ts'
import type { CapabilityId, EthySpine, TuiViewState } from '../spine/types.ts'
import { DOMAIN_ORDER } from '../spine/types.ts'
export type KeyAction =
  | { type: 'char'; ch: string }
  | { type: 'backspace' }
  | { type: 'tab' }
  | { type: 'shiftTab' }
  | { type: 'left' }
  | { type: 'right' }
  | { type: 'enter' }
  | { type: 'up' }
  | { type: 'down' }
  | { type: 'exit' }
  | { type: 'toggleDebug' }
  | { type: 'ignore' }

export function cycleDomain(id: CapabilityId, direction: 1 | -1): CapabilityId {
  const idx = DOMAIN_ORDER.indexOf(id)
  const next = (idx + direction + DOMAIN_ORDER.length) % DOMAIN_ORDER.length
  return DOMAIN_ORDER[next] ?? 'economy'
}

/**
 * Fold one raw stdin character into zero or one actions and an updated escape buffer.
 * Mirrors the devp2p TUI pattern: special keys first, then CSI sequences, then printable text.
 */
export function pushKeyChar(
  escapeBuffer: string,
  ch: string,
): { buffer: string; action?: KeyAction } {
  if (ch === '\u0003') {
    return { buffer: '', action: { type: 'exit' } }
  }
  if (ch === '\u0004') {
    return { buffer: '', action: { type: 'toggleDebug' } }
  }
  if (escapeBuffer === '') {
    if (ch === '\u007f' || ch === '\b') {
      return { buffer: '', action: { type: 'backspace' } }
    }
    if (ch === '\t') {
      return { buffer: '', action: { type: 'tab' } }
    }
    if (ch === '\r' || ch === '\n') {
      return { buffer: '', action: ch === '\r' ? { type: 'enter' } : undefined }
    }
    if (ch === '\u001b') {
      return { buffer: '\u001b' }
    }
    if (ch < ' ') {
      return { buffer: '', action: { type: 'ignore' } }
    }
    return { buffer: '', action: { type: 'char', ch } }
  }

  const next = escapeBuffer + ch
  if (next === '\u001b[' || next === '\u001bO') {
    return { buffer: next }
  }
  if (next === '\u001b[Z') {
    return { buffer: '', action: { type: 'shiftTab' } }
  }
  if (next === '\u001b[A' || next === '\u001bOA') {
    return { buffer: '', action: { type: 'up' } }
  }
  if (next === '\u001b[B' || next === '\u001bOB') {
    return { buffer: '', action: { type: 'down' } }
  }
  if (next === '\u001b[C' || next === '\u001bOC') {
    return { buffer: '', action: { type: 'right' } }
  }
  if (next === '\u001b[D' || next === '\u001bOD') {
    return { buffer: '', action: { type: 'left' } }
  }
  if (next === '\u001b[3~') {
    return { buffer: '', action: { type: 'backspace' } }
  }
  if (next.startsWith('\u001b[') && next.length < 12 && !/[A-Za-z~]$/.test(next)) {
    return { buffer: next }
  }
  if (escapeBuffer === '\u001b' && ch !== '[' && ch !== 'O') {
    return { buffer: '', action: { type: 'exit' } }
  }
  return { buffer: '', action: { type: 'ignore' } }
}

/** Fold raw stdin chunks into key actions (pure, testable). */
export function decodeKey(buffer: string, chunk: string): { buffer: string; actions: KeyAction[] } {
  const actions: KeyAction[] = []
  let buf = buffer
  for (const ch of chunk) {
    const step = pushKeyChar(buf, ch)
    buf = step.buffer
    if (step.action !== undefined) {
      actions.push(step.action)
    }
  }
  return { buffer: buf, actions }
}

export interface PromptReduceResult {
  view: TuiViewState
  submittedLine?: string
  helpToggle?: true
  viewHistoryNav?: 'left' | 'right'
  toggleDebug?: true
  /** Empty Enter: return to plaza or Welcome. */
  openPlaza?: true
}

export function reducePromptKey(view: TuiViewState, action: KeyAction): PromptReduceResult {
  const next: TuiViewState = { ...view, history: [...view.history] }
  let submittedLine: string | undefined
  let helpToggle: true | undefined
  let viewHistoryNav: 'left' | 'right' | undefined
  let toggleDebug: true | undefined
  switch (action.type) {
    case 'char':
      next.promptDraft += action.ch
      break
    case 'backspace':
      next.promptDraft = next.promptDraft.slice(0, -1)
      break
    case 'tab':
      if (next.promptDraft.length === 0) {
        helpToggle = true
      } else if (next.promptDraft.startsWith('/')) {
        const completed = completeSlashDraft(next.promptDraft)
        if (completed !== null) next.promptDraft = completed
      }
      break
    case 'shiftTab':
      if (next.promptDraft.length === 0) {
        helpToggle = true
      }
      break
    case 'left':
      if (next.promptDraft.length === 0) {
        viewHistoryNav = 'left'
      }
      break
    case 'right':
      if (next.promptDraft.startsWith('/')) {
        const completed = completeSlashDraft(next.promptDraft)
        if (completed !== null) next.promptDraft = completed
      } else if (next.promptDraft.length === 0) {
        viewHistoryNav = 'right'
      }
      break
    case 'enter': {
      if (next.promptDraft.trim().length === 0) {
        return { view: next, openPlaza: true }
      }
      const line = next.promptDraft.trim()
      submittedLine = line
      next.history.push(line)
      next.historyIndex = next.history.length
      next.promptDraft = ''
      break
    }
    case 'up':
      if (next.history.length > 0) {
        next.historyIndex = Math.max(0, next.historyIndex - 1)
        next.promptDraft = next.history[next.historyIndex] ?? ''
      }
      break
    case 'down':
      if (next.history.length > 0) {
        next.historyIndex = Math.min(next.history.length, next.historyIndex + 1)
        next.promptDraft =
          next.historyIndex >= next.history.length ? '' : (next.history[next.historyIndex] ?? '')
      }
      break
    case 'exit':
      next.shouldExit = true
      break
    case 'toggleDebug':
      toggleDebug = true
      break
    case 'ignore':
      break
  }

  return { view: next, submittedLine, helpToggle, viewHistoryNav, toggleDebug }
}

export function createInitialViewState(spine?: EthySpine): TuiViewState {
  void spine
  return {
    activeDomain: 'economy',
    activeWidget: { kind: 'start_page' },
    interactionPage: 'main',
    showingHelp: false,
    viewHistory: [{ kind: 'slash', command: '/welcome', label: 'Welcome', page: 'main' }],
    viewHistoryIndex: 0,
    promptDraft: '',
    carouselTick: 0,
    history: [],
    historyIndex: 0,
    shouldExit: false,
  }
}
