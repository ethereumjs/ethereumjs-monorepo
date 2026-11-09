# WP-06f: Storage & Code Sync Engine — Pre-hashed Storage Trie Fix, Multi-Account Storage Batching (`16` Accounts/Req), Parallel Pipelining, Total Contract Accounting & Honest TUI Progress

- **Status:** `DONE`
- **Dependencies:** `WP-04g` (`DONE`), `WP-04i` (`DONE`), `WP-06e` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Eliminate the **"98%–99% Storage & Code Sync Wall"** uncovered during our first complete Sepolia `161,610,793`-account `snap/1` sync (`2026-11-09` run in `tmp/node1`), where:
1. **All 161.6M accounts synced in ~35 minutes (`08:38 → 09:13`)**, reaching `16/16` buckets done smoothly and linearly.
2. Then **`Snap Sync · Storage` stalled for >32 minutes (`09:13 → 09:46+`)** throwing **16,700+ `invalid all elements proof: root mismatch` warnings** and leaving the UI stuck at `98%` / `99%` with `641.4k code · 113.4k slots` and zero visibility into total remaining contracts, speed, or ETA.

This work package fixes **five concrete root causes** across the cryptographic verification layer, the `snap/1` wire batching protocol, the disk-persistence hot path, total contract accounting, and the `Node Pulse` / `SNAP Metrics` TUI.

---

## 2. Forensic Log Analysis of the `2026-11-09` Sepolia Run (`tmp/node1`)

### What Succeeded Spectacularly
- **Account Sync (`08:38:12 → 09:13:34`, 35m 22s):**
  - Anchored at `#12,096,381` and synced **all `161,610,793` Sepolia accounts** across all `16/16` buckets (`~10.1M` accounts per bucket) at sustained speeds up to **`62,847–190,000+ acc/s`**!
  - Continuous `eth/71` BAL streaming + routine 16-block rolling pivot (`WP-04k`) stepped the pivot smoothly **21 times** (`#12,096,381 → #12,096,717`, `340` BALs streamed, `336` applied) with `cl=verified` throughout.
  - All `813k+` contract bytecode blobs downloaded cleanly in ~4.5 minutes (`09:13:35 → 09:18:23`).

### The 5 Root Causes of the "98%–99% Storage & Code Wall"

#### Root Cause 1 (CRITICAL BUG): Stale `storageRoot` on `done` Buckets After Rolling Pivot + Infinite Retry Loop (`accountSync.ts` & `codeAndStorageSync.ts`)
At `09:18:23.736Z` (the exact second `codeQueue` emptied and `SnapCodeAndStorageSynchronizer` began dispatching `GetStorageRanges`), the log erupted with **16,700+ consecutive warnings** across every single peer (`Nethermind` and `Geth` alike):
```text
[WARN] [snap] invalid all elements proof: root mismatch (peer=02b9e31f8f41)
[WARN] [snap] invalid all elements proof: root mismatch (peer=34da37590bf0)
[WARN] [snap] invalid all elements proof: root mismatch (peer=2671639e2c4b)
[WARN] [snap] invalid all elements proof: root mismatch (peer=88e881f9a31c)
```
**Why did `verifyStorageRangeJob` fail with `invalid all elements proof: root mismatch` 16,700+ times in a row?**
1. Look at what happens when a rolling-pivot BAL (`WP-04k`, steps `1..21`, `#12,096,381 → #12,096,717`) modifies the storage of an account whose bucket has already finished (`bucket.status === 'done'`):
   - `codeAndStorageSync.noteBalApplied` (`codeAndStorageSync.ts:242`) calls `this.onBalRefreshAccount?.(accountHash)` (`accountSync.enqueueAccountRefreshCursor(accountHash)`), and then calls `this.invalidateAccount(accountHash)`.
   - Look at `SnapAccountSynchronizer.enqueueAccountRefreshCursor` (`packages/ethy/src/sync/accountSync.ts:160`):
     ```ts
     if (bucket === undefined || bucket.status === 'done') return
     ```
     **And** look at `SnapAccountSynchronizer.schedule()` (`packages/ethy/src/sync/accountSync.ts:431–439`):
     ```ts
     if (
       this.spine.snapBuckets.length > 0 &&
       this.spine.snapBuckets.every((b) => b.status === 'done')
     ) {
       ...
       return
     }
     ```
   - Because `enqueueAccountRefreshCursor` returns early whenever `bucket.status === 'done'`, **every single BAL that touched storage in an already-completed bucket (e.g. Bucket `0x0`, which finished 2 minutes into the 35-minute sync!) was silently ignored!**
   - Meanwhile, `FlatStateManager.consumeBAL` updates the storage slot values in memory, **not** the 32-byte MPT `storageRoot` stored inside the 104-byte `BinaryAccount`.
   - So `invalidateAccount(accountHash)` (`codeAndStorageSync.ts:264`) reads `getBinaryAccountStorageRoot(binary)` from `FlatStateManager` — which is **still the stale `storageRoot` from when Bucket `0x0` was synced at `#12,096,381`**!
