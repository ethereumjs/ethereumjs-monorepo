# WP-06d: Stateful Session Resume Coordinator, Multi-Hour BAL Pivot Bridging & Slot/Head Telemetry Alignment

- **Status:** `DONE`
- **Dependencies:** `WP-04k` (`DONE`), `WP-05b` (`DONE`), `WP-06c` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Close the gap between a **fresh-boot sync** and a **paused/resumed client session** (closing the laptop or stopping the client for 5 minutes to several hours and starting it again).

Right now, resuming a partially synced client suffers from **five concrete architectural bugs** that freeze BAL streaming, freeze the TUI's `Slot` and `Target` displays, risk silent state corruption across restarts, and unnecessarily throw away millions of synced accounts whenever a pause exceeds ~18 minutes (`90` blocks).

**WP-06d** introduces a dedicated **`ResumeCoordinator` (`packages/ethy/src/sync/resumeCoordinator.ts`)** and generalizes our **BAL Pivot Bridging** so that:
1. **Resumed `SNAP_SYNCING` immediately starts `BalChainStreamer`** and keeps rolling the pivot forward seamlessly from disk.
2. **Upper-right `Slot` and `Node Pulse` `Target` are cleanly decoupled and live-updated:** the top bar displays the true **Consensus Layer Beacon Slot** (from `@ethereumjs/beacon-light`, falling back to EL head block when P2P-only), while `Node Pulse` `Target` shows the live **Pivot → Tip** and **BAL Bridge** progress.
3. **100% Data-Consistent Partial-State Resume:** when `BalChainStreamer` applies BALs on a resumed session where resident memory holds only a 256-row tail warmup, `FlatStateManager` hydrates cold on-disk accounts (`coldAccountLookup`) before mutating them so a BAL touch never overwrites an existing disk account's balance/nonce/codeHash with a blank default account!
4. **Persisted Unapplied BAL Buffer (`heal/` journal):** verified BALs streamed during `SNAP_SYNCING` (`#P + 1 .. #Tip`) are persisted and replayed into `BalChainStreamer` on restart so we never lose in-progress 16-block pivot windows across a restart.
5. **Multi-Hour BAL Pivot Bridging (Replacing the 18-Minute Wipe):** instead of wiping `pivots/` whenever a partial `snap/1` snapshot is `> 90` blocks old (`SNAP_RESUME_MAX_GAP = 90n`), Ethy bridges any gap up to **`MAX_BAL_BRIDGE_BLOCKS = 900n` (~3 hours)** (or `14,400n` when an `ETHY/0` peer serves the range) by streaming the missing BALs `#P + 1 .. #Head - 16`, advancing `#P` into the live `snap/1` 128-block serving window, and only then resuming `snap/1` bucket downloads!

---

## 2. Root-Cause Forensics (What Happened on the Resumed Run)

### 2.1 Bug #1: Why BALs Stopped Coming In on Resume (`finishDiskHydrate` never started `BalChainStreamer`!)
Look at `finishDiskHydrate` in `packages/ethy/src/net/peerCoordinator.ts`:
- On a **fresh boot**, `commitPivotAnchor()` calls **both** `ensureSnapSync(client)` **and** `ensureHeadFollower(client)`.
- On a **resumed partial sync** (`!peek.baseSyncComplete`), `finishDiskHydrate()` calls `ensureSnapSync(client)`, and then calls `finishDiskResumeWithHead(BigInt(best.latestBlock))`.
- And what does `finishDiskResumeWithHead` do?
  ```ts
  const finishDiskResumeWithHead = (headBlock: bigint): void => {
    if (snapStore === undefined || !diskHydrated) return
    if (handoffCatchup) { // <-- FALSE when resuming partial SNAP_SYNCING!
      spine.bestPeerHead = headBlock
      seedBalCatchUp(spine, headBlock)
      ensureHeadFollower(client)
      ...
    }
    deriveCapabilities(spine)
  }
  ```
- Because `handoffCatchup` is `false` during a partial `SNAP_SYNCING` resume, **`ensureHeadFollower(client)` is NEVER called on resume!** `BalChainStreamer` is never instantiated, `streamedBalCount` stays `0` forever, and zero BALs are ever fetched!

