# WP-02: Live Threaded `devp2p` Harness, Sepolia Amsterdam Config & Fresh Pivot Header Acquisition

- **Status:** `BLOCKED_BY_WP-01`
- **Dependencies:** `WP-00` (`DONE`), `WP-01`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Connect `@ethereumjs/ethy` to the live Ethereum P2P network (`sepolia` by default, any `@ethereumjs/common` chain supported) using the **Worker-Threaded `@ethereumjs/devp2p` runtime (`createThreadedNetwork`) shipped in `WP-00` (#4417)**, verify/update Sepolia's Amsterdam hardfork and bootstrap configuration in `@ethereumjs/common`, wire `setBlockRange` onto the worker's built-in Good Citizen responder, and automatically acquire a **fresh pivot block header (`stateRoot` + `blockNumber`)** from the best connected `eth` peer so `snap/1` in `WP-03` always operates inside the 128-block `snapAvailabilityDepth` window — with **zero Beacon Node required**.

### Key Deliverables

1. **Upstream `@ethereumjs/common` & `@ethereumjs/devp2p` Worker Polish (Tracked in `PROGRESS.md` Touch Queue):**
   - **`@ethereumjs/common` (`packages/common/src/chains.ts`):**
     - Check `Sepolia` (and `Hoodi` if relevant) hardfork schedule for `amsterdam` activation timestamp / `forkHash` and working bootstrap/DNS nodes so EIP-2124 `forkId` validation succeeds with live peers.
   - **`@ethereumjs/devp2p` (`packages/devp2p/src/worker/host.ts` & `protocol.ts`):**
     - `WP-00` already implemented worker-owned `STATUS`, `goodCitizen: true` (`emptyWireReply` inside the worker), and `setBlockRange` (`D-013`).
     - Two small additions in `Devp2pWorkerHost` so `WP-02` can bootstrap live Sepolia peers seamlessly:
       1. **Expose peer `STATUS` head info to the client:** Currently `peer.subprotocolDispatch` in `host.ts:215` returns `'default'` for `ETH` `STATUS` (so `ETH._handleMessage` parses `_peerStatus`), which means the main thread doesn't yet receive the peer's `bestHash` / `latestBlockHash` or `latestBlock`. Expose `bestHash` / `latestBlockHash` and `latestBlock` on `WorkerPeerSnapshot` (or emit a `peer:status` event from `Devp2pWorkerHost`) once `eth` status completes.
       2. **Enable `DPT` bootnodes & DNS discovery defaults from `Common`:** When `bootnodes` / `dnsNetworks` are not manually passed in `ThreadedNetworkInitOptions`, allow `Devp2pWorkerHost._start()` to default to `common.bootstrapNodes()` and `common.dnsNetworks()` (`shouldGetDnsPeers: true`) so `createThreadedNetwork({ chain: 'sepolia', ... })` automatically discovers live peers out of the box.

2. **Live Threaded P2P Coordinator (`src/net/`):**
   - `PeerCoordinator` consuming `createThreadedNetwork(options, resolveThreadedNetworkModuleUrl(import.meta.url))` from `@ethereumjs/devp2p` (`WP-00`).
   - Maps `WorkerTelemetrySnapshot` (`peers: WorkerPeerSnapshot[]`, `diagnostics: WorkerDiagnosticEntry[]`) directly into `EthySpine.peers` (`PeerTelemetry`, mapping `clientId` → `clientName` and `rttMs` → `avgLatencyMs`) and `EthySpine.diagnosticRingBuffer`.
   - Automatically flips `spine.capabilities.p2p` from `locked` → `partial` (connecting) → `ready` (when `>= 1` `eth`+`snap` capable peer is active).

3. **Worker Good Citizen & Block Range Wiring:**
   - Leverage `Devp2pWorkerHost`'s built-in `goodCitizen: true` mode (`D-013`, which already answers unsupported inbound `GET_*` requests in `<1ms` inside the worker without waking the main thread).
   - Call `workerClient.setBlockRange(earliest, latest, latestHash)` whenever Ethy's available block window updates.

4. **Fresh Pivot Header Acquisition (Stage-1 Zero-CL Bootstrap):**
   - When a peer completes `ETH` `STATUS` and reports its `bestHash` / `latestBlockHash` (via the updated `WorkerPeerSnapshot` or status event), send `GET_BLOCK_HEADERS` via `workerClient.sendEthMessage(peerId, EthMessageCodes.GET_BLOCK_HEADERS, rlpPayload)` (1 header, reverse=0, skip=0).
   - Receive the `BLOCK_HEADERS` response on `workerClient.events.on('protocol', ...)`, decode the `@ethereumjs/block` `BlockHeader`, validate basic header sanity, and set `spine.pivotBlockNumber = header.number` and `spine.pivotStateRoot = header.stateRoot`.
   - If the pivot becomes older than ~96 blocks while syncing, provide a clean method `refreshPivotHeader()` to re-anchor to a fresh `stateRoot` within the 128-block `snap/1` availability window.

5. **TUI & Tool Integration:**
   - Enhance `diagnoseSnapAndPeers` and add `inspectNetworkTraffic` so `/peers` and natural-language queries in Zone 2 show live client diversity (Geth, Reth, Nethermind, Besu), negotiated protocol versions (`eth/70`, `eth/71`, `snap/1`), and the acquired Pivot Block `#` + `stateRoot`.

6. **Deterministic CI Tests (`test/net.spec.ts`):**
   - Use `createThreadedNetwork({ inProcess: true, ... })` from `@ethereumjs/devp2p` to test:
     - `STATUS` handshake → `bestHash` discovery → `GET_BLOCK_HEADERS` → `spine.pivotStateRoot` acquisition.
     - `WorkerTelemetrySnapshot` mapping into `EthySpine.peers` and `EthySpine.diagnosticRingBuffer`.

### Acceptance Criteria
- [ ] All unit tests in `packages/ethy` and `packages/devp2p` pass offline in CI (`npm test`, `npm run tsc`, `npm run spellcheck`).
- [ ] Running `ethy sepolia` spawns the `@ethereumjs/devp2p` worker thread, connects to live Sepolia peers, populates `EthySpine.peers`, acquires a live `pivotBlockNumber` + `pivotStateRoot`, and displays them in Zone 1 & Zone 2 without a single line of stdout log spam.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
