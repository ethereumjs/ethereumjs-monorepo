# WP-14: 5×–10× High-Throughput BAL Catch-Up Engine — Binary `consumeBALRlpBatch`, Async Keccak Interpolation Cold Lookups, Batched `bal-tail` Disk I/O & Multi-Peer Pipelined BAL Scheduling

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-07e` (`DONE`), `WP-11b` (`DONE`), `WP-13` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Lift `BAL_CATCHUP` (and `bridge-pivot`) throughput from **`20–40 BALs/sec`** (`~3 min` for 5,700 blocks / `~11 min` for a 3-day 21,600-block laptop resume) to **`150–350+ BALs/sec` (5×–10× end-to-end speedup)** — turning a 1-day resume into **~20–30 seconds** and a 3-day laptop resume into **~1–2 minutes**, with zero event-loop stalls and zero duplicate per-block `heal/` file growth.

---

### 1.1 Empirical Forensic Baseline (Live Sepolia Data + Reproducible Vitest Harness)

Measured directly on **160 real consecutive Sepolia Amsterdam blocks (`#12190208..#12190367`)** from a live `BAL_CATCHUP` session (`3 conn · 63ms`, `2 Nethermind · 1 Geth`, observed live speed **`33 BALs/s` = `~970 ms` per 32-block batch**) against a real `22 GB` on-disk Sepolia flat state (`16 × 1.37 GB` sorted binary account journals, ~160M accounts):

- **Real Sepolia Block Profile (`160`-block average):**
  - Header RLP: **`678 B`** | BAL RLP: **`54.3 KB`** (`32`-block batch = **`1.70 MB`** — already close to standard DevP2P `~2 MiB` soft reply cap).
  - Accounts per block: **`359.2`** (**`223.4` mutated**, **`135.8` read-only**).
  - Storage writes/block: **`503.4`** | Storage reads/block: **`759.5`** | Code changes/block: **`2.16`**.
  - Intra-batch deduplication across 32 blocks: `7,149` mutated touches collapse to **`1,820–2,322` unique mutated accounts** (`~3.1×–3.9×` dedupe).

#### Measured Per-32-Block Batch Stage Breakdown

| Stage | Current (`ms / 32 blk`) | Optimized Prototype (`ms / 32 blk`) | Speedup | Root Cause |
| --- | ---: | ---: | ---: | --- |
| **1. `materializeBalBatch` (`balBatch.ts:340`)** | **`163.1 ms`** (`44.2` decode + **`91.0` `bal.hash()`** + `27.9` `toJSON`) | **`~2.0 ms`** wire WASM hash + **`~33.1 ms`** raw RLP decode/merge | **~4.6×** | `bal.hash()` re-sorts (`localeCompare`), re-RLP-encodes the entire BAL, and hashes with pure-JS `@noble/hashes` (`91 ms`) instead of hashing `balRlp` directly with Ethy's WASM `ethyKeccak256` (`2.0 ms` — **45× faster**). `bal.toJSON()` re-sorts a second time and hex-stringifies every value. |
| **2. `consumeBALBatch` RAM apply (`flatStateManager.ts:636`)** | **`56.5 ms`** | **`~9.4 ms`** (combined direct binary decode+merge+apply = **`44.5 ms`** vs **`219.6 ms`**) | **~5×** (combined CPU) | `mergeBALs` lowercases hex strings across 32 JSON arrays, then `consumeBAL` re-parses every address, balance, nonce, code, and storage slot back into `Address`/`Uint8Array`/`BigInt`. |
| **3. Cold Account Lookups (`snapStore.ts:1318`)** | **`295 ms`** (warm page cache) to **`759–1,339 ms`** (cold NVMe, `1,820–2,322` lookups) | **`37.6 ms`** (cold NVMe, async parallel) / **`<15 ms`** (warm) | **20×–35×** (cold) | `lookupBinaryAccountByHash` calls `fs.readdirSync(accounts/)` + file-size stat + `~22.6` synchronous `fs.readSync` binary-search probes per lookup across `1.37 GB` journals, blocking the event loop on single-threaded NVMe reads. |
| **4. `codeSync.noteBalApplied` × 32 (`codeAndStorageSync.ts:295`)** | **`116–700+ ms`** (when `codeSync` active in session) | **`0 ms`** in `BAL_CATCHUP` / `HEAD_FOLLOWING` | **∞** | Runs on every single block and **every** account (including read-only accounts), firing `11,493` calls/batch and `1,876+` extra cold disk lookups/batch, plus leaking entries into `pendingStorage` after snap sync has finished. |
| **5. Per-Block Disk Persistence (`snapStore.ts:1882`, `balTailArchive.ts:91`)** | **`10.5 ms`** (empty `heal/`) to **`30–60+ ms`** (in `68,763`-file `heal/` dir!) | **`0.49 ms`** | **21×–100×** | Writes every block **twice** (`heal/<n>.bundle.rlp` + `bal-tail/seg-*.bin`), running `64` file creates, `32` atomic `manifest.bin` renames, `32` `pivot.json` JSON parses, and `32` retention scans per batch (~350–450 sync OS calls). Live node accumulated `68,763` duplicate `.bundle.rlp` files. |
| **6. Network (Single-Peer Stop-and-Wait, `balSync.ts:363`)** | **`~400–600 ms`** (serialized, idle during all local work) | **Overlapped** across `K` concurrent batches (`3` peers → `~100–150 ms` amortized/batch) | **3×–5×** | Only `1` `batchInFlight` across the whole node with hardcoded `requestId = 1..4`: `GET_BLOCK_HEADERS(32)` → RTT → `GET_BLOCK_ACCESS_LISTS(32)` → RTT + transfer → network completely idle during local CPU/disk. |
| **END-TO-END (3 peers, `63 ms` RTT)** | **`~970 ms / 32 blk` (`33 BALs/s`)** | **`~100–160 ms / 32 blk` (`200–320 BALs/s`)** | **6×–10×** | Local ceiling jumps from **`19–79 BALs/s`** → **`385–700+ BALs/s`**, allowing 3–6 peers to saturate bandwidth cleanly. |

