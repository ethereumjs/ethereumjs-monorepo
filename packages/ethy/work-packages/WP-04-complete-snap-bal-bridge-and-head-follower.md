# WP-04: Complete `snap/1` (Code & Storage), Rolling Pivot BAL Healing, `eth/71` Head Follower & Active `eth/69–71` Serving

- **Status:** `IN_PROGRESS`
- **Dependencies:** `WP-00` (`DONE`), `WP-01` (`DONE`), `WP-02` (`DONE`), `WP-03` (`DONE`), `WP-03b` (`DONE`), `WP-03c` (`DONE`)
- **Branch:** `ethy-wp04`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Complete the end-to-end Amsterdam sync-to-head and P2P serving pipeline in `@ethereumjs/ethy`:
1. **Contract Bytecode (`GET_BYTE_CODES`) & Storage (`GET_STORAGE_RANGES`) Sync:** Alongside or immediately following the 16-bucket account range sync, fetch contract bytecode blobs and storage slots into `FlatStateManager` (and persist them in `SnapPivotStore`).
2. **Rolling Pivot Advancement & "BAL Healing" During Long Syncs (`#P_old` → `#P_new`):** Ensure a `snap/1` sync that takes longer than the 128-block peer state-root retention window (~25 minutes) **never stalls or loses already-synced accounts**. When the network advances past `pivotBlockNumber + 64`, advance the `snap/1` pivot to `#P_new` and apply the intermediate EIP-7928 Block-Level Access Lists (`eth/71` `GET_BLOCK_ACCESS_LISTS` for `#P_old + 1 .. #P_new`) onto `FlatStateManager` (`consumeBAL`) so already-synced accounts/storage are healed forward to `#P_new` while unfinished buckets continue seamlessly against `#P_new`'s `stateRoot`!
3. **Transition to `HEAD_FOLLOWING` & Active Rolling-Window `eth/69–71` Serving:** Once `snap/1` completes (or when entering head-follow mode), follow the canonical chain head block by block (`#N, #N+1, ...`), verifying and applying each block's `eth/71` `BlockLevelAccessList` (`consumeBAL`) with **zero EVM execution**, and pushing each complete `ServableBlockBundle` (`Header + Body + Receipts + BAL`) into `Devp2pWorkerHost`'s `RollingBlockStore` so Ethy actively serves the growing `[earliest .. head]` rolling window to the network!
4. **Unlock the `● HEAD` Domain Lens & Stage-3 Microscope Tools (`/bal`, `/account <0x...>`):** Flip `spine.capabilities.head.status = 'ready'`, populate the `● HEAD Metrics` cockpit box, and replace the WP-01 `/bal` and `/account` stubs with real live state & BAL inspectors.

---

### Key Technical Touch Points & Protocol Mechanics

1. **`snap/1` Bytecode (`0x04`/`0x05`) & Storage (`0x02`/`0x03`) Wire Formats:**
   - **`GET_BYTE_CODES` (`0x04`):** `[reqId, [codeHash1, codeHash2, ...], responseBytes]`. Response **`BYTE_CODES` (`0x05`):** `[reqId, [code1, code2, ...]]`.
     - Verify `equalsBytes(keccak_256(code), requestedCodeHash)` for each returned code (peers may omit codes they do not have, while preserving order) and call `stateManager.putCodeByHash(codeHash, code)`.
   - **`GET_STORAGE_RANGES` (`0x02`):** `[reqId, rootHash, [accountHash1, ...], origin, limit, responseBytes]`. Response **`STORAGE_RANGES` (`0x03`):** `[reqId, [[[slotHash, slotValueRlp], ...], ...], proofNodes]`.
     - Per the `snap/1` spec: if a complete contract's storage is returned (`proofNodes.length === 0`), verify all slots against the account's `storageRoot` (`verifyMerkleRangeProof(account.storageRoot, null, null, slotHashes, slotValuesRlp, null)`). If the last account's storage is partial (`proofNodes.length > 0`), verify with `verifyMerkleRangeProof(account.storageRoot, origin, lastKey, slotHashes, slotValuesRlp, proofNodes)` and queue continuation from `incrementKey32(lastKey)`!
     - Store verified decoded slot values (RLP-decoded inner bytes) via `stateManager.putSnapStorageBatch(accountHash, slots)`.

