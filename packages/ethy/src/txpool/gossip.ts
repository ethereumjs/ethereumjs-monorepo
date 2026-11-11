import { EthMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, bytesToHex, hexToBytes } from '@ethereumjs/util'

/** RLP byte length of a signed tx (for eth/68 pooled hash announce). */
export function rlpByteLength(raw: Uint8Array): Uint8Array {
  const encoded = RLP.encode(raw)
  return bigIntToUnpaddedBytes(BigInt(encoded.length))
}

/** Tx type byte for pooled hash announce (0x00 legacy envelope). */
export function txTypeByte(raw: Uint8Array): Uint8Array {
  if (raw.length > 0 && raw[0]! >= 0x01 && raw[0]! <= 0x7f) {
    return new Uint8Array([raw[0]!])
  }
  return new Uint8Array([0x00])
}

export function encodeTransactionsPayload(raw: Uint8Array): Uint8Array {
  return RLP.encode([raw])
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
