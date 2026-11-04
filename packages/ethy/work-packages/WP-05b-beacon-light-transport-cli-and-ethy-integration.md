# WP-05b: `@ethereumjs/beacon-light` Live Transport, Standalone CLI Pulse & Ethy Consensus-Verified Sync/Head Integration

- **Status:** `DONE`
- **Dependencies:** `WP-04k`, `WP-05a`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Bring **`@ethereumjs/beacon-light`** to life on the network and inside **`@ethereumjs/ethy`**:
1. Add the **multi-provider untrusted REST/SSE transport (`BeaconLightTransport`)** and **on-disk `SyncCommittee` store** so `@ethereumjs/beacon-light` can sync from any Beacon API endpoint (or rotate across community endpoints automatically) without re-bootstrapping on restart.
2. Ship a **standalone interactive CLI (`npx @ethereumjs/beacon-light [network]`)** inside `packages/beacon-light` so any developer or user can run it in 1 second and **feel** live 12-second Ethereum slots, BLS12-381 Sync Committee participation (`e.g. 496/512 validators · 96.8%`), finality progression, and verified Execution Layer state roots in real time.
3. Integrate `@ethereumjs/beacon-light` into **`@ethereumjs/ethy`** so that `snap/1` pivot roots and `HEAD_FOLLOWING` blocks are cross-verified against Ethereum's validator set (turning `devp2p` peers into untrusted data mules), with graceful fallback when offline and rich visibility in the TUI (`HEAD Metrics` + `/cl` command).

---

### Key Deliverables (`WP-05b`)

1. **Multi-Provider Untrusted REST Transport & Checkpoint Persistence (`packages/beacon-light/src/transport.ts` & `store.ts`):**
   - **Untrusted HTTP/JSON-Spec Client (`BeaconLightTransport`):**
     - Uses Node 22's built-in `fetch()` (zero dependencies) with per-request timeout and automatic endpoint rotation/failover across `common.chainConfig().beaconLightClient.defaultEndpoints` (plus user-supplied `--beacon-url` override).
     - Fetches standard Ethereum Beacon API light-client routes (`Accept: application/json`):
       - `GET /eth/v1/beacon/light_client/bootstrap/{block_root}`
       - `GET /eth/v1/beacon/light_client/updates?start_period={p}&count={n}`
       - `GET /eth/v1/beacon/light_client/finality_update`
       - `GET /eth/v1/beacon/light_client/optimistic_update`
       - **Zero-Config Bootstrap Root Discovery:** When no `--checkpoint` / `defaultCheckpointRoot` is provided and no local committee cache exists on disk, fetch `/eth/v1/beacon/light_client/finality_update`, compute `blockRoot = bytesToHex(hashTreeRootBeaconBlockHeader(finalizedHeader.beacon, sha256))`, and fetch `/eth/v1/beacon/light_client/bootstrap/{blockRoot}`!
       - **Wire JSON Parser (`parseLightClientHeaderJson`, etc.):** Support both Capella..Osaka `header.execution` (`ExecutionPayloadHeaderSummary`) and Amsterdam ePBS `header.execution_block_hash` (`executionBlockHash: hexToBytes(header.execution_block_hash)`).
   - **On-Disk Committee & Finality Cache (`BeaconLightStore`):**
     - Saves `{ period, currentSyncCommittee, nextSyncCommittee, finalizedHeader, optimisticHeader }` atomically to disk (`~/.ethy/networks/<net>/cl/light-client.json` or caller path).
     - On restart within the same 27-hour period (or next period), `BeaconLightClient` resumes immediately from its cached `SyncCommittee` without needing a `bootstrap` call!

