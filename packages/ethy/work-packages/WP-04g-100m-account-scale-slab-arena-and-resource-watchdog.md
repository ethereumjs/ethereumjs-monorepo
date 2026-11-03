# WP-04g: `100M`-Account Scale Architecture — Slab-Arena `FlatStateManager`, Bounded Resident Working Set, `O(1)` Tail-Seek Disk Resume & Resource Watchdog

- **Status:** `DONE`
- **Dependencies:** `WP-04f`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Context & Root-Cause Forensics: Why V8 Crashed With Heap OOM After `6.5M` Accounts

Shortly after crossing **`6.5M` synced accounts**, the Node.js / V8 process crashed with a V8 Heap Out-Of-Memory error (`Reached heap limit Allocation failed - JavaScript heap out of memory`).

Tracing every byte allocated per account across `FlatStateManager`, `SnapCodeAndStorageSynchronizer`, and `SnapPivotStore` reveals **three exact memory-scaling ceilings** that cause V8 to hit its ~`4.0 GB` `max-old-space-size` limit around `7M–9M` accounts — and shows how we can redesign them so Ethy stays under **`< 350 MB` of V8 heap even at `70M–100M` accounts (`10x` scale — full Mainnet + Sepolia!)**:

---

### Root Cause 1 — The `272 KB` / `60 MB` Byte-View Buffer-Pinning Memory Leak (`src/sync/syntheticPeer.ts:343` & `src/sync/codeAndStorageSync.ts:138`)
Look at `ingestedMetaFromBinarySlab(slab)` in `packages/ethy/src/sync/syntheticPeer.ts` (`offset` to `offset + 32` byte view on `slab.buffer`), and look at `SnapCodeAndStorageSynchronizer.noteAccounts` in `packages/ethy/src/sync/codeAndStorageSync.ts:137–144`:
```ts
        if (!this.pendingStorage.has(key)) {
          this.pendingStorage.set(key, {
            accountHash, // <--- SHARED BYTE VIEW INTO slab.buffer!
            storageRoot: new Uint8Array(storageRoot),
            origin: new Uint8Array(32),
            verifying: false,
            missRetries: 0,
          })
        }
```
- The zero-copy byte view `(offset, offset + 32)` does **not** copy the 32 bytes — it creates a `Uint8Array` view whose `.buffer` points to the **entire `272 KB` `result.slab.buffer`** (or during `loadIntoAsync`, the **entire `60+ MB` `raw` bucket journal `ArrayBuffer`**!).
- Even though `noteAccounts` copied `new Uint8Array(storageRoot)`, it stored `accountHash` (the shared byte view) directly inside `this.pendingStorage`!
- Because `pendingStorage` is not drained until all 16 account buckets finish, **every single `result.slab` packet (`~272 KB`) that contains even 1 storage contract is permanently pinned in RAM**! Across `4,000` range packets (`~8M` accounts), that alone pins **`> 1.1 GB`** of dead slab buffers in memory!

---

### Root Cause 2 — Per-Account `new Uint8Array(104)` V8 Heap Object Explosion in `FlatStateManager` (`packages/statemanager/src/flatStateManager.ts:409, 427`)
Look at `FlatStateManager.putSnapBinaryAccountsFromSlab` (`flatStateManager.ts:424–430`):
- For every 136-byte row in `slab`, it creates a hex string `key` and allocates `const owned = new Uint8Array(BINARY_ACCOUNT_SIZE)` (`104` bytes), then calls `this.writeBinaryAccountKey(key, owned)`.
For **every single account**, V8 allocates on the managed JS heap:
1. `key`: a 64-char `SeqOneByteString` = **`80 bytes`** (1 V8 heap object).
2. `owned = new Uint8Array(104)`: a `JSTypedArray` header (`64 bytes`) + a `JSArrayBuffer` header (`56 bytes`) + a `112-byte` on-heap backing store = **`232 bytes`** (2 V8 heap objects).
3. `shard.set(key, owned)`: a V8 `OrderedHashMap` entry + hash bucket = **`~56 bytes`**.
- Total in `FlatStateManager` alone: **`~368 bytes` and 3 V8 GC-tracked heap objects per account**.
- At **`8,000,000` accounts**, `FlatStateManager` holds **`24,000,000` V8 heap objects (`~3.0 GB` of V8 JS heap)**.
- At **`70,000,000 – 100,000,000` accounts (`10x`)**, this design would require **`300,000,000` V8 heap objects and `~37 GB` of RAM**, which is physically impossible in V8!

