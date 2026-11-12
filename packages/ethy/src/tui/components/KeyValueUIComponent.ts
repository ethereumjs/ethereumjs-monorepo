import { DIM, RESET, visibleWidth } from '../ansi.ts'
import {
  TWO_COLUMN_MIN_GAP,
  type TwoColumnPair,
  fixedLine,
  formatTwoColumnRow,
  maxLabelWidth,
} from '../layout.ts'

function shouldWrapFullTokenValue(value: string, valueWidth: number): boolean {
  if (visibleWidth(value) <= valueWidth || valueWidth <= 8) return false
  return !value.includes(' ') || value.startsWith('enode://') || value.startsWith('0x')
}

export function renderKeyValueUIComponent(
  entries: Array<{ key: string; value: string }>,
  innerWidth: number,
): string[] {
  const w = Math.max(20, innerWidth)
  if (entries.length === 0) return [fixedLine(`${DIM}(empty)${RESET}`, w)]
  const pairs: TwoColumnPair[] = entries.map((e) => ({
    label: e.key,
    value: e.value,
  }))
  const lw = maxLabelWidth(pairs)
  const gap = TWO_COLUMN_MIN_GAP
  const valueWidth = Math.max(1, w - lw - gap)
  const out: string[] = []
  for (const p of pairs) {
    if (shouldWrapFullTokenValue(p.value, valueWidth)) {
      const firstChunk = p.value.slice(0, valueWidth)
      out.push(fixedLine(formatTwoColumnRow(p.label, firstChunk, lw, w), w))
      let rest = p.value.slice(valueWidth)
      while (rest.length > 0) {
        const chunk = rest.slice(0, valueWidth)
        out.push(fixedLine(formatTwoColumnRow('', chunk, lw, w), w))
        rest = rest.slice(valueWidth)
      }
    } else {
      out.push(fixedLine(formatTwoColumnRow(p.label, p.value, lw, w), w))
    }
  }
  return out
}