> **Reproducible Vitest Benchmark Harness:** Already committed alongside this spec at [`packages/ethy/test/balCatchUpBench.spec.ts`](../test/balCatchUpBench.spec.ts) (`ETHY_BENCH=1 npx vitest run --disable-console-intercept test/balCatchUpBench.spec.ts`).

---

### 1.2 Architectural Pillars (5 Coordinated Changes)

#### Pillar 1: Direct Binary BAL Verification & Apply (`@ethereumjs/statemanager` + `packages/ethy`)
1. **Direct Wire-Byte BAL Hash (`packages/ethy/src/sync/balBatch.ts`):**
   - Replace `createBlockLevelAccessListFromRLP(balRlp).hash()` with `ethyKeccak256(balRlp)` compared directly against `header.blockAccessListHash` (`91 ms → 2.0 ms`, **45× faster**).
   - This is strictly more faithful to EIP-7928 (`blockAccessListHash = keccak256(rlp(block_access_list))`) because non-canonical wire encodings fail immediately instead of being silently re-sorted by `bal.serialize()`.
2. **Upstream `@ethereumjs/statemanager` Binary Batch Fast Path (`consumeBALRlpBatch`):**
   - Add a backwards-compatible upstream API (separate commit per **D-008**) in `packages/statemanager`:
     - Pure helper **`mergeBALRlpList(balRlpList: Uint8Array[])`** (or `MergedBinaryBAL` internal struct) that decodes each raw EIP-7928 BAL RLP list once (`RLP.decode`), skips read-only accounts (`storageChanges`, `balanceChanges`, `nonceChanges`, `codeChanges` all empty), and compacts mutations directly in binary `Uint8Array` form across the entire batch.
     - Preserves exact **EIP-161 intermediate-deletion semantics** identically to `mergeBALs`: if an intermediate block empties an account (`postBalance === 0 && postNonce === 0 && no code && no storage writes`), previously accumulated storage writes for that address in earlier blocks of the batch are cleared before applying later blocks.
     - **`FlatStateManager.consumeBALRlpBatch(balRlpList: Uint8Array[], opts?: ConsumeBALOptions): Promise<void>`** applies the merged binary diff directly using raw `Uint8Array` address/slot/value buffers without `BlockLevelAccessList` instantiation, `toJSON()`, hex string lowercasing, or `createAddressFromString`/`hexToBytes` round-trips (**`219.6 ms → ~44.5 ms`**, **~5× faster**).
     - Expose a pure **`extractMutatedAccountHashesFromBalRlpList(balRlpList, keccak256)`** (or return unique mutated account hashes from `mergeBALRlpList`) so Pillar 2 can pre-hydrate cold accounts asynchronously in one pass before state mutation!