---

### Root Cause 3 — Unbounded In-Memory Contract Queues (`codeAndStorageSync.ts`) & Full-File Disk Replay on Resume (`snapStore.ts`)
1. **Unbounded Contract Task Maps (`codeQueue` & `pendingStorage`):**
   - At `10M–100M` accounts (`1.2M–12M` contracts), holding every queued `CodeTask` and `StorageTask` as multi-object JS entries in V8 Maps until all 16 account buckets finish consumes **gigabytes of V8 heap**.
2. **Full-File Disk Replay in `loadIntoAsync` (`snapStore.ts:355–410`):**
   - At `10M` accounts (`1.36 GB` on disk) or `100M` accounts (`13.6 GB` on disk), `loadIntoAsync` currently calls `await fs.promises.readFile(file)` on all 16 `.bin` files and replays every single historical account back into `FlatStateManager` RAM on startup!

---

## 2. The `100M`-Account (`10x`) Scale Architecture (3 Cohesive Slices)

To guarantee that Ethy and `@ethereumjs/statemanager` stay fast, crash-free, and under **`< 350 MB` V8 Heap** whether syncing **`1M`, `10M`, or `100M` accounts**, we introduce three structural upgrades:

### Slice 1 (`@ethereumjs/statemanager`): Page-Allocated `BinaryAccountArena` + Configurable `maxResidentAccounts` Working-Set Cap
1. **Contiguous `BinaryAccountArena` (Eliminates Per-Account `new Uint8Array(104)` V8 Heap Objects):**
   - Instead of allocating a separate `new Uint8Array(104)` (`232 bytes`, 2 V8 objects) per account, `FlatStateManager` stores 104-byte binary accounts inside **fixed-size `Uint8Array` Arena Pages** (`ARENA_PAGE_ACCOUNTS = 32_768`, i.e. `32,768 × 104 = 3,407,872 bytes` ≈ `3.4 MB` per page).
   - Large `3.4 MB` `Uint8Array` buffers are allocated by Node.js in **external C++ `ArrayBuffer` memory outside the V8 JS object graph** (1 single V8 wrapper object per `32,768` accounts instead of `65,536` V8 objects!).
   - Each of the 256 `_accountShards` becomes a `Map<string, number>` mapping `key -> slotIndex` (a 32-bit V8 Small Integer `SMI` costing **`0` heap object allocations**!), with a free-list (`freeSlots: number[]`) for deleted/evicted slots and in-place overwrites when an existing `key` is updated.
2. **Bounded Resident Working Set (`maxResidentAccounts`) + Cold-Lookup Hook (`FlatStateManagerOpts`):**
   - Extend `FlatStateManagerOpts` (`packages/statemanager/src/types.ts`) with two optional, 100% backwards-compatible fields:
     - `maxResidentAccounts?: number` (default `undefined` = unbounded for existing unit tests; Ethy sets `maxResidentAccounts = 500_000`, keeping hot resident state under **`~90 MB`**!).
     - `coldAccountLookup?: (accountHash: Uint8Array) => BinaryAccount | undefined` (optional synchronous fallback when a hash is not in the hot resident shards).
   - Track `_totalAccountCount` (all accounts ingested via `putSnap*` or `putAccount`, minus deletes) and `setSyncedAccountCount(count: number)` so `accountCount()` remains exact in `O(1)` even when cold snap accounts are evicted from the hot resident cache or left on disk during instant resume!
   - Maintain a `_pinnedKeys = new Set<string>()` for accounts mutated via `putAccount` / `modifyAccountFields` / `consumeBAL` (post-pivot BAL diffs and EVM writes). When resident accounts exceed `maxResidentAccounts` during bulk snap ingestion, evict unpinned snap-ingested keys FIFO/clock-style from the shard and return their `slotIndex` to `freeSlots`!

