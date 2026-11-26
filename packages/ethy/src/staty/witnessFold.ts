import {
  Account,
  type BALInput,
  KECCAK256_NULL,
  KECCAK256_RLP,
  bytesToBigInt,
  bytesToUnprefixedHex,
  createAccountFromRLP,
  decodeBALToBinary,
  equalsBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

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
  readVerifiedBal(block: number): BALInput | undefined
  writeIndex: StatyWriteIndex
  keccak256?: (data: Uint8Array) => Uint8Array
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

  const hashFn = ctx.keccak256 ?? keccak_256
  const anchor = anchorAccount(input.accountRlpOrEmpty)
  const idx = ctx.writeIndex.accountIndex(input.accountHashHex)

  let nonce = anchor?.nonce ?? 0n
  let balance = anchor?.balance ?? 0n
  let codeHash = anchor?.codeHash ?? KECCAK256_NULL
  const storageRoot = anchor?.storageRoot ?? KECCAK256_RLP
  let exists = anchor !== undefined

  if (idx !== undefined) {
    if (idx.lastDeletedBlock > input.anchorBlock) {
      return { ok: true, provenEmptyAccount: true, slots: [] }
    }
    const maxAccountWrite = Math.max(idx.lastBalanceBlock, idx.lastNonceBlock, idx.lastCodeBlock)
    if (maxAccountWrite > input.anchorBlock) {
      const upper = Math.min(maxAccountWrite, ctx.latestVerifiedBlock)
      for (let b = input.anchorBlock + 1; b <= upper; b++) {
        const bal = ctx.readVerifiedBal(b)
        if (bal === undefined) continue
        const compact = decodeBALToBinary(bal)
        for (const row of compact) {
          if (bytesToUnprefixedHex(hashFn(row.address)) !== input.accountHashHex) continue
          if (row.balance !== undefined) {
            balance = row.balance.length === 0 ? 0n : bytesToBigInt(row.balance)
            exists = true
          }
          if (row.nonce !== undefined) {
            nonce = row.nonce.length === 0 ? 0n : bytesToBigInt(row.nonce)
            exists = true
          }
          if (row.code !== undefined) {
            codeHash = row.code.length === 0 ? KECCAK256_NULL : hashFn(row.code)
            exists = true
          }
        }
      }
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

  const isEmptyPost =
    !exists || (balance === 0n && nonce === 0n && equalsBytes(codeHash, KECCAK256_NULL))

  if (isEmptyPost) {
    return { ok: true, provenEmptyAccount: true, slots }
  }

  const account = new Account()
  account.nonce = nonce
  account.balance = balance
  account.storageRoot = storageRoot
  account.codeHash = codeHash

  return { ok: true, account, provenEmptyAccount: false, slots }
}
