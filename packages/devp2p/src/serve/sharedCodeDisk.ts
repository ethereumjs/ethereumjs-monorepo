import * as fs from 'node:fs'

import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

import { SERVE_SOFT_RESPONSE_BYTES } from './serveGovernor.ts'

const MAX_HOT = 64
const MAX_READ_QUEUE = 8

export class SharedCodeDisk {
  private readonly _mem = new Map<string, Uint8Array>()
  private readonly _order: string[] = []
  private _diskDir: string | undefined
  private _readInflight = 0

  setCodeDir(dir: string | undefined): void {
    this._diskDir = dir
  }

  put(codeHash: Uint8Array, code: Uint8Array): void {
    const key = bytesToUnprefixedHex(codeHash)
    const owned = new Uint8Array(code.byteLength)
    owned.set(code)
    if (this._mem.has(key)) {
      this._mem.set(key, owned)
      this._touch(key)
      return
    }
    this._mem.set(key, owned)
    this._order.push(key)
    while (this._order.length > MAX_HOT) {
      const evict = this._order.shift()
      if (evict !== undefined) this._mem.delete(evict)
    }
  }

  private _touch(key: string): void {
    const idx = this._order.indexOf(key)
    if (idx >= 0) {
      this._order.splice(idx, 1)
      this._order.push(key)
    }
  }

  get(hash: Uint8Array): Uint8Array | undefined {
    const key = bytesToUnprefixedHex(hash)
    const hit = this._mem.get(key)
    if (hit !== undefined) {
      this._touch(key)
      return hit
    }
    return this._readFromDisk(hash)
  }

  getMany(
    hashes: readonly Uint8Array[],
    budgetBytes: number,
  ): { codes: Uint8Array[]; bytes: number } {
    const cap = Math.min(budgetBytes, SERVE_SOFT_RESPONSE_BYTES)
    const codes: Uint8Array[] = []
    let bytes = 0
    for (const h of hashes) {
      const code = this.get(h)
      if (code === undefined) continue
      if (bytes + code.length > cap) break
      codes.push(code)
      bytes += code.length
    }
    return { codes, bytes }
  }

  private _readFromDisk(codeHash: Uint8Array): Uint8Array | undefined {
    if (this._diskDir === undefined) return undefined
    if (this._readInflight >= MAX_READ_QUEUE) return undefined
    const hex = bytesToUnprefixedHex(codeHash)
    const path = `${this._diskDir}/${hex.slice(0, 2)}/${hex.slice(2)}`
    this._readInflight++
    try {
      if (!fs.existsSync(path)) return undefined
      const buf = new Uint8Array(fs.readFileSync(path))
      this.put(codeHash, buf)
      return buf
    } catch {
      return undefined
    } finally {
      this._readInflight--
    }
  }

  equalsHash(a: Uint8Array, b: Uint8Array): boolean {
    return equalsBytes(a, b)
  }
}
