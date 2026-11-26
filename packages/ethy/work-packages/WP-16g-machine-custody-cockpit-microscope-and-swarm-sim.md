# WP-16g: `The Machine` Custody Orchestration, Honest Custody Cockpit UI, 16-Bucket `/ethy` Microscope & `ethy-sim` Custody Swarm Gates

- **Status:** `DONE`
- **Dependencies:** `WP-16c`–`WP-16f` (`DONE`), `WP-11a` (`DONE`), `WP-13` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Wire Unified Custody `ETHY/0` (Option B + Option C) cleanly into **`The Machine` (`SyncNetworkOrchestrator`, `WP-13`)**, upgrade the **3-Box Cockpit TUI** and **`/ethy` + `/machine`** microscopes to show real-time 16-bucket custody, 1-hop reachability, live subtree trie health, and privacy coverage, and extend the deterministic **`ethy-sim` multi-client swarm simulator (`WP-11a`)** with CI gates proving 1-hop 16/16 reachability, Byzantine root-assembly resilience, and **zero `snap/1` cold reads and refreshes** at swarm scale.

---

### Key Deliverables (`WP-16g`)

1. **`The Machine` (`SyncNetworkOrchestrator`) Unified 5-Plane Custody Modes (`packages/ethy/src/sync/machineOrchestrator.ts`):**
   - Keep `PlaneId` clean at **5 planes (`eth`, `ethy`, `snap`, `discovery`, `cl`)** — no duplicate 6th `staty` plane!
   - **Zero-`snap/1` Default Invariant:** On all default Ethy nodes (`snapBootstrap === false`), the `snap` plane stays **permanently `off`** (never advertised in `HELLO`, `0` `snap/1` peer slots). Only an explicit Day-0 `--full --snap-bootstrap` seeder arms `snap` until its initial state sync finishes, after which `The Machine` drops `snap1` from `HELLO` permanently!
   - Introduce Custody-native operating modes:
     - `custody-bal-warmup`: pulling rolling `eth/71` BAL window (`snap` permanently `off` unless `--snap-bootstrap`, `ethy` discovering bucket-diverse custodians).
     - `custody-sync`: live `HEAD_FOLLOWING` via BALs + background 3-plane custody sync of assigned bucket(s) over `ETHY/0`.
     - `custody-live-calm`: steady-state `HEAD_FOLLOWING` + live subtree tries + `ETHY/0` serving (proofs, chunks, code, BALs, `h_b` roots) — `snap` permanently `off`!
     - `full-backfill`: `--full` (`--custody 16`) mode — already live while replicating all 16 buckets in the background (`ETHY/0` by default; `snap/1` only with `--snap-bootstrap`, dropped permanently once 16/16 buckets close).
   - **Bucket-Diversity Peer Steering:**
     - Compute `uncoveredBucketsMask = 0xffff & ~(closedBucketsMask | connectedSwarmBucketsMask)` (and low-redundancy `< 2` peers mask once `16/16` is reached) on every Machine tick.
     - Pass `desiredEthyBucketsMask` into `devp2p`'s `NetworkProfile` so `ETHY_PEX` (`0x09`/`0x0a`) and peer rotation actively fill any missing nibble buckets until the node holds **1-hop `16/16` coverage with 2× redundancy** within `14–20` peers (under default `--custody 2`, `7` peers already cover all 14 remote buckets!).

