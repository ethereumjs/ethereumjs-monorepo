# WP-04d: Worker-Offloaded `snap/1` Proof Verifier, 256-Shard Zero-Stall `FlatStateManager` & Resume-After-Head Ordering

- **Status:** `DONE`
- **Dependencies:** `WP-00`–`WP-04c` (`DONE`)
- **Branch:** `ethy-continuation`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Strategic Context & Root-Cause Forensics

After `WP-04c`, fresh initial sync speed jumped dramatically, but live testing exposed three remaining problems ("worked beautifully until it doesn't"):
1. **TUI Freezes / Multi-Second Input Lag:** Pressing `Tab` or typing in the prompt waits multiple seconds before reacting once sync is under load.
2. **Sync Hits a Wall at Scale (~1M–2M Accounts):** Sync slows down or stalls after a few hundred thousand to a million accounts.
3. **Resume Fails or Stalls on Restart:** Restarting Ethy with an existing `pivots/` directory either freezes on startup, fails to resume, or leaves sync stuck after resetting a stale pivot.

### The 4 Exact Bugs Found in the `WP-04c` Code

1. **Bug 1 (TUI Multi-Second Freeze): `verifyMerkleRangeProof` Runs on the Main Thread + The "Async Queue Illusion" in `lanes.ts`:**
   - In `accountSync.ts:122`, `enqueueProtocol(() => { void this.handleAccountRange(peerId, payload) })` queues an `async` function without `await`ing it! Because `void this.handleAccountRange(...)` returns a `Promise` in `<0.1ms`, `lanes.ts`'s `while (Date.now() - start < 4ms)` loop fires **all 4–6 pipelined `handleAccountRange` calls in the same turn**.
   - Each `ingestAccountRangeReply` call runs `RLP.decode` (2,000 accounts) + 2,000× `binaryAccountToRLP` + `@ethereumjs/mpt`'s `verifyMerkleRangeProof` (~3,000 `keccak_256` hashes = **80–150ms of pure synchronous CPU**) on the **Main Thread**, blocking `stdin` key input and TUI redraws for 0.5–2+ seconds!

