# WP-16d: `@ethereumjs/ethy` — `ETHY/0` `v0.3` Full Code & Storage Swarm + Hybrid `--full` Background Sync (Open-World → Closed-World)

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-16a` (`READY_FOR_PLANNING`), `WP-16b` (`READY_FOR_PLANNING`), `WP-16c` (`READY_FOR_PLANNING`), `WP-06f` (`DONE`), `WP-11b` (`DONE`), [`protocols/devp2p/ETHY-0-SPEC.md`](../../../../protocols/devp2p/ETHY-0-SPEC.md) (`v0.3`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Complete the **`ETHY/0` `v0.3`** client & seeder side for **all three state planes (`Accounts`, `Bytecode`, `Storage`)** and introduce opt-in **`--full`** mode where Ethy boots immediately live via **`STATY/0`** (`3–5 min`) while replicating 100% of world state in the background via **`ETHY/0`** (or `SNAP/1` fallback) — flipping each of the 16 nibble buckets atomically from **Open-World** to **Closed-World (100% zero-leak read privacy + Tier-2 MPT-free seeding)** with zero downtime to live RPC or head following.

---

### Key Deliverables (`WP-16d`)

1. **CLI Sync Tier Flags (`packages/ethy/src/cli/args.ts`):**
   - Add first-class node state tier flag:
     - Default (`--mode staty` / omitted): fast `STATY/0` active-state mode (`3–5 min`, `~3–10 GB`).
     - Opt-in `--full` (`--mode full`): starts immediately live with `STATY/0`, while running full 3-plane `ETHY/0` (or `SNAP/1`) world-state sync in the background.
   - Preserve `--sync-mode auto | ethy | snap` for explicit transport control and local 2-node seeding tests.

2. **3-Plane Completeness Accounting & Honest `ETHY/0` `v0.3` `STATUS` (`packages/ethy/src/persist/snapStore.ts`, `src/net/ethyAdvertise.ts`):**
   - Extend `ActiveMeta` in `SnapPivotStore` to track per-nibble (`0..15`) completeness across all three planes:
     - `ethyBucketsBitmask` (accounts `0..15`)
     - `ethyStorageBucketsBitmask` (storage `0..15`)
     - `ethyCodeBucketsBitmask` (distinct `codeHashes` referenced by accounts in bucket `0..15`)
   - Advertise all three bitmasks honestly in outbound `ETHY/0 STATUS (0x00)` (`v0.3` 11-tuple), setting a storage or code bit **only** after 100% of contracts in that bucket are verified at `basePivotBlock` (plus BAL replay to `#Head`) and servable on disk.
   - Persist `storage/<nibble>.bin` (64-byte packed `BinaryStorageSlot` slabs) + `storage/<nibble>.proof.idx` (large multi-chunk contracts **only**; zero proof sidecar bytes for complete-trie small contracts!) during BOTH `SNAP/1` (`SnapCodeAndStorageSynchronizer`) and `ETHY/0` sync, and persist all bytecodes into the unified `SharedCodeStore` (`<networkDir>/code/`).

