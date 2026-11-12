import { getCommandAvailability } from '../../domains/commandAvailability.ts'
import type { CapabilityId, EthySpine, WidgetSpec } from '../../spine/types.ts'
import { BOLD, DIM, FG, RESET } from '../ansi.ts'
import { CAPABILITY_FG, capabilityMark } from '../capabilityMark.ts'
import { COCKPIT_COLUMN_GAP } from '../cockpit.ts'
import {
  type TwoColumnPair,
  fixedField,
  fixedLine,
  formatTwoColumnRow,
  maxLabelWidth,
} from '../layout.ts'
import { innerRowWidth } from '../roundedBox.ts'

export type DomainHelpColumnMetrics = {
  /** Outer width of top-left Economy box (`w0`). */
  leftBoxOuterW: number
  /** Outer width of top-middle State box (`w1`). */
  middleBoxOuterW: number
}

const DOMAIN_HEAD: Record<CapabilityId, string> = {
  economy: 'Economy',
  state: 'State',
  p2p: 'P2P',
}

function renderCommandRows(
  rows: Array<{ command: string; detail: string }>,
  spine: EthySpine | undefined,
  colWidth: number,
  labelW: number,
): string[] {
  const out: string[] = []
  for (const row of rows) {
    const avail =
      spine !== undefined
        ? getCommandAvailability(row.command, spine)
        : { status: 'ready' as const }
    const tag =
      avail.shortTag !== undefined && avail.shortTag.length > 0 ? ` (${avail.shortTag})` : ''
    let formatted: string
    if (avail.status === 'locked') {
      formatted = formatTwoColumnRow(
        `${DIM}${row.command}${RESET}`,
        `${DIM}${row.detail}${tag}${RESET}`,
        labelW,
        colWidth,
      )
    } else if (avail.status === 'partial') {
      formatted = formatTwoColumnRow(
        `${BOLD}${FG.cyan}${row.command}${RESET}`,
        `${DIM}${row.detail}${tag}${RESET}`,
        labelW,
        colWidth,
      )
    } else {
      formatted = formatTwoColumnRow(
        `${BOLD}${FG.cyan}${row.command}${RESET}`,
        `${DIM}${row.detail}${RESET}`,
        labelW,
        colWidth,
      )
    }
    out.push(fixedField(formatted, colWidth))
  }
  return out
}

function buildUnifiedColumnLines(
  widget: Extract<WidgetSpec, { kind: 'domain_help' }>,
  spine: EthySpine | undefined,
  colWidth: number,
  side: 'left' | 'right',
): string[] {
  const sections = widget.sections.filter((s) => s.column === side)
  const allPairs: TwoColumnPair[] = []
  for (const section of sections) {
    for (const row of section.rows ?? []) {
      allPairs.push({ label: row.command, value: row.detail })
    }
  }
  const labelW = Math.min(Math.max(12, maxLabelWidth(allPairs)), Math.floor(colWidth * 0.48))
  const out: string[] = []
  sections.forEach((section, idx) => {
    if (idx > 0) out.push('')
    const domain = section.domain ?? widget.domain ?? 'economy'
    const status = spine?.capabilities[domain].status ?? 'partial'
    const mark = capabilityMark(domain, status)
    out.push(fixedField(`${mark} ${BOLD}${DOMAIN_HEAD[domain]}${RESET}`, colWidth))
    out.push('')
    out.push(...renderCommandRows(section.rows ?? [], spine, colWidth, labelW))
  })
  if (side === 'right') {
    const prompts = widget.aiExamples ?? []
    if (prompts.length > 0) {
      if (out.length > 0) out.push('')
      const aiStatus = spine?.capabilities.ai.status ?? 'partial'
      const aiMark = capabilityMark('ai', aiStatus)
      out.push(fixedField(`${aiMark} ${BOLD}AI Examples${RESET}`, colWidth))
      out.push('')
      for (const prompt of prompts) {
        const bullet = `${CAPABILITY_FG.ai}›${RESET}`
        const line = `${bullet} ${DIM}"${prompt}"${RESET}`
        out.push(fixedField(line, colWidth))
      }
    }
  }
  return out
}