2. **Honest 3-Box Cockpit UI (`packages/ethy/src/tui/cockpit.ts` & `spine/types.ts`):**
   - **State Box (`Stage` & `State` lines):**
     - Booting: `Rolling BALs 3.2k/4.1k` → immediately flips to live!
     - Default `--custody 2` syncing buckets `#a, #2`: `★ Live · Custody 1/2 (#2 62%)`
     - Default `--custody 2` live (Option B / C): `★ Live · Custody 2/16 (#a,#2 · Trie ✓)` with concise working-set line (`16/16 1-hop · 94% local · 0 snap`).
     - Low-disk `--custody 1`: `★ Live · Custody 1/16 (#a · Trie ✓)`.
     - Multi-custody / `--full`: `★ Live · Full Backfill 6/16 (38%)` → `★ Live · Full 16/16 (Private)`.
   - **P2P Box (`Peers`, `Planes`, `Served` lines):**
     - Surface `ETHY` custody coverage honestly (`16 conn (14 ethy · 16/16 bkt)`).
     - Keep clean 5-plane row (`eth ● · ethy ● · snap ○ · disc ○ · cl ●` — showing `snap ○` dormant in steady state!).
     - Unified giving-back counters on `Served` (`BALs 1.2k · ETHY 42 prf / 14 ch / 88 code`).

3. **Upgraded `/ethy` & `/machine` Microscopes (`packages/ethy/src/tools/`):**
   - **`/ethy` (Unified Custody & 16-Bucket Coverage Matrix):**
     - Top summary: Custody mode (`Custody 2/16` / `Custody 1/16` / `Full 16/16`), assigned bucket(s), rolling BAL horizon (`localBalEarliestBlock .. #Head`), `RootNode(#A)` assembly status (`16/16 assembled` vs `bootstrap 530B`), and resolution breakdown (`local` / `tombstone` / `ETHY proof` / `ETHY chunk` / `snap fallback`).
     - **16-Bucket (`0x0..0xf`) Matrix Table:** Per nibble shows:
       - Local state (`Closed + Trie ✓`, `Closed Flat`, `Syncing 62%`, or `Open`),
       - 3-plane flags (`Acc` / `Code` / `Stor`),
       - 1-hop swarm custodians connected (`e.g. 2 trie · 1 flat`),
       - Privacy indicator (`🔒 Private` for locally closed buckets vs `1-hop` for Open-World buckets).
     - `Ctrl+D` debug page: connected `ETHY/0` peers table with advertised `(bucketsBitmask, storageBucketsBitmask, codeBucketsBitmask, trieBucketsBitmask, basePivotBlock)` and recent `h_b` assembly log.
   - **`/machine` Upgrade:** Surface `uncoveredBucketsMask`, `desiredEthyBucketsMask`, `snap1` dormancy reason, and live `1/16th` subtree trie build/update latency (`ms/block`).

4. **Multi-Client Swarm Simulator (`ethy-sim`) Custody CI Gates (`packages/ethy/src/sim/`):**
   - Add 3 deterministic CI simulation scenarios extending `WP-11a`'s discrete-event simulator:
     1. **`custody-1hop-reachability` (`N = 32` `--custody 2` nodes, max `18` peers/node):** Assert `100%` of nodes achieve `16/16` 1-hop bucket coverage with `>= 2×` bucket redundancy via bucket-aware `ETHY_PEX` within the simulated warmup window.
     2. **`custody-zero-snap-cold-reads` (`N = 32` `--custody 2` nodes issuing `500` random cold account + storage queries across all 16 buckets):** Assert `100%` resolution via 1-hop `ETHY/0` (`0x0b` witnesses / `0x03`+`0x05` chunks) with **`0` `snap/1` calls**.
     3. **`custody-root-assembly-and-refresh` (`N = 16` `--custody 2` nodes including `2` Byzantine peers gossiping forged `h_b` values across `2` macro-generations):** Assert `100%` of honest nodes assemble consensus-valid `RootNode(#A)`, quarantine the `2` Byzantine peers, and complete macro-generation pivot refresh with **`0` `snap/1` calls**.

---

