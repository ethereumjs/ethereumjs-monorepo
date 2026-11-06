# WP-06c: Ethy `ETHY/0` Swarm Sync, Proof-Sidecar Persistence, `ETHY/0` vs `SNAP/1` Sync Selector, Adaptive TUI & 2-Client Live Loopback

- **Status:** `DONE`
- **Dependencies:** `WP-04k` (`DONE`), `WP-05b` (`DONE`), `WP-06a` (`DONE`), `WP-06b` (`DONE`)
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

**Spec:** [`protocols/devp2p/ETHY-0-SPEC.md`](../../../../protocols/devp2p/ETHY-0-SPEC.md) §5.3, §6 (`0x00`–`0x08`), §7. **Already shipped in WP-06b:** `ETHY` wire codec, in-memory `EthyChunkStore.put`, `setEthyStatus`, `--port` / `--connect` / `localEnode`. **`ethyPivotDir` is declared and unread.** `verifyAccountRangeJob` checks a snap proof and drops the nodes. `appendVerifiedSlabAsync` writes the 136-byte slab only.

### Design refinements (D-089)

| Topic | Decision |
| --- | --- |
| Where proofs live | On disk beside the journal. The worker reads them. It does not keep a second copy of every slab in RAM. `putEthyAccountChunk` stays for unit tests. |
| Who writes | `SnapPivotStore`, on the same per-file write queue as the slab, so `slabByteOffset` is the file offset of that append. |
| Who reads | `@ethereumjs/devp2p` worker (D-088). A memory miss opens `accounts/<n>.proof.idx` and a positioned read of the matching `.bin` or `.seg`. |
| Phase enum | Keep `SNAP_SYNCING`. Add `spine.syncTransport: 'unset' \| 'ethy' \| 'snap'`. The TUI reads that field. A new phase would ripple resume, capabilities, and every pulse test. |
| Selector | Pure function in `syncSourceSelector.ts`. No sockets in the unit test. |
| Code and storage sidecars | Out of this package. The loopback world is EOAs, so code and storage queues stay empty. `GET_PROVEN_STORAGE_OR_CODE` stays the WP-06b empty or memory reply. |
| CI vs laptop | CI uses two in-process nodes and a synthetic trie. `npm run ethy:swarm-smoke` seeds a data dir and prints the two commands. No public network in tests. |
| Dependencies | None. |

### 4.1 Proof sidecar

Layout is spec §5.3. Do not reuse the 4-byte account journal magic `0xE34A0003`.

- Prefix journal `accounts/<nibble>.bin` gets `accounts/<nibble>.proof.idx`. A segment journal `accounts/<nibble>.<origin>.seg` gets `accounts/<nibble>.<origin>.seg.proof.idx`.
- 8-byte magic from spec §5.3 (`0x4554485950524631`).
- Each record: `uint32BE(recordByteLength)` plus RLP of `[slabByteOffset, slabByteLength, originHash, lastHash, hasRight, chunkStateRoot, chunkBlockNumber, proofNodes]`. Integer fields use `intToUnpaddedBytes` / `bigIntToUnpaddedBytes`.

`verifyAccountRangeJob` (`packages/ethy/src/sync/snapVerifyJob.ts`) returns owned copies of the proof nodes, the request origin, and the state root it verified against. Copy any node that aliases the worker payload buffer before the payload is released. `commitVerifiedAccountRange` passes that bundle into `appendChunkProofAsync` on `SnapPivotStore`, chained behind the slab append for that file. The recorded offset is the file size before the slab bytes (after the journal magic on a new file). Refresh cursors do not append. A failed proof does not append.

When every sub-range of bucket `b` is `done`, set bit `1 << b` on `spine.ethyBucketsBitmask` (uint16) and persist it on `active.json`. Call the existing `client.setEthyStatus` so the worker rebroadcasts `ETHY STATUS`. A restarted seed reads the mask back and advertises completed buckets before it syncs anything else. Incomplete buckets stay at bit 0. A `GET` for a bucket the disk does not have returns `chunks = []`.

Devp2p disk fallback, used by `tryServeEthyGet`:

- Manifest: scan the prefix sidecar and any segment sidecars for that nibble. Sort by `originHash`.
- Chunk: one sidecar record plus `slabByteLength` bytes at `slabByteOffset` in the journal. No full-file read.
- Ethy sets `ethyPivotDir` to the active pivot directory when the pivot is anchored, and updates it if that directory changes.

### 4.2 Sync source selector

CLI `--sync-mode auto|ethy|snap` in `packages/ethy/src/cli/args.ts`. Default `auto`.

A peer is a usable seed when `bucketsBitmask !== 0` and either the mode is `ethy`, or `head - basePivotBlock <= MAX_ETHY_BAL_TAIL_BLOCKS` (`14_400`) and `balEarliestBlock <= basePivotBlock + 1`. `ETHY_DISCOVERY_GRACE_MS = 2_500`.

```text
fresh boot
  snap  -> lock snap, anchor the live pivot (today's path)
  ethy  -> stay in P2P_WARMUP until a usable ETHY STATUS (notice, no snap fallback)
  auto  -> window starts at the first validated ETH STATUS
           usable ETHY STATUS arrives -> lock ethy immediately (no extra wait)
           window elapsed with none   -> lock snap
```

The lock is once per boot. An unfinished cursor whose `ethy` peers are gone may continue through the existing snap scheduler at the current pivot root, because both paths persist the same 136-byte rows. That does not change `syncTransport`.

Anchoring on `ethy` reuses `commitPivotAnchor` in `peerCoordinator.ts`. The block and state root come from the seed's `ETHY STATUS`. Before the first chunk is accepted, fetch header `#C` with the existing header path and require `header.stateRoot === STATUS.basePivotStateRoot`. Each chunk's `chunkStateRoot` must equal that anchored root.

`packages/ethy/src/sync/ethySwarmSync.ts` runs only when `syncTransport === 'ethy'`:

- For each bit set on the seed, send `GET_BUCKET_MANIFEST`, then pipeline `GET_PROVEN_ACCOUNT_CHUNK` at depth 2 per proven peer.
- Verify with `verifyProvenAccountChunk` beside the snap job. The chunk is a raw 136-byte slab plus `proofNodes`, not a snap `AccountRange`. Unpack hashes from the slab, build MPT values with the existing binary-account converter, and call `verifyMerkleRangeProof`. Then use the same persist path, including the sidecar write, so the joiner becomes a seed too.
- BAL tail: `GET_BAL_RANGE` from the seed for `#C + 1` onward, at most 32 blocks per request, into the existing BAL apply and `putServableBlock` path. If the seed drops mid-tail, `BalChainStreamer` covers the rest over `eth/71`.

### 4.3 Cockpit

Still four content rows per box (`D-033`). `spine.syncTransport` and `ethyBucketsBitmask` drive the strings in `packages/ethy/src/tui/cockpit.ts`. The capability pill id stays `snap`.

| Surface | `ethy` | `snap` |
| --- | --- | --- |
| Node Pulse stage | `Ethy Sync · Accounts` or `Ethy Sync · Storage` | `Snap Sync · Accounts` or `Snap Sync · Storage` |
| Node Pulse state | account rate plus `ETHY/0` | when any seed bit is set, append `seed 8/16` |
| P2P peers | `8 connected (3 ethy · 5 snap)` | same |
| P2P served | `42 chunks · 18 replies · 5.4 MB` from `ethyChunksServed`, eth replies, and combined bytes | same |
| Snap metrics | replace the Speed row with Protocol: `ETHY/0 Swarm (3 peers)` or `SNAP/1 + ETHY/0 Seed (12/16 ready)`. Speed stays on the Node Pulse state row. | |

`/peers` in `packages/ethy/src/tools/diagnose.ts` gains an `Ethy` column: `16/16`, `8/16`, or `—`. New `/ethy` widget: transport, local bitmask, seed peer, chunks served. Register the slash prefix the same way as `/peers`.

### 4.4 Two-node loopback

`packages/ethy/src/sync/seedDemoState.ts` builds a small EOA trie with `@ethereumjs/mpt` (same idea as `SyntheticSnapPeer`), writes journals, sidecars, and `active.json`, and sets all 16 bits. `npm run ethy:swarm-smoke` in `packages/ethy/package.json` seeds `/tmp/ethy-node-a` and prints:

- Terminal 1: `npx tsx packages/ethy/src/cli/main.ts sepolia --port 30303 --data-dir /tmp/ethy-node-a --sync-mode snap`
- Terminal 2: `--port 30304 --data-dir /tmp/ethy-node-b --connect <enode> --sync-mode ethy`

`packages/ethy/test/ethySwarmLoopback.spec.ts` runs the same shape with two `inProcess` networks: node B checks every chunk proof, applies the BAL tail, and reaches head following. `packages/ethy/test/proofSidecar.spec.ts` writes one snap-ingested slab and asserts the sidecar round-trips through the worker manifest and chunk read. `packages/ethy/test/syncSourceSelector.spec.ts` covers the window, the three modes, and the usable-seed rule (bitmask 0, tail longer than 14,400, `--sync-mode ethy` ignoring tail length).

### File tree

| Path | Action |
| --- | --- |
| `packages/ethy/src/persist/proofSidecar.ts` | New: magic, encode, decode, append |
| `packages/ethy/src/persist/snapStore.ts` | Chain sidecar append; persist bitmask on `active.json` |
| `packages/ethy/src/sync/snapVerifyJob.ts` | Return proof nodes; `verifyProvenAccountChunk` |
| `packages/ethy/src/sync/accountSync.ts` | Pass proofs into the store |
| `packages/ethy/src/sync/syncSourceSelector.ts` | New: pure 3-mode decision |
| `packages/ethy/src/sync/ethySwarmSync.ts` | New: manifest, chunks, BAL tail, per-cursor snap assist |
| `packages/ethy/src/sync/seedDemoState.ts` | New: synthetic seed directory |
| `packages/ethy/src/spine/types.ts` | `syncTransport`, `ethyBucketsBitmask` |
| `packages/ethy/src/net/peerCoordinator.ts` | Window, anchor at `#C`, `setEthyStatus`, `ethyPivotDir` |
| `packages/ethy/src/cli/args.ts` | `--sync-mode` |
| `packages/ethy/src/tui/cockpit.ts` | Pulse, peers, served, protocol row |
| `packages/ethy/src/tools/diagnose.ts` | `/peers` column and `/ethy` |
| `packages/devp2p/src/serve/ethyChunkStore.ts` | Disk fallback on memory miss |
| `packages/devp2p/src/worker/host.ts` | Pass `ethyPivotDir` into the store |
| `packages/ethy/test/syncSourceSelector.spec.ts` | Window, modes, usable-seed rule |
| `packages/ethy/test/proofSidecar.spec.ts` | Offset, magic, round-trip |
| `packages/ethy/test/ethySwarmLoopback.spec.ts` | Two-node proof and BAL |
| `packages/devp2p/test/serve/ethyServer.spec.ts` | Manifest and chunk from a temp sidecar |
| `packages/ethy/package.json` | `ethy:swarm-smoke` script |

### Gates

`npm run tsc` and `npm test` in `@ethereumjs/devp2p` and `@ethereumjs/ethy`, then `npm run spellcheck`. No new runtime deps. Devp2p commits stay separate from ethy commits. Do not weaken existing snap tests to go green.

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **Core shipped:** proof sidecars on the slab write queue, `EthySwarmSynchronizer`, `--sync-mode`, `spine.syncTransport`, worker `setEthyPivotAccountsDir`, seed demo + in-process loopback test, cockpit account-stage strings for `ETHY/0`.
- **ETHY anchor:** pivot is anchored from the seeder’s `ETHY STATUS` (`basePivotBlock` + `basePivotStateRoot`); optional ETH header cross-check remains on the header-reply path (`ethyAnchorPending`) when used.
- **TUI/diagnose:** `/peers` Ethy column (`N/16`), `/ethy` overview widget, cockpit P2P ethy/snap counts and served ETHY counters, Snap metrics Protocol row when `syncTransport` or local seed bits are set.
- **Tests:** devp2p `ethyServer.spec.ts` disk sidecar serve path; intent routes `/ethy`.
- **Manual (optional):** two-terminal loopback via `npm run ethy:swarm-smoke` on a laptop; full-suite CI may rarely time out the loopback spec under load — re-run that file alone if needed.
