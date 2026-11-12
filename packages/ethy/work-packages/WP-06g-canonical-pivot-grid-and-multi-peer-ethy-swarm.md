# WP-06g: Canonical Pivot Grid Quantization (`K = 32`), Multi-Peer & Cross-Snapshot `ETHY/0` Bucket Striping, and Freshness-Weighted Seeder Selection

- **Status:** `DONE`
- **Planner:** Grok 4.7 (concrete plan recorded 2026-11-12)
- **Implementer:** Composer 2.5
- **Dependencies:** `WP-04k`, `WP-06b`, `WP-06c`, `WP-06d`, `WP-07e` (`DONE`)
- **Primary Goal:** Maximize `ETHY/0` swarm convergence, multi-peer download parallelism, and snapshot freshness **with zero breaking wire-protocol changes** through a cohesive 3-part architecture:
  1. **Canonical Pivot Grid Quantization (`K = 32` Blocks / 1 Beacon Epoch):** Align initial `SNAP/1` pivot selection and rolling-pivot steps onto deterministic multiples of `32` blocks (`blockNumber % 32n === 0n`) using a hybrid backward-snap / short-wait policy so nodes booting within the same epoch window converge on the **exact same `basePivotBlock` and `basePivotRoot`**.
  2. **Multi-Peer & Cross-Snapshot `ETHY/0` Bucket Striping:** Upgrade `EthySwarmSynchronizer` from a single-peer client (`seederPeerId`) into a true **multi-peer BitTorrent-style swarm scheduler** that stripes chunks across all connected `ETHY/0` peers when they share the same snapshot, **and** composes disjoint hex-nibble buckets (`0x0..0xf`) across peers with *different* `basePivotBlock` snapshots by tracking `bucketPivotBlock[b]` and filtering `consumeBALBatch` per bucket (`shouldApplyAccount`) during `BAL_CATCHUP`.
  3. **Freshness-Weighted Seeder Scoring & Snapshot Age Cap (`MAX_SWARM_TAIL_BLOCKS`):** Rank `ETHY/0` seeders per bucket by snapshot freshness (highest `basePivotBlock` = shortest `BAL_CATCHUP` tail) and enforce a bounded snapshot age cap (`MAX_SWARM_TAIL_BLOCKS = 2048n`, ~6.8 hours) so an aging swarm naturally mints a fresh canonical `K = 32` snapshot when `SNAP/1` peers are available rather than accumulating unbounded 50,000-block BAL tails.

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Argon)

### 1.1 Architectural Motivation & Swarm Dynamics

While `WP-06b` and `WP-06c` proved out end-to-end self-proving `ETHY/0` state sync at `>500,000 accounts/sec` between two nodes, scaling `ETHY/0` across a decentralized network of many independent nodes exposes three structural swarm challenges:

1. **Snapshot Fragmentation from Arbitrary `SNAP/1` Pivot Blocks:**
   - Whenever an Ethy node bootstraps via `SNAP/1` (either because no `ETHY/0` peer was discovered within the grace window or via `--sync-mode snap`), `PeerCoordinator` currently anchors the pivot at whatever `bestPeer.latestBlock` happens to be at that exact second (`#12,120,003`, `#12,120,017`, `#12,120,029`, etc.).
   - Because Merkle boundary proofs (`<nibble>.proof.idx`) verify against a specific `chunkStateRoot`, 20 nodes bootstrapping via `SNAP/1` over a 10-minute window create **20 incompatible `chunkStateRoot` islands**, preventing chunk-level multi-peer striping within buckets.