3. **Skip `balJson` Construction Outside the 64-Block Near-Head Tail (`packages/ethy/src/sync/balSync.ts`):**
   - During historical `BAL_CATCHUP` (`blockNumber <= targetHead - 64n`), do **not** construct a JSON block access list or push historical entries into `balWindow` (`pushBalWindow` only keeps the latest `64` blocks anyway!).
   - Materialize `balJson` only when `nearHead` (`targetHead <= blockNumber + 64n`) or when `batch.mode === 'full'` / `HEAD_FOLLOWING` needs economy/Plaza inspection.

#### Pillar 2: Cached Journal Metadata, Keccak-256 Interpolation Search & Async Parallel Cold Pre-Hydration (`snapStore.ts` + `FlatStateManager`)
1. **Cache Bucket Journal Metadata (`packages/ethy/src/persist/snapStore.ts`):**
   - Replace per-lookup `fs.readdirSync(accounts/)` + file-size stat calls in `lookupBinaryAccountByHash()` with an in-memory per-nibble cache:
     `Array<{ path, fd, fileHandle?, count, minKey, maxKey, min48, max48 }>`.
   - Invalidate only a single nibble's cache entry when `appendAccountJournalSlab`, segment creation, or pivot switch mutates that nibble.
   - Skip any file where `compareBytes32(accountHash, minKey) < 0 || compareBytes32(accountHash, maxKey) > 0` before touching disk.
2. **Keccak-256 Interpolation Search + 64-Row (`8.7 KB`) Tail Window Read:**
   - Because account journal keys are sorted 256-bit Keccak-256 hashes (cryptographically uniform), replace `~23`-probe binary search with **top-48-bit interpolation search** (capped at `6` interpolation steps, falling back to binary midpoint on any skewed synthetic distribution so worst-case remains strictly `O(log N)`!).
   - Once `hi - lo < 64`, perform a single contiguous `<= 8.7 KB` read and binary-search in RAM.
   - Measured on live 22 GB Sepolia journals: **`22.6 reads/lookup → 4.4 reads/lookup`** (**5.1× fewer NVMe reads**, **0 bytes index RAM**, **0 ms startup build**).
3. **Async Parallel Batch Pre-Hydration (`lookupBinaryAccountsBatchAsync` + `FlatStateManager.hydrateColdAccountsBatch`):**
   - Add `SnapPivotStore.lookupBinaryAccountsBatchAsync(accountHashes: Uint8Array[], concurrency = 32): Promise<Map<string, Uint8Array | undefined>>` using cached `fs.promises.FileHandle` reads across the Node I/O thread pool (exploiting NVMe queue depth without blocking the Node.js event loop!).
   - Add `FlatStateManager.hydrateColdAccountsBatch(entries: Iterable<{ hashHex: string; binary: Uint8Array | undefined }>)` (or `coldAccountBatchLookup` hook called before applying a binary batch, caching negative misses for the duration of the batch so absent/new accounts never re-trigger synchronous cold disk lookups during `consumeBALRlpBatch`!).
   - Measured on a completely cold fresh 32-block Sepolia batch (`1,950` unique mutated accounts): **`759–1,339 ms` sync → `37.6 ms` async** (**20×–35× faster**, **0 ms event-loop block**!).

#### Pillar 3: Gate `codeSync.noteBalApplied` Strictly to Active `SNAP_SYNCING` (`peerCoordinator.ts` + `codeAndStorageSync.ts`)
1. In `peerCoordinator.ts` (`bundleBalHooks.onBalApplied`) and `balSync.ts`:
   - Only invoke `codeSync?.noteBalApplied(...)` while `spine.phase === 'SNAP_SYNCING'` (when in-flight snap storage/code queues actually exist). During `BAL_CATCHUP` and `HEAD_FOLLOWING`, `codeSync` is finished and calling `noteBalApplied` is pure waste + memory leak.
2. Inside `SnapCodeAndStorageSynchronizer.noteBalApplied(bal)`:
   - Skip read-only BAL rows (`row.storageChanges.length === 0 && row.codeChanges.length === 0`) — read-only accounts never mutate `storageRoot` or `codeHash` and should never trigger `getBinaryAccountByHash()` / `invalidateAccount()`.

#### Pillar 4: Batched Segmented `bal-tail` Writes & Retire Duplicate `heal/*.bundle.rlp` Files (`balTailArchive.ts` + `snapStore.ts`)
1. **Batched Segment Append (`packages/ethy/src/persist/balTailArchive.ts`):**
   - Add **`appendBalTailBatch(pivotRootDir: string, entries: Array<{ blockNumber: bigint; headerRlp: Uint8Array; balRlp: Uint8Array }>): void`**:
     - Groups contiguous entries by `256`-block segment (`seg-<start>.bin`).
     - Opens each touched segment **once**, writes all payloads in a single `Buffer.concat` write + single header-table update, and closes it.
     - Updates `manifest.bin` via **one** atomic `.tmp` rename per batch (not `32`!).
