# WP-06f: Storage & Code Sync Engine — Pre-hashed Storage Trie Fix, Multi-Account Storage Batching (`16` Accounts/Req), Parallel Pipelining, Total Contract Accounting & Honest TUI Progress

- **Status:** `READY_FOR_PLANNING`
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

#### Root Cause 1 (CRITICAL BUG): Double-Keccak on Complete Storage Proofs + Infinite Retry Loop (`snapVerifyJob.ts` & `codeAndStorageSync.ts`)
At `09:18:23.736Z` (the exact second `codeQueue` emptied and `SnapCodeAndStorageSynchronizer` began dispatching `GetStorageRanges`), the log erupted with **16,700+ consecutive warnings** across every single peer (`Nethermind` and `Geth` alike):
```text
[WARN] [snap] invalid all elements proof: root mismatch (peer=02b9e31f8f41)
[WARN] [snap] invalid all elements proof: root mismatch (peer=34da37590bf0)
[WARN] [snap] invalid all elements proof: root mismatch (peer=2671639e2c4b)
[WARN] [snap] invalid all elements proof: root mismatch (peer=88e881f9a31c)
```
**Why did every complete storage range proof fail with `invalid all elements proof: root mismatch`?**
1. Look at `verifyStorageRangeJob` (`packages/ethy/src/sync/snapVerifyJob.ts:256–265`):
   ```ts
   if (proof !== null && proof.length === 0 && keys.length > 0) {
     hasRight = await verifyMerkleRangeProof(
       opts.storageRoot,
       null,
       null,
       keys,
       values,
       null,
       useKeyHashingFunction,
     )
   }
   ```
2. And look at `verifyMerkleRangeProof` (`packages/mpt/src/proof/range.ts:452–458`):
   ```ts
   if (proof === null && firstKey === null && lastKey === null) {
     const trie = new MerklePatriciaTrie({ useKeyHashingFunction })
     await trie.putSortedLeaves(keysRaw, values, keys)
     if (!equalsBytes(rootHash, trie.root())) {
       throw EthereumJSErrorWithoutCode('invalid all elements proof: root mismatch')
     }
     return false
   }
   ```
   Wait: `new MerklePatriciaTrie({ useKeyHashingFunction })` defaults to **`useKeyHashing: true`**!
   And inside `putSortedLeaves` (`packages/mpt/src/mpt.ts:346`):
   - When `keysRaw.length === 1` (`1` storage slot in the contract — the most common storage contract on Ethereum!), `putSortedLeaves` has a fast path:
   ```ts
   if (keysRaw.length === 1) {
     await this.put(keysRaw[0]!, values[0]!)
     return
   }
   ```
   - And `this.put(keysRaw[0], values[0])` **hashes `keysRaw[0]` a SECOND time with `keccak256` because `useKeyHashing` is `true` by default on `new MerklePatriciaTrie({ useKeyHashingFunction })`**, whereas `snap/1` `StorageRanges` keys (`slotHashRaw`) are **already 32-byte `keccak256(slot)` hashes**!
   - Even for `keysRaw.length > 1` or two-edge proofs (`createMPTFromProof`), any `trie.put(key, val)` or `verifyMPTWithMerkleProof` in `range.ts` that doesn't disable key hashing (or where `putSortedLeaves` falls back to `this.put`) hashes the 32-byte `slotHash` again!
3. **And why did it loop forever?**
   Look at `handleStorageRanges` (`packages/ethy/src/sync/codeAndStorageSync.ts:444–452`):
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
   When `!result.ok`, `handleStorageRanges` **never increments `task.missRetries` and never deletes `task` from `this.pendingStorage`**! So the exact same 1-slot storage contract stays at the head of `this.pendingStorage` and is re-requested **10 times per second forever**!
   And if a contract's `storageRoot` changed during the 35-minute account sync (because its account was ingested in Bucket `0x0` at `08:38`, and a later BAL modified its storage at `09:00` — remember `consumeBAL` updates slot values in `FlatStateManager` without recomputing the MPT `storageRoot`!), a peer serving at the newer `pivotStateRoot` (#12,096,717) has the **new** storage trie while `task.storageRoot` still holds the **old** root from `08:38`! When the peer returns the new slots with `proof = []`, `trie.root()` equals the **new** `storageRoot`, which mismatches `task.storageRoot`!

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

