import { fixedLine } from './layout.ts'

/** Horizontal inset shared by every content band on the page. */
export type HorizontalPadding = {
  left: number
  right: number
}

/** One column of air on each side. Delimiters do not use this inset. */
export const PAGE_PADDING: HorizontalPadding = { left: 1, right: 1 }

export type PageMetrics = {
  cols: number
  rows: number
  padding: HorizontalPadding
  /** Columns left for content after the page inset. */
  contentWidth: number
}

export type ContentBand = {
  kind: 'content'
  lines: string[]
  /** Extra inset inside the page padding, for this band only. */
  padding?: Partial<HorizontalPadding>
}

export type DelimiterBand = {
  kind: 'delimiter'
  /** Repeated across the full page width, including the padding columns. */
  glyph?: string
  open?: string
  close?: string
}

export type SpacerBand = {
  kind: 'spacer'
  rows?: number
}

/** Consumes every row not taken by the other bands. */
export type FillBand = {
  kind: 'fill'
  lines: string[]
  padding?: Partial<HorizontalPadding>
}

export type PageBand = ContentBand | DelimiterBand | SpacerBand | FillBand

function nonNegative(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.floor(value))
}

export function measurePage(
  cols: number,
  rows: number,
  padding: HorizontalPadding = PAGE_PADDING,
): PageMetrics {
  const left = nonNegative(padding.left)
  const right = nonNegative(padding.right)
  return {
    cols: nonNegative(cols),
    rows: nonNegative(rows),
    padding: { left, right },
    contentWidth: Math.max(0, nonNegative(cols) - left - right),
  }
}

/** Usable columns after page padding plus an optional extra inset. */
export function bandContentWidth(page: PageMetrics, extra?: Partial<HorizontalPadding>): number {
  const left = page.padding.left + nonNegative(extra?.left ?? 0)
  const right = page.padding.right + nonNegative(extra?.right ?? 0)
  return Math.max(0, page.cols - left - right)
}

/**
 * Place one row inside the page inset. `extra` adds padding for this row only.
 * The result is always `cols` visible columns.
 */
export function insetLine(
  cols: number,
  text: string,
  padding: HorizontalPadding,
  extra?: Partial<HorizontalPadding>,
): string {
  const left = nonNegative(padding.left) + nonNegative(extra?.left ?? 0)
  const right = nonNegative(padding.right) + nonNegative(extra?.right ?? 0)
  const inner = Math.max(0, cols - left - right)
  const body = fixedLine(text, inner)
  return fixedLine(`${' '.repeat(left)}${body}${' '.repeat(right)}`, cols)
}

function delimiterLine(page: PageMetrics, band: DelimiterBand): string {
  const glyph = band.glyph && band.glyph.length > 0 ? band.glyph : '─'
  const body = glyph.repeat(page.cols)
  return fixedLine(`${band.open ?? ''}${body}${band.close ?? ''}`, page.cols)
}

/**
 * Stack bands into a frame of exactly `page.rows` lines.
 * Content and fill bands sit inside the page padding. A delimiter band is
 * full bleed. One fill band absorbs the rows the others do not use.
 */
export function layoutPage(page: PageMetrics, bands: readonly PageBand[]): string[] {
  let reserved = 0
  for (const band of bands) {
    if (band.kind === 'content') reserved += band.lines.length
    else if (band.kind === 'spacer') reserved += band.rows ?? 1
    else if (band.kind === 'delimiter') reserved += 1
  }
  const fillRows = Math.max(0, page.rows - reserved)

  const lines: string[] = []
  for (const band of bands) {
    if (band.kind === 'delimiter') {
      lines.push(delimiterLine(page, band))
      continue
    }
    if (band.kind === 'spacer') {
      const count = band.rows ?? 1
      for (let i = 0; i < count; i++) lines.push(fixedLine('', page.cols))
      continue
    }
    if (band.kind === 'fill') {
      for (let i = 0; i < fillRows; i++) {
        lines.push(insetLine(page.cols, band.lines[i] ?? '', page.padding, band.padding))
      }
      continue
    }
    for (const line of band.lines) {
      lines.push(insetLine(page.cols, line, page.padding, band.padding))
    }
  }

  while (lines.length < page.rows) lines.push(fixedLine('', page.cols))
  return lines.slice(0, page.rows)
}
