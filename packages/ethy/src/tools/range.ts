import type { FlatStateManager } from '@ethereumjs/statemanager'
import { KECCAK256_NULL, bytesToHex, equalsBytes } from '@ethereumjs/util'

import type { SnapPivotStore } from '../persist/snapStore.ts'
import { snapBucketsDoneCount } from '../spine/buckets.ts'
import type { EthySpine, WidgetSpec } from '../spine/types.ts'

function shortHex(bytes: Uint8Array): string {
  const h = bytesToHex(bytes)
  return h.length <= 12 ? h : `${h.slice(0, 8)}…${h.slice(-4)}`
}

function rowInClosedCustody(hash: Uint8Array, spine?: EthySpine): boolean {
  if (spine === undefined) return true
  if (snapBucketsDoneCount(spine.snapBuckets) === 16) return true
  const mask = spine.closedBucketsMask ?? 0
  if (mask === 0) return false
  const bucket = hash[0]! >> 4
  return (mask & (1 << bucket)) !== 0
}

function sampleAccountRows(
  stateManager: FlatStateManager,
  snapStore: SnapPivotStore | undefined,
  opts: { prefixHex?: string; limit: number; sortByBalanceDesc?: boolean },
  spine?: EthySpine,
) {
  let rows = stateManager
    .sampleAccounts(opts)
    .filter((row) => rowInClosedCustody(row.accountHash, spine))
  if (rows.length < opts.limit && snapStore !== undefined) {
    const disk = snapStore.sampleAccountsFromDisk({
      prefixHex: opts.prefixHex,
      limit: opts.limit,
      sortByBalanceDesc: opts.sortByBalanceDesc,
    })
    const seen = new Set(rows.map((row) => bytesToHex(row.accountHash)))
    for (const row of disk) {
      const key = bytesToHex(row.accountHash)
      if (seen.has(key)) continue
      if (!rowInClosedCustody(row.accountHash, spine)) continue
      rows.push(row)
      seen.add(key)
      if (rows.length >= opts.limit) break
    }
  }
  return rows
}

export function inspectRawAccountRange(
  stateManager: FlatStateManager,
  prefixArg?: string,
  snapStore?: SnapPivotStore,
  spine?: EthySpine,
): WidgetSpec {
  const prefixHex = prefixArg?.trim().replace(/^0x/, '')
  const rows = sampleAccountRows(
    stateManager,
    snapStore,
    {
      prefixHex,
      limit: 20,
      sortByBalanceDesc: false,
    },
    spine,
  ).map((row) => {
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

export function sampleSyncedAccounts(
  stateManager: FlatStateManager,
  snapStore?: SnapPivotStore,
  spine?: EthySpine,
): WidgetSpec {
  const rows = sampleAccountRows(
    stateManager,
    snapStore,
    {
      limit: 15,
      sortByBalanceDesc: true,
    },
    spine,
  ).map((row) => {
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