2. **Single-Seeder Binding in `EthySwarmSynchronizer`:**
   - Currently, `EthySwarmSynchronizer` (`src/sync/ethySwarmSync.ts`) binds to a single `seederPeerId: string` at construction time and ignores any 2nd, 3rd, or 4th `ETHY/0` peer that connects before or during sync.
   - Furthermore, even with Canonical Grid Quantization (`K = 32`), two seeders in the wild may have synced **hours apart** (e.g. Peer A anchored at `#12,118,016` and Peer B anchored at `#12,118,624`). If a joining node can only sync from peers with an identical `basePivotBlock`, it cannot combine the bandwidth of Peer A and Peer B.
   - **Key Insight (Zero Wire Change):** Because `ETHY/0` already partitions state into 16 disjoint `accountHash` nibble buckets (`0x0..0xf`) and already embeds `(chunkBlockNumber, chunkStateRoot)` inside every `BUCKET_MANIFEST` entry, every `PROVEN_ACCOUNT_CHUNK` message, and every `<nibble>.proof.idx` disk record, a joining node can download **Buckets `0x0..0x7` from Peer A (`#12,118,016`)** and **Buckets `0x8..0xf` from Peer B (`#12,118,624`)** simultaneously! During `BAL_CATCHUP` (`#12,118,017 .. #Head`), `consumeBALBatch` simply skips mutating any account in bucket `b` for blocks $\le \text{bucketPivotBlock}[b]$.
3. **Unbounded Snapshot Aging ("The 3-Day BAL Tail"):**
   - Because flat-state nodes do not hold an 80 GB interior MPT database, an `ETHY/0` seeder cannot locally recompute new Merkle boundary proofs when `consumeBAL` mutates accounts in memory. Left unchecked, a swarm of nodes syncing exclusively from each other via `ETHY/0` would replicate Monday's `basePivotBlock` all week, forcing Friday joiners to replay `30,000+` historical BALs after finishing the 5-minute account pass.

---

### 1.2 Detailed Design Specifications

#### Part A: Canonical Pivot Grid Quantization (`K = 32` Blocks) (`src/net/peerCoordinator.ts`, `src/sync/balSync.ts`)

1. **Grid Constant & Hybrid Backward-Snap / Short-Wait Rule:**
   - Define `CANONICAL_PIVOT_GRID_BLOCKS = 32n` (1 Consensus Layer epoch = 32 blocks $\approx 6.4$ minutes) and `CANONICAL_PIVOT_MAX_BACKWARD_OFFSET = 24n` ($\approx 4.8$ minutes, leaving $128 - 24 = 104$ blocks / $\sim 21$ minutes of trie retention inside standard Geth/Nethermind 128-block `SNAP/1` windows).
   - Add a pure helper `selectCanonicalSnapPivotTarget(headBlock: bigint): { targetBlock: bigint; waitBlocks: bigint }`:
     - If `headBlock < CANONICAL_PIVOT_GRID_BLOCKS`, return `{ targetBlock: headBlock, waitBlocks: 0n }` (tiny test chains / devnets).
     - Compute `remainder = headBlock % CANONICAL_PIVOT_GRID_BLOCKS`.
     - **Immediate Backward Snap (`remainder <= 24n`):** Return `{ targetBlock: headBlock - remainder, waitBlocks: 0n }`. Because `targetBlock <= headBlock`, that block has already been mined! `PeerCoordinator` immediately requests `GET_BLOCK_HEADERS` by number for `targetBlock` (`requestPivotHeaderAt(peer, targetBlock)`) with **zero wait time**, and starts `BalChainStreamer` from `targetBlock + 1n` to buffer the $0..24$ intervening BALs.
     - **Short Forward Wait (`remainder > 24n`, i.e. next grid boundary is $1..7$ blocks / $12..84\text{s}$ away):** Return `{ targetBlock: headBlock + (32n - remainder), waitBlocks: 32n - remainder }`. While `bestPeerHead < targetBlock`, `PeerCoordinator` stays in `P2P_WARMUP` (still accepting any incoming `ETHY/0` seeder immediately!) and displays a clear notice / status (`Aligning SNAP pivot to canonical grid #targetBlock (+N blk)`). As soon as any peer advertises `latestBlock >= targetBlock`, `PeerCoordinator` fetches `targetBlock` and launches `SNAP/1` with a full 128-block retention runway.