### Slice 2 (`@ethereumjs/ethy`): Zero-Pinning Disk-Spilled Contract Queue & `O(1)` Tail-Seek Instant Resume (`< 5ms` for `100M` Accounts!)
1. **Fix the Byte-View Buffer-Pinning Leak (`src/sync/syntheticPeer.ts` & `src/sync/codeAndStorageSync.ts`):**
   - In `codeAndStorageSync.ts:138`, copy `accountHash: new Uint8Array(accountHash)` (never storing a byte view into `result.slab.buffer`!).
2. **Disk-Spilled Binary Contract & Storage Queue (`src/sync/codeAndStorageSync.ts` & `src/persist/snapStore.ts`):**
   - Cap in-memory `codeQueue` and `pendingStorage` at `MAX_IN_MEMORY_CONTRACT_TASKS = 16_384` (`< 3 MB` V8 heap).
   - When `codeQueue.size >= 16_384` or `pendingStorage.size >= 16_384`, spill additional ingested contract metadata rows (`accountHash[32] || codeHash[32] || storageRoot[32]` = `96` bytes per row) into an append-only `contracts-spill.bin` file in `SnapPivotStore` (or stream them directly from the bucket `.bin` journals once all 16 account buckets reach `done`!).
   - As `SnapCodeAndStorageSynchronizer` drains in-memory tasks during `Snap Sync · Storage`, it refills `16,384`-task windows from disk until all contracts are synced.
3. **`O(1)` Tail-Seek Instant Resume & Cold Disk Lookup in `SnapPivotStore` (`src/persist/snapStore.ts`):**
   - Because each binary bucket journal (`accounts/0.bin .. accounts/f.bin`) starts with the 4-byte `BINARY_ACCOUNT_JOURNAL_MAGIC` followed by contiguous `136-byte` records sorted by `accountHash`:
     - **Instant `O(1)` Resume (`loadIntoAsync`):** For any bucket file larger than `HOT_WARMUP_BYTES` (e.g. `> 2,000` rows = `272 KB`), `loadIntoAsync` does **not** `readFile` the entire 50–500 MB file into RAM! Instead, it opens a file handle (`fs.promises.open(file, 'r')`), checks `stat.size`, computes `recordCount = Math.floor((stat.size - 4) / 136)` in **`O(1)`**, reads only the **tail window** (e.g. the last `256` rows = `34 KB`, including the final `lastHash` at `stat.size - 136`) to warm `FlatStateManager` and set `bucket.currentLastHash` + `bucket.accountsLoaded`, and updates `stateManager.setSyncedAccountCount(totalRestored)`!
     - **Result:** Resuming a **`10M` or `100M` account sync** at startup takes **`< 10ms` and `< 5 MB` of RAM** instead of reading gigabytes from disk!
     - **On-Demand Cold Lookup & Sampling (`lookupBinaryAccountByHash` / `sampleFromDisk`):** Wire `FlatStateManager`'s `coldAccountLookup` to `SnapPivotStore.lookupBinaryAccountByHash(accountHash)` (which binary-searches the sorted `136`-byte records in `accounts/<nibble>.bin` via `fs.readSync(fd, buf, 0, 136, offset)` in `<= 20` micro-reads = `< 0.5ms`), so `/account`, `/range`, `/sample`, and EVM calls (`WP-06`) can read **any** of the `10M–100M` accounts on disk seamlessly!
