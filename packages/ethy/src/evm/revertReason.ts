import { bytesToBigInt, bytesToHex } from '@ethereumjs/util'

import { lookupFunctionSelector } from '../contracts/signatureCatalog.ts'

const ERROR_STRING_SELECTOR = '0x08c379a0'

function decodeRevertString(data: Uint8Array): string | undefined {
  if (data.length < 68) return undefined
  const off = Number(bytesToBigInt(data.subarray(4, 36)))
  if (off < 0 || off + 32 > data.length) return undefined
  const len = Number(bytesToBigInt(data.subarray(off, off + 32)))
  if (len < 0 || off + 32 + len > data.length) return undefined
  const payload = data.subarray(off + 32, off + 32 + len)
  try {
    const s = new TextDecoder('utf-8', { fatal: false }).decode(payload)
    return /^[\x20-\x7e\u00a0-\ufffd]*$/.test(s) ? s : undefined
  } catch {
    return undefined
  }
}

export function formatExecutionReverted(returnValue: Uint8Array): string {
  if (returnValue.length >= 4) {
    const sel = `0x${bytesToHex(returnValue.subarray(0, 4))}`
    if (sel.toLowerCase() === ERROR_STRING_SELECTOR) {
      const reason = decodeRevertString(returnValue)
      if (reason !== undefined && reason.length > 0) {
        return `execution reverted: ${reason}`
      }
    }
    const known = lookupFunctionSelector(sel)
    if (known !== undefined) {
      return `execution reverted: ${known.signature}`
    }
  }
  return 'execution reverted'
}
