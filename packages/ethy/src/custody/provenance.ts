export type ProvenanceLabel =
  | 'Local Custody'
  | 'Local BAL'
  | 'Proven-Empty'
  | 'ETHY 1-Hop Proof'
  | 'ETHY 1-Hop Chunk'
  | 'SNAP Bootstrap'

const MAX = 256
const lru = new Map<string, ProvenanceLabel>()

export function noteAccountProvenance(accountHashHex: string, label: ProvenanceLabel): void {
  const key = accountHashHex.toLowerCase()
  if (lru.has(key)) lru.delete(key)
  lru.set(key, label)
  if (lru.size > MAX) {
    const first = lru.keys().next().value
    if (first !== undefined) lru.delete(first)
  }
}

export function provenanceLabelForAccountHash(accountHashHex: string): ProvenanceLabel | undefined {
  return lru.get(accountHashHex.toLowerCase())
}
