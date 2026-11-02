# WP-04e: `O(1)` Contract Queue Scaling, Multi-Peer Parallel Proof Pool, Live Resume Progress & High-Scale Simulation Gate

- **Status:** `DONE`
- **Dependencies:** `WP-04d` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Context & Root-Cause Forensics (Why `1.7M` Accounts Slows Down, Why Resume Hangs Input, and Why Only 1 Peer Syncs)

Live Sepolia testing of `WP-04d` reached **>1.7M synced accounts** (a major milestone!), but exposed four specific bottlenecks and regressions that explain every remaining live symptom:

### Root Cause 1 — `O(N²)` Quadratic Main-Thread Freeze in `SnapCodeAndStorageSynchronizer` (`src/sync/codeAndStorageSync.ts`)
- Look at `noteAccounts(entries: IngestedAccountMeta[])` (`codeAndStorageSync.ts:112–138`) and `publishPending()` (`codeAndStorageSync.ts:375–378`):
  - `this.codeQueue` and `this.storageTasks` are plain arrays (`CodeTask[]`, `StorageTask[]`).
  - Because `codeSync` waits until all 16 account buckets finish before draining `codeQueue` and `storageTasks`, by `1.7M` Sepolia accounts (~12% contracts) those arrays hold **`~200,000` elements**.
  - **During live sync at `1.7M` accounts:** Every incoming `AccountRange` reply calls `onAccountsIngested` → `codeSync.noteAccounts(entries)` on the Main Thread. For ~250 contracts in a batch, `.some((t) => equalsBytes(...))` performs `250 × 200,000 = 50,000,000` byte-array comparisons + `this.storageTasks.filter(...)` on every single packet (**150–300ms of Main-Thread CPU per packet**, dragging sync speed below `1,000 acc/s` and growing worse with every bucket!).
  - **During Resume of `1.7M` accounts (Total UI + CLI Input Hang!):** When `loadIntoAsync` finishes reading the 16 journal files, `finishDiskHydrate` (`peerCoordinator.ts:473`) calls `codeSync?.noteAccounts(snapStore!.drainRestoredContracts())` with **all `~200,000` restored contracts at once**! That triggers `200,000 × 200,000 / 2 = 20,000,000,000` (20 billion!) `equalsBytes` calls synchronously on the Main Thread, completely freezing `stdin` (CLI typing) and TUI rendering for 30–60+ seconds!

### Root Cause 2 — Premature `ensureSnapSync` Race & `0 acc / 0%` Blindness During `loadIntoAsync` (`src/persist/snapStore.ts` & `src/net/peerCoordinator.ts`)
- In `SnapPivotStore.loadIntoAsync` (`snapStore.ts:327–328`), `spine.pivotBlockNumber` and `spine.pivotStateRoot` are assigned **before** reading the 16 `.bin` journal files, while `spine.snapBuckets` and `spine.totalAccountsSynced` are only assigned at the very end (`snapStore.ts:409–410`).
- Because `spine.pivotStateRoot !== undefined` is set before the first `await fs.promises.readFile`, the very next 150ms `applyTelemetry` tick (`peerCoordinator.ts:957`) calls `ensureSnapSync(client)` **while `loadIntoAsync` is still in the middle of reading disk journals**!
- Meanwhile, the TUI `Node Pulse` displays `Target: #12,048,139 (+83 blk)`, `Progress: 0%`, `State: 0 acc · 0/s` throughout hydration, and then hits the 20-billion-iteration `noteAccounts` wall at the end of `loadIntoAsync`.

### Root Cause 3 — Premature Discovery/VIP Shutoff at `1` Peer & Single-Worker Proof Serialization (`src/net/discoveryHold.ts`, `src/net/peerCoordinator.ts`, `src/sync/snapVerifyWorker.ts`)
- **Why Ethy almost only ever gets 1 peer:** Commit `7d77e19e3` changed `wantSnapDiscoveryHold` (`discoveryHold.ts:15`) to return `true` as soon as **`opts.servingSnapPeers >= 1`**! And in `peerCoordinator.ts:513`, `maybeVipReconnect` has `if (discoveryHoldActive === true) return`. The instant **1 single peer** answers its first `AccountRange` (~150ms after connecting), `discoveryHoldActive` flips to `true`, immediately shutting off **both** DPT discovery **and** VIP peer reconnect!
- **Why a 2nd peer rarely adds speed when it does connect:** `SnapVerifyPool` (`snapVerifyWorker.ts:65, 171`) spawns only **1 Worker thread** and chains every proof onto `this.jobChain`. One peer with 2× pipelining already keeps 1 worker core busy verifying Merkle range proofs (~80–120ms per proof); a 2nd peer's replies simply wait in line behind Peer 1's proofs on that single worker thread!