#### Root Cause 4: Unknown Total Contract / Storage Counts Due to `16,384` Cap & Lazy Disk Scan (`accountSync.ts`, `codeAndStorageSync.ts`, `snapStore.ts`)
Why did the progress bar jump from `85%` to `98%` and then sit at `98%–99%` forever while the user had no idea how many contracts/storage accounts remained?
1. Look at `codeAndStorageSync.ts:150` & `172`:
   - During account sync, `codeQueue` and `pendingStorage` are capped at `MAX_IN_MEMORY_CONTRACT_TASKS = 16,384`.
   - Once `16,384` contracts are queued (which happens in the first 2% of Sepolia account sync!), `noteAccounts` calls `this.snapStore.enableContractScan()` and **stops counting or queueing any further contracts**!
   - Then, during `Snap Sync · Storage`, `refillContractTasksFromDisk()` (`codeAndStorageSync.ts:554`) lazily scans `512` rows at a time from the 16 `.bin` account journals whenever `codeQueue.size + pendingStorage.size < 16,384`.
2. Look at `computeSnapProgressPct(spine)` (`buckets.ts:326–331`):
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

### 3.1 Exact Total Contract & Storage-Account Counting During Account Ingest (`spine/types.ts`, `accountSync.ts`, `codeAndStorageSync.ts`, `snapStore.ts`)
We already inspect every single `BinaryAccount` in `ingestedMetaFromBinarySlab(slab)` (`syntheticPeer.ts:400`) when accounts are ingested!
1. Add monotonic total counters to `EthySpine`:
   - `codesTotal: number` — total contract accounts with non-empty `codeHash` discovered across synced buckets (or unique `codeHash` tasks queued + completed).
   - `storageAccountsTotal: number` — total accounts with non-empty `storageRoot` discovered across synced buckets.
   - `storageAccountsSynced: number` — number of storage-bearing accounts whose storage trie has been completed.
   - `contractsPerSec: number` — combined rate of `(codesSynced + storageAccountsSynced) / s` during `Snap Sync · Storage`, plus `storageEtaMinutes?: number`.
2. In `SnapCodeAndStorageSynchronizer`:
   - Distinguish **initial account-ingest discovery** (`noteAccounts(entries, { fromDiskRefill?: boolean })`) from **disk-scan refill** (`refillContractTasksFromDisk`):
     - On initial account ingest (or on disk resume in `SnapPivotStore`), count every contract (`!equalsBytes(codeHash, KECCAK256_NULL)`) toward `spine.codesTotal` and every storage-bearing account (`!equalsBytes(storageRoot, KECCAK256_RLP)`) toward `spine.storageAccountsTotal` **before** checking the `16,384` in-memory spill cap!
     - Persist `codesTotal`, `codesSynced`, `storageAccountsTotal`, `storageAccountsSynced`, and `storageSlotsSynced` in `contract-scan.json` / `buckets.json` so session resume (`WP-06d`) restores exact totals immediately.

### 3.2 Fix Storage Range Verification (`@ethereumjs/mpt` & `snapVerifyJob.ts`) + Bounded Retry / BAL Root Reconciliation
1. **Fix `verifyMerkleRangeProof` All-Elements & Single-Element Pre-Hashed Keys (`packages/mpt/src/proof/range.ts` & `packages/ethy/src/sync/snapVerifyJob.ts`):**
   - In `verifyMerkleRangeProof` (`packages/mpt/src/proof/range.ts:453`):
     - The keys passed into `verifyMerkleRangeProof` (`keysRaw`) are **already trie-path keys** (32-byte `accountHash` or 32-byte `slotHash`, converted to 64 nibbles in `keys = keysRaw.map(bytesToNibbles)`).
     - `useKeyHashingFunction` is needed solely for **hashing RLP-encoded trie nodes (`keccak256(rlpNode)`)**, **NOT** for hashing leaf keys a second time (`useKeyHashing: false`)!
     - In `range.ts:453`, `new MerklePatriciaTrie({ useKeyHashingFunction })` omitted `useKeyHashing: false`, which defaulted `useKeyHashing` to `true`! Whenever `putSortedLeaves` took its `keysRaw.length === 1` fast path (`await this.put(keysRaw[0]!, values[0]!)`), `trie.put` hashed the 32-byte `slotHash` a **second time**, producing a completely wrong root and throwing `invalid all elements proof: root mismatch` on **every single 1-slot contract on Ethereum**!
     - Fix `range.ts` so `new MerklePatriciaTrie({ useKeyHashing: false, useKeyHashingFunction })` (and `createMPTFromProof` in `range.ts`) uses `useKeyHashing: false` for leaf keys while keeping `useKeyHashingFunction` for node hashing!
