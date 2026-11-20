import fs from 'node:fs'
import path from 'node:path'

import { BAL_SEGMENT_BLOCKS, segmentStart } from '../sync/balRetentionPolicy.ts'

const MANIFEST_MAGIC = Buffer.from('BALT')
const SEGMENT_MAGIC = Buffer.from('BTSG')
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
  fs.writeFileSync(path.join(dir, 'manifest.bin'), buf)
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
  if (slots[index]!.headerLen > 0) {
    fs.closeSync(fd)
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
  fs.closeSync(fd)
  const prev = readBalTailManifest(pivotRootDir)
  const earliest = prev?.earliest ?? blockNumber
  const latest = prev === undefined || blockNumber > prev.latest ? blockNumber : prev.latest
  const newEarliest = blockNumber < earliest ? blockNumber : earliest
  writeManifest(pivotRootDir, newEarliest, latest)
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
  try {
    const { fd, slots } = ensureSegmentFile(segPath)
    const s = slots[index]!
    fs.closeSync(fd)
    if (s.headerLen === 0 || s.balLen === 0) return undefined
    const total = s.headerLen + s.balLen
    const buf = Buffer.alloc(total)
    const rfd = fs.openSync(segPath, 'r')
    fs.readSync(rfd, buf, 0, total, s.payloadOff)
    fs.closeSync(rfd)
    return {
      headerRlp: new Uint8Array(buf.subarray(0, s.headerLen)),
      balRlp: new Uint8Array(buf.subarray(s.headerLen, total)),
    }
  } catch {
    return undefined
  }
}
