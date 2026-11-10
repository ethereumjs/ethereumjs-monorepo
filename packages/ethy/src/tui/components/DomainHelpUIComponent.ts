import type { EthySpine, WidgetSpec } from '../../spine/types.ts'
import { BOLD, DIM, RESET } from '../ansi.ts'
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

function buildLeftColumnLines(
  widget: Extract<WidgetSpec, { kind: 'domain_help' }>,
  spine: EthySpine | undefined,
  colWidth: number,
): string[] {
  const status = spine?.capabilities[widget.domain].status ?? 'partial'
  const domainMark = capabilityMark(widget.domain, status)

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
    for (const row of section.rows) {
      const formatted = formatTwoColumnRow(
        `${BOLD}${row.command}${RESET}`,
        `${DIM}${row.detail}${RESET}`,
        labelW,
        colWidth,
      )
      out.push(fixedField(formatted, colWidth))
    }
  })
  return out
}

function buildRightColumnLines(
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

  // Align left column with upper Economy text and right column with upper State text:
  // innerRowWidth(w0) + (COCKPIT_COLUMN_GAP + 4) + innerRowWidth(w1) === innerWidth
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

  const leftLines = buildLeftColumnLines(widget, spine, leftColW)
  const rightLines = buildRightColumnLines(widget, spine, rightColW)
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