2. Then, at `09:18:23`, `SnapCodeAndStorageSynchronizer` sends `GetStorageRanges` for that contract against the **new rolling `this.spine.pivotStateRoot` (`#12,096,573` / `#12,096,717`)**:
   - The peer returns the contract's complete storage slots (`proof = []`) at `#12,096,573`.
   - `verifyStorageRangeJob` (`snapVerifyJob.ts:256`) calls `verifyMerkleRangeProof(opts.storageRoot, null, null, keys, values, null)` which builds the storage trie from those slots (computing the **new** storage root at `#12,096,573`) and compares it to `opts.storageRoot` (the **stale** `08:38` storage root from `#12,096,381`) → throwing **`invalid all elements proof: root mismatch`**!
3. **And why did it loop 16,700+ times forever and block the entire storage queue?**
   - Look at `handleStorageRanges` (`packages/ethy/src/sync/codeAndStorageSync.ts:444–452`):
     ```ts
     if (!result.ok) {
       recordDiagnostic(this.spine, {
         subsystem: 'snap',
         severity: 'warn',
         peerId,
         message: result.reason ?? 'storage range failed',
       })
       return
     }
     ```
   - And look at `nextStorageTask()` (`codeAndStorageSync.ts:322–330`):
     ```ts
     private nextStorageTask(): StorageTask | undefined {
       const inFlight = this.storageKeysInFlight()
       for (const task of this.pendingStorage.values()) {
         const key = accountHashKey(task.accountHash)
         if (task.verifying || inFlight.has(key)) continue
         return task
       }
       return undefined
     }
     ```
   - Because `handleStorageRanges` **never increments `task.missRetries`, never refreshes `task.storageRoot`, and never removes `task` from `this.pendingStorage`**, that single stale-root contract remains the **very first entry in `this.pendingStorage`** (`Map` iteration order!) and is re-dispatched to every peer 10 times per second forever!

---

#### Root Cause 2: 1-Account-Per-Request `GetStorageRanges` & Depth-1 Peer Serialization (`codeAndStorageSync.ts`)
Look at how `SnapCodeAndStorageSynchronizer.schedule()` (`codeAndStorageSync.ts:346–394`) dispatches requests:
1. **Strict Priority Blocking (`code` blocks `storage`):**
   - A peer only sends `GetByteCodes` until `codeQueue` is empty, and only then sends `GetStorageRanges`.
2. **Depth `1` Per Peer (`flightTracker.has(peer.id)`):**
   - Even when we have fast proven Nethermind/Geth peers capable of depth `6` (`maxInFlightForPeer(peer)`), `codeAndStorageSync.ts` checks `if (this.flightTracker.has(peer.id)) continue` — restricting every peer to **1 request in flight at a time**!
