import type { FlatStateManager } from '@ethereumjs/statemanager'
import { KECCAK256_NULL, bytesToHex, equalsBytes } from '@ethereumjs/util'

import type { WidgetSpec } from '../spine/types.ts'

function shortHex(bytes: Uint8Array): string {
  const h = bytesToHex(bytes)
  return h.length <= 12 ? h : `${h.slice(0, 8)}…${h.slice(-4)}`
}

export function inspectRawAccountRange(
  stateManager: FlatStateManager,
  prefixArg?: string,
): WidgetSpec {
  const prefixHex = prefixArg?.trim().replace(/^0x/, '')
  const rows = stateManager
    .sampleAccounts({ prefixHex, limit: 20, sortByBalanceDesc: false })
    .map((row) => {
      const acct = row.address !== undefined ? row.address.toString() : shortHex(row.accountHash)
      const contract = equalsBytes(row.account.codeHash, KECCAK256_NULL) ? 'no' : 'yes'
      return [
        acct,
        (Number(row.account.balance) / 1e18).toFixed(4),
        row.account.nonce.toString(),
        contract,
        shortHex(row.account.storageRoot),
      ]
    })
  return {
    kind: 'table',
    title: prefixHex ? `Accounts (${prefixHex})` : 'Account range',
    headers: ['Account', 'Balance (ETH)', 'Nonce', 'Contract', 'Storage root'],
    rows,
  }
}

export function sampleSyncedAccounts(stateManager: FlatStateManager): WidgetSpec {
  const rows = stateManager.sampleAccounts({ limit: 15, sortByBalanceDesc: true }).map((row) => {
    const acct = row.address !== undefined ? row.address.toString() : shortHex(row.accountHash)
    return [acct, (Number(row.account.balance) / 1e18).toFixed(4), row.account.nonce.toString()]
  })
  return {
    kind: 'table',
    title: 'Top synced accounts',
    headers: ['Account', 'Balance (ETH)', 'Nonce'],
    rows,
  }
}
