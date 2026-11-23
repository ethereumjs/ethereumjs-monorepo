# WP-13: The Machine — Unified Sync & Network Lifecycle Orchestrator, Dynamic Subprotocol Planes (`SNAP/1` / `ETHY/0` / `Discovery` / `CL`) & Cockpit Observability

- **Status:** `READY_FOR_PLANNING`
- **Series:** `WP-13` — Network Citizenship, Anticipatory Lifecycle & Machine Oversight
- **Dependencies:** `WP-05b`, `WP-07g`, `WP-08a`, `WP-11a`, `WP-11b` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Neon)

### 1.1 Architectural Diagnosis: Why Ethy Needs "The Machine"

Audit of a live `BAL Catch-Up` session (`1 connected (0 ethy · 1 snap)`, `1,728 / 20,709 BALs applied`) alongside `peerCoordinator.ts`, `discoveryHold.ts`, `swarmRuntime.ts`, `ethyAdvertise.ts`, `consensusTracker.ts`, and `packages/devp2p/src/rlpx/rlpx.ts` exposes five tightly coupled gaps in how Ethy manages its networks and state lifecycle:

1. **`snap/1` Is Permanently Advertised in `HELLO` Even When Idle for Hours or Days:**
   - `peerCoordinator.ts:1992` passes a static `capabilities: ['eth69', 'eth70', 'eth71', 'eth72', 'snap1', 'ethy0']` to `createThreadedNetwork`, and `RLPx._capabilities` (`packages/devp2p/src/rlpx/rlpx.ts:111`) is immutable after startup.
   - Because `snap/1` stays in `HELLO` during `BAL_CATCHUP`, `ETHY/0` sync, and multi-hour `HEAD_FOLLOWING`, every `Geth`/`Nethermind`/`Reth` peer we keep for `eth/71` BALs also negotiates a `snap/1` session.
   - Remote syncing nodes then send inbound `GetAccountRange` / `GetStorageRanges` / `GetByteCodes` requests. Because a flat-state node cannot serve valid MPT proofs (`answerEmptySnap: false`, **D-048**), those requests are silently dropped — causing remote peers to wait 10–30 s for timeouts, penalize Ethy, and drop the connection.
   - Worse, the P2P cockpit reports `1 connected (0 ethy · 1 snap)`, making an `eth/71` BAL peer look like a pointless `snap/1` connection.
2. **No Dynamic Peer Budgets or Calm-Mode Network Civility:**
   - `SYNC_MAX_PEERS = 20` (`peerCoordinator.ts:184`) stays flat across all phases, and `maybeVipReconnect()` (`peerCoordinator.ts:1563`) continues dialing up to `6` VIP peers every 5 seconds during calm `HEAD_FOLLOWING` and `BAL_CATCHUP`.
   - `DPT.setDiscoveryPaused(true)` (`packages/devp2p/src/dpt/dpt.ts:523`) still runs periodic k-bucket UDP revalidation pings (`_revalidateOnePeer`) rather than offering a true low-noise sleep/off mode when a laptop is calmly following head with healthy peers.
3. **Zero Anticipatory Pre-Warming Before Planned Transitions:**
   - With `WP-11b` live, the node **already knows hours in advance** when its base pivot generation will hit `SOFT_REFRESH_AGE_BLOCKS` (`1,536` blocks $\approx 5.1$ h) and when its deterministic hash-lottery `electionDeadlineMs` will fire.
   - If `Discovery` and `SNAP/1` are turned off during calm hours (as good network citizens should do), the node must **anticipate** upcoming work:
     - **Stage 1 (`ETHY/0` pre-warm, ~15 min / 75 blocks before `SOFT_REFRESH_AGE_BLOCKS`):** Wake discovery briefly if `ethyPeers < 2` so the node can find an existing or in-flight `ETHY/0` generation $G_{\text{new}}$ and shadow-sync via `ETHY/0` (zero `SNAP/1` load!).
     - **Stage 2 (`SNAP/1` pre-warm, ~3 min before `electionDeadlineMs`):** ONLY when no verified `ETHY/0` peer is serving or minting $G_{\text{new}}$, re-enable `snap1` in `RLPx` capabilities and pre-dial `2–4` `snap1`-capable peers (`Nethermind`/`Geth` from `PeerBookStore` or discovery) so the elected shadow mint starts immediately with zero cold-start stall.
     - **Stage 3 (Immediate cooldown):** The instant shadow mint completes or another minter suppresses our lottery, flip `snap1` back **OFF**, put discovery back to sleep, and trim surplus peers back to the calm budget.