### Root Cause 4 — Zombie `"Saved partial snap ... expired"` Notices Re-Appearing Forever (`src/notify/board.ts` & `src/net/peerCoordinator.ts`)
- In `peerCoordinator.ts` (lines 243, 359, 412, 464, 493), one-shot notices (`snap-stale-reset`, `snap-resume`, `snap-handoff`, `snap-base-done`, `bal-synced-head`) are posted **without `relevantForMs`**.
- In `NoticeBoard.isRelevant` (`board.ts:145`), `if (notice.relevantUntil === undefined) return true` keeps any notice without `relevantForMs` alive in `this.list` forever. Whenever a later 5-second `"Peer connected."` notice expires, `NoticeBoard.tick` falls back to `newestRelevant(now)` and resurrects the old `"Saved partial snap (#12047910, +229 blocks) expired"` message on screen repeatedly!

---

## 2. Holistic Scope & Architectural Requirements (3 Focused Slices)

Follow [`.cursor/rules/binary-and-scale.mdc`](../../../.cursor/rules/binary-and-scale.mdc) and [`packages/ethy/.cursor/rules/ethy-runtime-lanes.mdc`](../.cursor/rules/ethy-runtime-lanes.mdc) throughout.

### Slice 1 (`@ethereumjs/ethy`): `O(1)` Map-Backed Contract/Storage Queues & Multi-Worker `SnapVerifyPool`
1. **Replace Linear Array Scans in `SnapCodeAndStorageSynchronizer` (`src/sync/codeAndStorageSync.ts`) with `O(1)` Maps:**
   - Replace `private codeQueue: CodeTask[] = []` with `private readonly codeQueue = new Map<string, CodeTask>()` keyed by `bytesToUnprefixedHex(codeHash)`.
   - Replace `private storageTasks: StorageTask[] = []` with `private readonly pendingStorageTasks = new Map<string, StorageTask>()` (keyed by `bytesToUnprefixedHex(accountHash)`) for unfinished tasks (plus a `completedStorageAccounts = new Set<string>()` if needed for `invalidateAccount`).
   - In `noteAccounts(entries)`: deduplicating a `codeHash` or `accountHash` is now a single `Map.has(hexKey)` (`O(1)`), reducing `200,000` restored contracts from `20,000,000,000` operations (`45s` freeze) to `200,000` map inserts (`< 80ms`, or chunked with `maybeYield` during restore so Main-Thread turn stays `<= 4ms`!).
   - In `handleByteCodes`: matching returned bytecode blobs (`keccak_256(raw)`) and deleting from `this.codeQueue` is `this.codeQueue.delete(bytesToUnprefixedHex(hash))` (`O(1)` instead of `.filter(equalsBytes)`).
   - In `publishPending()`: `this.spine.codesQueued = this.codeQueue.size` and `this.spine.storageQueued = this.pendingStorageTasks.size` (`O(1)` instead of `.filter()`).
2. **True Parallel Multi-Worker `SnapVerifyPool` (`src/sync/snapVerifyWorker.ts`):**
   - Upgrade `SnapVerifyPool` from a single serialized `this.worker` + `this.jobChain` to a pool of `poolSize` workers (default `Math.min(4, Math.max(2, os.availableParallelism?.() ? Math.floor(os.availableParallelism() / 2) : 2))`, i.e. **2 to 4 workers** when `inProcess === false`).
   - Dispatch each `verifyAccountRange` / `verifyStorageRange` request immediately to the worker with the fewest in-flight jobs (round-robin / least-loaded) without chaining onto a single `this.jobChain`, so 2–4 peers' range proofs verify simultaneously across CPU cores!

