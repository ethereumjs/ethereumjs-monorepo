import type { DomainHelpSection, WidgetSpec } from '../../spine/types.ts'
import { BOLD, DIM, RESET } from '../ansi.ts'
import { fixedLine } from '../layout.ts'

function renderSection(
  section: DomainHelpSection,
  innerWidth: number,
  budget: { lines: number },
): string[] {
  const out: string[] = []
  const push = (line: string) => {
    if (budget.lines <= 0) return
    out.push(fixedLine(line, innerWidth))
    budget.lines -= 1
  }
  push(`${BOLD}${section.title}${RESET}`)
  push(`${DIM}${'─'.repeat(Math.min(section.title.length, innerWidth))}${RESET}`)
  if (section.rows !== undefined) {
    for (const row of section.rows) {
      const cmd = row.command.padEnd(22, ' ')
      push(`${BOLD}${cmd}${RESET}${DIM}${row.detail}${RESET}`)
    }
  }
  if (section.prompts !== undefined && section.prompts.length > 0) {
    const joined = section.prompts.map((p) => `"${p}"`).join(' · ')
    push(joined)
  }
  push('')
  return out
}

export function renderDomainHelpUIComponent(
  widget: Extract<WidgetSpec, { kind: 'domain_help' }>,
  innerWidth: number,
  maxBodyLines: number,
): string[] {
  const budget = { lines: maxBodyLines }
  const lines: string[] = []
  for (const section of widget.sections) {
    if (budget.lines <= 0) break
    lines.push(...renderSection(section, innerWidth, budget))
  }
  return lines.slice(0, maxBodyLines)
}
