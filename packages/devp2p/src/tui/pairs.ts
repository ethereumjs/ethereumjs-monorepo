import type { TranscriptLine } from './model.ts'

/** One message per side. A row lines the same message up across the two nodes. */
export type ActionPair = {
  left: TranscriptLine[]
  right: TranscriptLine[]
}

/**
 * `mirror` — two local nodes. Each message is its own row: the get beside the
 * get, then the answer beside the answer. `echo` pairs identical observations only.
 */
export function pairTranscripts(
  left: TranscriptLine[],
  right: TranscriptLine[],
  mode: 'mirror' | 'echo',
): ActionPair[] {
  if (mode === 'echo') return pairEcho(left, right)
  return pairMirror(left, right)
}

/** Same packet can be `out` on one node and `in` on the other. */
const CROSSING_MESSAGE = new Set([
  'PING',
  'PONG',
  'GET_BLOCK_HEADERS',
  'BLOCK_HEADERS',
  'GET_BLOCK_BODIES',
  'BLOCK_BODIES',
  'GET_RECEIPTS',
  'RECEIPTS',
  'GET_NODE_DATA',
  'NODE_DATA',
  'GET_POOLED_TRANSACTIONS',
  'POOLED_TRANSACTIONS',
  'GET_ACCOUNT_RANGE',
  'ACCOUNT_RANGE',
  'GET_STORAGE_RANGES',
  'STORAGE_RANGES',
  'GET_BYTE_CODES',
  'BYTE_CODES',
  'GET_TRIE_NODES',
  'TRIE_NODES',
])

type Segment = {
  events: TranscriptLine[]
  /** Index of the first event in that pane's transcript. */
  index: number
  key: string
}

function pairMirror(left: TranscriptLine[], right: TranscriptLine[]): ActionPair[] {
  const leftSeg = segmentsOf(left)
  const rightSeg = segmentsOf(right)
  const usedRight = new Array<boolean>(rightSeg.length).fill(false)
  const matchOfLeft = new Array<number>(leftSeg.length).fill(-1)
  const lastRight = new Map<string, number>()

  for (let i = 0; i < leftSeg.length; i++) {
    const key = leftSeg[i]!.key
    const start = (lastRight.get(key) ?? -1) + 1
    for (let j = start; j < rightSeg.length; j++) {
      if (usedRight[j] || rightSeg[j]!.key !== key) continue
      usedRight[j] = true
      matchOfLeft[i] = j
      lastRight.set(key, j)
      break
    }
  }

  const rows: ActionPair[] = []
  const placed = new Set<number>()
  const placeUnmatchedBefore = (transcriptIndex: number) => {
    for (let j = 0; j < rightSeg.length; j++) {
      if (usedRight[j] || placed.has(j)) continue
      if (rightSeg[j]!.index >= transcriptIndex) break
      rows.push({ left: [], right: rightSeg[j]!.events })
      placed.add(j)
    }
  }

  for (let i = 0; i < leftSeg.length; i++) {
    const j = matchOfLeft[i]!
    if (j === -1) {
      rows.push({ left: leftSeg[i]!.events, right: [] })
      continue
    }
    placeUnmatchedBefore(rightSeg[j]!.index)
    rows.push({ left: leftSeg[i]!.events, right: rightSeg[j]!.events })
    placed.add(j)
  }
  for (let j = 0; j < rightSeg.length; j++) {
    if (!placed.has(j)) rows.push({ left: [], right: rightSeg[j]!.events })
  }
  return rows
}

function pairEcho(left: TranscriptLine[], right: TranscriptLine[]): ActionPair[] {
  const usedRight = new Array<boolean>(right.length).fill(false)
  const matchOfLeft = new Array<number>(left.length).fill(-1)
  for (let i = 0; i < left.length; i++) {
    for (let j = 0; j < right.length; j++) {
      if (usedRight[j]) continue
      if (!sameObservation(left[i]!, right[j]!)) continue
      usedRight[j] = true
      matchOfLeft[i] = j
      break
    }
  }
  const rows: ActionPair[] = []
  const placed = new Set<number>()
  for (let i = 0; i < left.length; i++) {
    const j = matchOfLeft[i]!
    if (j === -1) {
      rows.push({ left: [left[i]!], right: [] })
      continue
    }
    for (let k = 0; k < j; k++) {
      if (usedRight[k] || placed.has(k)) continue
      rows.push({ left: [], right: [right[k]!] })
      placed.add(k)
    }
    rows.push({ left: [left[i]!], right: [right[j]!] })
    placed.add(j)
  }
  for (let j = 0; j < right.length; j++) {
    if (!placed.has(j)) rows.push({ left: [], right: [right[j]!] })
  }
  return rows
}

/** One event per segment, so each message renders in its own box. */
function segmentsOf(lines: TranscriptLine[]): Segment[] {
  return lines.map((line, index) => ({
    events: [line],
    index,
    key: messageKey(line),
  }))
}

function messageKey(line: TranscriptLine): string {
  const local = line.local ? 'local' : 'wire'
  const dir = !line.local && CROSSING_MESSAGE.has(line.name) ? '' : `:${line.dir}`
  return `${line.layer}:${line.name}:${local}${dir}`
}

function sameObservation(a: TranscriptLine, b: TranscriptLine): boolean {
  if (Boolean(a.local) !== Boolean(b.local)) return false
  return a.layer === b.layer && a.name === b.name && a.dir === b.dir
}