4. **Fragmented Sync & Network Decision Logic Across Seven Files:**
   - Today, lifecycle authority is split across `startupStateMachine.ts`, `resumePolicy.ts`, `resumeCoordinator.ts`, `syncSourceSelector.ts`, `discoveryHold.ts`, `swarmRuntime.ts`, and ad-hoc guards in `peerCoordinator.ts` and `ethyAdvertise.ts`.
   - Even `ethyAdvertise.ts` advertises `bucketsBitmask = 0xffff` (`ethy 16/16`) and keeps the ENR `"ethy"` discovery tag active even while the node is catching up +18,981 blocks behind head or carrying a gapped BAL tail — misleading both remote `ETHY/0` joiners and the local operator.
   - `consensusTracker.ts` (`@ethereumjs/beacon-light`) polls Beacon REST at one static cadence regardless of whether the node is in heavy `SNAP_SYNCING` (only needing periodic anchor checks) or live `HEAD_FOLLOWING` (12 s slot cadence).
5. **The Operator Cannot See What "The Machine" Is Doing or Planning:**
   - In `HEAD_FOLLOWING`, row 3 of `╭─ ● State ─╮` spends an entire line on a frozen `Progress ████████████ 100% (synced)` bar while hiding generation age, next shadow-refresh countdown, and serving eligibility.
   - `╭─ ● P2P ─╮` shows `Peers`, `Served`, `Latency`, `Clients` with zero visibility into which network planes (`eth`, `ethy`, `snap`, `disc`) are currently active, pre-warming, or intentionally turned off.

---

### 1.2 Core Design: A Pure Declarative Control Plane ("The Machine")

Introduce a single, pure, clock-injected **`SyncNetworkOrchestrator`** (`packages/ethy/src/sync/machineOrchestrator.ts`) that inspects Ethy's current state and produces a complete **`MachinePlan`** on every tick. `PeerCoordinator` and `ConsensusTracker` become thin **reconcilers** that apply diffs from `MachinePlan` onto `Devp2pWorkerClient` and the Beacon light runner.

#### Part A: Upstream `@ethereumjs/devp2p` Dynamic Transport Controls (Separate Atomic Commit per **D-008**)

Backwards-compatible additions to `@ethereumjs/devp2p` (defaulting to current behavior when unused):

1. **Dynamic `RLPx` Capabilities & Peer Budgets (`packages/devp2p/src/rlpx/rlpx.ts`):**
   - `setCapabilities(capabilities: Capabilities[]): void` — Updates `this._capabilities` for all subsequent inbound/outbound `HELLO` handshakes without restarting TCP listeners or dropping healthy connections.
   - `setMaxPeers(maxPeers: number, discoveryLowWaterMark?: number): void` and `setMinEthyPeers(minEthyPeers: number): void` — Dynamically adapts connection capacity across phases (e.g. `20` during sync → `8` during `BAL_CATCHUP` → `6` during calm `HEAD_FOLLOWING`) and trims excess non-protected peers gracefully when lowered (evicting highest-latency / surplus non-`ethy` / idle `snap` sessions first, **never** dropping the last healthy `eth/71` peer or protected `minEthyPeers`).
   - **Graceful Idle-`snap1` Protection:** When `snap1` is NOT in `this._capabilities`, if an older retained connection (that negotiated `snap1` earlier during sync) receives an inbound `snap/1` request (`GetAccountRange`, etc.) — or once non-`snap1` replacement `eth/71` peers meet target — cleanly recycle/rotate that peer without disrupting `BAL_CATCHUP` or `HEAD_FOLLOWING` continuity.
