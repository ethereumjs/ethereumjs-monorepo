import type { ChainDispatchCard } from '../spine/types.ts'

const JOURNAL_CAP = 6

export class InvestigationJournal {
  private readonly entries: ChainDispatchCard[] = []

  push(entry: ChainDispatchCard): void {
    this.entries.unshift(entry)
    while (this.entries.length > JOURNAL_CAP) {
      this.entries.pop()
    }
  }

  snapshot(limit = JOURNAL_CAP): readonly ChainDispatchCard[] {
    return this.entries.slice(0, limit)
  }

  latest(): ChainDispatchCard | undefined {
    return this.entries[0]
  }
}

const USER_PROMPT_CAP = 3

export class UserInterestRing {
  private readonly prompts: string[] = []

  notePrompt(text: string): void {
    const t = text.replace(/\s+/g, ' ').trim()
    if (t.length === 0 || t.startsWith('/')) return
    this.prompts.unshift(t.slice(0, 200))
    while (this.prompts.length > USER_PROMPT_CAP) {
      this.prompts.pop()
    }
  }

  snapshot(): readonly string[] {
    return [...this.prompts]
  }
}
