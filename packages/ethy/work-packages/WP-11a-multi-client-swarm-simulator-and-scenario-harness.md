# WP-11a: Multi-Client `ETHY/0` Swarm Simulator (`ethy-sim`) & Shared-Policy Scenario Verification Harness

- **Status:** `PLANNED`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5
- **Dependencies:** `WP-06c`, `WP-06d`, `WP-06g`, `WP-07e` (`DONE`)
- **Primary Goal:** Build a fast, deterministic, discrete-event **multi-client swarm simulator (`ethy-sim`)** inside `packages/ethy/src/sim/` that executes Ethy's **actual production sync/scheduling policy modules** across dozens to thousands of virtual nodes (`N = 10 .. 2,000+`) over hours to weeks of simulated Ethereum time — turning distributed P2P swarm behavior (thundering herds, intermittent laptops, flash crowds, DHT sparsity, minter crashes, and adversarial suppression) into reproducible, quantitatively gated unit tests and an interactive CLI benchmark (`npm run sim:swarm`).

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Neon)

### 1.1 Why a Shared-Policy Simulator Comes First

Live 2-node localhost tests (`ethySwarmLoopback.spec.ts`) prove wire encoding and single-link verification, but they **cannot reveal emergent `N`-node network dynamics**:

- What happens when `500` clients all share a single snapshot `#P_0` and cross `DEFAULT_MAX_SWARM_TAIL_BLOCKS = 2,048` on the exact same block? (Today: synchronized **`O(N)` `SNAP/1` thundering herd**.)
- What happens when `200` laptop users open Ethy for 2 hours every 2–3 days and update via BALs? (Today: 64-block RAM eviction creates a **silent BAL gap** after 13 minutes, and frozen Day-1 `basePivotBlock` causes them to **fall out of usable state serving permanently**.)
- What happens when `1` seeder faces a flash crowd of `100` joiners all requesting buckets in fixed `0x0 -> 0xf` order? (Today: **linear bottleneck** on the single seeder instead of `O(log N)` BitTorrent amplification.)
- What happens when `20` `ETHY/0` nodes live inside a `2,000`-node `Geth/Reth` DHT (`1%` density) and a fresh node only waits `2,500ms` before locking `SNAP/1`? (Today: `>90%` premature `SNAP/1` fallback.)

**Critical Anti-Pattern to Avoid:** Do **not** build a toy simulator that re-implements simplified pseudo-rules disconnected from production code. The simulator **must invoke the real pure TypeScript policy functions** (`syncSourceSelector.ts`, `canonicalPivotGrid.ts`, `ethySeederSchedule.ts`, `startupStateMachine.ts`, and — once `WP-11b` lands — `swarmGenerationPolicy.ts` and `balRetentionPolicy.ts`) with an injected virtual clock and deterministic seeded RNG. That way:

1. `WP-11a` immediately establishes a **quantitative baseline** exposing today's exact failure numbers on the current policies.
2. `WP-11b` flips those exact scenario gates from red/baseline to green by upgrading the shared production policy modules — guaranteeing zero drift between simulated proofs and real client behavior.

---

### 1.2 Architectural Design (`packages/ethy/src/sim/`)

Zero new npm dependencies. Pure TypeScript (`node:*` only for optional CLI formatting).

#### 1. Virtual Clock, Deterministic Seeded RNG & World Model (`src/sim/types.ts`, `src/sim/world.ts`)
- **Deterministic Seeded RNG (`Mulberry32` seeded by `--seed <uint32>`):** Every simulation run with the same `(scenario, seed, params)` produces **bit-identical** metrics and event traces.
- **Discrete-Event / Slot-Stepped Clock:** Advances in configurable ticks (default `12s` Ethereum slots, with sub-slot `1s` granularity during startup grace/discovery phases when needed). Must simulate **500 nodes over 7 virtual days (`50,400` slots) in `< 3 seconds`** of wall-clock CPU.
- **Chain Backbone Model (`BackbonePool`):**
  - Advances canonical head block `+1` every `12s` (`slot`), optionally injecting configurable short reorgs (`1..2` blocks).
  - Models `M` backbone `Geth/Nethermind` peers with realistic `SNAP/1` constraints: `128`-block state-root retention window, `eth/71` BAL retention window (configurable, e.g. `4,096` or `8,192` blocks), per-peer concurrent `SNAP/1` slot cap, and aggregate `SNAP/1` bandwidth budget so `SNAP/1` saturation and queue wait times show up directly in the metrics.
