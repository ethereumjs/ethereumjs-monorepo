import { type Block, createBlock } from '@ethereumjs/block'
import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { RpcBlockWindowStore } from '../rpc/blockWindowStore.ts'
import { headBlockNumber } from '../rpc/executionContext.ts'
import { decodeRpcHeader } from '../rpc/formatBlock.ts'
import type { EthySpine } from '../spine/types.ts'

export const SANDBOX_GAS_CAP_NO_HEADER = 50_000_000n

export function gasCapForContext(
  blockWindow: RpcBlockWindowStore,
  chain: ChainConfig,
  hardfork: string,
  requested?: bigint,
): bigint {
  let cap = SANDBOX_GAS_CAP_NO_HEADER
  const latest = blockWindow.latest()
  if (latest !== undefined) {
    const stored = blockWindow.getByNumber(latest)
    if (stored !== undefined) {
      try {
        const header = decodeRpcHeader(stored.headerRlp, chain, hardfork, stored.blockNumber)
        cap = header.gasLimit
      } catch {
        cap = SANDBOX_GAS_CAP_NO_HEADER
      }
    }
  }
  if (requested !== undefined && requested < cap) return requested
  return cap
}

export function buildExecutionBlock(
  spine: EthySpine,
  chain: ChainConfig,
  hardfork: string,
  blockWindow: RpcBlockWindowStore,
): { block: Block; common: Common; baseFee: bigint } {
  const common = new Common({
    chain,
    hardfork,
    customCrypto: { keccak256: ethyKeccak256 },
  })
  const head = headBlockNumber(spine)
  const latestN = blockWindow.latest() ?? head
  const stored = blockWindow.getByNumber(latestN)
  if (stored !== undefined) {
    const header = decodeRpcHeader(stored.headerRlp, chain, hardfork, stored.blockNumber)
    common.setHardforkBy({
      blockNumber: header.number,
      timestamp: header.timestamp,
    })
    const block = createBlock(
      {
        header: {
          parentHash: header.parentHash,
          number: header.number,
          timestamp: header.timestamp,
          gasLimit: header.gasLimit,
          baseFeePerGas: header.baseFeePerGas,
          coinbase: header.coinbase,
        },
        transactions: [],
      },
      { common, setHardfork: true },
    )
    return { block, common, baseFee: header.baseFeePerGas ?? 0n }
  }
  const block = createBlock(
    {
      header: {
        number: head,
        gasLimit: 30_000_000n,
        timestamp: head > 0n ? head * 12n + 1_650_000_000n : 0n,
      },
      transactions: [],
    },
    { common, setHardfork: false },
  )
  return { block, common, baseFee: 0n }
}
