import { padVisible, truncateVisible, visibleWidth } from './ansi.ts'

/** One screen line with exactly `cols` visible columns (ANSI-safe). */
export function fixedLine(text: string, cols: number): string {
  return padVisible(truncateVisible(text, cols), cols)
}

/** One screen line with content right-aligned to `cols` visible columns. */
export function fixedLineRight(text: string, cols: number): string {
  const trimmed = truncateVisible(text, cols)
  const vis = visibleWidth(trimmed)
  if (vis >= cols) return padVisible(trimmed, cols)
  return `${' '.repeat(cols - vis)}${trimmed}`
}

/** Truncate/pad a single field to a fixed visible width. */
export function fixedField(text: string, width: number): string {
  if (width <= 0) return ''
  return padVisible(truncateVisible(text, width), width)
}

/** Minimum visible spaces between two-column label and value (cockpit + widgets). */
export const TWO_COLUMN_MIN_GAP = 2

export type TwoColumnPair = { label: string; value: string }

export function maxLabelWidth(pairs: readonly TwoColumnPair[]): number {
  let max = 0
  for (const p of pairs) {
    max = Math.max(max, visibleWidth(p.label))
  }
  return max
}

/**
 * One two-column row: fixed label width, then gap (≥ {@link TWO_COLUMN_MIN_GAP}), then value.
 * `rowWidth` is the full visible width of the row (inside box borders).
 */
export function formatTwoColumnRow(
  label: string,
  value: string,
  labelWidth: number,
  rowWidth: number,
): string {
  const lw = Math.max(labelWidth, visibleWidth(label))
  const gap = TWO_COLUMN_MIN_GAP
  const valueWidth = Math.max(0, rowWidth - lw - gap)
  const left = fixedField(label, lw)
  const right = fixedField(value, valueWidth)
  return left + ' '.repeat(gap) + right
}

export function formatTwoColumnRows(
  pairs: readonly TwoColumnPair[],
  labelWidth: number,
  rowWidth: number,
): string[] {
  const lw = Math.max(labelWidth, maxLabelWidth(pairs))
  return pairs.map((p) => formatTwoColumnRow(p.label, p.value, lw, rowWidth))
}

/**
 * Place labeled fields on one row. Each entry uses a fixed visible width so
 * later fields do not shift when earlier values change length.
 */
export function composeFixedRow(
  cols: number,
  segments: Array<{ text: string; width: number }>,
  gap = 1,
): string {
  const parts: string[] = []
  let used = 0
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (seg === undefined) continue
    const w = Math.min(seg.width, Math.max(0, cols - used))
    if (w <= 0) break
    parts.push(fixedField(seg.text, w))
    used += w
    if (i < segments.length - 1 && used < cols) {
      const g = Math.min(gap, cols - used)
      parts.push(' '.repeat(g))
      used += g
    }
  }
  return fixedLine(parts.join(''), cols)
}

/** Split `cols` across weights (integer visible columns per segment). */
export function widthsFromWeights(cols: number, weights: number[], gaps: number): number[] {
  const gapTotal = Math.max(0, weights.length - 1) * gaps
  const budget = Math.max(0, cols - gapTotal)
  const sum = weights.reduce((a, b) => a + b, 0)
  if (sum === 0) return weights.map(() => 0)
  const raw = weights.map((w) => Math.floor((budget * w) / sum))
  let remainder = budget - raw.reduce((a, b) => a + b, 0)
  for (let i = 0; remainder > 0; i++, remainder--) {
    raw[i % raw.length] = (raw[i % raw.length] ?? 0) + 1
  }
  return raw
}

/**
 * Brand flush left; capability pills packed from the **right** with natural
 * widths and a fixed inter-pill gap (proximity grouping).
 *
 * Trailing pills keep the same start column when an earlier label changes
 * length; only the leftmost pills shift. One flexible spacer before the cluster.
 */
export function composeBrandAndRightPills(
  cols: number,
  brand: string,
  pills: string[],
  pillMaxWidths: number[],
  pillGap: number,
  beforePills?: { text: string; gap: number },
): string {
  const count = pills.length
  const maxWidths = pills.map((_, i) => Math.max(0, pillMaxWidths[i] ?? 0))

  const placed: Array<{ col: number; text: string }> = []
  let cursor = cols

  for (let i = count - 1; i >= 0; i--) {
    const cap = maxWidths[i] ?? 0
    if (cap <= 0) continue
    const text = truncateVisible(pills[i] ?? '', cap)
    const w = visibleWidth(text)
    cursor -= w
    if (cursor < 0) cursor = 0
    placed.unshift({ col: cursor, text })
    if (i > 0) cursor -= pillGap
  }

  const pillStart = placed[0]?.col ?? cols
  let lead: { col: number; text: string } | undefined
  if (beforePills !== undefined && beforePills.text.length > 0 && beforePills.gap >= 0) {
    const text = beforePills.text
    const col = Math.max(0, pillStart - beforePills.gap - visibleWidth(text))
    lead = { col, text }
  }

  const clusterStart = lead?.col ?? pillStart
  const brandShown = truncateVisible(brand, Math.max(0, clusterStart))
  const brandUsed = visibleWidth(brandShown)

  let line = brandShown
  if (brandUsed < clusterStart) {
    line += ' '.repeat(clusterStart - brandUsed)
  }

  const segments = lead !== undefined ? [lead, ...placed] : placed
  for (const { col, text } of segments) {
    while (visibleWidth(line) < col && visibleWidth(line) < cols) {
      line += ' '
    }
    line += text
  }

  return fixedLine(line, cols)
}