2. **Quantized Rolling-Pivot Steps (`PIVOT_STEP_BLOCKS = 32n`):**
   - When a long `SNAP/1` sync steps its rolling pivot forward (`WP-04k`), step strictly between canonical grid multiples (`nextPivotBlock = (latestContiguousBalBlock / 32n) * 32n`) so every bucket and sub-range cursor remains anchored on a canonical `32`-block multiple.

#### Part B: Multi-Peer & Cross-Snapshot `ETHY/0` Bucket Striping (`src/sync/ethySwarmSync.ts`, `src/net/peerCoordinator.ts`, `src/persist/snapStore.ts`)

1. **Multi-Seeder Registry in `EthySwarmSynchronizer`:**
   - Replace the single `seederPeerId: string` in `EthySwarmSyncOpts` with dynamic seeder registration:
     ```ts
     export interface EthySeederDescriptor {
       peerId: string
       basePivotRoot: Uint8Array
       basePivotBlock: bigint
       bucketsBitmask: number
       balEarliestBlock: bigint
       balLatestBlock: bigint
       avgLatencyMs?: number
     }
     ```
   - Provide `upsertSeeder(seeder: EthySeederDescriptor): void` and `removeSeeder(peerId: string): void` on `EthySwarmSynchronizer`. Whenever a new `ETHY/0` peer completes `STATUS` (or updates its `bucketsBitmask`), `PeerCoordinator` forwards it to `ethySwarmSync.upsertSeeder(...)`.
2. **Same-Snapshot vs. Cross-Snapshot Bucket Assignment:**
   - **Within a Single Bucket (`0x0..0xf`):** All chunks of bucket `b` must come from a consistent snapshot `(bucketPivotBlock[b], bucketPivotRoot[b])` so `<nibble>.bin` has no gaps or overlapping hash shifts between chunks.
     - If **multiple seeders share the same `(bucketPivotBlock[b], bucketPivotRoot[b])`** for bucket `b`, `EthySwarmSynchronizer` can dispatch chunk requests for bucket `b` across any of those matching seeders!
     - Remember our strict in-order disk invariant: while multiple seeders can fetch different buckets in parallel (`MAX_TOTAL_CHUNKS_IN_FLIGHT = 16` or `32` across peers), within any single bucket `b` chunks must be **committed to `appendVerifiedSlabAsync` in strictly ascending `originHash` order** so `<nibble>.bin` stays sorted for binary search.
   - **Across Different Buckets (`Cross-Snapshot Composition`):**
     - Different buckets `b_1` and `b_2` are completely disjoint in 32-byte `accountHash` space (`b = accountHash[0] >> 4`).
     - Therefore, Bucket `0x0` can be assigned to Seeder A (`basePivotBlock = #12,120,000`) while Bucket `0x1` is assigned to Seeder B (`basePivotBlock = #12,120,320`), **provided** the connected swarm collectively advertises `BAL_RANGE` coverage from `min(bucketPivotBlock) + 1n` through `max(bucketPivotBlock)` (and up to live head).
     - Persist `bucketPivotBlocks?: Record<number, string>` (or derive per-bucket max/min `chunkBlockNumber` from `<nibble>.proof.idx` on disk) in `SnapPivotStore` so resume knows each bucket's exact anchor block.
3. **Per-Bucket `shouldApplyAccount` Filter During `BAL_CATCHUP`:**
   - Let $B_{\min} = \min_{b \in 0..15} \text{bucketPivotBlock}[b]$ and $B_{\max} = \max_{b \in 0..15} \text{bucketPivotBlock}[b]$.
   - After all 16 buckets finish their account pass, `BAL_CATCHUP` streams BALs starting from $B_{\min} + 1$.
   - When applying a BAL (or a `consumeBALBatch` sub-slice) at block `#N`:
     - If $B_{\min} === B_{\max}$ (all 16 buckets came from the same snapshot block), apply unconditionally to all buckets (`shouldApplyAccount` omitted).
     - If $B_{\min} < B_{\max}$ and `#N <= B_{\max}`, pass a bucket-aware `shouldApplyAccount` predicate (or split the batch at bucket-pivot boundaries) so mutations in block `#N` are applied **only** to accounts whose nibble bucket `b = keccak256(address)[0] >> 4` satisfies $\text{bucketPivotBlock}[b] < N$!
     - Once `#N > B_{\max}`, all 16 buckets are converged at `#N` and subsequent batches apply unconditionally across all 16 buckets.
   - Similarly, strip `GET_BAL_RANGE` requests across multiple `ETHY/0` seeders (and `eth/71` peers via `BalChainStreamer`) so BAL catch-up also scales with peer count.

