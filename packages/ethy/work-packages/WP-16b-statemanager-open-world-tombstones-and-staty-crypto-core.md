# WP-16b: `@ethereumjs/statemanager` Open-World `FlatStateManager`, Proven-Empty Tombstones & `@ethereumjs/ethy` `STATY/0` Cryptographic & Storage Core

- **Status:** `DONE`
- **Dependencies:** `WP-04g` (`DONE`), `WP-08a` (`DONE`), `WP-14` (`DONE`), [`protocols/devp2p/STATY-0-SPEC.md`](../../../../protocols/devp2p/STATY-0-SPEC.md) § 2–4 & § 6
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Build the **cryptographic and state-management foundation** for `STATY/0` (and hybrid `STATY/0` + `ETHY/0` `--full` mode) across `@ethereumjs/statemanager` (separate upstream commit per **D-008**) and `@ethereumjs/ethy`:
1. Upgrade **`FlatStateManager`** with per-bucket **Closed-World vs. Open-World** resolution, **Proven-Empty Tombstones**, and coalesced async on-demand state-miss hooks (`0` overhead and `0` leaks on Closed-World buckets).
2. Implement the pure **`STATY/0` MPT multi-proof verifier** (inclusion + exclusion proofs for accounts and storage against `verifiedHeader(anchorBlock).stateRoot` with deduplicated `proofNodes[]`).
3. Implement the **strictly local `StatyWriteIndex`** (built solely from locally verified `eth/71` BALs — never wire-trusted) and exact **per-field BAL-extended witness folding** (`foldWitnessToHead`).
4. Establish the unified **shared `code/` store** and on-disk **`StatyStore`** (`staty/epochs/<e>/`, LRU `staty/witnesses/`, `staty/write-index/`) that both `STATY/0` and `devp2p` worker serving read directly.

---

### Key Deliverables (`WP-16b`)

1. **Upstream `@ethereumjs/statemanager` (`FlatStateManager` Open-World, Tombstones & Async Miss Hooks — Separate D-008 Commit):**
   - **Per-Bucket Completeness Mask (`closedBucketsMask: number`):**
     - New option on `FlatStateManagerOpts`: `closedBucketsMask?: number` (defaults to `0xffff` = all 16 nibble buckets Closed-World so 100% of existing callers and tests keep identical behavior!).
     - Method `setClosedBucketsMask(mask: number)` and `markBucketClosed(bucketIndex: number)` so `--full` mode can flip individual nibble buckets `0..15` from Open-World to Closed-World atomically at runtime.
   - **Proven-Empty Tombstones (Open-World Only):**
     - Track verified non-existent accounts (`markAccountEmpty(accountHash)`) and verified zero storage slots (`markStorageEmpty(accountHash, slotHash)`), bounded with LRU/FIFO caps so memory stays flat.
     - Automatically clear a tombstone if `putAccount`, `putStorage`, or `consumeBAL` subsequently writes a non-empty value for that key!
   - **Async Miss Resolver Hooks, `ResolutionPolicy` & False-Zero Safety (`FlatStateManagerOpts`):**
     - `StateResolutionPolicy = 'full' | 'swarm-only' | 'local-only'` (default `'full'`; passed to miss hooks and selectable per `shallowCopy({ resolutionPolicy })` overlay so background AI / ENS probes can run `'swarm-only'` with **zero `snap/1` leeching** while user JSON-RPC runs `'full'`).
     - `resolveAccountMiss?: (accountHash: Uint8Array, policy: StateResolutionPolicy) => Promise<Uint8Array | 'empty' | undefined>`
     - `resolveStorageMiss?: (accountHash: Uint8Array, slotHash: Uint8Array, policy: StateResolutionPolicy) => Promise<Uint8Array | 'empty' | undefined>`
     - `resolveCodeMiss?: (codeHash: Uint8Array, policy: StateResolutionPolicy) => Promise<Uint8Array | undefined>`
     - **S0/S1 False-Zero Safety Invariant (`StateMissUnavailableError`):** In an **Open-World** bucket, if a key is an **Unknown Miss** and the resolver returns `undefined` (timeout, peer miss, or `'local-only'`/`'swarm-only'` policy hit without a cached witness), `FlatStateManager` MUST throw a typed **`StateMissUnavailableError`** rather than silently returning `undefined` / `0n`! Only a **Closed-World** bucket or a **Proven-Empty Tombstone** may return an empty account or `0` storage value — guaranteeing `eth_getBalance`, `eth_getTransactionCount`, and `eth_call` NEVER fabricate a false zero balance or nonce when peers are unreachable.
     - Resolution order in `getAccount` / `getStorage` / `getCodeByHash` / `getCode`:
       1. RAM overlay / arena / hot cache → return immediately.
       2. Cold disk lookup (`coldAccountLookup` / `coldStorageLookup` / `coldCodeLookup`) → return immediately.
       3. If bucket `b = accountHash[0] >> 4` is **Closed-World** (`(closedBucketsMask & (1 << b)) !== 0`): return empty / `0` immediately (**zero resolver calls, 100% read privacy**).
       4. If bucket `b` is **Open-World** and key has a **Proven-Empty Tombstone** (or account has `storageRoot === KECCAK256_RLP` for storage reads): return empty / `0` immediately (**zero resolver calls**).
       5. Otherwise (**Unknown Miss**): if overlay policy is `'local-only'`, throw `StateMissUnavailableError`; otherwise await the matching `resolve*Miss(key, policy)` hook (deduplicating concurrent misses on the same key via an in-flight `Map`), commit any resolved value or `'empty'` tombstone into `FlatStateManager` (returning it), or throw `StateMissUnavailableError` if unresolved.
     - Preserve `shallowCopy({ resolutionPolicy })` inheritance so `@ethereumjs/evm` `eth_call` overlays seamlessly trigger root open-world resolution under the caller's policy while isolating call-frame writes!

