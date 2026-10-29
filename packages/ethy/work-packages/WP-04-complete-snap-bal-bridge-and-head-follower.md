# WP-04: Complete `snap/1` (Code & Storage), Rolling Pivot BAL Healing, `eth/71` Head Follower & Active `eth/69–71` Serving

- **Status:** `READY_FOR_PLANNING`
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

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 4. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
