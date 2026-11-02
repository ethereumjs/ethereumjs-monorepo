/** One outstanding snap/1 request per peer (account, bytecode, or storage). */
export type SnapFlightKind = 'account' | 'byteCodes' | 'storage'

export type SnapPeerFlight = {
  kind: SnapFlightKind
  reqId: bigint
  sentAt: number
  rootGeneration: number
}

function flightKey(peerId: string, reqId: bigint): string {
  return `${peerId}:${reqId.toString()}`
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

  inFlightCount(peerId: string): number {
    let count = 0
    const prefix = `${peerId}:`
    for (const key of this.flights.keys()) {
      if (key.startsWith(prefix)) count++
    }
    return count
  }

  has(peerId: string): boolean {
    return this.inFlightCount(peerId) > 0
  }

  tryClaim(
    peerId: string,
    flight: Omit<SnapPeerFlight, 'rootGeneration'>,
    maxInFlight = 1,
  ): boolean {
    if (this.inFlightCount(peerId) >= maxInFlight) return false
    this.flights.set(flightKey(peerId, flight.reqId), {
      ...flight,
      rootGeneration: this.generation,
    })
    return true
  }

  release(peerId: string, reqId: bigint): void {
    this.flights.delete(flightKey(peerId, reqId))
  }

  get(peerId: string, reqId: bigint): SnapPeerFlight | undefined {
    return this.flights.get(flightKey(peerId, reqId))
  }

  clearAll(): void {
    this.flights.clear()
  }
}
