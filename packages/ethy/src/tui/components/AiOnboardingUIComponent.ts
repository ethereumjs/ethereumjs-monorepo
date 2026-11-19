import { formatRamGiB } from '../../ai/hardwareCheck.ts'
import { DEFAULT_MANAGED_MODEL_SPEC } from '../../ai/managedModel.ts'
import type { WidgetSpec } from '../../spine/types.ts'
import { BOLD, DIM, FG, RESET, visibleWidth } from '../ansi.ts'
import { fixedLine } from '../layout.ts'

function optionLine(
  n: number,
  title: string,
  subtitle: string,
  selected: boolean,
  innerWidth: number,
): string {
  const mark = selected ? `${BOLD}${FG.cyan}▸${RESET}` : `${DIM} ${RESET}`
  const head = `${mark} ${BOLD}${n}. ${title}${RESET}`
  const sub = `${DIM}${subtitle}${RESET}`
  const combined = `${head}  ${sub}`
  if (visibleWidth(combined) <= innerWidth) return fixedLine(combined, innerWidth)
  return fixedLine(head, innerWidth)
}

export function renderAiOnboardingUIComponent(
  widget: Extract<WidgetSpec, { kind: 'ai_onboarding' }>,
  innerWidth: number,
  maxBodyLines: number,
): string[] {
  const w = Math.max(20, innerWidth)
  if (maxBodyLines <= 0) return []

  const selected = widget.selectedOption ?? widget.initialOption ?? 0
  const hw = widget.hardware
  const lines: string[] = []
  const push = (line: string) => {
    if (lines.length >= maxBodyLines) return
    lines.push(fixedLine(line, w))
  }

  push(`${BOLD}Choose AI mode${RESET}`)
  if (widget.statusNote !== undefined) {
    push(`${DIM}${widget.statusNote}${RESET}`)
  }
  if (hw !== undefined) {
    const disk =
      hw.freeDiskBytes !== undefined ? ` · disk ${formatRamGiB(hw.freeDiskBytes)} free` : ''
    push(
      `${DIM}Hardware · RAM ${formatRamGiB(hw.totalRamBytes)} (${formatRamGiB(hw.freeRamBytes)} free)${disk}${RESET}`,
    )
    if (hw.lowHardware) {
      push(
        `${FG.yellow}Low-memory hint: No AI is recommended (< 6 GiB RAM or < 2 GiB disk).${RESET}`,
      )
    }
  }
  push('')

  push(
    optionLine(
      1,
      `Install / use default model (${DEFAULT_MANAGED_MODEL_SPEC.displayName})`,
      `Zero-config · ${DEFAULT_MANAGED_MODEL_SPEC.downloadHint}`,
      selected === 0,
      w,
    ),
  )
  push(
    optionLine(
      2,
      'No AI (Pure Ethereum Client)',
      'Full-width cockpit · /live Plaza · JSON-RPC · slash commands only',
      selected === 1,
      w,
    ),
  )
  push(
    optionLine(
      3,
      'Connect own local model (Ollama · LM Studio · llama.cpp)',
      'Auto-discover loopback servers on this machine',
      selected === 2,
      w,
    ),
  )

  const models = widget.discoveredModels ?? []
  if (selected === 2 && models.length > 0) {
    push('')
    push(`${BOLD}Installed models${RESET} ${DIM}(↑↓ · Enter)${RESET}`)
    const pick = widget.selectedLocalIndex ?? 0
    for (let i = 0; i < Math.min(models.length, maxBodyLines - lines.length); i++) {
      const m = models[i]!
      const sel = i === pick ? `${FG.cyan}▸${RESET}` : `${DIM} ${RESET}`
      push(`${sel} ${m.label}`)
    }
  } else if (selected === 2 && models.length === 0) {
    push('')
    push(`${DIM}No local models discovered — start Ollama or use /ai url …${RESET}`)
  }

  if (selected === 0) {
    push('')
    push(
      `${DIM}Default embedded runner lands in WP-10d — Ollama bridge used when the recommended family is installed.${RESET}`,
    )
  }

  if (selected !== 1) {
    const shareOn = widget.sharePromptHistory === true
    push('')
    push(
      `${DIM}Session prompt history for AI follow-ups (RAM-only): ${RESET}${BOLD}${shareOn ? 'ON' : 'OFF'}${RESET}${DIM}  (press M to toggle · Enter to confirm)${RESET}`,
    )
  } else {
    push('')
    push(`${DIM}Press Enter to continue without AI (change anytime via /ai)${RESET}`)
  }

  while (lines.length < maxBodyLines) {
    lines.push(fixedLine('', w))
  }
  return lines.slice(0, maxBodyLines)
}