2. **How Rolling Pivot + "BAL Healing" Works (`#P_old` → `#P_new`):**
   - Live Geth/Reth peers only keep the last **128 block state roots** (~25 minutes) for `snap/1`.
   - While in `SNAP_SYNCING`, `PeerCoordinator` / `BalHeadFollower` monitors `bestPeer.latestBlock`.
   - When `bestPeer.latestBlock >= spine.pivotBlockNumber + 64n` (well before the 128-block cliff!):
     1. Request the contiguous headers + `eth/71` `GET_BLOCK_ACCESS_LISTS` (`0x12` → `0x13`) for blocks `(pivotBlockNumber + 1n) .. newPivotBlockNumber`.
     2. For each block in order: verify `equalsBytes(bal.hash(), header.blockAccessListHash)` (`createBlockLevelAccessListFromRLP` from `@ethereumjs/util`) and apply `await stateManager.consumeBAL(bal.toJSON())`.
     3. Update `spine.pivotBlockNumber = newPivotHeader.number` and `spine.pivotStateRoot = newPivotHeader.stateRoot`.
     4. Unfinished `snap/1` account/storage buckets immediately use the fresh `spine.pivotStateRoot` on their next request from their existing `currentLastHash` cursor, while accounts/slots that were *already* downloaded in earlier buckets are now healed up to `newPivotBlockNumber` via the applied BALs!
   - **Graceful Fallback (Pre-Amsterdam or Missing Peer BALs):** If a peer does not return BALs for the pivot step (e.g. if testing against a pre-Amsterdam network or if a peer pruned BALs), log a diagnostic warning, advance `spine.pivotBlockNumber` + `spine.pivotStateRoot` to the fresh header so `snap/1` never stalls past 128 blocks, and record any accounts touched in future BALs as they arrive.

3. **Block-by-Block `HEAD_FOLLOWING` & Active `eth/69–71` Serving:**
   - Once all 16 account buckets (`0x0..0xf`) and pending code/storage queues finish (or when caught up to `pivotBlockNumber`):
     - Transition `spine.phase = 'HEAD_FOLLOWING'` and `spine.capabilities.head = { status: 'ready', label: 'Following' }`.
     - As connected peers announce new `latestBlock` / `bestHash` (or on periodic head check every 4–6 seconds):
       1. Fetch the new block's Header (`GET_BLOCK_HEADERS`), Body (`GET_BLOCK_BODIES`), Receipts (`GET_RECEIPTS`), and BAL (`GET_BLOCK_ACCESS_LISTS`).
       2. Verify `bal.hash() === header.blockAccessListHash` and apply `await stateManager.consumeBAL(bal.toJSON())` onto `FlatStateManager`.
       3. Update `spine.headBlockNumber = header.number`, `spine.headStateRoot = header.stateRoot`, and `spine.currentSlot = Number(header.number)`.
       4. Register the complete `ServableBlockBundle` (`headerRlp`, `bodyRlp`, `receiptsEth69Rlp`, `balRlp`) with the worker via `client.putServableBlock(bundle)` so `RollingBlockStore` grows up to 64 contiguous blocks `[earliest .. head]` and serves `eth/69–71` peers live!

---

## 2. Key Deliverables (4 Structured Slices)