2. **`STATY/0` Cryptographic Multi-Proof Verifier (`packages/ethy/src/staty/multiProofVerify.ts`):**
   - Pure verifier for `EPOCH_PART (0x04)` and `WITNESSES (0x06)` anchor groups using `@ethereumjs/mpt` + `@ethereumjs/ethy`'s WASM `ethyKeccak256` (no new runtime deps, pure-JS fallback in library code per `security.mdc` S3):
     - Enforce DoS caps: `proofNodes.length <= 4,096`, strict ascending `accountHash` order, strict ascending `(accountHash, slotHash)` order, canonical minimal big-endian `slotValOrEmpty` (`<= 32` bytes, no leading `0x00`).
     - Build temporary `Map<string, Uint8Array>` from `proofNodes[]` keyed by `keccak256(nodeRlp)`.
     - Verify every `(accountHash, accountRlpOrEmpty)` against `anchorStateRoot` (inclusion of canonical 4-element account RLP, or MPT exclusion proof when `0x80`).
     - Verify every `(accountHash, slotHash, slotValOrEmpty)` against the parent account's proven `storageRoot` at the **same** `anchorBlock` (if `storageRoot === KECCAK256_RLP`, require `slotValOrEmpty === 0x80`; if non-empty, verify inclusion of `RLP.encode(slotValOrEmpty)`; if `0x80`, verify exclusion proof).
     - Return structured verification errors (`invalid_anchor`, `proof_cap_exceeded`, `unsorted_keys`, `invalid_account_proof`, `missing_parent_account`, `invalid_storage_proof`) so callers can immediately disconnect + quarantine misbehaving peers per `STATY-0-SPEC.md` § 3.4.

