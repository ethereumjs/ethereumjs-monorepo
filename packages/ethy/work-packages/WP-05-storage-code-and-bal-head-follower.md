# WP-05: Contract Storage/Bytecode Sync & Zero-Execution `eth/71` BAL Head Follower

- **Status:** `BLOCKED_BY_WP-03`
- **Dependencies:** `WP-03`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Complete the Amsterdam sync pipeline by adding `snap/1` contract bytecode (`GET_BYTE_CODES`) and storage slot (`GET_STORAGE_RANGES`) fetching for synced contracts, and implement the **healing-free pivot-to-head bridge** using **EIP-7928 Block-Level Access Lists (`eth/71` `GET_BLOCK_ACCESS_LISTS`)**. Once caught up to the head, Ethy transitions `spine.phase` to `HEAD_FOLLOWING` (`● HEAD [Verified]`) and applies each new slot's BAL diff without executing transactions in the EVM.

### Key Technical Touch Points in EthereumJS
1. **`@ethereumjs/util` (`packages/util/src/bal/index.ts`):**
   - Use `createBlockLevelAccessListFromRLP(rlpBytes)` to parse incoming `eth/71` `BLOCK_ACCESS_LISTS` frames.
   - Verify `equalsBytes(bal.hash(), blockHeader.blockAccessListHash)` against the block header commitment!
2. **`@ethereumjs/statemanager` (`packages/statemanager/src/consumeBAL.ts`):**
   - `consumeBAL(stateManager, bal.toJSON(), expectedStateRoot)` already implements the exact EIP-7928 post-state application rules (last `blockAccessIndex` wins for balance, nonce, code, and storage slots; EIP-161 empty accounts with `balance === 0n && nonce === 0n && codeHash === KECCAK256_NULL && storageChanges.length === 0` are deleted).
   - Implement `StateStore.applyBAL(bal)` following the exact same semantics, and test it in unit tests against `@ethereumjs/statemanager`'s `consumeBAL` as an oracle!

### Key Deliverables

1. **Contract Bytecode & Storage Sync (`src/sync/codeAndStorageSync.ts`):**
   - Uses `FlatStateManager` (`putCodeByHash` and `putSnapStorageBatch`) from `@ethereumjs/statemanager` (built in `WP-03`).
   - Queues accounts from `WP-03` that have `codeHash !== KECCAK256_NULL` for batched `GET_BYTE_CODES` requests (verifying `keccak_256(code) === codeHash`).
   - Queues accounts with `storageRoot !== KECCAK256_RLP` for `GET_STORAGE_RANGES` requests (verifying storage proofs via `verifyMerkleRangeProof`).

2. **`eth/71` BAL Exchange & Zero-Execution Applier (`src/sync/balSync.ts`):**
   - Requests block headers and `GET_BLOCK_ACCESS_LISTS` (`EthMessageCodes.GET_BLOCK_ACCESS_LISTS` = `0x12`, response `BLOCK_ACCESS_LISTS` = `0x13`) from `eth/71` peers for blocks after `pivotBlockNumber`.
   - Verifies `bal.hash()` against the header's `blockAccessListHash`.
   - Applies the BAL post-values directly to `FlatStateManager` via `consumeBAL` (recording the `accountHash -> Address` preimage and `slotHash -> slotKey` preimage for every touched account/slot!) and caches the last 64–128 BALs + headers in a rolling in-memory ring buffer so Ethy can also serve `GET_BLOCK_ACCESS_LISTS` to peers at the head ("Good Citizen" head relay) and update `BLOCK_RANGE_UPDATE`.
   - Flips `spine.phase = 'HEAD_FOLLOWING'` and `spine.capabilities.head = { status: 'ready', label: 'Slot #' + slot }`.

3. **Stage-3 BAL Microscope Tools & `HEAD` Domain Lens (`src/tools/balTools.ts`, `src/tui/`):**
   - `inspectLatestBAL`: Summarizes the latest block's `BlockLevelAccessList` in the Main Interaction Area (Band 3) — how many accounts changed balance/nonce/code/storage, top "hot contracts" touched across multiple `blockAccessIndex` transactions, and storage read vs. write counts.
   - `inspectAccountHistoryInBALs`: Given an address (`0x...`), scans the rolling window of recent BALs and renders a table showing every slot/tx (`blockAccessIndex`) where that account's balance, nonce, or storage slots changed.
   - Populate the `● HEAD Metrics` right box in the 3-Box Cockpit with live head block number, verified state root, and latest BAL mutation count, and make `Enter` (when `activeDomain === 'head'` and prompt is empty) open `inspectLatestBAL`.

4. **Tier-1 Unit Test Suite (`test/balSync.spec.ts`):**
   - Oracle equivalence test: Apply a sequence of 5 synthetic EIP-7928 BALs (covering ETH transfers, contract deployment, storage writes, zeroing a slot, and EIP-161 empty-account deletion) to both `FlatStateManager` and `MerkleStateManager` via `consumeBAL` and assert identical post-state for every account and storage slot.
   - Wire test: `GET_BLOCK_ACCESS_LISTS` → `BLOCK_ACCESS_LISTS` RLP decoding, `bal.hash()` verification against `blockAccessListHash`, and transition of `EthySpine` to `HEAD_FOLLOWING`.

### Acceptance Criteria
- [ ] `InMemoryFlatStore.applyBAL` matches `@ethereumjs/statemanager`'s `consumeBAL` 100% across multi-block BAL sequences.
- [ ] `inspectLatestBAL` and `inspectAccountHistoryInBALs` render clean Main Interaction Area tables in virtual framebuffer tests.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
