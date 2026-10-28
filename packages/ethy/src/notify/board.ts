export type NoticeLevel = 'info' | 'warn' | 'alert'

export interface NoticeDraft {
  /** Same key updates the open notice instead of stacking a duplicate. */
  key: string
  level: NoticeLevel
  text: string
  /**
   * How long the notice stays the live message, in ms from `now`.
   * Omit to keep it until `clear`, or until a newer live notice replaces it.
   */
  relevantForMs?: number
}

/** A newly posted notice stays on screen at least this long before the next one. */
export const NOTICE_MIN_DWELL_MS = 4_000

/** Internal cap on stored notices (not shown in the TUI). */
export const NOTICE_STORE_LIMIT = 24

export interface LiveNotice {
  text: string
  level: NoticeLevel
}

interface StoredNotice {
  id: number
  key: string
  level: NoticeLevel
  text: string
  cleared: boolean
  relevantUntil?: number
}

/**
 * In-process channel other client pieces post into.
 * The TUI shows at most one live line via {@link describeNotice}.
 */
export class NoticeBoard {
  private readonly list: StoredNotice[] = []
  private seq = 1
  private shownId: number | null = null
  private shownSince = 0
  private pendingId: number | null = null

  post(draft: NoticeDraft, now: number): void {
    const text = draft.text.trim()
    if (text.length === 0) return
    const relevantUntil =
      draft.relevantForMs === undefined ? undefined : now + Math.max(0, draft.relevantForMs)
    const open = this.list.find((n) => n.key === draft.key && !n.cleared)
    if (open !== undefined) {
      open.level = draft.level
      open.text = text
      open.relevantUntil = relevantUntil
      if (this.shownId !== open.id) this.queue(open.id, now)
      return
    }
    const notice: StoredNotice = {
      id: this.seq++,
      key: draft.key,
      level: draft.level,
      text,
      cleared: false,
      relevantUntil,
    }
    this.list.push(notice)
    while (this.list.length > NOTICE_STORE_LIMIT) {
      const dropped = this.list.shift()
      if (dropped === undefined) break
      if (this.shownId === dropped.id) this.shownId = null
      if (this.pendingId === dropped.id) this.pendingId = null
    }
    this.queue(notice.id, now)
  }

  clear(key: string, now: number): void {
    let changed = false
    for (const notice of this.list) {
      if (notice.key !== key || notice.cleared) continue
      if (this.shownId === notice.id) {
        this.shownId = null
        this.pendingId = null
      }
      notice.cleared = true
      notice.relevantUntil = now
      changed = true
    }
    if (changed) this.tick(now)
  }

  tick(now: number): void {
    if (this.shownId === null) {
      const next = this.newestRelevant(now)
      if (next !== undefined) this.hold(next.id, now)
      return
    }
    if (now - this.shownSince < NOTICE_MIN_DWELL_MS) return
    if (this.pendingId !== null && this.byId(this.pendingId) !== undefined) {
      const id = this.pendingId
      this.pendingId = null
      this.hold(id, now)
      return
    }
    const shown = this.byId(this.shownId)
    const relevant = this.newestRelevant(now)
    if (relevant !== undefined && relevant.id !== this.shownId) {
      this.hold(relevant.id, now)
      return
    }
    if (shown === undefined || !this.isRelevant(shown, now)) {
      this.shownId = null
    }
  }

  /** The one notice the footer may show, after {@link tick}. */
  live(now: number): LiveNotice | null {
    if (this.shownId === null) return null
    const notice = this.byId(this.shownId)
    if (notice === undefined || !this.isRelevant(notice, now)) return null
    return { text: notice.text, level: notice.level }
  }

  private queue(id: number, now: number): void {
    if (this.shownId === null || now - this.shownSince >= NOTICE_MIN_DWELL_MS) {
      this.pendingId = null
      this.hold(id, now)
      return
    }
    this.pendingId = id
  }

  private hold(id: number, now: number): void {
    this.shownId = id
    this.shownSince = now
    if (this.pendingId === id) this.pendingId = null
  }

  private byId(id: number): StoredNotice | undefined {
    return this.list.find((n) => n.id === id)
  }

  private isRelevant(notice: StoredNotice, now: number): boolean {
    if (notice.cleared) return false
    if (notice.relevantUntil === undefined) return true
    return now < notice.relevantUntil
  }

  private newestRelevant(now: number): StoredNotice | undefined {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const notice = this.list[i]
      if (notice !== undefined && this.isRelevant(notice, now)) return notice
    }
    return undefined
  }
}

/** The single live notice for the footer, or `null` when the line stays empty. */
export function describeNotice(board: NoticeBoard, now: number): LiveNotice | null {
  board.tick(now)
  return board.live(now)
}
