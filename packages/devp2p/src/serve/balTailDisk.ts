import fs from 'node:fs'
import path from 'node:path'

const MANIFEST_MAGIC = Buffer.from('BALT')
const SEGMENT_MAGIC = Buffer.from([0x42, 0x54, 0x53, 0x47])
const MANIFEST_VERSION = 1
const BAL_SEGMENT_BLOCKS = 256n

export type BalTailManifest = {
  earliest: bigint
  latest: bigint
}

function balTailDir(pivotRootDir: string): string {
  return path.join(pivotRootDir, 'bal-tail')
}

export function readBalTailManifest(pivotRootDir: string): BalTailManifest | undefined {
  const file = path.join(balTailDir(pivotRootDir), 'manifest.bin')
  if (!fs.existsSync(file)) return undefined
  try {
    const raw = fs.readFileSync(file)
    if (raw.length < 28) return undefined
    if (!raw.subarray(0, 4).equals(MANIFEST_MAGIC)) return undefined
    if (raw.readUInt16BE(4) !== MANIFEST_VERSION) return undefined
    const earliest = raw.readBigUInt64BE(12)
    const latest = raw.readBigUInt64BE(20)
    return { earliest, latest }
  } catch {
    return undefined
  }
}

function segmentStart(block: bigint): bigint {
  return block - (block % BAL_SEGMENT_BLOCKS)
}

function slotPopulated(segPath: string, index: number): boolean {
  let fd: number | undefined
  try {
    const hdr = Buffer.alloc(12)
    const off = 4 + index * 12
    fd = fs.openSync(segPath, 'r')
    fs.readSync(fd, hdr, 0, 12, off)
    return hdr.readUInt32BE(4) > 0 && hdr.readUInt32BE(8) > 0
  } catch {
    return false
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

export function balBundleExistsOnDisk(pivotRootDir: string, blockNumber: bigint): boolean {
  const healFile = path.join(pivotRootDir, 'heal', `${blockNumber.toString()}.bundle.rlp`)
  if (fs.existsSync(healFile)) return true
  const segStart = segmentStart(blockNumber)
  const index = Number(blockNumber - segStart)
  if (index < 0 || index >= 256) return false
  const segPath = path.join(balTailDir(pivotRootDir), `seg-${segStart.toString()}.bin`)
  if (!fs.existsSync(segPath)) return false
  return slotPopulated(segPath, index)
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
    if (!hdr.subarray(0, 4).equals(SEGMENT_MAGIC)) {
      return undefined
    }
    const slotOff = 4 + index * 12
    const payloadOff = hdr.readUInt32BE(slotOff)
    const headerLen = hdr.readUInt32BE(slotOff + 4)
    const balLen = hdr.readUInt32BE(slotOff + 8)
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

/** Contiguous BAL suffix on disk (bal-tail manifest + legacy heal). */
export function contiguousBalTailWindow(
  pivotRootDir: string,
): { earliest: bigint; latest: bigint } | undefined {
  const man = readBalTailManifest(pivotRootDir)
  let latest: bigint | undefined
  if (man !== undefined) latest = man.latest
  if (latest === undefined) {
    const healDir = path.join(pivotRootDir, 'heal')
    if (!fs.existsSync(healDir)) return undefined
    for (const name of fs.readdirSync(healDir)) {
      if (!name.endsWith('.bundle.rlp')) continue
      const n = BigInt(name.replace(/\.bundle\.rlp$/, ''))
      if (latest === undefined || n > latest) latest = n
    }
  }
  if (latest === undefined) return undefined
  if (!balBundleExistsOnDisk(pivotRootDir, latest)) return undefined
  let earliest = latest
  for (let b = latest; b > 0n; b -= 1n) {
    if (!balBundleExistsOnDisk(pivotRootDir, b)) break
    earliest = b
  }
  return { earliest, latest }
}
