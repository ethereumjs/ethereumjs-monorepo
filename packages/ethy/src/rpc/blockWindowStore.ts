import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createTxFromBlockBodyData } from '@ethereumjs/tx'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'

import { decodeRpcHeader } from './formatBlock.ts'
import { dataHex } from './quantities.ts'
import type { RpcBundleNote } from './types.ts'

export const RPC_BLOCK_WINDOW = 64

export type StoredRpcBlock = {
  blockNumber: bigint
  blockHash: Uint8Array
  headerRlp: Uint8Array
  bodyRlp?: Uint8Array
  receiptsEth69Rlp?: Uint8Array
  balJson?: BALJSONBlockAccessList
  txHashes: string[]
  rawTxs: Uint8Array[]
}

function normalizeHashKey(hashHex: string): string {
  return hashHex.replace(/^0x/i, '').toLowerCase()
}

export class RpcBlockWindowStore {
  private readonly byNumber = new Map<bigint, StoredRpcBlock>()
  private readonly byHash = new Map<string, StoredRpcBlock>()
  private readonly txByHash = new Map<
    string,
    { blockNumber: bigint; blockHash: Uint8Array; txIndex: number; rawTx: Uint8Array }
  >()

  private readonly chain: ChainConfig
  private readonly hardfork: string

  constructor(chain: ChainConfig, hardfork: string) {
    this.chain = chain
    this.hardfork = hardfork
  }

  earliest(): bigint | undefined {
    let min: bigint | undefined
    for (const n of this.byNumber.keys()) {
      if (min === undefined || n < min) min = n
    }
    return min
  }

  latest(): bigint | undefined {
    let max: bigint | undefined
    for (const n of this.byNumber.keys()) {
      if (max === undefined || n > max) max = n
    }
    return max
  }

  getByNumber(n: bigint): StoredRpcBlock | undefined {
    return this.byNumber.get(n)
  }

  getByHash(hashHex: string): StoredRpcBlock | undefined {
    return this.byHash.get(normalizeHashKey(hashHex))
  }

  getTx(txHash: string): { block: StoredRpcBlock; txIndex: number; rawTx: Uint8Array } | undefined {
    const row = this.txByHash.get(normalizeHashKey(txHash))
    if (row === undefined) return undefined
    const block = this.byNumber.get(row.blockNumber)
    if (block === undefined) return undefined
    return { block, txIndex: row.txIndex, rawTx: row.rawTx }
  }

  noteBundle(input: RpcBundleNote): void {
    const common = new Common({ chain: this.chain, hardfork: this.hardfork })
    let blockHash: Uint8Array
    try {
      const header = decodeRpcHeader(input.headerRlp, this.chain, this.hardfork, input.blockNumber)
      if (header.number !== input.blockNumber) return
      blockHash = header.hash()
    } catch {
      return
    }
    const headerRlp = new Uint8Array(input.headerRlp)
    const bodyRlp = input.bodyRlp !== undefined ? new Uint8Array(input.bodyRlp) : undefined
    const receiptsEth69Rlp =
      input.receiptsEth69Rlp !== undefined ? new Uint8Array(input.receiptsEth69Rlp) : undefined
    const hashKey = Buffer.from(blockHash).toString('hex').toLowerCase()
    const existing = this.byNumber.get(input.blockNumber)
    if (existing !== undefined) {
      this.byHash.delete(Buffer.from(existing.blockHash).toString('hex').toLowerCase())
      for (const h of existing.txHashes) {
        this.txByHash.delete(normalizeHashKey(h))
      }
    }
    const txHashes: string[] = []
    const rawTxs: Uint8Array[] = []
    if (bodyRlp !== undefined) {
      try {
        const body = RLP.decode(bodyRlp) as unknown
        if (Array.isArray(body) && Array.isArray(body[0])) {
          let idx = 0
          for (const raw of body[0]) {
            try {
              const tx = createTxFromBlockBodyData(raw as Uint8Array | Uint8Array[], { common })
              const hashHex = dataHex(tx.hash()).toLowerCase()
              const serialized = tx.serialize()
              txHashes.push(hashHex)
              rawTxs.push(serialized)
              this.txByHash.set(normalizeHashKey(hashHex), {
                blockNumber: input.blockNumber,
                blockHash,
                txIndex: idx,
                rawTx: serialized,
              })
              idx += 1
            } catch {
              // skip malformed tx
            }
          }
        }
      } catch {
        // header-only bundle
      }
    }
    const stored: StoredRpcBlock = {
      blockNumber: input.blockNumber,
      blockHash,
      headerRlp,
      bodyRlp,
      receiptsEth69Rlp,
      balJson: input.balJson,
      txHashes,
      rawTxs,
    }
    this.byNumber.set(input.blockNumber, stored)
    this.byHash.set(hashKey, stored)
    const numbers = [...this.byNumber.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
    while (numbers.length > RPC_BLOCK_WINDOW) {
      const drop = numbers.shift()
      if (drop === undefined) break
      const old = this.byNumber.get(drop)
      this.byNumber.delete(drop)
      if (old !== undefined) {
        const hk = Buffer.from(old.blockHash).toString('hex').toLowerCase()
        this.byHash.delete(hk)
        for (const h of old.txHashes) this.txByHash.delete(normalizeHashKey(h))
      }
    }
  }
}