2. **Three-Mode `DPT` Discovery State (`packages/devp2p/src/dpt/dpt.ts`):**
   - Add `DiscoveryMode = 'active' | 'quiet' | 'off'` via `setDiscoveryMode(mode: DiscoveryMode)` (keeping `setDiscoveryPaused(boolean)` as a backwards-compatible alias: `true` → `'quiet'`, `false` → `'active'`):
     - **`'active'`:** Full EIP-1459 DNS ENR refresh + UDP neighbour lookup (`findneighbours`) + k-bucket revalidation.
     - **`'quiet'`:** Pauses neighbour lookups and DNS refresh while retaining light k-bucket liveness revalidation (existing paused behavior).
     - **`'off'`:** Suspends DNS refresh, neighbour lookups, **and** periodic UDP revalidation pings (zero outbound discovery traffic while the node is calmly synced with healthy peers; UDP socket stays bound only for passive inbound/immediate wake-up).
   - Add `setEthyDiscoveryTag(enabled: boolean): void` on `DPT` / `Server` so the ENR `"ethy"` discovery flag can be turned on **only** when the node actually holds servable `ETHY/0` state (or is actively seeking `ETHY/0` peers).
3. **Worker Protocol & Client Bridge (`packages/devp2p/src/worker/protocol.ts`, `client.ts`, `host.ts`):**
   - New worker commands (idempotent, diff-gated in `PeerCoordinator`):
     - `setCapabilities: { capabilities: WorkerCapabilityName[] }`
     - `setPeerTargets: { maxPeers: number; maxInboundPeers?: number; discoveryLowWaterMark?: number; minEthyPeers?: number }`
     - `setDiscoveryMode: { mode: DiscoveryMode; ethyDiscoveryTag?: boolean }`
   - Extend `WorkerDiscoverySnapshot` with `mode: DiscoveryMode`, `activeCapabilities: string[]`, and `ethyDiscoveryTag: boolean` so the TUI and `/machine` microscope show ground-truth worker state (never guessed main-thread state).

#### Part B: The Five-Plane `MachinePlan` & Anticipatory Lifecycle (`packages/ethy/src/sync/machineOrchestrator.ts`)

1. **Operating Modes (`MachineOperatingMode`):**
   - `boot-warmup` — Initial disk hydration + first peer head acquisition (`P2P_WARMUP` / `BOOTING`)
   - `cold-ethy-sync` — Base flat-state download via `ETHY/0` swarm
   - `cold-snap-sync` — Base flat-state download via `SNAP/1` (accounts, bytecode, storage) + rolling pivot BALs
   - `bal-catchup` — Historical batched `eth/71` or `ETHY/0` BAL catch-up (e.g. after restart or laptop wake)
   - `live-calm` — `HEAD_FOLLOWING` within head margin; low-noise steady state (`SNAP/1` OFF, `Discovery` OFF)
   - `prewarm-ethy` — Anticipatory window before `SOFT_REFRESH_AGE_BLOCKS` (waking discovery to find/verify `ETHY/0` swarm seeders for $G_{\text{new}}$)
   - `shadow-ethy-refresh` — Background `ETHY/0` shadow pivot upgrade (`SNAP/1` stays OFF!)
   - `prewarm-snap-mint` — Anticipatory window (`~3 min` before `electionDeadlineMs`) when elected to mint $G_{\text{new}}$ (`SNAP/1` ON + targeted `snap1` VIP/discovery pre-dial!)
   - `shadow-snap-mint` — Background paced `SNAP/1` shadow mint for $G_{\text{new}}$
   - `degraded-recovery` — Zero healthy peers or stalled unbridgeable BAL gap (waking discovery + escalating `ETHY/0` → `SNAP/1` recovery)