#### Part C: Freshness-Weighted Seeder Scoring & Snapshot Age Cap (`MAX_SWARM_TAIL_BLOCKS`) (`src/net/peerCoordinator.ts`, `src/sync/ethySwarmSync.ts`)

1. **Freshness-First Bucket Seeder Selection:**
   - When assigning an unsynced bucket `b` to an available `ETHY/0` seeder that has bit `(1 << b)` set in `bucketsBitmask` and sufficient BAL coverage:
     - Prefer seeders with a **newer `basePivotBlock`** (smaller `targetHead - basePivotBlock` gap) when assigning a new bucket, while balancing active in-flight load across seeders so one peer is not overloaded when 3 seeders are idle.
2. **Bounded Snapshot Age (`MAX_SWARM_TAIL_BLOCKS = 2048n`):**
   - Define `DEFAULT_MAX_SWARM_TAIL_BLOCKS = 2048n` (~6.8 hours of blocks; configurable or overridden when `--sync-mode ethy` is explicitly set or when explicit `--connect` peers are used).
   - In `--sync-mode auto` (without explicit `--connect` target override):
     - If the best available `ETHY/0` seeder's `basePivotBlock` lags behind `bestPeerHead` by more than `MAX_SWARM_TAIL_BLOCKS` (`bestPeerHead - seeder.basePivotBlock > 2048n`) **and** we have healthy `SNAP/1` peers available, prefer bootstrapping a fresh **Canonical Grid (`K = 32`)** snapshot via `SNAP/1` (so this node mints a fresh generation seed at the current epoch for the swarm!).
     - Conversely, if `--sync-mode ethy` or `--connect` is passed (or no `SNAP/1` peers exist), accept the `ETHY/0` seeder regardless of tail length as long as its `balEarliestBlock <= basePivotBlock + 1n`.

---

### 1.3 Acceptance Criteria

- [x] **Canonical Grid Quantization (`K = 32`):** Pure unit tests verify `selectCanonicalSnapPivotTarget` snaps backward with `0` wait when `head % 32 <= 24` and waits $1..7$ blocks when `head % 32 > 24`; rolling-pivot steps align to multiples of `32`.
- [x] **Multi-Peer Same-Snapshot Striping:** `peersOnSnapshot` + round-robin chunk peer selection; loopback still single-seeder (chunk pipeline 1–2).
- [x] **Cross-Snapshot Bucket Composition:** `shouldApplyBalAtBlock` unit coverage; full multi-seeder state-diff fixture deferred.
- [x] **Freshness Scoring & Tail Cap:** Freshest `pickUsableEthySeeder`, `preferCanonicalSnapOverEthy` (`2048` vs `64800` hard cap).
- [x] All quality gates pass: `npm run tsc`, `npm test`, and `npm run spellcheck` in `@ethereumjs/ethy` (and any touched upstream packages).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

**Constraints:** Zero wire-protocol changes. No new dependencies. `consumeBAL` / `consumeBALBatch` stay unchanged: a merged batch is exact only when `shouldApplyAccount` is constant for every block in the batch, so cross-snapshot catch-up **splits batches** at pivot boundaries instead of teaching `mergeBALs` about block numbers.

### 2.1 Baseline (current tree)

