# WP-04a: P2P Connection Reliability, VIP Peer Retention, Single-Pivot `snap/1` Discipline & `--fresh` Canary

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-00`–`WP-03c` (`DONE`)
- **Branch:** `ethy-wp04-continuation`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Strategic Context & Root-Cause Forensics

During `WP-03c` (#4422) and the initial `WP-04` pass (#4423), live P2P peer retention and `snap/1` continuation degraded noticeably compared to `WP-03b` (#4421, where 3.48M Sepolia accounts synced smoothly at ~6,000 acc/sec).

Codebase diffing between `f504b220e` (`WP-03b`) and `618d64837` (`WP-04`) identified **four exact regressions** that caused peers to drop and sync to stall:

### The 4 Regressions to Fix in `WP-04a`

1. **Regression 1 — Unbacked `STATUS` Head Pin (`packages/ethy/src/net/genesisStatus.ts`):**
   - `HANDSHAKE_HEAD_PIN` advertises `earliestBlock = #12,019,263, latestBlock = #12,019,263, bestHash = 0x07bc64d8...` in outbound `eth/69+` `STATUS` while `RollingBlockStore` is **empty (`blocksStored = 0`)**!
   - When a remote Geth/Reth peer receives our `STATUS`, it immediately sends `GET_BLOCK_HEADERS` for `0x07bc64d8...` to verify our announced head. Because `RollingBlockStore` does not hold `#12,019,263`, we reply `BLOCK_HEADERS: []`, and the peer scores us as faulty/useless and drops us!
   - **Fix:** At startup (before a servable block bundle is loaded into `RollingBlockStore`), outbound `eth/69+` `STATUS` must advertise **`earliestBlock = 0, latestBlock = 0, latestBlockHash = genesisHash`** (or we must pre-load the genesis block / stored pivot bundle into `RollingBlockStore` *before* advertising it in `STATUS`). Once a real `ServableBlockBundle` is stored, update the worker's `STATUS` fields and `BLOCK_RANGE_UPDATE` to match that actual stored block!

2. **Regression 2 — 1-Hour Lockout of Our Best `snap/1` Peers on `TOO_MANY_PEERS` (`packages/ethy/src/persist/peerBook.ts:26`):**
   - `PEER_TOO_MANY_PEERS_HOLD_MS` is currently set to **`60 * 60 * 1000` (1 full hour!)**.
   - When restarting Ethy within a few seconds/minutes of a previous run, the remote Geth/Nethermind peer often still has our old TCP session in closing state (or is briefly full) and replies `TOO_MANY_PEERS`. `PeerBookStore` immediately bans that peer for 60 minutes! Within 2–3 restarts, all reliable `snap/1` peers on Sepolia are locked out of `peers.json`.
   - **Fix — VIP Peer Retention & Gentle Backoff:**
     - Peers with `snapResponsesOk > 0` are **Tier-S (VIP) `snap/1` peers**.
     - Replace the 1-hour `PEER_TOO_MANY_PEERS_HOLD_MS` with a short exponential backoff: **`15s → 30s → 60s` (capped at 120s for VIP peers, 5 min for unverified peers)**, resetting immediately on successful connection.
     - Add a **VIP Reconnect Loop** in `PeerCoordinator` (every 15s): whenever active `snap/1` peers `< 4`, check `peerBook.dialCandidates(now)` and gently re-dial any eligible VIP peers whose backoff timer has elapsed!

3. **Regression 3 — Unfiltered Multi-Peer Message Collision in `blockBundle.ts` (`packages/ethy/src/sync/blockBundle.ts:142`):**
   - Look at `blockBundle.ts:142`:
     ```ts
     if (msg.peerId !== bundle.peerId) return 'failed'
     ```
     And in `peerCoordinator.ts:695`: every inbound `eth` message from *any* connected peer is passed into `handleBundleEthMessage`!
     Whenever Peer A is in the middle of a multi-step bundle fetch (`headers` → `bodies` → `receipts` → `bal`), and **Peer B** sends us any `eth` message (or an unrelated `BLOCK_HEADERS`), `msg.peerId !== bundle.peerId` returns `'failed'` and **aborts Peer A's in-flight bundle fetch!**
   - **Fix:** If `msg.peerId !== bundle.peerId` (or if `msg.code` is not the expected response code for `bundle.stage`, or the `reqId` does not match), `advanceBlockBundleEthMessage` must return **`'ignore'`** (`false`), **NOT `'failed'`**!

4. **Regression 4 — `SnapCodeAndStorageSynchronizer` Starving Account Sync & Mid-SNAP Pivot Switching Orphaning Disk Journals:**
   - Starting `GET_STORAGE_RANGES` and `GET_BYTE_CODES` on the very first batch of 2,000 accounts (`onAccountsIngested`) steals `SnapPeerFlightTracker` slots from `SnapAccountSynchronizer` and bombards our few `snap/1` peers with hundreds of single-account storage requests.
   - Furthermore, switching `pivotStateRoot` mid-SNAP (`maybeProactivePivotHeal` in `peerCoordinator.ts:758`) created a second empty directory `pivots/<newRoot>/` on disk while leaving the 3.48M accounts in `pivots/<oldRoot>/`.
   - **Fix — Single-Pivot `snap/1` Discipline & Sequential Sub-Stages:**
     - **Hard Architectural Rule:** A `snap/1` base sync (`Accounts` → `Code & Storage`) **always targets ONE fixed `pivotStateRoot` (`#P`)**. We **never** switch `pivotStateRoot` while `snap/1` is unfinished!
     - **Sequential Sub-Stages within `SNAP_SYNCING`:**
       1. First, `SnapAccountSynchronizer` gets **100% of `snap/1` peer slots** until all 16 account buckets (`0x0..0xf`) reach `done` (maximizing account download speed to finish well within the 25-minute window!).
       2. On startup (`SnapPivotStore.loadInto`), as account journal records are loaded into `FlatStateManager`, also populate `codeSync.noteAccounts(...)` so any accounts with `codeHash !== KECCAK256_NULL` or `storageRoot !== KECCAK256_RLP` are queued even after a restart!
       3. Once all 16 account buckets are `done`, `SnapCodeAndStorageSynchronizer` runs at full speed to fetch remaining bytecode and storage ranges for `#P`.