### Slice 1 — `snap/1` Contract Bytecode & Storage Synchronizer (`src/sync/codeAndStorageSync.ts` & `src/persist/snapStore.ts`)
- Implement `SnapCodeAndStorageSynchronizer` (or integrate into `SnapAccountSynchronizer`):
  - When account ranges are ingested, queue accounts with `codeHash !== KECCAK256_NULL` for batched `GET_BYTE_CODES` (e.g. up to 64 code hashes / 128 KiB per request) and accounts with `storageRoot !== KECCAK256_RLP` for `GET_STORAGE_RANGES`.
  - Verify `keccak_256(code) === codeHash` and storage range proofs (`verifyMerkleRangeProof`), writing into `FlatStateManager` (`putCodeByHash`, `putSnapStorageBatch`) and persisting to `SnapPivotStore` (`code/` and `storage/` journals).
  - Track `codesSynced` and `storageSlotsSynced` on `EthySpine`.

### Slice 2 — Rolling Pivot Advancement ("BAL Healing") & Block-by-Block `eth/71` Head Follower (`src/sync/balSync.ts`)
- Implement `BalSyncAndHeadFollower`:
  - Decodes `eth/71` `BLOCK_ACCESS_LISTS` (`0x13`) via `createBlockLevelAccessListFromRLP`, verifies `bal.hash()` against `header.blockAccessListHash`, and applies `stateManager.consumeBAL(bal.toJSON())`.
  - **During `SNAP_SYNCING`:** Advances the pivot (`#P_old` → `#P_new`) when the chain moves ahead by `>= 64` blocks (or when `snap/1` encounters an expired root), applying the intermediate BALs so `snap/1` never hits the 128-block expiry cliff.
  - **In `HEAD_FOLLOWING`:** Tracks new blocks one by one up to the peer head, applies their BALs to `FlatStateManager`, caches the last 64 parsed BAL summaries in a rolling ring buffer on `EthySpine` (for instant `/bal` and `/account` inspection), and pushes each complete `ServableBlockBundle` to `client.putServableBlock(bundle)` so `Devp2pWorkerHost` serves the growing window!

### Slice 3 — Stage-3 `● HEAD` Cockpit Lens & Microscope Tools (`/bal`, `/account`) (`src/tools/`, `src/tui/`)
- Replace the gated stubs in `src/tools/gated.ts` with real implementations in `src/tools/headTools.ts`:
  - **`/bal` (`inspectLatestBAL`):** Renders a table of the latest block's EIP-7928 `BlockLevelAccessList` (Address, Balance Post-Value, Nonce Post-Value, Storage Writes/Reads, Code Change) plus summary stats in `assistantComment`.
  - **`/account <0x...>` (`inspectAccount`):** Accepts a 20-byte `0x...` address (or 32-byte account hash), queries `FlatStateManager` (`getAccount` / `getAccountByHash` / `getCode`), and scans the rolling BAL window to display the account's live Balance, Nonce, Code Size, Storage Root, and recent block-by-block BAL mutations!
- Update `cockpit.ts` (`● HEAD Metrics` right box) to show `Status`, `Head Block`, `State Root`, and `BAL Window` (e.g. `N blocks · M accounts`).

### Slice 4 — Offline Deterministic Unit & Integration Tests (`test/codeStorageSync.spec.ts` & `test/balSync.spec.ts`)
- **Synthetic `GET_BYTE_CODES` & `GET_STORAGE_RANGES` test:** Extend `SyntheticSnapPeer` to serve contract bytecode blobs and storage tries (both complete storage with `proof = []` and fragmented multi-range storage with Merkle edge proofs) and verify 100% ingestion into `FlatStateManager`.
- **Rolling Pivot BAL Healing + Oracle Equivalence test:**
  1. Seed a state at block `#100` in both `MerkleStateManager` and `FlatStateManager`.
  2. Sync half the buckets (`0x0..0x7`) at `#100`, then advance the pivot to `#103` by applying 3 synthetic EIP-7928 BALs (mutating accounts in both `0x0..0x7` and `0x8..0xf`, deploying a contract, writing/zeroing storage, and deleting an EIP-161 empty account), and finish syncing `0x8..0xf` against `#103`.
  3. Assert that `FlatStateManager` matches `MerkleStateManager` at `#103` 100% across all accounts, contract code, and storage slots!