### Acceptance Criteria (`WP-16g`)
- [x] `The Machine` cleanly orchestrates 5 planes (`eth`, `ethy`, `snap`, `discovery`, `cl`), steers bucket-diverse `ETHY_PEX` toward `16/16` 1-hop coverage, and drops `snap1` from `HELLO` in `custody-live-calm` and `Full 16/16`.
- [x] 3-Box Cockpit and `/ethy` + `/machine` microscopes surface honest custody mode, 16-bucket local/swarm coverage, `RootNode` assembly, and zero-`snap` serving telemetry.
- [x] All 3 `ethy-sim` custody swarm gates pass deterministically in CI alongside existing `WP-11a`/`WP-11b` gates.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

Dependencies **WP-16c–WP-16f DONE**. No new runtime deps. No new devp2p message codes.

### 2.1 Baseline (what already ships)

| Area | Today | WP-16g delta |
| --- | --- | --- |
| **Planes** | 5 planes in `machineOrchestrator.ts`; `bootNetworkProfile` omits `snap1` unless `--snap-bootstrap` | Custody modes + snap plane `off` when capability absent; `desiredEthyBucketsMask` on every plan |
| **PEX** | `selectEthyPexPeers` + `NetworkProfile.desiredEthyBucketsMask` in devp2p | Re-query `0x09` on mask change; coordinator computes **1-hop** masks (not assigned buckets only) |
| **Coordinator** | Boot sets mask to `desiredCustodyBucketsMask(assigned)`; `reconcileMachine` profile **drops** mask; `live-calm` `maxPeers = 6` | Per-tick coverage; custody budgets `maxPeers = 20`; optional ETHY rotation when full |
| **Cockpit** | `★ Head Following · Live`; planes row without `cl`; generic Served bytes | Custody Stage/State copy; `16/16 bkt`; ETHY prf/ch/code counters; `0 snap` |
| **Microscopes** | `/ethy` swarm summary table; `/machine` without coverage masks | 16× matrix + resolve breakdown + assembly log |
| **Sim** | 10 WP-11 scenarios | 3 additive custody gates (do not mutate legacy scenario JSON) |

Subtree tries, root assembly, resolver, and onboarding are **WP-16d–WP-16f** — this WP is orchestration, observability, and CI proof only.

### 2.2 Design locks (**D-151**)

**Custody-native `MachineOperatingMode`** (no 6th plane):

| Mode | When |
| --- | --- |
| `custody-bal-warmup` | `BAL_CATCHUP` or `custodyBalOnboarding` |
| `custody-sync` | `HEAD_FOLLOWING` and any **assigned** bucket not fully closed |
| `custody-live-calm` | Assigned buckets closed; default `--custody 2` steady state; `snap` off |
| `full-backfill` | `--custody 16` and `closedBucketsMask !== 0xffff` |

`custodyActive = custodyBuckets.length > 0 && syncMode !== 'snap'`. Precedence: boot / degraded / legacy WP-13 paths unchanged when `!custodyActive`. On default clients, do **not** enter `shadow-snap-mint` or `prewarm-snap-mint`. Shadow ETHY refresh may run underneath; custody Stage line still shows custody text; Refresh row keeps shadow summary.

**Snap:** `includeSnap` only when `snapBootstrap || syncMode === 'snap'` and mode requires mint/sync. If `snap1` not in `capabilities`, plane status **`off`** (dwell bypass on transition down). `full-backfill` drops `snap1` permanently once `closedBucketsMask === 0xffff`.

**Peer budgets** (custody modes only): `maxPeers = 20`, `minEthyPeers = 6`, `vipTarget` tuned for PEX fill. Non-custody `live-calm` keeps `maxPeers = 6` (WP-13 tests). Discovery stays `active` until `hopBuckets === 16` **and** `minRedundancy >= 2`, then existing dwell rules may quiet it.

**Coverage mask** (pure, every tick — replaces boot-time “our buckets” as PEX target):

```
connectedSwarmBucketsMask = OR(peer.bucketsBitmask) for ethySession peers
per-bucket count = peers advertising bit + (1 if bit in closedBucketsMask)
uncovered = 0xffff & ~(closedBucketsMask | connectedSwarmBucketsMask)
desiredEthyBucketsMask = uncovered if uncovered ≠ 0 else bits with count < 2
hopBuckets = count of set bits in (closedBucketsMask | connectedSwarmBucketsMask)
```

