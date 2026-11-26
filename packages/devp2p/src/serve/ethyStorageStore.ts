import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

export type EthyStorageEntry = {
  accountHash: Uint8Array
  storageRoot: Uint8Array
  chunkBlockNumber: bigint
  slotsSlab64B: Uint8Array
  complete: boolean
  proofNodes: Uint8Array[]
}

const slotHashAt = (slab: Uint8Array, index: number): Uint8Array => {
  const off = index * 64
  return slab.subarray(off, off + 32)
}

const compareHash = (a: Uint8Array, b: Uint8Array): number => {
  for (let i = 0; i < 32; i++) {
    if (a[i]! < b[i]!) return -1
    if (a[i]! > b[i]!) return 1
  }
  return 0
}

export class EthyStorageStore {
  private readonly _entries = new Map<string, EthyStorageEntry>()
  private _storageDir: string | undefined

  setStorageDir(dir: string | undefined): void {
    this._storageDir = dir
  }

  storageDir(): string | undefined {
    return this._storageDir
  }

  put(entry: EthyStorageEntry): void {
    if (entry.accountHash.length !== 32 || entry.storageRoot.length !== 32) return
    if (entry.slotsSlab64B.byteLength % 64 !== 0) {
      throw new Error('EthyStorageStore.put: slotsSlab64B length must be a multiple of 64 bytes')
    }
    const key = bytesToUnprefixedHex(entry.accountHash)
    const ownedSlab = new Uint8Array(entry.slotsSlab64B.byteLength)
    ownedSlab.set(entry.slotsSlab64B)
    this._entries.set(key, {
      ...entry,
      slotsSlab64B: ownedSlab,
      proofNodes: entry.proofNodes.map((p) => {
        const c = new Uint8Array(p.byteLength)
        c.set(p)
        return c
      }),
    })
  }

  get(accountHash: Uint8Array): EthyStorageEntry | undefined {
    if (accountHash.length !== 32) return undefined
    return this._entries.get(bytesToUnprefixedHex(accountHash))
  }

  sliceKind1(
    accountHash: Uint8Array,
    storageRoot: Uint8Array,
    originSlotHash: Uint8Array,
    maxBytes: number,
  ):
    | {
        storageRoot: Uint8Array
        chunkBlockNumber: bigint
        originSlotHash: Uint8Array
        lastSlotHash: Uint8Array
        hasRight: number
        slotsSlab64B: Uint8Array
        proofNodes: Uint8Array[]
      }
    | undefined {
    if (accountHash.length !== 32 || storageRoot.length !== 32 || originSlotHash.length !== 32) {
      return undefined
    }
    const rec = this.get(accountHash)
    if (rec === undefined) return undefined
    if (!equalsBytes(rec.storageRoot, storageRoot)) return undefined
    const rowCount = Math.floor(rec.slotsSlab64B.length / 64)
    if (rowCount === 0) return undefined

    const firstSlot = slotHashAt(rec.slotsSlab64B, 0)
    const lastSlot = slotHashAt(rec.slotsSlab64B, rowCount - 1)
    const target = originSlotHash
    const zeroTarget = target.every((b) => b === 0)

    let startIdx = 0
    if (!zeroTarget) {
      if (compareHash(target, firstSlot) < 0) {
        startIdx = 0
      } else if (compareHash(target, lastSlot) > 0) {
        if (rec.complete) return undefined
        startIdx = rowCount - 1
      } else {
        let found = false
        for (let i = 0; i < rowCount; i++) {
          const h = slotHashAt(rec.slotsSlab64B, i)
          if (compareHash(h, target) >= 0) {
            startIdx = i
            found = true
            break
          }
        }
        if (!found) return undefined
      }
    }

    let endIdx = startIdx
    let bytes = 0
    while (endIdx < rowCount) {
      if (bytes + 64 > maxBytes) break
      bytes += 64
      endIdx++
    }
    if (endIdx <= startIdx) return undefined

    const slice = rec.slotsSlab64B.subarray(startIdx * 64, endIdx * 64)
    const lastSlotHash = slotHashAt(slice, Math.floor(slice.length / 64) - 1)
    const hasRight = !rec.complete || endIdx < rowCount ? 1 : 0
    const isCompleteWholeTrie = rec.complete && startIdx === 0 && endIdx === rowCount
    const proofNodes = isCompleteWholeTrie ? [] : rec.proofNodes

    return {
      storageRoot: rec.storageRoot,
      chunkBlockNumber: rec.chunkBlockNumber,
      originSlotHash: slotHashAt(slice, 0),
      lastSlotHash,
      hasRight,
      slotsSlab64B: new Uint8Array(slice),
      proofNodes,
    }
  }

  entriesKind2(
    pairs: Array<{ accountHash: Uint8Array; storageRoot: Uint8Array }>,
    maxBytes: number,
  ): Array<{ accountHash: Uint8Array; storageRoot: Uint8Array; slotsSlab64B: Uint8Array }> {
    const out: Array<{
      accountHash: Uint8Array
      storageRoot: Uint8Array
      slotsSlab64B: Uint8Array
    }> = []
    let bytes = 0
    for (const p of pairs.slice(0, 64)) {
      const rec = this.get(p.accountHash)
      if (rec === undefined || !rec.complete) continue
      if (!equalsBytes(rec.storageRoot, p.storageRoot)) continue
      if (bytes + rec.slotsSlab64B.length > maxBytes) continue
      out.push({
        accountHash: p.accountHash,
        storageRoot: p.storageRoot,
        slotsSlab64B: rec.slotsSlab64B,
      })
      bytes += rec.slotsSlab64B.length
    }
    return out
  }
}