- **Head-Following + `putServableBlock` test:** Verify that advancing through blocks `#101..#103` transitions `spine.phase` to `'HEAD_FOLLOWING'`, unlocks `/bal` and `/account`, and registers servable blocks in the worker's `RollingBlockStore`.

### Acceptance Criteria
- [ ] `SnapCodeAndStorageSynchronizer` fetches, verifies, and stores contract bytecode (`GET_BYTE_CODES`) and storage ranges (`GET_STORAGE_RANGES`) into `FlatStateManager`.
- [ ] Rolling pivot advancement + BAL application (`consumeBAL`) keeps `FlatStateManager` 100% consistent with `MerkleStateManager` across multi-block BAL sequences and prevents `snap/1` 128-block root expiry.
- [ ] `HEAD_FOLLOWING` applies incoming `eth/71` BALs block by block, pushes complete `ServableBlockBundle`s into `RollingBlockStore`, and unlocks `/bal` and `/account <0x...>` in the TUI.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors across `packages/devp2p`, `packages/statemanager`, and `packages/ethy`.

---

## 3. Concrete Implementation Plan (Planner — Grok 4.7)

Composer implements on branch `ethy-wp04`. **No new npm dependencies.** **No `@ethereumjs/devp2p` change** for snap builders: ethy encodes `GET_BYTE_CODES` and `GET_STORAGE_RANGES` locally (same pattern as `encodeGetAccountRange` in `accountSync.ts`), with `bigIntToUnpaddedBytes` for `reqId` and `responseBytes`.

### Baseline (already shipped)

- **Account snap:** 16 buckets, one in-flight `GET_ACCOUNT_RANGE` per peer, `verifyMerkleRangeProof`, `FlatStateManager.putSnapAccountsBatch`, account journals in `SnapPivotStore`.
- **Pivot + serve seed:** pivot header acquisition + single `putServableBlock` bundle (`peerCoordinator.ts`).
- **State APIs:** `consumeBAL`, `putCodeByHash`, `putSnapStorageBatch` on `FlatStateManager`.
- **Gaps:** `code/` and `storage/` dirs created but never written; `HEAD_FOLLOWING` only in demo; while buckets unfinished, coordinator **refuses** pivot root swap (`Keeping anchored pivot root`); `maybeRefreshPivot` only after all buckets done at `pivot + 96`.

### Design refinements (record in `PROGRESS.md`)

| ID | Decision |
| --- | --- |
| **D-055** | During `SNAP_SYNCING`, heal when `bestPeer.latestBlock >= pivot + 64` (or range proof fails and gap already `>= 64`). Below +64, keep refusing root swap. Drop `PIVOT_STALE_BLOCKS = 96` as snap trigger. Head follow polls every **5 s**. |
| **D-056** | Never pass `expectedStateRoot` into `FlatStateManager.consumeBAL` (`getStateRoot` throws). Oracle test compares accounts, code, slots vs `MerkleStateManager`. |
| **D-057** | One in-flight snap request **per peer** across account, storage, and code. **Generation counter** drops stale replies after pivot heal. Account and code/storage **share** peers so long account sync does not defer code/storage past the 128-block window. |
| **D-058** | Account bucket cursors survive heal. Storage/code tasks remember `storageRoot` / `codeHash` from queuing account body. BAL touching that account cancels task; one-account `GET_ACCOUNT_RANGE` at new root learns new roots, storage restarts at origin zero. Untouched tasks keep cursor. `consumeBAL` does not update `storageRoot` on `Account`. |
| **D-059** | Persist code, storage, heal BAL RLP. `loadInto`: replay origin pivot journals → heal BALs → journals under new root. Keep origin pivot dir until `HEAD_FOLLOWING`; after that, restart loads active pivot only. |
| **D-060** | `/bal` and `/account` unlock at head ready; `/simulate` stays WP-06 stub. Add backwards-compatible `FlatStateManager.getCodeByHash` (separate upstream commit). Spine: latest BAL full JSON + 63 compact summaries in `balWindow`. |
| **D-061** | Complete storage (`proofNodes.length === 0`): `verifyMerkleRangeProof(storageRoot, null, null, keys, values, null, (k) => k)`. Partial: default hasher (D-038). Empty proof list ≠ `null` proof. Verifier values = RLP slot bodies (non-empty); decode once for `putSnapStorageBatch`. |

