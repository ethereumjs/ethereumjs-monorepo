import type {
  AiOverviewSections,
  CapabilityReadiness,
  EthySpine,
  WidgetSpec,
} from '../spine/types.ts'
import type { InteractionPage } from '../spine/types.ts'
import type { CapabilityId, TuiViewState } from '../spine/types.ts'
import { DOMAIN_ORDER } from '../spine/types.ts'
import { helpDomainLabel } from '../tools/help.ts'
import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import { renderDebugPageUIComponent } from './components/DebugPageUIComponent.ts'
import {
  type DomainHelpColumnMetrics,
  renderDomainHelpUIComponent,
} from './components/DomainHelpUIComponent.ts'
import { renderKeyValueUIComponent } from './components/KeyValueUIComponent.ts'
import { renderLiveHeadPlazaUIComponent } from './components/LiveHeadPlazaUIComponent.ts'
import { renderStartPageUIComponent } from './components/StartPageUIComponent.ts'
import { renderTableUIComponent } from './components/TableUIComponent.ts'
import { composeFixedRow, fixedLine } from './layout.ts'
import type { SuggestionMarks } from './widgets.ts'

export function renderInteractionWidgetBody(
  widget: WidgetSpec,
  innerWidth: number,
  maxBodyLines: number,
  page: InteractionPage,
  marks?: SuggestionMarks,
  spine?: EthySpine,
  tick = 0,
  colMetrics?: DomainHelpColumnMetrics,
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
          line.group === 'P2P' ? 'p2p' : line.group === 'SNAP' ? 'state' : 'economy'
        const status =
          id === 'p2p'
            ? (marks?.p2p ?? 'locked')
            : id === 'state'
              ? (marks?.state ?? 'locked')
              : (marks?.economy ?? 'locked')
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
    case 'domain_help':
      pushLines(renderDomainHelpUIComponent(widget, w, budget, spine, colMetrics))
      break
    case 'start_page':
      if (spine !== undefined) {
        pushLines(renderStartPageUIComponent(spine, w, budget, tick))
      }
      break
    case 'live_plaza':
      if (spine !== undefined) {
        pushLines(renderLiveHeadPlazaUIComponent(spine, w, budget, tick, colMetrics))
      }
      break
  }

  return lines
}

/** Build Interaction View title (debug hint lives on box bottom border). */
export function interactionViewTitle(
  widget: WidgetSpec | null,
  _page: InteractionPage,
  lastSubmitted?: string,
  nlTitle?: string,
  _view?: TuiViewState,
  spine?: EthySpine,
): string {
  if (widget === null || widget.kind === 'start_page') return `${BOLD}Welcome${RESET}`
  let base = ''
  if (widget.kind === 'live_plaza') {
    const n = spine?.economy?.latestBlockNumber
    const suffix = n !== undefined ? ` · #${Number(n).toLocaleString('en-US')}` : ''
    base = `${BOLD}/live · Ethereum Plaza${suffix}${RESET}`
  } else if (
    nlTitle !== undefined &&
    nlTitle.length > 0 &&
    lastSubmitted?.startsWith('/') !== true
  ) {
    base = `${BOLD}${nlTitle}${RESET}`
  } else if (lastSubmitted?.startsWith('/') === true) {
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
  if (widget?.kind === 'domain_help') {
    if (widget.unified === true) {
      base = `${BOLD}/help · Commands & AI${RESET}`
    } else if (spine !== undefined && widget.domain !== undefined) {
      const mark = capabilityMark(widget.domain, spine.capabilities[widget.domain].status)
      base = `${mark} ${BOLD}/help · ${helpDomainLabel(widget.domain)}${RESET}`
    }
  }
  return base
}

function wrapSectionText(text: string, wrapW: number): string[] {
  const words = text.split(/\s+/).filter((w) => w.length > 0)
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
  return wrapped
}

export function renderAiOverviewSections(
  spine: EthySpine,
  sections: AiOverviewSections | undefined,
  innerWidth: number,
  innerLines: number,
): string[] {
  const wrapW = Math.max(8, innerWidth - 7)
  const blocks: string[] = []
  const renderOne = (domain: CapabilityId, text: string) => {
    const lines = wrapSectionText(text, wrapW)
    const mark = capabilityMark(domain, spine.capabilities[domain].status)
    lines.forEach((ln, i) => {
      if (i === 0) {
        blocks.push(`${'  '}${mark}  ${ln}`)
      } else {
        blocks.push(`${'     '}${ln}`)
      }
    })
  }
  for (const id of DOMAIN_ORDER) {
    const text =
      sections?.focusNote !== undefined && sections.focusNote.domain === id
        ? sections.focusNote.text
        : sections?.[id]
    if (text !== undefined && text.length > 0) {
      if (blocks.length > 0) blocks.push('')
      renderOne(id, text)
    }
  }
  const spacerCount = blocks.filter((b) => b === '').length
  const extraGap = innerLines >= 18 && blocks.length + spacerCount <= innerLines - 2 ? 1 : 0
  const body: string[] = []
  for (let i = 0; i < blocks.length; i++) {
    body.push(blocks[i] ?? '')
    if (blocks[i] === '' && extraGap > 0) {
      body.push('')
    }
  }
  const topPad = Math.max(0, Math.floor((innerLines - body.length) / 2))
  const rows: string[] = []
  for (let i = 0; i < innerLines; i++) {
    if (i < topPad || i >= topPad + body.length) {
      rows.push('')
    } else {
      rows.push(body[i - topPad] ?? '')
    }
  }
  return rows
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
