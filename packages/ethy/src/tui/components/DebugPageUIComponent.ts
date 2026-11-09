import type { DebugSectionSpec } from '../../spine/types.ts'
import { BOLD, RESET } from '../ansi.ts'
import { fixedLine } from '../layout.ts'
import { renderKeyValueUIComponent } from './KeyValueUIComponent.ts'

export function renderDebugPageUIComponent(
  sections: DebugSectionSpec[],
  innerWidth: number,
  maxLines: number,
): string[] {
  const w = Math.max(20, innerWidth)
  const lines: string[] = []
  for (const section of sections) {
    if (lines.length >= maxLines) break
    lines.push(fixedLine(`${BOLD}${section.title}${RESET}`, w))
    const kv = renderKeyValueUIComponent(section.entries, w)
    for (const line of kv) {
      if (lines.length >= maxLines) break
      lines.push(line)
    }
    if (lines.length < maxLines) lines.push(fixedLine('', w))
  }
  return lines.slice(0, maxLines)
}
