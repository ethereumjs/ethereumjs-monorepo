# WP-02: Live `devp2p` Harness, Sepolia Amsterdam Config & Fresh Pivot Header Acquisition

- **Status:** `BLOCKED_BY_WP-01`
- **Dependencies:** `WP-01`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Connect `@ethereumjs/ethy` to the live Ethereum P2P network (`sepolia` by default, any `@ethereumjs/common` chain supported) via `@ethereumjs/devp2p`, verify/update Sepolia's Amsterdam hardfork and bootstrap configuration in `@ethereumjs/common`, enforce the "Good Citizen" P2P contract (sub-millisecond empty replies + honest `BLOCK_RANGE_UPDATE`), and automatically acquire a **fresh pivot block header (`stateRoot` + `blockNumber`)** from the best connected `eth` peer so `snap/1` in `WP-03` always operates inside the 128-block `snapAvailabilityDepth` window — with **zero Beacon Node required**.

### Key Deliverables

1. **Upstream Audit & Maintenance (Tracked in `PROGRESS.md` Touch Queue):**
   - **`@ethereumjs/common` (`packages/common/src/chains.ts`):**
     - Check `Sepolia` (and `Hoodi` if relevant) hardfork schedule for `amsterdam` activation timestamp / `forkHash` and working bootstrap/DNS nodes so EIP-2124 `forkId` validation succeeds with live peers.
     - Keep this change minimal, backwards-compatible, and recorded in `PROGRESS.md` for a separate upstream library commit.
   - **`@ethereumjs/devp2p` (`packages/devp2p/src/protocol/snap.ts`):**
     - Inspect `SNAP._handleMessage` vs `SNAP.sendMessage`: `sendMessage` compresses with `snappy.compress(payload)` when `protocolVersion >= 5`, whereas `_handleMessage` currently calls `RLP.decode(data)` directly without `snappy.uncompress(data)`! Verify how `RLPx`/`Peer` vs `ETH._handleMessage` handles Snappy framing and make `SNAP._handleMessage` symmetric so real `snap/1` packets from Geth/Reth decode cleanly.

2. **Live P2P Coordinator (`src/net/`):**
   - `PeerCoordinator` wrapping `@ethereumjs/devp2p` (`DPT`, `DNS`, `RLPx`) negotiating `ETH.eth68`, `ETH.eth69`, `ETH.eth70`, `ETH.eth71`, and `SNAP.snap`.
   - Feeds live peer handshakes, client IDs (`peer['_hello']?.clientId`), negotiated capabilities, RTT latencies, and disconnects directly into `EthySpine.peers` and `EthySpine.diagnosticRingBuffer`.
   - Automatically flips `spine.capabilities.p2p` from `locked` → `partial` (connecting) → `ready` (when `>= 1` `eth`+`snap` capable peer is active).

3. **"Good Citizen" Wire Responder (`src/net/goodCitizen.ts`):**
   - On inbound `ETH` requests (`GET_BLOCK_HEADERS`, `GET_BLOCK_BODIES`, `GET_RECEIPTS`, `GET_BLOCK_ACCESS_LISTS`, `GET_NODE_DATA`) or `SNAP` requests that Ethy cannot serve: immediately (<1ms) send a valid empty RLP response (`[reqId, []]`) preserving the peer's `reqId`.
   - On `eth/69+` peers: send an honest `BLOCK_RANGE_UPDATE` advertising our actual available rolling window (or `[0, 0, ZERO_HASH]` before head sync).

4. **Fresh Pivot Header Acquisition (Stage-1 Zero-CL Bootstrap):**
   - Upon completing `ETH` `STATUS` with a peer, read `bestHash` / `latestBlockHash` (or highest announced block) and send `GET_BLOCK_HEADERS` (1 header, reverse=0, skip=0).
   - Decode the returned `@ethereumjs/block` `BlockHeader`, validate basic header sanity, and set `spine.pivotBlockNumber = header.number` and `spine.pivotStateRoot = header.stateRoot`.
   - If the pivot becomes older than ~96 blocks while syncing, provide a clean method `refreshPivotHeader()` to re-anchor to a fresh `stateRoot` within the 128-block `snap/1` availability window.

5. **TUI & Tool Integration:**
   - Enhance `diagnoseSnapAndPeers` and add `inspectNetworkTraffic` so `/peers` and natural-language queries in Zone 2 show live client diversity (Geth, Reth, Nethermind, Besu), negotiated protocol versions (`eth/70`, `eth/71`, `snap/1`), and the acquired Pivot Block `#` + `stateRoot`.

6. **Deterministic CI Tests (`test/net.spec.ts`):**
   - Use an in-process mock `Peer` / `Protocol` harness (or `packages/devp2p/src/lab/inProcessMesh.ts` patterns) to test:
     - `STATUS` handshake → `GET_BLOCK_HEADERS` → `spine.pivotStateRoot` acquisition.
     - Sub-millisecond empty RLP replies on unsupported inbound requests with `reqId` preserved.
     - `SNAP` Snappy compress/decompress round-trip.

### Acceptance Criteria
- [ ] `SNAP._handleMessage` in `@ethereumjs/devp2p` properly handles Snappy-compressed `snap/1` frames from `protocolVersion >= 5` peers.
- [ ] All unit tests in `packages/ethy` and `packages/devp2p` pass offline in CI (`npm test`, `npm run tsc`, `npm run spellcheck`).
- [ ] Running `ethy sepolia` connects to live Sepolia peers, populates `EthySpine.peers`, acquires a live `pivotBlockNumber` + `pivotStateRoot`, and displays them in Zone 1 & Zone 2 without a single line of stdout log spam.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
