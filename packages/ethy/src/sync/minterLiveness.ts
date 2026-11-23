/**
 * Tracks peer ETHY/0 minter liveness for hash-lottery suppression (WP-11b).
 */

export type MinterLivenessBook = {
  readonly lastServeAtByPeer: Map<string, number>
  readonly zeroMaskSinceByPeer: Map<string, number>
}

export function createMinterLivenessBook(): MinterLivenessBook {
  return {
    lastServeAtByPeer: new Map(),
    zeroMaskSinceByPeer: new Map(),
  }
}

function normId(peerId: string): string {
  return peerId.toLowerCase()
}

export function noteMinterEthyServe(
  book: MinterLivenessBook,
  peerId: string,
  nowMs = Date.now(),
): void {
  book.lastServeAtByPeer.set(normId(peerId), nowMs)
}

/** Record STATUS-shaped mint advertisement relative to macro-generation `generationBlock`. */
export function noteMinterStatus(
  book: MinterLivenessBook,
  peerId: string,
  basePivotBlock: bigint,
  bucketsBitmask: number,
  generationBlock: bigint,
  nowMs = Date.now(),
): void {
  const id = normId(peerId)
  if (basePivotBlock < generationBlock) {
    book.zeroMaskSinceByPeer.delete(id)
    return
  }
  if (bucketsBitmask === 0) {
    if (!book.zeroMaskSinceByPeer.has(id)) {
      book.zeroMaskSinceByPeer.set(id, nowMs)
    }
  } else {
    book.zeroMaskSinceByPeer.delete(id)
  }
}

export function minterLastServeAt(book: MinterLivenessBook, peerId: string): number | undefined {
  return book.lastServeAtByPeer.get(normId(peerId))
}

export function minterZeroMaskSince(book: MinterLivenessBook, peerId: string): number | undefined {
  return book.zeroMaskSinceByPeer.get(normId(peerId))
}