### Slice 2 (`@ethereumjs/ethy`): Multi-Peer Discovery/VIP Target, Live Incremental Resume & Expiring Notices
1. **Keep Seeking Peers Until `>= 3` Serving `snap/1` Peers (`src/net/discoveryHold.ts` & `src/net/peerCoordinator.ts`):**
   - In `wantSnapDiscoveryHold` (`src/net/discoveryHold.ts`):
     - Return `false` when `opts.snapSessions <= 1` or `opts.servingSnapPeers < 2`.
     - Return `true` (pause discovery) only when **`opts.servingSnapPeers >= 3`** (or `opts.snapSessions >= 4 && opts.servingSnapPeers >= 2`), and resume (`false`) when `opts.servingSnapPeers < 2`.
   - In `peerCoordinator.ts`:
     - Raise `VIP_SNAP_PEER_TARGET` from `2` to **`4`**.
     - In `maybeVipReconnect`: remove `if (discoveryHoldActive === true) return` (or only skip when `servingSnapPeers >= VIP_SNAP_PEER_TARGET`), and count **serving** or active snap peers toward `VIP_SNAP_PEER_TARGET` so Ethy actively dials remembered VIP peers until at least 3–4 fast `snap/1` peers are connected and serving!
     - On startup (`peerCoordinator.ts:891`), dial up to `PEER_BOOK_STARTUP_DIALS = 6` (up from `4`) remembered peers immediately so warm restarts get 2–4 peers at `t = 0`.
2. **Fix `loadIntoAsync` Race & Show Live Incremental Progress During Disk Resume (`src/persist/snapStore.ts` & `src/net/peerCoordinator.ts`):**
   - In `peerCoordinator.ts`:
     - Guard `ensureSnapSync`: `if (spine.pivotStateRoot === undefined || !diskHydrated || handoffCatchup) return` so `applyTelemetry` **never** starts `SnapAccountSynchronizer` or `SnapCodeAndStorageSynchronizer` while `loadIntoAsync` is still reading disk journals!
   - In `SnapPivotStore.loadIntoAsync` (`src/persist/snapStore.ts`):
     - Initialize `spine.snapBuckets = buckets` (with saved `buckets.json` statuses/counts pre-populated or updated per bucket) **before** the journal loop, and inside `restoreBinaryJournalAsync` update `bucket.accountsLoaded`, `bucket.currentLastHash`, and `spine.totalAccountsSynced = stateManager.accountCount()` **on every 4,000-row batch** before `await maybeYield()`.
     - Instead of accumulating `200,000` objects in `this.restoredContracts` and dumping them into `codeSync.noteAccounts` in one giant synchronous call at the end, either stream contract metadata in small batches inside `loadIntoAsync` (yielding every 4ms) or yield every 2,000 items when draining into `codeSync.noteAccounts`.
3. **Finite `relevantForMs` on One-Shot Lifecycle Notices (`src/net/peerCoordinator.ts` & `src/notify/board.ts`):**
   - Add `relevantForMs: 8_000` (8 seconds) to all one-shot lifecycle notices in `peerCoordinator.ts`:
     - `snap-stale-reset` (`"Saved partial snap ... expired — starting fresh at #..."`)
     - `snap-resume` (`"Resuming snap sync at #... (...% complete)"`)
     - `snap-handoff` (`"Resuming from #... toward head #..."`)
     - `snap-base-done` (`"Snap base sync complete at #..."`)
     - `bal-synced-head` (`"Synced to head #..."`)
   - When `snap-stale-reset` fires (or a new pivot is anchored), also call `opts.notices?.clear('snap-resume', Date.now())` so stale resume notices never linger.

### Slice 3 (`@ethereumjs/ethy`): Closing the "Agent vs. Live Reality" Testing Gap (`test/perfInvariants.spec.ts` & `test/p2pReliability.spec.ts`)
Why did previous passes say "Done!" while live runs froze at `1.7M` accounts or stuck on resume? Because tests only ran `N = 32` accounts in isolation without measuring Main-Thread event-loop stalls or testing `startPeerCoordinator` telemetry ticks during async disk hydration!

Add deterministic, fast (`< 1.5s` total runtime) high-scale and lifecycle simulation tests:
1. **`100,000`-Account / `20,000`-Contract Scale & Event-Loop Latency Gate (`test/perfInvariants.spec.ts`):**
   - Construct a contiguous binary slab / journal with `20,000` contract accounts (distinct `codeHash` and `storageRoot`).
   - Feed all `20,000` contracts into `SnapCodeAndStorageSynchronizer.noteAccounts` and `handleByteCodes` + `SnapPivotStore.loadIntoAsync`:
     - Assert total execution time for `noteAccounts(20_000 contracts)` is **`< 50ms`** (with the old `O(N²)` `.some(equalsBytes)` array scan, `20,000²` takes several seconds and fails immediately!).
     - Run a `setImmediate` / `performance.now()` event-loop stall monitor alongside `loadIntoAsync` with `100,000` binary journal rows and assert that **no single synchronous turn blocks the event loop for `> 25ms`** (`maxTurnMs < 25`) and that `spine.totalAccountsSynced` progresses incrementally (`> 0` mid-hydration before completion).
