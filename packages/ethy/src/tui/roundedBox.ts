import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { fixedField, fixedLine } from './layout.ts'

export function boxTop(boxW: number, titlePlain: string, rightPlain?: string): string {
  const prefix = `${DIM}╭─ ${RESET}${titlePlain}${DIM} `
  const prefixVis = visibleWidth(prefix)
  const rightVis =
    rightPlain !== undefined && rightPlain.length > 0 ? visibleWidth(`${rightPlain}${DIM} `) : 0
  const dashes = Math.max(1, boxW - prefixVis - rightVis - 1)
  const rightSuffix =
    rightPlain !== undefined && rightPlain.length > 0 ? `${rightPlain}${DIM} ` : ''
  return fixedLine(`${prefix}${'─'.repeat(dashes)}${rightSuffix}╮${RESET}`, boxW)
}

export function boxRow(boxW: number, text: string): string {
  const inner = Math.max(0, boxW - 4)
  const body = fixedField(text, inner)
  return fixedLine(`${DIM}│${RESET} ${body} ${DIM}│${RESET}`, boxW)
}

export function boxBottom(boxW: number): string {
  return fixedLine(`${DIM}╰${'─'.repeat(Math.max(0, boxW - 2))}╯${RESET}`, boxW)
}

/** Rounded box: top, pad, `contentLines`, pad, bottom (8 lines when 4 content rows). */
export function renderBox(
  boxW: number,
  titlePlain: string,
  contentLines: string[],
  titleRightPlain?: string,
): string[] {
  const pad = boxRow(boxW, '')
  return [
    boxTop(boxW, titlePlain, titleRightPlain),
    pad,
    ...contentLines.map((r) => boxRow(boxW, r)),
    pad,
    boxBottom(boxW),
  ]
}

export function innerRowWidth(boxW: number): number {
  return Math.max(0, boxW - 4)
}

export function joinBoxColumns(columns: string[][], contentWidth: number, gap = '  '): string[] {
  const lineCount = columns[0]?.length ?? 0
  const out: string[] = []
  for (let i = 0; i < lineCount; i++) {
    const parts = columns.map((col) => col[i] ?? fixedLine('', contentWidth))
    out.push(fixedLine(parts.join(gap), contentWidth))
  }
  return out
}

export { BOLD }
