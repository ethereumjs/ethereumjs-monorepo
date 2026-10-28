import type { LiveNotice } from '../notify/board.ts'
import { DIM, FG, RESET } from './ansi.ts'
import { fixedField, fixedLineRight } from './layout.ts'

/** One plain footer line in the metrics column (right-aligned). */
export function renderNoticeLine(notice: LiveNotice | null, width: number): string {
  if (width <= 0 || notice === null || notice.text.length === 0) {
    return fixedField('', width)
  }
  const tone = notice.level === 'alert' ? FG.red : notice.level === 'warn' ? FG.yellow : DIM
  return fixedLineRight(`${tone}${notice.text}${RESET}`, width)
}