`evaluateMachinePlan` must copy `desiredEthyBucketsMask` onto `NetworkProfile` so `networkProfilesEqual` / `setNetworkProfile` do not drop it.

### 2.3 File-by-file

#### 1. `src/custody/custodyCoverage.ts` (new)

Export `evaluateCustodyCoverage({ closedBucketsMask, peers })` → masks above + `minRedundancy`. Tests: empty swarm, single peer 8-bit mask, 16/16 with hole, local closed bucket counts as one custodian.

#### 2. `src/sync/machineOrchestrator.ts`

Extend `MachineObservation` with custody/coverage fields (`custodyActive`, `custodyCount`, masks, `hopBuckets`, `trieBucketsMask`, `snapMounted`). Coordinator passes coverage result into `buildMachineObservation`.

Extend `MachineSpineSnapshot`: `desiredEthyBucketsMask`, `uncoveredBucketsMask`, `snapDormancyReason` (`default-off` | `bootstrap-active` | `dropped-after-close`), optional `subtreeApplyMs`.

Implement `deriveMode` custody branch + `BUDGETS` for the four modes. Wire `desiredEthyBucketsMask` on `plan.profile`.

#### 3. `src/net/peerCoordinator.ts`

Each `reconcileMachine` tick: `evaluateCustodyCoverage` → observation. Remove boot-only mask merge; plan owns the field.

When at `maxPeers` and `desiredEthyBucketsMask !== 0`, disconnect at most one ETHY peer with no overlap on `desired` and not sole custodian for another needed bit (Law 1). Push `custodyAssemblyLog` / `lastAssembly` / `subtreeApplyMs` onto spine from `SubtreeCustodyRegistry`.

#### 4. `@ethereumjs/devp2p` `worker/host.ts` (**D-008**, separate commit)

On `applyNetworkProfile`, if `desiredEthyBucketsMask` changed, send fresh `GET_ETHY_PEERS` on each live ETHY session (do not rely on one-shot `_ethyPexSent` only). Test: mask change → second `0x09`.

#### 5. `src/tui/cockpit.ts` + `src/spine/types.ts`

Custody Stage/State/P2P rows per §1 when `machine.mode` is custody-* (legacy modes unchanged). Planes: `eth · ethy · snap · disc · cl`. Served: `BALs · ETHY prf/ch/code` from `WorkerServingSnapshot`. `local%` from `spine.custodyResolve` counters.

Chunk `%` via `EthySwarmSynchronizer.bucketSyncPct(bucket)` (`chunksDone / manifest length`); omit percent if no manifest yet.

#### 6. `src/custody/custodyStateResolver.ts`

O(1) `spine.custodyResolve` tallies: `local | tombstone | ethyProof | ethyChunk | snap` at existing return sites.

#### 7. `src/tools/diagnose.ts` (`ethyOverviewWidget`)

Preface: custody label, assigned nibbles, BAL horizon, root assembly status, resolve breakdown. Body: 16-row matrix (local state, Acc/Code/Stor, 1-hop custodians, privacy). Widen `PeerTelemetry.ethyStatus` for storage/code/trie mask strings (already on wire).

`debugPage`: ETHY peer STATUS table + bounded `h_b` assembly log.

#### 8. `src/tools/machineTools.ts`

Add uncovered/desired masks, snap dormancy, `subtreeApplyMs`; planes line includes `cl`.

#### 9. `src/sim/custodySwarm.ts` (new)

Sibling to `world.ts` — **do not** edit the 10 legacy scenario loops or canonical metrics JSON. Reuse `createSeededRng`, `selectCustodyBuckets`, `selectEthyPexPeers`, `assembleRootBranch`.

CI scenarios (seed `1`, double-run deep-equal):