2. **Standalone Live CLI in `@ethereumjs/beacon-light` (`packages/beacon-light/bin/beacon-light.cjs` & `src/cli/`):**
   - Add `"bin": { "beacon-light": "./bin/beacon-light.cjs" }` and `"scripts": { "cli": "tsx src/cli/main.ts" }` to `packages/beacon-light/package.json`.
   - Zero-config invocation:
     - `npx @ethereumjs/beacon-light` (defaults to `sepolia` or `mainnet`)
     - `npx @ethereumjs/beacon-light sepolia [--beacon-url <url>] [--checkpoint <root>] [--once] [--demo]`
   - **Live Terminal Experience ("Feel the Consensus Heartbeat"):**
     - Clean, crisp ANSI status header + live slot ticker that updates every 12 seconds as new `optimistic_update` and `finality_update` payloads arrive and pass BLS12-381 verification:
       - Shows **Period & Sync Committee** (`Period #1,472 · 512 keys cached`),
       - Shows **Every 12s Slot Tick** (`Slot 12,062,144 · BLS Verified 498/512 (97.3%) in 4.1ms`),
       - Shows **Optimistic Execution Head** (`EL #12,062,090 · 0x8f3a…c912 · stateRoot 0x41b2…90e1`),
       - Shows **Finalized Execution Head** (`Finalized EL #12,062,026 (-64 blk) · Epoch 376,940`),
       - Supports `--demo` (deterministic synthetic slot stream for instant offline preview) and `--once` (verifies one bootstrap + finality/optimistic update and exits 0 with JSON/human summary).

3. **Ethy Consensus Verification & `/cl` Microscope Integration (`packages/ethy/`):**
   - Add `@ethereumjs/beacon-light`: `10.1.3` to `packages/ethy/package.json` dependencies.
   - **Consensus-Verified Pivot & Head Anchor (`src/cl/consensusTracker.ts` & `peerCoordinator.ts`):**
     - Starts `BeaconLightClient` in the background alongside `PeerCoordinator`.
     - When `BeaconLightClient` has a BLS-verified `optimisticExecution` or `finalizedExecution` header:
       - Exposes `spine.clStatus` (`'verified' | 'syncing' | 'p2p_only' | 'mismatch'`), `spine.clFinalizedBlockNumber`, `spine.clOptimisticBlockNumber`, `spine.clParticipationPct`, and `spine.clPeriod`.
       - Cross-checks `spine.pivotStateRoot` / `spine.headStateRoot` against the validator-signed execution header when heights match (or anchors/steps pivots directly to CL-verified block hashes!), posting a `NoticeBoard` confirmation (`"CL verified head #12,062,090 (498/512 BLS)"`) or raising a high-severity `cl` diagnostic alert if a `devp2p` peer ever serves a conflicting block hash at a verified height!
     - **Graceful Degradation:** If all Beacon REST endpoints are offline/unreachable (e.g. air-gapped test or firewall), Ethy continues syncing normally via `devp2p` with `CL: P2P-only`.
   - **TUI & `/cl` Microscope (`cockpit.ts` & `src/tools/clTools.ts`):**
     - In `HEAD Metrics` (`cockpit.ts`), surface CL finality & BLS verification status (`Finalized #12,062,026 · 97% BLS`).
     - Add `/cl` slash command (and natural-language routing in `DeterministicIntentEngine`) rendering a Zone 2 `key_value` / `table` widget with Sync Committee period, BLS participation bitmask summary, Optimistic vs. Finalized Execution Payload roots, and active endpoint health.

4. **Tier-1 Unit & Integration Tests (`packages/beacon-light/test/` & `packages/ethy/test/clSync.spec.ts`):**
   - Tests `BeaconLightTransport` failover across mock `fetch` endpoints and `BeaconLightStore` disk persistence/resume.
   - Tests the standalone CLI `--demo` and `--once` modes with mock `fetch`.
   - Tests Ethy + `@ethereumjs/beacon-light` integration: verifying that a BLS-verified execution header updates `spine.clFinalizedBlockNumber`, confirms matching `devp2p` headers, and flags a spoofed `devp2p` header at the same block number.

---

