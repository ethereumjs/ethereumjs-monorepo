import { type ChainConfig, Common } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { createTxFromRLP } from '@ethereumjs/tx'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

import type { JsonRpcError } from '../rpc/types.ts'

function err(code: number, message: string): { error: JsonRpcError } {
  return { error: { code, message } }
}

export async function validateRawTransaction(
  raw: Uint8Array,
  stateManager: FlatStateManager,
  chain: ChainConfig,
  hardfork: string,
  chainId: bigint,
): Promise<{ hash: string; raw: Uint8Array } | { error: JsonRpcError }> {
  if (raw.length === 0) return err(-32602, 'Empty transaction')
  let tx
  const common = new Common({ chain, hardfork })
  try {
    tx = createTxFromRLP(raw, { common })
  } catch {
    return err(-32602, 'Invalid RLP transaction')
  }
  if (!tx.isSigned() || !tx.verifySignature()) {
    return err(-32000, 'Invalid transaction signature')
  }
  const txChainId = tx.common.chainId()
  if (txChainId !== chainId) {
    return err(-32000, 'Transaction chain id mismatch')
  }
  const sender = tx.getSenderAddress()
  const account = await stateManager.getAccount(sender)
  const nonce = account?.nonce ?? 0n
  const balance = account?.balance ?? 0n
  if (tx.nonce < nonce) {
    return err(-32000, 'Transaction nonce too low')
  }
  if (tx.nonce > nonce + 15n) {
    return err(-32000, 'Transaction nonce too high')
  }
  const gasLimit = tx.gasLimit
  const intrinsicGas = tx.getIntrinsicGas()
  if (gasLimit < intrinsicGas) {
    return err(
      -32000,
      `Intrinsic gas too low: gasLimit ${gasLimit.toString()} < required ${intrinsicGas.toString()}`,
    )
  }
  let feePerGas =
    'gasPrice' in tx && tx.gasPrice !== undefined
      ? tx.gasPrice
      : 'maxFeePerGas' in tx
        ? tx.maxFeePerGas
        : 0n
  const maxCost = tx.value + gasLimit * feePerGas
  if (balance < maxCost) {
    return err(-32000, 'Insufficient funds for transaction')
  }
  const hash = bytesToHex(tx.hash())
  return { hash, raw }
}

export function decodeRawTxHex(hex: string): { raw: Uint8Array } | { error: JsonRpcError } {
  if (typeof hex !== 'string' || !hex.startsWith('0x')) {
    return err(-32602, 'Expected 0x-prefixed signed transaction hex')
  }
  try {
    return { raw: hexToBytes(hex as `0x${string}`) }
  } catch {
    return err(-32602, 'Invalid transaction hex')
  }
}