3. **1 Account Per `GetStorageRanges` Request (`[task.accountHash]`):**
   - The `snap/1` `GetStorageRanges` protocol (`[reqId, rootHash, accountHashes[], origin, limit, responseBytes]`) is specifically designed to query **multiple contracts in a single message** (`accountHashes` is a list of 32-byte account hashes!), because 95% of contracts have `< 10` storage slots!
   - Currently, `codeAndStorageSync.ts:387` passes **`[task.accountHash]` (1 single account per RTT!)**.
   - If Sepolia has `300,000` storage contracts, sending `1` account per request at `150ms` RTT takes **`45,000` network round-trips (`~2 hours`)**!
   - Batching **`16` accounts per `GetStorageRanges` request** with **`256 KiB` response budget** and **pipelining `4` requests per peer** reduces round-trips by **`16× × 4× = 64×`** (turning 2 hours into **< 2 minutes**)!

---

#### Root Cause 3: Synchronous `fs.writeFileSync` / `fs.fsyncSync` Per Contract on the Main Thread (`snapStore.ts`)
Look at what happens on the Main Thread for every single bytecode and storage response:
- In `SnapPivotStore.appendCode` (`snapStore.ts:1266–1274`):
  ```ts
  const file = path.join(this.pivotDir(this.activeStateRoot), 'code', `${hex}.bin`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, ...)
  ```
  For `813,000` contracts, it creates **`813,000` individual tiny `.bin` files** in a single directory (`pivots/<root>/code/`), calling `fs.mkdirSync` + `fs.writeFileSync` synchronously on the main thread! (In fact, `Glob` on `tmp/node1` showed tens of thousands of tiny `.bin` files inside `code/` and `storage/`!)
- Even worse, in `SnapPivotStore.appendStorageSlots` (`snapStore.ts:1470–1491`):
  ```ts
  const fd = fs.openSync(file, 'a')
  try {
    ...
    fs.writeSync(fd, record)
    fs.fsyncSync(fd)
  } finally {
    fs.closeSync(fd)
  }
  ```
  It calls **`fs.openSync` + `fs.writeSync` + `fs.fsyncSync` + `fs.closeSync` synchronously on the Main Thread for EVERY SINGLE storage contract**! Calling hardware `fsyncSync` 100,000 times stalls the Node.js event loop for minutes!

---

#### Root Cause 4: Duplicate Bytecode Re-Downloads & Unknown Total Contract Counts Due to `16,384` Cap (`codeAndStorageSync.ts`, `snapStore.ts`, `buckets.ts`)
Why did `codesSynced` reach `641k–813k` while the progress bar jumped from `85%` to `98%` and then sat at `98%–99%` with no total denominator?
1. **Missing `stateManager.getCodeByHash` Check & Full Re-Scan from Bucket `0` (`codeAndStorageSync.ts:148–160` & `554–565`):**
   - Look at `noteAccounts` (`codeAndStorageSync.ts:148`):
     ```ts
     if (!equalsBytes(codeHash, KECCAK256_NULL)) {
       const key = codeHashKey(codeHash)
       if (!this.codeQueue.has(key)) {
         if (this.codeQueue.size >= this.maxInMemoryContractTasks) {
           if (this.snapStore !== undefined) {
             this.snapStore.enableContractScan()
           } ...
           continue
         }
         this.codeQueue.set(key, { codeHash: new Uint8Array(codeHash), missRetries: 0 })
       }
     }
     ```
   - Once a `codeHash` is downloaded in `handleByteCodes` (`line 497`), it is **deleted from `this.codeQueue`** (`this.codeQueue.delete(codeHashKey(hash))`), and `noteAccounts` **never checks `if (this.stateManager.getCodeByHash(codeHash) !== undefined)`**!
   - Worse: when `enableContractScan()` is armed after the first `16,384` tasks, `this.contractScan` starts at **`{ bucket: 0, byteOffset: 8 }`** (the very beginning of Bucket `0`, including the first `16,384` contracts that were already queued in memory!), and hundreds of thousands of Sepolia contracts share identical proxy/ERC-20 `codeHash`es. Because `noteAccounts` only checks `!this.codeQueue.has(key)`, every shared bytecode and every re-scanned early contract gets **re-queued and re-downloaded over the network**!