3. **`ETHY/0` `v0.3` Code & Storage Swarm Synchronizer (`packages/ethy/src/sync/ethyCodeStorageSync.ts`):**
   - Once account bucket `b` is verified (giving every contract's exact `(accountHash, storageRoot, codeHash)`), sync bucket `b`'s bytecode and storage over `ETHY/0` `0x05`/`0x06` from peers advertising `codeBucketsBitmask & (1 << b)` / `storageBucketsBitmask & (1 << b)`:
     - **Bytecode (`kind = 0`):** Batch up to `64` missing `codeHashes` per request; verify `keccak256(code) === codeHash`; write to `SharedCodeStore` (skipping hashes already populated by `STATY/0`!).
     - **Small Contracts (`kind = 2`):** Batch up to `64` `[accountHash, storageRoot]` pairs per request; verify each returned `slotsSlab64B` by rebuilding the complete storage MPT root in `SnapVerifyPool` (`computedRoot === storageRoot`, zero `proofNodes`); commit to `FlatStateManager` + `storage/<b_hex>.bin`.
     - **Large Contracts (`kind = 1`):** For any contract omitted from `kind = 2` (too large to fit as a complete trie), cursor-stream `originSlotHash` → `lastSlotHash + 1` until `hasRight === 0`; verify `verifyMerkleRangeProof` against `storageRoot` at `chunkBlockNumber`; replay verified BALs `(chunkBlockNumber + 1 .. #Head)` on `[originSlotHash .. lastSlotHash]`; persist `slotsSlab64B` + `.proof.idx` sidecar!
     - **Per-Plane Peer Fallback:** If connected `ETHY/0` peers are `v0.2` accounts-only (`storageBucketsBitmask === 0`) or lack bucket `b`'s storage/code, seamlessly fall back to `SNAP/1` (`SnapCodeAndStorageSynchronizer`) for missing code/storage while keeping `ETHY/0` for accounts — and immediately seed all three planes over `ETHY/0` `v0.3` once verified!

4. **Background Full-State Backfill & Atomic Per-Bucket Closed-World Flip (`packages/ethy/src/sync/hybridFullBackfill.ts`):**
   - In `--full` mode, run `ETHY/0` (or `SNAP/1`) account + code + storage sync in a rate-limited background lane (`ResourceBudget`-aware) while live `HEAD_FOLLOWING`, `STATY/0` serving, JSON-RPC, and AI storytelling remain 100% responsive.
   - As each bucket `b` (`0..15`) finishes:
     1. Accounts at `basePivotBlock` verified,
     2. 100% of bucket `b`'s contract bytecodes in `SharedCodeStore`,
     3. 100% of bucket `b`'s contract storage verified + BAL-replayed to `#Head`,
     atomically invoke `stateManager.markBucketClosed(b)` and emit updated `ETHY/0 STATUS`!
   - From that instant onward, all RPC/EVM reads targeting bucket `b` are answered 100% locally in Closed-World mode (zero `STATY/0` or `snap/1` network lookups, 100% read privacy).
   - Once all 16 buckets are closed (`closedBucketsMask === 0xffff`), keep `STATY/0` serving active (re-serving cached witnesses, `code/`, and `eth/71` BALs) while upgrading the node to a full Tier-2 `ETHY/0` `v0.3` seeder.

5. **End-to-End Integration Tests (`packages/ethy/test/ethyV03FullSync.spec.ts`):**
   - **3-Plane `ETHY/0` `v0.3` Loopback:** Node A holds verified accounts + bytecode + small complete-trie contracts + a multi-chunk large contract (requiring `kind = 1` cursor-streaming with boundary proofs); Node B syncs all three planes **100% over `ETHY/0` `v0.3`** (`zero` `snap/1` calls), verifies every root/proof, and flips `closedBucketsMask` to `0xffff`.
   - **`v0.2` Interop Test:** Confirm `v0.3` joiner cleanly handles a `v0.2` 9-tuple accounts-only peer (`storageBucketsBitmask === 0`, `codeBucketsBitmask === 0`) without disconnecting or stalling.
   - **Hybrid `--full` Open-World → Closed-World Transition Test:** Run `eth_call` continuously while bucket `0x0` transitions from Open-World (`STATY/0`) to Closed-World (`ETHY/0`), asserting zero failed RPC calls and zero network witness lookups on bucket `0x0` after flip.

---

### Acceptance Criteria (`WP-16d`)
- [ ] `ethy --full` boots immediately live via `STATY/0` and completes full 3-plane world state in the background without stalling live `HEAD_FOLLOWING` or JSON-RPC.
- [ ] `ETHY/0` `v0.3` `kind = 0`, `kind = 1` (64B slab + sidecar), and `kind = 2` (batched small contracts, zero sidecars) sync and re-serve cleanly with cryptographic proof verification.
- [ ] Each completed bucket atomically flips `FlatStateManager` to Closed-World (`closedBucketsMask`) and advertises honest per-plane bitmasks in `ETHY/0 STATUS`.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5)*
