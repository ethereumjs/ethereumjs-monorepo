import type { EthyPhase, TuiViewState } from '../spine/types.ts'

export type KeyAction =
  | { type: 'char'; ch: string }
  | { type: 'backspace' }
  | { type: 'tab' }
  | { type: 'enter' }
  | { type: 'up' }
  | { type: 'down' }
  | { type: 'exit' }
  | { type: 'ignore' }

export function ghostForPhase(phase: EthyPhase): string {
  switch (phase) {
    case 'BOOTING':
    case 'P2P_WARMUP':
      return 'Which peers are connected and how is latency?'
    case 'SNAP_SYNCING':
      return 'Why is bucket 0x3 stalled?'
    case 'HEAD_FOLLOWING':
      return 'What changed in the latest block access list?'
  }
}

/**
 * Fold one raw stdin character into zero or one actions and an updated escape buffer.
 * Mirrors the devp2p TUI pattern: special keys first, then CSI sequences, then printable text.
 */
export function pushKeyChar(
  escapeBuffer: string,
  ch: string,
): { buffer: string; action?: KeyAction } {
  if (escapeBuffer === '') {
    if (ch === '\u0003' || ch === '\u0004') {
      return { buffer: '', action: { type: 'exit' } }
    }
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
  if (next === '\u001b[A' || next === '\u001bOA') {
    return { buffer: '', action: { type: 'up' } }
  }
  if (next === '\u001b[B' || next === '\u001bOB') {
    return { buffer: '', action: { type: 'down' } }
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
}

export function reducePromptKey(
  view: TuiViewState,
  action: KeyAction,
  ghost: string,
): PromptReduceResult {
  const next: TuiViewState = { ...view, history: [...view.history] }
  let submittedLine: string | undefined

  switch (action.type) {
    case 'char':
      next.promptDraft += action.ch
      break
    case 'backspace':
      next.promptDraft = next.promptDraft.slice(0, -1)
      break
    case 'tab':
      if (next.promptDraft.length === 0 && ghost.length > 0) {
        next.promptDraft = ghost
      }
      break
    case 'enter': {
      const line = next.promptDraft.trim()
      if (line.length > 0) {
        submittedLine = line
        next.history.push(line)
        next.historyIndex = next.history.length
        next.promptDraft = ''
      }
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
    case 'ignore':
      break
  }

  return { view: next, submittedLine }
}

export function createInitialViewState(): TuiViewState {
  return {
    activeWidget: null,
    promptDraft: '',
    ghostSuggestion: '',
    carouselTick: 0,
    history: [],
    historyIndex: 0,
    shouldExit: false,
  }
}