2. **Hidden Disk Backlog (`16,384` Cap) & Unit Mismatch in `computeSnapProgressPct(spine)` (`buckets.ts:326–331`):**
   ```ts
   const codeTotal = spine.codesSynced + spine.codesQueued
   const codeFrac = codeTotal <= 0 ? 1 : spine.codesSynced / codeTotal
   const storTotal = spine.storageSlotsSynced + spine.storageQueued
   const storFrac = storTotal <= 0 ? 1 : spine.storageSlotsSynced / storTotal
   ```
   - Because `codesQueued` and `storageQueued` only reflect the **in-memory window (`<= 16,384`)** and completely ignore the **hundreds of thousands of contracts still waiting in the 16 `.bin` journal files on disk (`contractScan`)**:
     - As soon as `600k` codes are synced and `16k` are in the queue, `codeFrac = 600k / 616k = 97.4%` — even if another `400k` contracts haven't even been scanned from disk yet!
     - And `storTotal` adds **`storageSlotsSynced` (slots!)** to **`storageQueued` (accounts!)** — mixing two different units (e.g. `113,400 slots + 16,384 accounts = 87.4%` even when `0%` of the remaining `16,384` storage accounts have been synced)!

---

#### Root Cause 5: Blind TUI During `Snap Sync · Storage` (`cockpit.ts` & `buckets.ts`)
Look at the user's screenshot of `Node Pulse` during `Snap Sync · Storage`:
```text
Stage     Snap Sync · Storage
Target    #12,096,653 → #12,096,649 · +15 BALs · step 17
Progress  ████████████████  99%
State     641.4k code · 113.4k slots
```
1. **No Denominator (`synced / total`):** The user sees `641.4k code · 113.4k slots`, with zero indication of how many total contract codes or storage accounts exist (`e.g. code 641k/825k · stor 42k/180k acc (113k slots)`).
2. **No Rate or ETA:** Unlike `Snap Sync · Accounts` (which shows `48,094/s` and `(~12m)`), `Snap Sync · Storage` shows no items/s rate and no ETA on the Progress bar.
3. **Compressed `85% → 100%` Progress Allocation:** Account sync (35 minutes) gets `0% → 85%`, while Code & Storage sync gets squeezed into `85% → 100%` (and immediately jumps to `98%` because of the unit mismatch and `16k` window cap).
4. **Target Row Inverted Display (`#12,096,653 → #12,096,649`):** When `bestPeerHead` lags `pivot` by a few blocks between status updates, `snapTargetRow` prints `#12,096,653 → #12,096,649` (target lower than pivot!) instead of clamping `tip = tip > pivot ? tip : pivot`.

---

## 3. Architectural Design (`WP-06f`)

### 3.1 Exact Total Contract & Storage-Account Counting + Bytecode Deduplication (`spine/types.ts`, `accountSync.ts`, `codeAndStorageSync.ts`, `snapStore.ts`)
We already inspect every single `BinaryAccount` in `ingestedMetaFromBinarySlab(slab)` (`syntheticPeer.ts:400`) when accounts are ingested!
1. **Skip Already-Synced Bytecode Blobs (`codeAndStorageSync.ts:148`):**
   - In `noteAccounts`, before adding `codeHash` to `this.codeQueue`, check **`if (this.stateManager.getCodeByHash(codeHash) !== undefined) continue`**! That immediately prevents re-downloading shared proxy/ERC-20 bytecode blobs or re-downloading the first `16,384` contracts when `contractScan` sweeps from Bucket `0`.
2. **Add Monotonic Total Counters to `EthySpine`:**
   - `codesTotal: number` — total contract accounts (or unique `codeHash` tasks) discovered across synced buckets.
   - `storageAccountsTotal: number` — total accounts with non-empty `storageRoot` discovered across synced buckets.
   - `storageAccountsSynced: number` — number of storage-bearing accounts whose storage trie has been completed.
   - `contractsPerSec: number` — combined rate of `(codesSynced + storageAccountsSynced) / s` during `Snap Sync · Storage`, plus `storageEtaMinutes?: number`.
