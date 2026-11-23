import { formatRamGiB } from '../../ai/hardwareCheck.ts'
import type { WidgetSpec } from '../../spine/types.ts'
import { BOLD, DIM, FG, RESET, truncateVisible, visibleWidth } from '../ansi.ts'
import { fixedLine } from '../layout.ts'

function centerLine(text: string, width: number): string {
  const vis = visibleWidth(text)
  if (vis >= width) return fixedLine(text, width)
  const leftPad = Math.floor((width - vis) / 2)
  return fixedLine(`${' '.repeat(leftPad)}${text}`, width)
}

function renderCard(
  width: number,
  selected: boolean,
  headerLabel: string,
  subtitle: string,
  bodyLines: string[],
  footer: string,
): string[] {
  const borderColor = selected ? FG.cyan : DIM
  const mark = selected ? `${BOLD}${FG.cyan}◆${RESET}` : `${DIM}○${RESET}`
  const titleStyled = selected ? `${BOLD}${headerLabel}${RESET}` : `${DIM}${headerLabel}${RESET}`
  const topPrefix = `${borderColor}╭─ ${RESET}${mark} ${titleStyled}${borderColor} `
  const topPrefixW = visibleWidth(topPrefix)
  const topDashes = Math.max(1, width - topPrefixW - 1)
  const top = fixedLine(`${topPrefix}${'─'.repeat(topDashes)}╮${RESET}`, width)

  const innerW = Math.max(4, width - 4)
  const row = (content: string) => {
    const clipped = truncateVisible(content, innerW)
    const pad = Math.max(0, innerW - visibleWidth(clipped))
    return fixedLine(
      `${borderColor}│${RESET} ${clipped}${' '.repeat(pad)} ${borderColor}│${RESET}`,
      width,
    )
  }

  const subStyled = selected ? `${BOLD}${subtitle}${RESET}` : subtitle
  const bottom = fixedLine(`${borderColor}╰${'─'.repeat(Math.max(0, width - 2))}╯${RESET}`, width)

  return [
    top,
    row(''),
    row(subStyled),
    row(''),
    row(bodyLines[0] ?? ''),
    row(bodyLines[1] ?? ''),
    row(bodyLines[2] ?? ''),
    row(''),
    row(footer),
    bottom,
  ]
}

function wrapToWidth(text: string, maxW: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter((w) => w.length > 0)
  const out: string[] = []
  let line = ''
  for (const word of words) {
    const next = line.length === 0 ? word : `${line} ${word}`
    if (visibleWidth(next) > maxW && line.length > 0) {
      out.push(line)
      line = word
      if (out.length >= maxLines) break
    } else {
      line = next
    }
  }
  if (out.length < maxLines && line.length > 0) out.push(line)
  while (out.length < maxLines) out.push('')
  return out
}

