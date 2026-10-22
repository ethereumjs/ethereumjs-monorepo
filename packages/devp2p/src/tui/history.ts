import { readFile, writeFile } from 'node:fs/promises'

/** Oldest first. Each prompt keeps its own list. */
export const TUI_HISTORY_CAP = 50

export type HistoryFile = Record<string, string[]>

export type HistoryCursor = {
  /** Index into the list, or `lines.length` for the live draft. */
  index: number
  stash: string
}

export function emptyCursor(lines: string[]): HistoryCursor {
  return { index: lines.length, stash: '' }
}

export function pushHistoryLine(lines: string[], line: string, cap = TUI_HISTORY_CAP): string[] {
  const trimmed = line.trim()
  if (!trimmed || trimmed.includes('\n')) return lines
  const base = lines[lines.length - 1] === trimmed ? lines.slice(0, -1) : lines.slice()
  base.push(trimmed)
  if (base.length > cap) return base.slice(base.length - cap)
  return base
}

/** Up recalls an older line. Down returns toward the draft that was on screen. */
export function moveHistory(
  lines: string[],
  cursor: HistoryCursor,
  draft: string,
  dir: 'up' | 'down',
): { cursor: HistoryCursor; draft: string } {
  if (dir === 'up') {
    if (lines.length === 0 || cursor.index === 0) return { cursor, draft }
    const stash = cursor.index === lines.length ? draft : cursor.stash
    const index = cursor.index === lines.length ? lines.length - 1 : cursor.index - 1
    return { cursor: { index, stash }, draft: lines[index]! }
  }
  if (cursor.index >= lines.length) return { cursor, draft }
  const index = cursor.index + 1
  if (index === lines.length) return { cursor: { index, stash: '' }, draft: cursor.stash }
  return { cursor: { index, stash: cursor.stash }, draft: lines[index]! }
}

export async function readHistoryFile(path: string): Promise<HistoryFile> {
  try {
    const raw = JSON.parse(await readFile(path, 'utf8')) as unknown
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return {}
    const out: HistoryFile = {}
    for (const [name, value] of Object.entries(raw as Record<string, unknown>)) {
      if (!Array.isArray(value)) continue
      const lines = value.filter(
        (item): item is string => typeof item === 'string' && item.trim() !== '',
      )
      out[name] = lines.slice(-TUI_HISTORY_CAP)
    }
    return out
  } catch {
    return {}
  }
}

export async function writeHistoryFile(path: string, file: HistoryFile): Promise<void> {
  const body = `${JSON.stringify(file)}\n`
  await writeFile(path, body)
}
