import type { FlatStateManager } from '@ethereumjs/statemanager'
import { createAccount, createAddressFromString, hexToBytes, setLengthLeft } from '@ethereumjs/util'

import { parseDataHex, parseQuantityHex } from '../rpc/quantities.ts'
import type { JsonRpcError } from '../rpc/types.ts'

function err(code: number, message: string): { error: JsonRpcError } {
  return { error: { code, message } }
}

export async function applyStateOverride(
  overlay: FlatStateManager,
  override: unknown,
): Promise<{ ok: true } | { error: JsonRpcError }> {
  if (override === undefined || override === null) {
    return { ok: true }
  }
  if (typeof override !== 'object' || Array.isArray(override)) {
    return err(-32602, 'Invalid stateOverride')
  }
  const map = override as Record<string, Record<string, unknown>>
  for (const [addr, fields] of Object.entries(map)) {
    if (fields === null || typeof fields !== 'object') {
      return err(-32602, 'Invalid stateOverride entry')
    }
    const hasState =
      fields.state !== undefined && typeof fields.state === 'object' && !Array.isArray(fields.state)
    const hasDiff =
      fields.stateDiff !== undefined &&
      typeof fields.stateDiff === 'object' &&
      !Array.isArray(fields.stateDiff)
    if (hasState && hasDiff) {
      return err(-32602, 'state and stateDiff are mutually exclusive per account')
    }
    let address
    try {
      address = createAddressFromString(addr)
    } catch {
      return err(-32602, `Invalid override address ${addr}`)
    }
    const existing = await overlay.getAccount(address)
    const account = existing ?? createAccount({ nonce: 0n, balance: 0n })
    if (fields.balance !== undefined) {
      const b = parseQuantityHex(String(fields.balance))
      if (b === undefined) return err(-32602, 'Invalid override balance')
      account.balance = b
    }
    if (fields.nonce !== undefined) {
      const n = parseQuantityHex(String(fields.nonce))
      if (n === undefined) return err(-32602, 'Invalid override nonce')
      account.nonce = n
    }
    await overlay.putAccount(address, account)
    if (fields.code !== undefined) {
      if (typeof fields.code !== 'string') return err(-32602, 'Invalid override code')
      const code = parseDataHex(fields.code)
      if (code === undefined) return err(-32602, 'Invalid override code hex')
      await overlay.putCode(address, code)
    }
    const slotMap = (hasState ? fields.state : fields.stateDiff) as
      | Record<string, string>
      | undefined
    if (hasState) {
      await overlay.clearStorage(address)
    }
    if (slotMap !== undefined) {
      for (const [slotHex, valHex] of Object.entries(slotMap)) {
        const slotKey = slotHex.startsWith('0x') ? slotHex : `0x${slotHex}`
        let slotBytes: Uint8Array
        try {
          slotBytes = setLengthLeft(hexToBytes(slotKey as `0x${string}`), 32)
        } catch {
          return err(-32602, 'Invalid storage slot key')
        }
        const val = parseDataHex(valHex)
        if (val === undefined) return err(-32602, 'Invalid storage value')
        const value = setLengthLeft(val.length > 32 ? val.subarray(0, 32) : val, 32)
        await overlay.putStorage(address, slotBytes, value)
      }
    }
  }
  return { ok: true }
}
