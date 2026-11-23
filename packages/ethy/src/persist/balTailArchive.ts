import fs from 'node:fs'
import path from 'node:path'

import {
  BAL_SEGMENT_BLOCKS,
  MAX_SERVABLE_BAL_TAIL_BLOCKS,
  segmentStart,
} from '../sync/balRetentionPolicy.ts'

const MANIFEST_MAGIC = Buffer.from('BALT')
const SEGMENT_MAGIC = Buffer.from([0x42, 0x54, 0x53, 0x47])
const MANIFEST_VERSION = 1

export type BalTailManifest = {
  earliest: bigint
  latest: bigint
}

export function balTailDir(pivotRootDir: string): string {
  return path.join(pivotRootDir, 'bal-tail')
}

export function readBalTailManifest(pivotRootDir: string): BalTailManifest | undefined {
  const file = path.join(balTailDir(pivotRootDir), 'manifest.bin')
  if (!fs.existsSync(file)) return undefined
  try {
    const raw = fs.readFileSync(file)
    if (raw.length < 28) return undefined
    if (!raw.subarray(0, 4).equals(MANIFEST_MAGIC)) return undefined
    const version = raw.readUInt16BE(4)
    if (version !== MANIFEST_VERSION) return undefined
    const segSize = raw.readUInt32BE(6)
    if (segSize !== Number(BAL_SEGMENT_BLOCKS)) return undefined
    const earliest = raw.readBigUInt64BE(12)
    const latest = raw.readBigUInt64BE(20)
    return { earliest, latest }
  } catch {
    return undefined
  }
}

function writeManifest(pivotRootDir: string, earliest: bigint, latest: bigint): void {
  const dir = balTailDir(pivotRootDir)
  fs.mkdirSync(dir, { recursive: true })
  const buf = Buffer.alloc(28)
  MANIFEST_MAGIC.copy(buf, 0)
  buf.writeUInt16BE(MANIFEST_VERSION, 4)
  buf.writeUInt32BE(Number(BAL_SEGMENT_BLOCKS), 6)
  buf.writeBigUInt64BE(earliest, 12)
  buf.writeBigUInt64BE(latest, 20)
  const target = path.join(dir, 'manifest.bin')
  const tmp = `${target}.tmp`
  fs.writeFileSync(tmp, buf)
  fs.renameSync(tmp, target)
}

type SegmentSlot = { payloadOff: number; headerLen: number; balLen: number }

function ensureSegmentFile(segPath: string): {
  fd: number
  hdr: Buffer
  slots: SegmentSlot[]
  payloadStart: number
} {
  const headerBytes = 4 + 256 * 12
  if (!fs.existsSync(segPath)) {
    fs.mkdirSync(path.dirname(segPath), { recursive: true })
    const buf = Buffer.alloc(headerBytes + 1, 0)
    SEGMENT_MAGIC.copy(buf, 0)
    fs.writeFileSync(segPath, buf)
  }
  const fd = fs.openSync(segPath, 'r+')
  const hdr = Buffer.alloc(headerBytes)
  fs.readSync(fd, hdr, 0, headerBytes, 0)
  if (!hdr.subarray(0, 4).equals(SEGMENT_MAGIC)) {
    fs.closeSync(fd)
    throw new Error('invalid bal segment magic')
  }
  const slots: SegmentSlot[] = []
  for (let i = 0; i < 256; i++) {
    const off = 4 + i * 12
    slots.push({
      payloadOff: hdr.readUInt32BE(off),
      headerLen: hdr.readUInt32BE(off + 4),
      balLen: hdr.readUInt32BE(off + 8),
    })
  }
  const stat = fs.fstatSync(fd)
  return { fd, hdr, slots, payloadStart: stat.size }
}

export type BalTailBatchEntry = {
  blockNumber: bigint
  headerRlp: Uint8Array
  balRlp: Uint8Array
}

function writeBalTailSlot(
  pivotRootDir: string,
  blockNumber: bigint,
  headerRlp: Uint8Array,
  balRlp: Uint8Array,
): boolean {
  const segStart = segmentStart(blockNumber)
  const index = Number(blockNumber - segStart)
  if (index < 0 || index >= 256) return false
  const segPath = path.join(balTailDir(pivotRootDir), `seg-${segStart.toString()}.bin`)
  const { fd, slots, payloadStart } = ensureSegmentFile(segPath)
  try {
    if (slots[index]!.headerLen > 0) {
      return false
    }
    const payload = Buffer.concat([Buffer.from(headerRlp), Buffer.from(balRlp)])
    const payloadOff = payloadStart
    fs.writeSync(fd, payload, 0, payload.length, payloadOff)
    const slotOff = 4 + index * 12
    const slot = Buffer.alloc(12)
    slot.writeUInt32BE(payloadOff, 0)
    slot.writeUInt32BE(headerRlp.length, 4)
    slot.writeUInt32BE(balRlp.length, 8)
    fs.writeSync(fd, slot, 0, 12, slotOff)
    return true
  } finally {
    fs.closeSync(fd)
  }
}