2. **Per-Plane Desired State (`PlaneStatus = 'active' | 'prewarming' | 'standby' | 'off'`):**
   Every plane emits `{ status, targetPeers, activePeers, reason, nextChangeMs?, nextChangeLabel? }`:
   - **`eth` (`eth/69–72`):**
     - `active` across `boot-warmup`, `cold-snap-sync`, `bal-catchup`, `live-calm`, and shadow modes — **with phase-adaptive peer budgets**:
       - `boot-warmup` / `cold-snap-sync`: `maxPeers = 20`, `vipTarget = 10`
       - `bal-catchup`: `maxPeers = 8`, `vipTarget = 4` (enough latency-ranked peers for 32-block batching without table bloat)
       - `live-calm`: `maxPeers = 6`, `vipTarget = 3` (calm 12 s head following + tx-broadcast diversity; VIP dial timer sleeps completely once `healthyEthPeers >= 3`!)
       - `shadow-snap-mint`: `maxPeers = 10`, `vipTarget = 5` (adds `2–4` `snap1` minter peers, then scales back to `6` on completion)
   - **`ethy` (`ethy/0`):**
     - `active` during `cold-ethy-sync`, `shadow-ethy-refresh`, and whenever **servable** (complete or partial buckets with contiguous BAL tail within `HARD_PREFER_SNAP_AGE_BLOCKS`), keeping `minEthyPeers = 4` (or `2` in `live-calm`) and ENR `"ethy"` tag ON.
     - `prewarming` during `prewarm-ethy` (waking discovery/PEX to locate $G_{\text{new}}$ seeders before falling back to `SNAP/1`).
     - `standby` during `bal-catchup` when catching up from a stale pivot (keep `ethy0` capability negotiated so `GET_BAL_RANGE` works if an `ETHY/0` peer connects, without falsely claiming ready state-serving to new joiners!).
     - `off` only when explicitly disabled via `--sync-mode snap` with zero servable buckets.
   - **`snap` (`snap/1`):**
     - `active` ONLY during `cold-snap-sync` and `shadow-snap-mint`.
     - `prewarming` ONLY during `boot-warmup` (when no fresh `ETHY/0` seeder is locked and `syncMode !== 'ethy'`) and `prewarm-snap-mint` (`T - 180 s` before `electionDeadlineMs` when unsuppressed and `shadowRefreshEnabled`).
     - **`off` everywhere else** (`cold-ethy-sync`, `bal-catchup`, `live-calm`, `prewarm-ethy`, `shadow-ethy-refresh`) — removed from `RLPx._capabilities` so zero new `snap/1` sessions are negotiated and zero inbound `snap/1` requests are solicited!
     - **Zero-Disruption Transition Rule:** Switching `snap` from `active` → `off` never bulk-disconnects our active `eth/71` peers if that would drop `healthyEthPeers` below `bal-catchup`/`live-calm` minimum; instead it stops advertising `snap1` immediately, trims surplus peers above `maxPeers`, and lazily rotates lingering `snap1`-negotiated peers once clean `eth`-only replacements exist (or immediately if a peer sends an unwanted inbound `snap/1` request while `snap` is `off`).
   - **`discovery` (`DPT` UDP + EIP-1459 DNS):**
     - `active` when peer count is below low-water mark for any active/pre-warming plane, or during a bounded pre-warm burst (`prewarm-ethy` / `prewarm-snap-mint`, capped e.g. `3–5 min` per burst so an isolated laptop never storms UDP forever).
     - `standby` (`DPT` `'quiet'`) during active bulk sync with sufficient proven peers (`wantSnapDiscoveryHold` / `ETHY` swarm active).
     - **`off` (`DPT` `'off'`)** during `live-calm` and steady `bal-catchup` once proven peer targets are met and no pre-warm window is within lead-in — eliminating background UDP neighbour-lookup/ping churn completely!
   - **`cl` (`@ethereumjs/beacon-light`):**
     - `active` (`12 s` slot poll) during `live-calm` and `boot-warmup` (to anchor chain head fast).
     - `standby` (`60 s` reduced poll cadence) during long `cold-snap-sync` / `cold-ethy-sync` / multi-thousand-block `bal-catchup` (saves unnecessary Beacon REST requests while still tracking the chain head clock smoothly).
     - `off` when `--no-cl` is passed (or backed off on `p2p_only` endpoint failure).
3. **Anti-Flap Hysteresis & Minimum Dwell Guards:**
   - Every plane state change enforces a minimum dwell (`MIN_PLANE_DWELL_MS`, e.g. `30 s` for discovery sleep/wake, `60 s` for `snap1` off→on outside emergency recovery) so a single transient peer disconnect never causes rapid capability flapping or repeated `HELLO` churn.
4. **Honest Serving Matrix (`MachineServingState`):**
   - Computes explicit, unambiguous serving eligibility for each protocol (shared by `ethyAdvertise.ts`, `Devp2pWorkerHost`, cockpit `Served`, and `/machine`):
     - `eth`: `'serving' | 'warming' | 'paused'` (`blocksStored`, `range`)
     - `ethy`: `'serving' | 'partial-minting' | 'paused-catching-up' | 'paused-stale' | 'paused-bal-gap' | 'off'` (`bucketsCount`, `generationAgeBlocks`, `balTailContiguous`, `reason`)
     - `snap`: always `'client-only'` (never serves; indicates whether client plane is `active` / `prewarming` / `off`)
   - Fixes `ethyAdvertise.ts` so when `ethy` serving is `paused-catching-up` / `paused-bal-gap` / `paused-stale`, the node advertises its true contiguous `balEarliestBlock` (never faking `pivot + 1n` when blocks are missing) and clears the ENR `"ethy"` tag until it can honestly serve again!