- **Heterogeneous Node Profiles (`NodeProfile`):**
  - `always-on`: public IP, 24/7 uptime, high upload (`200 Mb/s`), participates fully in `ETHY/0` serving & `ETHY_PEX`.
  - `desktop`: NAT (outbound-only TCP, bidirectional serving over established sessions per `ETHY-0-SPEC` §4.3), online `8h/day` with random daily phase offset, medium upload (`50 Mb/s`).
  - `laptop`: NAT, opens for `1–3h` every `48–72h` with persisted disk state (accounts, proof sidecars, BAL tail) across sleep/wake cycles.
  - `burst-joiner`: fresh cold node arriving during a flash-crowd window.
  - `byzantine`: configurable fault modes — `fake-minter` (advertises `basePivotBlock = head, bucketsBitmask = 0` to attempt suppression attack), `black-hole-seeder` (advertises `0xffff` but returns empty chunks/timeouts), `stale-liar` (advertises broken BAL range).

#### 2. Sparse Peer Graph, Discovery & Bandwidth Model (`src/sim/network.ts`)
- **Sparse Overlay Topology:** Each online node maintains up to `maxPeers` (default `25`) connections, split across backbone `Geth/Nethermind` peers and `ETHY/0` peers (with configurable reserved `minEthyPeers` slots so `WP-11b` can compare `0` vs `4` reserved slots).
- **DHT Density & `ETHY_PEX` Gossip:**
  - Fresh nodes sample random DHT peers where the probability of drawing an `ETHY/0` peer equals the live `ethyDensity = onlinePublicEthy / (onlinePublicEthy + backboneDhtSize)` (configurable, e.g. `0.01` = 1% DHT density), plus optional `peers.json` warm cache for returning nodes.
  - Once connected to any `ETHY/0` peer, `ETHY_PEX` (`GET_ETHY_PEERS` / `ETHY_PEERS`) propagates known `ETHY/0` descriptors across hops with realistic RTT and `32`-peer reply caps.
