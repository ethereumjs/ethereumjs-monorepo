# WP-16e: `The Machine` 6th Plane (`staty`), Honest Two-Tier Cockpit UI, `/staty` & 3-Plane `/ethy` Microscopes & `ethy-sim` Swarm Gates

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-16c` (`READY_FOR_PLANNING`), `WP-16d` (`READY_FOR_PLANNING`), `WP-11a` (`DONE`), `WP-13` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Unify **`STATY/0`** and **`ETHY/0` `v0.3`** inside **`The Machine` (`SyncNetworkOrchestrator`, `WP-13`)**, surface honest two-tier state/privacy/serving telemetry in the **3-Box Cockpit TUI** and **`/staty` + `/ethy` + `/machine`** microscopes, and extend the deterministic **`ethy-sim` multi-client swarm simulator (`WP-11a`)** with CI stress gates proving `STATY/0` achieves amortized `O(1)` `snap/1` load at swarm scale.

---

### Key Deliverables (`WP-16e`)

1. **`The Machine` (`SyncNetworkOrchestrator`) 6th Subprotocol Plane (`staty`):**
   - Extend `PlaneId` in `packages/ethy/src/sync/machineOrchestrator.ts` from 5 planes (`eth`, `ethy`, `snap`, `discovery`, `cl`) to 6 planes (`eth`, `staty`, `ethy`, `snap`, `discovery`, `cl`).
   - Add `STATY/0`-native operating modes alongside existing `ETHY/0` modes:
     - `staty-bal-warmup` (pulling rolling `eth/71` BAL window, `snap` off/standby, `staty` active/discovering)
     - `staty-epoch-sync` (striping Hot Epoch Bundles + bytecodes over `STATY/0`)
     - `staty-live-calm` (steady-state `STATY/0` serving + `eth/71` BAL serving; **`snap1` dropped from `HELLO`** until an `O(1)` micro-epoch mint lottery fires or a brief cold-miss burst requires fallback!)
     - `staty-epoch-mint` (brief `O(1)` elected `snap/1` window for 1 micro-epoch, returning to `staty-live-calm` immediately on completion)
     - `hybrid-full-backfill` (`--full` mode: `STATY/0` live & serving while `ETHY/0` / `SNAP/1` completes 3-plane world state in background; drops `snap1` permanently once all 16 buckets close!)
   - Drive `devp2p`'s `NetworkProfile` cleanly with `minStatyPeers`, `statyDiscoveryTag` (advertised honestly once `>= 1` epoch or witness cache is servable), and `preferStatyDiscovery`.

2. **Honest 3-Box Cockpit UI (`packages/ethy/src/tui/cockpit.ts` & `spine/types.ts`):**
   - **State Box (`Stage` & `State` lines):**
     - Default `STATY/0` mode:
       - Syncing: `STATY BALs 4.2k/8.2k` → `STATY Epochs 18/32 · code 12.4k`
       - Live: `★ Live · STATY Active (32 ep)` with concise working-set line (`18.4k code · 4.2k wit · 98% local`).
     - Hybrid `--full` mode:
       - Backfilling: `★ Live · Full Backfill 6/16 (38%)` (clearly signaling the node is **already live** via `STATY/0` while full state completes in background!).
       - Complete: `★ Live · Full 16/16 (Private)` (100% Closed-World read privacy).
   - **P2P Box (`Peers`, `Planes`, `Served` lines):**
     - Surface `STATY` + `ETHY` peer counts honestly (`6 conn (4 staty · 2 ethy)`).
     - Show all 6 planes on the `Planes` row (`eth ● · staty ● · ethy ◐ · snap ○ · disc ○ · cl ●`).
     - Show unified giving-back counters on the `Served` row (`BALs 1.2k · STATY 48 ep / 91 wit · ETHY 14 ch`).

3. **New `/staty` Microscope & Upgraded `/ethy` + `/machine` Views (`packages/ethy/src/tools/`):**
   - **`/staty` (`/s`):** Key-value + table widget showing:
     - Active mode (`STATY default` vs `Hybrid --full`), rolling BAL horizon (`localBalEarliestBlock .. #Head`), Macro-Day & `epochMask` coverage (`X / 32` micro-epochs).
     - Witness cache stats (`cached witnesses`, `disk usage / cap`, `local / tombstone / STATY / snap` resolution hit breakdown).
     - `O(1)` Micro-Epoch Minter status (`idle`, `armed (T-24s)`, `suppressed by peer`, or `minting epoch #...`).
     - Shared `code/` inventory & connected `STATY/0` peers table (`Ctrl+D` debug page).
   - **`/ethy` Upgrade:** Add the 3-plane 16-bucket matrix (`0x0..0xf`: `Acc` / `Code` / `Stor` / `Closed-World` privacy badge) so `--full` users can watch each 1/16th of Ethereum lock into 100% private Closed-World mode in real time.
   - Register `/staty` in `domains/toolRegistry.ts`, `commandAvailability.ts`, `/help`, and slash autocompletion.

4. **Multi-Client Swarm Simulator (`ethy-sim`) `STATY/0` Stress Gates (`packages/ethy/src/sim/`):**
   - Add 3 deterministic CI simulation scenarios extending `WP-11a`'s discrete-event simulator:
     1. **`staty-o1-epoch-mint` (`N = 50` nodes, `16` micro-epochs / 1 Macro-Day):** Assert average `snap/1` minters per micro-epoch `<= 2.5` (proving `O(1)` upstream `snap/1` load regardless of swarm size, zero thundering herd).
     2. **`staty-cold-miss-amplification` (`N = 50` nodes querying 20 shared cold contracts):** Assert `>= 90%` of cold queries are satisfied by `STATY/0 GET_WITNESSES` after the first peer fetches from `snap/1`.
     3. **`staty-flash-join` (`20` fresh nodes joining simultaneously against `2` seeders):** Assert all `20` nodes reach live verified state via rarest-first `EPOCH_PART` cross-seeding + `eth/71` BALs with zero `snap/1` fallback calls.

---

### Acceptance Criteria (`WP-16e`)
- [ ] `The Machine` cleanly orchestrates all 6 planes (`eth`, `staty`, `ethy`, `snap`, `discovery`, `cl`) with `snap1` kept dormant during `staty-live-calm` and `Full 16/16`.
- [ ] Cockpit TUI, `/staty`, `/ethy`, `/machine`, and `/help` accurately reflect `STATY/0` active state, hybrid `--full` progress, Closed-World privacy count, and combined serving metrics.
- [ ] All 3 new `ethy-sim` `STATY/0` CI swarm gates pass deterministically alongside the existing 10 `ETHY/0` scenarios.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5)*
