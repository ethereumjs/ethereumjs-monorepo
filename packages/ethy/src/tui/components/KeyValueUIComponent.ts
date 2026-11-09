import { DIM } from '../ansi.ts'
import { type TwoColumnPair, fixedLine, formatTwoColumnRows, maxLabelWidth } from '../layout.ts'

export function renderKeyValueUIComponent(
  entries: Array<{ key: string; value: string }>,
  innerWidth: number,
): string[] {
  const w = Math.max(20, innerWidth)
  if (entries.length === 0) return [fixedLine(`${DIM}(empty)${''}`, w)]
  const pairs: TwoColumnPair[] = entries.map((e) => ({
    label: e.key,
    value: e.value,
  }))
  const lw = maxLabelWidth(pairs)
  return formatTwoColumnRows(pairs, lw, w).map((row) => fixedLine(row, w))
}
