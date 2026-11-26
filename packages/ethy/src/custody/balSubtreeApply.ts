import type { BinaryPathBatchEntry } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  type BALInput,
  type CompactBinaryBAL,
  KECCAK256_NULL,
  KECCAK256_RLP,
  binaryAccountToRLP,
  bytesToBigInt,
  createAccount,
  createAccountFromRLP,
  decodeBALToBinary,
  equalsBytes,
  setLengthLeft,
} from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { BucketSubtreeTrie } from './bucketSubtreeTrie.ts'

function slotHashFromKey(slotKey: Uint8Array): Uint8Array {
  return ethyKeccak256(setLengthLeft(slotKey, 32))
}

function storageValueRlp(slotVal: Uint8Array): Uint8Array | null {
  if (slotVal.length === 0) return null
  return RLP.encode(slotVal)
}

function isEip161Empty(
  balance: bigint,
  nonce: bigint,
  codeHash: Uint8Array,
  storageRoot: Uint8Array,
): boolean {
  return (
    balance === 0n &&
    nonce === 0n &&
    equalsBytes(codeHash, KECCAK256_NULL) &&
    equalsBytes(storageRoot, KECCAK256_RLP)
  )
}

async function resolveAccountRlp(
  trie: BucketSubtreeTrie,
  accountHash: Uint8Array,
  snapStore: SnapPivotStore | undefined,
): Promise<Uint8Array | null> {
  const live = await trie.accountTrie().get(accountHash)
  if (live !== null) return live
  if (snapStore === undefined) return null
  const binary = snapStore.lookupBinaryAccountByHash(accountHash)
  if (binary === undefined) return null
  return binaryAccountToRLP(binary)
}

async function computeAccountMutation(
  trie: BucketSubtreeTrie,
  row: CompactBinaryBAL[number],
  snapStore: SnapPivotStore | undefined,
): Promise<BinaryPathBatchEntry | undefined> {
  const accountHash = ethyKeccak256(row.address)
  if (accountHash[0]! >> 4 !== trie.bucket) return undefined

  const existingRlp = await resolveAccountRlp(trie, accountHash, snapStore)
  const baseAcc =
    existingRlp !== null
      ? createAccountFromRLP(existingRlp)
      : createAccount({ storageRoot: KECCAK256_RLP })

  const storageMutations: BinaryPathBatchEntry[] = []
  for (const [slotKey, slotVal] of row.storageChanges) {
    const slotHash = slotHashFromKey(slotKey)
    const val = storageValueRlp(slotVal)
    storageMutations.push({ key: slotHash, value: val })
  }

  // Preserve the existing contract storageRoot whenever this BAL row has no storage writes.
  let storageRoot = baseAcc.storageRoot
  if (storageMutations.length > 0) {
    storageRoot = await trie.applyStorageBatch(accountHash, storageMutations)
  }

  let balance = baseAcc.balance
  let nonce = baseAcc.nonce
  let codeHash = baseAcc.codeHash

  if (row.balance !== undefined) {
    balance = row.balance.length === 0 ? 0n : bytesToBigInt(row.balance)
  }
  if (row.nonce !== undefined) {
    nonce = row.nonce.length === 0 ? 0n : bytesToBigInt(row.nonce)
  }
  if (row.code !== undefined) {
    codeHash = row.code.length === 0 ? KECCAK256_NULL : ethyKeccak256(row.code)
  }

  // Read-only BAL touches (no state change and account doesn't exist yet) must not materialize empty accounts.
  if (
    existingRlp === null &&
    storageMutations.length === 0 &&
    row.balance === undefined &&
    row.nonce === undefined &&
    row.code === undefined
  ) {
    return undefined
  }

  if (isEip161Empty(balance, nonce, codeHash, storageRoot)) {
    return { key: accountHash, value: null }
  }

  const acc = createAccount({
    nonce,
    balance,
    storageRoot,
    codeHash,
  })
  return { key: accountHash, value: acc.serialize() }
}

/** Apply one verified BAL block onto a custody bucket trie in a single account batch (WP-16f). */
export async function applyBalToBucketSubtree(
  trie: BucketSubtreeTrie,
  bal: BALInput,
  snapStore: SnapPivotStore | undefined,
): Promise<void> {
  const compact = decodeBALToBinary(bal)
  const accountMutations: BinaryPathBatchEntry[] = []
  for (const row of compact) {
    const mutation = await computeAccountMutation(trie, row, snapStore)
    if (mutation !== undefined) accountMutations.push(mutation)
  }
  if (accountMutations.length > 0) {
    await trie.applyAccountBatch(accountMutations)
  }
}