3. **Distinguish Live Ingest Discovery from Disk-Scan Refill (`SnapCodeAndStorageSynchronizer`):**
   - In `noteAccounts(entries, { fromDiskRefill?: boolean })`:
     - On initial account ingest (`fromDiskRefill !== true`), count every storage-bearing account (`!equalsBytes(storageRoot, KECCAK256_RLP)`) toward `spine.storageAccountsTotal` and every new contract code toward `spine.codesTotal` **before** checking the `16,384` in-memory spill cap!
     - Track `completedStorageAccounts = new Set<string>()` (or check whether `accountHash` was already completed before `enableContractScan`) so `refillContractTasksFromDisk` never re-queues a storage account that already finished in the initial `16,384` window!
     - On session resume (`SnapPivotStore`), compute or restore `codesTotal`, `codesSynced`, `storageAccountsTotal`, `storageAccountsSynced`, and `storageSlotsSynced` so `Node Pulse` has exact denominators immediately after restart.

### 3.2 Fix Stale-Root Storage Verification, Allow Refresh Cursors on `done` Buckets & Bound Retries (`accountSync.ts`, `snapVerifyJob.ts`, `codeAndStorageSync.ts`)
1. **Allow 1-Account Refresh Cursors Even When `bucket.status === 'done'` (`accountSync.ts:156–178` & `431–439`):**
   - In `SnapAccountSynchronizer.enqueueAccountRefreshCursor(accountHash)`:
     - Remove `if (bucket.status === 'done') return`! A point-refresh cursor (`refresh: true`, `origin = accountHash`, `limit = accountHash`) is specifically needed for buckets whose initial sweep is already `'done'` when a rolling-pivot BAL modifies an account's storage or code!
     - Keep `bucket.status = 'done'` when only `refresh: true` cursors exist in `bucket.subRanges` (so `snapBucketsDoneCount` stays `16/16` and `Snap Sync · Storage` does not flip back to `Snap Sync · Accounts`), **and** in `SnapAccountSynchronizer.schedule()` (`line 431`), continue scheduling whenever any bucket has an active `refresh: true` cursor!
     - When `commitVerifiedAccountRange` commits a `refresh: true` cursor, update `FlatStateManager` (`putSnapBinaryAccountsFromSlab(persistSlab)`) AND call `this.onAccountsIngested?.(ingestedMetaFromBinarySlab(persistSlab))` so `codeSync.noteAccounts` updates `existing.storageRoot` in `pendingStorage` to the latest pivot's `storageRoot`!
