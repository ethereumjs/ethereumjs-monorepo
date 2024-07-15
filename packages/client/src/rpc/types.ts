import type { PrefixedHexString } from '@ethereumjs/util'

export interface RpcTx {
  from?: PrefixedHexString
  to?: PrefixedHexString
  gas?: PrefixedHexString
  gasPrice?: PrefixedHexString
  value?: PrefixedHexString
  data?: PrefixedHexString
  input?: PrefixedHexString // This is the "official" name of the property the client uses for "data" in the RPC spec
  maxPriorityFeePerGas?: PrefixedHexString
  maxFeePerGas?: PrefixedHexString
  type?: PrefixedHexString
}

export interface RpcTxRes {
  from: PrefixedHexString
  to?: PrefixedHexString
  gas: PrefixedHexString
  gasPrice: PrefixedHexString
  value: PrefixedHexString
  input?: PrefixedHexString
  data?: PrefixedHexString
  maxPriorityFeePerGas: PrefixedHexString
  maxFeePerGas: PrefixedHexString
  type: PrefixedHexString
}

/**
 * Convert the return value from eth_getTransactionByHash to a {@link RpcTx} interface
 */
export type TxResult = Record<string, string> & RpcTxRes

export function toRpcTx(t: TxResult): RpcTx {
  const rpcTx: RpcTx = {
    from: t.from,
    gas: t.gas,
    gasPrice: t.gasPrice,
    value: t.value,
    data: t.input ?? t.data,
    maxPriorityFeePerGas: t.maxPriorityFeePerGas,
    maxFeePerGas: t.maxFeePerGas,
    type: t.type,
  }
  t.to !== null && (rpcTx.to = t.to)
  return rpcTx
}