5. **Anticipatory Schedule (`MachineSchedule`):**
   - Computes concrete next-event forecasts from live telemetry:
     - `generationAgeBlocks`, `softRefreshAtBlocks` (`1,536`), `hardHorizonBlocks` (`4,096`)
     - `estimatedTimeToSoftRefreshMs` (using `12 s / block`)
     - `ethyPrewarmAtMs` (`~15 min` before soft refresh)
     - `snapPrewarmAtMs` (`~3 min` before `electionDeadlineMs` when in `waiting-election` and unsuppressed)
     - `nextEventSummary` (short single-line human string for TUI, e.g. `Refresh in ~4.3h`, `ETHY pre-warm in 8m`, `SNAP pre-warm in 2m`, `Shadow ETHY 42%`, `Catching up (~11m)`)

#### Part C: TUI Evolution — Evolved `State` & `P2P` Boxes + `/machine` Microscope

Respects all `ethy-tui.mdc` craft laws (8-row cockpit boxes, 4 content rows, shared `maxLabelWidth`, `visibleWidth` safety, single-width glyphs `●`/`◐`/`○`, zero extra top-band height):

1. **Evolved `╭─ ● State ─╮` Box (`packages/ethy/src/tui/cockpit.ts`):**
   - During `SNAP_SYNCING` and `BAL_CATCHUP`: keeps the exact 4-row progress layout (`Stage`, `Target`, `Progress`, `State`) with accurate live math and honest serving note.
   - During `HEAD_FOLLOWING`: replaces the redundant static `Progress ████████████ 100% (synced)` row with a live **`Cycle`** (or **`Refresh`**) lifecycle row powered by `MachinePlan`:
     - Row 1 `Stage`: `★ Head Following · Live` (or `★ Live · Shadow ETHY 42%` / `★ Live · SNAP Mint 4/16` when background refresh is running!)
     - Row 2 `Target`: `#12,195,170 (live)` (unchanged)
     - Row 3 `Refresh`: e.g. `Gen 240/1,536 blk · ~4.3h` → `Pre-warm ETHY in 8m` → `Waiting election (42s)` → `Shadow ETHY 42%` → `Off (--no-shadow-refresh)`
     - Row 4 `State`: `161.6M acc · 65k code · serve 16/16` (or `161.6M acc · BAL gap — refresh queued` when serving is paused)
2. **Evolved `╭─ ● P2P ─╮` Box (`packages/ethy/src/tui/cockpit.ts`):**
   - Folds average latency cleanly into `Peers` and gives **`Planes`** its own dedicated row so the operator can see the exact on/off state of every network plane at a glance:
     - Row 1 `Peers`: `4 conn · 66ms (2 ethy · 4 eth)` *(only includes `· N snap` when `snap` plane is `active`/`prewarming` or a lingering snap session exists!)*
     - Row 2 `Planes`: `eth ● · ethy ● · snap ○ · disc ○` *(live status glyph per plane: `●` active, `◐` pre-warm/standby, `○` off)*
     - Row 3 `Served`: `12 replies · 4.2 MB (eth 64b · ethy 16/16)` *(or `paused · catching up` / `paused · BAL gap` when `ethy` cannot honestly serve)*
     - Row 4 `Clients`: `2 Nethermind · 2 Ethy`
3. **New `/machine` Microscope Command (alias `/sync`) (`packages/ethy/src/tools/machineTools.ts`, registered in `toolRegistry.ts`, `deterministicEngine.ts`, `slashComplete.ts`, `help.ts`, `rpc/methods.ts`):**
   - Renders a crisp structured overview of **"The Machine"**:
     - Operating mode + current reason + uptime
     - **Network Planes Table:** `Plane` (`ETH/69–72`, `ETHY/0`, `SNAP/1`, `Discovery`, `CL Beacon`) | `State` (`● active` / `◐ pre-warm` / `◐ standby` / `○ off`) | `Peers / Cadence` | `Reason & Next Transition`
     - **Serving Honesty Table:** `eth/69–71`, `ETHY/0`, `SNAP/1` with exact servable window, bucket mask, continuity status, and ENR `"ethy"` flag
     - **Upcoming Lifecycle Schedule:** generation age, BAL tail span, soft/hard refresh horizons, pre-warm countdowns, and election status
   - **`Ctrl+D` Debug Page:** Displays the bounded 24-entry **Machine Transition Log** (timestamped plane flips: e.g. `11:52:04 snap active → off (BAL catch-up started)`, `16:40:00 discovery off → prewarming (15m before soft refresh)`).
   - **JSON-RPC (`ethy_status`):** Exposes a compact `machine: { mode, planes, serving, nextEventSummary }` snapshot for headless/SDK and external monitoring consumers.