2. **Bug 2 (Heap Explosion & V8 Map Rehash Wall): `FlatStateManager` Pushes an Idle `_deltaStack[0]` Frame in Its Constructor + Single Monolithic `Map`:**
   - Look at `packages/statemanager/src/flatStateManager.ts:59-61` and `103-109`:
     ```ts
     if (parent === undefined) {
       this._deltaStack.push({ accounts: new Map(), storage: new Map(), code: new Map() })
     }
     ```
     Because `_deltaStack[0]` is always present even when no EVM `checkpoint()` is active, `writeBinaryAccountKey` **records every single snap-synced account key into TWO giant `Map`s (`_deltaStack[0].accounts` AND `this._accounts`)**!
   - Worse: a single V8 `Map` triggers a synchronous 1–2.5 second C++ hash-table rehash at `2^20` (1.04M) and `2^21` (2.09M) entries, and throws a fatal `RangeError: Value undefined out of range` at `2^24` (16.7M entries — less than Sepolia's 35M accounts!).
   - And `FlatStateManager.accountCount()` (`flatStateManager.ts:404-417`) allocates a brand-new `new Set<string>()` and walks all millions of keys every time it is called!

3. **Bug 3 (Re-Inflation of `Account` Objects on Internal Seams):**
   - Look at `syntheticPeer.ts:357-368` (`ingestedMetaFromBinaryEntries`, called on every range packet in `accountSync.ts:358`) and `snapStore.ts:373` (called on **every single row** in `loadIntoAsync`!):
     ```ts
     const account = binaryAccountToAccount(row.binaryAccount) // <-- Allocates `new Account()` on every row!
     ```
   - `SnapCodeAndStorageSynchronizer.noteAccounts` only needs `accountHash`, `codeHash` (32 bytes), and `storageRoot` (32 bytes) — it never needed an `Account` class instance!

4. **Bug 4 (Why Resume Breaks): Hydrating Disk *Before* Checking the 90-Block Stale Rule (`peerCoordinator.ts:340-476`):**
   - `scheduleHydrateSnapFromDisk()` starts `loadIntoAsync` immediately at boot **before** checking whether the saved pivot `#P` is already expired (`#H - #P > 90` blocks)!
   - Even worse: in `loadIntoAsync` (`snapStore.ts:369`), it calls `putSnapBinaryAccountsBatch([singleRow])` 1 row at a time with `binaryAccountToAccount(row.binaryAccount)` on every row (taking 15–30 seconds).
   - When `loadIntoAsync` finishes before a peer's `STATUS` arrives (`peerCoordinator.ts:457`), it starts `ensureSnapSync(client)` on the old pivot `#P`. Then 1 second later, when the first peer reports `#H` (`#H - #P > 90`), `finishDiskResumeWithHead` (`peerCoordinator.ts:345`) deletes the pivot files and sets `spine.pivotStateRoot = undefined`, **leaving `snapSync` running with `pivotStateRoot === undefined` and never requesting a new pivot header (`inFlightPeerId` / `resumeDecided` state machine wedged)!**

---

## 2. Key Deliverables (3 Focused Slices)

Follow the new rules in [`.cursor/rules/binary-and-scale.mdc`](../../../.cursor/rules/binary-and-scale.mdc) and [`packages/ethy/.cursor/rules/ethy-runtime-lanes.mdc`](../.cursor/rules/ethy-runtime-lanes.mdc).

### Slice 1 — `@ethereumjs/statemanager`: 256-Shard `FlatStateManager`, Zero Idle `_deltaStack` & `O(1)` `accountCount()` (Separate Upstream Commit)

In `packages/statemanager/src/flatStateManager.ts`:
1. **No Idle Undo Frame:**
   - Initialize `private readonly _deltaStack: DeltaFrame[] = []` **empty** in the constructor!
   - Only push a `DeltaFrame` when `checkpoint()` is called (`commit()` and `revert()` pop when `_deltaStack.length > 0`). When `_deltaStack.length === 0` (the normal state during `snap/1` sync and BAL application), `writeBinaryAccountKey` writes directly to the account store with **zero** undo-map duplication!
2. **256-Way Prefix Sharding (`_accountShards`):**
   - Replace the single `private readonly _accounts = new Map<string, Uint8Array | undefined>()` with **256 shards indexed by the first byte of the 32-byte account hash (`0x00..0xff`)**:
     ```ts
     private readonly _accountShards: Array<Map<string, Uint8Array | undefined>> =
       Array.from({ length: 256 }, () => new Map())
     ```
   - This guarantees that even at **35,000,000 accounts** on Sepolia/Mainnet, each shard holds only `~136,000` entries — completely immune to V8's `2^24` Map limit and multi-second rehash pauses!
3. **`O(1)` `accountCount()`:**
   - Maintain a fast integer counter (or sum the 256 shard counts when `_parent === undefined`) so `accountCount()` runs in `< 0.01ms` with **zero `Set` allocations**.

---

### Slice 2 — `@ethereumjs/ethy`: Offload `snap/1` Range Proof Verification to a Worker Thread & Eliminate `Account` Re-Inflation (`src/sync/`)

1. **Remove `Account` from `IngestedAccountMeta` (`accountSync.ts` & `codeAndStorageSync.ts`):**
   - Change `IngestedAccountMeta` to:
     ```ts
     export type IngestedAccountMeta = {
       accountHash: Uint8Array
       codeHash: Uint8Array
       storageRoot: Uint8Array
     }
     ```
   - Extract `codeHash` and `storageRoot` via `getBinaryAccountCodeHash` and `getBinaryAccountStorageRoot` (zero-copy byte views, zero `Account` allocations!).
   - Delete all `binaryAccountToAccount` calls from `ingestedMetaFromBinaryEntries` (`syntheticPeer.ts`) and `loadInto` / `loadIntoAsync` (`snapStore.ts`)!
2. **Offload `ingestAccountRangeReply` (`RLP.decode` + `verifyMerkleRangeProof`) to a Worker Thread (`src/sync/snapVerifyWorker.ts`):**
   - Create a lightweight `SnapVerifyPool` / `SnapVerifyWorker` (`node:worker_threads`, with an `inProcess: true` mode for unit tests, resolved the same way as `devp2p`'s worker entry).
   - When an `ACCOUNT_RANGE` payload arrives in `SnapAccountSynchronizer`:
     - Transfer `payload` to the verify worker (`verifyAccountRangeInWorker({ stateRoot, origin, payload })`).
     - The worker performs `parseAccountRangeReply`, `binaryAccountToRLP`, `verifyMerkleRangeProof`, and packs the verified rows into a **single contiguous `Uint8Array(count * 136)` slab** (`32B accountHash + 104B BinaryAccount` per row), transferring that slab back to the Main Thread with **zero copy**!
     - On the Main Thread, receiving the verified slab takes **`< 2ms`** (just inserting the `104B` slices into `FlatStateManager.putSnapBinaryAccountsBatch` and writing the already-packed `Uint8Array(count * 136)` buffer straight to disk in 1 async/batched write!).
3. **Fix `lanes.ts` Cooperative Queue:**
   - Make `enqueueProtocol` support `async` tasks properly (`type ProtocolTask = () => void | Promise<void>`), `await`ing one task before checking `Date.now() - start >= PROTOCOL_SLICE_MS` and yielding via `setImmediate`.

---

### Slice 3 — `@ethereumjs/ethy`: Fix Resume Ordering (`Check 90-Block Gap First → Hydrate Slabs → Start Sync`) (`peerCoordinator.ts` & `snapStore.ts`)

1. **Wait for First Peer Head Before Hydrating (`peerCoordinator.ts`):**
   - At startup, call `const savedPeek = snapStore?.peekActive()` (`< 1ms`).
   - Do **not** start `loadIntoAsync` until the first peer reports `latestBlock = #H` (unless `savedPeek.baseSyncComplete === true`, which never expires).
   - When the first peer reports `latestBlock = #H`:
     - Call `const decision = decideSnapResume({ fresh: opts.fresh === true, saved: savedPeek, head: #H })`:
       1. **`'anchor-fresh'`:** Start fresh pivot header request at `#H` immediately.
       2. **`'reset-stale'` (`#H - #P > 90`):** Call `snapStore.discardPivots()` (`< 5ms`), clear spine pivot state, post the `NoticeBoard` warning (`Saved partial snap (#P, +gap blocks) expired — starting fresh at #H`), and immediately call `requestPivotFromPeer(bestPeer)`! (**0 seconds spent reading expired disk files, and 100% guaranteed to anchor `#H` and start fresh sync!**)
       3. **`'resume-snap'` (`#H - #P <= 90`) or `'handoff-catchup'` (`baseSyncComplete === true`):** Hydrate from disk using fast slab batching (`putSnapBinaryAccountsBatch` in chunks of 4,000 rows per 4ms slice, with **zero** `binaryAccountToAccount` calls!), and start `ensureSnapSync` / `ensureHeadFollower` once hydration finishes.
2. **Slab-Based Journal Reader (`journal.ts` & `snapStore.ts`):**
   - In `readBinaryAccountJournalFile(bytes)`: use zero-copy byte range views (or a single batch pass into `putSnapBinaryAccountsBatch` of 4,000 rows at a time) instead of allocating `600,000` individual `.slice()` copies up front.

---

## 3. Mechanical Performance & Invariant Tests (`test/perfInvariants.spec.ts`)

Add `packages/ethy/test/perfInvariants.spec.ts` to lock these laws in CI forever:
1. **Zero `Account` Class Instantiation During Sync & Resume:**
   - Spy on `@ethereumjs/util` (`binaryAccountToAccount` / `Account` constructor) during a 16-bucket sync and a `SnapPivotStore.loadIntoAsync` resume. Assert **`0` calls** to `binaryAccountToAccount`!
2. **Zero Idle `_deltaStack` Growth & `O(1)` `accountCount()`:**
   - Ingest `10,000` binary accounts into `FlatStateManager` across all 256 prefix shards (`0x00..0xff`), assert `_deltaStack.length === 0`, and assert 1,000 calls to `accountCount()` complete in `< 5ms`.
3. **Stale Resume Reset Transitions Cleanly to Fresh Pivot Sync:**
   - Seed an unfinished `SnapPivotStore` at `#1000`. Connect a peer announcing `latestBlock = #1200` (`gap = 200 > 90`). Verify that `PeerCoordinator` discards `#1000` **without** calling `loadIntoAsync`, anchors `#1200`, and starts `SnapAccountSynchronizer` on `#1200`!
4. **Valid Resume (`gap <= 90`) Continues from Saved Cursors:**
   - Seed an unfinished `SnapPivotStore` at `#1000` with bucket `0x0` `done`. Connect a peer at `#1050` (`gap = 50 <= 90`). Verify that `PeerCoordinator` hydrates `#1000` and resumes syncing buckets `0x1..0xf` against `#1000`.

---

## 4. Acceptance Criteria
- [x] `FlatStateManager` uses 256 prefix shards, keeps `_deltaStack` empty when not in a `checkpoint()`, and runs `accountCount()` in `O(1)`.
- [x] `IngestedAccountMeta` uses `{ accountHash, codeHash, storageRoot }` (`Uint8Array`s) and `binaryAccountToAccount` is called **0 times** during `snap/1` ingestion and disk journal hydration.
- [x] Live `snap/1` range-proof verification runs in a Worker thread (`SnapVerifyWorker`) so the Main Thread TUI never blocks on `verifyMerkleRangeProof`.
- [x] Startup resume checks `decideSnapResume` on the first peer head *before* hydrating journals; stale pivots (`gap > 90`) reset in `< 10ms` and immediately anchor the new pivot and start syncing; valid pivots (`gap <= 90`) hydrate and continue seamlessly.
- [x] `test/perfInvariants.spec.ts`, `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors in `packages/statemanager` and `packages/ethy`.

---

## 5. Concrete Implementation Plan (Planner — Grok 4.7)

**Commits (implementer order):** `@ethereumjs/statemanager` → `@ethereumjs/ethy` (worker + lanes + meta + resume + journal). No `@ethereumjs/util` change.

**D-071:** One lazy FIFO `SnapVerifyPool` (`inProcess` for CI; real `Worker` for live CLI; copy payload to fresh `ArrayBuffer` before transfer). `putSnapBinaryAccountsFromSlab(slab)` (136-byte stride). Empty `_deltaStack` at root; `commit`/`revert` pop when `length > 0` only. Root `_liveAccountCount`; child adjusts from overlay keys. Storage proofs share worker; code GETs stay main thread. Resume: `peekActive` at boot → first head → `decideSnapResume` before `loadIntoAsync`; remove post-hydrate stale reset in `finishDiskResumeWithHead`. Binary journal batch reader (4k rows, views); async `appendVerifiedSlabAsync` on live path. `IngestedAccountMeta` = hash triplets; `noteAccounts` copies 32-byte fields.

| Slice | Files | Work |
| --- | --- | --- |
| 1 | `flatStateManager.ts`, `flatStateManager.spec.ts` | 256 shards, no idle delta frame, slab ingest, O(1) count |
| 2 | `snapVerifyJob.ts`, `snapVerifyWorkerEntry.ts`, `snapVerifyWorker.ts`, `lanes.ts`, `accountSync.ts`, `codeAndStorageSync.ts`, `syntheticPeer.ts`, `peerCoordinator.ts`, `snapStore.ts` | Worker proofs, awaited lanes, meta + async append |
| 3 | `peerCoordinator.ts`, `journal.ts`, `snapStore.ts` | Head-first resume, slab hydrate |
| Tests | `perfInvariants.spec.ts`, `lanes.spec.ts` | Spy, scale, stale/valid resume, async lane order |

See attached planner artifact in session for full file-level detail.

---

## 6. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **Statemanager:** 256-way `_accountShards`, empty root `_deltaStack`, `_liveAccountCount` + overlay `_localAccountKeys`, `putSnapBinaryAccountsFromSlab`, `SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE` export.
- **Ethy verify path:** `snapVerifyJob.ts` + `SnapVerifyPool` (in-process default; live coordinator uses real Worker via `SNAP_VERIFY_POOL_MODULE_URL`). Storage proofs share the pool; code GETs unchanged on main thread.
- **Lanes:** `enqueueProtocol` awaits async tasks within the 4 ms slice budget.
- **Resume:** Boot no longer calls `loadIntoAsync`; `handleSnapResumeAtHead` runs on first peer head; post-hydrate stale reset removed from `finishDiskResumeWithHead`.
- **Disk:** Binary journal hydrate uses 4k-row slabs; live ingest uses `appendVerifiedSlabAsync` (chained per bucket file). Sync unit tests still use synchronous `appendVerifiedRange`.
- **Tests:** `test/perfInvariants.spec.ts` + extended `lanes.spec.ts`; `npm run test:node` green in `statemanager` and `ethy`.
