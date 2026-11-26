import { MerklePatriciaTrie, updateMPTFromMerkleProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  KECCAK256_RLP,
  MapDB,
  bytesToUnprefixedHex,
  createAccountFromRLP,
  equalsBytes,
} from '@ethereumjs/util'

import { MAX_STATY_MESSAGE_BYTES, MAX_STATY_PROOF_NODES } from './constants.ts'

export type StatyVerifyErrorCode =
  | 'invalid_anchor'
  | 'proof_cap_exceeded'
  | 'unsorted_keys'
  | 'invalid_account_proof'
  | 'missing_parent_account'
  | 'invalid_storage_proof'

export type StatyMultiProofGroup = {
  anchorStateRoot: Uint8Array
  accounts: Array<{ accountHash: Uint8Array; accountRlpOrEmpty: Uint8Array }>
  slots: Array<{ accountHash: Uint8Array; slotHash: Uint8Array; slotValOrEmpty: Uint8Array }>
  proofNodes: Uint8Array[]
}

export type StatyMultiProofVerifyResult =
  | { ok: true }
  | { ok: false; code: StatyVerifyErrorCode; detail?: string }

function slotValCanonical(val: Uint8Array): boolean {
  if (val.length === 0) return true
  if (val.length > 32) return false
  return val[0] !== 0
}

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < 32; i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

/**
 * Pure STATY/0 multi-proof verifier for EPOCH_PART and WITNESSES anchor groups.
 * Populates one shared in-memory MapDB from `proofNodes[]` (O(P) hashes using `keccak256`)
 * and verifies every account against `anchorStateRoot` and every storage slot against its
 * proven parent account's `storageRoot`.
 */
export async function verifyStatyMultiProof(
  group: StatyMultiProofGroup,
  keccak256: (data: Uint8Array) => Uint8Array,
): Promise<StatyMultiProofVerifyResult> {
  if (group.anchorStateRoot.length !== 32) {
    return { ok: false, code: 'invalid_anchor', detail: 'anchorStateRoot' }
  }
  if (group.proofNodes.length > MAX_STATY_PROOF_NODES) {
    return { ok: false, code: 'proof_cap_exceeded' }
  }
  let proofBytes = 0
  for (const n of group.proofNodes) proofBytes += n.length
  if (proofBytes > MAX_STATY_MESSAGE_BYTES) {
    return { ok: false, code: 'proof_cap_exceeded' }
  }

  for (let i = 1; i < group.accounts.length; i++) {
    if (compareBytes32(group.accounts[i]!.accountHash, group.accounts[i - 1]!.accountHash) <= 0) {
      return { ok: false, code: 'unsorted_keys' }
    }
  }
  for (let i = 1; i < group.slots.length; i++) {
    const a = group.slots[i]!
    const b = group.slots[i - 1]!
    const c = compareBytes32(a.accountHash, b.accountHash)
    if (c < 0 || (c === 0 && compareBytes32(a.slotHash, b.slotHash) <= 0)) {
      return { ok: false, code: 'unsorted_keys' }
    }
  }

  const sharedDb = new MapDB<string, string | Uint8Array>()
  const stateTrie = new MerklePatriciaTrie({
    db: sharedDb,
    useKeyHashing: false,
    useKeyHashingFunction: keccak256,
    root: group.anchorStateRoot,
  })
  if (group.proofNodes.length > 0) {
    try {
      await updateMPTFromMerkleProof(stateTrie, group.proofNodes, false)
    } catch {
      return { ok: false, code: 'invalid_account_proof', detail: 'proof ingest' }
    }
  }

  const storageRoots = new Map<string, Uint8Array>()

  for (const row of group.accounts) {
    if (row.accountHash.length !== 32) {
      return { ok: false, code: 'invalid_account_proof' }
    }
    try {
      const got = await stateTrie.get(row.accountHash, true)
      if (row.accountRlpOrEmpty.length === 0) {
        if (got !== null) {
          return { ok: false, code: 'invalid_account_proof', detail: 'exclusion' }
        }
        continue
      }
      if (got === null || !equalsBytes(got, row.accountRlpOrEmpty)) {
        return { ok: false, code: 'invalid_account_proof', detail: 'inclusion' }
      }
      const acc = createAccountFromRLP(row.accountRlpOrEmpty)
      storageRoots.set(bytesToUnprefixedHex(row.accountHash), acc.storageRoot)
    } catch {
      return { ok: false, code: 'invalid_account_proof' }
    }
  }

  const storageTries = new Map<string, MerklePatriciaTrie>()

  for (const row of group.slots) {
    if (row.accountHash.length !== 32 || row.slotHash.length !== 32) {
      return { ok: false, code: 'invalid_storage_proof' }
    }
    if (!slotValCanonical(row.slotValOrEmpty)) {
      return { ok: false, code: 'invalid_storage_proof', detail: 'slot encoding' }
    }
    const parentHex = bytesToUnprefixedHex(row.accountHash)
    const storageRoot = storageRoots.get(parentHex)
    if (storageRoot === undefined) {
      return { ok: false, code: 'missing_parent_account' }
    }
    if (equalsBytes(storageRoot, KECCAK256_RLP)) {
      if (row.slotValOrEmpty.length !== 0) {
        return { ok: false, code: 'invalid_storage_proof', detail: 'empty trie' }
      }
      continue
    }
    let storageTrie = storageTries.get(parentHex)
    if (storageTrie === undefined) {
      storageTrie = new MerklePatriciaTrie({
        db: sharedDb,
        useKeyHashing: false,
        useKeyHashingFunction: keccak256,
        root: storageRoot,
      })
      storageTries.set(parentHex, storageTrie)
    }
    try {
      const proved = await storageTrie.get(row.slotHash, true)
      if (row.slotValOrEmpty.length === 0) {
        if (proved !== null) {
          return { ok: false, code: 'invalid_storage_proof', detail: 'exclusion' }
        }
      } else {
        const encoded = RLP.encode(row.slotValOrEmpty)
        if (proved === null || !equalsBytes(proved, encoded)) {
          return { ok: false, code: 'invalid_storage_proof', detail: 'inclusion' }
        }
      }
    } catch {
      return { ok: false, code: 'invalid_storage_proof' }
    }
  }

  return { ok: true }
}
