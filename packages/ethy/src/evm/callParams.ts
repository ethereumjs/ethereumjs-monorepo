import { createAddressFromString, createZeroAddress } from '@ethereumjs/util'
import type { Address } from '@ethereumjs/util'

import { parseDataHex, parseQuantityHex } from '../rpc/quantities.ts'
import type { JsonRpcError } from '../rpc/types.ts'

export type ParsedRpcCall = {
  from: Address
  to?: Address
  data: Uint8Array
  value: bigint
  gasLimit?: bigint
  gasPrice?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
}

function err(code: number, message: string): { error: JsonRpcError } {
  return { error: { code, message } }
}

export function parseRpcTxObject(tx: unknown): { parsed: ParsedRpcCall } | { error: JsonRpcError } {
  if (tx === null || typeof tx !== 'object') {
    return err(-32602, 'Expected transaction object')
  }
  const obj = tx as Record<string, unknown>
  let from = createZeroAddress()
  if (obj.from !== undefined) {
    if (typeof obj.from !== 'string') return err(-32602, 'Invalid from address')
    try {
      from = createAddressFromString(obj.from)
    } catch {
      return err(-32602, 'Invalid from address')
    }
  }
  let to: Address | undefined
  if (obj.to !== null && obj.to !== undefined) {
    if (typeof obj.to !== 'string') return err(-32602, 'Invalid to address')
    try {
      to = createAddressFromString(obj.to)
    } catch {
      return err(-32602, 'Invalid to address')
    }
  }
  const dataField = obj.data ?? obj.input
  let data = new Uint8Array(0)
  if (dataField !== undefined) {
    const parsed = parseDataHex(dataField)
    if (parsed === undefined) return err(-32602, 'Invalid data hex')
    data = new Uint8Array(parsed)
  }
  let value = 0n
  if (obj.value !== undefined) {
    const v = parseQuantityHex(String(obj.value))
    if (v === undefined) return err(-32602, 'Invalid value')
    value = v
  }
  let gasLimit: bigint | undefined
  const gasField = obj.gas ?? obj.gasLimit
  if (gasField !== undefined) {
    const g = parseQuantityHex(String(gasField))
    if (g === undefined) return err(-32602, 'Invalid gas')
    gasLimit = g
  }
  let gasPrice: bigint | undefined
  if (obj.gasPrice !== undefined) {
    const g = parseQuantityHex(String(obj.gasPrice))
    if (g === undefined) return err(-32602, 'Invalid gasPrice')
    gasPrice = g
  }
  let maxFeePerGas: bigint | undefined
  if (obj.maxFeePerGas !== undefined) {
    const g = parseQuantityHex(String(obj.maxFeePerGas))
    if (g === undefined) return err(-32602, 'Invalid maxFeePerGas')
    maxFeePerGas = g
  }
  let maxPriorityFeePerGas: bigint | undefined
  if (obj.maxPriorityFeePerGas !== undefined) {
    const g = parseQuantityHex(String(obj.maxPriorityFeePerGas))
    if (g === undefined) return err(-32602, 'Invalid maxPriorityFeePerGas')
    maxPriorityFeePerGas = g
  }
  return {
    parsed: {
      from,
      to,
      data,
      value,
      gasLimit,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  }
}
