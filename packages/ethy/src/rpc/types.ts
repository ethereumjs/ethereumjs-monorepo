import type { BALJSONBlockAccessList } from '@ethereumjs/util'

export type RpcBundleNote = {
  blockNumber: bigint
  headerRlp: Uint8Array
  bodyRlp?: Uint8Array
  receiptsEth69Rlp?: Uint8Array
  balJson?: BALJSONBlockAccessList
}

export type JsonRpcError = {
  code: number
  message: string
  data?: unknown
}

export type JsonRpcResponse =
  | { jsonrpc: '2.0'; id: string | number | null; result?: unknown }
  | { jsonrpc: '2.0'; id: string | number | null; error: JsonRpcError }