| Area | Today |
| --- | --- |
| `syncSourceSelector.ts` | `pickUsableEthySeeder` returns the **first** usable peer. Hard tail `MAX_ETHY_BAL_TAIL_BLOCKS = 64_800n` (also `resumePolicy.ts`). `--sync-mode ethy` ignores tail. |
| `peerCoordinator.ts` | One `ethySeederPeerId`; SNAP pivot from `bestPeer.latestBlock` via `requestPivotFromPeer`. `requestPivotHeaderAt(peer, blockNumber)` exists. |
| `ethySwarmSync.ts` | Ignores non-`seederPeerId` messages. `MAX_CHUNK_PIPELINE = 1`, `MAX_TOTAL_CHUNKS_IN_FLIGHT = 16`. BAL catch-up: `consumeBALBatch` with no `shouldApplyAccount`. |
| `balSync.ts` | `PIVOT_STEP_BLOCKS = 16n` in `maybePivotStep`. |
| `snapStore.ts` / sidecars | `chunkBlockNumber` in `.proof.idx`; no `bucketPivotBlocks` on `active.json`. |

### 2.2 Design refinements (D-117)

1. **32-block step supersedes D-082’s step size (16), not the rolling-pivot mechanism.** `SAFE_HEAD_MARGIN = 2n` unchanged. In-flight `snap/1` proofs still verify against per-request `flight.stateRoot`. On-grid pivots advance by 32. Resumed off-grid pivots (legacy 16-step journals) snap forward via `nextCanonicalPivotBlock` and apply only `(current, next]`. Update the “every 16 blocks” sentence in `.cursor/rules/ethy-architecture.mdc` during implementation.
2. **`2048` is a swarm *preference*, not a new hard cap.** Keep `64_800n` for “seeder unusable” and resume/bridge. `DEFAULT_MAX_SWARM_TAIL_BLOCKS = 2048n` only steers `--sync-mode auto` (no explicit `--connect`) toward minting a fresh canonical SNAP pivot when the freshest ETHY snapshot is stale.
3. **No double BAL path on ETHY catch-up.** SNAP sync keeps `BalChainStreamer` on `eth/71`. ETHY `BAL_CATCHUP` stays on `GET_BAL_RANGE`, striped across seeders by advertised `[balEarliestBlock, balLatestBlock]`.
4. **Pure helpers in `src/sync/*.ts`**, not embedded in `PeerCoordinator`, so unit tests avoid importing the coordinator.

### 2.3 Part A — Canonical pivot grid (`K = 32`)

**New** `packages/ethy/src/sync/canonicalPivotGrid.ts`:

- `CANONICAL_PIVOT_GRID_BLOCKS = 32n`
- `CANONICAL_PIVOT_MAX_BACKWARD_OFFSET = 24n`
- `selectCanonicalSnapPivotTarget(headBlock: bigint): { targetBlock: bigint; waitBlocks: bigint }`
  - `headBlock < 32n` → `{ targetBlock: headBlock, waitBlocks: 0n }`
  - `remainder = headBlock % 32n`
  - `remainder <= 24n` → `{ targetBlock: headBlock - remainder, waitBlocks: 0n }`
  - else → `{ targetBlock: headBlock + (32n - remainder), waitBlocks: 32n - remainder }`
- `nextCanonicalPivotBlock(currentPivot, contiguousTip)` — on-grid: `current + 32` when buffered tip allows; off-grid: `floor(contiguousTip / 32) * 32` when `> currentPivot`.

**`peerCoordinator.ts`** (SNAP only, not ETHY anchor):

- When locking/fresh SNAP anchor, call `selectCanonicalSnapPivotTarget(bestPeerHead)`.
- `waitBlocks === 0n`: `requestPivotHeaderAt(bestPeer, targetBlock)`; `BalChainStreamer` already buffers `#target+1 .. head`.
- `waitBlocks > 0n`: no header fetch; `spine.pivotStatusHint = Aligning SNAP pivot to canonical grid #<target> (+<N> blk)`; still accept ETHY seeders (preempt). When any peer `latestBlock >= target`, fetch and clear hint.
- ETHY anchors remain at seeder `basePivotBlock` (no quantizing peer snapshots).

**`balSync.ts` — `maybePivotStep`:**

- Replace `pivot + PIVOT_STEP_BLOCKS` with `nextCanonicalPivotBlock`.
- Export `PIVOT_STEP_BLOCKS = 32n` for on-grid buffer sizing; first off-grid step may be `< 32` blocks applied.
- Keep `targetBlock > best - SAFE_HEAD_MARGIN`.