1. **`custody-1hop-reachability`** — N=32, custody 2, max 18 peers → all nodes `hopBuckets === 16`, `minRedundancy >= 2`, `snapDials === 0`.
2. **`custody-zero-snap-cold-reads`** — 500 deterministic cross-bucket queries/node → ETHY witness/chunk only, `snapDials === 0`.
3. **`custody-root-assembly-and-refresh`** — N=16, 2 Byzantine forged `h_b` peers → honest nodes verify `RootNode`, quarantine, macro refresh, `snapDials === 0`.

Wire in `test/swarmSimulator.spec.ts` and `scripts/sim-swarm.ts` as an extra section; leave `assertV2ScenarioGates` paths untouched.

### 2.4 Tests & gates

| Suite | Files |
| --- | --- |
| Coverage | `test/custodyCoverage.spec.ts` |
| Machine | extend `test/machineOrchestrator.spec.ts` |
| Cockpit | string/unit snapshots for custody rows |
| Microscopes | `diagnose` / `machineTools` mount tests |
| Sim | `custodySwarm` + harness spec |
| devp2p | mask-change PEX re-query |

Finish: `npm run tsc` (`ethy` + `devp2p` if touched), `npm test` in `ethy`, `npm run spellcheck`.

### 2.5 Commit split

1. **`@ethereumjs/devp2p`** PEX re-query on profile change (D-008).
2. **`packages/ethy`** custody coverage + machine + coordinator.
3. **`packages/ethy`** cockpit + spine + tools + resolver counters.
4. **`packages/ethy`** `custodySwarm` + CI wiring.

**Out of scope:** WP-16h (RPC/ENS/Plaza), new message codes, editing WP-11 scenario worlds or `BinaryPathMPT` fixtures.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5 · Review & Hardening — Coordinator)

- **`custodySwarm.ts` + `scripts/sim-swarm.ts`:** Non-tautological discrete-event custody swarm gates using real `selectCustodyBuckets(nodeId, 2)`, bucket-aware `ETHY_PEX` convergence with strict `maxPeers <= 18` and Law-1 `pickRedundantEthyPeerToRotate`, real 1-hop cold-read routing across `32 × 500` queries with `0` `snap/1` dials, and real `assembleRootBranch` Byzantine quarantine across 2 macro-generations (`N = 16`, 2 Byzantine peers). Wired into both `test/swarmSimulator.spec.ts` and `scripts/sim-swarm.ts`.
- **Machine & Coordinator:** Boot no longer pins PEX to assigned buckets; `reconcileMachine` owns `desiredEthyBucketsMask`, returns `serving` / `ethy: active` on closed `--custody 2` nodes, rotates at most one redundant ETHY peer at `maxPeers` (Law 1), and publishes `subtreeApplyMs`, `custodyLastAssembly`, `custodyAssemblyLog`, and `custodyBucketSyncPct` onto `spine`.
- **Cockpit & Microscopes:** 3-Box Cockpit renders honest `Rolling BALs`, `Custody 1/2 (#2 62%)`, `Flat` vs `Trie ✓`, `Full Backfill N/16 (P%)`, `Full 16/16 (Private)`, `5`-plane row including `cl`, and clean `Served` spacing. `/ethy` (`ethyOverviewWidget`) renders the full 16-bucket custody matrix (`Local state`, `Acc·Code·Stor`, `1-hop swarm`, `🔒 Private` vs `1-hop`), custody preface, swarm summary `secondaryTable`, and `Ctrl+D` debug page (`Connected ETHY/0 peers`, `Root assembly log`, `Shadow refresh`).
- **devp2p (`D-008`):** `setNetworkProfile` re-broadcasts incrementing-`reqId` `GET_ETHY_PEERS` when `desiredEthyBucketsMask` changes to a non-zero mask, verified end-to-end in `test/worker/ethy-custody-swarm.spec.ts`.
