# WP-04k: Continuous Parallel `eth/71` BAL Streaming, Routine Rolling-Pivot Heartbeat & "The Big Flip" to Live Head

- **Status:** `IN_PROGRESS`
- **Dependencies:** `WP-04h` (`DONE`), `WP-04i` (`DONE`), `WP-04j` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Context & Architectural Vision: Why Pivot Stepping Must Be the Default Heartbeat (Not an Emergency)

On real-world connections (including mobile tethering or Mainnet's ~300M accounts), a full `snap/1` state download frequently spans more than 25 minutes (128 blocks — the maximum state-root retention window of Geth/Nethermind/Reth peers).

Previously (`WP-04a`), we held a single static `pivotStateRoot` (`#P_0`) for the entire `snap/1` download and only started fetching `eth/71` Block-Level Access Lists (`BALs`) *after* `snap/1` finished. That created two problems:
1. **The 25-Minute Cliff:** If `snap/1` takes >20–25 minutes, peers prune `R_0` and start returning empty `[reqId, [], []]` responses, stalling the sync before completion.
2. **Two Disconnected Sync Modes:** `SNAP_SYNCING` and `BAL_CATCHUP` / `HEAD_FOLLOWING` acted like separate worlds rather than one continuous state pipeline.

### The Unified Architecture: Parallel `SNAP` + `BAL` Streaming from Second 0 & Routine Pivot Stepping

Instead of treating pivot movement as an emergency fallback, **continuous `eth/71` BAL streaming and periodic pivot stepping is the single, default way Ethy works from the moment the first pivot header `#P_0` is anchored**:

```text
  t = 0 (Anchor #P_0)
  ├── Stream A (snap/1):  SnapRangeCursor pool downloads accounts/storage against active pivot root R_k
  └── Stream B (eth/71):  BalChainStreamer continuously fetches & verifies blocks #P_k + 1, #P_k + 2, ...
                                │
                                ▼  Every PIVOT_STEP_BLOCKS (e.g. 16 blocks, keeping target <= head - 2)
                    ┌─────────────────────────────────────────────────────────────────┐
                    │ Routine Pivot Step (#P_k → #P_{k+1}, Root R_k → R_{k+1}):       │
                    │ 1. Apply buffered BALs (#P_k + 1 .. #P_{k+1}) onto already-     │
                    │    synced accounts in FlatStateManager (skipping unsynced       │
                    │    key-space ranges that snap/1 will download at R_{k+1}!).     │
                    │ 2. In-flight snap/1 requests keep their per-request flightRoot  │
                    │    (R_k, still valid on peers!) -> ZERO aborted requests!       │
                    │ 3. New snap/1 requests immediately use R_{k+1}!                 │
                    └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼  When last SnapRangeCursor & Code/Storage task finishes
                    ┌─────────────────────────────────────────────────────────────────┐
                    │ ★ THE BIG FLIP TO LIVE HEAD (HEAD_FOLLOWING):                   │
                    │ Gap is already 0..15 blocks! Apply remaining buffered BALs in   │
                    │ < 100ms, light up ● HEAD, show celebration summary in TUI, and  │
                    │ BalChainStreamer continues seamlessly as the live head follower!│
                    └─────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Engineering Invariants & Solutions

### 2.1 Fixing the `@ethereumjs/devp2p` `BLOCK_RANGE_UPDATE` Blind Spot (`eth.ts` & `host.ts`)
- **Bug in current `@ethereumjs/devp2p`:**
  1. In `packages/devp2p/src/worker/host.ts:417`, `peer.subprotocolDispatch` only passes `EthMessageCodes.STATUS` (`'default'`) to `ETH._handleMessage` and intercepts `EthMessageCodes.BLOCK_RANGE_UPDATE` (`'handled'`), so `ETH._handleBlockRangeUpdate` never runs in worker mode!
  2. In `packages/devp2p/src/protocol/eth.ts:155`, `_handleBlockRangeUpdate` emits `'blockRangeUpdate'` but **never updates `this._peerStatus[4..6]`**, so `eth.peerStatusHead()` (`eth.ts:295`) returns the stale `latestBlock` from 20 minutes ago when the peer first connected!
- **Fix in `@ethereumjs/devp2p`:**
  1. In `ETH._handleBlockRangeUpdate` (`packages/devp2p/src/protocol/eth.ts`): when `this._peerStatus !== null && ethUsesBlockRangeStatus(this._version)`, update `this._peerStatus[4] = payload[0]`, `this._peerStatus[5] = payload[1]`, and `this._peerStatus[6] = payload[2]`.
  2. In `Devp2pWorkerHost._wirePeer` (`packages/devp2p/src/worker/host.ts`): allow `EthMessageCodes.BLOCK_RANGE_UPDATE` to run `ETH._handleMessage` (`return 'default'`) and wire `eth.events.on('blockRangeUpdate', () => this._emitTelemetry())` so `peer.latestBlock` and `peer.bestHash` update live!
  3. **Active Tip Polling (`BalChainStreamer`):** Because Geth/Nethermind only broadcast `BLOCK_RANGE_UPDATE` every 32 blocks (~6.4 min), `BalChainStreamer` also probes `GET_BLOCK_HEADERS` for `nextBlock = highestDownloadedBlock + 1n` every `4_000ms` so new 12-second blocks are discovered and fetched continuously even between `BLOCK_RANGE_UPDATE` messages!

### 2.2 Selective `consumeBAL` During `SNAP_SYNCING` (`ConsumeBALOptions` in `@ethereumjs/statemanager`)
Because Amsterdam (`EIP-7928`) BAL APIs (`consumeBAL`, `StateManagerInterface.consumeBAL`, `FlatStateManager.consumeBAL`) are experimental (`@remarks Experimental (Amsterdam)`), we streamline `consumeBAL` directly in `@ethereumjs/common` and `@ethereumjs/statemanager` rather than building ad-hoc BAL filtering loops in Ethy:
- **Streamlined `ConsumeBALOptions` (`@ethereumjs/common` & `@ethereumjs/statemanager`):**
  - Export `ConsumeBALOptions = { expectedStateRoot?: Uint8Array; shouldApplyAccount?: (address: Address) => boolean }` from `@ethereumjs/common` (`packages/common/src/interfaces.ts`) and `@ethereumjs/statemanager` (`packages/statemanager/src/consumeBAL.ts`).
  - `consumeBAL(stateManager, bal, optsOrExpectedStateRoot?: Uint8Array | ConsumeBALOptions)` accepts either a raw `Uint8Array` (`expectedStateRoot`) or `ConsumeBALOptions`.
  - Inside `consumeBAL.ts`, after skipping read-only entries (`balanceChanges.length === 0 && nonceChanges.length === 0 && codeChanges.length === 0 && storageChanges.length === 0`), check `if (shouldApplyAccount !== undefined && !shouldApplyAccount(address)) continue`.
  - Inside `FlatStateManager.consumeBAL(bal, optsOrExpectedStateRoot)` (`packages/statemanager/src/flatStateManager.ts`):
    - Only pin keys in `this._pinnedKeys` for rows that actually mutate state (`balanceChanges.length > 0 || nonceChanges.length > 0 || codeChanges.length > 0 || storageChanges.length > 0`) **and** pass `shouldApplyAccount(address)` (fixing the current behavior where read-only touched accounts in a BAL were unnecessarily pinned!).
    - In `FlatStateManager.deleteAccount`, also `this._pinnedKeys.delete(key)` so EIP-161 deleted accounts do not remain pinned.
- **Which accounts in the BAL should `shouldApplyAccount(address)` accept during `SNAP_SYNCING`?**
  - Compute `accountHash = ethyKeccak256(address.bytes)` (`32` bytes).
  - Check `isAccountHashSynced(accountHash, spine.snapBuckets)`:
    - Look up `bucket = spine.snapBuckets[accountHash[0]! >> 4]!`.
    - If `bucket.status === 'done'`, the hash **is** already synced (`true`).
    - Otherwise, check `bucket.subRanges`: if `accountHash` falls inside any remaining unsynced cursor `[cursor.origin .. cursor.limit]` (`compareBytes32(accountHash, cursor.origin) >= 0 && compareBytes32(accountHash, cursor.limit) <= 0`), then `snap/1` **has not synced this hash yet** (`false`) — it will download the account directly at `#P_{k+1}` (or a later pivot) when the cursor reaches `accountHash`!
    - If `accountHash` is **outside** all remaining `subRanges` of `bucket`, it **was already synced** (`true`)!
  - **For already-synced accounts (`isAccountHashSynced === true`):**
    - `stateManager.consumeBAL(balJson, { shouldApplyAccount })` applies the BAL entry onto `FlatStateManager` (automatically warming the account from `coldAccountLookup` if it was evicted from the 500k hot arena and pinning the updated account in `_pinnedKeys` without double-incrementing `_logicalAccountCount`!).
    - If the BAL modified storage or code on an already-synced account (`acc.storageChanges.length > 0 || acc.codeChanges.length > 0`) while we are still in `Snap Sync · Accounts` (so `SnapCodeAndStorageSynchronizer` hasn't fetched its base storage trie yet and its `storageRoot` in `pendingStorage` is now stale), insert a tiny 1-account cursor `{ origin: accountHash, limit: accountHash, journal: ... }` (or queue a 1-account refresh at the new pivot) so `A`'s new `storageRoot` at `#P_{k+1}` is fetched cleanly!
  - **For not-yet-synced accounts (`isAccountHashSynced === false`):**
    - `shouldApplyAccount` returns `false`, so `consumeBAL` skips mutating or pinning the account in `FlatStateManager` (preventing partial un-synced account creation or double counting), because `snap/1` will download the full authoritative account at `#P_{k+1}` when the cursor arrives!

### 2.3 Zero-Interruption Pivot Rollover (Per-Flight `stateRoot` Tracking)
When `BalChainStreamer` has downloaded and verified `PIVOT_STEP_BLOCKS = 16` contiguous blocks above `spine.pivotBlockNumber` (keeping at least a `SAFE_HEAD_MARGIN = 2n` block buffer below `bestPeerHead` so every connected peer already has the new pivot block):
1. Apply the buffered BALs `#P_k + 1 .. #P_{k+1}` (using sync-aware `applySyncedBalDiff`) in `< 5ms`.
2. Update `spine.pivotBlockNumber = #P_{k+1}`, `spine.pivotStateRoot = R_{k+1}`, `spine.lastVerifiedBlockNumber = #P_{k+1}`, and increment `spine.pivotStepsCompleted`.
3. **Do NOT abort in-flight `snap/1` requests!**
   - Store `stateRoot: Uint8Array` on each `InFlightRange` in `SnapAccountSynchronizer` (and `InFlightStorage` in `SnapCodeAndStorageSynchronizer`) when the request is sent.
   - When an in-flight reply arrives 50ms later, `verifyAccountRange` verifies it against **`flight.stateRoot`** (which is only 16 blocks old and still valid!), ingests the slab, and re-applies any BAL entries from `#P_k + 1 .. #P_{k+1}` that fall inside `[flight.origin .. result.lastKey]`!
   - All newly scheduled `snap/1` requests immediately use the new `spine.pivotStateRoot` (`R_{k+1}`).
4. **Disk Persistence (`SnapPivotStore`):**
   - Because all account journals (`0.bin .. f.bin` and `.seg`) belong to the same continuous sync and are healed forward by the persisted BALs (`heal/<blockNumber>.bal`), `Rollover` updates `pivot.json` / `active.json` in place **without deleting or moving the active `accounts/` directory**!

### 2.4 Transparent TUI Display & "The Big Flip" Celebration (`cockpit.ts`, `widgets.ts`, `createSpine.ts`)
1. **During `SNAP_SYNCING` (Combined `SNAP` + `BAL` Visibility):**
   - **`Node Pulse` (`Target` row):** Shows both the active pivot block, buffered BAL count, and pivot step count:
     - e.g. `#12,055,120 · +8 BALs · piv #4` (when 8 BALs are buffered toward the next 16-block step and 4 pivot steps have completed).
   - **`◐ HEAD` Capability Pill:** Unlocks to `partial` (`◐ HEAD`) as soon as `BalChainStreamer` has downloaded its first BAL block during `SNAP_SYNCING`!
   - **`◐ HEAD Metrics` Box (when cycling to `HEAD` via `Tab` during `SNAP_SYNCING`):**
     - `Status`: `Streaming BALs (piv #4)`
     - `Pivot → Tip`: `#12,055,120 → #12,055,128`
     - `BALs Ready`: `72 streamed · 64 applied`
     - `BAL Window`: `64 blocks · 142 accounts`
2. **At "The Big Flip" (`SNAP_SYNCING` → `HEAD_FOLLOWING`):**
   - **`● HEAD` Capability Pill:** Turns solid `ready` (`● HEAD`).
   - **`Node Pulse` Box (`HEAD_FOLLOWING`):**
     - `Stage`: `★ Head Following · Live`
     - `Target`: `#12,055,140 (live · +0 blk)`
     - `Progress`: `████████████████ 100% (synced)`
     - `State`: `104.2M acc · 64 BALs · piv #12`
   - **Auto-Presented "Synced to Head" Celebration Widget in Zone 2:** When transitioning into `HEAD_FOLLOWING`, if `view.activeWidget` is still the default onboarding view (or null), automatically set `spine.headFlipSummary` / present a `key_value` milestone widget (`"★ Synced to Live Head #12,055,140"`) summarizing total accounts, code/storage, pivot rollovers, and live BAL tracking status, plus a `NoticeBoard` milestone notice!

---

## 3. Implementation Slices

### Slice 1 (`@ethereumjs/devp2p`, `@ethereumjs/common` & `@ethereumjs/statemanager`): Live `BLOCK_RANGE_UPDATE` Head Tracking & Streamlined Amsterdam `ConsumeBALOptions`
1. **`@ethereumjs/devp2p` (`eth.ts` & `host.ts`):**
   - Update `ETH._handleBlockRangeUpdate` in `packages/devp2p/src/protocol/eth.ts` to update `this._peerStatus[4..6]` so `peerStatusHead()` reflects the new `latestBlock` and `bestHash`.
   - Update `Devp2pWorkerHost._wirePeer` in `packages/devp2p/src/worker/host.ts` so `EthMessageCodes.BLOCK_RANGE_UPDATE` is dispatched to `ETH` (`return 'default'`) and triggers `this._emitTelemetry()` on `'blockRangeUpdate'`.
   - Add a unit test in `packages/devp2p/test/` verifying `peerStatusHead()` updates after an inbound `BLOCK_RANGE_UPDATE`.
2. **`@ethereumjs/common` & `@ethereumjs/statemanager` (`interfaces.ts`, `consumeBAL.ts` & `flatStateManager.ts`):**
   - Export `ConsumeBALOptions = { expectedStateRoot?: Uint8Array; shouldApplyAccount?: (address: Address) => boolean }` in `packages/common/src/interfaces.ts` (and re-export from `packages/statemanager/src/consumeBAL.ts`), updating `StateManagerInterface.consumeBAL` and `consumeBAL(stateManager, bal, optsOrExpectedStateRoot?: Uint8Array | ConsumeBALOptions)` across `@ethereumjs/statemanager` implementations.
   - Update `FlatStateManager.consumeBAL` (`packages/statemanager/src/flatStateManager.ts`) so it only pins keys in `this._pinnedKeys` for rows that actually have state mutations (`balanceChanges`, `nonceChanges`, `codeChanges`, or `storageChanges` non-empty) **and** pass `shouldApplyAccount(address)` (and unpins keys in `deleteAccount`).
   - Add unit tests in `packages/statemanager/test/consumeBAL.spec.ts` verifying `shouldApplyAccount` selective filtering and read-only pin avoidance on `FlatStateManager`.

### Slice 2 (`@ethereumjs/ethy`): Continuous `BalChainStreamer` & Zero-Interruption Rolling Pivot (`balSync.ts`, `accountSync.ts`, `peerCoordinator.ts`, `snapStore.ts`)
1. **`BalChainStreamer` (`src/sync/balSync.ts`):**
   - Starts as soon as the initial pivot `#P_0` is anchored in `SNAP_SYNCING` and continues seamlessly through `BAL_CATCHUP` and `HEAD_FOLLOWING`.
   - Polls/fetches `nextBlock = highestFetchedBlock + 1n` (via `startBlockBundleByNumber`, probing every `4_000ms` when caught up to `bestPeerHead` so new blocks are discovered even before `BLOCK_RANGE_UPDATE`).
   - Buffers verified `(blockNumber, stateRoot, headerRlp, balRlp, balJson)` entries in memory and persists `.bal` files in `SnapPivotStore`.
2. **Routine Pivot Rollover (`PIVOT_STEP_BLOCKS = 16n`):**
   - Whenever `BalChainStreamer` has `>= 16` buffered blocks above `spine.pivotBlockNumber` (or fewer if `Snap Sync` buckets are `100%` done and transitioning to head):
     - Run sync-aware BAL application (`applySyncedBalDiff`: applies BAL entries where `isAccountHashSynced(hash, spine.snapBuckets)` is `true`, and records a mini-window of those 16 BALs for any in-flight `R_k` requests that complete shortly after).
     - Advance `spine.pivotBlockNumber`, `spine.pivotStateRoot`, `spine.lastVerifiedBlockNumber`, and `spine.pivotStepsCompleted` without wiping `accounts/` journals (`snapStore.updatePivotHead(...)`).
     - Keep in-flight `SnapAccountSynchronizer` / `SnapCodeAndStorageSynchronizer` requests alive by verifying each reply against its `flight.stateRoot`!

### Slice 3 (`@ethereumjs/ethy`): Combined `SNAP + BAL` TUI & "The Big Flip" Celebration (`cockpit.ts`, `types.ts`, `session.ts`)
1. Add `pivotStepsCompleted: number` and `streamedBalCount: number` to `EthySpine`.
2. Update `cockpit.ts` (`Node Pulse` and `HEAD Metrics`) and `createSpine.ts` (`deriveCapabilities`) so `HEAD` shows `partial` (`◐ HEAD`) during `SNAP_SYNCING` once BALs are streaming, `Node Pulse` `Target` shows `#Pivot · +N BALs · piv #M`, and `HEAD_FOLLOWING` renders the `★ Head Following · Live` state + milestone notice and summary widget.
3. Add deterministic end-to-end tests in `packages/ethy/test/balCatchUp.spec.ts` and `test/tui.spec.ts` covering:
   - Continuous BAL streaming alongside `SnapAccountSynchronizer` across a 16-block pivot rollover with in-flight `R_k` range replies completing without abort,
   - Sync-aware `consumeBAL` (applying to synced ranges while skipping unsynced `subRanges` without double-counting `_logicalAccountCount`),
   - Seamless transition ("The Big Flip") into `HEAD_FOLLOWING` with `100%` progress and `★ Head Following · Live` TUI rendering.

---

## 4. Acceptance Criteria & Verification Gates

- [ ] `@ethereumjs/devp2p`: `ETH._handleBlockRangeUpdate` updates `_peerStatus` and `Devp2pWorkerHost` emits updated `latestBlock`/`bestHash` telemetry on inbound `BLOCK_RANGE_UPDATE`.
- [ ] `@ethereumjs/common` & `@ethereumjs/statemanager`: `consumeBAL` accepts `ConsumeBALOptions` (`{ expectedStateRoot?, shouldApplyAccount? }`) and `FlatStateManager.consumeBAL` only pins mutated accounts that pass `shouldApplyAccount` (skipping read-only touches and unpinning deleted EIP-161 accounts).
- [ ] `@ethereumjs/ethy`: `BalChainStreamer` streams and verifies blocks + `eth/71` BALs in parallel with `SNAP_SYNCING` starting from `#P_0 + 1`, and steps the pivot forward every `16` blocks without aborting in-flight `snap/1` requests or wiping `accounts/` journals.
- [ ] `@ethereumjs/ethy`: Sync-aware BAL application (`consumeBAL(balJson, { shouldApplyAccount })`) updates already-synced accounts in `FlatStateManager` without double-counting or corrupting unsynced `subRanges`.
- [ ] `@ethereumjs/ethy`: TUI surfaces live BAL streaming + pivot steps during `SNAP_SYNCING` (`◐ HEAD`) and celebrates the flip into `★ Head Following · Live` (`● HEAD`).
- [ ] `npm run tsc`, `npm test` (`test:node`), and `npm run spellcheck` pass across `@ethereumjs/common`, `@ethereumjs/statemanager`, `@ethereumjs/devp2p`, and `@ethereumjs/ethy`.

---

## 5. Concrete Implementation Plan (Planner — Grok 4.7)

Today snap holds one static pivot (**D-062**). `HeadBlockFollower` starts only in `BAL_CATCHUP` / `HEAD_FOLLOWING`. Account proofs verify against live `spine.pivotStateRoot`. `activatePivot` keys the journal directory by state root and would orphan `accounts/` on every step. Worker dispatch in `host.ts` posts eth messages before `ETH._handleMessage`; `_handleBlockRangeUpdate` does not write `_peerStatus[4..6]`. `FlatStateManager.consumeBAL` pins every BAL row before the helper runs.

### Design refinements (D-083)

- **Stable journal directory.** Do not call `activatePivot` or `bumpRootGeneration` on a step. `updatePivotHead` rewrites `pivot.json` in place; `active.json.stateRoot` stays the directory key from first anchor.
- **One streamer.** `BalChainStreamer` in `balSync.ts`; `HeadBlockFollower` alias. Start at first pivot anchor during `SNAP_SYNCING`. Leave dormant `healSeq` unused.
- **Late replies.** Per-flight `stateRoot` + `pivotBlockNumber`; applied-BAL log (cap 64); re-apply on slab commit for hashes in range.
- **Point refresh cursors** (`refresh: true`) for BAL storage/code touches during account sync; progress math ignores them.
- **Celebration one-shot** via `headFlipSummary` → `session.ts` when widget null.
- **Catch-up for laptop wake only** when disk gap exceeds buffer; routine step at 16 blocks, `SAFE_HEAD_MARGIN = 2`.

| Slice | Package | Work |
| --- | --- | --- |
| 1 | `@ethereumjs/devp2p` | `_peerStatus[4..6]` on `BLOCK_RANGE_UPDATE`; worker `'default'` route + telemetry; tests |
| 1 | `@ethereumjs/common`, `@ethereumjs/statemanager` | `ConsumeBALOptions`, selective pin/unpin, unit tests |
| 2 | `@ethereumjs/ethy` | `BalChainStreamer`, `syncedAccountHash.ts`, pivot step, per-flight roots, `updatePivotHead`, coordinator wiring |
| 3 | `@ethereumjs/ethy` | Spine counters, cockpit HEAD partial + flip celebration, tests |

**Gates:** `tsc`, `npm test` in common, statemanager, devp2p, ethy; spellcheck. Three atomic commits when shipping: devp2p → common+statemanager → ethy.

---

## 6. Implementation Notes & Deviations (Implementer — Composer 2.5)

- Shipped Slice 1–3 on branch: `devp2p` `BLOCK_RANGE_UPDATE` → `_peerStatus` + worker `'default'` route; `ConsumeBALOptions` + selective `FlatStateManager` pin/unpin; `BalChainStreamer` (alias `HeadBlockFollower`) with 16-block pivot steps, per-flight `stateRoot`, `updatePivotHead`, TUI flip copy, and tests.
- **Follow-up landed:** late-reply BAL re-apply on slab commit (`replayAppliedBalsForSlab`), storage/code `refresh` cursors + progress math, upstream CHANGELOG bullets. Worker peer `latestBlock` in telemetry IT deferred — eth/71 mesh does not yet surface remote STATUS head in snapshots (`blockRangeUpdate.spec.ts` covers `peerStatusHead()`).
