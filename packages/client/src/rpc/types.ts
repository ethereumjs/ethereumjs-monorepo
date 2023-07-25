export interface RpcTx {
  from?: string
  to?: string
  gas?: string
  gasPrice?: string
  value?: string
  data?: string
  maxPriorityFeePerGas?: string
  maxFeePerGas?: string
  type?: string
}

export interface RpcTxRes {
  from: string
  to?: string
  gas: string
  gasPrice: string
  value: string
  input?: string
  data?: string
  maxPriorityFeePerGas: string
  maxFeePerGas: string
  type: string
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