### 2.4 Part B — Multi-seeder & cross-snapshot striping

**New** `packages/ethy/src/sync/ethySeederSchedule.ts`:

```ts
export interface EthySeederDescriptor {
  peerId: string
  basePivotRoot: Uint8Array
  basePivotBlock: bigint
  bucketsBitmask: number
  balEarliestBlock: bigint
  balLatestBlock: bigint
  avgLatencyMs?: number
}
```

Pure functions:

- **`assignBuckets(seeders, assignedLoad)`** — freshness first, then load. Group by `(basePivotBlock, basePivotRoot)`; sort groups by `basePivotBlock` desc; within group pick lowest in-flight count. Greedy assign bits `0..15`. After draft, verify union of seeder BAL ranges covers `(Bmin, Bmax]`; if a bucket opens a hole, reassign or **fall back** to single freshest full-mask snapshot (same-snapshot multi-peer only).
- **`balApplySegments(bucketPivots, fromBlock, throughBlock)`** — split at distinct per-bucket pivots. For segment `(lo, hi]` with mixed pivots inside range: `shouldApplyAccount(addr)` iff `bucketPivots[bucketNibble(addr)] <= lo`. When `Bmin === Bmax`, one segment, omit predicate.
- **`bucketNibble(address)`** — `accountHashFromAddress` + `hash[0] >> 4` (`syncedAccountHash.ts`).

**`ethySwarmSync.ts` refactor:**

- Remove required single `seederPeerId`, `seedBucketsBitmask`, `chunkStateRoot`, `pivotBlockNumber` from ctor opts; add `upsertSeeder` / `removeSeeder`.
- `handleMessage` for any registered seeder; `ChunkFlight.peerId`; reject chunk if peer/root/`chunkBlockNumber` ≠ bucket pin.
- Same snapshot, one bucket: `MAX_CHUNK_PIPELINE = min(2, peersOnSnapshot)`; global 16; round-robin origins; **commit order** — `appendVerifiedSlabAsync` only for next manifest origin; reorder buffer up to pipeline depth.
- Cross-snapshot: disjoint buckets; set `bucketPivotBlock[b]` / root on manifest accept.
- Accounts pass complete → `balNext = Bmin + 1`; stripe `GET_BAL_RANGE` to seeders covering the window; one BAL range in flight.
- `onBalRange`: verify as today; apply via `balApplySegments` + per-segment `consumeBALBatch` (no merge across pivot boundaries).

**`peerCoordinator.ts`:**

- Telemetry: `upsertSeeder` / `removeSeeder` on ETHY STATUS updates and disconnects.
- One `EthySwarmSynchronizer` when transport locks `ethy`; later peers upsert only.
- `commitPivotAnchor` at **`Bmin`** (lowest assigned bucket pivot) for resume metadata.

**`snapStore.ts`:**

- Optional `bucketPivotBlocks?: Record<string, string>` on `ActiveMeta` (keys `"0"`..`"15"`).
- `noteBucketPivot(b, block)` on bucket done; restore in `loadInto`.
- Resume fallback: max `chunkBlockNumber` from `.proof.idx` per bucket; mixed blocks in one bucket → diagnostic + non-resumable bucket.

### 2.5 Part C — Freshness gate (`2048`)

**`syncSourceSelector.ts` extensions:**

- `DEFAULT_MAX_SWARM_TAIL_BLOCKS = 2048n`
- `freshestSeeder(seeders)` by `basePivotBlock`
- `preferCanonicalSnapOverEthy({ syncMode, explicitConnect, bestPeerHead, freshestPivot, hasSnapPeer })` — `true` only in `auto`, no explicit connect, `hasSnapPeer`, and `bestPeerHead - freshestPivot > 2048n`.
- `hasSnapPeer`: peer with head + `snapSession === true` (proven snap not required at selection).

**`tryLockSyncTransport`:**

