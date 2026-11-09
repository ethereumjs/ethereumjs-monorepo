import type { CapabilityReadiness, WidgetSpec } from '../spine/types.ts'
import type { InteractionPage } from '../spine/types.ts'
import type { CapabilityId } from '../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import { renderDebugPageUIComponent } from './components/DebugPageUIComponent.ts'
import { renderKeyValueUIComponent } from './components/KeyValueUIComponent.ts'
import { renderTableUIComponent } from './components/TableUIComponent.ts'
import { composeFixedRow, fixedLine } from './layout.ts'
import type { SuggestionMarks } from './widgets.ts'

export function renderInteractionWidgetBody(
  widget: WidgetSpec,
  innerWidth: number,
  maxBodyLines: number,
  page: InteractionPage,
  marks?: SuggestionMarks,
): string[] {
  const w = Math.max(20, innerWidth)
  if (page === 'debug' && widget.debugPage !== undefined && widget.debugPage.length > 0) {
    return renderDebugPageUIComponent(widget.debugPage, w, maxBodyLines)
  }

  const lines: string[] = []
  let budget = maxBodyLines

  const pushLines = (chunk: string[]) => {
    for (const line of chunk) {
      if (budget <= 0) return
      lines.push(line)
      budget -= 1
    }
  }

  switch (widget.kind) {
    case 'onboarding_carousel':
      for (const line of widget.lines) {
        if (budget <= 0) break
        const id: CapabilityId =
          line.group === 'P2P' ? 'p2p' : line.group === 'SNAP' ? 'snap' : 'head'
        const status =
          id === 'p2p'
            ? (marks?.p2p ?? 'locked')
            : id === 'snap'
              ? (marks?.snap ?? 'locked')
              : (marks?.head ?? 'locked')
        const prefix = capabilityMark(id, status)
        const half = Math.floor(w / 2)
        lines.push(
          composeFixedRow(
            w,
            [
              { text: `${prefix} ${line.command}`, width: half },
              { text: `${prefix} ${line.prose}`, width: w - half },
            ],
            2,
          ),
        )
        budget -= 1
      }
      break
    case 'table': {
      if (widget.preface !== undefined && widget.preface.length > 0) {
        pushLines(renderKeyValueUIComponent(widget.preface, w))
        if (budget > 0) {
          lines.push(fixedLine('', w))
          budget -= 1
        }
      }
      const hasSecondary = widget.secondaryTable !== undefined
      const reservedForSecondary = hasSecondary
        ? Math.min(8, Math.max(4, Math.floor(budget * 0.45)))
        : 0
      const mainLineBudget = Math.max(3, budget - reservedForSecondary)
      // Header + underline take 2 lines; if rows exceed remaining space, reserve 1 line for "+N more rows"
      const rawMainCap = Math.max(1, mainLineBudget - 2)
      const mainMaxBodyRows =
        widget.rows.length > rawMainCap ? Math.max(1, rawMainCap - 1) : rawMainCap
      const mainTable = renderTableUIComponent(
        { headers: widget.headers, rows: widget.rows, maxBodyRows: mainMaxBodyRows },
        w,
      )
      pushLines(mainTable)
      if (widget.secondaryTable !== undefined && budget >= 4) {
        lines.push(fixedLine('', w))
        budget -= 1
        if (widget.secondaryTable.title && budget > 0) {
          lines.push(fixedLine(`${BOLD}${widget.secondaryTable.title}${RESET}`, w))
          budget -= 1
        }
        const rawSecCap = Math.max(1, budget - 2)
        const secMaxBodyRows =
          widget.secondaryTable.rows.length > rawSecCap ? Math.max(1, rawSecCap - 1) : rawSecCap
        pushLines(
          renderTableUIComponent(
            {
              headers: widget.secondaryTable.headers,
              rows: widget.secondaryTable.rows,
              maxBodyRows: secMaxBodyRows,
            },
            w,
          ),
        )
      }
      break
    }
    case 'key_value':
      pushLines(renderKeyValueUIComponent(widget.entries, w))
      break
  }

  return lines
}

/** Build Interaction View title including optional Ctrl+D hint. */
export function interactionViewTitle(
  widget: WidgetSpec | null,
  page: InteractionPage,
  lastSubmitted?: string,
): string {
  if (widget === null) return `${BOLD}Welcome${RESET}`
  const hasDebug = (widget.debugPage?.length ?? 0) > 0
  const pageHint =
    hasDebug === true
      ? page === 'debug'
        ? `${DIM} · [2/2 Debug · Ctrl+D Table]${RESET}`
        : `${DIM} · [1/2 Table · Ctrl+D Debug]${RESET}`
      : ''
  let base = ''
  if (lastSubmitted?.startsWith('/') === true) {
    const cmd = lastSubmitted.split(/\s+/)[0] ?? lastSubmitted
    const sub =
      widget.kind === 'table' && widget.title
        ? ` · ${widget.title}`
        : widget.kind === 'key_value' && widget.title
          ? ` · ${widget.title}`
          : ''
    base = `${BOLD}${cmd}${sub}${RESET}`
  } else if (lastSubmitted !== undefined && lastSubmitted.length > 0) {
    const words = lastSubmitted.split(/\s+/).slice(0, 5).join(' ')
    base = `${BOLD}${words}${RESET}`
  } else if (widget.kind === 'table' && widget.title) {
    base = `${BOLD}${widget.title}${RESET}`
  } else if (widget.kind === 'key_value' && widget.title) {
    base = `${BOLD}${widget.title}${RESET}`
  } else {
    base = `${BOLD}Interaction${RESET}`
  }
  return `${base}${pageHint}`
}

export function wrapProseCentered(prose: string, innerWidth: number, innerLines: number): string[] {
  const padCols = 3
  const wrapW = Math.max(8, innerWidth - padCols * 2)
  const words = prose.split(/\s+/).filter((w) => w.length > 0)
  const wrapped: string[] = []
  let line = ''
  for (const word of words) {
    const next = line.length === 0 ? word : `${line} ${word}`
    if (visibleWidth(next) > wrapW && line.length > 0) {
      wrapped.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line.length > 0) wrapped.push(line)
  const topPad = Math.max(0, Math.floor((innerLines - wrapped.length) / 2))
  const rows: string[] = []
  for (let i = 0; i < innerLines; i++) {
    if (i < topPad || i >= topPad + wrapped.length) {
      rows.push('')
    } else {
      const text = wrapped[i - topPad] ?? ''
      rows.push(`${' '.repeat(padCols)}${text}`)
    }
  }
  return rows
}