### Slice 1 — Code & storage sync

**New:** [`src/sync/codeAndStorageSync.ts`](../src/sync/codeAndStorageSync.ts) — `SnapCodeAndStorageSynchronizer`

- `noteAccounts(entries)` after account ingest: queue `codeHash !== KECCAK256_NULL` (batch ≤64 hashes, 128 KiB budget) and `storageRoot !== KECCAK256_RLP` (hashes after `accountBodyFromSlim` expansion).
- One account per `GET_STORAGE_RANGES` (origin = cursor, limit = `0xff…32`).
- **BYTE_CODES:** verify `keccak256(code)` per blob; greedy match to requested hashes; `putCodeByHash`. Short reply = peer miss → requeue once, then diagnostic + drop hash for this pivot.
- **STORAGE_RANGES:** verify per D-061; `hasRight` → `incrementKey32(lastKey)`; complete range marks account done.
- Spine: `codesSynced`, `storageSlotsSynced`.

**Extend:** [`src/sync/snapTransport.ts`](../src/sync/snapTransport.ts) — `sendStorageRanges` (0x02), `onStorageRanges` (0x03), `sendByteCodes` (0x04), `onByteCodes` (0x05). `snapPeers()` stays unused; coordinator `getSnapPeers` authoritative.

**Extend:** [`src/sync/syntheticPeer.ts`](../src/sync/syntheticPeer.ts) — per-account storage trie (`useKeyHashing: false`), code map; full storage (`proof = []`) + fragmented continuation.

**Extend:** [`src/sync/accountSync.ts`](../src/sync/accountSync.ts) — `onAccountsIngested`, `abortInFlight()`, `rootGeneration` for heal; no code/storage wire logic here.

**Extend:** [`src/persist/journal.ts`](../src/persist/journal.ts), [`src/persist/snapStore.ts`](../src/persist/snapStore.ts) — schema **1 → 2**; code/storage/heal-BAL records; `appendCode`, `appendStorageSlots`, `appendHealBal`; `loadInto` per D-059.

**Upstream (separate commit):** [`packages/statemanager/src/flatStateManager.ts`](../../../statemanager/src/flatStateManager.ts) — `getCodeByHash(codeHash): Uint8Array | undefined` + unit test.

### Slice 2 — BAL heal & head follower

**New:** [`src/sync/blockBundle.ts`](../src/sync/blockBundle.ts) — ordered fetch (headers, bodies, eth/69 receipts, `GET_BLOCK_ACCESS_LISTS`) reusing [`pivotHeader.ts`](../src/net/pivotHeader.ts) encoders; chunks ≤64 blocks. Missing BAL: diagnostic + still advance pivot header (fallback). Present BAL must match `blockAccessListHash` or skip apply/serve.

**New:** [`src/sync/balSync.ts`](../src/sync/balSync.ts) — `BalSyncAndHeadFollower`

- **Heal:** abort snap in-flight → apply BALs in order (`consumeBAL(bal.toJSON())`) → `activatePivot` → resume buckets at `currentLastHash` / new `pivotStateRoot` → refresh storage/code tasks (D-058) → `putServableBlock` each healed block in order (contiguous 64-window with pivot bundle).
- **Done:** 16 buckets done + code/storage queues empty → `setPhase('HEAD_FOLLOWING')`, set `headBlockNumber` / `headStateRoot` from pivot.
- **Follow:** every 5 s, fetch `#head+1..` in chunks; verify, `consumeBAL`, update head + `currentSlot`, `putServableBlock`, push `balWindow` entry (cap 64).

**Extend:** [`src/net/peerCoordinator.ts`](../src/net/peerCoordinator.ts) — replace unfinished-root early return with heal trigger (+64); keep existing pivot bundle as block `#P` seed.

