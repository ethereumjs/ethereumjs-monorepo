# WP-16g: `The Machine` Custody Orchestration, Honest Custody Cockpit UI, 16-Bucket `/ethy` Microscope & `ethy-sim` Custody Swarm Gates

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-16c` (`PLANNED`), `WP-16d`..`WP-16f` (`READY_FOR_PLANNING`), `WP-11a` (`DONE`), `WP-13` (`DONE`)
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
- [ ] `The Machine` cleanly orchestrates 5 planes (`eth`, `ethy`, `snap`, `discovery`, `cl`), steers bucket-diverse `ETHY_PEX` toward `16/16` 1-hop coverage, and drops `snap1` from `HELLO` in `custody-live-calm` and `Full 16/16`.
- [ ] 3-Box Cockpit and `/ethy` + `/machine` microscopes surface honest custody mode, 16-bucket local/swarm coverage, `RootNode` assembly, and zero-`snap` serving telemetry.
- [ ] All 3 `ethy-sim` custody swarm gates pass deterministically in CI alongside existing `WP-11a`/`WP-11b` gates.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 before implementation begins.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 upon completion.)*
