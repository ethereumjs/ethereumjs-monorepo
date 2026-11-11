import { createAddressFromString, createZeroAddress, hexToBytes } from '@ethereumjs/util'

import { formatCalldataPreview } from '../contracts/localAbi.ts'
import {
  catalogSelectorForSignature,
  lookupFunctionSelector,
} from '../contracts/signatureCatalog.ts'
import { type ParsedRpcCall, parseRpcTxObject } from '../evm/callParams.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import { dataHex } from '../rpc/quantities.ts'
import type { WidgetSpec } from '../spine/types.ts'

function parseSimulateArgs(parts: string[]): { parsed: ParsedRpcCall } | { error: string } {
  const toHex = parts[1]
  const dataOrSig = parts[2]
  if (toHex === undefined || dataOrSig === undefined) {
    return { error: 'Usage: /simulate <to> <data_or_sig> [value]' }
  }
  let to
  try {
    to = createAddressFromString(toHex)
  } catch {
    return { error: 'Invalid to address' }
  }
  let data: Uint8Array
  if (dataOrSig.startsWith('0x')) {
    try {
      data = hexToBytes(dataOrSig as `0x${string}`)
    } catch {
      return { error: 'Invalid calldata hex' }
    }
  } else {
    try {
      const sel = catalogSelectorForSignature(dataOrSig)
      data = hexToBytes(sel as `0x${string}`)
    } catch {
      return { error: 'Unknown function signature' }
    }
  }
  let value = 0n
  if (parts[3] !== undefined) {
    try {
      value = BigInt(parts[3].startsWith('0x') ? parts[3] : `0x${parts[3]}`)
    } catch {
      return { error: 'Invalid value' }
    }
  }
  const tx = {
    from: createZeroAddress().toString(),
    to: to.toString(),
    data: dataHex(data),
    value: `0x${value.toString(16)}`,
  }
  const built = parseRpcTxObject(tx)
  if ('error' in built) return { error: built.error.message }
  return { parsed: built.parsed }
}

export async function simulateMicroscopeWidget(
  sandbox: EthySandbox,
  line: string,
): Promise<WidgetSpec> {
  const parts = line.trim().split(/\s+/)
  const args = parseSimulateArgs(parts)
  if ('error' in args) {
    return { kind: 'key_value', title: '/simulate', entries: [{ key: 'Error', value: args.error }] }
  }
  const run = await sandbox.runSimulateCall(args.parsed)
  if (run.execError !== undefined) {
    return {
      kind: 'key_value',
      title: '/simulate',
      entries: [
        { key: 'To', value: args.parsed.to?.toString() ?? '—' },
        { key: 'Error', value: run.execError.message },
      ],
    }
  }
  const selector =
    args.parsed.data.length >= 4
      ? lookupFunctionSelector(`0x${dataHex(args.parsed.data.subarray(0, 4)).slice(2)}`)
      : undefined
  const entries: { key: string; value: string }[] = [
    { key: 'Gas used', value: run.gasUsed.toString() },
    {
      key: 'Return data',
      value:
        run.returnData.length > 0
          ? `${dataHex(run.returnData)}${selector !== undefined ? ` · ${selector.signature}` : ''}`
          : args.parsed.data.length >= 4
            ? formatCalldataPreview(args.parsed.data)
            : '0x',
    },
    { key: 'Logs emitted', value: String(run.logs.length) },
    { key: 'Accounts touched', value: String(run.overlay.overlayMutations().accounts.length) },
    {
      key: 'Storage slot diffs',
      value: String(run.overlay.overlayMutations().storage.length),
    },
  ]
  return { kind: 'key_value', title: '/simulate', entries }
}

export async function sendTxWidget(
  submit: (hex: string) => Promise<{ result: string } | { error: { message: string } }>,
  line: string,
): Promise<WidgetSpec> {
  const hex = line.trim().split(/\s+/).slice(1).join('')
  if (hex.length === 0 || !hex.startsWith('0x')) {
    return {
      kind: 'key_value',
      title: '/send',
      entries: [{ key: 'Error', value: 'Usage: /send <signedTxHex>' }],
    }
  }
  const out = await submit(hex)
  if ('error' in out) {
    return {
      kind: 'key_value',
      title: '/send',
      entries: [{ key: 'Error', value: out.error.message }],
    }
  }
  return {
    kind: 'key_value',
    title: '/send',
    entries: [{ key: 'Tx hash', value: out.result }],
  }
}
