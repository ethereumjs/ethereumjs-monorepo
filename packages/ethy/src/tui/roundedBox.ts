import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { fixedField, fixedLine } from './layout.ts'

export function boxTop(boxW: number, titlePlain: string, rightPlain?: string): string {
  const prefix = `${DIM}╭─ ${RESET}${titlePlain}${DIM} `
  const prefixVis = visibleWidth(prefix)
  const hasRight = rightPlain !== undefined && rightPlain.length > 0
  const rightSuffix = hasRight ? ` ${RESET}${rightPlain}${DIM} ─` : ''
  const rightVis = hasRight ? visibleWidth(rightSuffix) : 0
  const dashes = Math.max(1, boxW - prefixVis - rightVis - 1)
  return fixedLine(`${prefix}${'─'.repeat(dashes)}${rightSuffix}╮${RESET}`, boxW)
}

export function boxRow(boxW: number, text: string): string {
  const inner = Math.max(0, boxW - 4)
  const body = fixedField(text, inner)
  return fixedLine(`${DIM}│${RESET} ${body} ${DIM}│${RESET}`, boxW)
}

export function boxBottom(boxW: number, rightPlain?: string): string {
  const hasRight = rightPlain !== undefined && rightPlain.length > 0
  if (!hasRight) {
    return fixedLine(`${DIM}╰${'─'.repeat(Math.max(0, boxW - 2))}╯${RESET}`, boxW)
  }
  const rightSuffix = ` ${RESET}${rightPlain}${DIM} ─╯${RESET}`
  const rightVis = visibleWidth(rightSuffix)
  const dashes = Math.max(1, boxW - 1 - rightVis)
  return fixedLine(`${DIM}╰${'─'.repeat(dashes)}${rightSuffix}`, boxW)
}

/** Rounded box: top, pad, `contentLines`, pad, bottom (8 lines when 4 content rows). */
export function renderBox(
  boxW: number,
  titlePlain: string,
  contentLines: string[],
  titleRightPlain?: string,
  bottomRightPlain?: string,
): string[] {
  const pad = boxRow(boxW, '')
  return [
    boxTop(boxW, titlePlain, titleRightPlain),
    pad,
    ...contentLines.map((r) => boxRow(boxW, r)),
    pad,
    boxBottom(boxW, bottomRightPlain),
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
