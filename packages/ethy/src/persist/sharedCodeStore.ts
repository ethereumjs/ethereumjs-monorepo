import fs from 'node:fs'
import path from 'node:path'

import { bytesToUnprefixedHex } from '@ethereumjs/util'

const MAX_MEM_CODES = 512

export type SharedCodeStoreOpts = {
  /** `<networkDir>/code/` */
  codeDir: string
  /** Legacy pivot shard lookup (Ethy `SnapPivotStore.lookupCodeByHash`). */
  legacyLookup?: (codeHash: Uint8Array) => Uint8Array | undefined
}

export class SharedCodeStore {
  private readonly _codeDir: string
  private readonly _legacy?: (codeHash: Uint8Array) => Uint8Array | undefined
  private readonly _mem = new Map<string, Uint8Array>()

  constructor(opts: SharedCodeStoreOpts) {
    this._codeDir = opts.codeDir
    this._legacy = opts.legacyLookup
    fs.mkdirSync(this._codeDir, { recursive: true })
  }

  private _cachePut(hex: string, code: Uint8Array): void {
    if (this._mem.has(hex)) {
      this._mem.delete(hex)
    }
    this._mem.set(hex, code)
    while (this._mem.size > MAX_MEM_CODES) {
      const oldest = this._mem.keys().next().value as string | undefined
      if (oldest === undefined) break
      this._mem.delete(oldest)
    }
  }

  put(codeHash: Uint8Array, code: Uint8Array): void {
    if (codeHash.length !== 32) return
    const hex = bytesToUnprefixedHex(codeHash)
    const rel = `${hex.slice(0, 2)}/${hex.slice(2)}`
    const target = path.join(this._codeDir, rel)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    const tmp = `${target}.tmp`
    fs.writeFileSync(tmp, code)
    fs.renameSync(tmp, target)
    this._cachePut(hex, new Uint8Array(code))
  }

  get(codeHash: Uint8Array): Uint8Array | undefined {
    if (codeHash.length !== 32) return undefined
    const hex = bytesToUnprefixedHex(codeHash)
    const hit = this._mem.get(hex)
    if (hit !== undefined) {
      this._cachePut(hex, hit)
      return hit
    }
    const rel = `${hex.slice(0, 2)}/${hex.slice(2)}`
    const target = path.join(this._codeDir, rel)
    if (fs.existsSync(target)) {
      const buf = new Uint8Array(fs.readFileSync(target))
      this._cachePut(hex, buf)
      return buf
    }
    const legacy = this._legacy?.(codeHash)
    if (legacy !== undefined) {
      this.put(codeHash, legacy)
      return legacy
    }
    return undefined
  }

  /** Adapter for {@link FlatStateManager} `coldCodeLookup`. */
  coldCodeLookup(): (codeHash: Uint8Array) => Uint8Array | undefined {
    return (h) => this.get(h)
  }
}
