# WP-06g: Canonical Pivot Grid Quantization (`K = 32`), Multi-Peer & Cross-Snapshot `ETHY/0` Bucket Striping, and Freshness-Weighted Seeder Selection

- **Status:** `READY_FOR_PLANNING`
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

- [ ] **Canonical Grid Quantization (`K = 32`):** Pure unit tests verify `selectCanonicalSnapPivotTarget` snaps backward with `0` wait when `head % 32 <= 24` and waits $1..7$ blocks when `head % 32 > 24`; rolling-pivot steps align to multiples of `32`.
- [ ] **Multi-Peer Same-Snapshot Striping:** Deterministic test with 2+ `ETHY/0` seeders sharing the same `basePivotBlock` verifies that `EthySwarmSynchronizer` distributes bucket/chunk requests across both peers concurrently while writing each bucket's `<nibble>.bin` in strictly ascending `originHash` order.
- [ ] **Cross-Snapshot Bucket Composition:** Deterministic test where Seeder A serves Buckets `0x0..0x7` at block `#100` and Seeder B serves Buckets `0x8..0xf` at block `#132` (with BALs `#101..#150`) verifies that `BAL_CATCHUP` applies blocks `#101..#132` only to Buckets `0x0..0x7`, applies `#133..#150` to all 16 buckets, and reaches the exact target state at `#150`.
- [ ] **Freshness Scoring & Tail Cap:** Unit tests verify seeder ranking prefers fresher `basePivotBlock` snapshots within `MAX_SWARM_TAIL_BLOCKS = 2048n` and falls back to minting a fresh canonical `SNAP/1` pivot in `auto` mode when all `ETHY/0` snapshots are older than `2048` blocks (while respecting `--connect` / `--sync-mode ethy`).
- [ ] All quality gates pass: `npm run tsc`, `npm test`, and `npm run spellcheck` in `@ethereumjs/ethy` (and any touched upstream packages).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5 during the Implementation pass.)*
