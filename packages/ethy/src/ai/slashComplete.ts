const SLASH_COMMANDS = [
  '/peers',
  '/buckets',
  '/snap',
  '/diag',
  '/drop ',
  '/reassign ',
  '/account ',
  '/bal',
  '/simulate',
  '/help',
] as const

const SHORT_EXPAND: Record<string, string> = {
  '/p': '/peers',
  '/b': '/buckets',
  '/d': '/diag',
  '/r': '/reassign ',
  '/a': '/account ',
  '/s': '/simulate',
  '/h': '/help',
}

/** Longest matching command for Tab completion, or null if ambiguous / no match. */
export function completeSlashDraft(draft: string): string | null {
  if (!draft.startsWith('/')) return null
  const lower = draft.toLowerCase()
  const matches = SLASH_COMMANDS.filter((c) => c.startsWith(lower))
  if (matches.length !== 1) return null
  return matches[0]!
}

/** Expand unambiguous short slash prefixes before intent routing. */
export function expandSlashCommand(line: string): string {
  const trimmed = line.trim()
  const lower = trimmed.toLowerCase()
  const direct = SHORT_EXPAND[lower]
  if (direct !== undefined) return direct
  const completed = completeSlashDraft(trimmed)
  if (completed !== null && completed !== trimmed) {
    return completed
  }
  return trimmed
}