/**
 * Append many BAL tail blocks with one segment open/write per touched 256-block segment
 * and one manifest update per pivot (WP-14).
 */
export function appendBalTailBatch(pivotRootDir: string, entries: BalTailBatchEntry[]): void {
  if (entries.length === 0) return
  const sorted = [...entries].sort((a, b) =>
    a.blockNumber < b.blockNumber ? -1 : a.blockNumber > b.blockNumber ? 1 : 0,
  )
  const bySegment = new Map<bigint, BalTailBatchEntry[]>()
  for (const entry of sorted) {
    const segStart = segmentStart(entry.blockNumber)
    let group = bySegment.get(segStart)
    if (group === undefined) {
      group = []
      bySegment.set(segStart, group)
    }
    group.push(entry)
  }

  let batchEarliest: bigint | undefined
  let batchLatest: bigint | undefined
  for (const [segStart, group] of bySegment) {
    const segPath = path.join(balTailDir(pivotRootDir), `seg-${segStart.toString()}.bin`)
    const { fd, hdr, slots, payloadStart } = ensureSegmentFile(segPath)
    try {
      const payloadChunks: Uint8Array[] = []
      let nextOff = payloadStart
      let dirty = false
      for (const entry of group) {
        const index = Number(entry.blockNumber - segStart)
        if (index < 0 || index >= 256) continue
        if (slots[index]!.headerLen > 0) continue
        const payloadOff = nextOff
        payloadChunks.push(entry.headerRlp, entry.balRlp)
        nextOff += entry.headerRlp.length + entry.balRlp.length
        const slotOff = 4 + index * 12
        hdr.writeUInt32BE(payloadOff, slotOff)
        hdr.writeUInt32BE(entry.headerRlp.length, slotOff + 4)
        hdr.writeUInt32BE(entry.balRlp.length, slotOff + 8)
        slots[index] = {
          payloadOff,
          headerLen: entry.headerRlp.length,
          balLen: entry.balRlp.length,
        }
        dirty = true
        batchEarliest =
          batchEarliest === undefined || entry.blockNumber < batchEarliest
            ? entry.blockNumber
            : batchEarliest
        batchLatest =
          batchLatest === undefined || entry.blockNumber > batchLatest
            ? entry.blockNumber
            : batchLatest
      }
      if (dirty) {
        const combined = Buffer.concat(payloadChunks)
        fs.writeSync(fd, combined, 0, combined.length, payloadStart)
        fs.writeSync(fd, hdr, 0, hdr.length, 0)
      }
    } finally {
      fs.closeSync(fd)
    }
  }
  if (batchEarliest === undefined || batchLatest === undefined) return
  const prev = readBalTailManifest(pivotRootDir)
  const earliest =
    prev === undefined || batchEarliest < prev.earliest ? batchEarliest : prev.earliest
  const latest = prev === undefined || batchLatest > prev.latest ? batchLatest : prev.latest
  writeManifest(pivotRootDir, earliest, latest)
}

export function appendBalTailBundle(
  pivotRootDir: string,
  blockNumber: bigint,
  headerRlp: Uint8Array,
  balRlp: Uint8Array,
): void {
  if (!writeBalTailSlot(pivotRootDir, blockNumber, headerRlp, balRlp)) return
  const prev = readBalTailManifest(pivotRootDir)
  const earliest = prev?.earliest ?? blockNumber
  const latest = prev === undefined || blockNumber > prev.latest ? blockNumber : prev.latest
  const newEarliest = blockNumber < earliest ? blockNumber : earliest
  writeManifest(pivotRootDir, newEarliest, latest)
}

function clearBalTailSlot(pivotRootDir: string, blockNumber: bigint): void {
  const segStart = segmentStart(blockNumber)
  const index = Number(blockNumber - segStart)
  if (index < 0 || index >= 256) return
  const segPath = path.join(balTailDir(pivotRootDir), `seg-${segStart.toString()}.bin`)
  if (!fs.existsSync(segPath)) return
  try {
    const { fd, slots } = ensureSegmentFile(segPath)
    try {
      if (slots[index]!.headerLen === 0) {
        return
      }
      const slotOff = 4 + index * 12
      fs.writeSync(fd, Buffer.alloc(12, 0), 0, 12, slotOff)
    } finally {
      fs.closeSync(fd)
    }
  } catch {
    // best effort
  }
}