---

## 2. The 3-Rule Startup & Resume Heuristic (Plus `--fresh` CLI Flag)

To keep sync state 100% predictable and never end up with a half-healed "Frankenstein" state across different roots:

1. **New `--fresh` CLI Flag (`ethy sepolia --fresh`):**
   - Wipes `networks/<network>/pivots/` and `active.json` (starting state sync from a clean slate), while **preserving `peers.json` and `discovery-nodes.json`** so development/testing runs keep fast VIP peer pickup!
2. **Automatic 3-Rule Resume Heuristic on Normal Startup (`ethy sepolia`):**
   - **Case 1 — No saved pivot on disk (or `--fresh`):** Anchor fresh pivot `#H` from the best peer and start `snap/1` from `0%`.
   - **Case 2 — Unfinished `snap/1` on disk (`pivotBlockNumber = #P`):**
     - When the first peer announces `latestBlock = #H`, check the age of `#P`: **`gap = #H - #P`**.
     - **If `gap <= 90n` (~18 minutes):** `#P` is still well inside the 128-block peer `snap/1` window! Keep `#P` and seamlessly resume `snap/1` from the saved bucket cursors. Post notice: `Resuming snap sync at #P (X% complete)`.
     - **If `gap > 90n` (saved partial `snap/1` is too old / expired on peers):** Automatically discard the stale partial `pivots/` directory, anchor the fresh `#H` as the new pivot, and start a clean `snap/1` sync! Post a clear `warn` notice on `NoticeBoard`: `Saved partial snap (#P, +<gap> blocks) expired — starting fresh at #H`.
   - **Case 3 — Completed `snap/1` base state on disk (`baseSyncComplete: true` at `#P`):**
     - Never re-run `snap/1`! Hand off directly to `BAL Catch-Up` (`#P → #H`) (implemented in `WP-04b`).

---

## 3. Deterministic P2P Canary & Multi-Peer Regression Suite

1. **Multi-Peer Chaos & Routing Unit Test (`packages/ethy/test/p2pReliability.spec.ts`):**
   - Tests that while Node A is fetching a 4-stage `BlockBundle` (`headers` → `bodies` → `receipts` → `bal`) from Peer 1, Peer 2 sending unrelated `ETH` messages (`BLOCK_RANGE_UPDATE`, `BLOCK_HEADERS`, etc.) is cleanly ignored (`'ignore'`) and **never** aborts Peer 1's bundle fetch.
   - Tests that a VIP peer (`snapResponsesOk > 0`) disconnecting with `TOO_MANY_PEERS` is eligible for redial after `15s` (not 1 hour!) and is automatically redialed by the VIP Reconnect Loop.
   - Tests the 3-Rule Resume Heuristic (`--fresh` wipes `pivots/` but keeps `peers.json`; unfinished pivot with `gap <= 90` resumes; unfinished pivot with `gap > 90` resets cleanly to `#H` and posts to `NoticeBoard`).
2. **Live 15-Second P2P & SNAP Canary Script (`npm run p2p:canary` in `packages/ethy`):**
   - Connects to live Sepolia (using `peers.json` + DNS), runs for 15 seconds, and prints a deterministic JSON/console health report:
     - `timeToFirstStatusMs`
     - `sustainedPeersAt15s` & `unexpectedDisconnects`
     - `pivotAnchoredBlock`
     - `snapRangesSucceeded` & `accountsIngested`
     - Overall verdict: `PASS` / `FAIL`.

---

## 4. Acceptance Criteria
- [ ] Outbound `eth/69+` `STATUS` advertises `earliestBlock = 0, latestBlock = 0, latestBlockHash = genesisHash` until a real servable block bundle is in `RollingBlockStore`.
- [ ] `PeerBookStore` uses short backoff (`15s → 30s → 60s`, max `120s` for VIP `snap/1` peers) on `TOO_MANY_PEERS`, and `PeerCoordinator` runs a periodic VIP Reconnect Loop when active `snap/1` peers `< 4`.
- [ ] `advanceBlockBundleEthMessage` ignores (`'ignore'`) messages from other peers instead of returning `'failed'`.
- [ ] `SnapAccountSynchronizer` runs without mid-SNAP pivot switching and without `SnapCodeAndStorageSynchronizer` stealing peer slots until account buckets finish (and `loadInto` queues restored contract accounts for code/storage).
- [ ] `ethy sepolia --fresh` wipes `pivots/` while preserving `peers.json`, and stale partial pivots (`gap > 90` blocks) auto-reset cleanly with a `NoticeBoard` message.
- [ ] `test/p2pReliability.spec.ts`, `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 5. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 6. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