3. **Strictly Local `StatyWriteIndex` & Per-Field BAL-Extended Folding (`packages/ethy/src/staty/writeIndex.ts`, `witnessFold.ts`):**
   - **`StatyWriteIndex`:**
     - Maintained **exclusively** from locally verified `eth/71` BALs over `[localBalEarliestBlock .. latestVerifiedBlock]` (never populated from remote peers!).
     - Tracks compact per-key last-modified block numbers:
       - Per-account field mutations: `lastBalanceBlock`, `lastNonceBlock`, `lastCodeBlock`, `lastDeletedBlock` (or compact per-account delta replay reference into the local verified BAL archive).
       - Per-slot mutations: `lastSlotWriteBlock[(accountHash, slotHash)]`.
     - Persists compact checkpoints / rebuilds rapidly from `<networkDir>/bal-tail/` (the existing segmented `bal-tail/` archive) on restart.
   - **`foldWitnessToHead` (`witnessFold.ts`):**
     - **Hard Soundness Gate:** Reject any witness with `anchorBlock < localBalEarliestBlock` or `anchorBlock > latestVerifiedBlock`, or whose `anchorStateRoot` does not match `verifiedHeader(anchorBlock).stateRoot`.
     - **Per-Field Account Folding (EIP-7928 correctness):** Starting from proven `(nonce_B, balance_B, storageRoot_B, codeHash_B)` (or empty account if excluded) at `anchorBlock`, fold verified BAL deltas in `[anchorBlock + 1 .. #Head]` independently for `balance`, `nonce`, and `code` (respecting EIP-161 deletion on same-tx create+selfdestruct) so a block with only `balanceChanges` or `storageChanges` preserves the proven `nonce` and `codeHash` from `anchorBlock`!
     - **Storage Slot Folding (EIP-6780 invariance):** If `lastSlotWriteBlock(accountHash, slotHash) > anchorBlock`, the verified BAL `postValue` already in `FlatStateManager` wins (NEVER overwrite live state with stale `anchorBlock` value!). Otherwise, commit proven `slotVal_B` (or proven-empty tombstone if `0x80`) as provably valid at `#Head` — even if `storageRoot` mutated thousands of times since `anchorBlock`.

4. **Shared Immutable `code/` Store & On-Disk `StatyStore` (`packages/ethy/src/persist/sharedCodeStore.ts`, `packages/ethy/src/staty/statyStore.ts`):**
   - **`SharedCodeStore` (`<networkDir>/code/`):** Single content-addressed bytecode store shared by `STATY/0`, `ETHY/0`, `FlatStateManager.coldCodeLookup`, and `devp2p` worker `sharedCodeDisk.ts` (preserving migration/fallback read of legacy pivot `code/` shards).
   - **`StatyStore` (`<networkDir>/staty/`):**
     - Persists verified Hot Epoch manifests and self-proving parts under `staty/epochs/<epochNumber>/` in the exact on-disk layout readable by `devp2p`'s `statyStore.ts`, pruning epochs older than the `2D` (`32` micro-epochs) retention window.
     - Persists verified ad-hoc witnesses under `staty/witnesses/` with bounded LRU disk budget (default `512 MiB`) and automatic eviction of entries with `anchorBlock < localBalEarliestBlock`.

5. **Cryptographic & Adversarial Test Suite:**
   - `packages/statemanager/test/flatStateManager.spec.ts`: Closed-World vs. Open-World bucket mask, proven-empty tombstones cleared on write/BAL, coalesced async miss resolvers, `shallowCopy()` overlay delegation, and zero-leak assertion on closed buckets.
   - `packages/ethy/test/statyCryptoCore.spec.ts`:
     - Real `@ethereumjs/mpt` multi-proof generation + verification for mixed inclusion & exclusion accounts and storage slots.
     - Multi-day witness reuse test: prove a slot at `#B`, apply 50 blocks of verified BALs mutating *other* slots on the same contract (changing `storageRoot` 50 times), and verify `foldWitnessToHead` still proves the untouched slot at `#B + 50`.
     - Per-field account folding test: prove an account at `#B`, apply BAL with `balanceChanges` only (no `nonceChanges`), verify folded account retains `nonce_B` + `codeHash_B` with updated `balance`.
     - Adversarial tests: forged proof node, stale witness (`anchorBlock < localBalEarliestBlock`), overwritten slot (BAL write must win over older witness), mismatched `anchorStateRoot`, oversized `proofNodes` (>4,096), and unsorted keys — all strictly rejected.

