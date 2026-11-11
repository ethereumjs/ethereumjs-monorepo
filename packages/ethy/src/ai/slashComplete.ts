export const SLASH_COMMANDS = [
  '/live',
  '/peers',
  '/ethy',
  '/rpc',
  '/buckets',
  '/snap',
  '/diag',
  '/drop ',
  '/reassign ',
  '/range ',
  '/sample',
  '/pause',
  '/resume',
  '/account ',
  '/bal',
  '/simulate',
  '/send ',
  '/help',
  '/cl',
  '/economy',
  '/contract ',
  '/clear',
  '/ai ',
] as const

const PLAZA_ALIASES = new Set(['/plaza', '/head'])

const SHORT_EXPAND: Record<string, string> = {
  '/e': '/economy',
  '/co': '/contract',
  '/p': '/peers',
  '/b': '/buckets',
  '/d': '/diag',
  '/r': '/reassign ',
  '/ra': '/range ',
  '/sa': '/sample',
  '/a': '/account ',
  '/s': '/simulate',
  '/h': '/help',
}

/** Longest matching command for Tab completion, or null if ambiguous / no match. */
export function completeSlashDraft(draft: string): string | null {
  if (!draft.startsWith('/')) return null
  const lower = draft.toLowerCase()
  const short = SHORT_EXPAND[lower]
  if (short !== undefined) return short
  const matches = SLASH_COMMANDS.filter((c) => c.startsWith(lower))
  if (matches.length !== 1) return null
  return matches[0]!
}

/** Expand unambiguous short slash prefixes before intent routing. */
export function expandSlashCommand(line: string): string {
  const trimmed = line.trim()
  const parts = trimmed.split(/\s+/)
  const first = parts[0]?.toLowerCase() ?? ''
  if (PLAZA_ALIASES.has(first)) {
    return parts.length > 1 ? `/live ${parts.slice(1).join(' ')}` : '/live'
  }
  if (parts.length > 1) {
    const shortFirst = SHORT_EXPAND[first]?.trim()
    if (shortFirst !== undefined) {
      return `${shortFirst} ${parts.slice(1).join(' ')}`
    }
    const matches = SLASH_COMMANDS.filter((c) => c.startsWith(first))
    if (matches.length === 1) {
      return `${matches[0]!.trim()} ${parts.slice(1).join(' ')}`
    }
    return trimmed
  }
  const direct = SHORT_EXPAND[first]
  if (direct !== undefined) return direct.trim()
  const completed = completeSlashDraft(trimmed)
  if (completed !== null && completed !== trimmed) {
    return completed.trim()
  }
  return trimmed
}
