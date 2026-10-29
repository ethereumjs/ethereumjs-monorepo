import type { FlatStateManager } from '@ethereumjs/statemanager'
import { bytesToHex, hexToBytes, isHexString } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3'

import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function inspectLatestBAL(spine: EthySpine): WidgetSpec {
  const latest = spine.balWindow[0]
  if (latest?.balJson === undefined) {
    return {
      kind: 'key_value',
      title: 'Latest BAL',
      entries: [
        { key: 'Head', value: spine.headBlockNumber?.toString() ?? '—' },
        { key: 'Window', value: `${spine.balWindow.length} blocks` },
      ],
      assistantComment: 'No parsed BAL on the newest head block yet.',
    }
  }
  const rows: string[][] = []
  const cap = 32
  for (const acc of latest.balJson.slice(0, cap)) {
    const bal = acc.balanceChanges.at(-1)?.postBalance ?? '—'
    const nonce = acc.nonceChanges.at(-1)?.postNonce ?? '—'
    const storageWrites = acc.storageChanges.length
    const storageReads = acc.storageReads?.length ?? 0
    const codeChanged = acc.codeChanges.length > 0 ? 'yes' : 'no'
    rows.push([acc.address, bal, nonce, String(storageWrites), String(storageReads), codeChanged])
  }
  const overflow = latest.balJson.length - cap
  return {
    kind: 'table',
    title: `BAL at #${latest.blockNumber.toString()}`,
    headers: ['Address', 'Balance', 'Nonce', 'S-Writes', 'S-Reads', 'Code'],
    rows,
    assistantComment:
      overflow > 0
        ? `${latest.accountCount} accounts total; ${overflow} more rows omitted.`
        : `${latest.accountCount} accounts in this block access list.`,
  }
}

export function inspectAccount(
  spine: EthySpine,
  stateManager: FlatStateManager,
  addrInput: string,
): WidgetSpec {
  const trimmed = addrInput.trim()
  if (trimmed.length === 0) {
    return {
      kind: 'key_value',
      title: 'Account',
      entries: [{ key: 'Error', value: 'Provide /account 0x…' }],
    }
  }
  if (!isHexString(trimmed)) {
    return {
      kind: 'key_value',
      title: 'Account',
      entries: [{ key: 'Error', value: 'Invalid hex address or account hash' }],
    }
  }
  const hex = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed
  if (hex.length !== 40 && hex.length !== 64) {
    return {
      kind: 'key_value',
      title: 'Account',
      entries: [{ key: 'Error', value: 'Expected 20-byte address or 32-byte account hash' }],
    }
  }
  const bytes = hexToBytes(`0x${hex}`)
  const accountHash = bytes.length === 32 ? bytes : keccak_256(bytes)
  const display = bytes.length === 20 ? `0x${hex}` : `0x${hex} (hash)`
  const acc = stateManager.getAccountByHash(accountHash)
  if (acc === undefined) {
    return {
      kind: 'key_value',
      title: 'Account',
      entries: [
        { key: 'Lookup', value: display },
        { key: 'Status', value: 'Not in flat store' },
      ],
    }
  }
  const code = stateManager.getCodeByHash(acc.codeHash) ?? new Uint8Array(0)
  const addrLower = display.toLowerCase()
  const mutationBlocks = spine.balWindow
    .filter((w) => w.balJson?.some((a) => a.address.toLowerCase() === addrLower))
    .map((w) => `#${w.blockNumber}`)
    .slice(0, 5)
  return {
    kind: 'key_value',
    title: 'Account',
    entries: [
      { key: 'Lookup', value: display },
      { key: 'Balance', value: acc.balance.toString() },
      { key: 'Nonce', value: acc.nonce.toString() },
      { key: 'Code size', value: String(code.length) },
      { key: 'Storage root', value: bytesToHex(acc.storageRoot) },
      { key: 'Recent BAL blocks', value: mutationBlocks.join(', ') || '—' },
    ],
  }
}
