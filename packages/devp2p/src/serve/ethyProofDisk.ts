import * as fs from 'node:fs'
import * as path from 'node:path'

import { RLP } from '@ethereumjs/rlp'

const ETHY_PROOF_SIDECAR_MAGIC = new Uint8Array([0x45, 0x54, 0x48, 0x59, 0x50, 0x52, 0x46, 0x31])

export type DiskChunkProofRecord = {
  slabByteOffset: number
  slabByteLength: number
  originHash: Uint8Array
  lastHash: Uint8Array
  hasRight: number
  chunkStateRoot: Uint8Array
  chunkBlockNumber: bigint
  proofNodes: Uint8Array[]
}

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

function decodeProofRecordBody(body: Uint8Array): DiskChunkProofRecord | undefined {
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

export function readProofSidecarRecords(filePath: string): DiskChunkProofRecord[] {
  if (!fs.existsSync(filePath)) return []
  const stat = fs.statSync(filePath)
  if (stat.size < ETHY_PROOF_SIDECAR_MAGIC.length) return []
  const head = Buffer.alloc(ETHY_PROOF_SIDECAR_MAGIC.length)
  const fd = fs.openSync(filePath, 'r')
  try {
    fs.readSync(fd, head, 0, head.length, 0)
  } finally {
    fs.closeSync(fd)
  }
  for (let i = 0; i < ETHY_PROOF_SIDECAR_MAGIC.length; i++) {
    if (head[i] !== ETHY_PROOF_SIDECAR_MAGIC[i]) return []
  }
  const buf = Buffer.alloc(stat.size - ETHY_PROOF_SIDECAR_MAGIC.length)
  const fd2 = fs.openSync(filePath, 'r')
  try {
    fs.readSync(fd2, buf, 0, buf.length, ETHY_PROOF_SIDECAR_MAGIC.length)
  } finally {
    fs.closeSync(fd2)
  }
  const out: DiskChunkProofRecord[] = []
  let offset = 0
  while (offset + 4 <= buf.length) {
    const recordLen = buf.readUInt32BE(offset)
    offset += 4
    if (offset + recordLen > buf.length) break
    const rec = decodeProofRecordBody(new Uint8Array(buf.subarray(offset, offset + recordLen)))
    if (rec !== undefined) out.push(rec)
    offset += recordLen
  }
  return out
}

export function journalPathForProofSidecar(proofPath: string): string {
  if (proofPath.endsWith('.seg.proof.idx')) {
    return proofPath.replace(/\.seg\.proof\.idx$/, '.seg')
  }
  return proofPath.replace(/\.proof\.idx$/, '.bin')
}

export function listProofSidecarsForBucket(accountsDir: string, bucketIndex: number): string[] {
  if (!fs.existsSync(accountsDir)) return []
  const hex = bucketIndex.toString(16)
  const prefix = `${hex}.`
  const out: string[] = []
  for (const name of fs.readdirSync(accountsDir)) {
    if (name === `${hex}.proof.idx`) out.push(path.join(accountsDir, name))
    if (name.startsWith(prefix) && name.endsWith('.seg.proof.idx')) {
      out.push(path.join(accountsDir, name))
    }
  }
  return out.sort((a, b) => {
    const aSeg = a.endsWith('.seg.proof.idx') ? 1 : 0
    const bSeg = b.endsWith('.seg.proof.idx') ? 1 : 0
    return aSeg - bSeg || a.localeCompare(b)
  })
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