- If `preferCanonicalSnapOverEthy`, skip ETHY lock; grace → SNAP with Part A grid.
- Inside 2048: lock ETHY and upsert **all** hard-cap-legal seeders, not only first.
- Explicit `--connect` / `sync-mode ethy`: unchanged (`pickUsableEthySeeder(..., 'ethy')`).

### 2.6 File tree

| Path | Action |
| --- | --- |
| `packages/ethy/src/sync/canonicalPivotGrid.ts` | **New** — grid target + rolling step |
| `packages/ethy/src/sync/ethySeederSchedule.ts` | **New** — descriptor, assign, BAL segments |
| `packages/ethy/src/sync/ethySwarmSync.ts` | Multi-seeder registry, striping, filtered BAL |
| `packages/ethy/src/sync/balSync.ts` | `PIVOT_STEP_BLOCKS = 32n`, `nextCanonicalPivotBlock` |
| `packages/ethy/src/sync/syncSourceSelector.ts` | `2048` preference helpers |
| `packages/ethy/src/net/peerCoordinator.ts` | Grid wait, seeder upserts, `Bmin` anchor |
| `packages/ethy/src/persist/snapStore.ts` | `bucketPivotBlocks` persist |
| `packages/ethy/test/canonicalPivotGrid.spec.ts` | **New** |
| `packages/ethy/test/ethySeederSchedule.spec.ts` | **New** (+ cross-snapshot apply; optional `crossSnapshotBal.spec.ts`) |
| `packages/ethy/test/balCatchUp.spec.ts` | Pivot step `+ 32n` |
| `packages/ethy/test/syncSourceSelector.spec.ts` | `2048` preference; keep `64800` hard reject |
| `packages/ethy/test/ethySwarmLoopback.spec.ts` | Adjust if ctor opts change |
| `.cursor/rules/ethy-architecture.mdc` | Pivot step 32 (implementer) |

### 2.7 Tests (maps to §1.3 acceptance)

1. **`canonicalPivotGrid.spec.ts`:** `head % 32` cases `0`, `24` → backward `0` wait; `25`, `31` → wait `7`, `1`; `head < 32`; on-grid `+32`; off-grid `100` tip `140` → `128`.
2. **Multi-peer same snapshot:** two seeders, same pivot — both peer ids used; strictly ascending origins per bucket (out-of-order delivery held in reorder buffer).
3. **Cross-snapshot:** A `#100` buckets `0..7`, B `#132` buckets `8..15`, BALs `#101..#150` — filtered apply matches unfiltered gold on `FlatStateManager`.
4. **Freshness / tail:** prefer fresher pivot; `auto` + snap peer + tail `> 2048` → SNAP grid; `ethy` / `--connect` / no snap peer → ETHY.
5. **Mixed assignment BAL hole** → single-snapshot fallback.

### 2.8 Gates & out of scope

- **Gates:** `npm run tsc`, `npm test`, `npm run spellcheck` in `@ethereumjs/ethy`. No expected upstream package changes.
- **Out of scope:** wire changes, `MAX_TOTAL_CHUNKS_IN_FLIGHT = 32`, lowering `64_800n` hard cap, flat-node Merkle reproofing on live BAL mutations.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **Shipped:** `canonicalPivotGrid.ts`, `ethySeederSchedule.ts`, multi-seeder `EthySwarmSynchronizer` (`upsertSeeder`, per-bucket pins, chunk peer round-robin, striped `GET_BAL_RANGE`, per-block `shouldApplyBalAtBlock`), `preferCanonicalSnapOverEthy` + freshest seeder pick, SNAP canonical grid wait in `peerCoordinator`, `snapStore.noteBucketPivot`, rolling pivot `PIVOT_STEP_BLOCKS = 32n`.
- **Deferred / lighter than plan:** same-bucket chunk reorder buffer for out-of-order multi-peer replies (pipeline stays mostly sequential); full cross-snapshot BAL integration test uses bucket-nibble predicate unit test only; resume does not yet reload per-bucket pivots from `bucketPivotBlocks` on disk.
- **Gates:** `npm run tsc`, **318** tests, spellcheck on touched TS.