function buildScopedLeftColumnLines(
  widget: Extract<WidgetSpec, { kind: 'domain_help' }>,
  spine: EthySpine | undefined,
  colWidth: number,
): string[] {
  const domain = widget.domain ?? 'economy'
  const status = spine?.capabilities[domain].status ?? 'partial'
  const domainMark = capabilityMark(domain, status)

  const allPairs: TwoColumnPair[] = []
  for (const section of widget.sections) {
    for (const row of section.rows ?? []) {
      allPairs.push({ label: row.command, value: row.detail })
    }
  }
  const labelW = Math.min(Math.max(12, maxLabelWidth(allPairs)), Math.floor(colWidth * 0.48))

  const out: string[] = []
  widget.sections.forEach((section, idx) => {
    if (section.rows === undefined || section.rows.length === 0) return
    if (idx > 0) out.push('')
    const header =
      idx === 0
        ? `${domainMark} ${BOLD}${section.title}${RESET}`
        : `  ${BOLD}${section.title}${RESET}`
    out.push(fixedField(header, colWidth))
    out.push('')
    out.push(...renderCommandRows(section.rows, spine, colWidth, labelW))
  })
  return out
}

function buildScopedRightColumnLines(
  widget: Extract<WidgetSpec, { kind: 'domain_help' }>,
  spine: EthySpine | undefined,
  colWidth: number,
): string[] {
  const aiStatus = spine?.capabilities.ai.status ?? 'partial'
  const aiMark = capabilityMark('ai', aiStatus)
  const prompts = widget.aiExamples ?? widget.sections.flatMap((s) => s.prompts ?? [])

  const out: string[] = []
  out.push(fixedField(`${aiMark} ${BOLD}AI Examples${RESET}`, colWidth))
  out.push('')
  for (const prompt of prompts) {
    const bullet = `${CAPABILITY_FG.ai}›${RESET}`
    const line = `${bullet} ${DIM}"${prompt}"${RESET}`
    out.push(fixedField(line, colWidth))
  }
  return out
}

export function renderDomainHelpUIComponent(
  widget: Extract<WidgetSpec, { kind: 'domain_help' }>,
  innerWidth: number,
  maxBodyLines: number,
  spine?: EthySpine,
  colMetrics?: DomainHelpColumnMetrics,
): string[] {
  const w = Math.max(20, innerWidth)
  if (maxBodyLines <= 0) return []

  const gutter = COCKPIT_COLUMN_GAP + 4
  let leftColW: number
  let rightColW: number
  if (colMetrics !== undefined && colMetrics.leftBoxOuterW > 8 && colMetrics.middleBoxOuterW > 8) {
    leftColW = innerRowWidth(colMetrics.leftBoxOuterW)
    rightColW = Math.max(12, w - leftColW - gutter)
  } else {
    leftColW = Math.max(16, Math.floor((w - gutter) / 2))
    rightColW = Math.max(12, w - leftColW - gutter)
  }

  const unified = widget.unified === true || widget.sections.some((s) => s.column !== undefined)
  const leftLines = unified
    ? buildUnifiedColumnLines(widget, spine, leftColW, 'left')
    : buildScopedLeftColumnLines(widget, spine, leftColW)
  const rightLines = unified
    ? buildUnifiedColumnLines(widget, spine, rightColW, 'right')
    : buildScopedRightColumnLines(widget, spine, rightColW)
  const rowCount = Math.min(maxBodyLines, Math.max(leftLines.length, rightLines.length))
  const gapStr = ' '.repeat(gutter)

  const out: string[] = []
  for (let i = 0; i < rowCount; i++) {
    const l = fixedField(leftLines[i] ?? '', leftColW)
    const r = fixedField(rightLines[i] ?? '', rightColW)
    out.push(fixedLine(`${l}${gapStr}${r}`, w))
  }
  return out
}