2. **Multi-Peer Parallel Proof Speedup & Discovery Hold Hysteresis Gate (`test/perfInvariants.spec.ts` & `test/p2pReliability.spec.ts`):**
   - Test `wantSnapDiscoveryHold`: verify that `1` serving snap peer (`snapSessions: 1, servingSnapPeers: 1`) returns **`false`** (does **not** pause discovery!), and discovery holds only when `servingSnapPeers >= 3` (or `snapSessions >= 4 && servingSnapPeers >= 2`).
   - Test `startPeerCoordinator` during `loadIntoAsync`: simulate a peer telemetry tick arriving *while* `loadIntoAsync` is mid-flight, and assert `SnapAccountSynchronizer` sends **zero** `GET_ACCOUNT_RANGE` messages until `diskHydrated === true`.
   - Test `NoticeBoard` + `snap-stale-reset`: verify that after `snap-stale-reset` (`relevantForMs: 8_000`) is replaced by `p2p-online` (`relevantForMs: 5_000`), advancing time past `t + 10_000ms` results in `describeNotice(board, now) === null` (the expired stale-reset notice **never** resurrects!).

---

## 3. Acceptance Criteria & Verification Gates

- [x] `SnapCodeAndStorageSynchronizer` uses `Map`/`Set` (`O(1)` lookup/delete/count) with zero `.some(equalsBytes)` or `.filter()` scans over `codeQueue` / `storageTasks`.
- [x] `SnapVerifyPool` uses a multi-worker pool (`>= 2` workers) without serializing all proofs onto a single `jobChain`.
- [x] `wantSnapDiscoveryHold` and `maybeVipReconnect` keep discovery and VIP dialing active when only `1`–`2` snap peers are serving (`VIP_SNAP_PEER_TARGET = 4`, discovery hold at `>= 3` serving peers).
- [x] `ensureSnapSync` is strictly gated on `diskHydrated === true`, and `loadIntoAsync` updates `spine.totalAccountsSynced` and bucket progress incrementally on every batch without blocking the Main Thread for `> 25ms`.
- [x] All one-shot notices (`snap-stale-reset`, `snap-resume`, `snap-handoff`, `snap-base-done`, `bal-synced-head`) specify `relevantForMs: 8_000` and never re-appear after expiring.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

**D-073 refinements:** discovery hold hysteresis (hold at `>= 3` serving, sticky at 2); distinct code/storage work per peer via in-flight key sets; `shouldEnsureSnapSync` predicate; single hex-keyed `Map` queues (~200k keys); chunked `noteAccounts` after hydrate (2k + `setImmediate`); `test/perfInvariants.spec.ts` created (file was never added in WP-04d).

| Slice | Files | Work |
| --- | --- | --- |
| 1 | `codeAndStorageSync.ts`, `snapVerifyWorker.ts` | Map queues; least-loaded multi-worker pool (`defaultSnapVerifyPoolSize`, `createWorker` test hook) |
| 2 | `discoveryHold.ts`, `peerCoordinator.ts`, `resumePolicy.ts`, `snapStore.ts`, `peerBook.ts` | VIP target 4, no VIP/discovery coupling, incremental hydrate, `relevantForMs: 8_000` |
| 3 | `perfInvariants.spec.ts`, `p2pReliability.spec.ts`, `notices.spec.ts`, `codeStorageSync.spec.ts` | 20k/100k scale gates, hysteresis matrix, notice expiry |

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **`SnapCodeAndStorageSynchronizer`:** `codeQueue` / `pendingStorage` are hex-keyed `Map`s; completed storage tasks are deleted (not kept with `done: true`). `schedule()` skips code hashes and storage account keys already in flight.
- **`SnapVerifyPool`:** Removed `jobChain`; lazy worker slots up to `poolSize` (2–4 from `availableParallelism()`). Per-slot error drops the slot only.
- **`discoveryHold.ts`:** Exported `VIP_SNAP_PEER_TARGET`, `countSnapPeersTowardVipTarget`, `shouldVipReconnect`. `maybeVipReconnect` no longer bails when discovery is held.
- **`loadIntoAsync`:** Pre-assigns `spine.snapBuckets` from saved metadata. Async journal replay uses 1,000-row slabs (a 4,000-row slab was ~40ms on the coverage job). Each slab updates the bucket cursor and `totalAccountsSynced` before yield.
- **Scale gates:** `noteAccounts(20_000)` is bounded at 200ms so v8 coverage on CI still fails a quadratic scan (seconds). The event-loop stall bound stays 25ms.
- **Tests:** `npm run tsc` and `npm run test:node` green (157 tests). No upstream package changes.