2. **Cache `pivotBlockNumber` & Run Retention Once Per Batch (`packages/ethy/src/persist/snapStore.ts`):**
   - Add `appendBalTailBatch(entries: VerifiedBalBlock[])` on `SnapPivotStore` (handling dual-write to active shadow pivot if active).
   - Cache `pivotBlockNumber` per `stateRoot` instead of reading and `JSON.parse()`-ing `pivot.json` `32` times per batch.
   - Call `enforceBalTailRetention()` **once per batch** instead of `32` times.
3. **Stop Writing Duplicate `heal/<n>.bundle.rlp` Files:**
   - `bal-tail/seg-*.bin` already persists every `{ headerRlp, balRlp }` contiguously (and `headerRlp` contains `number`, `stateRoot`, and `blockHash = ethyKeccak256(headerRlp)`).
   - Retire per-block `heal/<n>.bundle.rlp` writes in `appendHealBundle` / `appendBalTailBatch` (eliminating `68,763+` duplicate files and **21×–100×** faster disk writes: `10.5–60+ ms → 0.49 ms`).
   - Preserve full backwards compatibility on resume: `readUnappliedHealBundles` / `readUnappliedHealBundlesAsync` reads from `bal-tail/` first (`pivotBlock + 1 .. manifest.latest`) and falls back to legacy `heal/*.bundle.rlp` only for blocks not present in `bal-tail/`. Add bounded background cleanup for legacy `heal/*.bundle.rlp` files already safely stored in `bal-tail/`.

#### Pillar 5: Multi-Peer Pipelined BAL Scheduler + Decoupled Header Prefetch (`balBatch.ts` + `balSync.ts`)
1. **Monotonic Request IDs (`packages/ethy/src/sync/balBatch.ts`):**
   - Replace hardcoded `requestId = 1..4` with a monotonic counter (`nextRequestId++`) so multiple concurrent `GET_BLOCK_HEADERS` and `GET_BLOCK_ACCESS_LISTS` flights multiplex cleanly over the same peer and across multiple peers.
2. **Decoupled Header Prefetch (`BAL_HEADER_PREFETCH_COUNT = 192`, `BAL_HEADER_QUEUE_TARGET = 256`):**
   - During historical `BAL_CATCHUP` (`gap >= 32n`), fetch up to `192` contiguous headers in a single `GET_BLOCK_HEADERS` RTT (feeding **6× 32-block BAL batches** per header RTT — cutting header RTT overhead by `6×`).
   - Validate strict `number === prev + 1n` and `parentHash === prev.hash` continuity (re-syncing cleanly against `verifiedTipHash` on any reorg/mismatch), appending verified headers into a bounded `headerQueue`.
   - When approaching the final 64-block tail (`nearHead`) or small gap (`< 32n`), gracefully drain the pipeline and switch cleanly to the existing `'full'` mode (`Headers + Bodies + Receipts + BALs`) so `RollingBlockStore`, `ETHEconomyDataManager`, and the Plaza stay 100% populated.
