import * as fs from 'node:fs'
import * as path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, intToUnpaddedBytes } from '@ethereumjs/util'

/** Spec §5.3 magic (`ETHY` + `PRF1`). */
export const ETHY_PROOF_SIDECAR_MAGIC = new Uint8Array([
  0x45, 0x54, 0x48, 0x59, 0x50, 0x52, 0x46, 0x31,
])

export type ChunkProofFields = {
  slabByteOffset: number
  slabByteLength: number
  originHash: Uint8Array
  lastHash: Uint8Array
  hasRight: number
  chunkStateRoot: Uint8Array
  chunkBlockNumber: bigint
  proofNodes: Uint8Array[]
}

export function proofSidecarPathForJournal(journalPath: string): string {
  if (journalPath.endsWith('.seg')) {
    return `${journalPath}.proof.idx`
  }
  if (journalPath.endsWith('.bin')) {
    return journalPath.replace(/\.bin$/, '.proof.idx')
  }
  return `${journalPath}.proof.idx`
}

function encodeProofRecord(fields: ChunkProofFields): Uint8Array {
  const body = RLP.encode([
    intToUnpaddedBytes(fields.slabByteOffset),
    intToUnpaddedBytes(fields.slabByteLength),
    fields.originHash,
    fields.lastHash,
    intToUnpaddedBytes(fields.hasRight),
    fields.chunkStateRoot,
    bigIntToUnpaddedBytes(fields.chunkBlockNumber),
    fields.proofNodes,
  ] as never)
  const len = new Uint8Array(4)
  new DataView(len.buffer).setUint32(0, body.length, false)
  const out = new Uint8Array(4 + body.length)
  out.set(len, 0)
  out.set(body, 4)
  return out
}

export function appendProofRecordSync(filePath: string, fields: ChunkProofFields): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  const needMagic = !fs.existsSync(filePath) || fs.statSync(filePath).size === 0
  const fd = fs.openSync(filePath, 'a')
  try {
    if (needMagic) {
      fs.writeSync(fd, ETHY_PROOF_SIDECAR_MAGIC)
    }
    fs.writeSync(fd, encodeProofRecord(fields))
  } finally {
    fs.closeSync(fd)
  }
}

export type ParsedProofRecord = ChunkProofFields

function readProofMagicOk(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false
  const stat = fs.statSync(filePath)
  if (stat.size < ETHY_PROOF_SIDECAR_MAGIC.length) return false
  const head = Buffer.alloc(ETHY_PROOF_SIDECAR_MAGIC.length)
  const fd = fs.openSync(filePath, 'r')
  try {
    fs.readSync(fd, head, 0, head.length, 0)
  } finally {
    fs.closeSync(fd)
  }
  for (let i = 0; i < ETHY_PROOF_SIDECAR_MAGIC.length; i++) {
    if (head[i] !== ETHY_PROOF_SIDECAR_MAGIC[i]) return false
  }
  return true
}

/** Parse uint fields from unpadded RLP scalars (full big-endian). */
function scalarUintFromRlp(v: unknown): number {
  if (!(v instanceof Uint8Array) || v.length === 0) return 0
  let n = 0
  for (const b of v) {
    n = n * 256 + b
  }
  return n
}

function scalarBigIntFromRlp(v: unknown): bigint {
  if (!(v instanceof Uint8Array) || v.length === 0) return 0n
  let n = 0n
  for (const b of v) {
    n = (n << 8n) | BigInt(b)
  }
  return n
}

function decodeProofRecordBodyFixed(body: Uint8Array): ParsedProofRecord | undefined {
  let decoded: unknown
  try {
    decoded = RLP.decode(body)
  } catch {
    return undefined
  }
  if (!Array.isArray(decoded) || decoded.length < 8) return undefined
  const origin = decoded[2]
  const last = decoded[3]
  const root = decoded[5]
  if (
    !(origin instanceof Uint8Array) ||
    !(last instanceof Uint8Array) ||
    !(root instanceof Uint8Array)
  ) {
    return undefined
  }
  const proofRaw = decoded[7]
  if (!Array.isArray(proofRaw)) return undefined
  const proofNodes: Uint8Array[] = []
  for (const node of proofRaw) {
    if (!(node instanceof Uint8Array)) return undefined
    proofNodes.push(node)
  }
  return {
    slabByteOffset: scalarUintFromRlp(decoded[0]),
    slabByteLength: scalarUintFromRlp(decoded[1]),
    originHash: origin,
    lastHash: last,
    hasRight: scalarUintFromRlp(decoded[4]),
    chunkStateRoot: root,
    chunkBlockNumber: scalarBigIntFromRlp(decoded[6]),
    proofNodes,
  }
}

export function readAllProofRecords(filePath: string): ParsedProofRecord[] {
  if (!readProofMagicOk(filePath)) return []
  const stat = fs.statSync(filePath)
  const fd = fs.openSync(filePath, 'r')
  const buf = Buffer.alloc(stat.size - ETHY_PROOF_SIDECAR_MAGIC.length)
  try {
    fs.readSync(fd, buf, 0, buf.length, ETHY_PROOF_SIDECAR_MAGIC.length)
  } finally {
    fs.closeSync(fd)
  }
  const out: ParsedProofRecord[] = []
  let offset = 0
  while (offset + 4 <= buf.length) {
    const recordLen = buf.readUInt32BE(offset)
    offset += 4
    if (offset + recordLen > buf.length) break
    const rec = decodeProofRecordBodyFixed(new Uint8Array(buf.subarray(offset, offset + recordLen)))
    if (rec !== undefined) out.push(rec)
    offset += recordLen
  }
  return out
}

export function readSlabSlice(
  journalPath: string,
  byteOffset: number,
  byteLength: number,
): Uint8Array {
  const fd = fs.openSync(journalPath, 'r')
  const out = Buffer.alloc(byteLength)
  try {
    fs.readSync(fd, out, 0, byteLength, byteOffset)
  } finally {
    fs.closeSync(fd)
  }
  return new Uint8Array(out)
}