4. **4 Targeted Post-`WP-04f` Multi-Peer & `PeerBookStore` Fixes (`src/sync/accountSync.ts`, `src/sync/snapSchedulePolicy.ts`, `src/persist/peerBook.ts`, `src/net/discoveryHold.ts`):**
   - **Fix 1 — Timeout Bucket Poisoning (`accountSync.ts:289`):** In `expireStaleRanges`, when an unproven peer times out after `4,000ms` (e.g. a peer that negotiated `snap/1` in `HELLO` but silently drops `GET_ACCOUNT_RANGE` without replying), `hasHealthyAlternatePeer` (`accountSync.ts:260`) checks `this.getSnapPeers()` without excluding peers that already failed or without checking if the alternate peer is actually proven (`snapResponsesOk > 0`). Worse, if only `1` proven peer is connected when we probe an unproven 2nd peer, `hasHealthyAlternatePeer` returns `true` for the first timeout, **but if 2 unproven peers time out or if `Peer #1` is momentarily resting**, the bucket gets marked `stalled` for `2–15s`! **Rule:** A bucket must **never** be marked `stalled` (`stallUntil`) when an unproven peer (`snapResponsesOk === 0`) fails or times out! Always return the bucket to `status = 'pending'` with `0ms` bucket delay so the proven peer (`Peer #1`) immediately reclaims it!
   - **Fix 2 — Do Not Count Non-`snap` / Crawler Peers (`reth` without `snap`, crawler nodes) Toward VIP Target (`discoveryHold.ts:21` & `peerBook.ts:233`):**
     - In the live screenshot (`Peers: 2 connected (1 snap)`), crawler peers disconnect right after `HELLO`/`STATUS` and **never** speak `snap/1`, and many `reth` nodes on Sepolia do not advertise `snap/1`!
     - Yet in `peerBook.ts:233` (`noteTelemetryPeer`), **every** peer with `bestHash !== undefined` (even crawler nodes and non-`snap` `reth` nodes!) gets saved into `peers.json` with `dialAfter = now`! And on every `150ms` telemetry tick while connected, `noteTelemetryPeer` overwrites `row.dialAfter = now` (`peerBook.ts:240`), **erasing the 20s `noteDialAttempt` hold** the moment the peer handshakes, so if a crawler peer disconnects 1 second later, `vipDialCandidates` dials that same crawler peer again on the very next pass!
     - **Fix:**
       1. In `peerBook.ts` (`noteTelemetryPeer`): **Never** reset `row.dialAfter = now` on `noteTelemetryPeer`! Only reset `dialAfter = 0` inside `noteSnapSuccess` (when a peer actually serves a `snap/1` range!), and record `snapCapable: peer.snapSession === true` on `PeerBookRow`.
       2. In `vipDialCandidates` and `dialCandidates`: filter out peers where `snapCapable === false` (or `clientFamily?.toLowerCase().includes('scout')`), so Ethy **never** wastes VIP redial slots on crawler or non-`snap` nodes!
       3. In `countSnapPeersTowardVipTarget` (`discoveryHold.ts:21`): count only peers with `snapSession === true && (snapResponsesOk ?? 0) > 0` (proven serving `snap/1` peers!), not unproven or disconnected peers!
   - **Fix 3 — Raise Per-Peer Pipeline Depth (`MAX_IN_FLIGHT_PROVEN = 4`) & Rank Proven Peers by Latency (`snapSchedulePolicy.ts:10, 56`):**
     - Why did going from `1 snap` peer to `2 snap` peers at `3.3M` accounts stay at `10–13k acc/s`?
       1. `rankSnapPeers` (`snapSchedulePolicy.ts:56–63`) returns `0` whenever both peers have `snapResponsesOk > 0` (`if (aProven === 0) return a.avgLatencyMs - b.avgLatencyMs`, where `aProven === 0` means *proven*!). Wait — look at line 61 of `snapSchedulePolicy.ts`: when `a.avgLatencyMs === 0` (because `rttMs` is only populated after the first `15s` RLPx `PING`/`PONG`!), `rankSnapPeers` treats a new peer with `0ms` unknown RTT as faster than a `40ms` peer, or assigns buckets round-robin to a `300ms` peer.
       2. More importantly, with `MAX_IN_FLIGHT_PROVEN = 2` and `128 KiB` pages (`~1,100` accounts/page), each peer is capped at `2` in-flight requests (`~2,200` accounts per RTT), and `SnapAccountSynchronizer` runs on the Main Thread where `putSnapBinaryAccountsFromSlab` + `ingestedMetaFromBinarySlab` + `codeSync.noteAccounts` run per packet. Raising `MAX_IN_FLIGHT_PROVEN` from `2` to **`4`** for fast proven peers (`snapResponsesOk >= 4 && snapTimeouts === 0`) and keeping `16` buckets busy across `2–4` peers doubles per-peer bandwidth utilization!
   - **Fix 4 — `tailSteal` Must Advance `target.currentLastHash` or Split Into a Sub-Range Without Re-Syncing `[mid .. limit]` Twice (`accountSync.ts:440–465`):**
     - Look at `handleAccountRange` lines `440–465` in `accountSync.ts`: when a `steal: true` request (`[mid .. limitHash]`) succeeds, it ingests the accounts at `mid`, **and then discards `lastKey` and resets `clearStealForBucket` without shrinking `target.limitHash` to `mid`!** So the slow primary peer continues walking past `mid` all the way to `limitHash`, **re-downloading the exact same accounts a second time**!
     - **Fix:** When a steal starts at `mid`, clamp `target.limitHash = mid` so the primary peer stops at `mid`, and track the stolen upper range `[ incrementKey32(result.lastKey) .. oldLimitHash ]` until it reaches `oldLimitHash`!

