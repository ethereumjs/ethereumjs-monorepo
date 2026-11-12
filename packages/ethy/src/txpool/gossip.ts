import { EthMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, bytesToHex, hexToBytes } from '@ethereumjs/util'

/** RLP byte length of a signed tx as encoded in `PooledTransactions` (EIP-5793 `eth/68`). */
export function rlpByteLength(raw: Uint8Array): Uint8Array {
  const byteLen = raw.length > 0 && raw[0]! <= 0x7f ? RLP.encode(raw).length : raw.length
  return bigIntToUnpaddedBytes(BigInt(byteLen))
}

/** Tx type byte for pooled hash announce (0x00 legacy envelope). */
export function txTypeByte(raw: Uint8Array): Uint8Array {
  if (raw.length > 0 && raw[0]! >= 0x01 && raw[0]! <= 0x7f) {
    return new Uint8Array([raw[0]!])
  }
  return new Uint8Array([0x00])
}

/** Wire element for `Transactions (0x02)` / `PooledTransactions (0x0a)` (EIP-2718). */
export function txWireItem(raw: Uint8Array): unknown {
  if (raw.length > 0 && raw[0]! <= 0x7f) {
    return raw
  }
  return RLP.decode(raw)
}

export function encodeTransactionsPayload(raw: Uint8Array): Uint8Array {
  return RLP.encode([txWireItem(raw)] as never)
}

export function encodeNewPooledTransactionHashes(raw: Uint8Array, hash: Uint8Array): Uint8Array {
  const types = txTypeByte(raw)
  const sizes = rlpByteLength(raw)
  return RLP.encode([types, [sizes], [hash]])
}

export const ETH_TX = EthMessageCodes.TX
export const ETH_NEW_POOLED = EthMessageCodes.NEW_POOLED_TRANSACTION_HASHES

export function hashFromHex(hashHex: string): Uint8Array {
  const h = hashHex.startsWith('0x') ? hashHex : `0x${hashHex}`
  return hexToBytes(h as `0x${string}`)
}

export function unprefixedHash(hexHash: string): string {
  return bytesToHex(hashFromHex(hexHash)).replace(/^0x/i, '')
}
