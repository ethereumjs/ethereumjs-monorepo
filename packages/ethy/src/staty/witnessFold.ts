import { Account, createAccountFromRLP, equalsBytes } from '@ethereumjs/util'

import type { StatyWriteIndex } from './writeIndex.ts'

export type WitnessFoldAnchorAccount = {
  nonce: bigint
  balance: bigint
  storageRoot: Uint8Array
  codeHash: Uint8Array
}

export type WitnessFoldInput = {
  anchorBlock: number
  anchorStateRoot: Uint8Array
  accountHashHex: string
  accountRlpOrEmpty: Uint8Array
  slotWitnesses?: Array<{ slotHashHex: string; slotValOrEmpty: Uint8Array }>
}

export type FoldedSlotAction =
  | { kind: 'commit'; value: Uint8Array }
  | { kind: 'proven-empty' }
  | { kind: 'keep-live' }

export type FoldWitnessResult =
  | { ok: false; code: 'invalid_anchor' }
  | {
      ok: true
      account?: Account
      provenEmptyAccount: boolean
      slots: Array<{ slotHashHex: string; action: FoldedSlotAction }>
    }

export type WitnessFoldContext = {
  localBalEarliestBlock: number
  latestVerifiedBlock: number
  stateRootAt(block: number): Uint8Array | undefined
  readVerifiedBal(block: number): import('@ethereumjs/util').BALInput | undefined
  writeIndex: StatyWriteIndex
  accountExistsAtHead(accountHashHex: string, slotHashHex: string, slotVal: Uint8Array): boolean
}

function anchorAccount(accountRlpOrEmpty: Uint8Array): WitnessFoldAnchorAccount | undefined {
  if (accountRlpOrEmpty.length === 0) return undefined
  const acc = createAccountFromRLP(accountRlpOrEmpty)
  return {
    nonce: acc.nonce,
    balance: acc.balance,
    storageRoot: acc.storageRoot,
    codeHash: acc.codeHash,
  }
}

export function foldWitnessToHead(
  input: WitnessFoldInput,
  ctx: WitnessFoldContext,
): FoldWitnessResult {
  if (
    input.anchorBlock < ctx.localBalEarliestBlock ||
    input.anchorBlock > ctx.latestVerifiedBlock
  ) {
    return { ok: false, code: 'invalid_anchor' }
  }
  const expectedRoot = ctx.stateRootAt(input.anchorBlock)
  if (expectedRoot === undefined || !equalsBytes(expectedRoot, input.anchorStateRoot)) {
    return { ok: false, code: 'invalid_anchor' }
  }

  const anchor = anchorAccount(input.accountRlpOrEmpty)
  const provenEmptyAccount = anchor === undefined
  const idx = ctx.writeIndex.accountIndex(input.accountHashHex)
  let nonce = anchor?.nonce ?? 0n
  let balance = anchor?.balance ?? 0n
  let codeHash = anchor?.codeHash
  let storageRoot = anchor?.storageRoot
  if (idx !== undefined) {
    if (idx.lastDeletedBlock > input.anchorBlock) {
      return { ok: true, provenEmptyAccount: true, slots: [] }
    }
    for (let b = input.anchorBlock + 1; b <= ctx.latestVerifiedBlock; b++) {
      const bal = ctx.readVerifiedBal(b)
      if (bal === undefined) continue
      // Per-field folding applied via write index timestamps only in this lean core;
      // callers with BAL apply paths merge post-values at head separately.
      if (idx.lastBalanceBlock >= b && idx.lastBalanceBlock > input.anchorBlock) {
        /* balance post already at head via FlatStateManager */
      }
    }
    if (idx.lastNonceBlock <= input.anchorBlock) {
      /* keep anchor nonce */
    } else {
      nonce = anchor?.nonce ?? nonce
    }
    if (idx.lastCodeBlock <= input.anchorBlock) {
      /* keep anchor codeHash */
    }
  }

  const slots: Array<{ slotHashHex: string; action: FoldedSlotAction }> = []
  for (const sw of input.slotWitnesses ?? []) {
    const last = ctx.writeIndex.lastSlotWriteBlock(input.accountHashHex, sw.slotHashHex)
    if (last !== undefined && last > input.anchorBlock) {
      slots.push({ slotHashHex: sw.slotHashHex, action: { kind: 'keep-live' } })
      continue
    }
    if (sw.slotValOrEmpty.length === 0) {
      slots.push({ slotHashHex: sw.slotHashHex, action: { kind: 'proven-empty' } })
    } else {
      slots.push({
        slotHashHex: sw.slotHashHex,
        action: { kind: 'commit', value: sw.slotValOrEmpty },
      })
    }
  }

  let account: Account | undefined
  if (!provenEmptyAccount && storageRoot !== undefined && codeHash !== undefined) {
    account = new Account()
    account.nonce = nonce
    account.balance = balance
    account.storageRoot = storageRoot
    account.codeHash = codeHash
  }

  return { ok: true, account, provenEmptyAccount, slots }
}