---

### Acceptance Criteria (`WP-16b`)
- [x] `FlatStateManager` changes land in a clean, backward-compatible upstream `@ethereumjs/statemanager` commit (**D-008**) with default `closedBucketsMask = 0xffff`.
- [x] `verifyStatyMultiProof` + `StatyWriteIndex` + `foldWitnessToHead` pass core cryptographic and adversarial rejection tests offline in `< 2s`.
- [x] `SharedCodeStore` and `StatyStore` on-disk formats align 1-to-1 with `WP-16a`'s `devp2p` worker readers.
- [x] `npm run tsc` and targeted tests pass in `packages/statemanager`, `packages/ethy`, and `packages/devp2p` (disk reader).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

Three **D-008** commits: `statemanager` → `ethy` → `devp2p` disk reader. Spec: [STATY-0-SPEC.md](../../../../protocols/devp2p/STATY-0-SPEC.md) § 2–4, § 6. **D-143** locks: default `closedBucketsMask = 0xffff`; separate proven-empty tombstone sets (not checkpoint `_tombstones`); `getCodeByHash` sync/cache-only; scratch trie `updateMPTFromMerkleProof` + explicit `root(anchorStateRoot)` with `useKeyHashingFunction: false`; `foldWitnessToHead` pure + `applyFoldedWitness` writer.

### Slice A — `@ethereumjs/statemanager`

`types.ts`, `stateMiss.ts`, `flatStateManager.ts`, tests. Opts: mask, `StateResolutionPolicy`, three `resolve*Miss` hooks. FIFO caps `65_536` / `262_144`. Coalesced in-flight `Map`. `shallowCopy({ resolutionPolicy })` on overlays. `StateMissUnavailableError` on unresolved open-world misses.

### Slice B — `@ethereumjs/ethy`

`src/staty/multiProofVerify.ts`, `writeIndex.ts`, `witnessFold.ts`, `statyStore.ts`; `src/persist/sharedCodeStore.ts`; `test/statyCryptoCore.spec.ts`.

### Slice C — `@ethereumjs/devp2p`

`statyStore.ts` disk parse for `epochs/<e>/manifest.rlp`, part files, witnesses; round-trip test with ethy writer layout.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- Proven-empty sets are separate from checkpoint `_tombstones` (`_provenEmptyAccounts` / `_provenEmptyStorage`).
- `getCodeByHash` stays synchronous; async resolution and `StateMissUnavailableError` apply only on `getCode(address)`.
- Disk magic uses byte constants `0x53 0x54 0x59 0x4d` / `0x50` (manifest / part files) shared by `EthyStatyStore` and `devp2p` `StatyStore`.
- Full EIP-7928 per-field BAL replay in `foldWitnessToHead` defers detailed BAL merge to WP-16c; core keeps anchor + `StatyWriteIndex` slot `keep-live` gate.
- **Coordinator review fixes:** guarded `FlatStateManager` overlay tombstones (`hasAccountTombstone` / `hasStorageTombstone`) so `SSTORE(0) -> SLOAD` stays local and never pollutes root proven-empty tombstones; persisted resolved storage/code to root; keyed miss-coalescing maps by `${policy}:${key}`; cleared/marked proven-empty tombstones inside `applyCompactBinaryBAL` (`consumeBAL`); rewrote `verifyStatyMultiProof` around one shared `MapDB` (`O(P)` hashes using caller `keccak256`) fixing storage-slot verification; fixed `StatyWriteIndex.ingestVerifiedBal` to hash 32-byte storage slot keys and implemented full `encodeCheckpoint`/`loadCheckpoint`; implemented real EIP-7928 per-field BAL folding in `foldWitnessToHead`; fixed RLP multi-byte integer decoding (`NaN` for `>= 256`) in both `devp2p` and `ethy` `StatyStore` + added witness disk persistence/pruning and `SharedCodeStore` LRU cap; refreshed `config/public-api-snapshots/statemanager.json`.
