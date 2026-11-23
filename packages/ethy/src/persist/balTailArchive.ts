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
  return { fd, slots, payloadStart: stat.size }
}

export function appendBalTailBundle(
  pivotRootDir: string,
  blockNumber: bigint,
  headerRlp: Uint8Array,
  balRlp: Uint8Array,
): void {
  const segStart = segmentStart(blockNumber)
  const index = Number(blockNumber - segStart)
  if (index < 0 || index >= 256) return
  const segPath = path.join(balTailDir(pivotRootDir), `seg-${segStart.toString()}.bin`)
  const { fd, slots, payloadStart } = ensureSegmentFile(segPath)
  try {
    if (slots[index]!.headerLen > 0) {
      return
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
  } finally {
    fs.closeSync(fd)
  }
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
  let copied = 0
  for (let b = fromBlock; b <= throughBlock; b += 1n) {
    const bundle = readBalTailBundle(sourcePivotRootDir, b)
    if (bundle === undefined) continue
    appendBalTailBundle(destPivotRootDir, b, bundle.headerRlp, bundle.balRlp)
    copied += 1
  }
  return copied
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