### Slice 3 (`@ethereumjs/ethy`): Early-Warning Resource Watchdog & `100M`-Scale Extrapolation Gate (`src/runtime/resourceBudget.ts` & `test/scaleBudget.spec.ts`)
To provide an **automated early-warning system** that catches any future memory leak or non-constant scaling in CI (< 1 second) *and* at runtime:
1. **Runtime Memory & Heap Pressure Watchdog (`src/runtime/resourceBudget.ts`):**
   - Sample `process.memoryUsage()` (`heapUsed`, `rss`, `external`, `arrayBuffers`) and `v8.getHeapStatistics().heap_size_limit` every 2 seconds.
   - If `heapUsed / heap_size_limit > 0.65` (`65%` warning threshold), automatically trim `FlatStateManager` unpinned resident accounts down to `25%` of `maxResidentAccounts` and record a `warn` diagnostic in `spine.diagnosticRingBuffer` (`"Memory watchdog trimmed resident state cache (heap X MB)"`) — **actively preventing OOM crashes before V8 ever approaches its limit**!
2. **Automated `100M`-Account Extrapolation & Zero-Leak CI Gate (`test/scaleBudget.spec.ts`):**
   - **Test 1 — Zero Byte-View Buffer-Pinning Gate:** Pass a `272 KB` `ArrayBuffer` slab with 1 contract through `ingestedMetaFromBinarySlab` → `codeSync.noteAccounts`, and assert that `codeSync`'s internal maps hold **zero** references to the `272 KB` `slab.buffer` (`task.accountHash.buffer !== slab.buffer` and `task.accountHash.byteLength === 32`).
   - **Test 2 — Flat Asymptotic Memory Slope Gate (Proving `100M` Scale):** Configure `FlatStateManager({ maxResidentAccounts: 10_000 })` + `SnapCodeAndStorageSynchronizer` (with `MAX_IN_MEMORY_CONTRACT_TASKS = 2_000`). Ingest `200,000` accounts (`20×` the resident cap, including `30,000` contracts). Assert:
     - `stateManager.accountCount() === 200_000`,
     - `stateManager.residentAccountCount() <= 10_000`,
     - In-memory contract queue size `<= 2_000` (with remaining `28,000` spilled to disk),
     - Marginal V8 heap growth between `50,000` and `200,000` accounts is **`<= 0` bytes/account** (bounded plateau), mathematically guaranteeing that `100,000,000` (`100M`) accounts cannot exhaust V8 heap!
   - **Test 3 — `O(1)` Tail-Seek Instant Resume + Cold Binary-Search Lookup Gate:** Write a binary bucket journal with `50,000` sorted records (`6.8 MB`), run `loadIntoAsync`, and assert:
     - `loadIntoAsync` completes in **`< 25ms`** (reading only the tail, not the full file),
     - `spine.totalAccountsSynced === 50,000` and `bucket.currentLastHash` matches the `50,000`th record,
     - Querying record `#0`, `#12,345`, and `#49,999` via `stateManager.getAccountByHash(hash)` succeeds via `coldAccountLookup` binary search on disk in `< 1ms`!
   - **Test 4 — Mixed Adversarial Peer Set & Zero-Duplicate Tail-Steal Gate (`test/multiPeerSwarm.spec.ts`):**
     - Connect 1 proven fast `SyntheticSnapPeer` alongside: (a) a crawler peer that completes `ETH STATUS` (`snapSession: false`) and disconnects 1s later, (b) an `eth`-only `reth` peer (`snapSession: false`), and (c) a silent-timeout unproven `snap` peer (`4s` timeout). Assert that `noteTelemetryPeer` does **not** clear `dialAfter` on the crawler or `eth`-only peer, `vipDialCandidates` skips both on the next pass, the silent-timeout peer does **not** mark its bucket `stalled`, and tail work-stealing completes all 16 buckets with **zero duplicate range requests** (`totalRequestsForSameOrigin === 1`)!

