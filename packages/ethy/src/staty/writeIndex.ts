import { type BALInput, bytesToUnprefixedHex, decodeBALToBinary } from '@ethereumjs/util'

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

  private readonly _accountHashHex: (address20: Uint8Array) => string

  constructor(accountHashHex: (address20: Uint8Array) => string = (a) => bytesToUnprefixedHex(a)) {
    this._accountHashHex = accountHashHex
  }

  ingestVerifiedBal(blockNumber: number, bal: BALInput): void {
    const compact = decodeBALToBinary(bal)
    for (const row of compact) {
      const accountHashHex = this._accountHashHex(row.address)
      let acc = this._accounts.get(accountHashHex) ?? {
        lastBalanceBlock: 0,
        lastNonceBlock: 0,
        lastCodeBlock: 0,
        lastDeletedBlock: 0,
      }
      if (row.balance !== undefined) acc = { ...acc, lastBalanceBlock: blockNumber }
      if (row.nonce !== undefined) acc = { ...acc, lastNonceBlock: blockNumber }
      if (row.code !== undefined) acc = { ...acc, lastCodeBlock: blockNumber }
      this._accounts.set(accountHashHex, acc)
      for (const [slot, _val] of row.storageChanges) {
        this.noteSlotWrite(accountHashHex, bytesToUnprefixedHex(slot), blockNumber)
      }
    }
  }

  accountIndex(accountHashHex: string): StatyAccountIndex | undefined {
    return this._accounts.get(accountHashHex)
  }

  lastSlotWriteBlock(accountHashHex: string, slotHashHex: string): number | undefined {
    return this._slots.get(`${accountHashHex}:${slotHashHex}`)
  }

  /** Records a verified BAL slot write (also used from tests). */
  noteSlotWrite(accountHashHex: string, slotHashHex: string, blockNumber: number): void {
    this._slots.set(`${accountHashHex}:${slotHashHex}`, blockNumber)
  }

  encodeCheckpoint(): Uint8Array {
    const parts: Uint8Array[] = []
    parts.push(CHECKPOINT_MAGIC)
    parts.push(new Uint8Array([CHECKPOINT_VERSION]))
    const accCount = new Uint8Array(4)
    new DataView(accCount.buffer).setUint32(0, this._accounts.size)
    parts.push(accCount)
    for (const [key, idx] of this._accounts) {
      const keyBytes = new TextEncoder().encode(key)
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
      data.length < 6 ||
      data[0] !== 0x53 ||
      data[1] !== 0x54 ||
      data[2] !== 0x59 ||
      data[3] !== 0x57
    ) {
      return false
    }
    if (data[4] !== CHECKPOINT_VERSION) return false
    return true
  }
}
