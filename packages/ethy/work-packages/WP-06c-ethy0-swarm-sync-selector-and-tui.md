# WP-06c: Ethy `ETHY/0` Swarm Sync, Proof-Sidecar Persistence, `ETHY/0` vs `SNAP/1` Sync Selector, Adaptive TUI & 2-Client Live Loopback

- **Status:** `BLOCKED_BY_WP-06b`
- **Dependencies:** `WP-04k` (`DONE`), `WP-05b` (`DONE`), `WP-06a`, `WP-06b`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Wire **`ETHY/0`** end-to-end into **`@ethereumjs/ethy`** so that:
1. Every Ethy node persists a compact **Merkle boundary proof sidecar (`<nibble>.proof.idx`)** alongside its flat `BinaryAccount` journals during `snap/1` or `ethy/0` sync (`~1.5%` disk overhead), turning every synced (or partially synced!) bucket into a **self-proving `ETHY/0` seed**.
2. Ethy uses a **clean, deterministic Sync Source Selector (`ETHY/0` vs `SNAP/1`)** that prefers `ETHY/0` peers whenever a valid `ethy/0` snapshot with a bridgeable BAL tail is available, and falls back smoothly to `SNAP/1` without delaying local testing or single-node runs.
3. The **4-Zone Cockpit TUI adapts seamlessly between `SNAP` and `ETHY`**, giving `ETHY/0` first-class prominence in the capability pill, `Node Pulse` stage, `SNAP / ETHY Metrics` box, and `Served` counter!
4. We can **run two real Ethy clients side-by-side on the same laptop** (or LAN) and watch Client B sync its state and BAL tail directly from Client A over `ETHY/0`!

---

## 2. Key Engineering Designs & Invariants

### 2.1 Proof-Sidecar Persistence (`SnapPivotStore` — `accounts/<nibble>.proof.idx`)
- When `SnapAccountSynchronizer` (or `EthySwarmSynchronizer`) verifies an account range chunk `[origin .. lastKey]` against `flight.stateRoot` ($R_k$) at `flight.pivotBlockNumber` ($B_k$):
  - In addition to appending the `136 × N` byte `persistSlab` to `accounts/<nibble>.bin` (or `.seg`), `SnapPivotStore` appends a compact **Chunk Proof Record** to `accounts/<nibble>.proof.idx` (or `.seg.proof.idx`):
    - `{ slabByteOffset, slabByteLength, originHash, lastHash, hasRight, stateRoot: R_k, pivotBlockNumber: B_k, proofNodesRlp }`
  - Because `proofNodesRlp` is only ~3–5 KB per 128 KB slab (~1,000 accounts), the sidecar adds **< 3% disk space** and zero main-thread CPU cost!
  - Whenever all sub-ranges in bucket `b` (`0x0..0xf`) reach `status === 'done'`, Ethy sets bit `1 << b` in `spine.ethyBucketsBitmask` and updates its `ETHY/0 STATUS` advertisement in the worker so connected `ethy/0` peers can immediately pull bucket `b` from us (even while other buckets are still syncing!).

### 2.2 The `ETHY/0` vs `SNAP/1` Sync Selector (Simple, Deterministic Ruleset)
How does a booting Ethy node decide whether to sync via **`ETHY/0`** or **`SNAP/1`** without getting stuck or switching mid-flight?

1. **Explicit CLI Override (For Instant Local Testing & Debugging):**
   - `--sync-mode auto | ethy | snap` (default: `auto`).
   - When `--sync-mode ethy` is passed (e.g. when testing two local Ethy nodes on one laptop), Ethy waits exclusively for an `ethy/0` peer and syncs 100% via `ETHY/0`.
   - When `--sync-mode snap` is passed, Ethy syncs base state via `SNAP/1` (while still advertising and serving completed buckets on `ETHY/0`!).
2. **Default `auto` Mode Decision Window & Bucket-Level Compatibility:**
   - **Rule 1 (Zero Delay When Direct `--connect` Is Used):** If `--connect` dials an `ethy/0` peer, `ETHY/0 STATUS` arrives in `< 100ms`, so `ETHY/0` is selected immediately!
   - **Rule 2 (Short `ETHY/0` Grace Window on Public Network — `ETHY_DISCOVERY_GRACE_MS = 2_500ms`):**
     - After the first `ETH` peer connects (or immediately if an `ethy/0` peer is already in `peers.json`), if an `ethy/0` peer is connected and advertises a usable snapshot (`bucketsBitmask !== 0` and its snapshot block `#C` has a contiguous BAL path `#C + 1 .. #Head` within `MAX_ETHY_BAL_TAIL_BLOCKS = 14_400` blocks ≈ 48 hours), lock **`spine.syncTransport = 'ethy'`** and anchor at `#C`!
     - If no usable `ethy/0` peer appears within `2.5s` of the first `snap/1` peer becoming ready, lock **`spine.syncTransport = 'snap'`** and start `SNAP/1` at the live pivot `#P_0` with zero further waiting!
   - **Rule 3 (No Mid-Bucket Flip-Flopping, Plus Opportunistic `ETHY/0` Assist):**
     - Once a node anchors its base sync on **`ETHY/0`** (at snapshot `#C`), it downloads proven chunks from `ethy/0` peers and streams the BAL tail `#C + 1 .. #Head` via `GET_BAL_RANGE` / `BalChainStreamer`. If all `ethy/0` peers for an unfinished bucket disconnect and a `snap/1` peer is available, that unfinished cursor can seamlessly continue via `SNAP/1` at the current rolling pivot root because both `ETHY/0` and `SNAP/1` produce the exact same verified 136-byte `BinaryAccount` slabs!