---

## 3. Acceptance Criteria & Verification Gates

- [x] `@ethereumjs/statemanager`: `FlatStateManager` stores `BinaryAccount` records in contiguous `BinaryAccountArena` pages (`Map<string, number>` slot indices, zero per-account `new Uint8Array(104)` objects) and supports `maxResidentAccounts` eviction + `coldAccountLookup` fallback while keeping `accountCount()` exact.
- [x] `@ethereumjs/ethy`: `codeAndStorageSync.ts` copies `accountHash` (`byteLength === 32`, zero `272 KB` byte-view buffer pinning) and caps in-memory contract/storage tasks (`16,384`), spilling excess tasks to disk.
- [x] `@ethereumjs/ethy`: `SnapPivotStore.loadIntoAsync` resumes large `.bin` journals in `O(1)` via file size + tail read (`< 25ms`), and `lookupBinaryAccountByHash` serves cold accounts from sorted `.bin` files via `O(log N)` binary search.
- [x] `@ethereumjs/ethy`: Post-`WP-04f` multi-peer fixes landed: unproven peer timeouts never mark buckets `stalled`; `noteTelemetryPeer` does not clear `dialAfter` holds and filters out non-`snap` / crawler peers; `countSnapPeersTowardVipTarget` counts only proven serving `snap` peers; `MAX_IN_FLIGHT_FAST_PROVEN = 4` after 4 clean pages; and tail steal clamps `target.limitHash = mid` so stolen ranges are not downloaded twice.
- [x] `@ethereumjs/ethy`: `src/runtime/resourceBudget.ts` monitors V8 heap usage and auto-trims unpinned resident cache on memory pressure; `test/scaleBudget.spec.ts` passes in `< 1.5s`.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/statemanager` and `@ethereumjs/ethy`.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

See attached planner artifact in the WP-04g planning session (slices: `BinaryAccountArena` + resident cap in `@ethereumjs/statemanager`; byte-view fix, contract window, tail resume, cold lookup, peer fixes, and `resourceBudget` in `@ethereumjs/ethy`; `scaleBudget.spec.ts` gates).

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **`MAX_IN_FLIGHT_PROVEN` stays 2**; depth 4 is **`MAX_IN_FLIGHT_FAST_PROVEN`** when `snapResponsesOk >= 4` and `snapTimeouts === 0`.
- **Resident eviction** uses stamp-ordered FIFO over shard keys (not `indexOf` on a growing array).
- **Contract backlog** with `SnapPivotStore`: journal scan via `nextContractScanBatch`; without a store, **`contracts-spill.bin`** (96-byte rows) for tests.
- **Tail resume** sets logical `accountCount` from bucket `accountsLoaded` sums; contract scan cursor persisted in `contract-scan.json`.
- **`scaleBudget` heap gate** uses 80k-account smoke with 12 MB slack (Vitest without `--expose-gc`); resident and queue caps are the primary assertions.
