import { bytesToUnprefixedHex } from '@ethereumjs/util'

/** Complete block payload the rolling-window eth server can answer from. */
export interface ServableBlockBundle {
  number: bigint
  hash: Uint8Array
  headerRlp: Uint8Array
  bodyRlp: Uint8Array
  /** RLP list of bloom-free receipts (eth/69 shape). */
  receiptsEth69Rlp: Uint8Array
  /** Optional RLP-encoded EIP-7928 BAL (eth/71). */
  balRlp?: Uint8Array
}

export type ContiguousBlockRange = {
  earliestBlock: bigint
  latestBlock: bigint
  latestBlockHash: Uint8Array
}

function copyBytes(b: Uint8Array): Uint8Array {
  const c = new Uint8Array(b.byteLength)
  c.set(b)
  return c
}

/**
 * Bounded in-memory store of complete blocks for honest eth/69+ rolling-window serving.
 */
export class RollingBlockStore {
  private readonly _maxBlocks: number
  private readonly _byNumber = new Map<bigint, ServableBlockBundle>()
  private readonly _byHash = new Map<string, ServableBlockBundle>()

  constructor(maxBlocks = 64) {
    this._maxBlocks = maxBlocks
  }

  get size(): number {
    return this._byNumber.size
  }

  put(raw: ServableBlockBundle): void {
    if (raw.hash.length !== 32) {
      throw new Error('ServableBlockBundle.hash must be 32 bytes')
    }
    if (raw.headerRlp.length === 0) {
      throw new Error('ServableBlockBundle.headerRlp must be non-empty')
    }
    const block: ServableBlockBundle = {
      number: raw.number,
      hash: copyBytes(raw.hash),
      headerRlp: copyBytes(raw.headerRlp),
      bodyRlp: copyBytes(raw.bodyRlp),
      receiptsEth69Rlp: copyBytes(raw.receiptsEth69Rlp),
      balRlp: raw.balRlp !== undefined ? copyBytes(raw.balRlp) : undefined,
    }
    const hashHex = bytesToUnprefixedHex(block.hash)
    const prev = this._byNumber.get(block.number)
    if (prev !== undefined) {
      this._byHash.delete(bytesToUnprefixedHex(prev.hash))
    }
    this._byNumber.set(block.number, block)
    this._byHash.set(hashHex, block)
    this._evictLowest()
  }

  getByHash(hash: Uint8Array): ServableBlockBundle | undefined {
    return this._byHash.get(bytesToUnprefixedHex(hash))
  }

  getByNumber(n: bigint): ServableBlockBundle | undefined {
    return this._byNumber.get(n)
  }

  /** Gap-free tail from highest block downward. */
  contiguousRange(): ContiguousBlockRange | null {
    if (this._byNumber.size === 0) return null
    let latest = [...this._byNumber.keys()].reduce((a, b) => (a > b ? a : b))
    const top = this._byNumber.get(latest)!
    let earliest = latest
    while (this._byNumber.has(earliest - 1n)) {
      earliest -= 1n
    }
    return {
      earliestBlock: earliest,
      latestBlock: latest,
      latestBlockHash: copyBytes(top.hash),
    }
  }

  private _evictLowest(): void {
    while (this._byNumber.size > this._maxBlocks) {
      let min = [...this._byNumber.keys()].reduce((a, b) => (a < b ? a : b))
      const b = this._byNumber.get(min)!
      this._byNumber.delete(min)
      this._byHash.delete(bytesToUnprefixedHex(b.hash))
    }
  }
}
