export type TurnRecord = {
  userQuery: string
  viewTitle: string
  toolCalled: string
}

const MAX_TURNS = 3

export class TurnMemoryRing {
  private readonly ring: TurnRecord[] = []

  push(record: TurnRecord): void {
    this.ring.push(record)
    while (this.ring.length > MAX_TURNS) {
      this.ring.shift()
    }
  }

  clear(): void {
    this.ring.length = 0
  }

  snapshot(): readonly TurnRecord[] {
    return this.ring
  }
}
