/** One outstanding snap/1 request per peer (account, bytecode, or storage). */
export type SnapFlightKind = 'account' | 'byteCodes' | 'storage'

export type SnapPeerFlight = {
  kind: SnapFlightKind
  reqId: bigint
  sentAt: number
  rootGeneration: number
}

export class SnapPeerFlightTracker {
  private flights = new Map<string, SnapPeerFlight>()
  private generation = 0

  get rootGeneration(): number {
    return this.generation
  }

  bumpGeneration(): number {
    this.generation++
    this.flights.clear()
    return this.generation
  }

  has(peerId: string): boolean {
    return this.flights.has(peerId)
  }

  tryClaim(peerId: string, flight: Omit<SnapPeerFlight, 'rootGeneration'>): boolean {
    if (this.flights.has(peerId)) return false
    this.flights.set(peerId, { ...flight, rootGeneration: this.generation })
    return true
  }

  release(peerId: string): void {
    this.flights.delete(peerId)
  }

  get(peerId: string): SnapPeerFlight | undefined {
    return this.flights.get(peerId)
  }

  clearAll(): void {
    this.flights.clear()
  }
}
