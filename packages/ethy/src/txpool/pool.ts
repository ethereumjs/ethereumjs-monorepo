import type { ChainConfig } from '@ethereumjs/common'
import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { JsonRpcError } from '../rpc/types.ts'
import {
  ETH_NEW_POOLED,
  ETH_TX,
  encodeNewPooledTransactionHashes,
  encodeTransactionsPayload,
  hashFromHex,
} from './gossip.ts'
import { decodeRawTxHex, validateRawTransaction } from './validate.ts'

const POOL_CAP = 256

export type EthyTxPool = {
  submitRawTransactionHex: (hex: string) => Promise<{ result: string } | { error: JsonRpcError }>
  flushToPeers: (
    peerIds: string[],
    sendEth: (peerId: string, code: number, payload: Uint8Array) => void,
  ) => void
}

export function createEthyTxPool(opts: {
  stateManager: FlatStateManager
  chain: ChainConfig
  hardfork: string
  chainId: bigint
  worker?: Devp2pWorkerClient
  getEthPeerIds: () => string[]
  sendEth: (peerId: string, code: number, payload: Uint8Array) => void
}): EthyTxPool {
  const byHash = new Map<string, Uint8Array>()
  const order: string[] = []

  const note = (hash: string, raw: Uint8Array) => {
    if (byHash.has(hash)) return false
    byHash.set(hash, raw)
    order.push(hash)
    while (order.length > POOL_CAP) {
      const old = order.shift()
      if (old !== undefined) byHash.delete(old)
    }
    opts.worker?.notePooledTx(hash, raw)
    return true
  }

  const broadcast = (raw: Uint8Array, hash: string) => {
    const hashBytes = hashFromHex(hash)
    const txPayload = encodeTransactionsPayload(raw)
    const announcePayload = encodeNewPooledTransactionHashes(raw, hashBytes)
    for (const peerId of opts.getEthPeerIds()) {
      opts.sendEth(peerId, ETH_TX, txPayload)
      opts.sendEth(peerId, ETH_NEW_POOLED, announcePayload)
    }
  }

  return {
    async submitRawTransactionHex(hex) {
      const decoded = decodeRawTxHex(hex)
      if ('error' in decoded) return decoded
      const valid = await validateRawTransaction(
        decoded.raw,
        opts.stateManager,
        opts.chain,
        opts.hardfork,
        opts.chainId,
      )
      if ('error' in valid) return valid
      const isNew = note(valid.hash, valid.raw)
      if (isNew) {
        broadcast(valid.raw, valid.hash)
      }
      return { result: valid.hash.startsWith('0x') ? valid.hash : `0x${valid.hash}` }
    },
    flushToPeers(peerIds, sendEth) {
      for (const hash of order) {
        const raw = byHash.get(hash)
        if (raw === undefined) continue
        const hashBytes = hashFromHex(hash)
        const txPayload = encodeTransactionsPayload(raw)
        const announcePayload = encodeNewPooledTransactionHashes(raw, hashBytes)
        for (const peerId of peerIds) {
          sendEth(peerId, ETH_TX, txPayload)
          sendEth(peerId, ETH_NEW_POOLED, announcePayload)
        }
      }
    },
  }
}

/** Decode eth/68 announce for tests. */
export function decodeNewPooledPayload(payload: Uint8Array): unknown {
  return RLP.decode(payload)
}
