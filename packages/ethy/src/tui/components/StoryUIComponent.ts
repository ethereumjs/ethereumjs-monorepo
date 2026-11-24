import type { ChainDispatchCard } from '../../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from '../ansi.ts'
import { fixedLine } from '../layout.ts'

function wrapPlain(text: string, wrapW: number): string[] {
  const words = text.split(/\s+/).filter((w) => w.length > 0)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line.length === 0 ? word : `${line} ${word}`
    if (visibleWidth(next) > wrapW && line.length > 0) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line.length > 0) lines.push(line)
  return lines.length > 0 ? lines : ['']
}

function angleTag(card: ChainDispatchCard): string {
  const kind =
    card.angleKind ??
    (card.lens === 'lore' ? 'history' : card.lens === 'security' ? 'security' : 'question')
  if (kind === 'history') return 'Echo'
  if (kind === 'security') return 'What if'
  return 'Lens'
}

export function renderStoryUIComponent(
  story: ChainDispatchCard,
  innerWidth: number,
  maxBodyLines: number,
): string[] {
  const w = Math.max(20, innerWidth)
  const pad = 2
  const wrapW = Math.max(8, w - pad * 2)
  const lines: string[] = []
  let budget = maxBodyLines

  const push = (raw: string) => {
    if (budget <= 0) return
    lines.push(fixedLine(raw, w))
    budget -= 1
  }

  const shortModel = story.modelLabel?.split(/[\s:/_-]/)[0]?.slice(0, 12) ?? 'local'
  const badge =
    story.deterministic === true
      ? `[FALLBACK · ${(story.fallbackReason ?? 'offline').slice(0, 24)}]`
      : `[STORY · ${shortModel}]`
  const net = (story.network ?? 'NETWORK').toUpperCase()
  const ageSec = Math.max(0, Math.round((Date.now() - story.atMs) / 1000))
  const block = story.blockNumber !== undefined ? ` · #${story.blockNumber}` : ''
  push(`${DIM}${badge}  ${net}${block}  ${ageSec}s ago${RESET}`)
  if (budget <= 0) return lines

  push('')
  for (const ln of wrapPlain(story.headline, wrapW)) {
    push(`${BOLD}${ln}${RESET}`)
  }
  push('')

  const paras = story.body.split(/\n\n+/).filter((p) => p.trim().length > 0)
  for (const p of paras) {
    if (budget <= 1) break
    for (const ln of wrapPlain(p.trim(), wrapW)) {
      push(`${' '.repeat(pad)}${ln}`)
    }
    push('')
  }

  if (story.angle !== undefined && story.angle.length > 0 && budget > 2) {
    push(`${DIM}│${RESET} ${BOLD}${angleTag(story)}${RESET}`)
    for (const ln of wrapPlain(story.angle, wrapW - 2)) {
      push(`${DIM}│${RESET} ${ln}`)
    }
    push('')
  }

  if (story.evidence !== undefined && story.evidence.length > 0 && budget > 1) {
    const bits = story.evidence.map((e) => `${e.label}: ${e.value}`).join(' · ')
    const obs = `Observed: ${bits}`
    for (const ln of wrapPlain(obs, wrapW)) {
      push(`${DIM}${' '.repeat(pad)}${ln}${RESET}`)
    }
    push('')
  }

  if (story.curiosityQuestion !== undefined && budget > 0) {
    for (const ln of wrapPlain(`› Ask: "${story.curiosityQuestion}"`, wrapW)) {
      push(`${DIM}${ln}${RESET}`)
    }
  }
  if (story.suggestedAction !== undefined && budget > 0) {
    push(`${DIM}› ${story.suggestedAction}${RESET}`)
  }

  return lines
}