2. **Bounded Retry & Stale-Root Recovery in `SnapCodeAndStorageSynchronizer` (`codeAndStorageSync.ts:444`):**
   - When `handleStorageRanges` receives `!result.ok` (e.g. `invalid all elements proof: root mismatch` because `task.storageRoot` was from an earlier pivot before a BAL modified that contract's storage):
     - Increment `task.missRetries++`.
     - Re-insert `task` at the **back** of `this.pendingStorage` (`this.pendingStorage.delete(key); this.pendingStorage.set(key, task)`) so a failing task never blocks the head of the queue!
     - On first failure (`task.missRetries === 1`), trigger `this.onBalRefreshAccount?.(task.accountHash)` to fetch the contract's current `storageRoot` at the latest `pivotStateRoot`!
     - If `task.missRetries > 2`, delete the task from `this.pendingStorage` (and increment `spine.storageAccountsSynced`) with a rate-limited diagnostic so no contract can ever spin in an infinite loop!
3. **Multi-Account `STORAGE_RANGES` Verification (`snapVerifyJob.ts`):**
   - Under `snap/1`, `StorageRanges` (`[reqId, slots[][], proof[]]`) returns `slots` as a list of slot-lists — **one slot-list per completed/last account** in `accountHashes[]`:
     - For indices `0 .. ranges.length - 2` (and index `ranges.length - 1` when `proof.length === 0`), each `ranges[i]` is a **complete storage trie** for `accountHashes[i]` (`proof = null`, verified against `storageRoots[i]`).
     - Only when `proof.length > 0` is the **last** entry `ranges[ranges.length - 1]` (or empty range when `ranges.length === 0`) a partial/split storage trie for `accountHashes[ranges.length - 1]` verified with two-edge `proof` against `storageRoots[ranges.length - 1]` from `origin`!
   - Extend `verifyStorageRangeJob` to accept `accounts: Array<{ accountHash: Uint8Array; storageRoot: Uint8Array }>` + `origin: Uint8Array` and verify each returned account's slot list independently (so if 1 account in a 16-account batch has a stale `storageRoot`, the other 15 valid accounts in the batch still commit cleanly!).

### 3.3 Multi-Account Storage Batching (`16` Accounts/Req) & Parallel Pipelining (`codeAndStorageSync.ts`)
Accelerate `Snap Sync · Storage` by **30×–50×**:
1. **Batch up to `MAX_STORAGE_ACCOUNTS_PER_REQ = 16` Fresh Storage Tasks (`origin === 0x00..00`):**
   - When `origin` is `0x00..00` (which is true for 99.9% of contracts), `GetStorageRanges` can request **up to `16` account hashes at once** with `RESPONSE_BYTES = 256 * 1024` (`256 KiB`)!
   - Only contracts that were split across multiple replies (`origin > 0x00..00`, i.e. huge contracts with thousands of slots) are requested individually (`[task.accountHash]`) from their continuation `origin`.
   - If a batch of 16 accounts fills `256 KiB` after returning `K < 16` accounts, the remaining `16 - K` accounts stay in `pendingStorage` for the next batch!
2. **Per-Peer Pipelining (`maxInFlightForPeer`, up to `4` Concurrent Code/Storage Requests Per Peer):**
   - Instead of `if (this.flightTracker.has(peer.id)) continue` (depth 1), allow each `snap/1` peer to run up to `Math.min(4, maxInFlightForPeer(peer))` concurrent `GetByteCodes` / `GetStorageRanges` requests!
   - Key `codesInFlight` and `storageInFlight` by `inFlightKey(peerId, reqId)` (just like `accountSync.ts`) instead of `peerId`.

### 3.4 Batched Async Append-Log Persistence for Code & Storage (`snapStore.ts`)
Eliminate the 800,000 tiny `.bin` files and synchronous `fs.fsyncSync` calls on the Main Thread:
1. Replace per-contract `code/<hash>.bin` and `storage/<hash>.bin` + `fs.fsyncSync` with **sharded/append-only binary slab files** (or buffered async writes without per-contract `fsyncSync`):
   - `appendCode(codeHash, code)` and `appendStorageSlots(accountHash, slots)` must buffer and append asynchronously (or write without `fs.fsyncSync` on the hot path, flushing only on `maybeFlushMetadata` / shutdown), keeping Main Thread turn latency `< 5ms`.

### 3.5 Honest, Informative TUI for `Snap Sync · Storage` (`cockpit.ts` & `buckets.ts`)
1. **Fix `computeSnapProgressPct(spine)` (`buckets.ts`):**
   - Use **75% for Accounts** (`0% → 75%`) and **25% for Code & Storage** (`75% → 100%`), or **80% / 20%**, using **consistent units and true totals**:
     - `codeTotal = Math.max(spine.codesTotal, spine.codesSynced + spine.codesQueued)`
     - `codeFrac = codeTotal <= 0 ? 1 : spine.codesSynced / codeTotal`
     - `storAccTotal = Math.max(spine.storageAccountsTotal, spine.storageAccountsSynced + spine.storageQueued)`
     - `storFrac = storAccTotal <= 0 ? 1 : spine.storageAccountsSynced / storAccTotal`
     - Never add `storageSlotsSynced` (slots) to `storageQueued` (accounts)!
2. **Show Denominators (`synced / total`), Speed & ETA in `Node Pulse` (`cockpit.ts`):**
   - During `Snap Sync · Storage` (or `Snap Sync · Code & Storage`):
     - **Stage:** `Snap Sync · Code & Storage` (or `Snap Sync · Bytecode` while `codesSynced < codesTotal`, then `Snap Sync · Storage`)
     - **Progress:** `formatProgressBar(pct, storageEtaMin)` — with live ETA in minutes!
     - **State:** Show exact progress against the known totals plus slot count and rate:
       `code 641k/813k · stor 85k/142k (113k slots)` (or compact equivalent that fits cleanly in the column width).
3. **Clamp Target Row (`snapTargetRow` in `cockpit.ts`):**
   - Ensure `const rawTip = spine.bestPeerHead ?? spine.headBlockNumber ?? pivot; const tip = rawTip > pivot ? rawTip : pivot` so `Target` never displays a tip block number lower than `pivot` (`#12,096,653 → #12,096,649`).

---

## 4. Acceptance Criteria (`WP-06f`)

- [x] `SnapAccountSynchronizer.enqueueAccountRefreshCursor` and `schedule()` allow `refresh: true` 1-account cursors to run even when `bucket.status === 'done'` (without flipping `bucket.status` away from `'done'`), updating `FlatStateManager` and `pendingStorage` with the contract's current `storageRoot` after a BAL modifies storage.
- [x] `SnapCodeAndStorageSynchronizer.noteAccounts` skips bytecode blobs already present in `stateManager.getCodeByHash(codeHash)` (preventing duplicate downloads of shared proxy/ERC-20 bytecode blobs and re-scans from Bucket `0`).
- [x] `SnapCodeAndStorageSynchronizer` batches up to `16` fresh storage accounts per `GetStorageRanges` request (`256 KiB`), pipelines up to `4` requests per peer (`inFlightKey(peerId, reqId)`), rotates failing tasks to the back of `pendingStorage`, triggers `onBalRefreshAccount` on first mismatch, and bounds `missRetries <= 2` so no storage task can ever block the queue or loop infinitely.
- [x] `SnapPivotStore.appendCode` and `appendStorageSlots` remove synchronous per-contract `fs.fsyncSync` from the main thread.
- [x] `EthySpine` tracks `codesTotal`, `storageAccountsTotal`, `storageAccountsSynced`, `contractsPerSec`, and `storageEtaMinutes` across live ingest, disk contract scan, and session resume.
- [x] `computeSnapProgressPct` uses `codesSynced / codesTotal` and `storageAccountsSynced / storageAccountsTotal` (never mixing slots with accounts), and `Node Pulse` displays `synced/total` for code and storage accounts, live ETA, and clamped `pivot → tip`.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/ethy`.

---

## 5. Concrete Implementation Plan (Planner — Grok 4.7)

See attached plan (2026-11-09): **no `@ethereumjs/mpt` changes.** Root cause is stale `storageRoot` on `done` buckets (refresh cursor dropped), head-of-queue infinite retry, bytecode re-queue without `getCodeByHash`, 1-account/depth-1 `GetStorageRanges`, per-contract `fsyncSync`, and progress unit mismatch. Workstreams: (1) refresh cursors on `done` buckets + `syncBucketCursorFields` / `schedule` guards, (2) `noteAccounts` dedupe + spine totals + `contract-scan.json`, (3) batch-16 / depth-4 / bounded retry / multi-account verify, (4) async sharded code+storage append logs, (5) 75/25 progress + Node Pulse denominators/ETA/tip clamp, (6) tests + `tsc` + spellcheck in `@ethereumjs/ethy` only.

---

## 6. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **No `@ethereumjs/mpt` changes** — root cause was stale `storageRoot` on `done` buckets (refresh cursor dropped) plus scheduler/UI issues, not trie `useKeyHashing` defaults.
- **`verifyStorageRangeJob`** returns flight-level `ok: true` with per-account `perAccount[].ok` so one stale root in a batch does not discard sibling accounts; callers must consult `perAccount`.
- **`ensureBucketSubRanges`** on `bucket.status === 'done'` keeps an empty `subRanges` array instead of re-opening a prefix sweep cursor.
- **Async persistence:** append-only `code/shard-XX.bin` and `storage/shard-XX.bin`; `contract-scan.json` restores spine code/storage totals on resume.
- **Gates (2026-11-09):** `packages/ethy` `npm run tsc`, `npm test` (212), root `npm run spellcheck` green.
