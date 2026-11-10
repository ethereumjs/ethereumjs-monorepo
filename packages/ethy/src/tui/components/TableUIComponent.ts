import { BOLD, DIM, RESET, padVisible, truncateVisible, visibleWidth } from '../ansi.ts'
import { fixedField, fixedLine } from '../layout.ts'
import { layoutTableColumns } from '../widgets.ts'

const RIGHT_ALIGN_HEADERS = new Set([
  'Avg ms',
  'Accounts',
  'Blocks',
  'S-Writes',
  'S-Reads',
  'Writes',
  'Reads',
  'Count',
  'Peers',
  'Snap OK',
  'Net ETH',
  'ETH',
  'Base',
  'Nonce',
  'Txs',
  'Full',
  'Balance (ETH)',
])

function alignCell(text: string, width: number, right: boolean): string {
  const trimmed = truncateVisible(text, width)
  const vis = visibleWidth(trimmed)
  if (!right) return fixedField(trimmed, width)
  const pad = Math.max(0, width - vis)
  return `${' '.repeat(pad)}${trimmed}`
}

export type TableUIComponentInput = {
  headers: string[]
  rows: string[][]
  maxBodyRows: number
  emptyMessage?: string
}

/** Typographic table without inner box borders (Interaction View inner body). */
export function renderTableUIComponent(input: TableUIComponentInput, innerWidth: number): string[] {
  const w = Math.max(20, innerWidth)
  const headers = input.headers
  if (headers.length === 0) return []
  const colWidths = layoutTableColumns(headers, w, 0)
  const gap = '  '
  const headerCells = headers.map((h, i) => {
    const right = RIGHT_ALIGN_HEADERS.has(h)
    return alignCell(`${BOLD}${h}${RESET}`, colWidths[i] ?? 8, right)
  })
  const underline = colWidths.map((cw) => `${DIM}${'─'.repeat(Math.max(1, cw))}${RESET}`).join(gap)
  const lines: string[] = [fixedLine(headerCells.join(gap), w), fixedLine(underline, w)]
  const bodyRows =
    input.rows.length === 0 && input.emptyMessage ? [[input.emptyMessage]] : input.rows
  const maxRows = Math.max(0, input.maxBodyRows)
  const shown = bodyRows.slice(0, maxRows)
  for (const row of shown) {
    const cells = headers.map((h, i) => {
      const right = RIGHT_ALIGN_HEADERS.has(h)
      return alignCell(row[i] ?? '—', colWidths[i] ?? 8, right)
    })
    lines.push(fixedLine(cells.join(gap), w))
  }
  const clipped = bodyRows.length - shown.length
  if (clipped > 0) {
    lines.push(fixedLine(`${DIM}+${clipped} more rows${RESET}`, w))
  }
  return lines
}
