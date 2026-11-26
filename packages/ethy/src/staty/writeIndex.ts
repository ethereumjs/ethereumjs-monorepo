import {
  type BALInput,
  bytesToUnprefixedHex,
  decodeBALToBinary,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

export type StatyAccountIndex = {
  lastBalanceBlock: number
  lastNonceBlock: number
  lastCodeBlock: number
  lastDeletedBlock: number
}

const CHECKPOINT_MAGIC = new Uint8Array([0x53, 0x54, 0x59, 0x57])
const CHECKPOINT_VERSION = 1

export class StatyWriteIndex {
  private readonly _accounts = new Map<string, StatyAccountIndex>()
  private readonly _slots = new Map<string, number>()

  private readonly _keccak256: (data: Uint8Array) => Uint8Array

  constructor(keccak256: (data: Uint8Array) => Uint8Array = keccak_256) {
    this._keccak256 = keccak256
  }

  ingestVerifiedBal(blockNumber: number, bal: BALInput): void {
    const compact = decodeBALToBinary(bal)
    for (const row of compact) {
      const accountHashHex = bytesToUnprefixedHex(this._keccak256(row.address))
      const prev = this._accounts.get(accountHashHex) ?? {
        lastBalanceBlock: 0,
        lastNonceBlock: 0,
        lastCodeBlock: 0,
        lastDeletedBlock: 0,
      }
      const next: StatyAccountIndex = {
        lastBalanceBlock:
          row.balance !== undefined
            ? Math.max(prev.lastBalanceBlock, blockNumber)
            : prev.lastBalanceBlock,
        lastNonceBlock:
          row.nonce !== undefined
            ? Math.max(prev.lastNonceBlock, blockNumber)
            : prev.lastNonceBlock,
        lastCodeBlock:
          row.code !== undefined ? Math.max(prev.lastCodeBlock, blockNumber) : prev.lastCodeBlock,
        lastDeletedBlock: prev.lastDeletedBlock,
      }
      this._accounts.set(accountHashHex, next)
      for (const [slot] of row.storageChanges) {
        const slotHashHex = bytesToUnprefixedHex(this._keccak256(setLengthLeft(slot, 32)))
        this.noteSlotWrite(accountHashHex, slotHashHex, blockNumber)
      }
    }
  }

  noteAccountDeleted(accountHashHex: string, blockNumber: number): void {
    const prev = this._accounts.get(accountHashHex) ?? {
      lastBalanceBlock: 0,
      lastNonceBlock: 0,
      lastCodeBlock: 0,
      lastDeletedBlock: 0,
    }
    this._accounts.set(accountHashHex, {
      ...prev,
      lastDeletedBlock: Math.max(prev.lastDeletedBlock, blockNumber),
    })
  }

  accountIndex(accountHashHex: string): StatyAccountIndex | undefined {
    return this._accounts.get(accountHashHex)
  }

  lastSlotWriteBlock(accountHashHex: string, slotHashHex: string): number | undefined {
    return this._slots.get(`${accountHashHex}:${slotHashHex}`)
  }

  /** Records a verified BAL slot write keyed by 32-byte hashed account and slot keys. */
  noteSlotWrite(accountHashHex: string, slotHashHex: string, blockNumber: number): void {
    const sk = `${accountHashHex}:${slotHashHex}`
    const prev = this._slots.get(sk) ?? 0
    if (blockNumber >= prev) {
      this._slots.set(sk, blockNumber)
    }
  }

  encodeCheckpoint(): Uint8Array {
    const enc = new TextEncoder()
    const parts: Uint8Array[] = []
    parts.push(CHECKPOINT_MAGIC)
    parts.push(new Uint8Array([CHECKPOINT_VERSION]))
    const accCount = new Uint8Array(4)
    new DataView(accCount.buffer).setUint32(0, this._accounts.size)
    parts.push(accCount)
    for (const [key, idx] of this._accounts) {
      const keyBytes = enc.encode(key)
      const kb = new Uint8Array(2)
      new DataView(kb.buffer).setUint16(0, keyBytes.length)
      parts.push(kb, keyBytes)
      const buf = new Uint8Array(16)
      const dv = new DataView(buf.buffer)
      dv.setUint32(0, idx.lastBalanceBlock)
      dv.setUint32(4, idx.lastNonceBlock)
      dv.setUint32(8, idx.lastCodeBlock)
      dv.setUint32(12, idx.lastDeletedBlock)
      parts.push(buf)
    }
    const slotCount = new Uint8Array(4)
    new DataView(slotCount.buffer).setUint32(0, this._slots.size)
    parts.push(slotCount)
    for (const [sk, blockNum] of this._slots) {
      const keyBytes = enc.encode(sk)
      const kb = new Uint8Array(2)
      new DataView(kb.buffer).setUint16(0, keyBytes.length)
      const bn = new Uint8Array(4)
      new DataView(bn.buffer).setUint32(0, blockNum)
      parts.push(kb, keyBytes, bn)
    }
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
    let o = 0
    for (const p of parts) {
      out.set(p, o)
      o += p.length
    }
    return out
  }

  loadCheckpoint(data: Uint8Array): boolean {
    if (
      data.length < 9 ||
      data[0] !== 0x53 ||
      data[1] !== 0x54 ||
      data[2] !== 0x59 ||
      data[3] !== 0x57
    ) {
      return false
    }
    if (data[4] !== CHECKPOINT_VERSION) return false
    const dv = new DataView(data.buffer, data.byteOffset, data.byteLength)
    const dec = new TextDecoder()
    let off = 5
    const accCount = dv.getUint32(off)
    off += 4
    const nextAccounts = new Map<string, StatyAccountIndex>()
    for (let i = 0; i < accCount; i++) {
      if (off + 2 > data.length) return false
      const keyLen = dv.getUint16(off)
      off += 2
      if (off + keyLen + 16 > data.length) return false
      const key = dec.decode(data.subarray(off, off + keyLen))
      off += keyLen
      nextAccounts.set(key, {
        lastBalanceBlock: dv.getUint32(off),
        lastNonceBlock: dv.getUint32(off + 4),
        lastCodeBlock: dv.getUint32(off + 8),
        lastDeletedBlock: dv.getUint32(off + 12),
      })
      off += 16
    }
    const nextSlots = new Map<string, number>()
    if (off + 4 <= data.length) {
      const slotCount = dv.getUint32(off)
      off += 4
      for (let i = 0; i < slotCount; i++) {
        if (off + 2 > data.length) return false
        const keyLen = dv.getUint16(off)
        off += 2
        if (off + keyLen + 4 > data.length) return false
        const sk = dec.decode(data.subarray(off, off + keyLen))
        off += keyLen
        nextSlots.set(sk, dv.getUint32(off))
        off += 4
      }
    }
    this._accounts.clear()
    for (const [k, v] of nextAccounts) this._accounts.set(k, v)
    this._slots.clear()
    for (const [k, v] of nextSlots) this._slots.set(k, v)
    return true
  }
}