2. **Multi-Account `STORAGE_RANGES` Verification (`snapVerifyJob.ts`):**
   - Under `snap/1`, `StorageRanges` (`[reqId, slots[][], proof[]]`) returns `slots` as a list of slot-lists — **one slot-list per completed/last account** in `accountHashes[]`:
     - For indices `0 .. ranges.length - 2` (and index `ranges.length - 1` when `proof.length === 0`), each `ranges[i]` is a **complete storage trie** for `accountHashes[i]` (`proof = null`, verified against `storageRoots[i]`).
     - Only when `proof.length > 0` is the **last** entry `ranges[ranges.length - 1]` (or empty range when `ranges.length === 0`) a partial/split storage trie for `accountHashes[ranges.length - 1]` verified with two-edge `proof` against `storageRoots[ranges.length - 1]` from `origin`!
   - Extend `verifyStorageRangeJob` to accept `accounts: Array<{ accountHash: Uint8Array; storageRoot: Uint8Array }>` + `origin: Uint8Array` and verify all returned accounts in one worker job!
3. **Bounded Retry & Stale-Root Recovery in `SnapCodeAndStorageSynchronizer` (`codeAndStorageSync.ts`):**
   - If a storage account fails proof verification (e.g. because its `storageRoot` changed during rolling-pivot BAL steps while `SNAP_SYNCING` was in progress, or a peer returned a bad proof):
     - Increment `task.missRetries++`.
     - On first failure (`missRetries === 1`), enqueue a 1-account refresh cursor (`this.onBalRefreshAccount?.(task.accountHash)`) so we fetch the account's current `storageRoot` at the latest `pivotStateRoot`!
     - If `task.missRetries > 2`, drop the task from `pendingStorage` (and increment `storageAccountsSynced`) with a rate-limited diagnostic so a single missing or stale contract can **never** spin in an infinite loop!

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

- [ ] `@ethereumjs/mpt` `verifyMerkleRangeProof` sets `useKeyHashing: false` on the internal proof tries so 1-element and all-elements proofs over pre-hashed 32-byte keys (`slotHash` / `accountHash`) never double-hash the key (`invalid all elements proof: root mismatch` regression test for 1-slot and multi-slot storage tries!).
- [ ] `SnapCodeAndStorageSynchronizer` batches up to `16` fresh storage accounts per `GetStorageRanges` request (`256 KiB`), pipelines up to `4` requests per peer (`inFlightKey(peerId, reqId)`), and bounds per-task retries (`missRetries <= 2` + `onBalRefreshAccount` on first mismatch) so no storage task can loop infinitely.
- [ ] `SnapPivotStore.appendCode` and `appendStorageSlots` remove synchronous per-contract `fs.fsyncSync` from the main thread.
- [ ] `EthySpine` tracks `codesTotal`, `storageAccountsTotal`, `storageAccountsSynced`, `contractsPerSec`, and `storageEtaMinutes` across live ingest, disk contract scan, and session resume.
- [ ] `computeSnapProgressPct` uses `codesSynced / codesTotal` and `storageAccountsSynced / storageAccountsTotal` (never mixing slots with accounts), and `Node Pulse` displays `synced/total` for code and storage accounts, live ETA, and clamped `pivot → tip`.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/mpt` and `@ethereumjs/ethy`.

---

## 5. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7 during planning)*

---

## 6. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5 during implementation)*