function renderWideOnboarding(
  widget: Extract<WidgetSpec, { kind: 'ai_onboarding' }>,
  w: number,
  maxBodyLines: number,
): string[] {
  const selected = widget.selectedOption ?? widget.initialOption ?? 0
  const hw = widget.hardware
  const lowHw = hw?.lowHardware === true
  const models = widget.discoveredModels ?? []
  const pick = Math.min(widget.selectedLocalIndex ?? 0, Math.max(0, models.length - 1))
  const shareOn = widget.sharePromptHistory === true
  const sharePill = shareOn ? `${BOLD}${FG.green}● ON${RESET}` : `${DIM}○ OFF${RESET}`

  // 1. Hero Header
  const brand = `${FG.magenta}◆${RESET} ${FG.yellow}◆${RESET} ${FG.green}◆${RESET} ${FG.cyan}◆${RESET}   ${BOLD}Welcome to ETHY${RESET}   ${DIM}·   Choose how you want to run local intelligence${RESET}`

  let metaLine: string
  if (hw !== undefined) {
    const disk =
      hw.freeDiskBytes !== undefined ? ` · ${formatRamGiB(hw.freeDiskBytes)} disk free` : ''
    metaLine = lowHw
      ? `${FG.yellow}◐${RESET} ${DIM}Hardware ${formatRamGiB(hw.totalRamBytes)} RAM${disk} — Pure Client recommended   ·   P2P & sync warming up${RESET}`
      : `${FG.green}●${RESET} ${DIM}Hardware ${formatRamGiB(hw.totalRamBytes)} RAM${disk}   ·   P2P & sync warming up in background${RESET}`
  } else {
    metaLine = `${DIM}${widget.statusNote ?? 'P2P and sync continue in the background while you choose'}${RESET}`
  }

  // 2. Three equal-width rounded option cards
  const cardGap = 2
  const maxCardW = 36
  const cardW = Math.min(maxCardW, Math.floor((w - cardGap * 2 - 4) / 3))
  const innerW = Math.max(12, cardW - 4)
  const gapStr = ' '.repeat(cardGap)

  const c1Body = wrapToWidth(
    'Auto-installs local runner (~17 MB) + Qwen3.5-2B (~1.28 GB) privately on your machine.',
    innerW,
    3,
  ).map((ln) => (selected === 0 ? ln : `${DIM}${ln}${RESET}`))

  const c2Body = wrapToWidth(
    'Full-width /live Plaza, JSON-RPC & / commands. Zero downloads, zero extra RAM or CPU.',
    innerW,
    3,
  ).map((ln) => (selected === 1 ? ln : `${DIM}${ln}${RESET}`))

  const localStatusLine =
    models.length > 0
      ? `${FG.green}● ${models.length} local model${models.length === 1 ? '' : 's'} detected${RESET}`
      : `${DIM}No local server on :11434${RESET}`
  const c3Intro = wrapToWidth(
    'Connect an existing Ollama, LM Studio, or llama-server.',
    innerW,
    2,
  ).map((ln) => (selected === 2 ? ln : `${DIM}${ln}${RESET}`))
  const c3Body = [c3Intro[0] ?? '', c3Intro[1] ?? '', localStatusLine]

  const card1 = renderCard(
    cardW,
    selected === 0,
    '1 · Built-in AI',
    lowHw ? 'Qwen3.5-2B (~1.28 GB)' : `Qwen3.5-2B ${FG.cyan}(Default)${RESET}`,
    c1Body,
    selected === 0 ? `${BOLD}${FG.cyan}● Selected${RESET}` : `${DIM}Press 1 or ←/→${RESET}`,
  )
  const card2 = renderCard(
    cardW,
    selected === 1,
    '2 · Pure Client',
    lowHw ? `No AI ${FG.yellow}(Recommended)${RESET}` : 'No AI · Full-Width TUI',
    c2Body,
    selected === 1 ? `${BOLD}${FG.cyan}● Selected${RESET}` : `${DIM}Press 2 or ←/→${RESET}`,
  )
  const card3 = renderCard(
    cardW,
    selected === 2,
    '3 · Own Model',
    'Ollama · LM Studio',
    c3Body,
    selected === 2 ? `${BOLD}${FG.cyan}● Selected${RESET}` : `${DIM}Press 3 or ←/→${RESET}`,
  )

  const cardRows: string[] = []
  for (let i = 0; i < card1.length; i++) {
    cardRows.push(centerLine(`${card1[i]}${gapStr}${card2[i]}${gapStr}${card3[i]}`, w))
  }

  // 3. Contextual Action Strip (fixed 2 rows — zero vertical jump across selections)
  let detail1: string
  let detail2: string
  if (selected === 0) {
    detail1 = `${DIM}Session prompt history for AI follow-ups (RAM-only):${RESET}  ${sharePill}  ${DIM}(press ${RESET}${BOLD}M${RESET}${DIM} to toggle)${RESET}`
    detail2 = `${BOLD}${FG.cyan}Enter${RESET} ${DIM}install & start${RESET}   ${DIM}·${RESET}   ${BOLD}←/→${RESET} ${DIM}switch${RESET}   ${DIM}·${RESET}   ${BOLD}1/2/3${RESET} ${DIM}pick${RESET}   ${DIM}·${RESET}   ${DIM}change anytime via /ai${RESET}`
  } else if (selected === 1) {
    detail1 = `${DIM}Pure execution-free Ethereum node — full-width cockpit, zero background model load.${RESET}`
    detail2 = `${BOLD}${FG.cyan}Enter${RESET} ${DIM}start Pure Client${RESET}   ${DIM}·${RESET}   ${BOLD}←/→${RESET} ${DIM}switch${RESET}   ${DIM}·${RESET}   ${BOLD}1/2/3${RESET} ${DIM}pick${RESET}   ${DIM}·${RESET}   ${DIM}enable AI anytime via /ai${RESET}`
  } else if (models.length > 0) {
    const shown = models.slice(0, 3).map((m, i) => {
      const tag = i === pick ? `${BOLD}${FG.cyan}▸ ${m.label}${RESET}` : `${DIM}${m.label}${RESET}`
      return tag
    })
    const more = models.length > 3 ? ` ${DIM}+${models.length - 3}${RESET}` : ''
    detail1 = `${BOLD}Model:${RESET}  ${shown.join(`  ${DIM}│${RESET}  `)}${more}   ${DIM}(↑/↓ cycle)${RESET}`
    detail2 = `${DIM}Prompt history (RAM-only):${RESET} ${sharePill} ${DIM}(M)${RESET}   ${DIM}·${RESET}   ${BOLD}${FG.cyan}Enter${RESET} ${DIM}connect${RESET}   ${DIM}·${RESET}   ${BOLD}←/→${RESET} ${DIM}switch${RESET}`
  } else {
    detail1 = `${FG.yellow}○${RESET} ${DIM}No local server detected on :11434 / :1234 / :8080 — start Ollama or run /ai url <url>${RESET}`
    detail2 = `${BOLD}←/→${RESET} ${DIM}pick another mode${RESET}   ${DIM}·${RESET}   ${BOLD}1${RESET} ${DIM}Built-in AI${RESET}   ${DIM}·${RESET}   ${BOLD}2${RESET} ${DIM}Pure Client${RESET}`
  }

  const content = [
    centerLine(brand, w),
    centerLine(metaLine, w),
    fixedLine('', w),
    ...cardRows,
    fixedLine('', w),
    centerLine(detail1, w),
    centerLine(detail2, w),
  ]

  const trimmed = content.slice(0, maxBodyLines)
  const topPad = Math.max(0, Math.floor((maxBodyLines - trimmed.length) / 2))
  const out: string[] = []
  for (let i = 0; i < maxBodyLines; i++) {
    if (i < topPad || i >= topPad + trimmed.length) out.push(fixedLine('', w))
    else out.push(trimmed[i - topPad] ?? fixedLine('', w))
  }
  return out
}