### 2.3 Two-Fork-Adopting TUI Design (`SNAP` ↔ `ETHY` Prominence & Serving Visibility)
Because `ETHY/0` is our native swarm protocol, the TUI adapts dynamically to whichever sync transport is active (while always showing `ETHY/0` serving health):
1. **Top-Right Capability Bar & Domain Lens (`createSpine.ts`, `cockpit.ts`):**
   - The second capability pill remains the **State Sync domain (`snap` key)**, and in the 3-Box Cockpit:
     - **Left Box (`Node Pulse`):**
       - When syncing via `ETHY/0`:
         - `Stage`: `Ethy Sync · Accounts` (or `Ethy Sync · Storage`)
         - `Target`: `#12,060,000 · +48 BALs · 3 ethy peers`
         - `Progress`: `████████░░░░░░░░  52% (~4m)`
         - `State`: `54.2M acc · 142,000/s (ETHY/0)`
       - When syncing via `SNAP/1`:
         - Keeps `Snap Sync · Accounts` / `Snap Sync · Storage`, while adding `· ethy seed (8/16)` once buckets start becoming servable on `ETHY/0`!
     - **Right Box (`P2P Metrics` & `SNAP Metrics`):**
       - In **`P2P Metrics`**:
         - `Peers`: `8 connected (3 ethy · 5 snap)`
         - `Served`: `42 chunks · 18 replies · 5.4 MB` (combining `ETHY/0` chunk/BAL serving and `eth/71` rolling-window serving!)
       - In **`SNAP Metrics`** (when `Tab` selects the `SNAP` domain):
         - Shows `Protocol`: `ETHY/0 Swarm (3 peers)` or `SNAP/1 + ETHY/0 Seed (12/16 ready)`.
2. **`/peers` & `/ethy` Inspection:**
   - `/peers` table includes `ethy/0` capability and each peer's advertised `bucketsBitmask` (`16/16` or `8/16`).

### 2.4 Practical 2-Client Same-Laptop Live Test (`npm run ethy:loopback-demo` / CLI Workflow)
To make it effortless to test two real Ethy clients talking over `ETHY/0` on the same laptop:
1. Add a `--seed-demo-state` (or use a small synced/synthetic 16-bucket state dir) and a 1-command script `npm run ethy:swarm-smoke` in `packages/ethy/package.json` (plus step-by-step instructions for running two live TUI terminals side by side):
   - **Terminal 1 (Seeder Node A):**
     `npx tsx packages/ethy/src/cli/main.ts sepolia --port 30303 --data-dir /tmp/ethy-node-a`
     *(Displays its local enode in `/diag` or `/peers`, e.g. `enode://...@127.0.0.1:30303`)*
   - **Terminal 2 (Joiner Node B):**
     `npx tsx packages/ethy/src/cli/main.ts sepolia --port 30304 --data-dir /tmp/ethy-node-b --connect enode://...@127.0.0.1:30303 --sync-mode ethy`
   - Node B connects to Node A over local TCP RLPx, negotiates `ETHY/0`, receives `ETHY STATUS`, streams the proven account chunks + BAL tail from Node A at >150,000 acc/s, verifies every Merkle range proof and BAL hash locally, and flips into `★ Head Following · Live`!

---

## 3. Acceptance Criteria (`WP-06c`)

- [ ] `SnapPivotStore` records chunk boundary proofs (`<nibble>.proof.idx`) during `snap/1` and `ethy/0` ingestion and serves them via `ETHY/0` (`GET_BUCKET_MANIFEST` / `GET_PROVEN_ACCOUNT_CHUNK`).
- [ ] Sync Source Selector cleanly picks `ETHY/0` when a compatible `ethy/0` peer is connected (or `--sync-mode ethy`), and falls back to `SNAP/1` after `2.5s` when no `ethy/0` peer is present.
- [ ] Cockpit TUI adapts `Node Pulse` (`Ethy Sync · Accounts` vs `Snap Sync · Accounts`), `P2P Metrics` (`N ethy · M snap` and `Served` chunks), and `/peers`.
- [ ] Two real Ethy nodes on the same machine (`127.0.0.1:30303` and `127.0.0.1:30304`) complete a full `ETHY/0` state + BAL sync end-to-end with 100% cryptographic proof verification.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/devp2p` and `@ethereumjs/ethy`.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