**Extend:** [`src/spine/types.ts`](../src/spine/types.ts) — `codesSynced`, `storageSlotsSynced`, `balWindow`; [`createSpine.ts`](../src/spine/createSpine.ts) — head label **Following** in `HEAD_FOLLOWING`.

### Slice 3 — TUI & tools

**Extend:** [`src/tui/cockpit.ts`](../src/tui/cockpit.ts) — head metrics 4 rows: Status, Head Block, State Root, **BAL Window** (`N blocks · M accounts`); pivot stays on Node Pulse.

**New:** [`src/tools/headTools.ts`](../src/tools/headTools.ts) — `inspectLatestBAL`, `inspectAccount` (20- or 32-byte hex; junk → `key_value` error).

**Extend:** [`src/ai/deterministicEngine.ts`](../src/ai/deterministicEngine.ts) — wire head tools when ready; [`gated.ts`](../src/tools/gated.ts) when locked; `/simulate` unchanged (WP-06).

### Slice 4 — Tests (offline CI)

- [`test/codeStorageSync.spec.ts`](../test/codeStorageSync.spec.ts) — synthetic code/storage, bad code rejected, journal round-trip.
- [`test/balSync.spec.ts`](../test/balSync.spec.ts) — merkle oracle at `#100`, half sync, 3 BAL heal to `#103`, finish buckets, flat ≡ merkle; empty-BAL fallback; `HEAD_FOLLOWING` + tools; one in-process worker case for `putServableBlock` serve snapshot.
- Update [`test/intent.spec.ts`](../test/intent.spec.ts), [`test/tui.spec.ts`](../test/tui.spec.ts).

### Finish gates

- `npm run tsc` + `npm test` in `packages/statemanager` (if touched) and `packages/ethy`.
- `npm run spellcheck` on changed files.
- No live P2P, no LLM in default CI.

### Out of scope (this WP)

WP-05 local LLM; WP-06 `/simulate` + EVM; beacon HTTP; inbound `snap/1` serving; devp2p lab snap builders; live Sepolia soak (human after green offline suite).

---

## 4. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **Slice 1 (code/storage):** `SnapCodeAndStorageSynchronizer`, snap transport 0x02–0x05, schema-2 `appendCode` / `appendStorageSlots`, shared `SnapPeerFlightTracker`. **D-061 deviation:** complete storage with empty proof uses default MPT key hasher (not identity `(k) => k`) so offline trie tests and `verifyMerkleRangeProof` agree; partial ranges still use origin-bound proofs.
- **Slice 2 (heal + head):** `blockBundle.ts` sequential fetch; rolling heal walks `#pivot+1..#new` before re-anchor; telemetry **`maybeProactivePivotHeal`** at +64; `HeadBlockFollower` block-by-block catch-up with eth handler wiring; `refreshAfterPivotHeal` + `noteBalApplied` (D-058); `appendHealBal` on disk (full `loadInto` heal replay on restart still TODO — needs async node bootstrap).
- **Slice 3:** `headTools.ts` + cockpit BAL window row; deterministic engine routes `/bal` and `/account` when head ready.
- **Slice 4:** `codeStorageSync.spec.ts` (synthetic code/storage), `balSync.spec.ts` (window, head phase, flat≡merkle oracle, `/bal`); intent/tui specs unchanged (head gating already covered).
- **Upstream:** `FlatStateManager.getCodeByHash` shipped in separate commit on `ethy-wp04`.
- **Remaining before `DONE`:** fuller half-sync + multi-BAL coordinator integration test; optional GET_HEADERS served-bytes assertion (net IT checks `blocksStored` after pivot bundle).
- **2026-10-29 close-out:** `replayPersistedHealBalJournal` + CLI replay on startup; `appendHealBal` persist test; net IT servable pivot + `blocksStored`; `getCodeByHash` unit test in statemanager; `applyBlockBal` tolerates header parse failures when BAL is absent.
