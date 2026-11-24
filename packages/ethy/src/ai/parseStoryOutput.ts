import type { SignalKind } from '../economy/types.ts'
import { stripThinkingBlocks } from './llmClient.ts'

const SIGNAL_KINDS: SignalKind[] = [
  'delegation_surge',
  'contract_surge',
  'l2_blob_pressure',
  'congestion_pressure',
  'slot_trend',
  'deployment_or_upgrade',
  'whale_or_flow',
  'sender_burst',
]

export type ParsedStory = {
  headline: string
  story: string
  angle?: string
  curiosityQuestion?: string
  command?: string
}

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```[a-zA-Z0-9_-]*\s*\n?/gm, '')
    .replace(/\n?```\s*$/gm, '')
    .trim()
}

const SECTION_RE =
  /(?:^|\n)\s*(?:#{1,3}\s*)?\*{0,2}(HEADLINE|STORY|ANGLE|HYPOTHESIS|CURIOSITY|POINTER|COMMAND)\*{0,2}\s*:?\s*/gi

function parseSectioned(raw: string): Partial<ParsedStory> | undefined {
  const text = stripMarkdownFences(stripThinkingBlocks(raw))
  const parts: Record<string, string> = {}
  const matches = [...text.matchAll(SECTION_RE)]
  if (matches.length === 0) return undefined
  for (let i = 0; i < matches.length; i++) {
    const key = matches[i]![1]!.toUpperCase()
    const start = (matches[i]!.index ?? 0) + matches[i]![0].length
    const end = i + 1 < matches.length ? matches[i + 1]!.index! : text.length
    parts[key] = text.slice(start, end).trim()
  }
  const headline = parts.HEADLINE?.split('\n')[0]?.trim() ?? ''
  const story = parts.STORY ?? ''
  if (headline.length === 0 && story.length === 0) return undefined
  const angle = parts.ANGLE ?? parts.HYPOTHESIS
  const curiosity = parts.CURIOSITY ?? parts.POINTER
  return {
    headline: headline.slice(0, 84),
    story,
    angle,
    curiosityQuestion: curiosity?.replace(/^["']|["']$/g, ''),
    command: parts.COMMAND?.trim(),
  }
}

function salvagePlainProse(raw: string): ParsedStory | undefined {
  const text = stripMarkdownFences(stripThinkingBlocks(raw)).trim()
  if (text.length < 80) return undefined
  const firstBreak = text.indexOf('\n')
  const firstSentenceEnd = text.search(/[.!?]\s/)
  let headline: string
  let story: string
  if (firstBreak > 0 && firstBreak < 120) {
    headline = text.slice(0, firstBreak).trim()
    story = text.slice(firstBreak).trim()
  } else if (firstSentenceEnd > 0) {
    headline = text.slice(0, firstSentenceEnd + 1).trim()
    story = text.slice(firstSentenceEnd + 1).trim()
  } else {
    headline = text.slice(0, 84)
    story = text
  }
  return { headline: headline.slice(0, 84), story }
}

export function sanitizeStoryText(text: string): string {
  let out = text
  for (const kind of SIGNAL_KINDS) {
    out = out.replace(new RegExp(kind, 'gi'), 'anomaly')
  }
  out = out.replace(/\bscore\s+\d+\b/gi, '')
  out = out.replace(/\bLayer\s+1\s+signal\b/gi, 'live note')
  // Strip accidental markdown bold/emphasis markers, inline backticks, and report footers
  out = out.replace(/\[END OF REPORT\]/gi, '')
  out = out.replace(/\*\*([^*]+)\*\*/g, '$1')
  out = out.replace(/(^|\s)\*([^*\n]+)\*(\s|[.,!?;:]|$)/g, '$1$2$3')
  out = out.replace(/`([^`\n]+)`/g, '$1')
  // Clean accidental meta-references ("The dossier shows/flags/notes...")
  out = out.replace(
    /\bThe\s+dossier\s+(?:explicitly\s+)?(?:shows|flags|notes|reveals|indicates|confirms|states)\s+(?:that\s+)?/gi,
    '',
  )
  out = out.replace(/\bin\s+the\s+dossier\b/gi, 'on-chain')
  out = out.replace(/\bfrom\s+the\s+dossier\b/gi, 'from live execution')
  return out
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function parseStoryOutput(raw: string): ParsedStory | undefined {
  const sectioned = parseSectioned(raw)
  const parsed = sectioned ?? salvagePlainProse(raw)
  if (parsed === undefined) return undefined
  const headlineRaw = parsed.headline?.trim() ?? ''
  const storyRaw = parsed.story?.trim() ?? ''
  if (headlineRaw.length === 0 && storyRaw.length === 0) return undefined
  return {
    headline: sanitizeStoryText(headlineRaw),
    story: sanitizeStoryText(storyRaw),
    angle: parsed.angle !== undefined ? sanitizeStoryText(parsed.angle) : undefined,
    curiosityQuestion:
      parsed.curiosityQuestion !== undefined
        ? sanitizeStoryText(parsed.curiosityQuestion)
        : undefined,
    command: parsed.command,
  }
}
