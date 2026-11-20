/** Verified ETHY/0 minter pivot headers (WP-11b). */

export type MinterHeaderBook = Map<string, { block: bigint; stateRootLower: string }>

export function createMinterHeaderBook(): MinterHeaderBook {
  return new Map()
}

export function noteMinterHeaderVerified(
  book: MinterHeaderBook,
  peerId: string,
  block: bigint,
  stateRootHex: string,
): void {
  const root = stateRootHex.replace(/^0x/i, '').toLowerCase()
  if (root.length === 0) return
  book.set(peerId.toLowerCase(), { block, stateRootLower: root })
}

export function minterHeaderMatchesStatus(
  book: MinterHeaderBook | undefined,
  peerId: string,
  basePivotBlock: bigint,
  basePivotStateRoot: string,
): boolean {
  if (book === undefined) return false
  const row = book.get(peerId.toLowerCase())
  if (row === undefined) return false
  const root = basePivotStateRoot.replace(/^0x/i, '').toLowerCase()
  return row.block === basePivotBlock && row.stateRootLower === root
}