/**
 * Drop oldest BAL tail blocks so at most `maxBlocks` contiguous entries remain
 * (never pruning below `minEarliest` when set — active pivot + 1).
 */
export function enforceBalTailRetention(
  pivotRootDir: string,
  opts: { maxBlocks?: bigint; minEarliest?: bigint } = {},
): void {
  const maxBlocks = opts.maxBlocks ?? MAX_SERVABLE_BAL_TAIL_BLOCKS
  const man = readBalTailManifest(pivotRootDir)
  if (man === undefined) return
  const span = man.latest - man.earliest + 1n
  if (span <= maxBlocks) return
  let floor = man.latest - maxBlocks + 1n
  if (opts.minEarliest !== undefined && floor < opts.minEarliest) {
    floor = opts.minEarliest
  }
  if (floor <= man.earliest) return
  for (let b = man.earliest; b < floor; b += 1n) {
    clearBalTailSlot(pivotRootDir, b)
  }
  let newEarliest = floor
  while (newEarliest <= man.latest && readBalTailBundle(pivotRootDir, newEarliest) === undefined) {
    newEarliest += 1n
  }
  if (newEarliest > man.latest) {
    const tailDir = balTailDir(pivotRootDir)
    if (fs.existsSync(tailDir)) {
      for (const name of fs.readdirSync(tailDir)) {
        if (name.startsWith('seg-')) {
          fs.rmSync(path.join(tailDir, name), { force: true })
        }
      }
      fs.rmSync(path.join(tailDir, 'manifest.bin'), { force: true })
    }
    return
  }
  writeManifest(pivotRootDir, newEarliest, man.latest)
  const tailDir = balTailDir(pivotRootDir)
  if (fs.existsSync(tailDir)) {
    for (const name of fs.readdirSync(tailDir)) {
      if (!name.startsWith('seg-')) continue
      const num = BigInt(name.replace('seg-', '').replace('.bin', ''))
      if (num + BAL_SEGMENT_BLOCKS - 1n < newEarliest) {
        fs.rmSync(path.join(tailDir, name), { force: true })
      }
    }
  }
}

/** Copy a contiguous BAL tail block range between pivot roots (WP-11b shadow prep). */
export function copyBalTailRange(
  sourcePivotRootDir: string,
  destPivotRootDir: string,
  fromBlock: bigint,
  throughBlock: bigint,
): number {
  if (throughBlock < fromBlock) return 0
  const batch: BalTailBatchEntry[] = []
  for (let b = fromBlock; b <= throughBlock; b += 1n) {
    const bundle = readBalTailBundle(sourcePivotRootDir, b)
    if (bundle === undefined) continue
    batch.push({
      blockNumber: b,
      headerRlp: bundle.headerRlp,
      balRlp: bundle.balRlp,
    })
  }
  if (batch.length > 0) {
    appendBalTailBatch(destPivotRootDir, batch)
  }
  return batch.length
}

export function readBalTailBundle(
  pivotRootDir: string,
  blockNumber: bigint,
): { headerRlp: Uint8Array; balRlp: Uint8Array } | undefined {
  const segStart = segmentStart(blockNumber)
  const index = Number(blockNumber - segStart)
  if (index < 0 || index >= 256) return undefined
  const segPath = path.join(balTailDir(pivotRootDir), `seg-${segStart.toString()}.bin`)
  if (!fs.existsSync(segPath)) return undefined
  let fd: number | undefined
  try {
    const headerBytes = 4 + 256 * 12
    const hdr = Buffer.alloc(headerBytes)
    fd = fs.openSync(segPath, 'r')
    fs.readSync(fd, hdr, 0, headerBytes, 0)
    if (!hdr.subarray(0, 4).equals(SEGMENT_MAGIC)) return undefined
    const off = 4 + index * 12
    const payloadOff = hdr.readUInt32BE(off)
    const headerLen = hdr.readUInt32BE(off + 4)
    const balLen = hdr.readUInt32BE(off + 8)
    if (headerLen === 0 || balLen === 0) return undefined
    const total = headerLen + balLen
    const buf = Buffer.alloc(total)
    fs.readSync(fd, buf, 0, total, payloadOff)
    return {
      headerRlp: new Uint8Array(buf.subarray(0, headerLen)),
      balRlp: new Uint8Array(buf.subarray(headerLen, total)),
    }
  } catch {
    return undefined
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd)
      } catch {
        // ignore close failure
      }
    }
  }
}