### Acceptance Criteria (`WP-05b`)
- [x] `npx tsx packages/beacon-light/src/cli/main.ts --demo` and live `sepolia` mode display live BLS-verified slot/finality updates.
- [x] `@ethereumjs/beacon-light` persists `SyncCommittee` state and resumes without re-bootstrapping on restart.
- [x] `@ethereumjs/ethy` integrates `@ethereumjs/beacon-light`, surfaces `Finalized` / `BLS` status in the TUI and `/cl` command, and degrades gracefully when offline.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/beacon-light` and `@ethereumjs/ethy` with 0 live network calls in CI.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

**Decision D-086.** WP-05a verifier stays the trust boundary. Transport JSON is untrusted until `bootstrap` / `applyUpdate` / `applyFinalityUpdate` / `applyOptimisticUpdate` accept it. No new third-party packages. `fetch` is the runtime global (Node 22). `node:fs` only in `store.ts` and `src/cli/` (Node entrypoints).

### Design locks (D-086)

| Lock | Choice |
| --- | --- |
| Updates | **Polling**, not SSE — `optimistic_update` ~ every `secondsPerSlot` (12s), `finality_update` ~ one epoch; `updates?start_period` after resume |
| Bootstrap discovery | No checkpoint and no store → `GET finality_update`, `blockRoot = hashTreeRootBeaconBlockHeader(finalized.beacon)`, `GET bootstrap/{blockRoot}`; `--checkpoint` / `defaultCheckpointRoot` skips discovery |
| Resume | `exportState()` / `importState()` on `BeaconLightClient`; `BeaconLightStore` JSON (hex bytes); corrupt file deleted → cold start; still pull `updates` from stored period |
| Ethy pivot | **No** `pivotBlockNumber` from CL — witness only: matching EL block number ⇒ hashes must match; mismatch → `spine.clStatus = 'mismatch'`; unreachable CL → `p2p_only` |
| Wire | Capella `execution` payload summary **or** Amsterdam `execution_block_hash`; branches / sync bits as hex lists / 64-byte bitvector |
| CI | Injected `fetch` only — no public beacon URLs |

### Slice 1 — wire parser and transport

- `wire.ts` — `parseLightClientHeaderJson`, bootstrap, update, finality, optimistic
- `transport.ts` — `BeaconLightTransport` (`fetchImpl`, `AbortSignal.timeout`, endpoint rotation from `common.beaconLightClient().defaultEndpoints` + optional override first)
- `test/transport.spec.ts` — failover, timeout, Capella + Amsterdam header JSON

### Slice 2 — disk store and client snapshot

- `store.ts` — `BeaconLightStore` load/save, temp+rename; `defaultLightClientPath(network)` → `~/.ethy/networks/<net>/cl/light-client.json`
- `test/store.spec.ts` — resume without second bootstrap
- Barrel exports + `config/public-api-snapshots/beacon-light.json`

### Slice 3 — CLI

- `src/cli/main.ts`, `bin/beacon-light.cjs`, `package.json` `bin` + `"cli": "tsx src/cli/main.ts"`
- Args: network (`sepolia` default), `--beacon-url`, `--checkpoint`, `--once`, `--demo` (offline, no `fetch`)
- Live mode: ANSI header, per-update ticker, `Ctrl+C` saves store
- `test/cli.spec.ts` — args + `--demo` in-process

### Slice 4 — Ethy

- `@ethereumjs/beacon-light` dependency on ethy
- `spine` CL fields + `consensusTracker.ts` beside `PeerCoordinator` (D-028 split)
- TUI HEAD metrics, `/cl` widget, `test/clSync.spec.ts` — verified head, mismatch, offline `p2p_only`

### Gates

`npm run tsc` + `npm run test:node` in `beacon-light` and `ethy`; `npm run spellcheck`; `node scripts/public-api-snapshot.spec.mjs`; CLI `--demo` exit 0.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