3. **Concurrent Multi-Peer BAL Dispatcher + Ordered Commit Queue (`packages/ethy/src/sync/balSync.ts`):**
   - Keep `BAL_BATCH_SIZE = 32` blocks per `GET_BLOCK_ACCESS_LISTS` request (`~1.7 MB` on Sepolia, safely below Geth/Nethermind's `~2 MiB` soft reply cap — never blindly raise to 64/128 in one wire message!).
   - Dispatch up to **`K = Math.min(Math.max(1, healthyPeers.length) * 2, 6)`** concurrent 32-block BAL flights across all healthy `eth/71–72` peers (at most `2` concurrent BAL flights per peer, weighted by lowest latency / peer health, skipping rested peers).
   - **Partial-Reply & Timeout Resilience:** if a peer returns `m < count` BALs (e.g. heavy blocks hit the 2 MiB cap), accept the verified prefix `[start .. start + m - 1]` and immediately re-queue `[start + m .. start + count - 1]` to the next available peer. If a single flight stalls (`10s` timeout) or its peer disconnects, rest that peer and re-queue only that range without dropping other in-flight or buffered batches!
   - **Out-of-Order Verify & Async Pre-Hydrate, In-Order Commit:**
     - As each BAL flight completes, immediately verify all wire BAL hashes (`ethyKeccak256`), decode/merge binary diff (`mergeBALRlpList`), and launch `lookupBinaryAccountsBatchAsync` for its unique mutated accounts — **overlapped with other in-flight peer downloads!**
     - Store ready batches in `readyBatches: Map<bigint, ReadyBalBatch>` (bounded by `MAX_READY_BATCHES = 8` backpressure so RAM stays bounded even if block `N` stalls on one slow peer).
     - Drain `readyBatches` strictly in ascending `nextCommitBlock` order: apply `consumeBALRlpBatch` → `appendBalTailBatch` → `noteVerifiedBlock` → update `spine.balCatchUp` / `recordBatchRate`.
4. **Cockpit / Telemetry Polish (Minimal, Honest):**
   - `BalChainStreamer.recordBatchRate()` continues driving `State` box `applied / total BALs applied · X/s` and ETA — no TUI layout churn needed; optionally surface active parallel BAL flights (`balInFlight`) in `/machine` or `Ctrl+D` debug view for live observability.

---

### 1.3 Upstream Library Touch Discipline (**D-008**)
- **`@ethereumjs/statemanager`** (`packages/statemanager`): backwards-compatible `mergeBALRlpList` + `FlatStateManager.consumeBALRlpBatch` + `hydrateColdAccountsBatch` (with unit tests in `packages/statemanager/test/consumeBAL.spec.ts` proving byte-for-byte state equivalence with `consumeBALBatch` including EIP-161 intermediate account deletion and cold-account preservation). **Committed separately from `packages/ethy`.**
- **`@ethereumjs/devp2p`**: **zero changes required** (`eth/71–72` already supports `requestId`-multiplexed concurrent `GET_BLOCK_HEADERS` / `GET_BLOCK_ACCESS_LISTS` natively).
- **Zero new runtime dependencies** (`dependencies.mdc`).

---

### 1.4 Acceptance Criteria & Verification Gates
1. **State Equivalence (`@ethereumjs/statemanager`):** `consumeBALRlpBatch` produces 100% identical account fields, code, storage, and tombstones as `consumeBALBatch` across random multi-block sequences including EIP-161 delete-and-recreate, storage zeroing, code deployments, and cold-account preservation.
2. **Cold Lookup Correctness & Efficiency (`packages/ethy`):**
   - `SnapPivotStore.lookupBinaryAccountByHash` and `lookupBinaryAccountsBatchAsync` return identical results for present, absent, boundary (`minKey`/`maxKey`), multi-segment (`.bin` + `.seg`), and newly appended accounts.
   - Interpolation search averages `< 5` disk reads per lookup on `>= 8,192` uniform hashes (and degrades gracefully to `O(log N)` on adversarial non-uniform keys).
3. **Persistence Compatibility (`packages/ethy`):**
   - `appendBalTailBatch` writes contiguous readable segments matching `readBalTailBundle` and `devp2p` `EthyChunkStore`.
   - Zero new `heal/*.bundle.rlp` files are written during `BAL_CATCHUP`; legacy `heal/*.bundle.rlp` directories still resume cleanly.
4. **Multi-Peer Pipelined Scheduler (`packages/ethy`):**
   - Deterministic Vitest harness with `3` synthetic peers proves: concurrent out-of-order BAL delivery commits strictly in ascending block order; partial reply (`m < 32`) re-queues the exact suffix; stalled/disconnected peer re-queues without stalling healthy peers; smooth transition to `'full'` mode for the final 64-block tail.
5. **Performance Regression Gate (`packages/ethy/test/balCatchUpBench.spec.ts`):**
   - Direct binary pipeline (`ethyKeccak256` + `consumeBALRlpBatch`) beats legacy `createBlockLevelAccessListFromRLP` + `bal.hash()` + `toJSON()` + `consumeBALBatch` by **>= 3×**.
   - Batched `appendBalTailBatch` beats per-block persistence by **>= 5×**.
   - `noteBalApplied` triggers **0** cold lookups during `BAL_CATCHUP`.
6. **Live Verification Target (Manual Post-Implementation Check on Sepolia):**
   - With `3+` healthy `eth/71–72` peers (`~60–100 ms` RTT), sustained `BAL_CATCHUP` speed reaches **`150–300+ BALs/s`** (up from `20–40 BALs/s`) with smooth TUI responsiveness and zero `heal/` file growth.
7. **Standard Monorepo Gates:** `npm run tsc` in `packages/statemanager` and `packages/ethy`, full Vitest suites green, and `npm run spellcheck` green.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*To be filled by Grok 4.7 when assigned for planning.*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*To be filled by Composer 2.5 upon implementation.*