4. **Shared-Policy `ethy-sim` Telemetry Hook (`packages/ethy/src/sim/`):**
   - Wire `evaluateMachinePlan` (or its `snap`/`discovery` plane predicates) as an optional telemetry metric in `WP-11a` `ethy-sim` reporting `idleSnapSessionFraction` and `idleDiscoveryDutyCycle`, verifying that in calm steady-state `SNAP/1` stays off `> 95%` of the time across a multi-day swarm!

---

### 1.3 Acceptance Criteria (`WP-13`)

- [ ] **Zero new runtime dependencies** in `@ethereumjs/devp2p` or `@ethereumjs/ethy`.
- [ ] **Separate upstream `@ethereumjs/devp2p` commit (per D-008):**
  - `RLPx.setCapabilities()`, `RLPx.setMaxPeers()`, `RLPx.setMinEthyPeers()` with graceful surplus eviction (preserving `minEthyPeers` and minimum healthy `eth` peers).
  - `DPT.setDiscoveryMode('active' | 'quiet' | 'off')` (zero outbound UDP pings/revalidation in `'off'`) + `setEthyDiscoveryTag(boolean)` + backwards-compatible `setDiscoveryPaused(boolean)`.
  - Worker commands (`setCapabilities`, `setPeerTargets`, `setDiscoveryMode`) and `WorkerDiscoverySnapshot` ground-truth telemetry (`mode`, `activeCapabilities`, `ethyDiscoveryTag`).
  - Unit & loopback tests in `packages/devp2p` proving new handshakes omit `snap1` after `setCapabilities` and `'off'` stops discovery pings.
- [ ] **Pure `SyncNetworkOrchestrator` (`machineOrchestrator.ts`):**
  - Deterministically maps spine/swarm/disk/peer state → `MachinePlan` covering all 10 operating modes, all 5 planes (`eth`, `ethy`, `snap`, `discovery`, `cl`), phase-adaptive peer targets, anticipatory `ETHY/0` (`T - 15m`) and `SNAP/1` (`T - 3m`) pre-warming, anti-flap dwell hysteresis, and honest serving eligibility.
  - Zero-disruption `snap1` off transition (never drops active `eth/71` catch-up peers below target; lazily rotates or disconnects on unwanted inbound `snap/1` requests).
  - `ConsensusTracker` respects `cl` plane cadence (`12 s` active vs `60 s` standby).
  - `ethyAdvertise.ts` and ENR `"ethy"` tag strictly honor serving eligibility (no claiming `16/16` servable with a broken BAL tail or an expired stale pivot).
- [ ] **Evolved Cockpit & `/machine` Microscope:**
  - `State` box shows live `Refresh` lifecycle row during `HEAD_FOLLOWING` (generation age / countdown / shadow refresh progress) while preserving 8-row layout and `Progress` bar during sync/catch-up.
  - `P2P` box shows `Peers` (with latency, omitting `snap` when off/zero) and `Planes` (`eth ● · ethy ● · snap ○ · disc ○`) plus honest `Served` row.
  - `/machine` (alias `/sync`) displays Planes, Serving Honesty, Upcoming Schedule, and `Ctrl+D` Transition Log; added to `/help`, `slashComplete`, and `ethy_status` JSON-RPC.
- [ ] **Verification & Gates:**
  - Dedicated offline unit + loopback tests (`machineOrchestrator.spec.ts`, updated `tui.spec.ts`, `startupStateMachine.spec.ts`, `devp2p` dynamic capabilities/discovery tests).
  - All gates green across `packages/devp2p` and `packages/ethy`: `npm run tsc`, `npm test`, Biome check, and `npm run spellcheck`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 before implementation begins.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 upon completion.)*