function renderCompactOnboarding(
  widget: Extract<WidgetSpec, { kind: 'ai_onboarding' }>,
  w: number,
  maxBodyLines: number,
): string[] {
  const selected = widget.selectedOption ?? widget.initialOption ?? 0
  const models = widget.discoveredModels ?? []
  const pick = Math.min(widget.selectedLocalIndex ?? 0, Math.max(0, models.length - 1))
  const shareOn = widget.sharePromptHistory === true
  const opt = (idx: number, label: string, sub: string) => {
    const active = selected === idx
    const mark = active ? `${BOLD}${FG.cyan}◆${RESET}` : `${DIM}○${RESET}`
    const head = active ? `${BOLD}${label}${RESET}` : `${DIM}${label}${RESET}`
    const full = `${mark} ${head}  ${DIM}${sub}${RESET}`
    return centerLine(visibleWidth(full) <= w ? full : `${mark} ${head}`, w)
  }

  const rows: string[] = [
    centerLine(`${BOLD}Welcome to ETHY${RESET} ${DIM}· Choose AI Mode${RESET}`, w),
    fixedLine('', w),
    opt(0, '1 · Built-in AI (Qwen3.5-2B)', 'Auto-installs runner + 1.28 GB model'),
    opt(1, '2 · Pure Client (No AI)', 'Full-width TUI · zero LLM load'),
    opt(
      2,
      '3 · Own Local Model',
      models.length > 0 ? `${models.length} detected` : 'Ollama / LM Studio',
    ),
    fixedLine('', w),
  ]
  if (selected === 2 && models.length > 0) {
    rows.push(
      centerLine(`${BOLD}${FG.cyan}▸ ${models[pick]!.label}${RESET} ${DIM}(↑/↓)${RESET}`, w),
    )
  } else if (selected !== 1) {
    rows.push(
      centerLine(
        `${DIM}Prompt history (RAM-only):${RESET} ${BOLD}${shareOn ? 'ON' : 'OFF'}${RESET} ${DIM}(M toggle · Enter confirm)${RESET}`,
        w,
      ),
    )
  } else {
    rows.push(centerLine(`${BOLD}${FG.cyan}Enter${RESET} ${DIM}to start Pure Client${RESET}`, w))
  }

  const trimmed = rows.slice(0, maxBodyLines)
  const topPad = Math.max(0, Math.floor((maxBodyLines - trimmed.length) / 2))
  const out: string[] = []
  for (let i = 0; i < maxBodyLines; i++) {
    if (i < topPad || i >= topPad + trimmed.length) out.push(fixedLine('', w))
    else out.push(trimmed[i - topPad] ?? fixedLine('', w))
  }
  return out
}

export function renderAiOnboardingUIComponent(
  widget: Extract<WidgetSpec, { kind: 'ai_onboarding' }>,
  innerWidth: number,
  maxBodyLines: number,
): string[] {
  const w = Math.max(20, innerWidth)
  if (maxBodyLines <= 0) return []
  if (w >= 86 && maxBodyLines >= 16) {
    return renderWideOnboarding(widget, w, maxBodyLines)
  }
  return renderCompactOnboarding(widget, w, maxBodyLines)
}