- **Bucket-Level Bandwidth & Transfer Physics:**
  - Models per-node download and upload capacities (e.g. `16` buckets per snapshot, configurable bucket transfer size so a `16`-bucket `SNAP/1` sync takes ~`30 min` / `150` blocks under healthy backbone load and degrades linearly when backbone `SNAP/1` slots saturate; `ETHY/0` chunk transfer scales with the seeder's available upload share divided across active joining peers).
  - Tracks per-node state faithfully:
    - `phase`: `OFFLINE | P2P_WARMUP | SNAP_SYNCING | BAL_CATCHUP | HEAD_FOLLOWING`
    - `syncTransport`: `'unset' | 'ethy' | 'snap'`
    - `basePivotBlock`, `bucketPivotBlocks[0..15]`, `bucketsBitmask` (`0x0000..0xffff`)
    - `balEarliestBlock`, `balLatestBlock`, `lastVerifiedBlock` (including simulating RAM-only `64`-block `RollingBlockStore` eviction vs contiguous disk BAL archive!)
    - `shadowRefresh` state (for `WP-11b` zero-downtime background pivot upgrades)

#### 3. Pluggable Policy Hook (`SwarmPolicyAdapter`)
- Exposes a clean adapter interface wrapping the **actual production policy functions** from `packages/ethy/src/sync/`:
  - `selectSyncSource(...)` → calls `isUsableEthySeeder`, `pickAllUsableEthySeeders`, `preferCanonicalSnapOverEthy`, `shouldLockSnapAfterGrace`
  - `selectSnapPivot(...)` → calls `selectCanonicalSnapPivotTarget`, `nextCanonicalPivotBlock`
  - `assignBuckets(...)` → calls `assignBuckets` from `ethySeederSchedule.ts`
  - `classifyResume(...)` → calls `classifySavedDiskState`, `planNetworkHeadResume` from `startupStateMachine.ts`
  - Optional extension hooks for `WP-11b` (`evaluateGenerationRefresh`, `evaluateBalRetention`, `shouldPreemptSnapForEthy`) with explicit `legacy` (current `WP-06g`) vs `v2` (`WP-11b`) policy presets so we can run **A/B before-and-after comparisons** side-by-side!

#### 4. Canonical 10-Scenario Stress Library (`src/sim/scenarios.ts`)
Every scenario has deterministic parameters, a clear protocol question, and explicit target invariants:

| # | Scenario ID | Setup | What It Proves / Exposes |
| --- | --- | --- | --- |
| 1 | `thundering-herd-age-cliff` | `1` initial seeder + `200` joiners on `G_0`; advance clock past `T_hard` (`4,096` blk) with continuous joins + wakes | Measures peak concurrent `SNAP/1` syncs & total `SNAP/1` minters per generation (exposes today's `O(N)` stampede; target: amortized `O(1)`, `<= 3` minters/gen) |
| 2 | `laptop-every-3-days` | `30` always-on + `150` laptops (online `2h` every `48–72h`) over `14` virtual days | Tests serving continuity, BAL-tail gaps, stale wake-ups, and whether intermittent nodes permanently fall out of serving |
| 3 | `flash-crowd-launch` | `1` completed seeder (`50 Mb/s` up) + `200` fresh joiners arriving within `15 min` | Quantifies sequential `0..15` seeder hot-spot vs rarest-first `O(log N)` BitTorrent amplification (`P50`/`P95` sync time & seeder saturation) |
| 4 | `low-density-dht-bootstrap` | `20` `ETHY/0` nodes inside `2,000` `Geth/Reth` DHT peers (`1%` density); `50` new cold joiners | Measures `ETHY_PEX` discovery convergence vs premature `2.5s` `SNAP/1` lock |
| 5 | `minter-crash-failover` | Elected `G_1` minter crashes at bucket `0x3` (`20%` done) | Verifies suppression timeout expires and backup minter takes over cleanly with zero swarm deadlock |
| 6 | `fake-minter-suppression` | `5` Byzantine nodes advertise fake `basePivotBlock = head, bucketsBitmask = 0` | Verifies adversarial suppression defense: honest nodes verify header/liveness and still mint `G_1` on schedule |
| 7 | `cross-snapshot-churn` | Swarm spanning `3` generations (`G_0, G_1, G_2`) with `20%`/hr peer churn & partial bitmasks | Verifies cross-snapshot bucket composition & BAL coverage checks never deadlock or corrupt state |
| 8 | `total-swarm-hibernation` | All `100` nodes offline for `4` days (`28,800` blocks), then wake within `10 min` | Verifies graceful `O(1)` recovery when zero fresh snapshots exist anywhere in the swarm |
| 9 | `seeder-bandwidth-cap` | `1` slow residential seeder (`20 Mb/s`) + `50` fast joiners (`200 Mb/s`) | Measures swarm amplification factor (`aggregate download / origin upload`) |
| 10 | `long-horizon-soak` | `200` heterogeneous nodes (`10%` always-on, `20%` desktop, `70%` laptop) over `30` virtual days (`216,000` blocks) | Verifies long-run stability: zero drift in generation count, serving continuity, `SNAP` ratio, or BAL tail length |

#### 5. Quantitative KPI Metrics & CLI Runner (`src/sim/metrics.ts`, `src/sim/cli.ts`)
- **Core KPIs computed per run:**
  - `snapOffloadRatio` (`ethySyncs / (ethySyncs + snapSyncs)`)
  - `snapMintersPerGeneration` (mean & max `SNAP/1` syncs initiated per macro-generation — measures **`O(1)` vs `O(N)`**)
  - `peakConcurrentSnapSyncs` (maximum simultaneous `SNAP/1` load on the Ethereum backbone)
  - `servingContinuityRate` (% of online synced node-hours advertising a **hole-free**, usable `balEarliestBlock <= basePivotBlock + 1` within `T_hard`)
  - `balGapIncidents` (count of seeders advertising a broken BAL gap between `basePivotBlock` and `balEarliestBlock`)
  - `medianJoinTimeSec` & `p95JoinTimeSec`
  - `p95BalTailBlocks` (tail length replayed by joining nodes)
  - `swarmAmplificationFactor` (`total ETHY bytes downloaded / origin seeder bytes uploaded`)
  - `stalledNodeCount` & `falseSyncedCount` (must always be `0`)
  - `generationTimeline` (compact sampled buckets for ASCII trend lines / JSON export)
- **CLI Entry Point (`npm run sim:swarm` in `packages/ethy/package.json`):**
  - `npm run sim:swarm -- --scenario all` (runs all 10 scenarios at default CI-friendly scale and prints a crisp comparison table)
  - `npm run sim:swarm -- --scenario thundering-herd-age-cliff --nodes 500 --days 7 --seed 42 [--policy legacy|v2] [--json]`
  - Optional `--compare` flag to run two policy presets side-by-side on the same seed and print deltas!

---

### 1.3 Acceptance Criteria

- [ ] Pure discrete-event swarm simulator lives in `packages/ethy/src/sim/` with **zero new npm dependencies** and **zero real sockets/filesystem I/O**.
- [ ] Simulator directly invokes real production policy modules (`syncSourceSelector.ts`, `canonicalPivotGrid.ts`, `ethySeederSchedule.ts`, `startupStateMachine.ts`) via `SwarmPolicyAdapter` — no duplicated fake sync rules.
- [ ] All **10 named scenarios** run deterministically with `--seed` (bit-identical JSON output across repeated runs).
- [ ] `legacy` baseline run demonstrably reproduces and quantifies the known `WP-06g` failure modes (the `2,048`-block thundering herd, the 64-block RAM BAL gap, sequential bucket bottleneck, and low-density DHT premature SNAP fallback).
- [ ] Fast offline Vitest suite (`packages/ethy/test/swarmSimulator.spec.ts`) runs all 10 scenarios at compact scale (`N = 30..60`) in `< 3 seconds` inside `npm test`, verifying simulator determinism, conservation laws, zero false-synced / crash-safety invariants, and baseline failure detection.
- [ ] `npm run sim:swarm -- --scenario all` runs cleanly from `packages/ethy` and outputs a readable ASCII KPI summary table (plus `--json` mode).
- [ ] All quality gates pass: `npm run tsc`, `npm test`, `npm run spellcheck`, and `biome check`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

**D-130:** Event-driven discrete-event clock (not per-node per-slot scanning), `legacy`/`v2` adapter hooks where `v2` delegates to `legacy` until `WP-11b`, CI gates assert **known legacy failure baselines** (not `WP-11b` green targets), integer-only KPI JSON for bit-identical reruns, and `RAM_BAL_BLOCKS = 64` mirroring `@ethereumjs/devp2p` `RollingBlockStore` default without importing devp2p.

### 2.1 Scope & production policy surface

Discrete-event simulator under `packages/ethy/src/sim/` with `N` virtual nodes and a virtual clock. It calls real policy functions only through `SwarmPolicyAdapter`:

| Module | Symbols |
| --- | --- |
| `syncSourceSelector.ts` | `isUsableEthySeeder`, `pickAllUsableEthySeeders`, `freshestEthyPivot`, `preferCanonicalSnapOverEthy`, `shouldLockSnapAfterGrace`, `ETHY_DISCOVERY_GRACE_MS` (2,500), `DEFAULT_MAX_SWARM_TAIL_BLOCKS` (2,048), `MAX_ETHY_BAL_TAIL_BLOCKS` (64,800) |
| `canonicalPivotGrid.ts` | `selectCanonicalSnapPivotTarget`, `nextCanonicalPivotBlock` |
| `ethySeederSchedule.ts` | `assignBuckets` (fixed `0..15` order in `tryAssignFromGroups`) |
| `startupStateMachine.ts` | `classifySavedDiskState`, `planNetworkHeadResume` |
| `resumePolicy.ts` | gap constants only via the functions above (`90`, `900`, `64,800`) — never duplicated |

The simulator **also** counts BAL holes when `bucketsBitmask === 0xffff` because `isUsableEthySeeder` skips `balEarliestBlock <= basePivotBlock + 1` in that case today (`syncSourceSelector.ts:31`).

Guardrails: zero new npm dependencies; no sockets or filesystem I/O; do **not** export from `src/index.ts`; no `node:*` under `src/sim/` (CLI in `scripts/` only).

### 2.2 File tree & responsibilities

| Path | Role |
| --- | --- |
| `src/sim/rng.ts` | `createSeededRng(seed)` — Mulberry32, bit-identical sequence per seed |
| `src/sim/types.ts` | Profiles, phases, `SimNode`, `SimConfig`, `ScenarioId`, physics constants, `PolicyPreset = 'legacy' \| 'v2'` |
| `src/sim/policyAdapter.ts` | **Only** file importing `src/sync/*` |
| `src/sim/network.ts` | Sparse overlay, DHT draws, PEX, `minEthyPeers` slot field |
| `src/sim/transfer.ts` | Backbone SNAP queue + ETHY bucket upload sharing |
| `src/sim/world.ts` | Event queue, node lifecycle, BAL RAM window |
| `src/sim/scenarios.ts` | Ten scenarios × `ci` and `demo` scales |
| `src/sim/metrics.ts` | Integer KPI accumulation + canonical JSON |
| `src/sim/runSim.ts` | `runScenario`, `runAll`, `comparePresets` |
| `src/sim/formatReport.ts` | Pure ASCII table (no I/O) |
| `scripts/sim-swarm.ts` | argv → stdout |
| `test/swarmSimulator.spec.ts` | Vitest (picked up by `test:node`) |
| `package.json` | `"sim:swarm": "tsx scripts/sim-swarm.ts"` |

### 2.3 Clock, backbone, profiles

- **Clock:** `SLOT_MS = 12_000`; discovery samples every `DISCOVERY_SAMPLE_MS = 1_000`. Head: `startHead + floor(virtualMs / SLOT_MS)`. Event queue jumps to next wake/sleep, discovery tick, transfer completion, grace expiry, or cliff (`pivot + RAM_BAL_BLOCKS`, `pivot + 2,048`). Target: 500 nodes × 7 virtual days in **&lt; 3s** wall CPU.
- **Backbone:** `M` non-Ethy Geth-style peers; 128-block SNAP state window; BAL retention default 8,192 blocks; concurrent SNAP cap. One healthy 16-bucket SNAP sync = `SNAP_SYNC_BLOCKS_HEALTHY = 150` slots when `concurrent <= cap`, else `150 * max(1, ceil(concurrent / cap))` slots (one completion event per sync).
- **Profiles:** `always-on` (public, 200 Mb/s), `desktop` (NAT, 8h/day, 50 Mb/s), `laptop` (1–3h every 48–72h, disk persists), `burst-joiner`, `byzantine` (`fake-minter`, `black-hole-seeder`, `stale-liar`). Only `always-on` nodes accept inbound DHT dials.

**Node state:** `phase`, `syncTransport`, `basePivotBlock`, shared 32-byte pivot root (derived from pivot block number, no keccak), `bucketsBitmask`, `balEarliestBlock`, `balLatestBlock`, `lastVerifiedBlock`, disk snapshot across sleep, `shadowRefresh: { active: false }`.

**Legacy BAL (`RAM_BAL_BLOCKS = 64`):** On `HEAD_FOLLOWING`, `balLatest = lastVerified`, `balEarliest = max(basePivot + 1, lastVerified - 63)` once past pivot + 64. Laptop sleep drops RAM tail; disk keeps pivot, bitmask, `lastVerified`. Wake: `classifySavedDiskState` + `planNetworkHeadResume`. `HEAD_FOLLOWING` only after 16 buckets **and** covered BAL catch-up; else `BAL_CATCHUP` (stalled if uncovered).

**Overlay:** `maxPeers = 25`, `minEthyPeers = 0` (field for `WP-11b`). DHT hit rate `onlinePublicEthy / (onlinePublicEthy + backboneDhtSize)`; PEX cap 32 after 100ms; laptops try peer cache once.

**ETHY transfers:** One bucket per slot at 50 Mb/s reference; joiners take lowest missing nibble first (`0..15`); upload shared across active joiners; byte conservation (download total = upload total).

**Transport lock order (each discovery tick until set):** (1) resume path if disk exists; (2) build `EthySeederView` from peers; (3) `preferCanonicalSnapOverEthy` / `shouldLockSnapAfterGrace` → SNAP + `selectCanonicalSnapPivotTarget`; (4) else usable seeders → ETHY + `assignBuckets`; (5) `bucketsBitmask === 0` never usable.

### 2.4 `SwarmPolicyAdapter`

```ts
type SwarmPolicyAdapter = {
  preset: 'legacy' | 'v2'
  selectSyncSource(input): { transport: 'ethy' | 'snap' | 'unset'; seeders: EthySeederView[] }
  selectSnapPivot(head: bigint): CanonicalSnapPivotTarget
  assignBuckets(seeders: EthySeederDescriptor[]): AssignBucketsResult | undefined
  classifyResume(saved, liveHead, ethyBalTail: boolean): NetworkHeadResumeAction
  evaluateGenerationRefresh(): { action: 'hold' }
  evaluateBalRetention(): { mode: 'ram'; windowBlocks: 64 }
  shouldPreemptSnapForEthy(): false
}
```

`v2` uses the same production calls; three hooks stay `hold` / `ram-64` / `false` until `WP-11b` replaces them.

### 2.5 Scenarios & legacy CI gates

Default seed `1`. Tests use `ci` scale; CLI `--nodes` / `--days` override **demo** only; `--scale ci` for compact `sim:swarm`.

| Scenario ID | CI shape (summary) | Legacy gate (baseline, not WP-11b target) |
| --- | --- | --- |
| `thundering-herd-age-cliff` | 1 seeder + 24 joiners, SNAP cap 4, stop `pivot + 2,200` | `snapMintersPerGeneration` max ≥ 12; `peakConcurrentSnapSyncs` ≥ 4 |
| `laptop-every-3-days` | 4 always-on + 16 laptops, 4 days, 2h / 60h | `balGapIncidents` ≥ 1; `gappedButStillUsable` ≥ 1 |
| `flash-crowd-launch` | 50 Mb/s seeder; N=8 vs N=16 | `p95(N=16)/p95(N=8)` ≥ 1.6 |
| `low-density-dht-bootstrap` | 6 Ethy in DHT 600; 16 joiners | ≥ 12/16 lock SNAP after 2.5s grace |
| `minter-crash-failover` | Partial G1 seeder dies; G0 past 2,048; no minter election in legacy | `stalledNodeCount` ≥ 1; `falseSyncedCount === 0` |
| `fake-minter-suppression` | 5 fake `bucketsBitmask=0` at head | 0 assignments to fakes; SNAP minters ≥ 80% joiners |
| `cross-snapshot-churn` | Mixed pivots / partial masks | `fallbackSingleSnapshot` seen; assignment succeeds; `falseSyncedCount === 0` |
| `total-swarm-hibernation` | 20 nodes, 28,800 blocks offline | SNAP count = node count; `falseSyncedCount === 0` |
| `seeder-bandwidth-cap` | 20 Mb/s seeder, 12 fast joiners | `swarmAmplificationFactor` &lt; 2.5; byte conservation |
| `long-horizon-soak` | 20 nodes, 2 days, 10/20/70 mix | `falseSyncedCount === 0`; one generation; deterministic JSON repeat |

Demo scales match §1.2 table (200 joiners, 14-day laptops, etc.).

### 2.6 CLI & tests

- `npm run sim:swarm -- --scenario all` (demo unless `--scale ci`)
- `npm run sim:swarm -- --scenario thundering-herd-age-cliff --nodes 500 --days 7 --seed 42 --policy legacy --json`
- `--compare`: `legacy` vs `v2` on same seed — expect **zero delta** until `WP-11b`

`swarmSimulator.spec.ts`: RNG stability; all 10 CI scenarios determinism + conservation + legacy gates; compare delta zero; optional 500×7-day perf smoke &lt; 3s.

### 2.7 Implementer finish gates

From `packages/ethy`: `npm run tsc`, `npm test`, `npm run spellcheck`, `npm run biome`, `npm run sim:swarm -- --scenario all --scale ci`.

### 2.8 Out of scope (this WP)

`balRetentionPolicy.ts`, `swarmGenerationPolicy.ts`, disk BAL segments, rarest-first striping, shadow refresh, devp2p PEX changes, TUI, live P2P, production sync behavior changes.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5 upon completion.)*
