import { bytesToUnprefixedHex } from '@ethereumjs/util'

/** One servable self-proving account chunk (spec §6 `0x04`). */
export type EthyAccountChunkRecord = {
  bucketIndex: number
  originHash: Uint8Array
  lastHash: Uint8Array
  hasRight: number
  chunkStateRoot: Uint8Array
  chunkBlockNumber: bigint
  binaryAccountsSlab: Uint8Array
  proofNodes: Uint8Array[]
}

export type EthyChunkManifestEntry = {
  originHash: Uint8Array
  lastHash: Uint8Array
  hasRight: number
  chunkStateRoot: Uint8Array
  chunkBlockNumber: bigint
  accountCount: number
  slabByteLength: number
}

function chunkKey(bucketIndex: number, originHash: Uint8Array): string {
  return `${bucketIndex}:${bytesToUnprefixedHex(originHash)}`
}

/**
 * In-worker ETHY/0 account chunk catalog (memory; optional disk sidecar in WP-06c).
 */
export class EthyChunkStore {
  private readonly _byKey = new Map<string, EthyAccountChunkRecord>()

  put(record: EthyAccountChunkRecord): void {
    const key = chunkKey(record.bucketIndex, record.originHash)
    this._byKey.set(key, record)
  }

  get(bucketIndex: number, originHash: Uint8Array): EthyAccountChunkRecord | undefined {
    return this._byKey.get(chunkKey(bucketIndex, originHash))
  }

  manifestForBucket(bucketIndex: number): EthyChunkManifestEntry[] {
    const prefix = `${bucketIndex}:`
    const out: EthyChunkManifestEntry[] = []
    for (const [key, rec] of this._byKey) {
      if (!key.startsWith(prefix)) continue
      const accountCount =
        rec.binaryAccountsSlab.length === 0 ? 0 : rec.binaryAccountsSlab.length / 136
      out.push({
        originHash: rec.originHash,
        lastHash: rec.lastHash,
        hasRight: rec.hasRight,
        chunkStateRoot: rec.chunkStateRoot,
        chunkBlockNumber: rec.chunkBlockNumber,
        accountCount,
        slabByteLength: rec.binaryAccountsSlab.length,
      })
    }
    out.sort((a, b) =>
      bytesToUnprefixedHex(a.originHash).localeCompare(bytesToUnprefixedHex(b.originHash)),
    )
    return out
  }
}
