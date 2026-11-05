import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, bytesToBigInt } from '@ethereumjs/util'

import type { VerifiedBalBlock } from '../sync/balSync.ts'

export function encodeHealBundleRlp(entry: {
  blockNumber: bigint
  blockHash: Uint8Array
  stateRoot: Uint8Array
  headerRlp: Uint8Array
  balRlp: Uint8Array
}): Uint8Array {
  return RLP.encode([
    bigIntToUnpaddedBytes(entry.blockNumber),
    entry.blockHash,
    entry.stateRoot,
    entry.headerRlp,
    entry.balRlp,
  ]) as Uint8Array
}

export function decodeHealBundleRlp(rlp: Uint8Array): VerifiedBalBlock | undefined {
  if (rlp.length === 0) return undefined
  try {
    const decoded = RLP.decode(rlp) as Uint8Array[]
    if (!Array.isArray(decoded) || decoded.length < 5) return undefined
    const blockNumber = bytesToBigInt(decoded[0]!)
    return {
      blockNumber,
      blockHash: decoded[1]!,
      stateRoot: decoded[2]!,
      headerRlp: decoded[3]!,
      balRlp: decoded[4]!,
    }
  } catch {
    return undefined
  }
}
