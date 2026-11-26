import {
  MerklePatriciaTrie,
  createMPTFromProof,
  updateMPTFromMerkleProof,
  verifyMPTWithMerkleProof,
} from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { KECCAK256_RLP, createAccountFromRLP, equalsBytes } from '@ethereumjs/util'

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

async function stateScratch(proof: Uint8Array[], root: Uint8Array): Promise<MerklePatriciaTrie> {
  const trie = new MerklePatriciaTrie({ useKeyHashing: false, root })
  await updateMPTFromMerkleProof(trie, proof, false)
  trie.root(root)
  await trie.persistRoot()
  return trie
}

export async function verifyStatyMultiProof(
  group: StatyMultiProofGroup,
  _keccak256: (data: Uint8Array) => Uint8Array,
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

  const proof = group.proofNodes
  const storageRoots = new Map<string, Uint8Array>()

  const stateTrie = await stateScratch(proof, group.anchorStateRoot)

  for (const row of group.accounts) {
    if (row.accountHash.length !== 32) {
      return { ok: false, code: 'invalid_account_proof' }
    }
    try {
      const got = await verifyMPTWithMerkleProof(
        stateTrie,
        group.anchorStateRoot,
        row.accountHash,
        proof,
      )
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
      const hex = row.accountHash.reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')
      storageRoots.set(hex, acc.storageRoot)
    } catch {
      return { ok: false, code: 'invalid_account_proof' }
    }
  }

  for (const row of group.slots) {
    if (row.accountHash.length !== 32 || row.slotHash.length !== 32) {
      return { ok: false, code: 'invalid_storage_proof' }
    }
    if (!slotValCanonical(row.slotValOrEmpty)) {
      return { ok: false, code: 'invalid_storage_proof', detail: 'slot encoding' }
    }
    const parentHex = row.accountHash.reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')
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
    try {
      const storageTrie = await createMPTFromProof(proof, {
        root: storageRoot,
        useKeyHashing: false,
      })
      const proved = await verifyMPTWithMerkleProof(storageTrie, storageRoot, row.slotHash, proof)
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