### 2.2 Bug #2: Why the Upper-Right `Slot` Was Stuck and Identical to `Node Pulse` `Target`
1. **Conflation of `spine.currentSlot` with `pivotBlockNumber`:**
   - In `snapStore.ts` (`loadIntoAsync`: line 434):
     ```ts
     spine.pivotBlockNumber = BigInt(pivot.blockNumber)
     spine.currentSlot = Number(pivot.blockNumber)
     ```
   - And in `consensusTracker.ts` (`syncSpineFromClient`):
     - `consensusTracker` sets `spine.clOptimisticSlot = head.slot`, **but never updates `spine.currentSlot`!**
   - And in `BalChainStreamer` (`balSync.ts`: line 333):
     - `spine.currentSlot` was only updated inside `finishCatchUpBlock()` — which wasn't running because of Bug #1!
2. **Result in the TUI:**
   - Upon resume, `spine.currentSlot` (displayed in the upper-right header as `Slot 12071120`) was set to the **saved EL `pivotBlockNumber`** (`12071120`) — not the Beacon slot!
   - Meanwhile, in `cockpit.ts` (`snapTargetRow`), because `streamedBalCount` was `0` (Bug #1) and `bestPeerHead` was either unset or equal to `pivot`, `Node Pulse` `Target` rendered `#12,071,120` — the exact same number as `Slot 12071120`, and neither moved!

### 2.3 Bug #3: Silent Data-Consistency Hazard When Applying BALs After Tail-Only Disk Warmup
Look at what happens when `loadIntoAsync` restores a large bucket (`> 2,000` accounts) on resume (`snapStore.ts:493`):
- To keep startup fast and RAM bounded (`WP-04g`), `warmBinaryJournalTail` loads **only the last 256 rows** of each `.bin` journal into `FlatStateManager`'s resident arena. The other millions of synced accounts live **on disk** in the sorted `.bin` files and are accessible via `coldAccountLookup`.
- Now consider what happens when `BalChainStreamer` applies a BAL diff (`stateManager.consumeBAL`) for an address `A` whose `accountHash` is in a **synced range** (`shouldApplyAccount(A) === true`), **but `A` is on disk (not in the 256-row resident arena)**:
  - Inside `packages/statemanager/src/consumeBAL.ts`:
    ```ts
    const existing = await stateManager.getAccount(addr)
    const account = existing ?? new Account()
    ```
  - And what does `FlatStateManager.getAccount(addr)` do? It calls `this._getAccountByHash(hash)` — which checks **only the in-memory `_accounts` shard** and **never calls `_coldAccountLookup(hash)`** (because `_coldAccountLookup` was only wired into `getBinaryAccountByHash`, not `_getAccountByHash`!).
  - **The Corruption:** If a BAL modifies only `nonce` (or `storage`) for an on-disk synced account `A` that had `10 ETH`, `getAccount(addr)` returns `undefined`, `consumeBAL` creates a fresh `new Account()` with **`balance = 0n`**, and writes `balance = 0n` into the resident arena — **wiping out the account's on-disk balance!**
- **The Fix:** In `FlatStateManager._getAccountByHash(accountHash)` (and `modifyAccountFields`), if `accountHash` is not in the resident shard and does not have a tombstone, **consult `this._coldAccountLookup?.(accountHash)`**! If found on disk, decode the 104-byte `BinaryAccount` (and promote it into the resident arena when mutated). This guarantees 100% mathematical equivalence between in-memory and disk-backed accounts during BAL application and EVM execution!

### 2.4 Bug #4: Unnecessary 25-Minute Snapshot Wipe & The `SNAP/1` vs `BAL` Horizon Mechanics
Let's answer the fundamental protocol question:
> *"Is it correct that we can only resume on SNAP once we have been forwarding complete to a snapshot/pivot where clients can serve upon? And this might be a reason to not go too much in the past with BALs?"*

**Yes — 100% spot on!** Here is the exact mechanics and why we can bridge much longer gaps (`1–3 hours`) without wiping:
1. **Why `SNAP/1` peers cannot serve an old pivot directly:**
   - Standard Ethereum EL clients (`Geth`, `Nethermind`, `Reth`, `Besu`) keep a **128-block in-memory state-root ring buffer** (`~25.6 minutes` at 12s/block).
   - If our saved pivot `#P` is at block `#12,071,000` and the network head `#H` is now `#12,071,400` (`400` blocks = `80 minutes` later), `SNAP/1` peers no longer have the MPT state root $R_{12071000}$. If we send `GetAccountRange(root = R_{12071000})`, peers return empty replies.
2. **Why `eth/71` BALs CAN bridge from `#P` into the live 128-block window!**
   - Unlike `SNAP/1` (which requires the 128-block state trie buffer), **`eth/71` `GetBlockAccessLists` (and `GetBlockHeaders`) are served from flat block/history storage** for thousands of blocks!
   - And remember how our **Rolling Pivot (`WP-04k`)** works:
     - Our already-synced account ranges `[startHash .. origin)` in each bucket are valid at state root $R_P$.
     - If we stream and apply the `eth/71` BALs for blocks `#P + 1 .. #H'`, where `#H'` is inside the current 128-block window (e.g. `#H - 16`), **every already-synced account on disk/RAM is deterministically updated to state root $R_{H'}$**, and our pivot advances to `#P_new = #H'` with state root $R_{H'}$!
     - Once `#P_new` reaches `#H'` (which *is* inside the last 128 blocks!), **`SNAP/1` peers CAN serve `GetAccountRange(root = R_{H'})` for all our remaining unsynced cursor ranges `[origin .. limit]`!**
3. **What is the Sweet Spot for `PIVOT_BRIDGING` vs Fresh `SNAP`?**
   - Each Sepolia/Mainnet block BAL is ~15–40 KB and we can fetch/verify ~30–60 BALs per second over `eth/71` (or `ETHY/0` `GET_BAL_RANGE`).
   - Bridging **300 blocks (1 hour)** takes **~6–10 seconds**.
   - Bridging **900 blocks (3 hours)** takes **~15–25 seconds** — whereas discarding 15 million synced accounts and restarting `SNAP/1` from scratch takes **20–40 minutes**!
   - Therefore, we introduce a dedicated **`PIVOT_BRIDGING` sub-mode** inside `ResumeCoordinator`:
     - **Gap `<= 90` blocks (`<= 18 min`):** Immediate resume (`resume-live`). Both `SnapAccountSynchronizer` (at `#P`) and `BalChainStreamer` (streaming `#P + 1 .. #Head` and stepping `#P` every 16 blocks) start immediately in parallel!
     - **Gap `91 .. 900` blocks (`18 min .. 3 hours`, `MAX_BAL_BRIDGE_BLOCKS = 900n`):** Enter **`bridge-pivot` mode**!
       - Keep `SnapAccountSynchronizer` paused (`spine.pivotBridging = { fromBlock: #P, currentBlock: #P, targetBlock: #Head - 16 }`) while `BalChainStreamer` fast-forwards `#P` to `#Head - 16` in batches.
       - As soon as `#P` steps into the live window (`#Head - #P <= 64`), unpause `SnapAccountSynchronizer` so `snap/1` resumes at the newly bridged `pivotStateRoot` without losing a single synced account!
     - **Gap `> 900` blocks (`> 3 hours`):** Only then fall back to `reset-stale` (wipe `pivots/` and anchor fresh at `#Head`), because re-downloading >900 full block bundles sequentially takes longer than a fresh sync or risks hitting pruned BAL windows.

---

## 3. Concrete Architecture of `WP-06d`

### 3.1 `@ethereumjs/statemanager`: Cold-Account Hydration on Read/Modify (`flatStateManager.ts`)
- In `FlatStateManager._getAccountByHash(accountHash: Uint8Array)`:
  - After checking `_deltaStack` and `this._shard(accountHash).get(key)` (and confirming `!this._tombstones.has(key)`):
  - If `this._coldAccountLookup !== undefined`, call `const cold = this._coldAccountLookup(accountHash)`.
  - If `cold !== undefined`, return `binaryAccountToAccount(cold)`.
- Add a unit test in `packages/statemanager/test/flatStateManager.spec.ts` verifying that `consumeBAL` (and `modifyAccountFields`) on an evicted/cold-disk account preserves its existing balance, nonce, and codeHash when applying a partial BAL delta (e.g. a nonce increment or storage change).

### 3.2 `SnapPivotStore`: Persist & Restore Buffered/Stepped BAL State (`snapStore.ts`)
- Ensure `updatePivotHead()` (called on every 16-block pivot step during `SNAP_SYNCING`) atomically updates both `pivot.json` (`blockNumber`, `blockHash`, `stateRoot`) **and** `active.json` (`lastVerifiedBlockNumber`).
- When `BalChainStreamer` buffers a verified block+BAL `#B` (`#P < #B`) during `SNAP_SYNCING`, call `snapStore.appendHealBal(B, balRlp)` (or store `{ blockNumber, blockHash, stateRoot, headerRlp, balRlp }` in `pivots/<activeDir>/heal/<B>.bundle.rlp`) and prune files `<= #P_new` when a 16-block pivot step commits.
- On `loadIntoAsync`, restore any unapplied buffered bundles `> pivot.blockNumber` so `BalChainStreamer` resumes at the exact block where it left off without re-downloading `#P + 1 .. #LastBuffered`.

### 3.3 `ResumeCoordinator` (`packages/ethy/src/sync/resumeCoordinator.ts`)
Extract the tangled resume state variables out of `peerCoordinator.ts` into a cohesive, testable **`ResumeCoordinator`**:
- **Decisions (`decideSnapResume`):**
  - `'anchor-fresh'`: `--fresh` or no saved pivot on disk.
  - `'handoff-catchup'`: `baseSyncComplete === true` (state 100% synced; catch up `#LastVerified + 1 .. #Head` via `BAL_CATCHUP`).
  - `'resume-snap'`: `baseSyncComplete === false` and `head - pivot <= SNAP_LIVE_WINDOW_BLOCKS` (`90n`). Starts `SnapAccountSynchronizer` **and** `BalChainStreamer` immediately!
  - `'bridge-pivot'`: `baseSyncComplete === false` and `90n < head - pivot <= MAX_BAL_BRIDGE_BLOCKS` (`900n`, ~3 hours). Hydrates disk state, starts `BalChainStreamer` in fast-forward bridge mode (`spine.pivotBridging`), and unpauses `SnapAccountSynchronizer` the moment `head - spine.pivotBlockNumber <= 64n`!
  - `'reset-stale'`: `baseSyncComplete === false` and `head - pivot > MAX_BAL_BRIDGE_BLOCKS` (`900n`). Cleanly resets `pivots/` and anchors fresh.
- **Unserved-Pivot Watchdog Guard:**
  - `shouldRefreshStaleSnapPivot()` must **never** wipe a pivot while `spine.pivotBridging !== undefined` or while `BalChainStreamer` is actively advancing blocks (`msSinceBalProgress < 20_000`), and its gap threshold must respect `MAX_BAL_BRIDGE_BLOCKS` unless BAL bridging itself fails/stalls.

### 3.4 Decoupling Top-Bar `Slot` vs `Node Pulse` `Target` (`consensusTracker.ts`, `cockpit.ts`, `renderFrame.ts`)
1. **Top-Right Header (`Slot` / `Head`):**
   - In `consensusTracker.ts` (`syncSpineFromClient`), set `spine.currentSlot = head.slot` whenever the Beacon Light Client updates!
   - In `renderFrame.ts` (`renderCapabilityBar`), display:
     - `Slot ${spine.clOptimisticSlot.toLocaleString('en-US')}` when `spine.clOptimisticSlot !== undefined && spine.clOptimisticSlot > 0`
     - Otherwise `Block #${(spine.bestPeerHead ?? spine.headBlockNumber ?? spine.pivotBlockNumber ?? 0n).toLocaleString('en-US')}` (never a stale `pivotBlockNumber` masquerading as a Beacon slot!).
2. **`Node Pulse` Cockpit Box (`cockpit.ts`):**
   - When `spine.pivotBridging !== undefined` (bridging a 18m–3h pause gap before resuming `snap/1`):
     - `Stage`: `Snap Resume · Bridging`
     - `Target`: `#12,071,025 → #12,071,350 (+325 BALs)`
     - `Progress`: progress bar of bridged BALs
     - `State`: `3.1M acc kept · applying BALs`
   - During normal/resumed `SNAP_SYNCING`:
     - `Target` (`snapTargetRow`) always shows `#<pivot> → #<tip> · +<buffered> BALs · step #<steps>` (using `bestPeerHead` or `headBlockNumber` so the user can always see the live chain tip moving even before the first 16-block step finishes!).

---

## 4. Acceptance Criteria (`WP-06d`)

- [ ] `FlatStateManager` consults `coldAccountLookup` inside `_getAccountByHash` so `consumeBAL` on cold disk-backed accounts preserves all prior fields (balance, nonce, codeHash, storageRoot).
- [ ] Resuming a partial `SNAP_SYNCING` session (`<= 90` blocks behind head) immediately starts **both** `SnapAccountSynchronizer` and `BalChainStreamer` (`ensureHeadFollower`), streaming BALs and stepping the pivot without stalling.
- [ ] Resuming a partial `SNAP_SYNCING` session `91 .. 900` blocks (`~18 min .. 3 hours`) behind head enters **`bridge-pivot`** mode, fast-forwarding the saved pivot via `eth/71` BALs into the live 128-block window and then resuming `snap/1` without wiping `pivots/`.
- [ ] Top-right capability bar shows the live CL Beacon `Slot` (or live `Block #` when P2P-only), and `Node Pulse` `Target` clearly shows `#Pivot → #Tip` and BAL bridge/step progress.
- [x] Deterministic unit & integration tests lock down: (a) cold-account `consumeBAL` preservation, (b) partial-snap resume starting `BalChainStreamer`, (c) `bridge-pivot` across a 250-block gap into live `snap/1`, and (d) TUI slot vs target rendering.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/statemanager` and `@ethereumjs/ethy`.

---

## 5. Concrete Implementation Plan (Planner — Grok 4.7)

See **D-091** in `PROGRESS.md`. Summary: `ResumeCoordinator` + `bridge-pivot` (900 blocks, 14_400 with ETHY/0 BAL tail); start `BalChainStreamer` on partial resume; heal bundle RLP persistence + `restoreBuffered`; cold `consumeBAL` test + promote eviction exempt; CL `Slot` vs EL `Block #` in capability bar; schedulers respect `pivotBridging` (not `snapPaused`).

### File tree

| Path | Action |
| --- | --- |
| `packages/statemanager/src/flatStateManager.ts` | Exempt promoted key from immediate eviction |
| `packages/statemanager/test/flatStateManager.spec.ts` | Cold `consumeBAL` preservation |
| `packages/ethy/src/sync/resumePolicy.ts` | `bridge-pivot`, caps, watchdog |
| `packages/ethy/src/sync/resumeCoordinator.ts` | New: `planResumeStart`, bridge release |
| `packages/ethy/src/spine/types.ts` | `demoClock`, `pivotBridging` |
| `packages/ethy/src/persist/snapStore.ts` | Heal bundles, load unapplied, prune on step |
| `packages/ethy/src/sync/balSync.ts` | `restoreBuffered`; drop EL→`currentSlot` |
| `packages/ethy/src/net/peerCoordinator.ts` | Resume wiring, BAL on partial resume |
| `packages/ethy/src/sync/accountSync.ts` / `codeAndStorageSync.ts` | Gate on `pivotBridging` |
| `packages/ethy/src/cl/consensusTracker.ts` | `currentSlot = head.slot` |
| `packages/ethy/src/core/createEthyNode.ts` | `demoClock` |
| `packages/ethy/src/tui/headerClock.ts` | New: capability bar clock label |
| `packages/ethy/src/tui/renderFrame.ts` / `cockpit.ts` | Slot vs target |
| `packages/ethy/test/resumeCoordinator.spec.ts` | New |
| `packages/ethy/test/p2pReliability.spec.ts` | Updated resume decisions |
| `.cursor/rules/ethy-architecture.mdc` | Four resume outcomes |

### Gates

`npm run tsc` and `npm test` in `@ethereumjs/statemanager` and `@ethereumjs/ethy`; `npm run spellcheck`.

---

## 6. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **Cold path:** Existing `readBinaryAccountKey` / `promoteColdToResident` already hydrated cold accounts for `consumeBAL`; WP-06d adds eviction exempt on promote plus a regression test (no second lookup API).
- **Heal persistence:** RLP bundles under `heal/<block>.bundle.rlp`; legacy `.bal` files still read where present. Boot restores via `readUnappliedHealBundles` + `BalChainStreamer.restoreBuffered` only — `replayPersistedHealBalJournal` stays test-only.
- **ETHY swarm:** `ethySwarmSync` writes heal bundles during `SNAP_SYNCING` when header fields parse; otherwise falls back to bare `.bal`.
- **TUI:** Capability bar uses `capabilityBarClockLabel` (CL slot, `--demo` slot, else EL block). Locale grouping in slot tests uses `en-US` commas.
